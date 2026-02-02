-- SPECIMEN PROTOCOL DATABASE SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor (Database > SQL Editor)

-- ============================================
-- OBSERVERS TABLE
-- Stores anonymous user identities
-- ============================================
CREATE TABLE IF NOT EXISTS observers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  browser_fingerprint TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS observers_username_idx ON observers(username);
CREATE INDEX IF NOT EXISTS observers_fingerprint_idx ON observers(browser_fingerprint);
CREATE INDEX IF NOT EXISTS observers_last_seen_idx ON observers(last_seen_at DESC);

-- ============================================
-- CHAT MESSAGES TABLE
-- Stores all chat messages
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  observer_id UUID NOT NULL REFERENCES observers(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_observer_id_idx ON chat_messages(observer_id);

-- ============================================
-- EVOLUTION STAGES TABLE
-- Defines specimen evolution thresholds
-- ============================================
CREATE TABLE IF NOT EXISTS evolution_stages (
  stage INT PRIMARY KEY,
  name TEXT NOT NULL,
  market_cap_required NUMERIC NOT NULL,
  description TEXT,
  asset_url TEXT
);

-- ============================================
-- SPECIMEN STATE TABLE
-- Single row tracking global specimen state
-- ============================================
CREATE TABLE IF NOT EXISTS specimen_state (
  id INT PRIMARY KEY CHECK (id = 1),
  current_stage INT NOT NULL REFERENCES evolution_stages(stage),
  market_cap NUMERIC NOT NULL,
  evolution_progress NUMERIC NOT NULL CHECK (evolution_progress BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MARKET CAP SNAPSHOTS TABLE
-- Historical market cap tracking
-- ============================================
CREATE TABLE IF NOT EXISTS market_cap_snapshots (
  id BIGSERIAL PRIMARY KEY,
  market_cap NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS market_cap_snapshots_recorded_at_idx ON market_cap_snapshots(recorded_at DESC);

-- ============================================
-- SYSTEM EVENTS TABLE
-- Audit log for system events
-- ============================================
CREATE TABLE IF NOT EXISTS system_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS system_events_created_at_idx ON system_events(created_at DESC);
CREATE INDEX IF NOT EXISTS system_events_type_idx ON system_events(event_type);

-- ============================================
-- REGULATION SETTINGS TABLE
-- Dynamic configuration storage
-- ============================================
CREATE TABLE IF NOT EXISTS regulation_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MUTED USERS TABLE
-- Tracks muted observers
-- ============================================
CREATE TABLE IF NOT EXISTS muted_users (
  observer_id UUID PRIMARY KEY REFERENCES observers(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  muted_until TIMESTAMPTZ,
  shadow_muted BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SEED DATA
-- Initial evolution stages
-- ============================================

-- Insert default evolution stages
INSERT INTO evolution_stages (stage, name, market_cap_required, description) VALUES
  (1, 'EMBRYO', 0, 'The specimen begins its existence. A simple cellular structure awaits activation.'),
  (2, 'LARVA', 10000, 'First signs of growth. The specimen develops primitive sensory organs.'),
  (3, 'PUPA', 100000, 'Rapid transformation begins. Internal structures reorganize and strengthen.'),
  (4, 'JUVENILE', 500000, 'The specimen gains mobility. Neural pathways form and consciousness emerges.'),
  (5, 'MATURE', 1000000, 'Full evolution achieved. The specimen reaches its ultimate form.')
ON CONFLICT (stage) DO UPDATE SET
  name = EXCLUDED.name,
  market_cap_required = EXCLUDED.market_cap_required,
  description = EXCLUDED.description;

-- Initialize specimen state
INSERT INTO specimen_state (id, current_stage, market_cap, evolution_progress)
VALUES (1, 1, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert default regulation settings
INSERT INTO regulation_settings (key, value) VALUES
  ('chat_enabled', 'true'),
  ('chat_cooldown_seconds', '5'),
  ('chat_max_length', '160'),
  ('evolution_enabled', 'true'),
  ('evolution_paused', 'false'),
  ('auto_prune_hours', '24')
ON CONFLICT (key) DO NOTHING;

-- Log initialization event
INSERT INTO system_events (event_type, payload)
VALUES ('SYSTEM_INITIALIZED', jsonb_build_object('version', '1.0.0', 'timestamp', NOW()));

-- ============================================
-- ENABLE REALTIME (Optional but recommended)
-- Run these to enable real-time subscriptions
-- ============================================

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Enable realtime for specimen_state
ALTER PUBLICATION supabase_realtime ADD TABLE specimen_state;

-- Enable realtime for system_events (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE system_events;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Basic security policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE specimen_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_cap_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE muted_users ENABLE ROW LEVEL SECURITY;

-- Public read access for specimen viewing
CREATE POLICY "Public can view specimen state" ON specimen_state
  FOR SELECT USING (true);

CREATE POLICY "Public can view evolution stages" ON evolution_stages
  FOR SELECT USING (true);

CREATE POLICY "Public can view chat messages" ON chat_messages
  FOR SELECT USING (true);

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access observers" ON observers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access chat" ON chat_messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access specimen" ON specimen_state
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access stages" ON evolution_stages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access snapshots" ON market_cap_snapshots
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access events" ON system_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access settings" ON regulation_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access muted" ON muted_users
  FOR ALL USING (auth.role() = 'service_role');
