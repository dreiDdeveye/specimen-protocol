'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WalletProvider, useWallet } from '@/lib/WalletProvider';
import { UsernameModal, ChatConsole } from '@/components';
import LoadingScreen from '@/components/LoadingScreen';
import {
  generateFingerprint,
  setStoredObserver,
  type StoredObserver,
} from '@/lib/utils';
import type { ChatMessage } from '@/types';

// Import NEW game components
import { 
  GameEngine,
  Vault,
  DeepVault,
} from '@/components/game';

// Wallet Button Component
const WalletButton: React.FC = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();

  if (!connected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-all"
      >
        {connecting ? (
          <>
            <span className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span>🔗</span>
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={disconnect}
      className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-green-500/30 text-white/60 text-xs rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all"
    >
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="font-mono">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
    </button>
  );
};

// Main Game Content
const GameContent: React.FC = () => {
  const { connected } = useWallet();
  
  // Auth State
  const [loading, setLoading] = useState(true);
  const [observer, setObserver] = useState<StoredObserver | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  // Game State
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [unlockedDocuments, setUnlockedDocuments] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(5);
  const [maxLength, setMaxLength] = useState(160);
  const [isChatConnected, setIsChatConnected] = useState(false);

  // Init observer
  useEffect(() => {
    const init = async () => {
      try {
        const fp = await generateFingerprint();
        setFingerprint(fp);
        const res = await fetch(`/api/observers?fingerprint=${fp}`);
        const data = await res.json();
        if (data.success && data.exists) {
          const obs = { id: data.observer.id, username: data.observer.username, fingerprint: fp };
          setStoredObserver(obs);
          setObserver(obs);
        } else {
          setShowUsernameModal(true);
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Handle username submit
  const handleUsernameSubmit = async (username: string) => {
    if (!fingerprint) return { success: false, error: 'No fingerprint' };
    try {
      const res = await fetch('/api/observers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fingerprint }),
      });
      const data = await res.json();
      if (data.success) {
        const obs = { id: data.observer.id, username, fingerprint };
        setStoredObserver(obs);
        setObserver(obs);
        setShowUsernameModal(false);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Failed to register' };
    }
  };

  // Handle chapter complete from GameEngine
  const handleChapterComplete = useCallback((chapter: number, documents: string[]) => {
    setCompletedChapters(prev => {
      if (!prev.includes(chapter)) {
        return [...prev, chapter];
      }
      return prev;
    });
    setUnlockedDocuments(prev => {
      const newDocs = documents.filter(d => !prev.includes(d));
      return [...prev, ...newDocs];
    });
    
    // Check if all chapters complete (currently just chapter 1)
    // Update this when more chapters are added
    if (chapter >= 1) {
      // For now, chapter 1 complete = game complete (until more chapters added)
      // setIsGameComplete(true);
    }
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    setCompletedChapters([]);
    setUnlockedDocuments([]);
    setIsGameComplete(false);
    // Clear localStorage save
    localStorage.removeItem('island-escape-save');
    // Force page reload to reset GameEngine
    window.location.reload();
  }, []);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setChatEnabled(data.settings?.chatEnabled ?? true);
        setCooldownSeconds(data.settings?.cooldownSeconds ?? 5);
        setMaxLength(data.settings?.maxLength ?? 160);
        setIsChatConnected(true);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setIsChatConnected(false);
    }
  }, []);

  // Send chat message
  const handleSendMessage = async (message: string) => {
    if (!observer) return { success: false, error: 'Not registered' };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observerId: observer.id, message }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.message) setMessages(prev => [...prev, data.message]);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Send failed' };
    }
  };

  // Fetch chat on mount and interval
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  if (loading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-red-950/20 via-black to-black z-0" />
      <div className="fixed inset-0 opacity-5 z-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-red-500/20 bg-black/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-red-500 text-sm hidden sm:inline">ESCAPE THE ISLAND</span>
            
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-2 py-1 border rounded text-xs transition-all ${
                soundEnabled 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-black/50 border-white/20 text-white/40'
              }`}
              title={soundEnabled ? 'Mute typing sound' : 'Enable typing sound'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
          {observer && (
            <span className="text-white/40 text-xs hidden md:inline">
              Survivor: <span className="text-red-400">{observer.username}</span>
            </span>
          )}
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Game Complete Screen */}
        {isGameComplete ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/60 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="font-pixel text-3xl text-green-400 mb-4">
                YOU ESCAPED!
              </h2>
              <p className="text-white/70 mb-2">
                Chapters Completed: <span className="text-green-400 font-bold">{completedChapters.length}</span>
              </p>
              <p className="text-white/70 mb-6">
                Documents Unlocked: <span className="text-amber-400 font-bold">{unlockedDocuments.length}</span>
              </p>
              <p className="text-white/50 text-sm mb-8">
                You've escaped the island with the evidence. The truth will be exposed. 
                The blockchain never forgets.
              </p>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-pixel rounded-lg hover:bg-red-500/30 transition-all"
              >
                🔄 PLAY AGAIN
              </button>
            </div>

            {/* Show Vault at the end */}
            <div className="mt-8">
              <Vault 
                completedChapters={completedChapters.length} 
                isVisible={true} 
              />
            </div>
          </div>
        ) : (
          /* Active Game - Using NEW Branching GameEngine */
          <>
            {/* Chapter Image Header */}
            <div className="text-center mb-6">
              <div className="my-4 flex justify-center">
                <div className="relative w-full max-w-2xl h-48 md:h-64 rounded-lg overflow-hidden border border-red-500/20 bg-black/50">
                  {/* Chapter Image */}
                  <img 
                    src="/images/chapter-1.png"
                    alt="Chapter 1 - The Awakening"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* Scanline effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                  }} />
                  {/* Glow border */}
                  <div className="absolute inset-0 border border-red-500/30 rounded-lg" style={{
                    boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.2)'
                  }} />
                </div>
              </div>
            </div>

            {/* NEW Branching Game Engine */}
            <div className="max-w-3xl mx-auto mb-6">
              <GameEngine 
                soundEnabled={soundEnabled}
                onChapterComplete={handleChapterComplete}
              />
            </div>

            {/* Chat Section */}
            <div className="max-w-3xl mx-auto">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-red-400 text-xs font-pixel">💬 SURVIVOR CHAT</span>
                <span className="text-white/30 text-xs">Discuss strategies</span>
                {isChatConnected && (
                  <span className="ml-auto flex items-center gap-1 text-green-400/60 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <div className="h-[250px] bg-black/50 border border-red-500/20 rounded-xl overflow-hidden">
                <ChatConsole
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isConnected={isChatConnected}
                  username={observer?.username || null}
                  cooldownSeconds={cooldownSeconds}
                  maxLength={maxLength}
                  chatEnabled={chatEnabled}
                />
              </div>
            </div>

            {/* The Vault - Shows progress */}
            <div className="mt-8">
              <Vault 
                completedChapters={completedChapters.length} 
                isVisible={true} 
              />
            </div>

            {/* The Deep Vault - 100 Questions Challenge */}
            <div className="mt-8">
              <DeepVault isVisible={true} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center">
        <p className="text-white/20 text-xs font-pixel">
          ESCAPE THE ISLAND • BRANCHING NARRATIVE • EVERY CHOICE MATTERS
        </p>
      </footer>

      {/* Username Modal */}
      <UsernameModal 
        isOpen={showUsernameModal} 
        onSubmit={handleUsernameSubmit} 
        canClose={false} 
      />
    </div>
  );
};

// Export with Wallet Provider
export default function GamePage() {
  return (
    <WalletProvider>
      <GameContent />
    </WalletProvider>
  );
}