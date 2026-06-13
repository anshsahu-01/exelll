'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCcw } from 'lucide-react'
import {
  getMe,
  getMyOrders,
  getMySales,
  getOrderById,
  sellerDecision,
} from '@/lib/marketplace'
import { Order } from '@/types'
import { formatINR } from '@/lib/format'

type Mode = 'buyer' | 'seller' | 'detail'

const statusLabelMap: Record<Order['orderStatus'], string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusStyles: Record<Order['orderStatus'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-sky-50 text-sky-700 border-sky-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export function OrdersClient({
  mode,
  orderId,
}: {
  mode: Mode
  orderId?: string
}) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const me = await getMe(token ?? undefined)
      setCurrentUserId(me.id)

      if (mode === 'buyer') {
        setOrders(await getMyOrders(token ?? undefined))
      } else if (mode === 'seller') {
        setOrders(await getMySales(token ?? undefined))
      } else if (orderId) {
        setOrder(await getOrderById(orderId, token ?? undefined))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, mode, orderId])

  const visibleOrders = useMemo(() => orders, [orders])

  const handleSellerDecision = async (current: Order, nextStatus: 'accepted' | 'rejected') => {
    setSavingId(current.id)
    try {
      const token = await getToken()
      const rejectionReason =
        nextStatus === 'rejected'
          ? window.prompt('Optional rejection reason for the buyer:')?.trim() || undefined
          : undefined
      const updated = await sellerDecision(current.id, nextStatus, rejectionReason, token ?? undefined)
      if (mode === 'detail') {
        setOrder(updated)
      } else {
        setOrders((currentOrders) =>
          currentOrders.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (mode === 'detail') {
    if (!order) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border-default bg-surface p-6 text-sm text-secondary">
            Order not found.
          </div>
        </div>
      )
    }

    const canSeeContact = order.orderStatus === 'accepted'

    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={currentUserId === order.sellerId ? '/profile/sales' : '/profile/orders'}
            className="text-sm font-semibold text-secondary hover:text-primary"
          >
            Back to requests
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                {order.product.images[0] ? (
                  <Image src={order.product.images[0]} alt={order.product.title} width={128} height={128} className="h-32 w-32 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-surface-hover text-xs text-secondary">No image</div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-secondary">Order details</p>
                  <h1 className="mt-1 text-2xl font-semibold text-primary">{order.product.title}</h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.orderStatus]}`}>
                      {statusLabelMap[order.orderStatus]}
                    </span>
                    <span className="rounded-full border border-border-default px-3 py-1 text-xs font-medium text-secondary">
                      {formatINR(order.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <InfoCard
                title="Product details"
                items={[
                  ['Price', formatINR(order.product.price)],
                  ['Order date', new Date(order.createdAt).toLocaleString()],
                  ['Status', statusLabelMap[order.orderStatus]],
                  ['Rejection reason', order.rejectionReason || '—'],
                ]}
              />
            <InfoCard
              title="Buyer details"
              items={[
                ['Name', order.buyer.name],
                ['College', order.buyer.collegeName || '—'],
                ['Phone', canSeeContact ? order.mobileNumber || '—' : 'Hidden until accepted'],
                ['Pickup / meetup location', canSeeContact ? order.locationDetails || '—' : 'Hidden until accepted'],
              ]}
            />
            </div>

            <InfoCard
              title="Seller details"
              items={[
                ['Name', order.seller.name],
                ['College', order.seller.collegeName || '—'],
                ['Phone', canSeeContact ? order.product.contactNumber || '—' : 'Hidden until accepted'],
              ]}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Status</h2>
              <p className="mt-2 text-sm text-secondary">
                {order.orderStatus === 'accepted'
                  ? 'Accepted orders unlock contact details.'
                  : order.orderStatus === 'rejected'
                    ? 'This request was rejected.'
                    : order.orderStatus === 'cancelled'
                      ? 'This request was cancelled.'
                      : 'This request is waiting for a seller decision.'}
              </p>
            </div>

            {order.orderStatus === 'pending' && currentUserId === order.sellerId ? (
              <div className="rounded-[2rem] border border-border-default bg-surface p-6">
                <h2 className="text-lg font-semibold text-primary">Decision</h2>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => void handleSellerDecision(order, 'accepted')}
                    disabled={savingId === order.id}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {savingId === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSellerDecision(order, 'rejected')}
                    disabled={savingId === order.id}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between rounded-[2rem] border border-border-default bg-surface p-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            {mode === 'buyer' ? 'Orders' : 'Order Requests'}
          </h1>
          <p className="mt-1 text-sm text-secondary">
            {mode === 'buyer'
              ? 'Track your purchases and their current status.'
              : 'Review incoming requests and keep the list clean.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-border-default bg-surface p-10 text-center text-sm text-secondary">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((current) => {
            const isSellerRequests = mode === 'seller'
            return (
              <div key={current.id} className="rounded-[2rem] border border-border-default bg-surface p-4 sm:p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-center">
                  <div className="flex gap-4">
                    {current.product.images[0] ? (
                      <Image
                        src={current.product.images[0]}
                        alt={current.product.title}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-hover text-xs text-secondary">
                        No image
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-primary">{current.product.title}</p>
                      <div className="mt-2 grid gap-2 text-sm text-secondary sm:grid-cols-2">
                        {isSellerRequests ? (
                          <>
                            <span>Buyer: {current.buyer.name}</span>
                            <span>Order date: {new Date(current.createdAt).toLocaleDateString()}</span>
                          </>
                        ) : (
                          <>
                            <span>Seller: {current.seller.name}</span>
                            <span>Order date: {new Date(current.createdAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link
                      href={`/profile/orders/${current.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover"
                    >
                      View Order
                    </Link>
                    {isSellerRequests && current.orderStatus === 'pending' && currentUserId === current.sellerId ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleSellerDecision(current, 'accepted')}
                          disabled={savingId === current.id}
                          className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          {savingId === current.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSellerDecision(current, 'rejected')}
                          disabled={savingId === current.id}
                          className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border-default bg-surface p-6">
        <div className="h-7 w-40 animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded-2xl bg-gray-200" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-[2rem] bg-gray-200" />
      ))}
    </div>
  )
}

function InfoCard({
  title,
  items,
}: {
  title: string
  items: [string, string][]
}) {
  return (
    <div className="rounded-[2rem] border border-border-default bg-surface p-6">
      <h2 className="text-lg font-semibold text-primary">{title}</h2>
      <dl className="mt-4 space-y-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-secondary">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
