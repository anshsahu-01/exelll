import { SiteFooter } from '@/components/layout/SiteFooter'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {children}
      <SiteFooter />
    </div>
  )
}
