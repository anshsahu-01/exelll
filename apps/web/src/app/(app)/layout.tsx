import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader />
        {/* main must fill remaining height so dashboard split-layout works */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
