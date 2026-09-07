import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { parseWhatsAppMessage } from "@/lib/whatsapp-parser";

const twimlResponse = (message: string) => {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
};

export async function POST(req: Request) {
  try {
    // 1. Webhook Authentication: Check secret token
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get("token");
    const secretHeader = req.headers.get("x-webhook-secret");
    const configuredSecret = process.env.WA_WEBHOOK_SECRET;

    if (process.env.NODE_ENV === "production" && !configuredSecret) {
      console.error("[CRITICAL] WA_WEBHOOK_SECRET is not configured in production.");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    if (configuredSecret) {
      const providedToken = tokenParam || secretHeader;
      if (!providedToken || providedToken !== configuredSecret) {
        return new NextResponse("Unauthorized webhook call", { status: 401 });
      }
    }

    const formData = await req.formData();
    const text = formData.get("Body")?.toString()?.trim() || "";
    const sender = formData.get("From")?.toString()?.trim() || "";

    if (!text) return twimlResponse("Pesan kosong.");

    const phoneNumber = sender
      .replace("whatsapp:", "")
      .replace(/[^\d+]/g, "")
      .trim();
    if (!phoneNumber) {
      return twimlResponse("Nomor pengirim tidak valid.");
    }

    const { data: userPref } = await supabaseAdmin
      .from("user_preferences")
      .select("user_id, settings")
      .eq("phone_number", phoneNumber)
      .single();

    if (!userPref) {
      return twimlResponse(
        "Nomor belum terdaftar di aplikasi. Silakan update phone_number di database."
      );
    }

    const categories = userPref.settings?.categories || [];
    const fallbackCat = categories.find((c: any) => c.name === "Other Expenses") || categories[0];
    const fallbackCatId = fallbackCat?.id || "whatsapp-expense";

    const transactions = parseWhatsAppMessage(text, categories, fallbackCatId, userPref.user_id);

    if (transactions.length > 0) {
      const { error } = await supabaseAdmin.from("transactions").insert(transactions);
      if (error) {
        console.error("Insert error:", error);
        return twimlResponse("Gagal menyimpan ke database.");
      }
      return twimlResponse(`Berhasil menyimpan ${transactions.length} transaksi!`);
    }

    return twimlResponse("Format tidak dikenali. Gunakan awalan WDBUY atau WEBUY.");
  } catch (err: any) {
    console.error("WA Webhook Error:", err);
    return twimlResponse("Terjadi kesalahan sistem.");
  }
}
