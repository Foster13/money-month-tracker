"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function linkWhatsAppNumber(userId: string, phoneNumber: string) {
  try {
    const { error } = await supabaseAdmin
      .from("user_preferences")
      .update({ phone_number: phoneNumber })
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to link number" };
  }
}
