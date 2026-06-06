'use client'

import { Star, MessageCircle, ShieldCheck, User as UserIcon } from 'lucide-react'
import { Product } from '@/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { createConversation } from '@/lib/marketplace'

interface SellerInfoProps {
  seller: Product['seller']
  productId: string
}

export function SellerInfo({ seller, productId }: SellerInfoProps) {
  const router = useRouter()
  const { getToken } = useAuth()

  const handleContactSeller = async () => {
    try {
      const token = await getToken()

      const conversation = await createConversation(
        productId,
        token ?? undefined
      )

      router.push(`/messages/${conversation.id}`)
    } catch (error) {
      console.error('Failed to create conversation:', error)
      alert('Unable to start conversation. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <h3 className="font-medium text-gray-900">About the seller</h3>

      <div className="flex items-center gap-4">
        {seller.profileImage ? (
          <img
            src={seller.profileImage}
            alt={seller.name}
            className="w-16 h-16 rounded-full border border-gray-100 object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400">
            <UserIcon className="w-8 h-8" />
          </div>
        )}

        <div>
          <h4 className="font-semibold text-lg text-gray-900">
            {seller.name}
          </h4>

          {seller.collegeName && (
            <div className="text-sm text-gray-600 mt-0.5">
              {seller.collegeName}
            </div>
          )}
        </div>
      </div>

      {seller.isVerified && (
        <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg mt-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Student</span>
        </div>
      )}

      <button
        onClick={handleContactSeller}
        className="cursor-pointer mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Contact Seller
      </button>
    </div>
  )
}