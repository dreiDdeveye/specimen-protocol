'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StoryNode, BranchingChoice } from './types';

// Timer Component - Standalone for positioning outside
export const StoryTimer: React.FC<{
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
        : 'bg-black/70 border-red-500/30'
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
      
      const strikeOsc = ctx.createOscillator();
      strikeOsc.type = 'square';
      strikeOsc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      strikeOsc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.25, time);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      const hammerOsc = ctx.createOscillator();
      hammerOsc.type = 'sine';
      hammerOsc.frequency.setValueAtTime(4000 + Math.random() * 800, time);
      hammerOsc.frequency.exponentialRampToValueAtTime(1500, time + 0.015);
      
      const hammerGain = ctx.createGain();
      hammerGain.gain.setValueAtTime(0.08, time);
      hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      
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

// Main Story Node Display Component - NEW OVERLAY LAYOUT
interface StoryNodeDisplayProps {
  node: StoryNode;
  onChoice: (choice: BranchingChoice) => void;
  onContinue: () => void;
  onDeath: () => void;
  onChapterComplete: (nextChapter: number) => void;
  soundEnabled?: boolean;
  stageImage: string; // Pass the stage image URL
}

export const StoryNodeDisplay: React.FC<StoryNodeDisplayProps> = ({
  node,
  onChoice,
  onContinue,
  onDeath,
  onChapterComplete,
  soundEnabled = true,
  stageImage,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<BranchingChoice | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [waitingForTimer, setWaitingForTimer] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const playTypeSound = useTypingSound(soundEnabled);

  // Reset state when node changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);
    setSelectedChoice(null);
    setShowConsequence(false);
    setWaitingForTimer(false);
    setTimerRunning(false);
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
        
        // Show choices after text completes (for choice nodes)
        if (node.type === 'choice' && node.choices) {
          setTimeout(() => {
            setShowChoices(true);
            setTimerRunning(true);
          }, 500);
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

  // Handle choice selection
  const handleChoiceSelect = (choice: BranchingChoice) => {
    if (selectedChoice || waitingForTimer) return;
    
    setSelectedChoice(choice);
    setWaitingForTimer(true);
    
    if (choice.consequence) {
      setShowConsequence(true);
    }
  };

  // Handle timer end
  const handleTimerEnd = useCallback(() => {
    if (selectedChoice) {
      setWaitingForTimer(false);
      setTimeout(() => {
        onChoice(selectedChoice);
      }, 500);
    } else if (node.choices && node.choices.length > 0) {
      const defaultChoice = node.choices[0];
      setSelectedChoice(defaultChoice);
      setShowConsequence(true);
      setTimeout(() => {
        onChoice(defaultChoice);
      }, 1500);
    }
  }, [selectedChoice, node.choices, onChoice]);

  // Images that have the TV frame (need special positioning)
  // All other images will use simple bottom overlay
  const TV_FRAME_IMAGES = [
    '/C1/C1S1.jpg',
    '/C1/C1S2.jpg',
    '/C1/C1S2-door.jpg',
    '/C1/C1S2-Cot.jpg',
    '/C1/C1S2%20VENT.jpg',
    '/C1/C1S3.jpg',
    '/C1/C1S3-earrings.jpg',
    '/C1/C1S3-death.jpg',
    '/C1/C1S4.jpg',
    '/C1/C1S4-pretend.jpg',
    // C2 with TV frames (add any that have TV)
    '/C2/C2S1.jpg',
    '/C2/C2S1-MARINA.jpg',
    '/C2/C2S1-death.jpg',
  ];

  const hasTVFrame = TV_FRAME_IMAGES.includes(stageImage);

  return (
    <div className="space-y-4">
      {/* Timer hint - Above timer */}
      {node.type === 'choice' && !node.noTimer && !selectedChoice && showChoices && (
        <p className="text-white/30 text-xs text-center">
          Choose before time runs out, or the first option will be selected
        </p>
      )}

      {/* TIMER - Above TV but closer */}
      {node.type === 'choice' && !node.noTimer && (
        <div className="flex justify-center -mb-2">
          <StoryTimer 
            key={timerKey}
            seconds={node.timerSeconds || 300} 
            running={timerRunning} 
            onEnd={handleTimerEnd}
          />
        </div>
      )}

      {/* IMAGE with Story Overlay */}
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Stage Image */}
        <img 
          src={stageImage}
          alt="Stage"
          className="w-full h-auto"
        />
        
        {hasTVFrame ? (
          /* TV FRAME LAYOUT - Text positioned inside TV screen */
          <div 
            className="absolute overflow-hidden"
            style={{
              top: '8%',
              bottom: '35%',
              left: '8%',
              right: '8%',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-3">
              <p className={`text-[10px] md:text-xs leading-relaxed font-mono ${
                node.type === 'death' ? 'text-red-300' : 
                node.type === 'chapter-end' ? 'text-green-300' :
                'text-white'
              }`} style={{ textShadow: '0 0 8px rgba(0,0,0,1), 0 0 16px rgba(0,0,0,0.8)' }}>
                {displayedText}
                {isTyping && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
              </p>

              {node.type === 'death' && node.deathMessage && !isTyping && (
                <p className="text-red-400 text-[10px] mt-1 animate-fadeIn" style={{ textShadow: '0 0 8px rgba(0,0,0,1)' }}>
                  💀 {node.deathMessage}
                </p>
              )}

              {node.type === 'chapter-end' && node.chapterComplete && !isTyping && (
                <p className="text-green-400 text-[10px] mt-1 animate-fadeIn" style={{ textShadow: '0 0 8px rgba(0,0,0,1)' }}>
                  🏆 CHAPTER {node.chapterComplete.chapter} COMPLETE
                </p>
              )}

              {node.type === 'narrative' && !isTyping && (
                <p className="text-white/60 text-[9px] font-pixel animate-pulse mt-1">
                  Continuing...
                </p>
              )}
            </div>
          </div>
        ) : (
          /* NO TV FRAME LAYOUT - Text at bottom with gradient */
          <div className="absolute inset-0 flex flex-col justify-end">
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="relative z-10 p-4 md:p-6">
              <p className={`text-sm md:text-base leading-relaxed font-mono ${
                node.type === 'death' ? 'text-red-300' : 
                node.type === 'chapter-end' ? 'text-green-300' :
                'text-white'
              }`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,1)' }}>
                {displayedText}
                {isTyping && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
              </p>

              {node.type === 'death' && node.deathMessage && !isTyping && (
                <p className="text-red-400 text-sm mt-2 animate-fadeIn">
                  💀 {node.deathMessage}
                </p>
              )}

              {node.type === 'chapter-end' && node.chapterComplete && !isTyping && (
                <p className="text-green-400 text-sm mt-2 animate-fadeIn">
                  🏆 CHAPTER {node.chapterComplete.chapter} COMPLETE
                </p>
              )}

              {node.type === 'narrative' && !isTyping && (
                <p className="text-white/60 text-xs font-pixel animate-pulse mt-2">
                  Continuing...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CHOICES - Below TV */}
      {showChoices && node.type === 'choice' && node.choices && (
        <div className="max-w-2xl mx-auto space-y-3 animate-fadeIn">
          {/* Question */}
          {node.question && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-amber-400 text-sm font-medium text-center">{node.question}</p>
            </div>
          )}

          {/* Choice buttons */}
          <div className="grid gap-2">
            {node.choices.map((choice) => {
              const isSelected = selectedChoice?.id === choice.id;
              const isLocked = waitingForTimer && selectedChoice !== null;
              
              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={isLocked}
                  className={`w-full p-3 text-left rounded-lg border transition-all text-sm ${
                    !isLocked 
                      ? 'bg-black/60 border-white/20 hover:bg-white/10 hover:border-amber-500/50 text-white/80 cursor-pointer'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-black/40 border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {choice.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{choice.text}</span>
                    {isLocked && isSelected && (
                      <span className="text-amber-400 text-xs">✓ LOCKED</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Consequence text */}
          {showConsequence && selectedChoice?.consequence && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center animate-fadeIn">
              <p className="text-amber-400/80 text-sm italic">{selectedChoice.consequence}</p>
            </div>
          )}

          {/* Waiting indicator */}
          {waitingForTimer && (
            <div className="text-amber-400 text-xs font-pixel animate-pulse text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              CHOICE LOCKED - WAITING FOR TIMER
            </div>
          )}
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