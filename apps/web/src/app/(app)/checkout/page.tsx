import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <PageBackButton href="/cart" label="Cart" />
      </div>
      <h1 className="mb-6 text-3xl font-semibold text-primary">Checkout</h1>
      <CheckoutPageClient />
    </div>
  )
}
