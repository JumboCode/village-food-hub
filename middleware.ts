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
  '/welcome-page(.*)',
  '/customer-questions(.*)',
  '/unsaved-thank-you(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, user } = await auth()
  // If the request is for a protected route and is NOT "/login", enforce authentication
  if (isProtectedRoute(req) && req.nextUrl.pathname !== "/login" && !userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // TODO: This causes a bug when the user is a volunteer. Should redirect to landing
  // TODO: STILL WORKING ON THIS -jiyoon
  // If an authenticated user visits "/login", redirect them to "/overview"
  if (userId && req.nextUrl.pathname === "/login" && !req.nextUrl.searchParams.has("justSignedOut")) {
    if (user?.publicMetadata?.role == 'Admin' || user?.publicMetadata?.role == 'Staff') {
      return NextResponse.redirect(new URL('/overview', req.url));
    } else if (user?.publicMetadata?.role == 'Customer') {
      return NextResponse.redirect(new URL('/welcome-page', req.url));
    } else if (user?.publicMetadata?.role == 'Volunteer') {
      return NextResponse.redirect(new URL('/volunteer-landing', req.url));
    }
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