"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function linkWhatsAppNumber(userId: string, phoneNumber: string) {
  try {
    const { error, data } = await supabaseAdmin
      .from("user_preferences")
      .update({ phone_number: phoneNumber })
      .eq("user_id", userId)
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
        .insert({ user_id: userId, phone_number: phoneNumber });

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
