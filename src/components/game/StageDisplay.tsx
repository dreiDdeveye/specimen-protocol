'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StoryStage } from './types';

// Inline Timer Component for Stage
const StageTimer: React.FC<{
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
          HURRY!
        </span>
      )}
    </div>
  );
};

// Authentic typewriter sound - mechanical key strike
const useTypingSound = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context immediately (user has already clicked to start game)
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume immediately - user interaction already happened to get to this screen
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
    
    // Create context if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const time = ctx.currentTime;
      
      // === PART 1: Initial key strike (the "clack") ===
      const strikeOsc = ctx.createOscillator();
      strikeOsc.type = 'square';
      strikeOsc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      strikeOsc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.25, time);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      // === PART 2: Metal hammer hitting (the "tink") ===
      const hammerOsc = ctx.createOscillator();
      hammerOsc.type = 'sine';
      hammerOsc.frequency.setValueAtTime(4000 + Math.random() * 800, time);
      hammerOsc.frequency.exponentialRampToValueAtTime(1500, time + 0.015);
      
      const hammerGain = ctx.createGain();
      hammerGain.gain.setValueAtTime(0.08, time);
      hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      
      // === PART 3: Mechanical noise (paper/ribbon impact) ===
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
      
      // === Master output ===
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      
      // Connect strike
      strikeOsc.connect(strikeGain);
      strikeGain.connect(masterGain);
      
      // Connect hammer
      hammerOsc.connect(hammerGain);
      hammerGain.connect(masterGain);
      
      // Connect noise
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      // Output
      masterGain.connect(ctx.destination);
      
      // Play all parts
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
  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
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

// Main Stage Display Component
interface StageDisplayProps {
  stage: StoryStage;
  stageNumber: number;
  onAnswer: (isCorrect: boolean) => void;
  onTimeUp?: () => void;
  onDeath?: () => void;
  soundEnabled?: boolean;
  wrongAttempts?: number;
  maxWrongAttempts?: number;
}

export const StageDisplay: React.FC<StageDisplayProps> = ({
  stage,
  stageNumber,
  onAnswer,
  onTimeUp,
  onDeath,
  soundEnabled = true,
  wrongAttempts = 0,
  maxWrongAttempts = 0, // 0 means unlimited
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | 'death' | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Check if this is a death scenario
  const isDangerZone = maxWrongAttempts > 0;
  const attemptsLeft = maxWrongAttempts - wrongAttempts;

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (onTimeUp) {
      onTimeUp();
    } else {
      // Treat as wrong answer
      if (isDangerZone && attemptsLeft <= 1) {
        // DEATH!
        setAnswerResult('death');
        setTimeout(() => {
          if (onDeath) onDeath();
        }, 2500);
      } else {
        setAnswerResult('wrong');
        setTimeout(() => {
          setCanRetry(true);
          setSelectedAnswer(null);
          setAnswerResult(null);
          setTimerKey(prev => prev + 1);
          onAnswer(false); // Report wrong to parent for tracking
        }, 1500);
      }
    }
  }, [onTimeUp, onDeath, onAnswer, isDangerZone, attemptsLeft]);

  // Get the typing sound function
  const playTypeSound = useTypingSound(soundEnabled);

  // Typewriter effect for story text - plays sound on each character
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowQuestion(false);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setShowDocument(false);
    setCanRetry(false);
    setTimerKey(prev => prev + 1); // Reset timer on new stage

    let index = 0;
    const text = stage.text;
    const typingSpeed = 35; // ms per character
    
    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        
        // Play sound for visible characters (not spaces)
        if (text[index] !== ' ' && soundEnabled) {
          playTypeSound();
        }
        
        index++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
        // Show question after text completes
        setTimeout(() => setShowQuestion(true), 500);
      }
    };
    
    // Start typing
    typeNextChar();

    return () => {
      index = text.length; // Stop typing on cleanup
    };
  }, [stage, soundEnabled, playTypeSound]);

  // Handle answer selection
  const handleAnswer = (choiceId: string, isCorrect: boolean) => {
    if (selectedAnswer && !canRetry) return; // Already answered and can't retry yet
    
    setSelectedAnswer(choiceId);
    setCanRetry(false);
    
    if (isCorrect) {
      setAnswerResult('correct');
      // Show document if correct and document exists
      if (stage.document) {
        setTimeout(() => setShowDocument(true), 500);
      }
      
      // Callback after delay
      setTimeout(() => {
        onAnswer(true);
      }, 2000);
    } else {
      // Check if this wrong answer causes death
      if (isDangerZone && attemptsLeft <= 1) {
        // DEATH!
        setAnswerResult('death');
        setTimeout(() => {
          if (onDeath) onDeath();
        }, 2500);
      } else {
        // Wrong answer - allow retry after delay
        setAnswerResult('wrong');
        setTimeout(() => {
          setCanRetry(true);
          setSelectedAnswer(null);
          setAnswerResult(null);
          onAnswer(false); // Report wrong to parent for tracking
        }, 1500);
      }
    }
  };

  // Reset for retry
  const handleRetry = () => {
    setSelectedAnswer(null);
    setAnswerResult(null);
    setCanRetry(false);
  };

  return (
    <div className={`bg-black/60 backdrop-blur-sm border rounded-xl p-5 md:p-8 relative overflow-hidden ${
      isDangerZone ? 'border-red-500/50' : 'border-white/10'
    }`}>
      {/* Danger zone warning */}
      {isDangerZone && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/20 border-b border-red-500/30 px-4 py-2 flex items-center justify-between">
          <span className="text-red-400 text-xs font-pixel flex items-center gap-2">
            <span className="animate-pulse">⚠️</span> DANGER ZONE
          </span>
          <span className="text-red-400 text-xs font-pixel">
            {attemptsLeft} {attemptsLeft === 1 ? 'LIFE' : 'LIVES'} LEFT
          </span>
        </div>
      )}
      
      {/* Atmosphere effect */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDangerZone 
          ? 'bg-gradient-to-b from-red-900/20 to-transparent' 
          : 'bg-gradient-to-b from-red-900/5 to-transparent'
      }`} />
      
      {/* Stage indicator */}
      <div className={`flex items-center gap-2 mb-4 ${isDangerZone ? 'mt-6' : ''}`}>
        <span className="text-red-400/60 text-xs font-pixel">STAGE {stageNumber}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Story text */}
      <div className="relative z-10 mb-6">
        <p className="text-white/90 leading-relaxed font-mono text-sm md:text-base">
          {displayedText}
          {isTyping && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
        </p>
      </div>

      {/* Question and choices */}
      {showQuestion && (
        <div className="relative z-10 animate-fadeIn">
          {/* Question */}
          <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-amber-400 text-sm font-medium">{stage.question}</p>
          </div>

          {/* Choices */}
          <div className="grid gap-2">
            {stage.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const showResult = answerResult !== null && !canRetry;
              
              let buttonClass = 'w-full p-3 text-left rounded-lg border transition-all text-sm ';
              
              if (canRetry || !answerResult) {
                // Can click - either fresh or retry mode
                buttonClass += 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 text-white/80 cursor-pointer';
              } else if (isSelected && answerResult === 'correct') {
                // User selected correct answer
                buttonClass += 'bg-green-500/20 border-green-500 text-green-400';
              } else if (isSelected && answerResult === 'wrong') {
                // User selected wrong answer - only highlight their wrong choice
                buttonClass += 'bg-red-500/20 border-red-500 text-red-400';
              } else {
                // Other choices - keep them neutral (don't reveal correct answer)
                buttonClass += 'bg-white/5 border-white/10 text-white/40';
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleAnswer(choice.id, choice.isCorrect)}
                  disabled={showResult && !canRetry}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {choice.id.toUpperCase()}
                    </span>
                    <span>{choice.text}</span>
                    {showResult && isSelected && (
                      <span className="ml-auto">
                        {answerResult === 'correct' ? '✓' : '✗'}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timer */}
          {!answerResult && (
            <div className="mt-6 flex justify-center">
              <StageTimer 
                key={timerKey}
                seconds={300} 
                running={!answerResult && showQuestion} 
                onEnd={handleTimeUp}
              />
            </div>
          )}

          {/* Answer feedback */}
          {answerResult && !canRetry && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              answerResult === 'correct' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : answerResult === 'death'
                ? 'bg-red-900/50 text-red-400 border-2 border-red-500'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {answerResult === 'correct' && (
                <p className="text-sm font-medium">✅ Correct! Moving to next stage...</p>
              )}
              {answerResult === 'wrong' && (
                <p className="text-sm font-medium">
                  {selectedAnswer ? '❌ Wrong answer! Try again...' : '⏰ Time\'s up! Try again...'}
                </p>
              )}
              {answerResult === 'death' && (
                <div className="space-y-2">
                  <p className="text-2xl">💀</p>
                  <p className="text-lg font-pixel text-red-500">YOU DIED</p>
                  <p className="text-sm text-red-400/80">They caught you. Game over.</p>
                  <p className="text-xs text-red-400/60 mt-2">Restarting from the beginning...</p>
                </div>
              )}
            </div>
          )}

          {/* Retry prompt */}
          {canRetry && (
            <div className="mt-4 p-3 rounded-lg text-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <p className="text-sm font-medium mb-2">Choose again - pick the right answer!</p>
              {isDangerZone && (
                <p className="text-xs text-red-400">⚠️ {attemptsLeft} {attemptsLeft === 1 ? 'life' : 'lives'} remaining!</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Document unlock */}
      {showDocument && stage.document && (
        <DocumentCard
          title={stage.document.title}
          preview={stage.document.preview}
          pdfUrl={stage.document.pdfUrl}
        />
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

export default StageDisplay;