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
        <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-medium text-secondary transition hover:bg-surface-hover">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-primary">Settings</h1>
        <p className="mt-2 text-sm text-secondary">Manage account, privacy, and support for your Exelll profile.</p>
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
            className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/20 px-4 py-4 text-left transition hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 text-red-700 dark:text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-400">Delete Account</p>
                <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">Permanent and irreversible. Removes your profile, listings, chats, and marketplace activity.</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-red-700 dark:text-red-500" />
          </button>
        </Section>

        <Section title="Notifications" icon={Bell}>
          <div className="grid gap-3">
            {notifications.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border-default bg-surface px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <p className="mt-1 text-sm text-secondary">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Enabled
                  </span>
                </div>
              </div>
            ))}
            <p className="text-xs text-secondary">
              Notification persistence is ready for backend storage. Current state is wired from the app’s existing notification architecture and will be connected to user preferences when the backend preference model lands.
            </p>
          </div>
        </Section>

        <Section title="Privacy & Security" icon={Shield}>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-border-default bg-surface p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">Session info</p>
                  <div className="mt-2 space-y-1 text-sm text-secondary">
                    {sessionInfo.map((row) => (
                      <p key={row.label}>
                        <span className="font-medium text-secondary">{row.label}:</span> {row.value}
                      </p>
                    ))}
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <button type="button" onClick={logoutCurrent} className="flex items-center justify-between rounded-2xl border border-border-default bg-surface px-4 py-4 text-left transition hover:bg-surface-hover">
              <div className="flex items-start gap-3">
                <LogOut className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Logout from current device</p>
                  <p className="mt-1 text-sm text-secondary">Ends the current browser session and returns to sign-in.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-secondary" />
            </button>

            <div className="rounded-2xl border border-border-default bg-surface px-4 py-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Logout from all devices</p>
                  <p className="mt-1 text-sm text-secondary">Clerk’s local browser sign-out is available here. Global session revocation is not exposed in this app shell yet.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="App Preferences" icon={MoonStar}>
          <div className="rounded-2xl border border-border-default bg-surface p-4">
            <p className="text-sm font-semibold text-primary">Theme preference</p>
            <p className="mt-1 text-sm text-secondary">Exelll web theme preference applies across all platforms dynamically.</p>
          </div>
          <div className="rounded-2xl border border-border-default bg-surface p-4">
            <p className="text-sm font-semibold text-primary">Interface preferences</p>
            <p className="mt-1 text-sm text-secondary">No additional desktop-only preferences are active yet, so we’re not inventing toggles that the mobile app does not already support.</p>
          </div>
        </Section>

        <Section title="Support" icon={HelpCircle}>
          <ActionRow href="/messages" title="Help / FAQ" description="Browse support conversations and common help flows." />
          <ActionRow href="mailto:relatablecoder01@gmail.com" title="Report issue" description="Send a support request to the team." external />
          <ActionRow href="mailto:relatablecoder01@gmail.com" title="Contact support" description="Reach the Exelll support inbox." external />
          <ActionRow href="/dashboard" title="About Exelll" description="Return to the marketplace dashboard and explore the product." />
        </Section>

        <Section title="Legal" icon={Shield}>
          <ActionRow href="/terms" title="Terms of Service" description="Our full terms governing use of the Exelll marketplace." />
          <ActionRow href="/privacy" title="Privacy Policy" description="How we collect, use, and protect your data." />
          <ActionRow href="/safety" title="Safety Guidelines" description="Tips for safe meetups and transactions." />
          <ActionRow href="/prohibited" title="Prohibited Items" description="Items that are banned from being listed on Exelll." />
        </Section>
      </div>

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">Delete account?</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  This is irreversible. Your account, listings, chats, orders, and marketplace activity will be removed or anonymized according to the backend workflow.
                </p>
              </div>
              <button type="button" onClick={() => setDeleteOpen(false)} className="rounded-full p-2 text-secondary transition hover:bg-surface-hover hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-secondary">Type DELETE to confirm</span>
              <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} className="h-12 w-full rounded-2xl border border-border-default bg-surface-hover px-4 text-sm text-primary outline-none transition focus:border-primary focus:bg-surface" />
            </label>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteOpen(false)} className="flex-1 rounded-full border border-border-default px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-hover">
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
    <section className="rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-hover">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

function ActionRow({ href, title, description, external = false }: { href: string; title: string; description: string; external?: boolean }) {
  const content = (
    <div className="flex items-center justify-between rounded-2xl border border-border-default bg-surface px-4 py-4 transition hover:bg-surface-hover">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="mt-1 text-sm text-secondary">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-secondary" />
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
