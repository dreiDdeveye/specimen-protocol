import { getSupabaseServer } from '@/lib/supabase';

// Re-export the Supabase client as our database client
export const getDb = getSupabaseServer;
