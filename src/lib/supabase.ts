import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes and server components)
export function createSupabaseServer() {
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

// Browser-side Supabase client (for client components)
export function createSupabaseBrowser() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a singleton for server-side use
let serverClient: ReturnType<typeof createSupabaseServer> | null = null;

export function getSupabaseServer() {
  if (!serverClient) {
    serverClient = createSupabaseServer();
  }
  return serverClient;
}