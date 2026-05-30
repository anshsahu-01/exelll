import { ProfileListingsClient } from '@/components/profile/ProfileListingsClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function ProfileListingsPage() {
  return (
    <div>
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <PageBackButton href="/profile" label="Profile" />
      </div>
      <ProfileListingsClient />
    </div>
  )
}
