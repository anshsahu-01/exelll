import Link from 'next/link'
import { User as UserIcon } from 'lucide-react'
import { SellerDirectoryUser } from '@/types'

export function SellerCard({ seller }: { seller: SellerDirectoryUser }) {
  const timeJoined = new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="group flex flex-col bg-surface rounded-xl border border-border-default overflow-hidden hover:shadow-md transition-all duration-300 relative p-6">
      <div className="flex items-center gap-4 mb-4">
        {seller.profileImage ? (
          <img
            src={seller.profileImage}
            alt={seller.name}
            className="w-14 h-14 rounded-full border border-border-default object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full border border-border-default bg-surface-hover flex items-center justify-center text-secondary">
            <UserIcon className="w-7 h-7" />
          </div>
        )}
        
        <div>
          <h3 className="font-semibold text-lg text-primary line-clamp-1">{seller.name}</h3>
          {seller.collegeName && (
            <p className="text-sm text-secondary line-clamp-1">{seller.collegeName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface-hover rounded-lg p-3 text-center border border-border-default">
          <p className="text-xs text-secondary mb-1">Active</p>
          <p className="text-lg font-bold text-primary">{seller.activeListings}</p>
        </div>
        <div className="bg-surface-hover rounded-lg p-3 text-center border border-border-default">
          <p className="text-xs text-secondary mb-1">Sold</p>
          <p className="text-lg font-bold text-primary">{seller.soldListings}</p>
        </div>
      </div>

      <p className="text-xs text-secondary mb-4 text-center">Member since {timeJoined}</p>

      <div className="mt-auto pt-2">
        <Link 
          href={`/sellers/${seller.id}`}
          className="w-full flex items-center justify-center px-4 py-2 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-lg text-sm font-medium transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
