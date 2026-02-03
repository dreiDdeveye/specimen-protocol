'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SpecimenRenderer, EvolutionHUD, ChatConsole, UsernameModal } from '@/components';
import DexChart from '@/components/DexChart';
import LoadingScreen from '@/components/LoadingScreen';
import { SpecimenIcon, TerminalIcon, AlertIcon } from '@/icons';
import {
  generateFingerprint,
  getStoredObserver,
  setStoredObserver,
  type StoredObserver,
} from '@/lib/utils';
import type { SpecimenState, EvolutionStage, ChatMessage } from '@/types';

// Token address for DexScreener
const TOKEN_ADDRESS = 'h1F6sEQPLz9sJZLyCU3mCqXEHJzT3mouBbFHdq8pump';
const CHAIN_ID = 'solana';
const MARKET_CAP_POLL_INTERVAL = 30000;

export default function ObservePage() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [observer, setObserver] = useState<StoredObserver | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [specimenState, setSpecimenState] = useState<SpecimenState | null>(null);
  const [currentStage, setCurrentStage] = useState<EvolutionStage | null>(null);
  const [nextStage, setNextStage] = useState<EvolutionStage | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);

  const prevStageRef = useRef<number | null>(null);
  const lastMarketCapRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(5);
  const [maxLength, setMaxLength] = useState(160);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
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

  // Only update state if the data is newer/different
  const updateSpecimenData = useCallback((data: any) => {
    if (!data.success || !data.state || !data.stage) return;

    const newMarketCap = Number(data.state.market_cap);
    const newTimestamp = data._timestamp || Date.now();

    // IMPORTANT: Only update if this data is newer than what we have
    // and the market cap is different
    if (newTimestamp < lastUpdateTimeRef.current) {
      console.log('[Specimen] Ignoring stale data');
      return;
    }

    // Check if market cap actually changed
    if (lastMarketCapRef.current !== null && lastMarketCapRef.current === newMarketCap) {
      // Same market cap, just update timestamp
      lastUpdateTimeRef.current = newTimestamp;
      return;
    }

    // Log the update
    console.log(`[Specimen] Updating: $${lastMarketCapRef.current?.toLocaleString() || 0} → $${newMarketCap.toLocaleString()}`);

    // Update refs
    lastMarketCapRef.current = newMarketCap;
    lastUpdateTimeRef.current = newTimestamp;

    // Check for evolution
    const currentStageNum = data.state.current_stage || 1;
    if (prevStageRef.current !== null && currentStageNum > prevStageRef.current) {
      setIsEvolving(true);
      setTimeout(() => setIsEvolving(false), 2000);
    }
    prevStageRef.current = currentStageNum;

    // Update state
    setSpecimenState(data.state);
    setCurrentStage(data.stage);
    setNextStage(data.nextStage || null);
  }, []);

  const fetchSpecimenState = useCallback(async () => {
    try {
      const res = await fetch(`/api/specimen?_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      const data = await res.json();
      updateSpecimenData(data);
    } catch (err) {
      console.error('Fetch specimen error:', err);
    }
  }, [updateSpecimenData]);

  const fetchMarketCap = useCallback(async () => {
    try {
      console.log('[DexScreener] Fetching market cap...');
      const res = await fetch(`/api/dexscreener?_t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ token: TOKEN_ADDRESS }),
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success) {
        console.log(`[DexScreener] Market cap: ${data.data?.formattedMarketCap}`);
        // Wait a bit for DB to update, then fetch
        setTimeout(fetchSpecimenState, 500);
      }
    } catch (err) {
      console.error('[DexScreener] Fetch error:', err);
    }
  }, [fetchSpecimenState]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?_t=${Date.now()}`, { cache: 'no-store' });
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

  useEffect(() => {
    fetchSpecimenState();
    fetchMessages();
    fetchMarketCap();

    const specimenInterval = setInterval(fetchSpecimenState, 10000);
    const chatInterval = setInterval(fetchMessages, 3000);
    const marketCapInterval = setInterval(fetchMarketCap, MARKET_CAP_POLL_INTERVAL);

    return () => {
      clearInterval(specimenInterval);
      clearInterval(chatInterval);
      clearInterval(marketCapInterval);
    };
  }, [fetchSpecimenState, fetchMessages, fetchMarketCap]);

  const handleUsernameSubmit = async (username: string) => {
    if (!fingerprint) return { success: false, error: 'Fingerprint not generated' };

    try {
      const res = await fetch('/api/observers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fingerprint }),
      });
      const data = await res.json();

      if (data.success) {
        const obs = { id: data.observer.id, username: data.observer.username, fingerprint };
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

  if (showLoadingScreen) {
    return <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />;
  }

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
        <div className="text-center">
          <AlertIcon className="mx-auto mb-4 text-terminal-red" size={48} />
          <div className="font-pixel text-xs text-terminal-red tracking-wider mb-4">PROTOCOL ERROR</div>
          <p className="text-terminal-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="h-screen w-full relative flex flex-col overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 z-0" />

        <header className="relative z-10 border-b border-terminal-green/30 bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={24} />
              <h1 className="font-pixel text-sm text-terminal-green tracking-wider">CLAWPROTOCOL</h1>
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

        <div className="flex-1 flex items-center justify-center relative z-10">
          {currentStage && specimenState && (
            <SpecimenRenderer
              stage={currentStage}
              progress={specimenState.evolution_progress}
              isEvolving={isEvolving}
            />
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-terminal-green/70 text-xs font-pixel">SCROLL</span>
          <svg className="w-6 h-6 text-terminal-green/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="w-full bg-[#0a0f0a] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {specimenState && currentStage && (
                <EvolutionHUD state={specimenState} stage={currentStage} nextStage={nextStage} />
              )}
            </div>
            <div className="h-[450px]">
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

      <section className="w-full bg-[#0a0f0a] py-8 border-t border-terminal-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <DexChart tokenAddress={TOKEN_ADDRESS} chainId={CHAIN_ID} />
        </div>
      </section>

      <UsernameModal isOpen={showUsernameModal} onSubmit={handleUsernameSubmit} canClose={false} />
    </div>
  );
}