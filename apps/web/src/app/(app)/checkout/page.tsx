import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function CheckoutShellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageBackButton href="/cart" label="Cart" />
      <div className="mt-6 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-950">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Checkout flow will continue in the next phase.
        </p>
      </div>
    </div>
  )
}
