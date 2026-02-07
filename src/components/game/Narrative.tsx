'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Narrative as NarrativeType } from './types';

// Typewriter sound effect hook - uses audio file
const useTypingSound = (isTyping: boolean, enabled: boolean = true) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    // Create audio element with typewriter sound
    // Using a base64 encoded short typewriter click for reliability
    audioRef.current = new Audio('/sounds/typewriter.mp3');
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playClick = useCallback(() => {
    if (!audioRef.current || !enabled) return;
    
    // Clone and play for overlapping sounds
    const sound = audioRef.current.cloneNode() as HTMLAudioElement;
    sound.volume = 0.2 + Math.random() * 0.15; // Slight volume variation
    sound.playbackRate = 0.9 + Math.random() * 0.2; // Slight speed variation
    sound.play().catch(() => {}); // Ignore autoplay errors
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isTyping) {
      // Play sound matching the typing speed (every ~60ms for variation)
      playClick(); // Initial click
      intervalRef.current = setInterval(() => {
        playClick();
      }, 55 + Math.random() * 20); // Random interval 55-75ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTyping, enabled, playClick]);
};

// Alternative: Synthesized typewriter sound (no external file needed)
const useTypingSoundSynthesized = (isTyping: boolean, enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayTime = useRef(0);

  const playTypewriterClick = useCallback(() => {
    if (!enabled) return;
    
    // Throttle to prevent too many sounds
    const now = Date.now();
    if (now - lastPlayTime.current < 60) return; // Minimum 60ms between sounds
    lastPlayTime.current = now;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const time = ctx.currentTime;
    
    // Create a softer, more realistic typewriter sound
    // Main click - short burst of filtered noise
    const clickDuration = 0.015; // Very short 15ms
    const bufferSize = Math.floor(ctx.sampleRate * clickDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    // Generate decaying noise
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.3));
      noiseData[i] = (Math.random() * 2 - 1) * decay;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    // Bandpass filter for that classic typewriter "tick"
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000 + Math.random() * 500; // Vary frequency slightly
    filter.Q.value = 2;
    
    // Low volume for subtle effect
    const gainNode = ctx.createGain();
    const volume = 0.08 + Math.random() * 0.04; // Quiet: 0.08-0.12
    gainNode.gain.setValueAtTime(volume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + clickDuration);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noiseSource.start(time);
    noiseSource.stop(time + clickDuration);
    
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isTyping) {
      // Play sound every 70-100ms (like real typing speed)
      const playWithVariation = () => {
        playTypewriterClick();
      };
      
      playWithVariation();
      intervalRef.current = setInterval(() => {
        playWithVariation();
      }, 70 + Math.random() * 30); // Random 70-100ms interval
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTyping, enabled, playTypewriterClick]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
};

// Document Card
const DocumentCard: React.FC<{
  title: string;
  preview: string;
  pdfUrl: string;
}> = ({ title, preview, pdfUrl }) => (
  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
          <polyline points="14,2 14,8 20,8" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-red-400 font-pixel text-xs mb-1">📁 EVIDENCE FOUND</p>
        <p className="text-white text-sm font-mono truncate">{title}</p>
        <p className="text-white/40 text-xs mt-1">{preview}</p>
        <button
          onClick={() => window.open(pdfUrl, '_blank')}
          className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-pixel hover:bg-red-500/30 transition-all"
        >
          VIEW →
        </button>
      </div>
    </div>
  </div>
);

// Single Typing Narrative - separate component for clean state management
const TypingNarrative: React.FC<{
  text: string;
  narrativeId: number;
  document?: NarrativeType['document'];
  onComplete: () => void;
  soundEnabled: boolean;
}> = ({ text, narrativeId, document, onComplete, soundEnabled }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const hasCompletedRef = useRef(false);

  // Use typing sound
  useTypingSoundSynthesized(isTyping, soundEnabled);

  // Typewriter effect
  useEffect(() => {
    hasCompletedRef.current = false;
    setDisplayed('');
    setDone(false);
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        setDone(true);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25); // typing speed

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [text, narrativeId]); // narrativeId ensures reset on new narrative

  // Call onComplete when done
  useEffect(() => {
    if (done && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [done, onComplete]);

  return (
    <>
      <p className="text-white/90 leading-relaxed">
        {displayed}
        {!done && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
      </p>
      {done && document && (
        <DocumentCard
          title={document.title}
          preview={document.preview}
          pdfUrl={document.pdfUrl}
        />
      )}
    </>
  );
};

// Main Narrative Component
interface NarrativeProps {
  narratives: NarrativeType[];
  onAllComplete: () => void;
  isActive: boolean;
  soundEnabled?: boolean;
}

export const NarrativeDisplay: React.FC<NarrativeProps> = ({
  narratives,
  onAllComplete,
  isActive,
  soundEnabled = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedNarratives, setCompletedNarratives] = useState<NarrativeType[]>([]);
  const chapterIdRef = useRef(narratives[0]?.id);

  // Reset when chapter changes (narratives array changes)
  useEffect(() => {
    const newChapterId = narratives[0]?.id;
    if (newChapterId !== chapterIdRef.current) {
      chapterIdRef.current = newChapterId;
      setCurrentIndex(0);
      setCompletedNarratives([]);
    }
  }, [narratives]);

  const currentNarrative = narratives[currentIndex];
  const isLastNarrative = currentIndex === narratives.length - 1;

  // Handle when current narrative finishes typing
  const handleNarrativeComplete = useCallback(() => {
    if (!isActive) return;

    // Add current to completed
    setCompletedNarratives(prev => [...prev, currentNarrative]);

    if (!isLastNarrative) {
      // Move to next narrative after a short pause
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 200);
    } else {
      // All narratives done
      setTimeout(() => {
        onAllComplete();
      }, 500);
    }
  }, [isActive, currentNarrative, isLastNarrative, onAllComplete]);

  return (
    <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-8 relative overflow-hidden">
      {/* Atmosphere effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 to-transparent pointer-events-none" />
      
      <div className="space-y-4 font-mono text-sm md:text-base relative z-10">
        {/* Completed narratives - shown instantly */}
        {completedNarratives.map((n) => (
          <div key={`completed-${n.id}`}>
            <p className="text-white/70 leading-relaxed">{n.text}</p>
            {n.document && (
              <DocumentCard
                title={n.document.title}
                preview={n.document.preview}
                pdfUrl={n.document.pdfUrl}
              />
            )}
          </div>
        ))}

        {/* Current typing narrative */}
        {currentNarrative && isActive && (
          <div>
            <TypingNarrative
              key={`typing-${currentNarrative.id}-${currentIndex}`}
              text={currentNarrative.text}
              narrativeId={currentNarrative.id}
              document={currentNarrative.document}
              onComplete={handleNarrativeComplete}
              soundEnabled={soundEnabled}
            />
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex justify-center gap-1.5">
        {narratives.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < currentIndex
                ? 'w-6 bg-red-500'
                : i === currentIndex
                ? 'w-6 bg-red-500/50 animate-pulse'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Narrative counter */}
      <div className="mt-3 text-center">
        <span className="text-white/30 text-xs font-mono">
          {Math.min(currentIndex + 1, narratives.length)} / {narratives.length}
        </span>
      </div>
    </div>
  );
};

export default NarrativeDisplay;