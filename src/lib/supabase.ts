import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

// ponytail: Direct connection initialized, but we intercept fetch to use our proxy route.
// This bypasses adblockers on HP/PC and strips cookies to prevent 494 Header Too Large.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  global: {
    fetch: (url, options) => {
      if (typeof window === "undefined") return fetch(url, options); // SSR doesn't need proxy
      const path = url.toString().replace(supabaseUrl, "");
      const proxyUrl = `/api/proxy?path=${encodeURIComponent(path)}`;
      return fetch(proxyUrl, options);
    },
  },
});
