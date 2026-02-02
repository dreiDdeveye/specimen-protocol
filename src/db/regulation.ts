import { getSupabaseServer } from '@/lib/supabase';

export interface RegulationSettings {
  chat_enabled: boolean;
  chat_cooldown_seconds: number;
  chat_max_length: number;
  evolution_enabled: boolean;
  evolution_paused: boolean;
  auto_prune_hours: number;
}

export interface MutedUser {
  observer_id: string;
  username: string;
  muted_until: Date | null;
  shadow_muted: boolean;
  reason: string | null;
  created_at: Date;
}

const DEFAULT_SETTINGS: RegulationSettings = {
  chat_enabled: true,
  chat_cooldown_seconds: 5,
  chat_max_length: 160,
  evolution_enabled: true,
  evolution_paused: false,
  auto_prune_hours: 24,
};

export async function getRegulationSetting<T>(
  key: keyof RegulationSettings
): Promise<T> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('regulation_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return DEFAULT_SETTINGS[key] as T;
  }
  return data.value as T;
}

export async function getAllRegulationSettings(): Promise<RegulationSettings> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('regulation_settings')
    .select('key, value');

  if (error || !data) {
    return DEFAULT_SETTINGS;
  }

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of data) {
    if (row.key in settings) {
      (settings as Record<string, unknown>)[row.key] = row.value;
    }
  }
  return settings;
}

export async function updateRegulationSetting(
  key: keyof RegulationSettings,
  value: unknown
): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('regulation_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('[DB] Error updating regulation setting:', error);
    throw error;
  }
}

export async function updateRegulationSettings(
  settings: Partial<RegulationSettings>
): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    await updateRegulationSetting(key as keyof RegulationSettings, value);
  }
}

// ============ MUTED USERS ============

export async function getMutedUsers(): Promise<MutedUser[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('muted_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] Error getting muted users:', error);
    return [];
  }
  return (data || []) as MutedUser[];
}

export async function getMutedUser(
  observerId: string
): Promise<MutedUser | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('muted_users')
    .select('*')
    .eq('observer_id', observerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting muted user:', error);
  }
  return data as MutedUser | null;
}

export async function isUserMuted(observerId: string): Promise<{
  muted: boolean;
  shadowMuted: boolean;
}> {
  const muted = await getMutedUser(observerId);
  if (!muted) {
    return { muted: false, shadowMuted: false };
  }

  // Check if temporary mute has expired
  if (muted.muted_until && new Date(muted.muted_until) < new Date()) {
    await unmuteUser(observerId);
    return { muted: false, shadowMuted: false };
  }

  return {
    muted: true,
    shadowMuted: muted.shadow_muted,
  };
}

export async function muteUser(
  observerId: string,
  username: string,
  options: {
    duration?: number; // minutes, null for permanent
    shadowMuted?: boolean;
    reason?: string;
  } = {}
): Promise<MutedUser> {
  const supabase = getSupabaseServer();
  const mutedUntil = options.duration
    ? new Date(Date.now() + options.duration * 60 * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('muted_users')
    .upsert({
      observer_id: observerId,
      username,
      muted_until: mutedUntil,
      shadow_muted: options.shadowMuted ?? false,
      reason: options.reason || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error muting user:', error);
    throw error;
  }
  return data as MutedUser;
}

export async function unmuteUser(observerId: string): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('muted_users')
    .delete()
    .eq('observer_id', observerId);

  if (error) {
    console.error('[DB] Error unmuting user:', error);
    throw error;
  }
}

export async function clearAllMutes(): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('muted_users')
    .delete()
    .neq('observer_id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('[DB] Error clearing mutes:', error);
    throw error;
  }
}

// Initialize regulation settings if needed
export async function initializeRegulationTables(): Promise<void> {
  const supabase = getSupabaseServer();
  
  // Insert default settings if not exist
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const { error } = await supabase
      .from('regulation_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
        ignoreDuplicates: true,
      });
    
    if (error) {
      console.error('[DB] Error initializing setting:', key, error);
    }
  }
}
