'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CoinIcon, EvolutionIcon, ChartIcon } from '@/icons';
import { formatMarketCap, cn } from '@/lib/utils';
import type { SpecimenState, EvolutionStage } from '@/types';

interface EvolutionHUDProps {
  state: SpecimenState;
  stage: EvolutionStage;
  nextStage: EvolutionStage | null;
}

const STAGES = [
  { stage: 1, name: 'EMBRYO', color: 'terminal-green' },
  { stage: 2, name: 'LARVA', color: 'terminal-cyan' },
  { stage: 3, name: 'PUPA', color: 'terminal-amber' },
  { stage: 4, name: 'JUVENILE', color: 'terminal-red' },
  { stage: 5, name: 'MATURE', color: 'terminal-purple' },
];

const SPECIMEN_MESSAGES = [
  "🦞 *clicks claws* Feed me more market cap!",
  "🚀 I can feel the moon getting closer...",
  "💎 Diamond claws never let go!",
  "📈 My shell grows stronger with every buy!",
  "🌙 Take me to the moon, observers!",
  "🦀 Bullish energy detected... CLACK CLACK!",
  "💪 I'm evolving... need more power!",
  "🔥 The chart is looking CRISPY!",
  "⚡ Send it! My claws are ready!",
  "🎯 Next stage loading... pump it!",
  "🦞 This claw ain't stopping til we moon!",
  "📊 Green candles feed my soul!",
  "💰 Apes together strong! Buy buy buy!",
  "🌊 Riding the wave to Valhalla!",
  "🦐 Started as a shrimp, ending as a KING!",
  "✨ Witness my final form... soon!",
  "🏆 WAGMI - We're All Gonna Make It!",
  "🔮 I see $1M in my future...",
  "🦞 *happy claw noises* LFG!!!",
  "💸 Paper claws get left behind!",
];

export const EvolutionHUD: React.FC<EvolutionHUDProps> = ({
  state,
  stage,
  nextStage,
}) => {
  const progress = Math.min(100, Math.max(0, state.evolution_progress));
  const [glowPulse, setGlowPulse] = useState(1);
  const [currentMessage, setCurrentMessage] = useState(SPECIMEN_MESSAGES[0]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Track previous values for flash animation
  const prevMarketCap = useRef(Number(state.market_cap));
  const prevProgress = useRef(progress);
  const [marketCapFlash, setMarketCapFlash] = useState(false);
  const [progressFlash, setProgressFlash] = useState(false);

  // Flash on market cap change
  useEffect(() => {
    const newMarketCap = Number(state.market_cap);
    if (newMarketCap !== prevMarketCap.current) {
      setMarketCapFlash(true);
      setTimeout(() => setMarketCapFlash(false), 300);
      prevMarketCap.current = newMarketCap;
    }
  }, [state.market_cap]);

  // Flash on progress change
  useEffect(() => {
    if (progress !== prevProgress.current) {
      setProgressFlash(true);
      setTimeout(() => setProgressFlash(false), 300);
      prevProgress.current = progress;
    }
  }, [progress]);

  // Glow pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPulse(0.7 + Math.sin(Date.now() / 500) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Rotate specimen messages
  useEffect(() => {
    const changeMessage = () => {
      setIsTyping(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * SPECIMEN_MESSAGES.length);
        setCurrentMessage(SPECIMEN_MESSAGES[randomIndex]);
        setIsTyping(false);
      }, 500);
    };

    changeMessage();
    const interval = setInterval(changeMessage, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentStageNum = stage.stage;

  return (
    <div className="terminal-panel p-4 h-[450px] flex flex-col relative overflow-hidden">
      {/* Animated background glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(0, 255, 65, ${0.1 * glowPulse}) 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-terminal-border relative">
        <EvolutionIcon className="text-terminal-cyan" size={16} />
        <span className="font-pixel text-xs text-terminal-cyan tracking-wider">
          SPECIMEN STATUS
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <div className="status-dot online" />
            <div className="absolute inset-0 status-dot online animate-ping opacity-50" />
          </div>
          <span className="text-terminal-muted text-xs">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Market Cap - Real-time */}
        <div className={cn(
          "bg-terminal-bg/50 p-3 border rounded relative overflow-hidden group transition-all duration-150",
          marketCapFlash 
            ? "border-terminal-amber bg-terminal-amber/10" 
            : "border-terminal-border hover:border-terminal-amber/50"
        )}>
          <div className="flex items-center gap-2 mb-1 relative">
            <CoinIcon className="text-terminal-amber" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Market Cap</span>
          </div>
          <div 
            className={cn(
              "font-pixel text-xl text-terminal-amber relative transition-transform duration-150",
              marketCapFlash && "scale-110"
            )}
            style={{ 
              textShadow: `0 0 ${10 * glowPulse}px rgba(255, 170, 0, 0.5)`,
            }}
          >
            {formatMarketCap(Number(state.market_cap))}
          </div>
        </div>

        {/* Current Stage */}
        <div className="bg-terminal-bg/50 p-3 border border-terminal-border rounded relative overflow-hidden group hover:border-terminal-purple/50 transition-colors">
          <div className="flex items-center gap-2 mb-1 relative">
            <EvolutionIcon className="text-terminal-purple" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Stage</span>
          </div>
          <div className="font-pixel text-xl text-terminal-purple relative flex items-baseline gap-2">
            <span>{stage.stage}</span>
            <span className="text-terminal-muted text-xs font-mono">
              {stage.name}
            </span>
          </div>
        </div>
      </div>

      {/* Evolution Timeline - Hidden Stages */}
      <div className="mb-3 p-3 bg-terminal-bg/30 border border-terminal-border/50 rounded">
        <div className="flex items-center justify-between mb-3">
          <span className="text-terminal-muted text-xs uppercase">Evolution Timeline</span>
          <span className="text-terminal-dim text-xs">{currentStageNum}/???</span>
        </div>
        <div className="flex items-center gap-1">
          {STAGES.map((s, i) => {
            const isUnlocked = currentStageNum >= s.stage;
            const isCurrent = currentStageNum === s.stage;
            const isNext = currentStageNum + 1 === s.stage;
            
            return (
              <React.Fragment key={s.stage}>
                <div className="flex flex-col items-center flex-1">
                  {isUnlocked ? (
                    // Unlocked stage - show details
                    <>
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-pixel transition-all duration-300",
                          isCurrent 
                            ? `bg-${s.color} border-${s.color} text-terminal-bg shadow-lg`
                            : `bg-${s.color}/20 border-${s.color} text-${s.color}`
                        )}
                        style={isCurrent ? { 
                          boxShadow: `0 0 ${15 * glowPulse}px rgba(0, 255, 65, 0.5)`,
                        } : {}}
                      >
                        {s.stage}
                      </div>
                      <span className={cn(
                        "text-[10px] mt-1 font-pixel",
                        `text-${s.color}`
                      )}>
                        {s.name}
                      </span>
                    </>
                  ) : (
                    // Locked stage - show mystery
                    <>
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-pixel transition-all duration-300",
                          "bg-terminal-bg border-terminal-border text-terminal-dim",
                          isNext && "border-terminal-border/50 animate-pulse"
                        )}
                      >
                        ?
                      </div>
                      <span className="text-[10px] mt-1 font-pixel text-terminal-dim">
                        ???
                      </span>
                    </>
                  )}
                </div>
                
                {i < STAGES.length - 1 && (
                  <div className="flex-1 h-0.5 -mt-4 mx-1">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        currentStageNum > s.stage 
                          ? `bg-${s.color}` 
                          : "bg-terminal-border/30"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Specimen Chat/Thoughts */}
      <div className="mb-3 p-3 bg-terminal-green/5 border border-terminal-green/30 rounded flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🦞</span>
          <span className="text-terminal-green text-xs font-pixel">SPECIMEN THOUGHTS</span>
          {isTyping && (
            <span className="text-terminal-muted text-xs animate-pulse">typing...</span>
          )}
        </div>
        <div className="flex items-start gap-2">
          <div 
            className={cn(
              "text-terminal-text text-sm leading-relaxed transition-opacity duration-300",
              isTyping ? "opacity-0" : "opacity-100"
            )}
          >
            {currentMessage}
          </div>
        </div>
      </div>

      {/* Evolution Progress - Real-time, No Delay */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChartIcon className="text-terminal-green" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Progress to Next Stage</span>
          </div>
          <span 
            className={cn(
              "font-pixel text-sm text-terminal-green transition-transform duration-150",
              progressFlash && "scale-125 text-terminal-cyan"
            )}
            style={{ textShadow: `0 0 ${8 * glowPulse}px rgba(0, 255, 65, 0.5)` }}
          >
            {progress.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar - Instant Update */}
        <div className={cn(
          "relative h-4 bg-terminal-bg border rounded overflow-hidden transition-all duration-150",
          progressFlash ? "border-terminal-green" : "border-terminal-border"
        )}>
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute top-0 bottom-0 w-px bg-terminal-border"
                style={{ left: `${(i + 1) * 5}%` }}
              />
            ))}
          </div>
          
          {/* Progress fill - NO transition delay for instant update */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-terminal-green via-terminal-cyan to-terminal-green"
            style={{ width: `${progress}%` }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ animation: 'shimmer 2s infinite' }}
            />
          </div>
          
          {/* Glow at progress edge */}
          {progress > 0 && progress < 100 && (
            <div 
              className="absolute top-0 bottom-0 w-2 bg-terminal-green blur-sm"
              style={{ left: `${progress}%`, opacity: glowPulse }}
            />
          )}
        </div>

        {/* Next Stage Info - Mystery indicator */}
        {nextStage ? (
          <div className="mt-3 flex items-center justify-between text-xs p-2 bg-terminal-bg/30 rounded border border-terminal-border/30">
            <span className="text-terminal-cyan font-pixel flex items-center gap-2">
              <svg className="w-3 h-3 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3L4 14h7v7l9-11h-7V3z" />
              </svg>
              SOMETHING IS COMING...
            </span>
            <span className="text-terminal-green font-pixel flex items-center gap-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              KEEP PUMPING
            </span>
          </div>
        ) : (
          <div className="mt-3 text-center py-2 bg-terminal-purple/10 rounded border border-terminal-purple/30">
            <span className="text-terminal-purple font-pixel text-sm flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terminal-purple animate-pulse" />
              MAX EVOLUTION REACHED
              <span className="w-2 h-2 rounded-full bg-terminal-purple animate-pulse" />
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default EvolutionHUD;