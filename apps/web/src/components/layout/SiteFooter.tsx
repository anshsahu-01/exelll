import Link from 'next/link'

const links = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Safety Guidelines', href: '/safety' },
  { label: 'Prohibited Items', href: '/prohibited' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'About Exelll', href: '/about' },
  { label: 'Help Center', href: '/help' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border-default bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Exelll. All rights reserved.</p>
        <nav className="hidden flex-wrap gap-x-4 gap-y-2 leading-5 sm:flex sm:justify-end">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-10 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
