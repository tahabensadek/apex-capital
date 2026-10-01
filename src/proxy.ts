import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * HTTP Basic Auth in front of the internal tools (CRM, board, financials, underwriting)
 * and the APIs that return lead data. Without this, anyone could read clients'
 * names and phone numbers at /api/crm/leads.
 *
 * Set ADMIN_USER and ADMIN_PASSWORD in the environment. If ADMIN_PASSWORD is not set,
 * access is allowed only in local development.
 */
export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const [user, ...rest] = atob(header.slice(6)).split(":");
    if (user === expectedUser && rest.join(":") === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CapitalFacile admin"' },
  });
}

export const config = {
  matcher: [
    "/crm/:path*",
    "/board/:path*",
    "/financials/:path*",
    "/admin/:path*",
    "/api/crm/:path*",
    "/api/board/:path*",
    "/api/underwrite/:path*",
  ],
};
