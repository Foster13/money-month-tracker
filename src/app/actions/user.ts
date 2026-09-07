"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function linkWhatsAppNumber(phoneNumber: string, accessToken?: string) {
  try {
    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized: Sesi tidak ditemukan. Silakan login kembali.",
      };
    }

    // Authenticate user via Supabase Auth using the access token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return { success: false, error: "Unauthorized: Sesi tidak valid atau telah kedaluwarsa." };
    }

    const verifiedUserId = user.id;

    // Validate phone number format (E.164 standard)
    const sanitizedPhone = phoneNumber.trim();
    if (!/^\+[1-9]\d{6,14}$/.test(sanitizedPhone)) {
      return {
        success: false,
        error:
          "Format nomor WhatsApp tidak valid. Gunakan format internasional (contoh: +6281234567890).",
      };
    }

    const { error, data } = await supabaseAdmin
      .from("user_preferences")
      .update({ phone_number: sanitizedPhone })
      .eq("user_id", verifiedUserId)
      .select();

    if (error) {
      if (error.code === "23505" || error.message.includes("duplicate")) {
        return { success: false, error: "Nomor WA ini udah dipake akun lain." };
      }
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      // Row didn't exist, insert it!
      const { error: insertError } = await supabaseAdmin
        .from("user_preferences")
        .insert({ user_id: verifiedUserId, phone_number: sanitizedPhone });

      if (insertError) {
        if (insertError.code === "23505" || insertError.message.includes("duplicate")) {
          return { success: false, error: "Nomor WA ini udah dipake akun lain." };
        }
        return { success: false, error: insertError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to link number" };
  }
}
