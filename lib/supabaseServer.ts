import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin Client for restricted read access (used ONLY in server components/actions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
