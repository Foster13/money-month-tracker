import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ponytail: strip heavy Next.js Server Action cookies before sending to Supabase API Gateway
  // to avoid HTTP 494 "Request Header Too Large" errors when using the proxy.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("cookie");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/api/supabase/:path*",
};
