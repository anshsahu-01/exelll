'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCart } from '@/lib/marketplace'

export function CartBadge() {
  const { getToken } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const token = await getToken()
        const cart = await getCart(token ?? undefined)
        if (active) setCount(cart.count ?? 0)
      } catch {
        if (active) setCount(0)
      }
    }

    void load()
    const onUpdate = () => void load()
    window.addEventListener('cart-updated', onUpdate)
    const timer = window.setInterval(load, 15000)

    return () => {
      active = false
      window.removeEventListener('cart-updated', onUpdate)
      window.clearInterval(timer)
    }
  }, [getToken])

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </Link>
  )
}
