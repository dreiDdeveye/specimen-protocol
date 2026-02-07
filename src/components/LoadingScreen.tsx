'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LOADING_MESSAGES = [
  'INITIALIZING PROTOCOL...',
  'ESTABLISHING CONNECTION...',
  'SCANNING SURVIVOR DATA...',
  'LOADING ISLAND COORDINATES...',
  'CALIBRATING SENSORS...',
  'SYNCING WITH SECURE FEED...',
  'PREPARING ESCAPE ROUTE...',
  'ACCESS GRANTED',
];

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

// Typewriter sound hook
const useTypingSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playClick = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const time = ctx.currentTime;
      
      // Key strike (clack)
      const strikeOsc = ctx.createOscillator();
      strikeOsc.type = 'square';
      strikeOsc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      strikeOsc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.2, time);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      // Hammer hit (tink)
      const hammerOsc = ctx.createOscillator();
      hammerOsc.type = 'sine';
      hammerOsc.frequency.setValueAtTime(4000 + Math.random() * 800, time);
      hammerOsc.frequency.exponentialRampToValueAtTime(1500, time + 0.015);
      
      const hammerGain = ctx.createGain();
      hammerGain.gain.setValueAtTime(0.06, time);
      hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      
      // Noise burst
      const noiseLength = 0.03;
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * noiseLength, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < noiseData.length; i++) {
        const t = i / noiseData.length;
        const envelope = t < 0.1 ? t * 10 : Math.exp(-(t - 0.1) * 15);
        noiseData[i] = (Math.random() * 2 - 1) * envelope;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1200 + Math.random() * 400;
      noiseFilter.Q.value = 1.5;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.25;
      
      // Master output
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.5;
      
      strikeOsc.connect(strikeGain);
      strikeGain.connect(masterGain);
      
      hammerOsc.connect(hammerGain);
      hammerGain.connect(masterGain);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      masterGain.connect(ctx.destination);
      
      strikeOsc.start(time);
      strikeOsc.stop(time + 0.03);
      
      hammerOsc.start(time);
      hammerOsc.stop(time + 0.025);
      
      noiseSource.start(time);
      noiseSource.stop(time + noiseLength);
      
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  return playClick;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const [showScanline, setShowScanline] = useState(true);
  const [dnaSequence, setDnaSequence] = useState<string[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const playTypeSound = useTypingSound();

  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      setAudioInitialized(true);
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    
    // Auto-init after a short delay (some browsers allow this)
    const timeout = setTimeout(() => setAudioInitialized(true), 500);
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      clearTimeout(timeout);
    };
  }, []);

  // Generate random DNA sequence
  useEffect(() => {
    const bases = ['A', 'T', 'G', 'C'];
    const sequence = Array.from({ length: 50 }, () => 
      bases[Math.floor(Math.random() * bases.length)]
    );
    setDnaSequence(sequence);
  }, []);

  // Typing effect for messages with sound
  useEffect(() => {
    const currentMessage = LOADING_MESSAGES[messageIndex];
    
    if (displayText.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        const nextChar = currentMessage[displayText.length];
        setDisplayText(currentMessage.slice(0, displayText.length + 1));
        
        // Play sound for non-space characters
        if (nextChar !== ' ' && audioInitialized) {
          playTypeSound();
        }
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
  }, [displayText, messageIndex, onComplete, audioInitialized, playTypeSound]);

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
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Moving scanline */}
      <div 
        className="absolute left-0 right-0 h-1 bg-red-500/20 pointer-events-none"
        style={{
          top: `${(Date.now() / 20) % 100}%`,
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-red-500/30 font-mono text-xs">
        <div>SYS://ESCAPE_PROTOCOL</div>
        <div className="text-amber-500/50">{glitchText}</div>
      </div>
      <div className="absolute top-4 right-4 text-red-500/30 font-mono text-xs text-right">
        <div>v2.0.{Math.floor(Date.now() / 1000) % 100}</div>
        <div className="text-cyan-500/50">SECTOR-7G</div>
      </div>
      <div className="absolute bottom-4 left-4 text-red-500/30 font-mono text-xs">
        <div className="flex gap-1">
          {dnaSequence.slice(0, 20).map((base, i) => (
            <span 
              key={i} 
              className={`${
                base === 'A' ? 'text-red-500' :
                base === 'T' ? 'text-cyan-500' :
                base === 'G' ? 'text-amber-500' :
                'text-purple-500'
              } ${i === Math.floor(Date.now() / 200) % 20 ? 'opacity-100' : 'opacity-30'}`}
            >
              {base}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-amber-500/50 font-mono text-xs">
        MEM: {Math.floor(Math.random() * 100)}% | CPU: {Math.floor(50 + Math.random() * 50)}%
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center max-w-lg px-8">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-5xl text-white mb-2">
          THE <span className="text-red-500">ISLAND</span>
        </h1>
        <p className="text-gray-500 text-xs mb-8 tracking-widest">ESCAPE OR BE SILENCED</p>

        {/* Rotating rings animation */}
        <div className="relative mb-8">
          <div className="relative w-32 h-32">
            <div 
              className="absolute inset-0 border-2 border-red-500/30 rounded-full"
              style={{ animation: 'spin 3s linear infinite' }}
            />
            <div 
              className="absolute inset-2 border-2 border-cyan-500/30 rounded-full"
              style={{ animation: 'spin 2s linear infinite reverse' }}
            />
            <div 
              className="absolute inset-4 border-2 border-purple-500/30 rounded-full"
              style={{ animation: 'spin 4s linear infinite' }}
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Pulsing glow */}
          <div 
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Status text */}
        <div className="text-center mb-6">
          <div className="font-pixel text-red-500 text-lg mb-2 min-h-[1.5rem]">
            {displayText}
            <span className="animate-pulse">_</span>
          </div>
          <div className="text-gray-600 text-xs">
            {messageIndex < LOADING_MESSAGES.length - 1 
              ? `STEP ${messageIndex + 1} OF ${LOADING_MESSAGES.length}`
              : 'COMPLETE'
            }
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 bg-black border border-gray-800 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 transition-all duration-300"
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
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>0%</span>
            <span className="text-red-500 font-pixel">{Math.floor(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < messageIndex ? 'bg-red-500' :
                i === messageIndex ? 'bg-cyan-500 animate-pulse' :
                'bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Warning text */}
        <div className="mt-8 text-center">
          <p className="text-amber-500/60 text-xs animate-pulse flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
            </svg>
            CLASSIFIED OPERATION ACTIVE
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
            </svg>
          </p>
        </div>
      </div>

      <style>{`
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