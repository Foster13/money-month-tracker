import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Read target path from search params, e.g. /api/proxy?path=/rest/v1/transactions
  const path = req.nextUrl.searchParams.get("path") || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!supabaseUrl) return NextResponse.json({ error: "Missing Supabase URL" }, { status: 500 });

  const targetUrl = `${supabaseUrl}${path}`;

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
  ];

  allowedHeaders.forEach((key) => {
    const value = req.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  });

  const bodyText = await req.text();
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
