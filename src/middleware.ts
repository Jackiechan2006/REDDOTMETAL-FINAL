import { NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (/^\/(en|ms|zh|ta|bn)\/admin\/dashboard/.test(pathname)) {
    const token = req.cookies.get("admin_token")?.value
    if (!token) {
      const locale = pathname.split("/")[1] ?? "en"
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url))
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
