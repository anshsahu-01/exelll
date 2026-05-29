'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Heart, MessageSquare, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/listings', icon: ShoppingBag },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Favourites', href: '/favourites', icon: Heart },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white text-gray-600 shadow-sm border border-gray-200"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for desktop and mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              Just Sell
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
