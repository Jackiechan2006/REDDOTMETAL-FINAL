import { createClient, SupabaseClient } from "@supabase/supabase-js"

function getEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing environment variable: ${key}`)
  return val
}

/**
 * Public client — anon key, subject to RLS.
 * Safe for browser and server components for public operations.
 */
export function getSupabaseClient(): SupabaseClient {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: true, autoRefreshToken: true } }
  )
}

/** Singleton for client-side use */
let _client: SupabaseClient | null = null
export function getSupabaseSingleton(): SupabaseClient {
  if (!_client) _client = getSupabaseClient()
  return _client
}

export const supabase = {
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) =>
      getSupabaseClient().auth.signInWithPassword(credentials),
    signOut: () => getSupabaseClient().auth.signOut(),
  },
}

/**
 * Admin/service client — service role key, bypasses RLS.
 * NEVER use on frontend. API routes only.
 */
export function getAdminSupabaseClient(): SupabaseClient {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
