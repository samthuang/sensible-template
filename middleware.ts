import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoutes = createRouteMatcher(['/example/users(.*)'])
const isWebhookRoutes = createRouteMatcher(['/api/webhooks(.*)'])

// Sensible default: all routes are public by default (including API routes)
export default clerkMiddleware(async (auth, request) => {
  if (isWebhookRoutes(request)) return

  if (isProtectedRoutes(request)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
