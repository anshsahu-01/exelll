'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2, MessageSquare, ArrowRight, RefreshCcw } from 'lucide-react'
import {
  createConversation,
  getMe,
  getMyOrders,
  getMySales,
  getOrderById,
  sellerDecision,
  updateOrderStatus,
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

const orderTimeline: Order['orderStatus'][] = ['pending', 'accepted', 'processing', 'shipped', 'delivered']

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
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null)
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

  const list = useMemo(() => {
    if (mode === 'buyer') return orders
    if (mode === 'seller') return orders
    return []
  }, [mode, orders])

  const handleMessage = async (productId: string) => {
    const token = await getToken()
    const conversation = await createConversation(productId, token ?? undefined)
    router.push(`/messages/${conversation.id}`)
  }

  const handleStatusUpdate = async (current: Order, nextStatus: 'confirmed' | 'cancelled' | 'shipped' | 'delivered') => {
    setSavingStatusId(current.id)
    try {
      const token = await getToken()
      const updated = await updateOrderStatus(current.id, nextStatus, token ?? undefined)
      if (mode === 'detail') {
        setOrder(updated)
      } else {
        setOrders((currentOrders) =>
          currentOrders.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order status')
    } finally {
      setSavingStatusId(null)
    }
  }

  const handleSellerDecision = async (current: Order, nextStatus: 'accepted' | 'rejected') => {
    setSavingStatusId(current.id)
    try {
      const token = await getToken()
      const updated = await sellerDecision(current.id, nextStatus, token ?? undefined)
      if (mode === 'detail') {
        setOrder(updated)
      } else {
        setOrders((currentOrders) =>
          currentOrders.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order status')
    } finally {
      setSavingStatusId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-[2rem] border border-border-default bg-surface p-6">
          <div className="space-y-3">
            <div className="h-7 w-40 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-4 w-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] border border-border-default bg-surface p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_auto] lg:items-center">
                <div className="flex gap-4">
                  <div className="h-24 w-24 animate-pulse rounded-2xl bg-gray-200" />
                  <div className="min-w-0 space-y-3">
                    <div className="h-5 w-56 animate-pulse rounded-2xl bg-gray-200" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="h-4 w-36 animate-pulse rounded-2xl bg-gray-200" />
                      <div className="h-4 w-28 animate-pulse rounded-2xl bg-gray-200" />
                      <div className="h-4 w-32 animate-pulse rounded-2xl bg-gray-200" />
                      <div className="h-4 w-24 animate-pulse rounded-2xl bg-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <div className="h-10 w-40 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-10 w-36 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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

    const timelineIndex = orderTimeline.findIndex((status) => status === order.orderStatus)

    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border-default bg-surface p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              {order.product.images[0] ? (
                <Image
                  src={order.product.images[0]}
                  alt={order.product.title}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-surface-hover text-xs text-secondary">
                  No image
                </div>
              )}
              <div>
                <p className="text-sm text-secondary">Order details</p>
                <h1 className="mt-1 text-2xl font-semibold text-primary">{order.product.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.orderStatus]}`}>
                    {statusLabelMap[order.orderStatus]}
                  </span>
                  <span className="rounded-full border border-border-default px-3 py-1 text-xs font-medium text-secondary">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleMessage(order.productId)}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
              {currentUserId === order.sellerId ? (
                <button
                  type="button"
                  onClick={async () =>
                    handleStatusUpdate(
                      order,
                    order.orderStatus === 'pending'
                        ? 'confirmed'
                        : order.orderStatus === 'accepted' || order.orderStatus === 'processing'
                          ? 'shipped'
                          : 'delivered'
                    )
                  }
                  disabled={savingStatusId === order.id || order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {savingStatusId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update status
                </button>
              ) : currentUserId === order.buyerId && order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' ? (
                <button
                  type="button"
                  onClick={() => void handleStatusUpdate(order, 'cancelled')}
                  disabled={savingStatusId === order.id}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-red-100"
                >
                  {savingStatusId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Cancel order
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Timeline</h2>
              <div className="mt-5 space-y-4">
                {orderTimeline.map((status, index) => (
                  <div key={status} className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-4 w-4 rounded-full border-2 ${
                        index <= timelineIndex
                          ? 'border-black bg-black'
                          : 'border-border-default bg-surface'
                      }`}
                    />
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${index <= timelineIndex ? 'text-primary' : 'text-secondary'}`}>
                        {statusLabelMap[status]}
                      </p>
                      <p className="text-sm text-secondary">
                    {index === 0 ? 'Order placed' : index === 1 ? 'Seller accepted the order' : index === 2 ? 'Order confirmed for fulfillment' : index === 3 ? 'Order shipped' : 'Order delivered'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Order metadata</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <Meta label="Payment method" value={order.paymentMethod} />
                <Meta label="Payment status" value={order.paymentStatus} />
                <Meta label="Mobile" value={order.mobileNumber || '—'} />
                <Meta label="Location" value={order.locationDetails || '—'} />
                <Meta label="Order date" value={new Date(order.createdAt).toLocaleString()} />
                <Meta label="UTR" value={order.utrNumber || '—'} />
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">People</h2>
              <div className="mt-4 space-y-4">
                <PersonCard
                  label="Buyer"
                  name={order.buyer.name}
                  image={order.buyer.profileImage}
                  college={order.buyer.collegeName}
                  phone={currentUserId === order.sellerId && order.orderStatus === 'accepted' ? order.mobileNumber : null}
                />
                <PersonCard
                  label="Seller"
                  name={order.seller.name}
                  image={order.seller.profileImage}
                  college={order.seller.collegeName}
                  phone={currentUserId === order.buyerId && order.orderStatus === 'accepted' ? order.product.contactNumber : null}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-border-default bg-surface p-6">
              <h2 className="text-lg font-semibold text-primary">Product</h2>
              <div className="mt-4 flex items-center gap-4">
                {order.product.images[0] ? (
                  <Image
                    src={order.product.images[0]}
                    alt={order.product.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-medium text-primary">{order.product.title}</p>
                  <p className="mt-1 text-sm text-secondary">₹{order.product.price.toLocaleString()}</p>
                </div>
              </div>
              <Link
                href={`/listings/${order.product.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black"
              >
                View listing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const visibleOrders = list

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between rounded-[2rem] border border-border-default bg-surface p-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            {mode === 'buyer' ? 'Orders' : 'Sales'}
          </h1>
          <p className="mt-1 text-sm text-secondary">
            {mode === 'buyer'
              ? 'Track purchases and message sellers.'
              : 'Manage incoming sales and keep buyers updated.'}
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
          {mode === 'buyer' ? 'No orders yet.' : 'No sales yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((current) => {
            const isBuyerView = mode === 'buyer'
            return (
              <div key={current.id} className="rounded-[2rem] border border-border-default bg-surface p-4 sm:p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_auto] lg:items-center">
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
                        {isBuyerView ? (
                          <>
                            <span>Seller: {current.seller.name}</span>
                            <span>Amount: ₹{current.amount.toLocaleString()}</span>
                          </>
                        ) : (
                          <>
                            <span>Buyer: {current.buyer.name}</span>
                            <span>Amount: ₹{current.amount.toLocaleString()}</span>
                          </>
                        )}
                        <span>Date: {new Date(current.createdAt).toLocaleDateString()}</span>
                        <span>Status: {statusLabelMap[current.orderStatus]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link
                      href={`/profile/orders/${current.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover"
                    >
                      View order details
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleMessage(current.productId)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message {isBuyerView ? 'seller' : 'buyer'}
                    </button>
                  </div>
                </div>

                {!isBuyerView ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {current.orderStatus === 'pending' ? (
                      <>
                        <ActionChip label="Accept" onClick={() => void handleSellerDecision(current, 'accepted')} />
                        <ActionChip label="Reject" onClick={() => void handleSellerDecision(current, 'rejected')} />
                      </>
                    ) : null}
                    {current.orderStatus === 'accepted' || current.orderStatus === 'processing' ? (
                      <>
                        <ActionChip label="Mark shipped" onClick={() => void handleStatusUpdate(current, 'shipped')} />
                      </>
                    ) : null}
                    {current.orderStatus === 'shipped' ? (
                      <ActionChip label="Mark delivered" onClick={() => void handleStatusUpdate(current, 'delivered')} />
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-secondary">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-primary">{value}</dd>
    </div>
  )
}

function PersonCard({
  label,
  name,
  image,
  college,
  phone,
}: {
  label: string
  name: string
  image: string | null
  college: string | null
  phone?: string | null
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-hover p-3">
      {image ? (
        <Image src={image} alt={name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-sm font-semibold text-secondary">
          {name[0]?.toUpperCase() ?? '?'}
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-secondary">{label}</p>
        <p className="text-sm font-semibold text-primary">{name}</p>
        <p className="text-xs text-secondary">{college || '—'}</p>
        {phone ? <p className="text-xs text-secondary">{phone}</p> : null}
      </div>
    </div>
  )
}

function ActionChip({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full border border-border-default px-3 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-hover"
    >
      {label}
    </button>
  )
}
