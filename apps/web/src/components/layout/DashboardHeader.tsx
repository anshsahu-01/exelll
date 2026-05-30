'use client'

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Heart, ShoppingCart, Bell, Search } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0">
      <div className="flex-1 flex justify-end lg:justify-between items-center h-full">
        <div className="hidden lg:flex w-full max-w-md">
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="block w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
              placeholder="Search across marketplace..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
          <Link
            href="/profile/favourites"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Open favourites"
          >
            <Heart className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </Link>
          <button className="text-gray-400 hover:text-gray-500 transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <div className="h-8 w-px bg-gray-200" />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
