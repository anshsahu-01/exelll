import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />

      <div className="mt-10 max-w-md text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="font-medium text-blue-600 hover:underline"
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-blue-600 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}