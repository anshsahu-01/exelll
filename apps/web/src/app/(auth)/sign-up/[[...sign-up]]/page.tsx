'use client';

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUpPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className={`transition-all duration-300 ${accepted ? "opacity-100" : "pointer-events-none opacity-40 blur-[1px]"}`}>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
        />
      </div>

      <div className="mt-6 flex max-w-md items-start space-x-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input 
          type="checkbox" 
          id="terms" 
          checked={accepted} 
          onChange={(e) => setAccepted(e.target.checked)} 
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the <Link href="/terms" className="font-medium text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-medium text-blue-600 hover:underline">Privacy Policy</Link>. 
          <span className="block mt-1 text-xs text-gray-500">You must agree to continue with registration.</span>
        </label>
      </div>
    </div>
  )
}
