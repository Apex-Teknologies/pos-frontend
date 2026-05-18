import { NextRequest, NextResponse } from 'next/server'

// Middleware is skipped in static export (GitHub Pages) — auth is enforced client-side instead
export function middleware(request: NextRequest) {
  const auth = request.cookies.get('apextek-auth')
  const { pathname } = request.nextUrl

  const publicPaths = ['/login', '/pin']
  if (publicPaths.some((p) => pathname.startsWith(p))) return NextResponse.next()

  if (!auth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(auth.value))
    if (!parsed?.state?.isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Exclude static assets and API routes; also skip entirely during static export
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
