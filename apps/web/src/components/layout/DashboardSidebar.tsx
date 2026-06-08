'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Settings,
  Menu,
  X,
  PlusCircle,
  User,
  LogOut,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/listings', icon: ShoppingBag },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut()
    window.location.replace('/sign-in')
  }

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-default bg-surface text-secondary shadow-sm"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[86vw] max-w-[18rem] flex-col border-r border-border-default bg-surface
          transition-transform duration-300 ease-in-out
          lg:static lg:w-64 lg:max-w-none lg:translate-x-0 lg:flex
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-center border-b border-border-default px-5 py-4">
          <Link href="/dashboard" className="flex items-center">
            {mounted && (
              <Image
                src={
                  resolvedTheme === 'dark'
                    ? '/logo_dark.png'
                    : '/logo_light.png'
                }
                alt="Exell"
                width={152}
                height={57}
                priority
                className="object-contain"
              />
            )}
          </Link>
        </div>

        {/* Sell CTA */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-secondary"
          >
            <PlusCircle className="h-4 w-4" />
            Sell an Item
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {mainNavigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')

            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-surface-hover text-primary'
                      : 'text-secondary hover:bg-surface-hover hover:text-primary'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border-default px-3 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-hover hover:text-accent"
          >
            <LogOut className="h-5 w-5 shrink-0 text-secondary" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}