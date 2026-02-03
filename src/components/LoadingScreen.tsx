'use client';

import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LOADING_MESSAGES = [
  'INITIALIZING PROTOCOL...',
  'ESTABLISHING CONNECTION...',
  'SCANNING SPECIMEN DNA...',
  'LOADING EVOLUTION DATA...',
  'CALIBRATING SENSORS...',
  'SYNCING WITH MARKET FEED...',
  'AWAKENING SPECIMEN...',
  'ACCESS GRANTED',
];

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const [showScanline, setShowScanline] = useState(true);
  const [dnaSequence, setDnaSequence] = useState<string[]>([]);

  // Generate random DNA sequence
  useEffect(() => {
    const bases = ['A', 'T', 'G', 'C'];
    const sequence = Array.from({ length: 50 }, () => 
      bases[Math.floor(Math.random() * bases.length)]
    );
    setDnaSequence(sequence);
  }, []);

  // Typing effect for messages
  useEffect(() => {
    const currentMessage = LOADING_MESSAGES[messageIndex];
    
    if (displayText.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentMessage.slice(0, displayText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      // Message complete, wait then move to next
      const timeout = setTimeout(() => {
        if (messageIndex < LOADING_MESSAGES.length - 1) {
          setMessageIndex(prev => prev + 1);
          setDisplayText('');
        } else if (onComplete) {
          // All messages done
          setTimeout(onComplete, 500);
        }
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [displayText, messageIndex, onComplete]);

  // Progress bar
  useEffect(() => {
    const targetProgress = ((messageIndex + 1) / LOADING_MESSAGES.length) * 100;
    if (progress < targetProgress) {
      const timeout = setTimeout(() => {
        setProgress(prev => Math.min(prev + 2, targetProgress));
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [progress, messageIndex]);

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      const glitch = Array.from({ length: 8 }, () => 
        GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      ).join('');
      setGlitchText(glitch);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowScanline(prev => !prev);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-terminal-bg flex items-center justify-center overflow-hidden">
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Moving scanline */}
      <div 
        className="absolute left-0 right-0 h-1 bg-terminal-green/20 pointer-events-none"
        style={{
          top: `${(Date.now() / 20) % 100}%`,
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-terminal-green/30 font-mono text-xs">
        <div>SYS://CLAW_PROTOCOL</div>
        <div className="text-terminal-amber/50">{glitchText}</div>
      </div>
      <div className="absolute top-4 right-4 text-terminal-green/30 font-mono text-xs text-right">
        <div>v2.0.{Math.floor(Date.now() / 1000) % 100}</div>
        <div className="text-terminal-cyan/50">SECTOR-7G</div>
      </div>
      <div className="absolute bottom-4 left-4 text-terminal-green/30 font-mono text-xs">
        <div className="flex gap-1">
          {dnaSequence.slice(0, 20).map((base, i) => (
            <span 
              key={i} 
              className={`${
                base === 'A' ? 'text-terminal-green' :
                base === 'T' ? 'text-terminal-cyan' :
                base === 'G' ? 'text-terminal-amber' :
                'text-terminal-purple'
              } ${i === Math.floor(Date.now() / 200) % 20 ? 'opacity-100' : 'opacity-30'}`}
            >
              {base}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-terminal-amber/50 font-mono text-xs">
        MEM: {Math.floor(Math.random() * 100)}% | CPU: {Math.floor(50 + Math.random() * 50)}%
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center max-w-lg px-8">
        {/* Specimen silhouette / DNA helix animation */}
        <div className="relative mb-8">
          {/* Rotating rings */}
          <div className="relative w-32 h-32">
            <div 
              className="absolute inset-0 border-2 border-terminal-green/30 rounded-full"
              style={{ animation: 'spin 3s linear infinite' }}
            />
            <div 
              className="absolute inset-2 border-2 border-terminal-cyan/30 rounded-full"
              style={{ animation: 'spin 2s linear infinite reverse' }}
            />
            <div 
              className="absolute inset-4 border-2 border-terminal-purple/30 rounded-full"
              style={{ animation: 'spin 4s linear infinite' }}
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">🦞</div>
            </div>
          </div>

          {/* Pulsing glow */}
          <div 
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 65, 0.2) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Status text */}
        <div className="text-center mb-6">
          <div className="font-pixel text-terminal-green text-lg mb-2 min-h-[1.5rem]">
            {displayText}
            <span className="animate-pulse">_</span>
          </div>
          <div className="text-terminal-muted text-xs">
            {messageIndex < LOADING_MESSAGES.length - 1 
              ? `STEP ${messageIndex + 1} OF ${LOADING_MESSAGES.length}`
              : 'COMPLETE'
            }
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 bg-terminal-bg border border-terminal-border rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-terminal-green via-terminal-cyan to-terminal-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div 
                className="h-full w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 1s infinite',
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-terminal-muted">
            <span>0%</span>
            <span className="text-terminal-green font-pixel">{Math.floor(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < messageIndex ? 'bg-terminal-green' :
                i === messageIndex ? 'bg-terminal-cyan animate-pulse' :
                'bg-terminal-border'
              }`}
            />
          ))}
        </div>

        {/* Warning text */}
        <div className="mt-8 text-center">
          <p className="text-terminal-amber/60 text-xs animate-pulse">
            ⚠ SPECIMEN CONTAINMENT ACTIVE
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;