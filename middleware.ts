import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never touch API routes — external callers (Stripe webhooks, etc.)
  // don't follow redirects, so a redirect here silently drops the request.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Files with an extension (images, etc.) shouldn't get a trailing slash.
  const hasExtension = /\.[^/]+$/.test(pathname);

  if (!hasExtension && !pathname.endsWith("/")) {
    const url = req.nextUrl.clone();
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
