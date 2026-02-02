'use client';

import React from 'react';
import { ChartIcon } from '@/icons';

interface DexChartProps {
  tokenAddress: string;
  chainId?: string;
}

export const DexChart: React.FC<DexChartProps> = ({ 
  tokenAddress, 
  chainId = 'solana' 
}) => {
  // DexScreener embed URL
  const embedUrl = `https://dexscreener.com/${chainId}/${tokenAddress}?embed=1&theme=dark&trades=0&info=0`;

  return (
    <div className="terminal-panel p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-terminal-border">
        <ChartIcon className="text-terminal-cyan" size={16} />
        <span className="font-pixel text-xs text-terminal-cyan tracking-wider">
          LIVE CHART
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
          <span className="text-terminal-muted text-xs">DEXSCREENER</span>
        </div>
      </div>

      {/* Chart Embed */}
      <div className="relative w-full rounded overflow-hidden border border-terminal-border bg-[#0d0d0d]" style={{ height: '400px' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="clipboard-write"
          allowFullScreen
          title="DexScreener Chart"
        />
      </div>

      {/* Footer Links */}
      <div className="mt-3 flex items-center justify-between">
        <a
          href={`https://dexscreener.com/${chainId}/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-muted text-xs hover:text-terminal-cyan transition-colors flex items-center gap-1"
        >
          <span>View on DexScreener</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <div className="text-terminal-dim text-xs">
          Powered by DexScreener
        </div>
      </div>
    </div>
  );
};

export default DexChart;