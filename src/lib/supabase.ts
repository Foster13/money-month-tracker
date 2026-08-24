import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ponytail: One line initialization. No extra wrappers needed.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
