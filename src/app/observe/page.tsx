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

// Import game components
import { 
  StageDisplay, 
  Timer, 
  ProgressBar,
  Vault,
  DeepVault,
  CHAPTERS,
  TIMER_SECONDS,
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

  // Game State - 8 chapters, 6 stages each
  const [currentChapter, setCurrentChapter] = useState(1); // 1-8
  const [currentStage, setCurrentStage] = useState(0); // 0-5 (0 = starting stage 1)
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [unlockedDocuments, setUnlockedDocuments] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChapterComplete, setShowChapterComplete] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0); // Track wrong attempts for death mechanic
  const [showDeathScreen, setShowDeathScreen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(5);
  const [maxLength, setMaxLength] = useState(160);
  const [isChatConnected, setIsChatConnected] = useState(false);

  // Current chapter and stage data
  const chapter = CHAPTERS[currentChapter - 1];
  const stage = chapter?.stages[currentStage];
  const totalChapters = CHAPTERS.length; // 8
  const totalStages = 6;

  const isGameComplete = currentChapter > totalChapters || 
    (currentChapter === totalChapters && completedChapters.includes(totalChapters));

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

  // Determine if current stage is a danger zone (stages 3 and 4 = index 2 and 3)
  const isDangerStage = currentStage === 2 || currentStage === 3;
  const maxWrongAttempts = isDangerStage ? 2 : 0; // 2 lives in danger zone, unlimited otherwise

  // Handle answer from StageDisplay
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setWrongAttempts(0); // Reset wrong attempts on correct answer
      
      // Unlock document if stage has one
      if (stage?.document) {
        setUnlockedDocuments(prev => [...prev, stage.document!.title]);
      }

      // Check if chapter is complete
      if (currentStage >= totalStages - 1) {
        // Chapter complete!
        setCompletedChapters(prev => [...prev, currentChapter]);
        setShowChapterComplete(true);
      } else {
        // Move to next stage
        setCurrentStage(prev => prev + 1);
        setWrongAttempts(0); // Reset for new stage
      }
    } else {
      // Wrong answer - increment attempts
      setWrongAttempts(prev => prev + 1);
    }
  }, [currentStage, currentChapter, stage, totalStages]);

  // Handle death - reset everything
  const handleDeath = useCallback(() => {
    setShowDeathScreen(true);
    
    // After showing death screen, reset to beginning
    setTimeout(() => {
      setCurrentChapter(1);
      setCurrentStage(0);
      setCompletedChapters([]);
      setUnlockedDocuments([]);
      setShowChapterComplete(false);
      setWrongAttempts(0);
      setShowDeathScreen(false);
    }, 3000);
  }, []);

  // Handle next chapter
  const handleNextChapter = useCallback(() => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(prev => prev + 1);
      setCurrentStage(0);
      setShowChapterComplete(false);
      setWrongAttempts(0); // Reset for new chapter
    }
  }, [currentChapter, totalChapters]);

  // Handle restart
  const handleRestart = useCallback(() => {
    setCurrentChapter(1);
    setCurrentStage(0);
    setCompletedChapters([]);
    setUnlockedDocuments([]);
    setShowChapterComplete(false);
    setWrongAttempts(0);
    setShowDeathScreen(false);
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
            <span className="text-2xl">🏝️</span>
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
        
        {/* Death Screen Overlay */}
        {showDeathScreen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-8xl mb-6">💀</div>
              <h2 className="font-pixel text-4xl md:text-6xl text-red-500 mb-4">
                YOU DIED
              </h2>
              <p className="text-red-400/80 text-lg mb-2">They caught you.</p>
              <p className="text-red-400/60 text-sm mb-8">All progress lost...</p>
              <div className="w-48 h-1 bg-red-900 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-red-500 animate-[shrink_3s_linear]" />
              </div>
              <p className="text-white/30 text-xs mt-4">Restarting...</p>
            </div>
            <style jsx>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        )}

        {/* Game Complete Screen */}
        {isGameComplete ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/60 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="font-pixel text-3xl text-green-400 mb-4">
                YOU ESCAPED!
              </h2>
              <p className="text-white/70 mb-2">
                Chapters Completed: <span className="text-green-400 font-bold">{completedChapters.length}</span> / {totalChapters}
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
        ) : showChapterComplete ? (
          /* Chapter Complete Screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/60 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-pixel text-2xl text-green-400 mb-2">
                {chapter.title} COMPLETE
              </h2>
              <p className="text-white/50 text-lg mb-6">
                "{chapter.subtitle}"
              </p>
              <p className="text-white/70 mb-6">
                You completed all 6 stages! 
                {currentChapter < totalChapters ? ' Ready for the next chapter?' : ' You did it!'}
              </p>
              
              {currentChapter < totalChapters ? (
                <button
                  onClick={handleNextChapter}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-pixel text-lg rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                  CONTINUE TO CHAPTER {currentChapter + 1} →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCompletedChapters(prev => [...prev, currentChapter]);
                    setShowChapterComplete(false);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-pixel text-lg rounded-xl transition-all shadow-lg shadow-green-500/20"
                >
                  🏆 COMPLETE GAME
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Active Game */
          <>
            {/* Progress Bar */}
            <div className="mb-8 max-w-2xl mx-auto">
              <ProgressBar 
                currentStage={currentStage}
                totalStages={totalStages}
                currentChapter={currentChapter}
                totalChapters={totalChapters}
                chapterTitle={chapter.subtitle}
              />
            </div>

            {/* Chapter Header */}
            <div className="text-center mb-6">
              <span className="text-red-500/60 text-xs font-pixel tracking-widest">
                {chapter.title}
              </span>
              
              {/* Chapter Image */}
              <div className="my-4 flex justify-center">
                <div className="relative w-full max-w-2xl h-48 md:h-64 rounded-lg overflow-hidden border border-red-500/20 bg-black/50">
                  {/* Placeholder - replace src with actual chapter images */}
                  <img 
                    src={`/images/chapter-${currentChapter}.png`}
                    alt={chapter.subtitle}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      // Fallback to ASCII art style placeholder
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* ASCII Art Fallback - Island Landscape */}
                  <div className="hidden absolute inset-0 bg-black font-mono text-[2.5px] sm:text-[3px] md:text-[4px] text-red-500/90 leading-[1.2] whitespace-pre overflow-hidden flex items-end justify-center pb-2">
{`                                                                       .         .--.                                                               
                                                       .    .  .-+#@@#@@**+-.    .                                                                  
                                                   .       .=@@@**+==++**#@@@@+.                                                                    
                                                        .+@@#+=--:::::::-==+*#@@#-                                                                  
                                                .      =@@*=-:::::::::::::::-=+#@@+     .                                                           
                                                      #@#=-::::::..:::::::::::-=*@@*.                                                               
                                             .       #@*=:::..   ..  ...:::::::-=*@@=                                                               
                                                    =@@=::..          . ..::::::=+@@*                                                               
                                                    *@#-:.               ..:::::-+#@#.       .                                                      
                                                   .@@+:.       ..        ..::::-+*@@-                                                              
                                                   .@@+:.    .:===-.       .::::-+*@@:                                                              
                                     .   .          #@*:.   .-+###*+:       .:::-=*@@:                                                              
                                                    =@@=..  :=*####*-.     ..:::-+#@#                                                               
                                            .        #@#-:. .-+*##*+-..   ..::::-*@@+      .                                                         
                                                     .@@*-:...:-===-:....:::::-+#@@-                                                                
                                  .                   :@@#=::...::::...:::::-=*@@#.                                                                 
                                                       .#@@*=-::::::::::::-=*#@@+           .                                                       
                                               .         +@@#*+=-:::::::-=+*@@#:                                                                    
.  .  .  .  .  .  . .  . . . . . . . . . . . . . . . . . .*@@@#*+====++*#@@@=. . . . . . . . . . . . . . . . . . . . . . . . .  .  .  .  .  .  .  . 
~  ~  ~  ~  ~  ~  ~  ~  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~+#@@@@@@@@@@#+~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  ~  ~  ~  ~  ~  ~  ~  
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~-=++=-~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`}
                  </div>
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
              
              <h1 className="font-pixel text-2xl md:text-4xl text-white mt-2">
                {chapter.subtitle}
              </h1>
            </div>

            {/* Stage Display */}
            <div className="max-w-3xl mx-auto mb-6">
              {stage && (
                <StageDisplay
                  key={`${currentChapter}-${currentStage}-${wrongAttempts}`}
                  stage={stage}
                  stageNumber={currentStage + 1}
                  onAnswer={handleAnswer}
                  onDeath={handleDeath}
                  soundEnabled={soundEnabled}
                  wrongAttempts={wrongAttempts}
                  maxWrongAttempts={maxWrongAttempts}
                />
              )}
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
          🏝️ ESCAPE THE ISLAND • 8 CHAPTERS • 6 STAGES EACH • SURVIVE
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