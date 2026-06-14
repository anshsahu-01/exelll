'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { Category, Product } from '@/types'
import { formatINR } from '@/lib/format'
import { useTheme } from 'next-themes'
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { HeroBanner } from '@/components/hero/HeroBanner'

const heroSlides = [
  '/banner1.png',
  '/banner2.png',
  '/banner3.png',
]

const sectionKeywords: Record<string, string[]> = {
  'College Essentials': ['calculator', 'lab coat', 'book', 'cycle', 'hostel', 'stationery'],
  'Engineering Drawing Essentials': ['drafter', 'roller scale', 'mini drafter', 'drawing sheets', 'clips', 'engineering tool'],
}

export default function MarketplaceLanding({
  categories,
  products,
}: {
  categories: Category[]
  products: Product[]
}) {
  const { isSignedIn } = useAuth()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [])

  const recent = useMemo(() => products.slice(0, 8), [products])
  const trending = useMemo(() => products.slice(8, 16), [products])

  const categoryBuckets = useMemo(() => {
    const buckets: Record<string, Product[]> = {}
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      buckets[section] = products.filter((product) => {
        const haystack = `${product.title} ${product.category?.name ?? ''} ${product.description}`.toLowerCase()
        return keywords.some((keyword) => haystack.includes(keyword))
      }).slice(0, 8)
    }
    return buckets
  }, [products])

  const popular = useMemo(
    () => products.filter((product) => ['electronics', 'mobiles', 'fashion', 'books'].some((name) => `${product.title} ${product.category?.name ?? ''}`.toLowerCase().includes(name))).slice(0, 8),
    [products]
  )

  const otherCategories = useMemo(
    () => categories.filter((category) => !['college essentials', 'engineering drawing essentials'].includes(category.name.toLowerCase())),
    [categories]
  )

  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-surface-hover text-primary">
      <header className="sticky top-0 z-20 border-b border-border-default bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center px-5 py-1">
            <Link href="/dashboard" className="flex items-center">
              {mounted && (
                <Image
                  src={
                    resolvedTheme === 'dark'
                      ? '/sqlogo_dark.png'
                      : '/sqlogo_light.png'
                  }
                  alt="Exelll"
                  width={62}
                  height={28}
                  priority
                  className="object-contain rounded-full"
                />
              )}
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-border-default bg-surface px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-secondary" />
              <span className="text-sm text-secondary">Search products, categories, or sellers</span>
            </div>
          </div>



          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isSignedIn ? (
              <Link href="/dashboard" className="rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover">
                  Log in
                </Link>
                <Link href="/sign-up" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border-default bg-surface shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center mb-6 gap-2 rounded-full border border-border-default bg-surface-hover px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </span>
                
              </div>
              <HeroBanner />
              <p className="mt-4 max-w-3xl text-sm leading-6 text-secondary">
                Buy, sell, and save within your college community.
              </p>
            </div>

            <div className="hidden lg:block border-t border-border-default p-4 sm:p-6 lg:border-l lg:border-t-0">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/listings?categoryId=${category.id}`}
                    className="flex items-center justify-between rounded-2xl border border-border-default bg-surface px-4 py-3 transition hover:bg-surface-hover"
                  >
                    <span className="text-sm font-medium text-primary">{category.name}</span>
                    <ChevronRight className="h-4 w-4 text-secondary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Recently Added Listings" subtitle="Fresh arrivals from across the marketplace.">
        <CardGrid products={recent} />
      </Section>

      <Section title="Trending Listings" subtitle="Popular items people are checking out right now.">
        <CardGrid products={trending} />
      </Section>

      <Section title="Popular Listings" subtitle="Frequently viewed and widely relevant items.">
        <CardGrid products={popular} />
      </Section>

      <Section title="College Essentials" subtitle="Daily campus items and must-haves.">
        <CardGrid products={categoryBuckets['College Essentials'] ?? []} />
      </Section>

      <Section title="Engineering Drawing Essentials" subtitle="Drafting and drawing supplies for engineering students.">
        <CardGrid products={categoryBuckets['Engineering Drawing Essentials'] ?? []} />
      </Section>

      <footer className="relative mt-24 border-t border-border-default bg-surface/80 backdrop-blur-md">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">

            {/* Brand Column */}
            <div className="flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
                  {mounted && (
                    <Image
                      src={resolvedTheme === 'dark' ? '/sqlogo_dark.png' : '/sqlogo_light.png'}
                      alt="Exelll"
                      width={90}
                      height={45}
                      className="object-contain"
                    />
                  )}
                </Link>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-secondary/90">
                  India's premier student marketplace for buying and selling college essentials, electronics, books, and campus gear.
                </p>
              </div>

              {/* Pill Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['Student First', 'Campus Verified'].map((text) => (
                  <span
                    key={text}
                    className="inline-flex items-center rounded-full bg-surface-hover border border-border-default/50 px-3 py-1 text-xs font-medium text-secondary transition-all hover:border-primary/30"
                  >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Links: Marketplace */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Marketplace
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Browse Listings', href: '/listings' },
                  { label: 'Sell Item', href: '/sell' },
                  { label: 'Dashboard', href: '/dashboard' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-secondary transition-colors duration-200 hover:text-primary hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Links: Legal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms & Conditions', href: '/terms-and-conditions' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-secondary transition-colors duration-200 hover:text-primary hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Navigation Links: Account */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Account
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Messages', href: '/messages' },
                  { label: 'Orders', href: '/orders' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Profile', href: '/profile' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-secondary transition-colors duration-200 hover:text-primary hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Links: Resources */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Browse Listings', href: '/listings' },
                  { label: 'Sell Item', href: '/sell' },
                  { label: 'Categories', href: '/categories' },
                  { label: 'Contact Us', href: '/contact' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-secondary transition-colors duration-200 hover:text-primary hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* Footer Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-default/60 pt-8 text-xs font-medium text-secondary/80 md:flex-row">
            <p>© {new Date().getFullYear()} Exelll. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              <p className="tracking-wide uppercase text-[10px]">Built exclusively for students</p>
            </div>
          </div>
        </div>
      </footer>
    </main>

  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="mt-1 text-sm text-secondary">{subtitle}</p>
        </div>
        <Link href="/listings" className="text-sm font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>
      {children}
    </section>
  )
}

function CardGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border-default bg-surface p-8 text-sm text-secondary">
        No listings matched this section yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/listings/${product.id}`}
          className="overflow-hidden rounded-[1.5rem] border border-border-default bg-surface transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] bg-surface-hover">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            ) : null}
          </div>
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-primary">{product.title}</p>
            <p className="text-sm font-semibold text-primary">{formatINR(product.price)}</p>
            <p className="text-xs text-secondary">{product.category?.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
