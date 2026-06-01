import { CartPageClient } from '@/components/cart/CartPageClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <PageBackButton href="/dashboard" label="Dashboard" />
      </div>
      <h1 className="mb-6 text-3xl font-semibold text-gray-950">Your Cart</h1>
      <CartPageClient />
    </div>
  )
}
