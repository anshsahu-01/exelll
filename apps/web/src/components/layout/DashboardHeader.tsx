'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import { Heart, Bell, Search, LogOut } from "lucide-react"
import { getMe } from "@/lib/marketplace"
import { CartBadge } from "@/components/layout/CartBadge"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
export function DashboardHeader() {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const { user } = useUser()
  const [backendProfileImage, setBackendProfileImage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const token = await getToken()
        const profile = await getMe(token ?? undefined)
        if (active) {
          setBackendProfileImage(profile.profileImage ?? null)
        }
      } catch {
        if (active) {
          setBackendProfileImage(null)
        }
      }
    }

    void loadProfile()

    const handleProfileUpdated = () => {
      void loadProfile()
    }

    window.addEventListener('profile-updated', handleProfileUpdated as EventListener)

    return () => {
      active = false
      window.removeEventListener('profile-updated', handleProfileUpdated as EventListener)
    }
  }, [getToken])

  const avatarSource = useMemo(
    () => backendProfileImage || user?.imageUrl || null,
    [backendProfileImage, user?.imageUrl]
  )

  const handleLogout = async () => {
    await signOut()
    window.location.replace('/')
  }

  return (
    <header className="bg-surface border-b border-border-default h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0 transition-colors">
      <div className="flex-1 flex justify-end lg:justify-between items-center h-full">
        <div className="hidden lg:flex w-full max-w-md">
          <div className="relative w-full text-secondary focus-within:text-primary transition-colors">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="block w-full h-10 pl-10 pr-3 py-2 border border-border-default rounded-md leading-5 bg-surface-hover placeholder-secondary text-primary focus:outline-none focus:placeholder-secondary focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search across marketplace..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
          <ThemeToggle />
          <Link
            href="/profile/favourites"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-default text-secondary transition hover:border-border-default hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Open favourites"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <CartBadge />
          <Link
            href="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-default text-secondary transition hover:border-border-default hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <div className="h-8 w-px bg-border-default" />
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border-default bg-surface transition hover:border-border-default hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Open profile"
          >
            {avatarSource ? (
              <Image src={avatarSource} alt="Profile avatar" width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              <span className="inline-flex h-full w-full items-center justify-center bg-surface-hover text-sm font-semibold text-secondary">
                {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? 'U'}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-default text-secondary transition hover:border-border-default hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
