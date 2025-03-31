/**
 * middleware.ts - Global Authentication Middleware for Next.js with Clerk
 *
 * Purpose:
 * This middleware ensures that only authenticated users can access most pages.
 * The only exception is the "/login" page, which serves as the custom login page.
 *
 * Behavior:
 * - Unauthenticated users:
 *   - Can only access "/login".
 *   - Are redirected to "/login" if they attempt to visit any other page.
 * - Authenticated users:
 *   - Can access all pages.
 *   - Are redirected away from "/login" to "/inventory" (or another page) to avoid seeing the login page again.
 *
 * Technologies Used:
 * - Clerk for authentication
 * - Next.js middleware API for request interception
 *
 * How It Works:
 * 1. If a request is made to any protected route and the user is **not authenticated**, they are redirected to "/login".
 * 2. If an **authenticated user** tries to visit "/login", they are redirected to "/inventory".
 * 3. If a user is authenticated, they can freely navigate the application.
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes (everything except "/login")
// const isProtectedRoute = createRouteMatcher(['/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Protect API routes: If the request is for an API endpoint and there is no authenticated user,
  // return a 401 Unauthorized response.
  if (pathname.startsWith('/api')) {
    if (!auth.userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } else {
    // For non-API routes, enforce page redirection rules:
    // 1. If unauthenticated and not on "/login", redirect to "/login".
    if (!auth.userId && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // 2. If authenticated and trying to access "/login", redirect to "/inventory".
    if (auth.userId && pathname === '/login') {
      return NextResponse.redirect(new URL('/inventory', req.url));
    }
  }

  return NextResponse.next();
});






// export default clerkMiddleware();

// TODO: uncomment the below code once we know auth is working right
// export default clerkMiddleware(async (auth, req) => {
//   If the request is for a protected route and is NOT "/login", enforce authentication
//   if (isProtectedRoute(req) && req.nextUrl.pathname !== "/login" && !auth.userId) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
//   If an authenticated user visits "/login", redirect them to "/inventory"
//   if (auth.userId && req.nextUrl.pathname === "/login") {
//     return NextResponse.redirect(new URL('/inventory', req.url));
//   }
//   return NextResponse.next();
// });

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless referenced in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};