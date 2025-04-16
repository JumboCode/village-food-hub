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
import { clerkClient } from '@clerk/clerk-sdk-node';
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
  const { userId } = await auth();

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute(req) && req.nextUrl.pathname !== "/login" && !userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Handle logged-in users visiting /login (e.g. redirect based on role)
  if (userId && req.nextUrl.pathname === "/login") {
    try {
      const user = await clerkClient.users.getUser(userId);
      const roleRaw = user?.publicMetadata?.role;
      const role = typeof roleRaw === 'string' ? roleRaw.toLowerCase() : undefined;

      console.log("Middleware resolved role:", role);

      switch (role) {
        case 'customer':
          return NextResponse.redirect(new URL("/welcome-page", req.url));
        case 'volunteer':
          return NextResponse.redirect(new URL("/volunteer-landing", req.url));
        case 'admin':
        case 'staff':
          return NextResponse.redirect(new URL("/overview", req.url));
        default:
          console.warn("Unrecognized role, falling back to overview:", role);
          return NextResponse.redirect(new URL("/overview", req.url));
      }
    } catch (err) {
      console.error("Failed to fetch Clerk user in middleware:", err);
      // Fallback route if Clerk fetch fails
      return NextResponse.redirect(new URL("/overview", req.url));
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