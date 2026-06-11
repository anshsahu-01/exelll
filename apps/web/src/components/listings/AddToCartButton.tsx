'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { addToCart, getCart } from '@/lib/marketplace'
import { LoginRequiredModal } from '@/components/ui/LoginRequiredModal'

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter()
  const { getToken, isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!isSignedIn) return
    let active = true
    const load = async () => {
      try {
        const token = await getToken()
        const cart = await getCart(token ?? undefined)
        if (active) setInCart(cart.items.some((item) => item.productId === productId))
      } catch {
        if (active) setInCart(false)
      }
    }
    void load()
    const onUpdate = () => void load()
    window.addEventListener('cart-updated', onUpdate)
    return () => {
      active = false
      window.removeEventListener('cart-updated', onUpdate)
    }
  }, [getToken, productId, isSignedIn])

  const handleClick = async () => {
    // Guest guard
    if (!isSignedIn) {
      setShowLoginModal(true)
      return
    }

    if (inCart) {
      router.push('/cart')
      return
    }
    setLoading(true)
    try {
      const token = await getToken()
      await addToCart(productId, token ?? undefined)
      setInCart(true)
      window.dispatchEvent(new Event('cart-updated'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="add items to cart"
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {inCart ? 'View Cart' : loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </>
  )
}
