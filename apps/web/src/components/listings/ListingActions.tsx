'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { LoginRequiredModal } from '@/components/ui/LoginRequiredModal'

interface ListingActionsProps {
  productId: string
}

export function ListingActions({ productId }: ListingActionsProps) {
  const { isSignedIn } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginAction, setLoginAction] = useState('')

  const handleGuardedAction = (action: string, fn: () => void) => {
    if (!isSignedIn) {
      setLoginAction(action)
      setShowLoginModal(true)
      return
    }
    fn()
  }

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action={loginAction}
      />

      <button
        onClick={() =>
          handleGuardedAction('add this item to your favourites', () => {
            // Placeholder: favourites functionality to be wired up
            alert('Added to favourites!')
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border-default bg-surface py-3 font-medium text-primary transition-colors hover:border-black"
      >
        <Heart className="h-5 w-5" />
        Add to Favourites
      </button>
    </>
  )
}

interface BuyNowButtonProps {
  productId: string
}

export function BuyNowButton({ productId }: BuyNowButtonProps) {
  const { isSignedIn } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (isSignedIn) {
    return (
      <Link
        href={`/checkout?productId=${productId}`}
        className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface py-3 font-medium text-primary transition-colors hover:border-black"
      >
        Buy Now
      </Link>
    )
  }

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="place an order"
      />
      <button
        onClick={() => setShowLoginModal(true)}
        className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface py-3 font-medium text-primary transition-colors hover:border-black"
      >
        Buy Now
      </button>
    </>
  )
}
