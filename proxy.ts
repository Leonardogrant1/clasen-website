import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';


const LANDING_ROUTES = /^\/(?!admin|api|sign-in|_next|.*\..*).*$/


export function proxy(request: NextRequest) {

  if (LANDING_ROUTES.test(request.nextUrl.pathname)) {
    const defaultLocale = "de"
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
}
