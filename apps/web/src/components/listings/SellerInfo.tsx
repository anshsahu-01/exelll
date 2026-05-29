import { Star, MessageCircle, ShieldCheck, User as UserIcon } from 'lucide-react'
import { Product } from '@/types'

interface SellerInfoProps {
  seller: Product['seller']
}

export function SellerInfo({ seller }: SellerInfoProps) {
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
          <h4 className="font-semibold text-lg text-gray-900">{seller.name}</h4>
          {seller.collegeName && (
            <div className="text-sm text-gray-600 mt-0.5">
              {seller.collegeName}
            </div>
          )}
        </div>
      </div>

      {seller.isVerified && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 text-green-700 px-3 py-2 rounded-lg mt-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Student</span>
        </div>
      )}

      <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        <MessageCircle className="w-4 h-4" />
        Contact Seller
      </button>
    </div>
  )
}
