'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Types
interface Feeder {
  rank: number;
  name: string;
  amount: number;
  wallet: string | null;
  feedCount?: number;
  lastFeedAt?: string;
}

interface FeedStats {
  totalFed: number;
  totalFeeders: number;
}

// Icons
const CrownIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L9 9L1 8L6 14L4 23H20L18 14L23 8L15 9L12 1Z" />
  </svg>
);

const MedalIcon: React.FC<{ className?: string; size?: number; rank: 2 | 3 }> = ({ className = '', size = 16, rank }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="14" r="7" />
    <path d="M7 2L9 8H15L17 2H14L12 5L10 2H7Z" fillOpacity="0.7" />
    <text x="12" y="17" textAnchor="middle" fontSize="8" fill="currentColor" className="font-bold">{rank}</text>
  </svg>
);

const FlameIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23C16.5 23 20 19.5 20 15C20 11.5 18 9 16 7C16 9 15 11 13 11C13 8 12 4 8 1C8 5 6 8 6 11C4.5 11 4 9.5 4 9.5C2.5 11.5 2 13 2 15C2 19.5 5.5 23 10 23C10 21 10 20 12 18C14 20 14 21 14 23H12Z" />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 12 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V8C19 10.2 17.2 12 15 12H14.5C14 13.5 13.2 14.7 12 15.5V18H15C15.6 18 16 18.4 16 19V21C16 21.6 15.6 22 15 22H9C8.4 22 8 21.6 8 21V19C8 18.4 8.4 18 9 18H12V15.5C10.8 14.7 10 13.5 9.5 12H9C6.8 12 5 10.2 5 8V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM7 7V8C7 9.1 7.9 10 9 10H9.2C9.1 9.4 9 8.7 9 8V7H7ZM15 7V8C15 8.7 14.9 9.4 14.8 10H15C16.1 10 17 9.1 17 8V7H15Z" />
  </svg>
);

const AlertIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 12 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClawIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 2C9 2 7 6 7 10C7 12 8 14 8 14L5 18C5 18 4 20 6 21C8 22 9 21 9 21L12 17L15 21C15 21 16 22 18 21C20 20 19 18 19 18L16 14C16 14 17 12 17 10C17 6 15 2 15 2C15 2 14 4 12 4C10 4 9 2 9 2Z" />
  </svg>
);

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

export const LiveFeedLeaderboard: React.FC = () => {
  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [stats, setStats] = useState<FeedStats>({ totalFed: 0, totalFeeders: 0 });
  const [showSparkle, setShowSparkle] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/feeds?limit=10&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success) {
        setFeeders(data.feeders || []);
        setStats(data.stats || { totalFed: 0, totalFeeders: 0 });
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 1000); // Poll every 1 second
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // Sparkle animation for #1
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkle(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const maxAmount = feeders[0]?.amount || 1;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          container: 'bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 border border-yellow-500/50',
          text: 'text-yellow-400 font-bold text-base',
          amount: 'text-yellow-300 font-bold',
          glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
          bar: 'bg-gradient-to-r from-yellow-500 to-amber-400',
        };
      case 2:
        return {
          container: 'bg-slate-400/10 border border-slate-400/30',
          text: 'text-slate-300 font-semibold text-sm',
          amount: 'text-slate-200',
          glow: '',
          bar: 'bg-gradient-to-r from-slate-400 to-slate-300',
        };
      case 3:
        return {
          container: 'bg-amber-700/10 border border-amber-700/30',
          text: 'text-amber-600 font-semibold text-sm',
          amount: 'text-amber-500',
          glow: '',
          bar: 'bg-gradient-to-r from-amber-700 to-amber-600',
        };
      default:
        return {
          container: 'bg-white/5 border border-white/10',
          text: 'text-white/60 text-xs',
          amount: 'text-white/50',
          glow: '',
          bar: 'bg-white/30',
        };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: 
        return <CrownIcon className="text-yellow-400" size={20} />;
      case 2: 
        return <MedalIcon className="text-slate-300" size={18} rank={2} />;
      case 3: 
        return <MedalIcon className="text-amber-600" size={18} rank={3} />;
      default: 
        return <span className="text-xs text-white/40 font-pixel">#{rank}</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <FlameIcon className="text-orange-500" size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-terminal-green rounded-full animate-ping" />
          </div>
          <span className="font-pixel text-terminal-green text-xs tracking-wider">LIVE FEED</span>
        </div>
        <svg 
          className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-terminal-red text-xs">{error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-2 text-terminal-green text-xs hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!error && feeders.length === 0 && (
        <div className="text-center py-6">
          <ClawIcon className="mx-auto text-white/20 mb-2" size={32} />
          <p className="text-white/40 text-xs">No feeders yet</p>
          <p className="text-white/30 text-[10px] mt-1">Be the first to feed!</p>
        </div>
      )}

      {/* Leaderboard */}
      {!error && feeders.length > 0 && (
        <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-[180px]'}`}>
          {feeders.slice(0, isExpanded ? 10 : 5).map((feeder) => {
            const style = getRankStyle(feeder.rank);
            const barWidth = (feeder.amount / maxAmount) * 100;

            return (
              <div
                key={`${feeder.rank}-${feeder.name}`}
                className={`relative rounded-lg p-2 transition-all duration-300 ${style.container} ${style.glow}`}
              >
                {/* #1 Special Effects */}
                {feeder.rank === 1 && (
                  <>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-shimmer" />
                    </div>
                    {/* Sparkles */}
                    {showSparkle && (
                      <>
                        <SparkleIcon className="absolute -top-1 left-4 text-yellow-400 animate-pulse" size={10} />
                        <SparkleIcon className="absolute -top-1 right-8 text-amber-300 animate-pulse" size={8} />
                        <SparkleIcon className="absolute -bottom-1 left-12 text-yellow-300 animate-pulse" size={10} />
                      </>
                    )}
                  </>
                )}

                <div className="flex items-center gap-3 relative z-10">
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(feeder.rank)}
                  </div>

                  {/* Name & Progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`truncate ${style.text}`}>
                          {feeder.name}
                        </span>
                        {feeder.rank === 1 && (
                          <FlameIcon className="text-orange-400 flex-shrink-0" size={12} />
                        )}
                      </div>
                      <span className={`ml-2 font-pixel text-xs ${style.amount}`}>
                        {formatNumber(feeder.amount)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-4 p-3 bg-gradient-to-r from-terminal-green/10 to-terminal-cyan/10 rounded-lg border border-terminal-green/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ClawIcon className="text-terminal-green" size={14} />
          <p className="text-terminal-green text-xs font-medium text-center">
            Feed the specimen to reach TOP 1 and earn REAL tokens!
          </p>
        </div>
        <div className="flex items-start justify-center gap-1.5">
          <AlertIcon className="text-white/40 flex-shrink-0 mt-0.5" size={10} />
          <p className="text-white/40 text-[10px] text-center leading-relaxed">
            Top feeder can claim rewards within 24 hours. Rankings are monitored to prevent abuse.
          </p>
        </div>
      </div>

      {/* Total Stats */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-white/30">
        <div className="flex items-center gap-1">
          <TrophyIcon className="text-white/30" size={10} />
          <span>Total Fed: {formatNumber(stats.totalFed)} $CLAW</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
          <span>Updated live</span>
        </div>
      </div>

      {/* Shimmer animation style */}
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