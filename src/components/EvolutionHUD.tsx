'use client';

import React from 'react';
import { CoinIcon, EvolutionIcon, ChartIcon } from '@/icons';
import { formatMarketCap } from '@/lib/utils';
import type { SpecimenState, EvolutionStage } from '@/types';

interface EvolutionHUDProps {
  state: SpecimenState;
  stage: EvolutionStage;
  nextStage: EvolutionStage | null;
}

export const EvolutionHUD: React.FC<EvolutionHUDProps> = ({
  state,
  stage,
  nextStage,
}) => {
  const progress = Math.min(100, Math.max(0, state.evolution_progress));

  return (
    <div className="terminal-panel p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-terminal-border">
        <EvolutionIcon className="text-terminal-cyan" size={16} />
        <span className="font-pixel text-xs text-terminal-cyan tracking-wider">
          SPECIMEN STATUS
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="status-dot online" />
          <span className="text-terminal-muted text-xs">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Market Cap */}
        <div className="bg-terminal-bg p-3 border border-terminal-border">
          <div className="flex items-center gap-2 mb-1">
            <CoinIcon className="text-terminal-amber" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Market Cap</span>
          </div>
          <div className="font-pixel text-lg text-terminal-amber glow-amber">
            {formatMarketCap(Number(state.market_cap))}
          </div>
        </div>

        {/* Current Stage */}
        <div className="bg-terminal-bg p-3 border border-terminal-border">
          <div className="flex items-center gap-2 mb-1">
            <EvolutionIcon className="text-terminal-purple" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Stage</span>
          </div>
          <div className="font-pixel text-lg text-terminal-purple">
            {stage.stage}
            <span className="text-terminal-muted text-xs ml-2 font-mono">
              {stage.name}
            </span>
          </div>
        </div>
      </div>

      {/* Evolution Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChartIcon className="text-terminal-green" size={12} />
            <span className="text-terminal-muted text-xs uppercase">Evolution Progress</span>
          </div>
          <span className="font-pixel text-xs text-terminal-green">
            {progress.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Next Stage Info */}
        {nextStage ? (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-terminal-muted">
              Next: <span className="text-terminal-cyan">{nextStage.name}</span>
            </span>
            <span className="text-terminal-muted">
              @ {formatMarketCap(Number(nextStage.market_cap_required))}
            </span>
          </div>
        ) : (
          <div className="mt-2 text-xs text-terminal-purple">
            MAX EVOLUTION REACHED
          </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionHUD;
