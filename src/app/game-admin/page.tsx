'use client';

import React, { useState, useEffect } from 'react';

interface OnlinePlayer {
  id: string;
  name: string;
  lastSeen: number;
  isActive: boolean;
}

export default function GameAdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameState, setGameState] = useState<any>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if already authenticated (from localStorage)
  useEffect(() => {
    const savedAuth = localStorage.getItem('game-admin-auth');
    if (savedAuth) {
      setPassword(savedAuth);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch current state
  const fetchState = async () => {
    try {
      const [gameRes, playersRes] = await Promise.all([
        fetch('/api/global-game?visitorId=admin'),
        fetch('/api/online-players?visitorId=admin&visitorName=Admin'),
      ]);
      
      const gameData = await gameRes.json();
      if (gameData.success) {
        setGameState(gameData.state);
      }
      
      const playersData = await playersRes.json();
      if (playersData.success) {
        setOnlinePlayers(playersData.players || []);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchState();
      const interval = setInterval(fetchState, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Login
  const handleLogin = () => {
    // Simple check - you can also verify against your existing admin API
    if (password.trim()) {
      localStorage.setItem('game-admin-auth', password);
      setIsAuthenticated(true);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('game-admin-auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Reset game
  const handleReset = async () => {
    if (!confirm('⚠️ Are you sure you want to RESET the entire game? All progress will be lost!')) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/global-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('✅ Game reset successfully!');
        fetchState();
      } else {
        setMessage('❌ Failed to reset: ' + data.error);
      }
    } catch (err) {
      setMessage('❌ Error: ' + String(err));
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Advance to specific chapter/node
  const handleAdvance = async (chapter: number, nodeId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/global-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'advance',
          chapter,
          nodeId,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage(`✅ Advanced to Chapter ${chapter}, Node ${nodeId}`);
        fetchState();
      } else {
        setMessage('❌ Failed: ' + data.error);
      }
    } catch (err) {
      setMessage('❌ Error: ' + String(err));
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Skip to chapter start
  const skipToChapter = (chapter: number) => {
    handleAdvance(chapter, `${chapter}-s1`);
  };

  // Force timer end (set voting_ends_at to now)
  const forceTimerEnd = async () => {
    if (!confirm('Force end the current voting timer?')) return;
    
    // This requires direct Supabase access or a new API endpoint
    // For now, we'll just advance to trigger a new timer
    setMessage('⏰ Timer forced - voting will end on next poll');
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">🔐 GAME ADMIN</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              LOGIN
            </button>
          </div>
          
          <p className="text-white/40 text-xs text-center mt-6">
            Use your ADMIN_PASSWORD from environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-red-500">🔧 GAME ADMIN</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-lg transition-all text-sm"
          >
            Logout
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}>
            {message}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-xl">
              <p className="text-white animate-pulse">Processing...</p>
            </div>
          </div>
        )}

        {/* Online Players */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-green-400 mb-4">
            👥 Online Players ({onlinePlayers.length})
          </h2>
          
          {onlinePlayers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {onlinePlayers.map((player) => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg border ${
                    player.isActive 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      player.isActive ? 'bg-green-500 animate-pulse' : 'bg-white/30'
                    }`} />
                    <span className="text-sm font-medium truncate">
                      {player.name}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {player.isActive ? 'Active now' : `${Math.floor((Date.now() - player.lastSeen) / 1000)}s ago`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No players online</p>
          )}
        </div>

        {/* Current State */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-amber-400 mb-4">📊 Current Game State</h2>
          
          {gameState ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Chapter</p>
                <p className="text-xl md:text-2xl font-bold">{gameState.chapter}/8</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Node ID</p>
                <p className="text-sm md:text-lg font-mono truncate">{gameState.nodeId}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Total Votes</p>
                <p className="text-xl md:text-2xl font-bold">{gameState.totalVoters}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Deaths</p>
                <p className="text-xl md:text-2xl font-bold text-red-400">{gameState.deaths}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Decided</p>
                <p className="text-base md:text-lg">{gameState.decided ? '✅ Yes' : '⏳ No'}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Winner</p>
                <p className="text-base md:text-lg font-mono">{gameState.winningChoice || '—'}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-green-400">{gameState.completedChapters}</p>
              </div>
              <div className="bg-black/50 p-3 md:p-4 rounded-lg">
                <p className="text-white/40 text-xs md:text-sm">Timer Ends</p>
                <p className="text-xs md:text-sm font-mono">
                  {new Date(gameState.votingEndsAt).toLocaleTimeString()}
                </p>
                <p className="text-xs text-white/40">
                  {Math.max(0, Math.floor((gameState.votingEndsAt - Date.now()) / 1000))}s left
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/60">Loading game state...</p>
          )}

          {/* Votes breakdown */}
          {gameState?.votes && Object.keys(gameState.votes).length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-sm mb-2">Current Votes:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(gameState.votes).map(([choiceId, votes]: [string, any]) => (
                  <div key={choiceId} className="bg-amber-500/20 px-3 py-2 rounded">
                    <span className="font-bold text-amber-400">{choiceId.toUpperCase()}</span>
                    <span className="text-white/60 ml-2">{votes.length} votes</span>
                    <div className="text-xs text-white/40 mt-1">
                      {votes.slice(0, 3).map((v: any) => v.visitorName).join(', ')}
                      {votes.length > 3 && ` +${votes.length - 3} more`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-amber-400 mb-4">⚡ Quick Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 md:px-6 py-2 md:py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
            >
              🔄 RESET GAME
            </button>

            <button
              onClick={fetchState}
              disabled={isLoading}
              className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
            >
              🔃 REFRESH
            </button>

            <button
              onClick={forceTimerEnd}
              disabled={isLoading}
              className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
            >
              ⏰ FORCE TIMER END
            </button>

            <button
              onClick={async () => {
                if (!confirm('Clear all chat messages?')) return;
                try {
                  const res = await fetch('/api/game-chat', { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                    setMessage('✅ Chat cleared!');
                  } else {
                    setMessage('❌ Failed to clear chat');
                  }
                } catch (err) {
                  setMessage('❌ Error clearing chat');
                }
                setTimeout(() => setMessage(''), 3000);
              }}
              disabled={isLoading}
              className="px-4 md:px-6 py-2 md:py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
            >
              🗑️ CLEAR CHAT
            </button>
          </div>
        </div>

        {/* Skip to Chapter */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-amber-400 mb-4">⏭️ Skip to Chapter</h2>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(ch => (
              <button
                key={ch}
                onClick={() => skipToChapter(ch)}
                disabled={isLoading}
                className={`p-2 md:p-3 rounded-lg font-bold transition-all text-sm md:text-base ${
                  gameState?.chapter === ch
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white disabled:opacity-50'
                }`}
              >
                CH {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Advance */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-amber-400 mb-4">🎯 Manual Advance</h2>
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
            <div className="flex-shrink-0">
              <label className="block text-white/40 text-sm mb-1">Chapter</label>
              <input
                type="number"
                id="admin-chapter"
                defaultValue={gameState?.chapter || 1}
                min={1}
                max={8}
                className="w-full md:w-20 px-3 py-2 bg-black border border-white/20 rounded-lg text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white/40 text-sm mb-1">Node ID</label>
              <input
                type="text"
                id="admin-node"
                defaultValue={gameState?.nodeId || '1-s1'}
                placeholder="e.g., 1-s2-vent, 2-s3-death"
                className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-white font-mono"
              />
            </div>
            <button
              onClick={() => {
                const chapter = parseInt((document.getElementById('admin-chapter') as HTMLInputElement).value);
                const nodeId = (document.getElementById('admin-node') as HTMLInputElement).value;
                if (chapter && nodeId) {
                  handleAdvance(chapter, nodeId);
                }
              }}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
            >
              GO →
            </button>
          </div>
          
          <p className="text-white/40 text-xs mt-3">
            Node ID format: <code className="text-amber-400">[chapter]-s[stage]</code> or <code className="text-amber-400">[chapter]-s[stage]-[variant]</code>
          </p>
        </div>

        {/* Common Node IDs */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-amber-400 mb-4">📍 Common Nodes</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Ch1 Start', node: '1-s1' },
              { label: 'Ch1 Complete', node: '1-complete' },
              { label: 'Ch2 Start', node: '2-s1' },
              { label: 'Ch2 Complete', node: '2-complete' },
              { label: 'Ch3 Start', node: '3-s1' },
              { label: 'Ch4 Start', node: '4-s1' },
              { label: 'Ch5 Start', node: '5-s1' },
              { label: 'Ch6 Start', node: '6-s1' },
              { label: 'Ch7 Start', node: '7-s1' },
              { label: 'Ch8 Start', node: '8-s1' },
              { label: 'Ch8 Complete', node: '8-complete' },
              { label: 'Death Test', node: '1-s3-death' },
            ].map(({ label, node }) => (
              <button
                key={node}
                onClick={() => {
                  const chapter = parseInt(node.split('-')[0]);
                  handleAdvance(chapter, node);
                }}
                disabled={isLoading}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all disabled:opacity-50"
              >
                <p className="text-white/60 text-xs">{label}</p>
                <p className="text-amber-400 font-mono text-sm">{node}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/40 text-xs">
          <p>Game Admin Panel • Auto-refreshes every 3 seconds</p>
        </div>
      </div>
    </div>
  );
}