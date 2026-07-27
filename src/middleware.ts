import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["zh", "en", "ms"];
const DEFAULT_LOCALE = "zh";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale
    const url = new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon|health).*)",
  ],
};
