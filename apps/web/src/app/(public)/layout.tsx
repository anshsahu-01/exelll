import { SiteFooter } from '@/components/layout/SiteFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-primary">
      {children}
      <SiteFooter />
    </div>
  )
}
