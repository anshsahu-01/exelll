import { MessageSquare, ShoppingCart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface MyActivitySummaryProps {
  conversationsCount: number;
  ordersCount: number;
  salesCount: number;
}

export function MyActivitySummary({ conversationsCount, ordersCount, salesCount }: MyActivitySummaryProps) {
  const items = [
    {
      label: 'Active Conversations',
      value: conversationsCount,
      icon: MessageSquare,
      href: '/messages',
      hint: 'View Messages',
    },
    {
      label: 'My Orders',
      value: ordersCount,
      icon: ShoppingCart,
      href: '/profile',
      hint: 'View Orders',
    },
    {
      label: 'My Sales',
      value: salesCount,
      icon: TrendingUp,
      href: '/profile',
      hint: 'View Sales',
    },
  ]

  return (
    <div>
      <h2 className="text-base font-semibold text-primary mb-4">My Activity</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3.5 bg-surface-hover border border-border-default rounded-xl hover:bg-surface-hover/80 hover:border-primary/30 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface border border-border-default group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                <Icon className="h-5 w-5 text-secondary group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{item.label}</p>
                <p className="text-xs text-secondary">{item.hint}</p>
              </div>
              <span className="text-lg font-bold text-primary shrink-0 tabular-nums">{item.value}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
