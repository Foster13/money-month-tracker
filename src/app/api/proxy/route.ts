import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Read target path from search params, e.g. /api/proxy?path=/rest/v1/transactions
  const path = req.nextUrl.searchParams.get("path") || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!supabaseUrl) return NextResponse.json({ error: "Missing Supabase URL" }, { status: 500 });

  // 1. Path Safety & SSRF Validation
  if (
    !path.startsWith("/") ||
    path.includes("..") ||
    path.includes("@") ||
    path.includes("://") ||
    path.includes("\\")
  ) {
    return NextResponse.json({ error: "Invalid proxy path" }, { status: 400 });
  }

  // Whitelist allowable Supabase service prefixes
  const allowedPrefixes = [
    "/rest/v1/",
    "/auth/v1/",
    "/storage/v1/",
    "/realtime/v1/",
    "/functions/v1/",
  ];

  const isAllowedPrefix = allowedPrefixes.some((prefix) => path.startsWith(prefix));
  if (!isAllowedPrefix) {
    return NextResponse.json({ error: "Forbidden proxy path" }, { status: 403 });
  }

  let targetUrl: URL;
  try {
    const baseUrl = new URL(supabaseUrl);
    targetUrl = new URL(path, baseUrl);
    // Ensure origin cannot be spoofed
    if (targetUrl.origin !== baseUrl.origin) {
      return NextResponse.json({ error: "Origin mismatch" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Malformed URL" }, { status: 400 });
  }

  // Whitelist headers to prevent REQUEST_HEADER_TOO_LARGE from Next.js internal headers
  const headers = new Headers();
  const allowedHeaders = [
    "authorization",
    "apikey",
    "content-type",
    "prefer",
    "x-client-info",
    "accept",
    "content-profile",
    "accept-profile",
    "range",
  ];

  allowedHeaders.forEach((key) => {
    const value = req.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  });

  let bodyText = "";
  if (req.method !== "GET" && req.method !== "HEAD") {
    bodyText = await req.text();
  }
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : bodyText || undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Support other methods if needed
export const GET = POST;
export const PATCH = POST;
export const PUT = POST;
export const DELETE = POST;
export const OPTIONS = POST;
export const HEAD = POST;
