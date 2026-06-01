'use client'

import Image from 'next/image'
import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { AlertCircle, Camera, Loader2, Trash2, X } from 'lucide-react'
import { getMe } from '@/lib/marketplace'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Notice = { type: 'success' | 'error'; message: string } | null

type PendingEmail = {
  id: string
  email: string
}

export function ProfileEditClient() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const { user: clerkUser, isLoaded } = useUser()
  const [form, setForm] = useState({
    name: '',
    email: '',
    collegeName: '',
    mobileNumber: '',
    location: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initialEmail, setInitialEmail] = useState('')
  const [notice, setNotice] = useState<Notice>(null)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [verificationStep, setVerificationStep] = useState<'idle' | 'sending' | 'verifying'>('idle')
  const [verificationCode, setVerificationCode] = useState('')
  const [pendingEmail, setPendingEmail] = useState<PendingEmail | null>(null)
  const [pendingOtpEmail, setPendingOtpEmail] = useState<PendingEmail | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [clerkLoadingError, setClerkLoadingError] = useState<string | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [removeProfileImage, setRemoveProfileImage] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const user = await getMe(token ?? undefined)
        setForm({
          name: user.name ?? '',
          email: user.email ?? '',
          collegeName: user.collegeName ?? '',
          mobileNumber: user.mobileNumber ?? '',
          location: user.location ?? '',
          bio: user.bio ?? '',
        })
        setInitialEmail(user.email ?? '')
        setProfilePreview(user.profileImage ?? null)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [getToken])

  const updateBackendProfile = async (overrides?: { email?: string }) => {
    const token = await getToken()
    const data = new FormData()
    if (removeProfileImage) {
      data.append('removeProfileImage', 'true')
    }
    if (profileImageFile) {
      data.append('profileImage', profileImageFile)
    }
    data.append('name', form.name)
    data.append('email', overrides?.email ?? form.email)
    data.append('collegeName', form.collegeName)
    data.append('mobileNumber', form.mobileNumber)
    data.append('location', form.location)
    data.append('bio', form.bio)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/users/me`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: data,
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(result.message ?? 'Could not update profile')
    }
    window.dispatchEvent(new Event('profile-updated'))
  }

  const handleEmailVerification = async () => {
    if (!clerkUser || !pendingOtpEmail) return
    if (!verificationCode.trim()) {
      setNotice({ type: 'error', message: 'Enter the verification code sent to your email.' })
      return
    }

    setSaving(true)
    setVerificationStep('verifying')
    setNotice(null)
    try {
      console.log('email verification started')
      const emailAddress = (clerkUser as any).emailAddresses?.find((item: any) => item.id === pendingOtpEmail.id)
      if (!emailAddress) {
        throw new Error('Verification session expired. Please try again.')
      }

      const result = await emailAddress.attemptVerification({ code: verificationCode.trim() })
      if (result?.verification?.status !== 'verified' && result?.status !== 'verified') {
        throw new Error('Email verification failed.')
      }

      await (clerkUser as any).update({ primaryEmailAddressId: pendingOtpEmail.id })
      await (clerkUser as any).reload?.()
      await updateBackendProfile({ email: pendingOtpEmail.email })
      setForm((current) => ({ ...current, email: pendingOtpEmail.email }))
      setShowOtpVerification(false)
      setVerificationStep('idle')
      setPendingEmail(null)
      setPendingOtpEmail(null)
      setVerificationCode('')
      setNotice({ type: 'success', message: 'Email updated successfully.' })
    } catch (error) {
      setNotice({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Could not verify email. Please try again.',
      })
    } finally {
      setSaving(false)
      setVerificationStep('idle')
    }
  }

  const startEmailVerification = async (nextEmail: string) => {
    console.log('STEP 1: entered emailChanged branch')
    console.log({
      currentEmail: clerkUser?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() || '',
      nextEmail,
      emailChanged: (clerkUser?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() || '') !== nextEmail,
    })
    console.log('STEP 2: Clerk state', {
      isLoaded,
      hasUser: !!clerkUser,
    })

    if (!isLoaded || !clerkUser) {
      const message = 'Authentication still loading'
      console.log('BLOCKED: Clerk not ready')
      setClerkLoadingError(message)
      setNotice({ type: 'error', message })
      throw new Error(message)
    }

    console.log('STEP 3: passed Clerk state guard')
    console.log('user object:', clerkUser)
    console.log('createEmailAddress exists:', typeof (clerkUser as any)?.createEmailAddress)

    const currentEmail =
      clerkUser?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() || ''
    const nextNormalized = nextEmail?.trim().toLowerCase() || ''
    const emailChanged = currentEmail !== nextNormalized

    if (!emailChanged) {
      console.log('BLOCKED: email did not change')
      return false
    }

    const userEmailList = (clerkUser as any).emailAddresses ?? []
    const existingOnAccount = userEmailList.find(
      (item: any) => item.emailAddress?.toLowerCase?.() === nextEmail.toLowerCase()
    )
    if (existingOnAccount) {
      throw new Error('This email is already associated with another account')
    }

    let emailAddress: any
    try {
      console.log('STEP 2: createEmailAddress start')
      emailAddress = await (clerkUser as any).createEmailAddress({
        emailAddress: nextEmail,
      })
      console.log('STEP 3: createEmailAddress success')
    } catch (error) {
      console.error('CREATE EMAIL FAILED:', error)
      const message = error instanceof Error ? error.message : 'CREATE EMAIL FAILED'
      if (/already/i.test(message)) {
        throw new Error('This email is already associated with another account')
      }
      setRuntimeError(JSON.stringify(error, null, 2))
      throw new Error(message)
    }

    console.log('STEP 4: prepareVerification start')
    await emailAddress.prepareVerification({ strategy: 'email_code' })
    console.log('STEP 5: OTP prepared')
    setPendingEmail({ id: emailAddress.id, email: nextEmail })
    setPendingOtpEmail({ id: emailAddress.id, email: nextEmail })
    setShowOtpVerification(true)
    setVerificationStep('sending')
    setRuntimeError(null)
    console.log('STEP 6: OTP UI opened')
    setVerificationStep('idle')
    setVerificationCode('')
    setNotice({ type: 'success', message: 'We sent a verification code to your new email.' })
    return true
  }

  const handleResendCode = async () => {
    if (!pendingEmail || !clerkUser) return
    setSaving(true)
    setVerificationStep('sending')
    setNotice(null)
    try {
      const emailAddress = (clerkUser as any).emailAddresses?.find((item: any) => item.id === pendingEmail.id)
      if (!emailAddress) {
        throw new Error('Verification session expired. Please try again.')
      }
      await emailAddress.prepareVerification({ strategy: 'email_code' })
      console.log('OTP sent')
      setNotice({ type: 'success', message: 'Verification code resent.' })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not resend verification code.',
      })
    } finally {
      setSaving(false)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('submit handler started')
    setNotice(null)
    setRuntimeError(null)
    setClerkLoadingError(null)

    if (!isLoaded || !clerkUser) {
      const message = `Clerk not ready. isLoaded=${String(isLoaded)} userExists=${String(Boolean(clerkUser))}`
      setNotice({ type: 'error', message })
      setRuntimeError(message)
      console.log('BLOCKED: Clerk not ready')
      return
    }

    const currentEmail =
      clerkUser?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() || ''
    const nextEmail =
      form.email?.trim().toLowerCase() || ''
    const emailChanged = currentEmail !== nextEmail
    console.log({
      currentEmail,
      nextEmail,
      emailChanged,
    })
    if (nextEmail && !EMAIL_REGEX.test(nextEmail)) {
      setNotice({ type: 'error', message: 'Enter a valid email address.' })
      return
    }

    if (showOtpVerification) {
      await handleEmailVerification()
      return
    }

    if (emailChanged) {
      console.log('EMAIL FLOW')
      setSaving(true)
      setVerificationStep('sending')
      console.log('verify button clicked')
      try {
        await startEmailVerification(nextEmail)
        return
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not update profile.'
        setNotice({ type: 'error', message })
        setRuntimeError(message)
      } finally {
        setSaving(false)
      }
      return
    }

    console.log('STANDARD PROFILE UPDATE FLOW')
    setSaving(true)
    try {
      await saveProfileWithoutOtp()
      setNotice({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update profile.'
      setNotice({ type: 'error', message })
      setRuntimeError(message)
    } finally {
      setSaving(false)
    }
  }

  const saveProfileWithoutOtp = async () => {
    await updateBackendProfile()
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    setNotice(null)

    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/users/me`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation: 'DELETE' }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.message ?? 'Could not delete account')
      }
      setNotice({ type: 'success', message: 'Account deleted successfully.' })
      await signOut()
      router.replace('/sign-in')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete account.'
      setNotice({ type: 'error', message })
      setRuntimeError(message)
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  const currentEmail =
    clerkUser?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() || ''
  const nextEmailValue = form.email?.trim().toLowerCase() || ''
  const emailChangedForRender = currentEmail !== nextEmailValue

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {clerkLoadingError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {clerkLoadingError}
        </div>
      ) : null}
      {runtimeError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {runtimeError}
        </div>
      ) : null}
      {notice ? (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice.message}</p>
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Keep your public marketplace profile current.</p>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          {[ 
            ['name', 'Name'],
            ['email', 'Email'],
            ['collegeName', 'College'],
            ['mobileNumber', 'Mobile Number'],
            ['location', 'Location'],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <input
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
              />
            </label>
          ))}
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Profile Photo</span>
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white ring-1 ring-gray-200">
                {profilePreview ? (
                  <Image src={profilePreview} alt="Profile preview" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                    {form.name?.trim()?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
                  <Camera className="h-4 w-4" />
                  Upload / Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      const url = URL.createObjectURL(file)
                      setProfilePreview(url)
                      setProfileImageFile(file)
                      setRemoveProfileImage(false)
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setProfilePreview(null)
                    setProfileImageFile(null)
                    setRemoveProfileImage(true)
                  }}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Remove image
                </button>
              </div>
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              rows={5}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
            />
          </label>
          {showOtpVerification ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">Verify your new email</p>
              <p className="mt-1 text-sm text-gray-500">
                Enter the code sent to your email.
              </p>
              <div className="mt-4 flex gap-3">
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="6-digit OTP"
                  className="h-12 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-300"
                />
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={saving || verificationStep === 'verifying'}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {verificationStep === 'verifying' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={saving || verificationStep === 'sending'}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  {verificationStep === 'sending' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Resend code
                </button>
              </div>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            onClick={() => console.log('verify button clicked')}
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving && !showOtpVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving && emailChangedForRender
              ? 'Sending OTP...'
              : showOtpVerification || emailChangedForRender
                ? 'Verify & Update'
                : 'Save Changes'}
          </button>
        </div>
      </form>

      <section className="rounded-[2rem] border border-red-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Delete account</h2>
            <p className="mt-1 text-sm text-gray-500">Permanently remove your profile and marketplace data.</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </section>

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-950">Delete account?</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Deleting your account permanently removes your profile, listings, chats, and marketplace activity. This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-gray-700">Type DELETE to confirm</span>
              <input
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {deleting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
