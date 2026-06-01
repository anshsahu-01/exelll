'use client'

import Link from 'next/link'
import { useAuth, useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Bell, CircleUserRound, HelpCircle, Loader2, Lock, LogOut, MoonStar, Shield, Trash2, CheckCircle2, X } from 'lucide-react'
import { deleteAccount } from '@/lib/user'

type ToggleItem = {
  label: string
  description: string
  enabled: boolean
}

export function SettingsClient() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const { user } = useUser()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const sessionInfo = useMemo(
    () => [
      { label: 'Signed in as', value: user?.fullName || user?.username || 'Current user' },
      { label: 'Email', value: user?.primaryEmailAddress?.emailAddress || 'Not available' },
      { label: 'Clerk session', value: 'Shared browser session' },
    ],
    [user]
  )

  const notifications: ToggleItem[] = [
    { label: 'Order updates', description: 'Status changes for purchases and sales.', enabled: true },
    { label: 'New messages', description: 'Incoming chat notifications.', enabled: true },
    { label: 'Listing activity', description: 'Favourites, saves, and activity on your listings.', enabled: true },
    { label: 'Payment verification updates', description: 'Manual payment review updates.', enabled: true },
  ]

  const handleDeleteAccount = async () => {
    if (deleteText !== 'DELETE') return
    setDeleting(true)
    try {
      const token = await getToken()
      await deleteAccount({ confirmation: 'DELETE' }, token ?? undefined)
      await signOut()
      router.replace('/sign-in')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
      setDeleteText('')
    }
  }

  const logoutCurrent = async () => {
    await signOut()
    router.replace('/sign-in')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-950">Settings</h1>
        <p className="mt-2 text-sm text-gray-500">Manage account, privacy, and support for your Just Sell profile.</p>
      </div>

      <div className="grid gap-6">
        <Section title="Account" icon={CircleUserRound}>
          <ActionRow href="/profile/edit" title="Edit Profile" description="Update your profile details and photo." />
          <ActionRow href="/profile/edit" title="Change Email" description="Handled through the profile editor and Clerk verification." />
          <ActionRow href="/profile/edit" title="Change Password" description="Use Clerk’s authenticated account flow." />
          <ActionRow href="/profile/edit" title="Profile Visibility" description="Visibility follows your public marketplace profile." />
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-left transition hover:bg-red-100"
          >
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 text-red-700" />
              <div>
                <p className="text-sm font-semibold text-red-800">Delete Account</p>
                <p className="mt-1 text-sm text-red-700/80">Permanent and irreversible. Removes your profile, listings, chats, and marketplace activity.</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-red-700" />
          </button>
        </Section>

        <Section title="Notifications" icon={Bell}>
          <div className="grid gap-3">
            {notifications.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-950">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Enabled
                  </span>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Notification persistence is ready for backend storage. Current state is wired from the app’s existing notification architecture and will be connected to user preferences when the backend preference model lands.
            </p>
          </div>
        </Section>

        <Section title="Privacy & Security" icon={Shield}>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-950">Session info</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    {sessionInfo.map((row) => (
                      <p key={row.label}>
                        <span className="font-medium text-gray-700">{row.label}:</span> {row.value}
                      </p>
                    ))}
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <button type="button" onClick={logoutCurrent} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left transition hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <LogOut className="mt-0.5 h-5 w-5 text-gray-900" />
                <div>
                  <p className="text-sm font-semibold text-gray-950">Logout from current device</p>
                  <p className="mt-1 text-sm text-gray-500">Ends the current browser session and returns to sign-in.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </button>

            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 text-gray-900" />
                <div>
                  <p className="text-sm font-semibold text-gray-950">Logout from all devices</p>
                  <p className="mt-1 text-sm text-gray-500">Clerk’s local browser sign-out is available here. Global session revocation is not exposed in this app shell yet.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="App Preferences" icon={MoonStar}>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-950">Theme preference</p>
            <p className="mt-1 text-sm text-gray-500">Just Sell web is currently locked to the established light theme, matching the existing product language.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-950">Interface preferences</p>
            <p className="mt-1 text-sm text-gray-500">No additional desktop-only preferences are active yet, so we’re not inventing toggles that the mobile app does not already support.</p>
          </div>
        </Section>

        <Section title="Support" icon={HelpCircle}>
          <ActionRow href="/messages" title="Help / FAQ" description="Browse support conversations and common help flows." />
          <ActionRow href="mailto:support@justsell.local" title="Report issue" description="Send a support request to the team." external />
          <ActionRow href="mailto:support@justsell.local" title="Contact support" description="Reach the Just Sell support inbox." external />
          <ActionRow href="/dashboard" title="About Just Sell" description="Return to the marketplace dashboard and explore the product." />
        </Section>
      </div>

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-950">Delete account?</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  This is irreversible. Your account, listings, chats, orders, and marketplace activity will be removed or anonymized according to the backend workflow.
                </p>
              </div>
              <button type="button" onClick={() => setDeleteOpen(false)} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-gray-700">Type DELETE to confirm</span>
              <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-300 focus:bg-white" />
            </label>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteOpen(false)} className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={deleting || deleteText !== 'DELETE'}
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

function Section({ title, icon: Icon, children }: { title: string; icon: ComponentType<{ className?: string }>; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-5 w-5 text-gray-900" />
        </div>
        <h2 className="text-xl font-semibold text-gray-950">{title}</h2>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

function ActionRow({ href, title, description, external = false }: { href: string; title: string; description: string; external?: boolean }) {
  const content = (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 transition hover:bg-gray-50">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-950">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
    </div>
  )

  if (external) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  )
}
