import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Read target path from search params, e.g. /api/proxy?path=/rest/v1/transactions
  const path = req.nextUrl.searchParams.get("path") || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!supabaseUrl) return NextResponse.json({ error: "Missing Supabase URL" }, { status: 500 });

  const targetUrl = `${supabaseUrl}${path}`;

  // Clone headers but strip cookies
  const headers = new Headers(req.headers);
  headers.delete("cookie");
  headers.delete("host"); // Let fetch set the correct host

  const body = await req.text();

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
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
export const DELETE = POST;
export const OPTIONS = POST;
