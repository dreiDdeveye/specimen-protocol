import { getSupabaseServer } from '@/lib/supabase';
import type { ChatMessage } from '@/types';

export async function getRecentMessages(
  limit: number = 50
): Promise<ChatMessage[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[DB] Error getting recent messages:', error);
    return [];
  }
  return (data || []) as ChatMessage[];
}

export async function getMessagesSince(
  since: Date
): Promise<ChatMessage[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .gt('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[DB] Error getting messages since:', error);
    return [];
  }
  return (data || []) as ChatMessage[];
}

export async function createMessage(
  observerId: string,
  username: string,
  message: string
): Promise<ChatMessage> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      observer_id: observerId,
      username,
      message,
    })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error creating message:', error);
    throw error;
  }
  return data as ChatMessage;
}

export async function getLastMessageByObserver(
  observerId: string
): Promise<ChatMessage | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('observer_id', observerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting last message:', error);
  }
  return data as ChatMessage | null;
}

export async function deleteMessage(id: number): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DB] Error deleting message:', error);
    throw error;
  }
}

export async function deleteMessagesByObserver(
  observerId: string
): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('observer_id', observerId);

  if (error) {
    console.error('[DB] Error deleting observer messages:', error);
    throw error;
  }
}

export async function clearAllMessages(): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .neq('id', 0); // Delete all rows

  if (error) {
    console.error('[DB] Error clearing messages:', error);
    throw error;
  }
}

export async function pruneOldMessages(
  hoursOld: number = 24
): Promise<number> {
  const supabase = getSupabaseServer();
  const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('chat_messages')
    .delete()
    .lt('created_at', cutoff)
    .select('id');

  if (error) {
    console.error('[DB] Error pruning messages:', error);
    return 0;
  }
  return data?.length || 0;
}

export async function getMessageCount(): Promise<number> {
  const supabase = getSupabaseServer();
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[DB] Error getting message count:', error);
    return 0;
  }
  return count || 0;
}
