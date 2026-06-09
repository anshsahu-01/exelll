'use client'

import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { createConversation } from '@/lib/marketplace'
import { useState } from 'react'

interface ContactSellerButtonProps {
  activeListingsCount: number;
  mostRecentProductId?: string;
}

export function ContactSellerButton({ activeListingsCount, mostRecentProductId }: ContactSellerButtonProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleContactSeller = async () => {
    if (!mostRecentProductId) return;
    
    try {
      setIsLoading(true)
      const token = await getToken()
      const conversation = await createConversation(
        mostRecentProductId,
        token ?? undefined
      )
      router.push(`/messages/${conversation.id}`)
    } catch (error) {
      console.error('Failed to create conversation:', error)
      alert('Unable to start conversation. Please try again.')
      setIsLoading(false)
    }
  }

  const hasActiveListings = activeListingsCount > 0

  return (
    <div className="relative group inline-block w-full md:w-auto">
      <button
        onClick={handleContactSeller}
        disabled={!hasActiveListings || isLoading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
          hasActiveListings
            ? 'bg-primary text-background hover:bg-primary/90 shadow-sm'
            : 'bg-surface-hover text-secondary border border-border-default cursor-not-allowed opacity-70'
        }`}
      >
        <MessageCircle className="w-4 h-4" />
        {isLoading ? 'Loading...' : 'Contact Seller'}
      </button>

      {!hasActiveListings && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max max-w-xs px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg z-10 text-center">
          This seller currently has no active listings available for contact.
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}
