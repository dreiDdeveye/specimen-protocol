import { createClient } from '@supabase/supabase-js';
import { createServerClient, createBrowserClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Types for our database
export type Database = {
  public: {
    Tables: {
      observers: {
        Row: {
          id: string;
          username: string;
          browser_fingerprint: string;
          created_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          browser_fingerprint: string;
          created_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          browser_fingerprint?: string;
          created_at?: string;
          last_seen_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: number;
          observer_id: string;
          username: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          observer_id: string;
          username: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          observer_id?: string;
          username?: string;
          message?: string;
          created_at?: string;
        };
      };
      evolution_stages: {
        Row: {
          stage: number;
          name: string;
          market_cap_required: number;
          description: string | null;
          asset_url: string | null;
        };
        Insert: {
          stage: number;
          name: string;
          market_cap_required: number;
          description?: string | null;
          asset_url?: string | null;
        };
        Update: {
          stage?: number;
          name?: string;
          market_cap_required?: number;
          description?: string | null;
          asset_url?: string | null;
        };
      };
      specimen_state: {
        Row: {
          id: number;
          current_stage: number;
          market_cap: number;
          evolution_progress: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          current_stage: number;
          market_cap: number;
          evolution_progress: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          current_stage?: number;
          market_cap?: number;
          evolution_progress?: number;
          updated_at?: string;
        };
      };
      market_cap_snapshots: {
        Row: {
          id: number;
          market_cap: number;
          recorded_at: string;
        };
        Insert: {
          id?: number;
          market_cap: number;
          recorded_at?: string;
        };
        Update: {
          id?: number;
          market_cap?: number;
          recorded_at?: string;
        };
      };
      system_events: {
        Row: {
          id: number;
          event_type: string;
          payload: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          event_type: string;
          payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          event_type?: string;
          payload?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      regulation_settings: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: unknown;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: unknown;
          updated_at?: string;
        };
      };
      muted_users: {
        Row: {
          observer_id: string;
          username: string;
          muted_until: string | null;
          shadow_muted: boolean;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          observer_id: string;
          username: string;
          muted_until?: string | null;
          shadow_muted?: boolean;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          observer_id?: string;
          username?: string;
          muted_until?: string | null;
          shadow_muted?: boolean;
          reason?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Server-side Supabase client (for API routes and server components)
export function createSupabaseServer() {
  return createClient<Database>(
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
  return createClient<Database>(
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
