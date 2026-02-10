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
import Link from 'next/link';

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

  // Game State - completedChapters is a NUMBER (highest chapter completed)
  const [completedChapters, setCompletedChapters] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Header scroll state
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(5);
  const [maxLength, setMaxLength] = useState(160);
  const [isChatConnected, setIsChatConnected] = useState(false);

  // Handle scroll for header fade effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate opacity based on scroll position (fade out over first 100px)
      const newOpacity = Math.max(0, 1 - (currentScrollY / 150));
      setHeaderOpacity(newOpacity);
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  // Load completed chapters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('island-escape-save');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setCompletedChapters(state.completedChapters || 0);
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
  }, []);

  // Listen for game state updates from GameEngine
  useEffect(() => {
    const handleGameUpdate = (event: CustomEvent) => {
      const { completedChapters: newCompleted } = event.detail;
      setCompletedChapters(newCompleted);
      
      // Check if all 6 chapters complete
      if (newCompleted >= 8) {
        setIsGameComplete(true);
      }
    };

    window.addEventListener('gameStateUpdate', handleGameUpdate as EventListener);
    return () => {
      window.removeEventListener('gameStateUpdate', handleGameUpdate as EventListener);
    };
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

  // FIXED: Handle chapter complete from GameEngine - now takes just one argument
  const handleChapterComplete = useCallback((chapter: number) => {
    console.log(`Chapter ${chapter} completed!`);
    setCompletedChapters(chapter);
    
    // Check if all 6 chapters complete
    if (chapter >= 8) {
      setIsGameComplete(true);
    }
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    setCompletedChapters(0);
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
    <div className="min-h-screen bg-black text-white">
      {/* Red gradient overlay - from top to progress area */}
      <div className="fixed inset-x-0 top-0 h-[400px] bg-gradient-to-b from-red-950/30 via-red-950/10 to-transparent pointer-events-none z-0" />

      {/* Header - Fades on scroll */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b border-red-500/20 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ 
          opacity: Math.max(0.3, headerOpacity),
          backdropFilter: `blur(${8 * headerOpacity}px)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Link 
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs hover:bg-white/10 hover:border-red-500/30 hover:text-red-400 transition-all group"
            >
              <svg 
                className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>
            
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            
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
          
          {/* Center - Username (hidden on mobile) */}
          {observer && (
            <span className="text-white/40 text-xs hidden md:inline absolute left-1/2 -translate-x-1/2">
              Survivor: <span className="text-red-400">{observer.username}</span>
            </span>
          )}
          
          {/* Right side - Wallet */}
          <WalletButton />
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

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
                Chapters Completed: <span className="text-green-400 font-bold">{completedChapters}/6</span>
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
                completedChapters={completedChapters} 
                isVisible={true} 
              />
            </div>
          </div>
        ) : (
          /* Active Game - Using NEW Branching GameEngine */
          <>
            {/* Game & Chat Container - Same width alignment */}
            <div className="max-w-3xl mx-auto space-y-6">
              {/* NEW Branching Game Engine with TV Overlay */}
              <GameEngine 
                soundEnabled={soundEnabled}
                onChapterComplete={handleChapterComplete}
              />

              {/* Chat Section */}
              <div>
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
            </div>

            {/* The Vault - Shows progress */}
            <div className="mt-8">
              <Vault 
                completedChapters={completedChapters} 
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