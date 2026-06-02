import { createClient } from "@supabase/supabase-js";

// Load keys from environment with fallbacks to guarantee immediate out-of-the-box operation
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://dkvwmiwgoghcnsceabjk.supabase.co";

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  "sb_publishable_V5Z7mMX97rEwwma_3irLHA_kX6mc8Xg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
