import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Valid locales from routing config
const locales = routing.locales;

// Routes that require authentication (without locale prefix)
const protectedRoutes = ["/admin"];

// Routes that require admin role
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname (e.g., /de/admin/overview -> de)
  const pathnameSegments = pathname.split("/");
  const firstSegment = pathnameSegments[1] || "";
  
  // Check if first segment is a valid locale
  const hasLocalePrefix = locales.includes(firstSegment as "de" | "en");
  const locale = hasLocalePrefix ? firstSegment : routing.defaultLocale;

  // Get the path without locale prefix (only strip if it's actually a locale)
  const pathWithoutLocale = hasLocalePrefix 
    ? "/" + pathnameSegments.slice(2).join("/")
    : pathname;


  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to sign-in
    if (!token) {
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if token is expired
    if (token.exp && Date.now() >= (token.exp as number) * 1000) {
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set("expired", "true");
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, check if user has admin role
    if (isAdminRoute) {
      const userRole = token.role as string;

      // Allow SUPER ADMIN role only
      if (userRole !== "SUPER ADMIN") {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    }
  }

  // Continue with intl middleware for all requests
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except Next.js internals and static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
