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
  '/privacy-policy(.*)',
  '/terms-and-conditions(.*)',
  '/',
  '/listings(.*)',
  '/sellers(.*)',
  '/sell-item(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
