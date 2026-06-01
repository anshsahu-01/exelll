import Link from 'next/link'
import Image from 'next/image'
import { ConversationListItem, Order, Product } from '@/types'
import { Bell, MessageSquare, ShoppingBag, CheckCircle2, Clock3, ArrowRight } from 'lucide-react'

type Activity =
  | { kind: 'order'; id: string; title: string; subtitle: string; href: string; time: string; icon: typeof ShoppingBag; tone: 'gray' | 'green' | 'amber'; group: 'orders' }
  | { kind: 'conversation'; id: string; title: string; subtitle: string; href: string; time: string; icon: typeof MessageSquare; tone: 'gray' | 'green' | 'amber'; group: 'chats' }
  | { kind: 'listing'; id: string; title: string; subtitle: string; href: string; time: string; icon: typeof ShoppingBag; tone: 'gray' | 'green' | 'amber'; group: 'listings' }

function timeAgo(value: string | Date) {
  const diff = Date.now() - new Date(value).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function activityToneClass(tone: Activity['tone']) {
  if (tone === 'green') return 'bg-emerald-50 text-emerald-700'
  if (tone === 'amber') return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-700'
}

export default function RecentActivityPanel({
  conversations,
  products,
  orders,
  sales,
}: {
  conversations: ConversationListItem[]
  products: Product[]
  orders: Order[]
  sales: Order[]
}) {
  const activities: Activity[] = [
    ...products.slice(0, 3).map((product) => ({
      kind: 'listing' as const,
      id: product.id,
      title: `Recently listed "${product.title}"`,
      subtitle: `${product.category?.name || 'Uncategorized'} · ${timeAgo(product.createdAt)}`,
      href: `/listings/${product.id}`,
      time: timeAgo(product.createdAt),
      icon: ShoppingBag,
      tone: 'gray' as const,
      group: 'listings' as const,
    })),
    ...conversations.slice(0, 3).map((conv) => ({
      kind: 'conversation' as const,
      id: conv.id,
      title: `My recent chat with ${conv.otherUser.name}`,
      subtitle: conv.lastMessage ? conv.lastMessage.content : conv.productTitle,
      href: `/messages/${conv.id}`,
      time: timeAgo(conv.lastMessageAt || conv.createdAt),
      icon: MessageSquare,
      tone: 'gray' as const,
      group: 'chats' as const,
    })),
    ...orders.slice(0, 2).map((order) => ({
      kind: 'order' as const,
      id: order.id,
      title: `My recent order "${order.product.title}"`,
      subtitle: `Status: ${order.orderStatus} · ${order.paymentStatus}`,
      href: `/profile/orders/${order.id}`,
      time: timeAgo(order.createdAt),
      icon: order.orderStatus === 'pending' ? Clock3 : CheckCircle2,
      tone: order.orderStatus === 'pending' ? ('amber' as const) : ('green' as const),
      group: 'orders' as const,
    })),
    ...sales.slice(0, 2).map((sale) => ({
      kind: 'order' as const,
      id: sale.id,
      title: `Sale "${sale.product.title}"`,
      subtitle: `Status: ${sale.orderStatus} · ${sale.paymentStatus}`,
      href: `/profile/orders/${sale.id}`,
      time: timeAgo(sale.createdAt),
      icon: sale.orderStatus === 'pending' ? Clock3 : CheckCircle2,
      tone: sale.orderStatus === 'pending' ? ('amber' as const) : ('green' as const),
      group: 'orders' as const,
    })),
  ]

  const sortedActivities = activities.slice(0, 8)

  return (
    <aside className="flex h-full flex-col overflow-hidden bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <p className="mt-1 text-xs text-gray-500">Real activity from your marketplace account</p>
          </div>
          <Link href="/notifications" className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-950">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </Link>
        </div>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Clock3 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No recent activity</p>
          <p className="mt-1 text-xs text-gray-400">Your orders, messages, and listings will appear here once you start using the app.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto">
          {sortedActivities.map((activity) => {
            const Icon = activity.icon
            return (
              <li key={`${activity.kind}-${activity.id}`}>
                <Link href={activity.href} className="flex items-start gap-3 px-5 py-4 transition hover:bg-gray-50">
                  <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${activityToneClass(activity.tone)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-gray-950">{activity.title}</p>
                      <span className="shrink-0 text-[11px] text-gray-400">{activity.time}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{activity.subtitle}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
