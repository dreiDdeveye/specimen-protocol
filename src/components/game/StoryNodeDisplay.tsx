'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StoryNode, BranchingChoice } from './types';

// Timer Component
const StoryTimer: React.FC<{
  seconds: number;
  running: boolean;
  onEnd: () => void;
}> = ({ seconds, running, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const endedRef = useRef(false);

  useEffect(() => {
    setTimeLeft(seconds);
    endedRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!endedRef.current) {
            endedRef.current = true;
            setTimeout(onEnd, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, onEnd, timeLeft]);

  const isUrgent = timeLeft < 60;
  const isCritical = timeLeft < 30;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-1 px-5 py-2.5 rounded-xl border transition-all ${
      isCritical 
        ? 'bg-red-500/30 border-red-500 animate-pulse shadow-lg shadow-red-500/30' 
        : isUrgent
        ? 'bg-red-500/20 border-red-500/70'
        : 'bg-black/50 border-red-500/30'
    }`}>
      <span className={`text-[10px] font-pixel tracking-wider ${
        isCritical ? 'text-red-400' : 'text-white/40'
      }`}>
        TIME REMAINING
      </span>
      
      <div className="flex items-center justify-center gap-2">
        <svg 
          className={`w-4 h-4 ${
            isCritical ? 'text-red-500 animate-pulse' : 'text-red-400/70'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>

        <span className={`font-mono text-xl font-bold tracking-wider tabular-nums ${
          isCritical ? 'text-red-500' : isUrgent ? 'text-red-400' : 'text-white/80'
        }`}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      {isCritical && timeLeft > 0 && (
        <span className="text-red-500 text-[9px] font-pixel">
          DECIDE NOW!
        </span>
      )}
    </div>
  );
};

// Typewriter sound hook
const useTypingSound = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playClick = useCallback(() => {
    if (!enabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const time = ctx.currentTime;
      
      // Key strike
      const strikeOsc = ctx.createOscillator();
      strikeOsc.type = 'square';
      strikeOsc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      strikeOsc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.25, time);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      // Hammer hit
      const hammerOsc = ctx.createOscillator();
      hammerOsc.type = 'sine';
      hammerOsc.frequency.setValueAtTime(4000 + Math.random() * 800, time);
      hammerOsc.frequency.exponentialRampToValueAtTime(1500, time + 0.015);
      
      const hammerGain = ctx.createGain();
      hammerGain.gain.setValueAtTime(0.08, time);
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
      noiseGain.gain.value = 0.3;
      
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      
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
  }, [enabled]);

  return playClick;
};

// Document Card Component
const DocumentCard: React.FC<{
  title: string;
  preview: string;
  pdfUrl: string;
}> = ({ title, preview, pdfUrl }) => (
  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fadeIn">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
          <polyline points="14,2 14,8 20,8" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-red-400 font-pixel text-xs mb-1">EVIDENCE UNLOCKED</p>
        <p className="text-white text-sm font-mono truncate">{title}</p>
        <p className="text-white/40 text-xs mt-1">{preview}</p>
        <button
          onClick={() => window.open(pdfUrl, '_blank')}
          className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-pixel hover:bg-red-500/30 transition-all"
        >
          VIEW DOCUMENT →
        </button>
      </div>
    </div>
  </div>
);

// Main Story Node Display Component
interface StoryNodeDisplayProps {
  node: StoryNode;
  onChoice: (choice: BranchingChoice) => void;
  onContinue: () => void;
  onDeath: () => void;
  onChapterComplete: (nextChapter: number) => void;
  soundEnabled?: boolean;
}

export const StoryNodeDisplay: React.FC<StoryNodeDisplayProps> = ({
  node,
  onChoice,
  onContinue,
  onDeath,
  onChapterComplete,
  soundEnabled = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<BranchingChoice | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [waitingForTimer, setWaitingForTimer] = useState(false);

  const playTypeSound = useTypingSound(soundEnabled);

  // Reset state when node changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);
    setSelectedChoice(null);
    setShowConsequence(false);
    setShowDocument(false);
    setWaitingForTimer(false);
    setTimerKey(prev => prev + 1);
  }, [node.id]);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const text = node.text;
    const typingSpeed = 35;
    
    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        
        if (text[index] !== ' ' && soundEnabled) {
          playTypeSound();
        }
        
        index++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
        
        // Show document if exists
        if (node.document) {
          setTimeout(() => setShowDocument(true), 300);
        }
        
        // Show choices after text completes (for choice nodes)
        if (node.type === 'choice' && node.choices) {
          setTimeout(() => setShowChoices(true), 500);
        }
        
        // Auto-continue for narrative nodes
        if (node.type === 'narrative' && node.nextNode) {
          setTimeout(() => onContinue(), 2000);
        }
        
        // Handle death nodes
        if (node.type === 'death') {
          setTimeout(() => onDeath(), 3000);
        }
        
        // Handle chapter complete
        if (node.type === 'chapter-end' && node.chapterComplete) {
          setTimeout(() => {
            onChapterComplete(node.chapterComplete!.nextChapter);
          }, 4000);
        }
      }
    };
    
    typeNextChar();

    return () => {
      index = text.length;
    };
  }, [node, soundEnabled, playTypeSound, onContinue, onDeath, onChapterComplete]);

  // Handle choice selection - locks in but waits for timer
  const handleChoiceSelect = (choice: BranchingChoice) => {
    if (selectedChoice || waitingForTimer) return;
    
    setSelectedChoice(choice);
    setWaitingForTimer(true);
    
    if (choice.consequence) {
      setShowConsequence(true);
    }
  };

  // Handle timer end - proceed with chosen choice
  const handleTimerEnd = useCallback(() => {
    if (selectedChoice) {
      // Choice was made, proceed to next node
      setWaitingForTimer(false);
      setTimeout(() => {
        onChoice(selectedChoice);
      }, 500);
    } else if (node.choices && node.choices.length > 0) {
      // No choice made - auto-select first choice (or random)
      const defaultChoice = node.choices[0];
      setSelectedChoice(defaultChoice);
      setShowConsequence(true);
      setTimeout(() => {
        onChoice(defaultChoice);
      }, 1500);
    }
  }, [selectedChoice, node.choices, onChoice]);

  // Determine node type styling
  const getBorderStyle = () => {
    switch (node.type) {
      case 'death':
        return 'border-red-500/70 bg-red-900/20';
      case 'chapter-end':
        return 'border-green-500/50 bg-green-900/10';
      case 'victory':
        return 'border-amber-500/50 bg-amber-900/10';
      default:
        return 'border-white/10';
    }
  };

  return (
    <div className={`bg-black/60 backdrop-blur-sm border rounded-xl p-5 md:p-8 relative overflow-hidden ${getBorderStyle()}`}>
      {/* Death overlay */}
      {node.type === 'death' && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/20 border-b border-red-500/30 px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-red-500 text-lg">💀</span>
          <span className="text-red-400 text-sm font-pixel">DEATH</span>
        </div>
      )}
      
      {/* Chapter complete overlay */}
      {node.type === 'chapter-end' && (
        <div className="absolute top-0 left-0 right-0 bg-green-500/20 border-b border-green-500/30 px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-green-500 text-lg">✓</span>
          <span className="text-green-400 text-sm font-pixel">CHAPTER COMPLETE</span>
        </div>
      )}
      
      {/* Atmosphere effect */}
      <div className={`absolute inset-0 pointer-events-none ${
        node.type === 'death' 
          ? 'bg-gradient-to-b from-red-900/30 to-transparent' 
          : node.type === 'chapter-end'
          ? 'bg-gradient-to-b from-green-900/20 to-transparent'
          : 'bg-gradient-to-b from-red-900/5 to-transparent'
      }`} />
      
      {/* Node ID indicator (for debugging/reference) */}
      <div className={`flex items-center gap-2 mb-4 ${node.type === 'death' || node.type === 'chapter-end' ? 'mt-6' : ''}`}>
        <span className="text-red-400/40 text-xs font-pixel">{node.id.toUpperCase()}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Story text */}
      <div className="relative z-10 mb-6">
        <p className={`leading-relaxed font-mono text-sm md:text-base ${
          node.type === 'death' ? 'text-red-300/90' : 
          node.type === 'chapter-end' ? 'text-green-300/90' :
          'text-white/90'
        }`}>
          {displayedText}
          {isTyping && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
        </p>
      </div>

      {/* Death message */}
      {node.type === 'death' && node.deathMessage && !isTyping && (
        <div className="mt-4 p-4 bg-red-900/50 border-2 border-red-500 rounded-lg text-center animate-fadeIn">
          <p className="text-2xl mb-2">💀</p>
          <p className="text-red-400 font-pixel text-lg mb-2">YOU DIED</p>
          <p className="text-red-400/80 text-sm">{node.deathMessage}</p>
          <p className="text-red-400/60 text-xs mt-3">Restarting...</p>
        </div>
      )}

      {/* Chapter complete message */}
      {node.type === 'chapter-end' && node.chapterComplete && !isTyping && (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-center animate-fadeIn">
          <p className="text-2xl mb-2">🏆</p>
          <p className="text-green-400 font-pixel text-lg mb-2">
            CHAPTER {node.chapterComplete.chapter} COMPLETE
          </p>
          <p className="text-green-400/80 text-sm">{node.chapterComplete.summary}</p>
          <p className="text-green-400/60 text-xs mt-3">
            Loading Chapter {node.chapterComplete.nextChapter}...
          </p>
        </div>
      )}

      {/* Document unlock */}
      {showDocument && node.document && (
        <DocumentCard
          title={node.document.title}
          preview={node.document.preview}
          pdfUrl={node.document.pdfUrl}
        />
      )}

      {/* Question and choices */}
      {showChoices && node.type === 'choice' && node.choices && (
        <div className="relative z-10 animate-fadeIn">
          {/* Question */}
          {node.question && (
            <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-amber-400 text-sm font-medium">{node.question}</p>
            </div>
          )}

          {/* Choices */}
          <div className="grid gap-2">
            {node.choices.map((choice) => {
              const isSelected = selectedChoice?.id === choice.id;
              const isLocked = waitingForTimer && selectedChoice !== null;
              
              let buttonClass = 'w-full p-3 text-left rounded-lg border transition-all text-sm ';
              
              if (!isLocked) {
                // Can click
                buttonClass += 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-amber-500/50 text-white/80 cursor-pointer';
              } else if (isSelected) {
                // Selected, waiting for timer
                buttonClass += 'bg-amber-500/20 border-amber-500 text-amber-400';
              } else {
                // Other choices while waiting
                buttonClass += 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed';
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={isLocked}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {choice.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{choice.text}</span>
                    {isLocked && isSelected && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
                        </svg>
                        <span className="text-xs">LOCKED</span>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Consequence text */}
          {showConsequence && selectedChoice?.consequence && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center animate-fadeIn">
              <p className="text-amber-400/80 text-sm italic">{selectedChoice.consequence}</p>
            </div>
          )}

          {/* Timer */}
          {!node.noTimer && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <StoryTimer 
                key={timerKey}
                seconds={node.timerSeconds || 300} 
                running={showChoices} 
                onEnd={handleTimerEnd}
              />
              {waitingForTimer && (
                <div className="text-amber-400 text-xs font-pixel animate-pulse flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  CHOICE LOCKED - WAITING FOR TIMER
                </div>
              )}
              {!selectedChoice && (
                <p className="text-white/30 text-xs text-center">
                  Choose before time runs out, or the first option will be selected
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Continue prompt for narrative nodes */}
      {node.type === 'narrative' && !isTyping && (
        <div className="mt-6 text-center animate-fadeIn">
          <p className="text-white/40 text-xs font-pixel animate-pulse">
            Continuing...
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StoryNodeDisplay;