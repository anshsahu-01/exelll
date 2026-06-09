import { Product } from '@/types'
import { formatINR } from '@/lib/format'

export function SoldProductCard({ product }: { product: Product }) {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null
  const fallbackImage = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'

  return (
    <div className="flex flex-col bg-surface rounded-xl border border-border-default overflow-hidden opacity-90 transition-opacity hover:opacity-100">
      <div className="aspect-[4/3] w-full relative bg-surface-hover overflow-hidden flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
        <img 
          src={imageUrl || fallbackImage} 
          alt={product.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="text-white font-bold tracking-widest uppercase border-2 border-white px-3 py-1 rounded-sm transform -rotate-12 bg-black/30 backdrop-blur-sm">Sold</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-primary line-clamp-1 mb-1">{product.title}</h3>
        <span className="font-bold text-primary">{formatINR(product.price)}</span>
      </div>
    </div>
  )
}
