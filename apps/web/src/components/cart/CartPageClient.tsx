'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { addToCart, getCart, removeCartItem, updateCartItem } from '@/lib/marketplace'

type CartItem = Awaited<ReturnType<typeof getCart>>['items'][number]

export function CartPageClient() {
  const { getToken } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const cart = await getCart(token ?? undefined)
      setItems(cart.items ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items]
  )

  const handleQty = async (productId: string, quantity: number) => {
    const token = await getToken()
    await updateCartItem(productId, quantity, token ?? undefined)
    window.dispatchEvent(new Event('cart-updated'))
    await load()
  }

  const handleRemove = async (productId: string) => {
    const token = await getToken()
    await removeCartItem(productId, token ?? undefined)
    window.dispatchEvent(new Event('cart-updated'))
    await load()
  }

  if (loading) {
    return <div className="px-4 py-10 text-sm text-gray-500">Loading cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-gray-200 bg-white px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <ShoppingCart className="h-6 w-6 text-gray-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-950">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-500">Browse listings and add something you like.</p>
        <Link href="/listings" className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
          Browse Listings
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <section className="space-y-4">
        {items.map((item) => (
          <article key={item.productId} className="rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-950">{item.product.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">Seller: {item.product.seller.name}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">${Number(item.product.price).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={() => handleQty(item.productId, Math.max(1, item.quantity - 1))} className="rounded-full border border-gray-200 p-2 hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => handleQty(item.productId, item.quantity + 1)} className="rounded-full border border-gray-200 p-2 hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                  </button>
                  <div className="ml-auto text-sm text-gray-500">
                    Subtotal: <span className="font-semibold text-gray-950">${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-950">Summary</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <div className="flex items-center justify-between"><span>Total items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
          <div className="flex items-center justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex items-center justify-between"><span>Delivery</span><span>$0.00</span></div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-center justify-between text-base font-semibold text-gray-950"><span>Final total</span><span>${subtotal.toFixed(2)}</span></div>
        </div>
        <Link href="/checkout" className="mt-6 block rounded-2xl bg-black px-4 py-3 text-center text-sm font-semibold text-white">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  )
}
