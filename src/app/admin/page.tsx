'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  SettingsIcon,
  SpecimenIcon,
  TerminalIcon,
  UserIcon,
  MuteIcon,
  TrashIcon,
  RefreshIcon,
  PowerIcon,
  EvolutionIcon,
  ClockIcon,
  AlertIcon,
  SystemIcon,
  CoinIcon,
} from '@/icons';
import { formatMarketCap, formatRelativeTime, cn } from '@/lib/utils';
import type {
  SpecimenState,
  EvolutionStage,
  SystemEvent,
  Observer,
} from '@/types';

interface RegulationSettings {
  chat_enabled: boolean;
  chat_cooldown_seconds: number;
  chat_max_length: number;
  evolution_enabled: boolean;
  evolution_paused: boolean;
  auto_prune_hours: number;
}

interface MutedUser {
  observer_id: string;
  username: string;
  muted_until: string | null;
  shadow_muted: boolean;
  reason: string | null;
  created_at: string;
}

interface AdminData {
  settings: RegulationSettings;
  mutedUsers: MutedUser[];
  chatStats: { totalMessages: number };
  specimen: {
    state: SpecimenState;
    stage: EvolutionStage;
    nextStage: EvolutionStage | null;
  } | null;
  stages: EvolutionStage[];
  events: SystemEvent[];
  observers: Observer[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<'specimen' | 'chat' | 'regulation'>('specimen');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [marketCapInput, setMarketCapInput] = useState('');
  const [forceStageInput, setForceStageInput] = useState('');
  const [cooldownInput, setCooldownInput] = useState('');
  const [maxLengthInput, setMaxLengthInput] = useState('');
  const [muteUserId, setMuteUserId] = useState('');
  const [muteUsername, setMuteUsername] = useState('');
  const [muteDuration, setMuteDuration] = useState('');
  const [muteShadow, setMuteShadow] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Session expired');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (json.data.settings) {
          setCooldownInput(json.data.settings.chat_cooldown_seconds.toString());
          setMaxLengthInput(json.data.settings.chat_max_length.toString());
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [isAuthenticated, password]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const executeAction = async (action: string, params: Record<string, unknown> = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action, ...params }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ type: 'success', text: `${action} completed` });
        fetchData();
      } else {
        setActionMessage({ type: 'error', text: json.error || 'Action failed' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid password');
      }
    } catch (err) {
      setAuthError('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="terminal-panel p-6 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="text-terminal-amber" size={24} />
            <h1 className="font-pixel text-sm text-terminal-amber tracking-wider">ADMIN ACCESS</h1>
          </div>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-terminal-muted text-xs mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full"
                autoFocus
              />
            </div>
            {authError && (
              <div className="mb-4 flex items-center gap-2 text-terminal-red text-sm">
                <AlertIcon size={14} />
                <span>{authError}</span>
              </div>
            )}
            <button type="submit" disabled={isLoading || !password} className="w-full primary">
              {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-terminal-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-terminal-amber" size={24} />
            <h1 className="font-pixel text-sm text-terminal-amber tracking-wider">ADMIN PANEL</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} disabled={isLoading} className="flex items-center gap-2 text-sm">
              <RefreshIcon size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-terminal-red text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {actionMessage && (
        <div className={cn(
          'fixed top-4 right-4 p-3 z-50',
          actionMessage.type === 'success'
            ? 'bg-terminal-green/20 border border-terminal-green text-terminal-green'
            : 'bg-terminal-red/20 border border-terminal-red text-terminal-red'
        )}>
          {actionMessage.text}
        </div>
      )}

      <div className="border-b border-terminal-border">
        <div className="max-w-7xl mx-auto flex">
          {[
            { id: 'specimen', label: 'Specimen Control', icon: SpecimenIcon },
            { id: 'chat', label: 'Chat Regulation', icon: TerminalIcon },
            { id: 'regulation', label: 'System Governance', icon: SettingsIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
                activeTab === id
                  ? 'border-terminal-green text-terminal-green'
                  : 'border-transparent text-terminal-muted hover:text-terminal-text'
              )}
            >
              <Icon size={14} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'specimen' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <SpecimenIcon size={14} />CURRENT STATE
              </h2>
              {data?.specimen ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-terminal-muted">Stage:</span>
                    <span className="text-terminal-purple">{data.specimen.stage.stage} - {data.specimen.stage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-muted">Market Cap:</span>
                    <span className="text-terminal-amber">{formatMarketCap(Number(data.specimen.state.market_cap))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-muted">Progress:</span>
                    <span className="text-terminal-green">{Number(data.specimen.state.evolution_progress).toFixed(1)}%</span>
                  </div>
                  {data.specimen.nextStage && (
                    <div className="flex justify-between">
                      <span className="text-terminal-muted">Next Stage:</span>
                      <span className="text-terminal-cyan">{data.specimen.nextStage.name} @ {formatMarketCap(Number(data.specimen.nextStage.market_cap_required))}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-terminal-muted">No specimen state</p>
              )}
            </div>

            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <CoinIcon size={14} />MARKET CAP CONTROL
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="number" value={marketCapInput} onChange={(e) => setMarketCapInput(e.target.value)} placeholder="New market cap..." className="flex-1" />
                  <button onClick={() => executeAction('updateMarketCap', { marketCap: parseFloat(marketCapInput) })} disabled={!marketCapInput || isLoading} className="primary">Update</button>
                </div>
                <div className="flex gap-2">
                  <input type="number" value={forceStageInput} onChange={(e) => setForceStageInput(e.target.value)} placeholder="Force stage #..." className="flex-1" />
                  <button onClick={() => executeAction('forceEvolution', { stage: parseInt(forceStageInput) })} disabled={!forceStageInput || isLoading}>Force</button>
                </div>
                <button onClick={() => executeAction('resetSpecimen')} disabled={isLoading} className="w-full danger">
                  <TrashIcon size={14} className="inline mr-2" />Reset Specimen
                </button>
              </div>
            </div>

            <div className="admin-section lg:col-span-2">
              <h2 className="admin-section-title flex items-center gap-2">
                <EvolutionIcon size={14} />EVOLUTION STAGES
              </h2>
              <table>
                <thead>
                  <tr><th>Stage</th><th>Name</th><th>Market Cap Required</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {data?.stages.map((stage) => (
                    <tr key={stage.stage}>
                      <td className="text-terminal-purple">{stage.stage}</td>
                      <td>{stage.name}</td>
                      <td className="text-terminal-amber">{formatMarketCap(Number(stage.market_cap_required))}</td>
                      <td className="text-terminal-muted">{stage.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <TerminalIcon size={14} />CHAT SETTINGS
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Chat Enabled</span>
                  <button onClick={() => executeAction('toggleChat', { enabled: !data?.settings.chat_enabled })} className={cn('toggle', data?.settings.chat_enabled && 'active')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-muted">Cooldown (s):</span>
                  <input type="number" value={cooldownInput} onChange={(e) => setCooldownInput(e.target.value)} className="w-20" />
                  <button onClick={() => executeAction('setChatCooldown', { seconds: parseInt(cooldownInput) })} disabled={isLoading}>Apply</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-muted">Max Length:</span>
                  <input type="number" value={maxLengthInput} onChange={(e) => setMaxLengthInput(e.target.value)} className="w-20" />
                  <button onClick={() => executeAction('setChatMaxLength', { length: parseInt(maxLengthInput) })} disabled={isLoading}>Apply</button>
                </div>
                <div className="pt-2 border-t border-terminal-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-terminal-muted">Total Messages:</span>
                    <span>{data?.chatStats.totalMessages || 0}</span>
                  </div>
                  <button onClick={() => executeAction('clearChat')} disabled={isLoading} className="w-full danger">
                    <TrashIcon size={14} className="inline mr-2" />Clear All Messages
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <MuteIcon size={14} />MUTE USER
              </h2>
              <div className="space-y-3">
                <input type="text" value={muteUserId} onChange={(e) => setMuteUserId(e.target.value)} placeholder="Observer ID..." className="w-full" />
                <input type="text" value={muteUsername} onChange={(e) => setMuteUsername(e.target.value)} placeholder="Username..." className="w-full" />
                <input type="number" value={muteDuration} onChange={(e) => setMuteDuration(e.target.value)} placeholder="Duration (min, empty=permanent)" className="w-full" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="shadowMute" checked={muteShadow} onChange={(e) => setMuteShadow(e.target.checked)} />
                  <label htmlFor="shadowMute" className="text-sm text-terminal-muted">Shadow mute</label>
                </div>
                <button onClick={() => executeAction('muteUser', { observerId: muteUserId, username: muteUsername, duration: muteDuration ? parseInt(muteDuration) : undefined, shadowMuted: muteShadow })} disabled={!muteUserId || !muteUsername || isLoading} className="w-full">
                  <MuteIcon size={14} className="inline mr-2" />Mute User
                </button>
              </div>
            </div>

            <div className="admin-section lg:col-span-2">
              <h2 className="admin-section-title flex items-center gap-2">
                <UserIcon size={14} />MUTED USERS
              </h2>
              {data?.mutedUsers.length ? (
                <table>
                  <thead><tr><th>Username</th><th>Type</th><th>Until</th><th>Actions</th></tr></thead>
                  <tbody>
                    {data.mutedUsers.map((user) => (
                      <tr key={user.observer_id}>
                        <td>{user.username}</td>
                        <td className={user.shadow_muted ? 'text-terminal-amber' : 'text-terminal-red'}>{user.shadow_muted ? 'Shadow' : 'Normal'}</td>
                        <td className="text-terminal-muted">{user.muted_until ? formatRelativeTime(user.muted_until) : 'Permanent'}</td>
                        <td><button onClick={() => executeAction('unmuteUser', { observerId: user.observer_id })} disabled={isLoading} className="text-terminal-green text-sm">Unmute</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-terminal-muted text-sm">No muted users</p>
              )}
            </div>

            <div className="admin-section lg:col-span-2">
              <h2 className="admin-section-title flex items-center gap-2">
                <UserIcon size={14} />ALL OBSERVERS ({data?.observers.length || 0})
              </h2>
              {data?.observers.length ? (
                <div className="max-h-60 overflow-y-auto">
                  <table>
                    <thead><tr><th>Username</th><th>Last Seen</th><th>ID</th></tr></thead>
                    <tbody>
                      {data.observers.slice(0, 50).map((obs) => (
                        <tr key={obs.id}>
                          <td className="text-terminal-cyan">{obs.username}</td>
                          <td className="text-terminal-muted">{formatRelativeTime(obs.last_seen_at)}</td>
                          <td className="text-terminal-dim text-xs font-mono">{obs.id.slice(0, 8)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-terminal-muted text-sm">No observers</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'regulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <PowerIcon size={14} />EVOLUTION CONTROL
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Evolution Enabled</span>
                  <button onClick={() => executeAction('toggleEvolution', { enabled: !data?.settings.evolution_enabled })} className={cn('toggle', data?.settings.evolution_enabled && 'active')} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Evolution Paused</span>
                  <button onClick={() => executeAction('pauseEvolution', { paused: !data?.settings.evolution_paused })} className={cn('toggle', data?.settings.evolution_paused && 'active')} />
                </div>
              </div>
            </div>

            <div className="admin-section">
              <h2 className="admin-section-title flex items-center gap-2">
                <SystemIcon size={14} />SYSTEM BROADCAST
              </h2>
              <div className="space-y-3">
                <input type="text" value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Enter system message..." className="w-full" maxLength={200} />
                <button onClick={() => { executeAction('broadcast', { message: broadcastMessage }); setBroadcastMessage(''); }} disabled={!broadcastMessage || isLoading} className="w-full primary">
                  <SystemIcon size={14} className="inline mr-2" />Broadcast Message
                </button>
              </div>
            </div>

            <div className="admin-section lg:col-span-2">
              <h2 className="admin-section-title flex items-center gap-2">
                <ClockIcon size={14} />RECENT SYSTEM EVENTS
              </h2>
              {data?.events.length ? (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {data.events.slice(0, 30).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-2 bg-terminal-bg border border-terminal-border">
                      <SystemIcon size={14} className={cn('mt-0.5 flex-shrink-0', event.event_type.includes('ERROR') ? 'text-terminal-red' : event.event_type.includes('EVOLUTION') ? 'text-terminal-purple' : 'text-terminal-amber')} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-cyan text-sm font-medium">{event.event_type}</span>
                          <span className="text-terminal-muted text-xs">{formatRelativeTime(event.created_at)}</span>
                        </div>
                        {event.payload && (
                          <pre className="text-terminal-dim text-xs mt-1 overflow-x-auto">{JSON.stringify(event.payload, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-terminal-muted text-sm">No recent events</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
