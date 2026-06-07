import Link from 'next/link'

export function LegalFooter() {
  const pages = [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/safety', label: 'Safety Guidelines' },
    { href: '/prohibited', label: 'Prohibited Items Policy' },
  ]

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-lg font-semibold mb-4">
        Related Legal Pages
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-lg border p-4 hover:bg-gray-50 transition"
          >
            {page.label}
          </Link>
          
        ))}

        <Link
          href="/"
          className="rounded-lg border p-4 hover:bg-gray-50 transition"
        >
          Home Page
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Last Updated: June 2026
      </p>
    </div>
  )
}