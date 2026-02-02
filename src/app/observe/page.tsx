'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SpecimenRenderer, EvolutionHUD, ChatConsole, UsernameModal } from '@/components';
import { SpecimenIcon, TerminalIcon, AlertIcon } from '@/icons';
import {
  generateFingerprint,
  getStoredObserver,
  setStoredObserver,
  type StoredObserver,
} from '@/lib/utils';
import type { SpecimenState, EvolutionStage, ChatMessage } from '@/types';

// Token address for DexScreener - change this to your token
const TOKEN_ADDRESS = '4T7XUugzhMtqxY8F7fmYaBGQyd6D7KdNJR7MvzVVpump';
const MARKET_CAP_POLL_INTERVAL = 30000; // 30 seconds

export default function ObservePage() {
  // Observer state
  const [observer, setObserver] = useState<StoredObserver | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Specimen state
  const [specimenState, setSpecimenState] = useState<SpecimenState | null>(null);
  const [currentStage, setCurrentStage] = useState<EvolutionStage | null>(null);
  const [nextStage, setNextStage] = useState<EvolutionStage | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  
  // Use ref to track previous stage for evolution animation
  const prevStageRef = useRef<number | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(5);
  const [maxLength, setMaxLength] = useState(160);
  const [isConnected, setIsConnected] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize fingerprint and check for existing observer
  useEffect(() => {
    const init = async () => {
      try {
        const stored = getStoredObserver();
        const fp = await generateFingerprint();
        setFingerprint(fp);

        const res = await fetch(`/api/observers?fingerprint=${fp}`);
        const data = await res.json();

        if (data.success && data.exists) {
          const obs = {
            id: data.observer.id,
            username: data.observer.username,
            fingerprint: fp,
          };
          setStoredObserver(obs);
          setObserver(obs);
        } else {
          setShowUsernameModal(true);
        }
      } catch (err) {
        console.error('Init error:', err);
        setError('Failed to initialize. Please refresh.');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Fetch specimen state - no dependencies to avoid stale closures
  const fetchSpecimenState = useCallback(async () => {
    try {
      const res = await fetch('/api/specimen', { cache: 'no-store' });
      const data = await res.json();

      if (data.success && data.state && data.stage) {
        // Check for evolution using ref
        const currentStageNum = data.state?.current_stage || 1;
        if (prevStageRef.current !== null && currentStageNum > prevStageRef.current) {
          setIsEvolving(true);
          setTimeout(() => setIsEvolving(false), 2000);
        }
        prevStageRef.current = currentStageNum;

        setSpecimenState(data.state);
        setCurrentStage(data.stage);
        setNextStage(data.nextStage || null);
        
       const marketCap = data.state?.market_cap || 0;
        console.log(`[Specimen] Updated - Stage: ${data.stage?.name || 'Unknown'}, Market Cap: $${marketCap.toLocaleString()}`);
      } else {
        console.error('[Specimen] Invalid response:', data);
      }
    } catch (err) {
      console.error('Fetch specimen error:', err);
    }
  }, []);

  // Fetch market cap from DexScreener and update specimen
  const fetchMarketCap = useCallback(async () => {
    try {
      console.log('[DexScreener] Fetching market cap...');
      const res = await fetch('/api/dexscreener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN_ADDRESS }),
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success) {
        console.log(`[DexScreener] Market cap updated: ${data.data?.formattedMarketCap || 'Unknown'}`);
        // Immediately fetch updated specimen state
        await fetchSpecimenState();
      } else {
        console.error('[DexScreener] Error:', data.error);
      }
    } catch (err) {
      console.error('[DexScreener] Fetch error:', err);
    }
  }, [fetchSpecimenState]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/chat', { cache: 'no-store' });
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages || []);
        setChatEnabled(data.settings?.chatEnabled ?? true);
        setCooldownSeconds(data.settings?.cooldownSeconds ?? 5);
        setMaxLength(data.settings?.maxLength ?? 160);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setIsConnected(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    // Initial fetches
    fetchSpecimenState();
    fetchMessages();
    fetchMarketCap(); // Fetch market cap on load

    // Poll for updates
    const specimenInterval = setInterval(fetchSpecimenState, 5000);
    const chatInterval = setInterval(fetchMessages, 3000);
    const marketCapInterval = setInterval(fetchMarketCap, MARKET_CAP_POLL_INTERVAL);

    return () => {
      clearInterval(specimenInterval);
      clearInterval(chatInterval);
      clearInterval(marketCapInterval);
    };
  }, [fetchSpecimenState, fetchMessages, fetchMarketCap]);

  // Handle username registration
  const handleUsernameSubmit = async (username: string) => {
    if (!fingerprint) {
      return { success: false, error: 'Fingerprint not generated' };
    }

    try {
      const res = await fetch('/api/observers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fingerprint }),
      });

      const data = await res.json();

      if (data.success) {
        const obs = {
          id: data.observer.id,
          username: data.observer.username,
          fingerprint,
        };
        setStoredObserver(obs);
        setObserver(obs);
        setShowUsernameModal(false);
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Registration failed' };
    }
  };

  // Handle send message
  const handleSendMessage = async (message: string) => {
    if (!observer) {
      return { success: false, error: 'Not registered' };
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observerId: observer.id, message }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Send failed' };
    }
  };

  // Loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
        <div className="text-center">
          <SpecimenIcon className="mx-auto mb-4 text-terminal-green animate-pulse" size={48} />
          <div className="font-pixel text-xs text-terminal-green tracking-wider">
            INITIALIZING PROTOCOL...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
        <div className="text-center">
          <AlertIcon className="mx-auto mb-4 text-terminal-red" size={48} />
          <div className="font-pixel text-xs text-terminal-red tracking-wider mb-4">
            PROTOCOL ERROR
          </div>
          <p className="text-terminal-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section 1: Full Screen Video Background with Specimen */}
      <section className="h-screen w-full relative flex flex-col overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        {/* Header */}
        <header className="relative z-10 border-b border-terminal-green/30 bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={24} />
              <h1 className="font-pixel text-sm text-terminal-green tracking-wider">
                SPECIMEN PROTOCOL
              </h1>
            </div>
            {observer && (
              <div className="flex items-center gap-2 text-terminal-muted text-sm">
                <TerminalIcon size={14} />
                <span>Observer: </span>
                <span className="text-terminal-cyan">{observer.username}</span>
              </div>
            )}
          </div>
        </header>

        {/* Specimen centered */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          {currentStage && specimenState && (
            <SpecimenRenderer
              stage={currentStage}
              progress={specimenState.evolution_progress}
              isEvolving={isEvolving}
            />
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-terminal-green/70 text-xs font-pixel">SCROLL</span>
          <svg 
            className="w-6 h-6 text-terminal-green/70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Section 2: Status and Chat Panels */}
      <section className="min-h-screen w-full bg-[#0a0f0a] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Specimen Status */}
            <div>
              {specimenState && currentStage && (
                <EvolutionHUD
                  state={specimenState}
                  stage={currentStage}
                  nextStage={nextStage}
                />
              )}
            </div>

            {/* Right - Observer Feed / Chat */}
            <div className="h-[400px]">
              <ChatConsole
                messages={messages}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
                username={observer?.username || null}
                cooldownSeconds={cooldownSeconds}
                maxLength={maxLength}
                chatEnabled={chatEnabled}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Username Modal */}
      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
        canClose={false}
      />
    </div>
  );
}