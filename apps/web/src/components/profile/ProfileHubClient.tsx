'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { BadgeCheck, Archive, Heart, MessageSquare, PencilLine, ShoppingBag, Store, Loader2 } from 'lucide-react'
import { getConversations, getMe, getMyOrders, getMyProducts, getMySales } from '@/lib/marketplace'
import { Order, Product, User } from '@/types'

type ProfileData = {
  user: User | null
  activeListings: Product[]
  soldListings: Product[]
  orders: Order[]
  sales: Order[]
  conversationsCount: number
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function NavCard({ href, title, description, icon: Icon }: { href: string; title: string; description: string; icon: typeof Heart }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-gray-100 p-3 text-gray-700 transition group-hover:bg-black group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
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
    sales: [],
    conversationsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  const initials = useMemo(() => {
    const name = data.user?.name ?? ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }, [data.user?.name])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        const [user, products, orders, sales, conversations] = await Promise.all([
          getMe(token ?? undefined),
          getMyProducts(token ?? undefined),
          getMyOrders(token ?? undefined),
          getMySales(token ?? undefined),
          getConversations(token ?? undefined),
        ])
        setData({
          user,
          activeListings: products.active,
          soldListings: products.sold,
          orders,
          sales,
          conversationsCount: conversations.length,
        })
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [getToken])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  const user = data.user

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-4 ring-gray-50">
            {user?.profileImage ? (
              <Image src={user.profileImage} alt={user.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-semibold text-gray-700">
                {initials || '?'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold text-gray-900">{user?.name ?? 'Profile'}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {user?.collegeName ?? 'College not set'}
              {user?.collegeName ? ' • ' : ''}
              {user?.mobileNumber ?? 'Location not set'}
            </p>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              {user?.bio ?? 'Keep your marketplace profile updated for better trust and faster deals.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <PencilLine className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active listings" value={data.activeListings.length} />
        <StatCard label="Sold items" value={data.soldListings.length} />
        <StatCard label="Messages" value={data.conversationsCount} />
        <StatCard label="Favourites" value="N/A" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NavCard href="/profile/listings" title="My Listings" description="Edit, update, or remove active listings." icon={ShoppingBag} />
        <NavCard href="/profile/archive" title="Sold Archive" description="Review listings you have already sold." icon={Archive} />
        <NavCard href="/profile/orders" title="Orders" description="Track items you have bought." icon={Store} />
        <NavCard href="/profile/sales" title="Sales" description="Manage incoming marketplace sales." icon={MessageSquare} />
        <NavCard href="/profile/favourites" title="Favourites" description="Saved items for later review." icon={Heart} />
        <NavCard href="/profile/edit" title="Edit Profile" description="Update your identity and contact details." icon={PencilLine} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Live summary</h2>
            <Link href="/messages" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Open messages
            </Link>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Open orders</span>
              <span className="font-semibold text-gray-900">{data.orders.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Open sales</span>
              <span className="font-semibold text-gray-900">{data.sales.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active listings</span>
              <span className="font-semibold text-gray-900">{data.activeListings.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Account badge</h2>
          <p className="mt-3 text-sm text-gray-600">
            {user?.isVerified
              ? 'Your account is verified and ready for trusted marketplace activity.'
              : 'Verify your account to build more trust with buyers and sellers.'}
          </p>
        </div>
      </section>
    </div>
  )
}
