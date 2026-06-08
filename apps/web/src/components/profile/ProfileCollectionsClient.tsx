'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getMyOrders, getMySales, getMyProducts } from '@/lib/marketplace'
import { Order, Product } from '@/types'

export function OrdersCollectionClient() {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      setOrders(await getMyOrders(token ?? undefined))
      setLoading(false)
    })()
  }, [getToken])
  return <CollectionShell title="Orders" loading={loading} empty="No orders yet" orders={orders} />
}

export function SalesCollectionClient() {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      setOrders(await getMySales(token ?? undefined))
      setLoading(false)
    })()
  }, [getToken])
  return <CollectionShell title="Sales" loading={loading} empty="No sales yet" orders={orders} />
}

export function ArchiveCollectionClient() {
  const { getToken } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      const data = await getMyProducts(token ?? undefined)
      setProducts(data.sold)
      setLoading(false)
    })()
  }, [getToken])
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CollectionShell title="Sold Archive" loading={loading} empty="No archived items yet" products={products} />
    </div>
  )
}

export function FavouritesCollectionClient() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="rounded-[2rem] border border-border-default bg-surface p-6 text-sm text-secondary">
        Favourites are ready for live backend sync, but this backend does not currently expose a favourites endpoint.
      </div>
    </div>
  )
}

function CollectionShell({
  title,
  loading,
  empty,
  orders,
  products,
}: {
  title: string
  loading: boolean
  empty: string
  orders?: Order[]
  products?: Product[]
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-border-default bg-surface p-6">
          <div className="h-8 w-40 animate-pulse rounded-2xl bg-gray-200" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[1.75rem] border border-border-default bg-surface p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-2xl bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasOrders = Boolean(orders && orders.length)
  const hasProducts = Boolean(products && products.length)

  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-border-default bg-surface p-6">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        {!hasOrders && !hasProducts ? <p className="mt-2 text-sm text-secondary">{empty}</p> : null}
      </div>

      {hasOrders ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders?.map((order) => (
            <div key={order.id} className="rounded-[1.75rem] border border-border-default bg-surface p-4">
              <div className="flex gap-3">
                {order.product.images[0] ? (
                  <Image src={order.product.images[0]} alt={order.product.title} width={64} height={64} className="h-16 w-16 rounded-2xl object-cover" />
                ) : null}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-primary">{order.product.title}</div>
                  <div className="mt-1 text-sm text-secondary">{order.orderStatus} • {order.paymentStatus}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasProducts ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products?.map((product) => (
            <div key={product.id} className="rounded-[1.75rem] border border-border-default bg-surface p-4">
              <div className="text-sm font-semibold text-primary">{product.title}</div>
              <div className="mt-1 text-sm text-secondary">{product.status}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
