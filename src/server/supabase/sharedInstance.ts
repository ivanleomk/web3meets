import { createClient } from "@supabase/supabase-js";
import { type Database } from "../../types/database-raw";

export const serverSupabaseInstance = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export const adminServerSupabaseInstance = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE as string
);
