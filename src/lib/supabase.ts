import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes and server components)
// Creates a NEW client each time to avoid caching issues
export function getSupabaseServer() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Alias for backward compatibility
export const createSupabaseServer = getSupabaseServer;

// Browser-side Supabase client (for client components)
export function createSupabaseBrowser() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}