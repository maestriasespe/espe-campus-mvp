import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Require session cookie for everything else
  const cookie = req.cookies.get("espe_session");
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude Next internals and common static assets
    "/((?!_next/static|_next/image|_next/data|favicon.ico|manifest.json|sw.js|workbox-.*\\.js|icons/).*)",
  ],
};
