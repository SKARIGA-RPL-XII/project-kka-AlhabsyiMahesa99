import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // Biar login gak hilang pas di-refresh
    autoRefreshToken: true,    // Biar token gak expired tiba-tiba
    detectSessionInUrl: true,  // Penting buat proses konfirmasi email/OAuth
    storageKey: 'recyloop-auth', // Nama key buat simpen session
  }
})