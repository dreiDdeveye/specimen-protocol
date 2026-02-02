import {
  createMessage,
  getRecentMessages,
  getLastMessageByObserver,
  getMessagesSince,
} from '@/db/chat';
import {
  getRegulationSetting,
  isUserMuted,
} from '@/db/regulation';
import { updateObserverLastSeen } from '@/db/observers';
import type { ChatMessage } from '@/types';

export interface SendMessageResult {
  success: boolean;
  message?: ChatMessage;
  error?: string;
  shadowMuted?: boolean;
}

export async function sendMessage(
  observerId: string,
  username: string,
  content: string
): Promise<SendMessageResult> {
  // Check if chat is enabled
  const chatEnabled = await getRegulationSetting<boolean>('chat_enabled');
  if (!chatEnabled) {
    return { success: false, error: 'Chat is currently disabled' };
  }

  // Check if user is muted
  const muteStatus = await isUserMuted(observerId);
  if (muteStatus.muted) {
    if (muteStatus.shadowMuted) {
      // Shadow muted - pretend message was sent
      const fakeMessage: ChatMessage = {
        id: -1,
        observer_id: observerId,
        username,
        message: content,
        created_at: new Date(),
      };
      return { success: true, message: fakeMessage, shadowMuted: true };
    }
    return { success: false, error: 'You have been muted' };
  }

  // Validate message length
  const maxLength = await getRegulationSetting<number>('chat_max_length');
  if (content.length > maxLength) {
    return {
      success: false,
      error: `Message too long (max ${maxLength} characters)`,
    };
  }

  // Validate message content
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { success: false, error: 'Message cannot be empty' };
  }

  // Check cooldown
  const cooldownSeconds = await getRegulationSetting<number>('chat_cooldown_seconds');
  const lastMessage = await getLastMessageByObserver(observerId);
  if (lastMessage) {
    const lastMessageTime = new Date(lastMessage.created_at).getTime();
    const now = Date.now();
    const elapsed = (now - lastMessageTime) / 1000;
    
    if (elapsed < cooldownSeconds) {
      const remaining = Math.ceil(cooldownSeconds - elapsed);
      return {
        success: false,
        error: `Please wait ${remaining} seconds`,
      };
    }
  }

  // Update last seen
  await updateObserverLastSeen(observerId);

  // Create message
  try {
    const message = await createMessage(observerId, username, trimmed);
    return { success: true, message };
  } catch (error) {
    console.error('[ChatService] Failed to create message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function fetchMessages(limit: number = 50): Promise<ChatMessage[]> {
  const messages = await getRecentMessages(limit);
  // Return in chronological order
  return messages.reverse();
}

export async function fetchNewMessages(since: Date): Promise<ChatMessage[]> {
  return getMessagesSince(since);
}

export function sanitizeMessage(content: string): string {
  // Remove control characters and excessive whitespace
  return content
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
