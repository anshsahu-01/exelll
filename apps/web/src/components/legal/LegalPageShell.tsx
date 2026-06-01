import Link from 'next/link'

export function LegalPageShell({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-gray-500">
            Just Sell Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            {intro}
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            For immediate support, visit the{' '}
            <Link href="/help" className="font-medium text-gray-900 underline underline-offset-4">
              Help Center
            </Link>
            {' '}or{' '}
            <Link
              href="/contact-us"
              className="font-medium text-gray-900 underline underline-offset-4"
            >
              Contact Us
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}

export function Section({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
      <div className="space-y-3 text-sm leading-7 text-gray-600">{children}</div>
    </section>
  )
}
