import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se sei già su /en o /it (o su file statici), non fare nulla
  if (pathname.startsWith("/en") || pathname.startsWith("/it") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Default: inglese
  return NextResponse.redirect(new URL(`/en${pathname === "/" ? "" : pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!api).*)"],
};
