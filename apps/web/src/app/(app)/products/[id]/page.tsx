import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { PageBackButton } from '@/components/ui/PageBackButton'

type Params = Promise<{ id: string }>

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const { id } = await params

  return (
    <div className="mx-auto max-w-4xl p-6">
      <PageBackButton href="/listings" label="Listings" />
      <h1 className="mt-4 text-2xl font-bold">Product Detail</h1>
      <p className="mt-2 text-gray-500">Product ID: {id}</p>
      <p className="mt-4 text-gray-400">Full product detail page will be implemented in Module 3.</p>
    </div>
  )
}

