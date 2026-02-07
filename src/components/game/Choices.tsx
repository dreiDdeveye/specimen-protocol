'use client';

import React from 'react';
import { StoryChoice, GamePhase } from './types';

interface ChoicesProps {
  choices: StoryChoice[];
  phase: GamePhase;
  userChoice: string | null;
  winningChoice: string | null;
  onSelect: (choiceId: string) => void;
  totalVotes: number;
}

export const Choices: React.FC<ChoicesProps> = ({
  choices,
  phase,
  userChoice,
  winningChoice,
  onSelect,
  totalVotes,
}) => {
  const isCorrect = userChoice && userChoice === winningChoice;
  const showResults = phase === 'results';
  const showPercentages = phase === 'waiting' || phase === 'results';

  return (
    <div className={`bg-black/60 backdrop-blur-sm border-2 rounded-xl p-6 transition-all ${
      showResults 
        ? isCorrect 
          ? 'border-green-500/70 shadow-lg shadow-green-500/20' 
          : 'border-red-500/70 shadow-lg shadow-red-500/20'
        : 'border-amber-500/30'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          {showResults ? (
            <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
          ) : (
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" />
            </svg>
          )}
          <span className={`font-pixel text-sm ${
            showResults 
              ? isCorrect ? 'text-green-400' : 'text-red-400'
              : 'text-amber-400'
          }`}>
            {showResults ? 'RESULTS' : phase === 'waiting' ? 'WAITING FOR RESULTS...' : 'WHAT DO YOU DO?'}
          </span>
        </div>
        <span className="text-white/40 text-xs font-mono bg-white/5 px-2 py-1 rounded">
          {totalVotes.toLocaleString()} votes
        </span>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {choices.map(choice => {
          const percentage = totalVotes > 0 ? (choice.votes / totalVotes) * 100 : 0;
          const isUser = userChoice === choice.id;
          const isWinner = winningChoice === choice.id;

          return (
            <button
              key={choice.id}
              onClick={() => phase === 'voting' && !userChoice && onSelect(choice.id)}
              disabled={phase !== 'voting' || !!userChoice}
              className={`w-full text-left p-4 rounded-xl border-2 relative overflow-hidden transition-all duration-300 ${
                showResults
                  ? isWinner
                    ? 'border-green-500 bg-green-500/10'
                    : isUser
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-white/10 bg-white/5 opacity-50'
                  : isUser
                  ? 'border-amber-500 bg-amber-500/10'
                  : phase === 'voting' && !userChoice
                  ? 'border-white/20 bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer hover:scale-[1.01]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {/* Progress bar */}
              {showPercentages && (
                <div 
                  className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
                    showResults && isWinner 
                      ? 'bg-green-500/20' 
                      : 'bg-amber-500/10'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}
              
              {/* Content */}
              <div className="relative flex items-center justify-between gap-4">
                <span className={`text-sm md:text-base ${
                  showResults && isWinner
                    ? 'text-green-400 font-medium'
                    : showResults && isUser && !isWinner
                    ? 'text-red-400'
                    : isUser
                    ? 'text-amber-400'
                    : 'text-white/80'
                }`}>
                  {choice.text}
                </span>
                
                {showPercentages && (
                  <span className={`text-sm font-mono whitespace-nowrap ${
                    showResults && isWinner ? 'text-green-400' : 'text-white/50'
                  }`}>
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
              
              {/* Labels */}
              <div className="relative flex flex-wrap gap-2 mt-2">
                {isUser && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    showResults && !isWinner 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    ✓ YOUR CHOICE
                  </span>
                )}
                {showResults && isWinner && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                    👑 COMMUNITY WINNER
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Messages */}
      {phase === 'voting' && !userChoice && (
        <div className="text-center mt-5">
          <p className="text-amber-400/80 text-sm font-pixel animate-pulse">
            ⚡ CHOOSE BEFORE TIME RUNS OUT
          </p>
          <p className="text-white/30 text-xs mt-1">
            Pick the same as the community to progress
          </p>
        </div>
      )}

      {phase === 'waiting' && (
        <div className="text-center mt-5">
          <p className="text-white/50 text-sm font-pixel">
            ⏳ Waiting for timer to end...
          </p>
          <p className="text-white/30 text-xs mt-1">
            Watch the votes shift in real-time
          </p>
        </div>
      )}

      {/* Result Message */}
      {showResults && (
        <div className={`mt-5 p-4 rounded-xl text-center ${
          isCorrect 
            ? 'bg-green-500/20 border border-green-500/30' 
            : 'bg-red-500/20 border border-red-500/30'
        }`}>
          {userChoice ? (
            isCorrect ? (
              <div>
                <p className="text-green-400 font-pixel text-lg">✅ CORRECT!</p>
                <p className="text-green-400/70 text-sm mt-1">You survived this round. +1 Progress</p>
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-pixel text-lg">❌ WRONG CHOICE</p>
                <p className="text-red-400/70 text-sm mt-1">The community chose differently. No progress.</p>
              </div>
            )
          ) : (
            <div>
              <p className="text-red-400 font-pixel text-lg">⏰ TOO SLOW</p>
              <p className="text-red-400/70 text-sm mt-1">You didn't choose in time. No progress.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Choices;