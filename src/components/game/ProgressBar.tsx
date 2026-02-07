'use client';

import React from 'react';

interface ProgressBarProps {
  currentStage: number;      // 0-6 (0 = not started, 6 = complete)
  totalStages: number;       // Always 6
  currentChapter: number;    // 1-8
  totalChapters: number;     // Always 8
  chapterTitle?: string;     // "The Awakening", etc.
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStage, 
  totalStages = 6, 
  currentChapter, 
  totalChapters = 8,
  chapterTitle 
}) => {
  const stagePercentage = (currentStage / totalStages) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chapter Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span className="text-red-400 font-pixel text-sm tracking-wider">
            CHAPTER {currentChapter}
          </span>
          {chapterTitle && (
            <>
              <span className="text-white/20">—</span>
              <span className="text-white/50 text-xs font-medium">
                {chapterTitle}
              </span>
            </>
          )}
        </div>
        <span className="text-white/40 text-xs font-pixel">
          {currentChapter} / {totalChapters}
        </span>
      </div>

      {/* Chapter Progress Dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {Array.from({ length: totalChapters }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i + 1 < currentChapter
                ? 'w-4 bg-green-500'
                : i + 1 === currentChapter
                ? 'w-4 bg-red-500'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Stage Progress Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/40 text-[10px] tracking-widest uppercase">
          Stage Progress
        </span>
        <span className="text-red-400 text-sm font-pixel">
          {currentStage} / {totalStages}
        </span>
      </div>

      {/* Stage progress bar */}
      <div className="h-3 bg-black/50 rounded-full border border-white/10 overflow-hidden relative">
        {/* Filled portion */}
        <div 
          className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${stagePercentage}%` }}
        >
          {/* Shimmer effect */}
          {currentStage > 0 && currentStage < totalStages && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>

        {/* Segment markers for 6 stages */}
        {Array.from({ length: totalStages - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-0.5 bg-white/10"
            style={{ left: `${((i + 1) / totalStages) * 100}%` }}
          />
        ))}
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between mt-3 px-0.5">
        {Array.from({ length: totalStages }).map((_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 transition-all duration-300`}
          >
            <div 
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < currentStage 
                  ? 'bg-green-400' 
                  : i === currentStage 
                  ? 'bg-red-400 animate-pulse ring-2 ring-red-400/30' 
                  : 'bg-white/20'
              }`}
            />
            <span className={`text-[9px] ${
              i < currentStage 
                ? 'text-green-400/70' 
                : i === currentStage 
                ? 'text-red-400' 
                : 'text-white/20'
            }`}>
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Status text */}
      <div className="text-center mt-4">
        <span className={`text-xs font-medium ${
          currentStage === totalStages 
            ? 'text-green-400' 
            : currentStage >= 4 
            ? 'text-amber-400' 
            : currentStage > 0
            ? 'text-white/50'
            : 'text-white/30'
        }`}>
          {currentStage === 0 && "Answer correctly to progress..."}
          {currentStage > 0 && currentStage < 4 && "Keep going..."}
          {currentStage >= 4 && currentStage < totalStages && "Almost there..."}
          {currentStage === totalStages && "Chapter Complete! Proceed to next chapter →"}
        </span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;