import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />

      <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
        <Link href="/privacy-policy" className="transition-colors hover:text-gray-900">
          Privacy Policy
        </Link>
        <Link href="/terms-and-conditions" className="transition-colors hover:text-gray-900">
          Terms & Conditions
        </Link>
        <Link href="/help" className="transition-colors hover:text-gray-900">
          Help
        </Link>
      </footer>
    </div>
  )
}
