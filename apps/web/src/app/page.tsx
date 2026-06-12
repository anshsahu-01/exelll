import { getCategories, getProducts } from '@/lib/services'
import MarketplaceLanding from '@/components/home/MarketplaceLanding'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [categories, productData] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ page: 1, limit: 18, sort: 'latest' }).catch(() => ({
      products: [],
      pagination: undefined,
    })),
  ])

  return <MarketplaceLanding categories={categories} products={productData.products} />
}
