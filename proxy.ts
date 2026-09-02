import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// ==========================================
// 🛠️ OFFLINE MODUS EIN-/AUSSCHALTEN
// ==========================================
// true  = Website ist offline, alle Besucher werden auf /offline umgeleitet.
// false = Website ist online (Normalbetrieb).
const OFFLINE_MODE = false;

const LANDING_ROUTES = /^\/(?!admin|api|sign-in|_next|.*\..*).*$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (OFFLINE_MODE) {
    // 1. Allow internal Next.js assets, API routes, logo/background assets, 
    // favicon/manifest files, and the offline page itself to pass through.
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/logo") ||
      pathname.startsWith("/backgrounds") ||
      pathname.startsWith("/icons") ||
      pathname.startsWith("/video") ||
      pathname === "/offline" ||
      pathname.includes(".") // matches static files with extensions like .png, .svg, .webmanifest, .ico
    ) {
      return NextResponse.next();
    }

    // 2. Redirect all other requests to /offline
    const url = request.nextUrl.clone();
    url.pathname = "/offline";
    return NextResponse.redirect(url);
  }

  // --- Normaler Betrieb (wenn offline Modus aus ist) ---
  if (LANDING_ROUTES.test(request.nextUrl.pathname)) {
    const defaultLocale = "de";
    const handleI18nRouting = createMiddleware({
      locales: ['en', 'de', "ru", "zh"],
      defaultLocale,
      localePrefix: 'as-needed'
    });
    const response = handleI18nRouting(request);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|ingest|favicon\\.ico|.*\\..*).*)'],
};
