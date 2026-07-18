import { createClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co'
}

export const supabase = createClient(supabaseUrl, supabaseKey)
