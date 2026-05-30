'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Loader2,
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-xl bg-gray-100 p-2 text-gray-900">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tracking-tight text-gray-950">{value}</div>
          <div className="mt-1 text-xs font-medium text-gray-500">{label}</div>
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
      className="group rounded-2xl border border-gray-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-black p-2.5 text-white transition group-hover:scale-105">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-950">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-950" />
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  const joinedDate = formatDate(user?.createdAt)

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-8 ring-gray-50">
              {user?.profileImage ? (
                <Image src={user.profileImage} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-700">
                  {initials || '?'}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                  {user?.name ?? 'Profile'}
                </h1>
                {user?.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                    <BadgeCheck className="h-3.5 w-3.5 text-black" />
                    Verified User
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-gray-600">{user?.collegeName ?? 'College not set'}</p>
              <p className="mt-1 text-sm text-gray-500">{joinedDate ? `Joined ${joinedDate}` : ''}</p>
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
