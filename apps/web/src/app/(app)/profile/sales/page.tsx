import { SalesCollectionClient } from '@/components/profile/ProfileCollectionsClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function ProfileSalesPage() {
  return (
    <div>
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <PageBackButton href="/profile" label="Profile" />
      </div>
      <SalesCollectionClient />
    </div>
  )
}
