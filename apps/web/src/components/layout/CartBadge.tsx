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

    return () => {
      active = false
      window.removeEventListener('cart-updated', onUpdate)
    }
  }, [getToken])

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-default text-secondary transition hover:border-border-default hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
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
