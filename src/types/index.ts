// Observer (Anonymous User)
export interface Observer {
  id: string;
  username: string;
  browser_fingerprint: string;
  created_at: Date;
  last_seen_at: Date;
}

// Chat Message
export interface ChatMessage {
  id: number;
  observer_id: string;
  username: string;
  message: string;
  created_at: Date;
}

// Evolution Stage
export interface EvolutionStage {
  stage: number;
  name: string;
  market_cap_required: number;
  description: string | null;
  asset_url: string | null;
}

// Specimen State
export interface SpecimenState {
  id: number;
  current_stage: number;
  market_cap: number;
  evolution_progress: number;
  updated_at: Date;
}

// Market Cap Snapshot
export interface MarketCapSnapshot {
  id: number;
  market_cap: number;
  recorded_at: Date;
}

// System Event
export interface SystemEvent {
  id: number;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: Date;
}

// Regulation Settings (stored in database or config)
export interface RegulationSettings {
  chat_enabled: boolean;
  chat_cooldown_seconds: number;
  chat_max_length: number;
  evolution_enabled: boolean;
  evolution_paused: boolean;
}

// Chat message with system flag
export interface ChatDisplayMessage extends ChatMessage {
  is_system?: boolean;
}

// Real-time update payloads
export interface SpecimenUpdate {
  state: SpecimenState;
  stage: EvolutionStage;
}

export interface ChatUpdate {
  type: 'message' | 'clear' | 'system';
  message?: ChatMessage;
  systemMessage?: string;
}

// Admin types
export interface MutedUser {
  observer_id: string;
  username: string;
  muted_until: Date;
  shadow_muted: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
