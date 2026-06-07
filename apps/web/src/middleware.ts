import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/prohibited(.*)',
  '/safety(.*)',
  '/refund-policy(.*)',
  '/contact-us(.*)',
  '/about(.*)',
  '/help(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Root redirect
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(
      new URL(userId ? '/dashboard' : '/sign-in', req.url)
    )
  }

  // Protect private routes
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}
