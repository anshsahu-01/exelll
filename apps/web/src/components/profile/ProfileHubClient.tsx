'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MessageSquare,
  PencilLine,
  ShoppingBag,
  Store,
  Archive,
} from 'lucide-react'
import { getConversations, getMe, getMyOrders, getMyProducts } from '@/lib/marketplace'
import { ConversationListItem, Order, Product, User } from '@/types'

type ProfileData = {
  user: User | null
  activeListings: Product[]
  soldListings: Product[]
  orders: Order[]
  conversations: ConversationListItem[]
}

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingBag
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-border-default bg-surface p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-xl bg-surface-hover p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tracking-tight text-primary">{value}</div>
          <div className="mt-1 text-xs font-medium text-secondary">{label}</div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  href,
  title,
  subtitle,
  icon: Icon,
}: {
  href: string
  title: string
  subtitle: string
  icon: typeof ShoppingBag
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border-default bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-border-default hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-black p-2.5 text-white transition group-hover:scale-105">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            <p className="mt-1 text-sm text-secondary">{subtitle}</p>
          </div>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 text-secondary transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  )
}

export function ProfileHubClient() {
  const { getToken } = useAuth()
  const [data, setData] = useState<ProfileData>({
    user: null,
    activeListings: [],
    soldListings: [],
    orders: [],
    conversations: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        const [user, products, orders, conversations] = await Promise.all([
          getMe(token ?? undefined),
          getMyProducts(token ?? undefined),
          getMyOrders(token ?? undefined),
          getConversations(token ?? undefined),
        ])
        setData({
          user,
          activeListings: products.active,
          soldListings: products.sold,
          orders,
          conversations,
        })
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [getToken])

  const user = data.user
  const initials = useMemo(() => {
    const name = user?.name?.trim() ?? ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }, [user?.name])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-border-default bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-3">
                <div className="h-8 w-56 animate-pulse rounded-2xl bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded-2xl bg-gray-200" />
                <div className="h-4 w-28 animate-pulse rounded-2xl bg-gray-200" />
              </div>
            </div>
            <div className="h-12 w-36 animate-pulse rounded-full bg-gray-200" />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[1.5rem] bg-gray-200" />
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[1.5rem] bg-gray-200" />
          ))}
        </section>
      </div>
    )
  }

  const joinedDate = formatDate(user?.createdAt)

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border-default bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-surface-hover ring-8 ring-gray-50">
              {user?.profileImage ? (
                <Image src={user.profileImage} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-secondary">
                  {initials || '?'}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-primary">
                  {user?.name ?? 'Profile'}
                </h1>
                {user?.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-surface-hover px-3 py-1 text-xs font-semibold text-secondary">
                    <BadgeCheck className="h-3.5 w-3.5 text-black" />
                    Verified User
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-secondary">{user?.collegeName ?? 'College not set'}</p>
              <p className="mt-1 text-sm text-secondary">{joinedDate ? `Joined ${joinedDate}` : ''}</p>
            </div>
          </div>

          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
          >
            <PencilLine className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ShoppingBag} label="Listings" value={data.activeListings.length} />
          <StatCard icon={Archive} label="Sold" value={data.soldListings.length} />
          <StatCard icon={Store} label="Orders" value={data.orders.length} />
          <StatCard icon={MessageSquare} label="Messages" value={data.conversations.length} />
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionCard
            href="/profile/listings"
            title="My Listings"
            subtitle="Manage your active items."
            icon={ShoppingBag}
          />
          <ActionCard
            href="/profile/orders"
            title="Orders"
            subtitle="Review your purchase history."
            icon={Store}
          />
          <ActionCard
            href="/profile/sales"
            title="Manage Orders"
            subtitle="Review requests and approve or reject them."
            icon={ShoppingBag}
          />
          <ActionCard
            href="/profile/favourites"
            title="Favourites"
            subtitle="Browse saved items."
            icon={Heart}
          />
          <ActionCard
            href="/profile/edit"
            title="Edit Profile"
            subtitle="Change name, bio, and contact info."
            icon={PencilLine}
          />
        </div>
      </section>
    </div>
  )
}
