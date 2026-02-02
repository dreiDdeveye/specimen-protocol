import { getSupabaseServer } from '@/lib/supabase';
import type { Observer } from '@/types';

export async function findObserverByFingerprint(
  fingerprint: string
): Promise<Observer | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .eq('browser_fingerprint', fingerprint)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error finding observer by fingerprint:', error);
  }
  return data as Observer | null;
}

export async function findObserverByUsername(
  username: string
): Promise<Observer | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error finding observer by username:', error);
  }
  return data as Observer | null;
}

export async function findObserverById(id: string): Promise<Observer | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error finding observer by id:', error);
  }
  return data as Observer | null;
}

export async function createObserver(
  username: string,
  fingerprint: string
): Promise<Observer> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('observers')
    .insert({
      username,
      browser_fingerprint: fingerprint,
    })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error creating observer:', error);
    throw error;
  }
  return data as Observer;
}

export async function updateObserverLastSeen(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('observers')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[DB] Error updating last seen:', error);
  }
}

export async function getAllObservers(): Promise<Observer[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .order('last_seen_at', { ascending: false });

  if (error) {
    console.error('[DB] Error getting all observers:', error);
    return [];
  }
  return (data || []) as Observer[];
}

export async function getActiveObservers(
  minutesAgo: number = 5
): Promise<Observer[]> {
  const supabase = getSupabaseServer();
  const cutoff = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .gte('last_seen_at', cutoff)
    .order('last_seen_at', { ascending: false });

  if (error) {
    console.error('[DB] Error getting active observers:', error);
    return [];
  }
  return (data || []) as Observer[];
}

export async function deleteObserver(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('observers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DB] Error deleting observer:', error);
    throw error;
  }
}
