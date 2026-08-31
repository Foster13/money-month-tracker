import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/supabase`
    : process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

// ponytail: Use sessionStorage so closing the tab wipes the login state (forced re-login).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
  },
});
