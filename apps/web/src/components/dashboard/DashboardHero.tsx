"use client"; 

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

const heroSlides = [
  '/banner1.png',
  '/banner2.png',
  '/banner3.png',
]

export function DashboardHero() {

  const [activeSlide, setActiveSlide] = useState(0)
  
    useEffect(() => {
      const timer = window.setInterval(() => {
        setActiveSlide((current) => (current + 1) % heroSlides.length)
      }, 4500)
      return () => window.clearInterval(timer)
    }, [])
  return (
    <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border-default bg-background">
                <Image
                  src={heroSlides[activeSlide]}
                  alt="Marketplace banner"
                  width={1200}
                  height={360}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-black' : 'w-2.5 bg-border-default'}`}
                      aria-label={`Banner ${index + 1}`}
                    />
                  ))}
                </div>
            </div>
    
  )
}