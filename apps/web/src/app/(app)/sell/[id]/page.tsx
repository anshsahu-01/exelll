import { SellItemForm } from '@/components/sell/SellItemForm'

export const metadata = {
  title: 'Edit Listing',
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <SellItemForm productId={id} />
    </div>
  )
}
