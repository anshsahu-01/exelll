import { PageBackButton } from '@/components/ui/PageBackButton'
import { OrdersClient } from '@/components/orders/OrdersClient'

export const dynamic = 'force-dynamic'

export default async function ProfileOrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  return (
    <div>
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <PageBackButton href="/profile/orders" label="Orders" />
      </div>
      <OrdersClient mode="detail" orderId={id} />
    </div>
  )
}
