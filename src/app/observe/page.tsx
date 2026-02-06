'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SpecimenRenderer, EvolutionHUD, ChatConsole, UsernameModal, LiveFeedLeaderboard } from '@/components';
import DexChart from '@/components/DexChart';
import LoadingScreen from '@/components/LoadingScreen';
import { WalletProvider, useWallet } from '@/lib/WalletProvider';
import { SpecimenIcon, TerminalIcon, AlertIcon } from '@/icons';
import {
  generateFingerprint,
  getStoredObserver,
  setStoredObserver,
  type StoredObserver,
} from '@/lib/utils';
import type { SpecimenState, EvolutionStage, ChatMessage } from '@/types';

// Token address for DexScreener
const TOKEN_ADDRESS = 'APCwYR7NjV9ZMk2Lx86p9ZQQaeCCDd44DJG1MJbWpump';
const CHAIN_ID = 'solana';
const MARKET_CAP_POLL_INTERVAL = 5000; // 5 seconds

// Floating +1 Animation Component
const FloatingPoints: React.FC<{ points: { id: number; x: number; y: number }[] }> = ({ points }) => {
  return (
    <>
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute pointer-events-none font-pixel text-terminal-green text-2xl animate-float-up"
          style={{ left: point.x, top: point.y }}
        >
          +1
        </div>
      ))}
    </>
  );
};

// Wallet Button Component
const WalletButton: React.FC = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();

  if (!connected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="flex items-center gap-2 px-4 py-2 bg-terminal-green/10 border border-terminal-green/50 text-terminal-green text-sm rounded-lg hover:bg-terminal-green/20 transition-all disabled:opacity-50"
      >
        {connecting ? (
          <>
            <div className="w-4 h-4 border-2 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7V5C19 3.9 18.1 3 17 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H17C18.1 21 19 20.1 19 19V17" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H13C11.9 12 11 12.9 11 14C11 15.1 11.9 16 13 16H21V12Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Connect to Feed</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={disconnect}
      className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-terminal-green/30 text-white/60 text-xs rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all"
      title="Disconnect wallet"
    >
      <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
      <span className="font-mono">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

// Main Page Content Component
const ObservePageContent: React.FC = () => {
  const { connected, publicKey, connect } = useWallet();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [observer, setObserver] = useState<StoredObserver | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [specimenState, setSpecimenState] = useState<SpecimenState | null>(null);
  const [currentStage, setCurrentStage] = useState<EvolutionStage | null>(null);
  const [nextStage, setNextStage] = useState<EvolutionStage | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);

  // Floating points animation
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const pointIdRef = useRef(0);

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

  // Initialize observer
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

  // Update wallet address when connected
  useEffect(() => {
    const updateWallet = async () => {
      if (connected && publicKey && observer) {
        try {
          await fetch('/api/observers/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              observerId: observer.id,
              walletAddress: publicKey,
            }),
          });
        } catch (err) {
          console.error('Failed to save wallet:', err);
        }
      }
    };
    updateWallet();
  }, [connected, publicKey, observer]);

  // Handle tap on specimen to feed
  const handleSpecimenTap = async (e: React.MouseEvent) => {
    if (!connected) {
      connect();
      return;
    }

    if (!observer || !publicKey) return;

    // Add floating +1 animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoint = { id: pointIdRef.current++, x, y };
    setFloatingPoints(prev => [...prev, newPoint]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== newPoint.id));
    }, 1000);

    // Record feed to database (fire and forget for instant feel)
    fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        observerId: observer.id,
        username: observer.username,
        amount: 1,
        walletAddress: publicKey,
      }),
    }).catch(err => {
      console.error('Feed error:', err);
    });
  };

  const updateSpecimenData = useCallback((data: any) => {
    if (!data.success || !data.state || !data.stage) return;

    const newMarketCap = Number(data.state.market_cap);
    const newTimestamp = data._timestamp || Date.now();

    if (newTimestamp < lastUpdateTimeRef.current) {
      return;
    }

    if (lastMarketCapRef.current !== null && lastMarketCapRef.current === newMarketCap) {
      lastUpdateTimeRef.current = newTimestamp;
      return;
    }

    lastMarketCapRef.current = newMarketCap;
    lastUpdateTimeRef.current = newTimestamp;

    const currentStageNum = data.state.current_stage || 1;
    if (prevStageRef.current !== null && currentStageNum > prevStageRef.current) {
      setIsEvolving(true);
      setTimeout(() => setIsEvolving(false), 2000);
    }
    prevStageRef.current = currentStageNum;

    setSpecimenState(data.state);
    setCurrentStage(data.stage);
    setNextStage(data.nextStage || null);
  }, []);

  const fetchSpecimenState = useCallback(async () => {
    try {
      const res = await fetch(`/api/specimen?_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const data = await res.json();
      updateSpecimenData(data);
    } catch (err) {
      console.error('Fetch specimen error:', err);
    }
  }, [updateSpecimenData]);

  const fetchMarketCap = useCallback(async () => {
    try {
      const res = await fetch(`/api/dexscreener?_t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ token: TOKEN_ADDRESS }),
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
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

    const specimenInterval = setInterval(fetchSpecimenState, 3000); // 3 seconds
    const chatInterval = setInterval(fetchMessages, 2000); // 2 seconds
    const marketCapInterval = setInterval(fetchMarketCap, MARKET_CAP_POLL_INTERVAL); // 5 seconds

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

        {/* Header */}
        <header className="relative z-10 border-b border-terminal-green/30 bg-black/50 backdrop-blur-sm p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={24} />
              <h1 className="font-pixel text-sm text-terminal-green tracking-wider">CLAWPROTOCOL</h1>
            </div>
            
            {/* Observer Name */}
            {observer && (
              <div className="hidden sm:flex items-center gap-2 text-terminal-muted text-sm">
                <TerminalIcon size={14} />
                <span>Observer: </span>
                <span className="text-terminal-cyan">{observer.username}</span>
              </div>
            )}
            
            {/* Wallet Button */}
            <WalletButton />
          </div>
        </header>

        {/* Live Feed Leaderboard */}
        <div className="absolute top-20 left-4 z-20 w-[280px]">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg border border-terminal-green/30 p-3">
            <LiveFeedLeaderboard />
          </div>
        </div>

        {/* Tap to Feed Hint */}
        {connected && (
          <div className="absolute top-20 right-4 z-20">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg border border-terminal-green/30 px-3 py-2">
              <p className="text-terminal-green text-xs font-pixel animate-pulse">
                👆 TAP SPECIMEN TO FEED
              </p>
            </div>
          </div>
        )}

        {/* Specimen - Clickable area */}
        <div 
          className="flex-1 flex items-center justify-center relative z-10 cursor-pointer"
          onClick={handleSpecimenTap}
        >
          {currentStage && specimenState && (
            <SpecimenRenderer
              stage={currentStage}
              progress={specimenState.evolution_progress}
              isEvolving={isEvolving}
            />
          )}
          
          {/* Floating +1 animations */}
          <FloatingPoints points={floatingPoints} />
          
          {/* Connect wallet overlay if not connected */}
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-2">Connect wallet to feed the specimen</p>
                <p className="text-terminal-green/60 text-xs">Click anywhere to connect</p>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-terminal-green/70 text-xs font-pixel">SCROLL</span>
          <svg className="w-6 h-6 text-terminal-green/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Evolution HUD & Chat Section */}
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

      {/* DexChart Section */}
      <section className="w-full bg-[#0a0f0a] py-8 border-t border-terminal-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <DexChart tokenAddress={TOKEN_ADDRESS} chainId={CHAIN_ID} />
        </div>
      </section>

      {/* Username Modal */}
      <UsernameModal isOpen={showUsernameModal} onSubmit={handleUsernameSubmit} canClose={false} />

      {/* Float up animation style */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.5);
          }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Main Page with Wallet Provider
export default function ObservePage() {
  return (
    <WalletProvider>
      <ObservePageContent />
    </WalletProvider>
  );
}