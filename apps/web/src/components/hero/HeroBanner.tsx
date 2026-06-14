'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const heroSlides = [
  '/banner1.png',
  '/banner2.png',
  '/banner3.png',
]

export function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  })

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 4500)

    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className="relative">

      {/* Desktop Arrows */}
      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slider */}
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-3xl border border-border-default"
      >
        <div className="flex">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide}
                alt={`Banner ${index + 1}`}
                width={1400}
                height={400}
                priority={index === 0}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}