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
  updateOrderStatus,
} from '@/lib/marketplace'
import { Order } from '@/types'

type Mode = 'buyer' | 'seller' | 'detail'

const statusLabelMap: Record<Order['orderStatus'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusStyles: Record<Order['orderStatus'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const orderTimeline: Order['orderStatus'][] = ['pending', 'processing', 'shipped', 'delivered']

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

  if (loading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
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
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 text-sm text-gray-500">
            Order not found.
          </div>
        </div>
      )
    }

    const timelineIndex = orderTimeline.findIndex((status) => status === order.orderStatus)

    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6">
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
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-100 text-xs text-gray-400">
                  No image
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Order details</p>
                <h1 className="mt-1 text-2xl font-semibold text-gray-950">{order.product.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.orderStatus]}`}>
                    {statusLabelMap[order.orderStatus]}
                  </span>
                  <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleMessage(order.productId)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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
                        : order.orderStatus === 'processing'
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
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-red-100"
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
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-950">Timeline</h2>
              <div className="mt-5 space-y-4">
                {orderTimeline.map((status, index) => (
                  <div key={status} className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-4 w-4 rounded-full border-2 ${
                        index <= timelineIndex
                          ? 'border-black bg-black'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${index <= timelineIndex ? 'text-gray-950' : 'text-gray-400'}`}>
                        {statusLabelMap[status]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {index === 0 ? 'Order placed' : index === 1 ? 'Seller confirmed the order' : index === 2 ? 'Order shipped' : 'Order delivered'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-950">Order metadata</h2>
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
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-950">People</h2>
              <div className="mt-4 space-y-4">
                <PersonCard label="Buyer" name={order.buyer.name} image={order.buyer.profileImage} college={order.buyer.collegeName} />
                <PersonCard label="Seller" name={order.seller.name} image={order.seller.profileImage} college={order.seller.collegeName} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-950">Product</h2>
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
                  <p className="text-sm font-medium text-gray-950">{order.product.title}</p>
                  <p className="mt-1 text-sm text-gray-500">₹{order.product.price.toLocaleString()}</p>
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
      <div className="flex items-center justify-between rounded-[2rem] border border-gray-200 bg-white p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">
            {mode === 'buyer' ? 'Orders' : 'Sales'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'buyer'
              ? 'Track purchases and message sellers.'
              : 'Manage incoming sales and keep buyers updated.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          {mode === 'buyer' ? 'No orders yet.' : 'No sales yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((current) => {
            const isBuyerView = mode === 'buyer'
            return (
              <div key={current.id} className="rounded-[2rem] border border-gray-200 bg-white p-4 sm:p-5">
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
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-xs text-gray-400">
                        No image
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-gray-950">{current.product.title}</p>
                      <div className="mt-2 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
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
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      View order details
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleMessage(current.productId)}
                      className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
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
                        <ActionChip label="Confirm" onClick={() => void handleStatusUpdate(current, 'confirmed')} />
                        <ActionChip label="Cancel" onClick={() => void handleStatusUpdate(current, 'cancelled')} />
                      </>
                    ) : null}
                    {current.orderStatus === 'processing' ? (
                      <>
                        <ActionChip label="Mark shipped" onClick={() => void handleStatusUpdate(current, 'shipped')} />
                        <ActionChip label="Cancel" onClick={() => void handleStatusUpdate(current, 'cancelled')} />
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
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-950">{value}</dd>
    </div>
  )
}

function PersonCard({
  label,
  name,
  image,
  college,
}: {
  label: string
  name: string
  image: string | null
  college: string | null
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
      {image ? (
        <Image src={image} alt={name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-gray-400">
          {name[0]?.toUpperCase() ?? '?'}
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-950">{name}</p>
        <p className="text-xs text-gray-500">{college || '—'}</p>
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
      className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
    >
      {label}
    </button>
  )
}
