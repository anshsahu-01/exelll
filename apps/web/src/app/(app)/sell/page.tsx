import { SellItemForm } from '@/components/sell/SellItemForm'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <PageBackButton href="/dashboard" label="Dashboard" />
      <div className="mt-4">
        <SellItemForm />
      </div>
    </div>
  )
}
