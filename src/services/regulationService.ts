import {
  getAllRegulationSettings,
  updateRegulationSettings,
  updateRegulationSetting,
  getMutedUsers,
  muteUser,
  unmuteUser,
  clearAllMutes,
  initializeRegulationTables,
  type RegulationSettings,
  type MutedUser,
} from '@/db/regulation';
import {
  clearAllMessages,
  pruneOldMessages,
  getMessageCount,
} from '@/db/chat';
import {
  createEvolutionStage,
  updateEvolutionThreshold,
  deleteEvolutionStage,
  createSystemEvent,
} from '@/db/specimen';

// ============ INITIALIZATION ============

export async function initializeRegulation(): Promise<void> {
  await initializeRegulationTables();
}

// ============ SETTINGS ============

export async function getSettings(): Promise<RegulationSettings> {
  return getAllRegulationSettings();
}

export async function updateSettings(
  settings: Partial<RegulationSettings>
): Promise<void> {
  await updateRegulationSettings(settings);
  await createSystemEvent('SETTINGS_UPDATED', { changes: settings });
}

export async function toggleChat(enabled: boolean): Promise<void> {
  await updateRegulationSetting('chat_enabled', enabled);
  await createSystemEvent('CHAT_TOGGLED', { enabled });
}

export async function setChatCooldown(seconds: number): Promise<void> {
  if (seconds < 0 || seconds > 300) {
    throw new Error('Cooldown must be between 0 and 300 seconds');
  }
  await updateRegulationSetting('chat_cooldown_seconds', seconds);
  await createSystemEvent('CHAT_COOLDOWN_CHANGED', { seconds });
}

export async function setChatMaxLength(length: number): Promise<void> {
  if (length < 1 || length > 1000) {
    throw new Error('Max length must be between 1 and 1000');
  }
  await updateRegulationSetting('chat_max_length', length);
  await createSystemEvent('CHAT_MAX_LENGTH_CHANGED', { length });
}

export async function toggleEvolution(enabled: boolean): Promise<void> {
  await updateRegulationSetting('evolution_enabled', enabled);
  await createSystemEvent('EVOLUTION_TOGGLED', { enabled });
}

export async function pauseEvolution(paused: boolean): Promise<void> {
  await updateRegulationSetting('evolution_paused', paused);
  await createSystemEvent('EVOLUTION_PAUSED', { paused });
}

// ============ MUTING ============

export async function listMutedUsers(): Promise<MutedUser[]> {
  return getMutedUsers();
}

export async function muteObserver(
  observerId: string,
  username: string,
  options: {
    duration?: number;
    shadowMuted?: boolean;
    reason?: string;
  } = {}
): Promise<MutedUser> {
  const muted = await muteUser(observerId, username, options);
  await createSystemEvent('USER_MUTED', {
    observerId,
    username,
    duration: options.duration,
    shadowMuted: options.shadowMuted,
    reason: options.reason,
  });
  return muted;
}

export async function unmuteObserver(observerId: string): Promise<void> {
  await unmuteUser(observerId);
  await createSystemEvent('USER_UNMUTED', { observerId });
}

export async function clearMutes(): Promise<void> {
  await clearAllMutes();
  await createSystemEvent('ALL_MUTES_CLEARED', {});
}

// ============ CHAT MANAGEMENT ============

export async function clearChat(): Promise<void> {
  await clearAllMessages();
  await createSystemEvent('CHAT_CLEARED', {
    timestamp: new Date().toISOString(),
  });
}

export async function pruneChat(hoursOld: number = 24): Promise<number> {
  const count = await pruneOldMessages(hoursOld);
  await createSystemEvent('CHAT_PRUNED', { hoursOld, messagesDeleted: count });
  return count;
}

export async function getChatStats(): Promise<{
  totalMessages: number;
}> {
  const totalMessages = await getMessageCount();
  return { totalMessages };
}

// ============ EVOLUTION MANAGEMENT ============

export async function upsertEvolutionStage(
  stage: number,
  name: string,
  marketCapRequired: number,
  description?: string,
  assetUrl?: string
): Promise<void> {
  await createEvolutionStage(stage, name, marketCapRequired, description, assetUrl);
  await createSystemEvent('EVOLUTION_STAGE_UPSERTED', {
    stage,
    name,
    marketCapRequired,
  });
}

export async function updateStageThreshold(
  stage: number,
  marketCapRequired: number
): Promise<void> {
  await updateEvolutionThreshold(stage, marketCapRequired);
  await createSystemEvent('STAGE_THRESHOLD_UPDATED', {
    stage,
    marketCapRequired,
  });
}

export async function removeEvolutionStage(stage: number): Promise<void> {
  await deleteEvolutionStage(stage);
  await createSystemEvent('EVOLUTION_STAGE_REMOVED', { stage });
}

// ============ SYSTEM EVENTS ============

export async function injectEvent(
  eventType: string,
  payload?: Record<string, unknown>
): Promise<void> {
  await createSystemEvent(eventType, payload);
}

export async function broadcastSystemMessage(message: string): Promise<void> {
  await createSystemEvent('SYSTEM_BROADCAST', {
    message,
    timestamp: new Date().toISOString(),
  });
}
