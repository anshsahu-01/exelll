import Link from 'next/link'
import { Bell } from 'lucide-react'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <PageBackButton href="/dashboard" label="Dashboard" />
      </div>

      <div className="rounded-[2rem] border border-border-default bg-surface px-6 py-16 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover">
          <Bell className="h-6 w-6 text-secondary" />
        </div>
        <h1 className="text-2xl font-semibold text-primary">No new notifications</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-secondary">
          Notification updates will appear here once this feature is enabled.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
