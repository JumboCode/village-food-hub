/**
 * middleware.ts - Global Authentication Middleware for Next.js with Clerk
 *
 * Purpose:
 * This middleware ensures that only authenticated users can access most pages.
 * The only exception is the "/login" page, which serves as the custom login page.
 *
 * Behavior:
 * - Unauthenticated users:
 *   - Can only access "/login" and customer questions including "/welcome-page", "/customer-questions", "/unsaved-thank-you".
 *   - Are redirected to "/login" if they attempt to visit any other page.
 * - Authenticated users:
 *   - Can access all pages.
 *   - Are redirected away from "/login" to "/overview" (or another page) to avoid seeing the login page again.
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
const isProtectedRoute = createRouteMatcher([
  '/api(.*)',
  '/categories(.*)',
  '/demographics(.*)',
  '/inventory(.*)',
  '/manage-users(.*)',
  '/my-profile(.*)',
  '/overview(.*)',
  '/volunteer-landing(.*)',
  '/volunteer-add-pages(.*)',
  '/volunteer-remove-pages(.*)',
  '/volunteer-saved(.*)',
  '/volunteer-unsaved(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, user } = await auth();
  const { pathname, searchParams } = req.nextUrl;

  // Allow unauthenticated GET requests with phoneNumber query to /api/demographics
  if (
    pathname === '/api/demographics' &&
    req.method === 'GET' &&
    searchParams.has('phoneNumber')
  ) {
    return NextResponse.next();
  }

  // Allow unauthenticated POST and PUT to /api/demographics
  if (
    pathname === '/api/demographics' &&
    (req.method === 'POST' || req.method === 'PUT')
  ) {
    return NextResponse.next();
  }

  // Allow GET /api/demographics only if user is admin
  if (
    pathname === '/api/demographics' &&
    req.method === 'GET' &&
    !searchParams.has('phoneNumber')
  ) {
    if (!userId || user?.publicMetadata?.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized: admin role required for full data access' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // Protect all other sensitive routes
  if (isProtectedRoute(req) && pathname !== "/login" && !userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from login
  if (userId && pathname === "/login" && !searchParams.has("justSignedOut")) {
    return NextResponse.redirect(new URL('/overview', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless referenced in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};