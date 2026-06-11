import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Routes accessible to guests without any login
const isPublicRoute = createRouteMatcher([
  // Auth pages
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Legal / info pages
  '/privacy(.*)',
  '/terms(.*)',
  '/prohibited(.*)',
  '/safety(.*)',
  '/refund-policy(.*)',
  '/contact-us(.*)',
  '/about(.*)',
  '/help(.*)',
  '/privacy-policy(.*)',
  '/terms-and-conditions(.*)',
  // Public marketplace — guests can browse freely
  '/',
  '/listings(.*)',
  '/sellers(.*)',
  '/sell-item(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Root redirect: logged-in users go to dashboard, guests go to listings
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(
      new URL(userId ? '/dashboard' : '/listings', req.url)
    )
  }

  // Protect private routes — redirect unauthenticated guests to sign-in
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}
