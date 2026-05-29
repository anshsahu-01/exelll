'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square w-full relative bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
        <img
          src={images[activeIndex]}
          alt={`${title} - view ${activeIndex + 1}`}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIndex === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
