'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  seconds: number;
  running: boolean;
  onEnd: () => void;
  label?: string;
}

export const Timer: React.FC<TimerProps> = ({ seconds, running, onEnd, label }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const endedRef = useRef(false);

  // Reset when seconds prop changes
  useEffect(() => {
    setTimeLeft(seconds);
    endedRef.current = false;
  }, [seconds]);

  // Countdown logic
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
    <div className={`inline-flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all ${
      isCritical 
        ? 'bg-red-500/30 border-red-500 animate-pulse shadow-lg shadow-red-500/50' 
        : isUrgent
        ? 'bg-red-500/20 border-red-500/70 animate-pulse'
        : 'bg-black/50 border-red-500/30'
    }`}>
      {label && (
        <span className={`text-[10px] font-pixel tracking-wider ${
          isCritical ? 'text-red-400' : 'text-white/50'
        }`}>
          {label}
        </span>
      )}
      
      <div className="flex items-center justify-center gap-2">
        {/* Clock icon */}
        <svg 
          className={`w-5 h-5 ${
            isCritical ? 'text-red-500 animate-spin' : isUrgent ? 'text-red-500' : 'text-red-400'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>

        {/* Time display */}
        <span className={`font-mono text-2xl font-bold tracking-wider tabular-nums ${
          isCritical ? 'text-red-500' : isUrgent ? 'text-red-400' : 'text-red-400'
        }`}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      {/* Warning messages */}
      {isCritical && timeLeft > 0 && (
        <span className="text-red-500 text-[10px] font-pixel animate-bounce">
          ⚠️ LAST CHANCE
        </span>
      )}
      {isUrgent && !isCritical && timeLeft > 0 && (
        <span className="text-red-400/80 text-[10px] font-pixel">
          HURRY!
        </span>
      )}
      {timeLeft === 0 && (
        <span className="text-red-500 text-[10px] font-pixel">
          TIME'S UP
        </span>
      )}
    </div>
  );
};

export default Timer;