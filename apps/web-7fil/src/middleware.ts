import { NextRequest, NextResponse } from 'next/server'

// Subdomains that are reserved — never treat as agency subdomains
const RESERVED = new Set([
  'www', 'app', 'api', 'mail', 'smtp', 'admin', 'panel',
  'cdn', 'static', 'media', 'staging', 'dev', 'test',
])

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? '7fil.com.tr'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const url = req.nextUrl.clone()

  // Strip port for local dev
  const hostname = host.split(':')[0] ?? ''

  // Detect subdomain: xyz.7fil.com.tr → xyz
  // In development: xyz.localhost → xyz
  let subdomain: string | null = null

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostname.slice(0, -(ROOT_DOMAIN.length + 1))
  } else if (hostname.endsWith('.localhost')) {
    subdomain = hostname.slice(0, -'.localhost'.length)
  }

  // Ignore reserved subdomains and empty
  if (!subdomain || RESERVED.has(subdomain)) {
    return NextResponse.next()
  }

  // Already on /s/ path — don't rewrite again
  if (url.pathname.startsWith('/s/')) {
    return NextResponse.next()
  }

  // Rewrite subdomain requests to /s/[subdomain]/...
  // e.g. abc-emlak.7fil.com.tr/ilan/xyz → /s/abc-emlak/ilan/xyz
  url.pathname = `/s/${subdomain}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Run on all paths except static files, _next, and api
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
