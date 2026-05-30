'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Trash2, X } from 'lucide-react'
import { getMe } from '@/lib/marketplace'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Notice = { type: 'success' | 'error'; message: string } | null

export function ProfileEditClient() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { user: clerkUser, isLoaded } = useUser()
  const [form, setForm] = useState({
    name: '',
    email: '',
    collegeName: '',
    mobileNumber: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<Notice>(null)
  const [emailStep, setEmailStep] = useState<'idle' | 'verify'>('idle')
  const [verificationCode, setVerificationCode] = useState('')
  const [pendingEmailAddress, setPendingEmailAddress] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

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
          bio: user.bio ?? '',
        })
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [getToken])

  const updateBackendProfile = async (overrides?: { email?: string }) => {
    const token = await getToken()
    const data = new FormData()
    data.append('name', form.name)
    data.append('email', overrides?.email ?? form.email)
    data.append('collegeName', form.collegeName)
    data.append('mobileNumber', form.mobileNumber)
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
  }

  const handleEmailVerification = async () => {
    if (!clerkUser || !pendingEmailAddress) return
    if (!verificationCode.trim()) {
      setNotice({ type: 'error', message: 'Enter the verification code sent to your email.' })
      return
    }

    setSaving(true)
    setNotice(null)
    try {
      const emailAddress = (clerkUser as any).emailAddresses?.find(
        (item: any) => item.emailAddress === pendingEmailAddress
      )
      if (!emailAddress) {
        throw new Error('Verification session expired. Please try again.')
      }

      const result = await emailAddress.attemptVerification({ code: verificationCode.trim() })
      if (result?.verification?.status !== 'verified' && result?.status !== 'verified') {
        throw new Error('Email verification failed.')
      }

      await updateBackendProfile({ email: pendingEmailAddress })
      setForm((current) => ({ ...current, email: pendingEmailAddress }))
      setEmailStep('idle')
      setPendingEmailAddress(null)
      setVerificationCode('')
      setNotice({ type: 'success', message: 'Email verified and updated successfully.' })
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
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)

    const nextEmail = form.email.trim()
    if (nextEmail && !EMAIL_REGEX.test(nextEmail)) {
      setNotice({ type: 'error', message: 'Enter a valid email address.' })
      return
    }

    if (emailStep === 'verify') {
      await handleEmailVerification()
      return
    }

    setSaving(true)
    try {
      if (nextEmail && nextEmail !== (clerkUser?.primaryEmailAddress?.emailAddress ?? nextEmail)) {
        if (!isLoaded || !clerkUser) {
          throw new Error('Authentication is still loading. Please try again.')
        }

        const existing = (clerkUser as any).emailAddresses?.find(
          (item: any) => item.emailAddress?.toLowerCase?.() === nextEmail.toLowerCase()
        )
        if (existing) {
          throw new Error('This email is already associated with another account.')
        }

        let emailAddress: any
        try {
          emailAddress = await (clerkUser as any).createEmailAddress({ emailAddress: nextEmail })
        } catch (error) {
          const message = error instanceof Error ? error.message : ''
          if (/already/i.test(message)) {
            throw new Error('This email is already associated with another account.')
          }
          throw error
        }

        await emailAddress.prepareVerification({ strategy: 'email_code' })
        setPendingEmailAddress(nextEmail)
        setEmailStep('verify')
        setNotice({
          type: 'success',
          message: 'We sent a verification code to the new email address.',
        })
        return
      }

      await updateBackendProfile()
      setNotice({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not update profile.',
      })
    } finally {
      setSaving(false)
    }
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
      router.replace('/sign-in')
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not delete account.',
      })
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
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
            ['mobileNumber', 'Location / Mobile'],
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
            <span className="text-sm font-medium text-gray-700">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              rows={5}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
            />
          </label>
          {emailStep === 'verify' ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">Verify your new email</p>
              <p className="mt-1 text-sm text-gray-500">
                Enter the 6-digit code sent to {pendingEmailAddress}.
              </p>
              <div className="mt-4 flex gap-3">
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="Enter verification code"
                  className="h-12 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify
                </button>
              </div>
            </div>
          ) : null}
          <button
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
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
