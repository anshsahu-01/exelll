'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { getMe } from '@/lib/marketplace'

export function ProfileEditClient() {
  const { getToken } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    collegeName: '',
    mobileNumber: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      const user = await getMe(token ?? undefined)
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        collegeName: user.collegeName ?? '',
        mobileNumber: user.mobileNumber ?? '',
        bio: user.bio ?? '',
      })
      setLoading(false)
    }
    void load()
  }, [getToken])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    const token = await getToken()
    const data = new FormData()
    data.append('name', form.name)
    data.append('email', form.email)
    data.append('collegeName', form.collegeName)
    data.append('mobileNumber', form.mobileNumber)
    data.append('bio', form.bio)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/users/me`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: data,
    })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
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
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-gray-300 focus:bg-white"
            />
          </label>
        ))}
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Bio</span>
          <textarea
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            rows={5}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-300 focus:bg-white"
          />
        </label>
        <button
          disabled={saving}
          className="inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-300"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </form>
  )
}
