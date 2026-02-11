'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BranchingChapter, StoryNode, BranchingChoice } from './types';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5, CHAPTER_6, CHAPTER_7, CHAPTER_8 } from './chapters';

// All chapters (branching system) - Same as GameEngine
const CHAPTERS: Record<number, BranchingChapter> = {
  1: CHAPTER_1,
  2: CHAPTER_2,
  3: CHAPTER_3,
  4: CHAPTER_4,
  5: CHAPTER_5,
  6: CHAPTER_6,
  7: CHAPTER_7,
  8: CHAPTER_8,
};

const TOTAL_CHAPTERS = 8;

// Types for global voting
interface VoteData {
  visitorId: string;
  visitorName: string;
  choiceId: string;
  timestamp: number;
}

interface GlobalVoteState {
  chapter: number;
  nodeId: string;
  votes: Record<string, VoteData[]>;
  totalVoters: number;
  votingEndsAt: number;
  decided: boolean;
  winningChoice: string | null;
  completedChapters: number;
  deaths: number;
}

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

// Timer Component
const VotingTimer: React.FC<{
  endsAt: number;
  onEnd: () => void;
  onLock: () => void;
}> = ({ endsAt, onEnd, onLock }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const endedRef = useRef(false);
  const lockedRef = useRef(false);

  useEffect(() => {
    endedRef.current = false;
    lockedRef.current = false;
    
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      // Lock votes at 10 seconds
      if (remaining <= 10 && !lockedRef.current) {
        lockedRef.current = true;
        onLock();
      }
      
      if (remaining <= 0 && !endedRef.current) {
        endedRef.current = true;
        onEnd();
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt, onEnd, onLock]);

  const isUrgent = timeLeft < 60;
  const isCritical = timeLeft < 30;
  const isLocked = timeLeft <= 10;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-1 px-5 py-2.5 rounded-xl border transition-all ${
      isLocked
        ? 'bg-red-900/50 border-red-500 shadow-lg shadow-red-500/50'
        : isCritical 
        ? 'bg-red-500/30 border-red-500 animate-pulse shadow-lg shadow-red-500/30' 
        : isUrgent
        ? 'bg-red-500/20 border-red-500/70'
        : 'bg-black/70 border-red-500/30'
    }`}>
      <span className={`text-[10px] font-pixel tracking-wider ${
        isLocked ? 'text-red-500' : isCritical ? 'text-red-400' : 'text-white/40'
      }`}>
        {isLocked ? '🔒 VOTES LOCKED' : 'VOTING ENDS IN'}
      </span>
      
      <div className="flex items-center justify-center gap-2">
        <svg 
          className={`w-4 h-4 ${
            isLocked ? 'text-red-500' : isCritical ? 'text-red-500 animate-pulse' : 'text-red-400/70'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>

        <span className={`font-mono text-xl font-bold tracking-wider tabular-nums ${
          isLocked ? 'text-red-500' : isCritical ? 'text-red-500' : isUrgent ? 'text-red-400' : 'text-white/80'
        }`}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      {isLocked && timeLeft > 0 && (
        <span className="text-red-500 text-[9px] font-pixel">
          DECIDING...
        </span>
      )}
      {!isLocked && isCritical && timeLeft > 0 && (
        <span className="text-red-500 text-[9px] font-pixel">
          VOTE NOW!
        </span>
      )}
    </div>
  );
};

// Vote Bar Component
const VoteBar: React.FC<{
  choiceId: string;
  choiceText: string;
  votes: number;
  totalVotes: number;
  isSelected: boolean;
  isWinner: boolean;
  isDecided: boolean;
  isLocked: boolean;
  onVote: () => void;
  disabled: boolean;
  voters: string[];
}> = ({ choiceId, choiceText, votes, totalVotes, isSelected, isWinner, isDecided, isLocked, onVote, disabled, voters }) => {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  
  let barColor = 'bg-white/20';
  let borderColor = 'border-white/20';
  let textColor = 'text-white/80';
  
  if (isDecided) {
    if (isWinner) {
      barColor = 'bg-green-500';
      borderColor = 'border-green-500';
      textColor = 'text-green-400';
    } else {
      barColor = 'bg-red-500/50';
      borderColor = 'border-red-500/30';
      textColor = 'text-white/40';
    }
  } else if (isLocked) {
    if (isSelected) {
      barColor = 'bg-amber-500';
      borderColor = 'border-amber-500';
      textColor = 'text-amber-400';
    } else {
      barColor = 'bg-white/10';
      borderColor = 'border-white/10';
      textColor = 'text-white/50';
    }
  } else if (isSelected) {
    barColor = 'bg-amber-500';
    borderColor = 'border-amber-500';
    textColor = 'text-amber-400';
  }

  const canClick = !disabled && !isDecided && !isLocked;

  return (
    <button
      onClick={onVote}
      disabled={!canClick}
      className={`w-full p-4 text-left rounded-xl border transition-all relative overflow-hidden ${borderColor} ${
        canClick ? 'hover:border-amber-500/50 cursor-pointer' : 'cursor-default'
      } ${isDecided || isLocked ? 'bg-black/40' : 'bg-black/60'}`}
    >
      {/* Vote percentage bar background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out ${barColor} opacity-30`}
        style={{ width: `${percentage}%` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className={`w-8 h-8 rounded-full border-2 ${borderColor} flex items-center justify-center text-sm font-bold shrink-0 ${textColor}`}>
              {choiceId.toUpperCase()}
            </span>
            <span className={`flex-1 ${textColor}`}>{choiceText}</span>
          </div>
          
          {/* Vote count and percentage */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-lg font-bold ${textColor}`}>
                {percentage}%
              </div>
              <div className="text-white/40 text-xs">
                {votes} vote{votes !== 1 ? 's' : ''}
              </div>
            </div>
            
            {isSelected && !isDecided && (
              <span className={`px-2 py-1 rounded text-xs font-pixel ${
                isLocked 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
              }`}>
                {isLocked ? '🔒 LOCKED' : 'YOUR VOTE'}
              </span>
            )}
            
            {isWinner && isDecided && (
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-xs font-pixel animate-pulse">
                ✓ WINNER
              </span>
            )}
          </div>
        </div>
        
        {/* All voters - visible to everyone */}
        {voters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-white/40 text-[10px] mr-1">Voters:</span>
              {voters.map((name, i) => (
                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/60'
                }`}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

// Get stage image - Same as GameEngine
const getStageImage = (chapter: number, nodeId: string, stage: number): string => {
  const nodeIdLower = nodeId.toLowerCase();
  
  // Chapter 1 image mapping
  if (chapter === 1) {
    if (nodeIdLower.startsWith('1-s1')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      return '/C1/C1S1.jpg';
    }
    if (nodeIdLower.startsWith('1-s2')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('vent')) return '/C1/C1S2%20VENT.jpg';
      if (nodeIdLower.includes('cot')) return '/C1/C1S2-Cot.jpg';
      if (nodeIdLower.includes('door')) return '/C1/C1S2-door.jpg';
      return '/C1/C1S2.jpg';
    }
    if (nodeIdLower.startsWith('1-s3')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('earring')) return '/C1/C1S3-earrings.jpg';
      return '/C1/C1S3.jpg';
    }
    if (nodeIdLower.startsWith('1-s4')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('pretend')) return '/C1/C1S4-pretend.jpg';
      return '/C1/C1S4.jpg';
    }
    if (nodeIdLower.startsWith('1-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('door')) return '/C1/C1S5-door.jpg';
      if (nodeIdLower.includes('guest') || nodeIdLower.includes('quarters')) return '/C1/C1S5-guest%20quarters.jpg';
      if (nodeIdLower.includes('prisoner')) return '/C1/C1S5-prisoners.jpg';
      if (nodeIdLower.includes('runner') || nodeIdLower.includes('run')) return '/C1/C1S5-runner.jpg';
      return '/C1/C1S5.jpg';
    }
    return '/C1/C1S1.jpg';
  }
  
  // Chapter 2 image mapping
  if (chapter === 2) {
    if (nodeIdLower.startsWith('2-s1')) {
      if (nodeIdLower.includes('death')) return '/C2/C2S1-death.jpg';
      if (nodeIdLower.includes('marina')) return '/C2/C2S1-MARINA.jpg';
      return '/C2/C2S1.jpg';
    }
    if (nodeIdLower.startsWith('2-s2')) {
      if (nodeIdLower.includes('death') || nodeIdLower.includes('escape')) return '/C2/C2S2-escape%20death.jpg';
      return '/C2/C2S1.jpg';
    }
    if (nodeIdLower.startsWith('2-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('death')) return '/C2/C2S5-DEATH.jpg';
      if (nodeIdLower.includes('freedom') || nodeIdLower.includes('escape')) return '/C2/C2S5-FREEDOM.jpg';
      if (nodeIdLower.includes('file')) return '/C2/C2S5-FILES.jpg';
      if (nodeIdLower.includes('girl') || nodeIdLower.includes('2girl')) return '/C2/C2S5-2GIRLS.jpg';
      return '/C2/C2S5-FREEDOM.jpg';
    }
    return '/C2/C2S1.jpg';
  }
  
  // Chapter 3 image mapping
  if (chapter === 3) {
    if (nodeIdLower.startsWith('3-s1')) return '/C3/C3S1.png';
    if (nodeIdLower.startsWith('3-s2')) return '/C3/C3S2-WATER.png';
    if (nodeIdLower.startsWith('3-s3')) return '/C3/C3S3-boat.png';
    if (nodeIdLower.startsWith('3-s4')) {
      if (nodeIdLower.includes('saved') || nodeIdLower.includes('sved')) return '/C3/c3s4-sved.png';
      if (nodeIdLower.includes('police2') || nodeIdLower.includes('station')) return '/C3/C3S4-police2.png';
      return '/C3/C3S4-police.png';
    }
    if (nodeIdLower.startsWith('3-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('hospital') || nodeIdLower.includes('medical')) return '/C3/C3S5-hospital.png';
      if (nodeIdLower.includes('investigate') || nodeIdLower.includes('fbi')) return '/C3/C3S5-investigate.png';
      if (nodeIdLower.includes('presence') || nodeIdLower.includes('media')) return '/C3/C3S5-presence.png';
      return '/C3/C3S5-investigate.png';
    }
    return '/C3/C3S1.png';
  }
  
  // Chapter 4 image mapping
  if (chapter === 4) return '/C4/C5S1.png';
  
  // For other chapters (5-8), use generic stage image pattern
  return `/C${chapter}/C${chapter}S${stage}.jpg`;
};

// Main Global Game Engine Component
interface GlobalGameEngineProps {
  visitorId: string;
  visitorName: string;
  onChapterComplete?: (completedChapter: number) => void;
  soundEnabled?: boolean;
}

export const GlobalGameEngine: React.FC<GlobalGameEngineProps> = ({
  visitorId,
  visitorName,
  onChapterComplete,
  soundEnabled = true,
}) => {
  // Global game state (synced across all players)
  const [globalState, setGlobalState] = useState<GlobalVoteState | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isVotingLocked, setIsVotingLocked] = useState(false);
  
  // Text display state
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  
  const playTypeSound = useTypingSound(soundEnabled);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastNodeIdRef = useRef<string | null>(null);
  const advancingRef = useRef(false);

  // Fetch global game state from API
  const fetchGlobalState = useCallback(async () => {
    try {
      const res = await fetch(`/api/global-game?visitorId=${visitorId}`);
      const data = await res.json();
      
      if (data.success) {
        setGlobalState(data.state);
        setOnlineCount(data.onlineCount || 1);
        
        // Reset states if we're on a new node
        if (lastNodeIdRef.current !== data.state.nodeId) {
          setMyVote(null);
          setIsVotingLocked(false);
          advancingRef.current = false;
        }
        
        // Check if I already voted for this node
        if (data.state.votes) {
          const allVotes = Object.values(data.state.votes).flat() as VoteData[];
          const myExistingVote = allVotes.find(v => v.visitorId === visitorId);
          if (myExistingVote) {
            setMyVote(myExistingVote.choiceId);
          }
        }
        
        lastNodeIdRef.current = data.state.nodeId;
        
        // Update current node from chapter data
        const chapter = CHAPTERS[data.state.chapter];
        if (chapter) {
          const node = chapter.nodes[data.state.nodeId];
          if (node) {
            setCurrentNode(node);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch global state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [visitorId]);

  // Poll for updates
  useEffect(() => {
    fetchGlobalState();
    pollIntervalRef.current = setInterval(fetchGlobalState, 2000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchGlobalState]);

  // Typewriter effect - reset when node changes
  useEffect(() => {
    if (!currentNode) return;
    
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);

    let index = 0;
    const text = currentNode.text;
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
        if (currentNode.type === 'choice' && currentNode.choices) {
          setTimeout(() => setShowChoices(true), 500);
        }
        
        // Auto-advance for narrative nodes
        if (currentNode.type === 'narrative' && currentNode.nextNode) {
          setTimeout(() => {
            advanceToNode(currentNode.nextNode!, globalState?.chapter || 1);
          }, 3000);
        }
        
        // Handle death - restart chapter
        if (currentNode.type === 'death') {
          setTimeout(() => {
            const chapter = CHAPTERS[globalState?.chapter || 1];
            advanceToNode(chapter.startNode, globalState?.chapter || 1, true);
          }, 4000);
        }
        
        // Handle chapter complete
        if (currentNode.type === 'chapter-end' && currentNode.chapterComplete) {
          const nextChapter = currentNode.chapterComplete.nextChapter;
          setTimeout(() => {
            if (nextChapter <= TOTAL_CHAPTERS) {
              const nextChapterData = CHAPTERS[nextChapter];
              advanceToNode(nextChapterData.startNode, nextChapter, false, true);
              if (onChapterComplete) {
                onChapterComplete(globalState?.chapter || 1);
              }
            }
          }, 4000);
        }
      }
    };
    
    typeNextChar();

    return () => {
      index = text.length;
    };
  }, [currentNode?.id, soundEnabled, playTypeSound]);

  // Advance to next node
  const advanceToNode = async (nextNodeId: string, chapter: number, isDeath: boolean = false, isChapterComplete: boolean = false) => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    
    try {
      const res = await fetch('/api/global-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance',
          chapter,
          nodeId: nextNodeId,
          isDeath,
          isChapterComplete,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setMyVote(null);
        fetchGlobalState();
      }
    } catch (err) {
      console.error('Failed to advance game:', err);
    } finally {
      setIsAdvancing(false);
    }
  };

  // Submit vote (or change vote if not locked)
  const handleVote = async (choiceId: string) => {
    if (!globalState || isVotingLocked) return;
    
    // If clicking same choice, do nothing
    if (myVote === choiceId) return;
    
    try {
      const res = await fetch('/api/global-game/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          visitorName,
          choiceId,
          chapter: globalState.chapter,
          nodeId: globalState.nodeId,
          previousVote: myVote, // Send previous vote for changing
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setMyVote(choiceId);
        fetchGlobalState();
      }
    } catch (err) {
      console.error('Failed to submit vote:', err);
    }
  };

  // Handle voting lock (at 10 seconds)
  const handleVotingLock = useCallback(() => {
    setIsVotingLocked(true);
  }, []);

  // Handle voting end - determine winner and advance
  const handleVotingEnd = useCallback(async () => {
    if (!globalState || !currentNode || advancingRef.current) return;
    
    advancingRef.current = true;
    setIsAdvancing(true);
    
    // Calculate winner from current state
    let maxVotes = 0;
    let winningChoiceId: string | null = null;
    
    Object.entries(globalState.votes).forEach(([choiceId, votes]) => {
      if (votes.length > maxVotes) {
        maxVotes = votes.length;
        winningChoiceId = choiceId;
      }
    });
    
    // If no votes, pick first choice
    if (!winningChoiceId && currentNode.choices && currentNode.choices.length > 0) {
      winningChoiceId = currentNode.choices[0].id;
    }
    
    console.log('Voting ended. Winner:', winningChoiceId);
    
    // Find the winning choice and advance
    if (winningChoiceId && currentNode.choices) {
      const winningChoice = currentNode.choices.find(c => c.id === winningChoiceId);
      if (winningChoice) {
        console.log('Advancing to:', winningChoice.nextNode);
        
        // Wait a moment to show the result, then advance
        setTimeout(async () => {
          try {
            const res = await fetch('/api/global-game', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'advance',
                chapter: globalState.chapter,
                nodeId: winningChoice.nextNode,
              }),
            });
            
            const data = await res.json();
            console.log('Advance result:', data);
            
            if (data.success) {
              setMyVote(null);
              setIsVotingLocked(false);
              advancingRef.current = false;
              setIsAdvancing(false);
              fetchGlobalState();
            }
          } catch (err) {
            console.error('Failed to advance:', err);
            advancingRef.current = false;
            setIsAdvancing(false);
          }
        }, 2000);
      }
    }
  }, [globalState, currentNode, fetchGlobalState]);

  // Get current stage from node ID
  const getCurrentStage = (): number => {
    if (!globalState) return 1;
    const nodeId = globalState.nodeId;
    const match = nodeId.match(/-s(\d)/);
    if (match) return parseInt(match[1]);
    if (nodeId.includes('complete') || nodeId.includes('soon')) return 5;
    return 1;
  };

  // Emit game state updates for parent components
  useEffect(() => {
    if (!globalState) return;
    
    const currentStage = getCurrentStage();
    window.dispatchEvent(new CustomEvent('gameStateUpdate', { 
      detail: { 
        completedChapters: globalState.completedChapters || 0,
        currentChapter: globalState.chapter,
        currentStage: currentStage,
        currentNodeId: globalState.nodeId,
      }
    }));
  }, [globalState?.completedChapters, globalState?.chapter, globalState?.nodeId]);

  if (isLoading || !globalState || !currentNode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-400 font-pixel animate-pulse mb-2">SYNCING GLOBAL STATE...</div>
          <div className="text-white/40 text-xs">Connecting to other survivors</div>
        </div>
      </div>
    );
  }

  const chapter = CHAPTERS[globalState.chapter];
  const currentStage = getCurrentStage();
  const stageImage = getStageImage(globalState.chapter, globalState.nodeId, currentStage);
  
  // Calculate vote statistics
  const totalVotes = Object.values(globalState.votes).flat().length;

  return (
    <div className="space-y-4">
      {/* Global Status Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 via-red-500/20 to-amber-500/20 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-400 font-pixel text-sm">LIVE</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white/60 text-sm">
              <span className="text-amber-400 font-bold">{onlineCount}</span> survivor{onlineCount !== 1 ? 's' : ''} online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">🌍 GLOBAL GAME</span>
            <span className="text-purple-400 text-xs font-pixel">VOTE TOGETHER</span>
          </div>
        </div>
      </div>

      {/* Chapter & Stage header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-red-400 font-pixel text-lg">{chapter.title}</h2>
          <p className="text-white/40 text-sm">{chapter.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs font-pixel">
            CHAPTER {globalState.chapter}/{TOTAL_CHAPTERS}
          </p>
          <p className="text-white/30 text-xs">Deaths: {globalState.deaths || 0}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/40 text-xs">Progress</span>
          <span className="text-amber-400 text-xs font-pixel">STAGE {currentStage}/5</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full border border-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(currentStage / 5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map(stage => (
            <div 
              key={stage}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                stage < currentStage 
                  ? 'bg-green-500 border-green-400 text-white' 
                  : stage === currentStage 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse' 
                  : 'bg-black/30 border-white/20 text-white/30'
              }`}
            >
              {stage < currentStage ? '✓' : stage}
            </div>
          ))}
        </div>
      </div>

      {/* Timer - Only for choice nodes */}
      {currentNode.type === 'choice' && !globalState.decided && (
        <div className="flex justify-center mb-4">
          <VotingTimer 
            endsAt={globalState.votingEndsAt} 
            onEnd={handleVotingEnd}
            onLock={handleVotingLock}
          />
        </div>
      )}

      {/* Stage Image with Story */}
      <div className="relative w-full max-w-3xl mx-auto">
        <img 
          src={stageImage}
          alt="Stage"
          className="w-full h-auto rounded-lg"
        />
        
        {/* Story text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="relative z-10 p-4 md:p-6">
            <p className={`text-sm md:text-base leading-relaxed font-mono ${
              currentNode.type === 'death' ? 'text-red-300' : 
              currentNode.type === 'chapter-end' ? 'text-green-300' :
              'text-white'
            }`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,1)' }}>
              {displayedText}
              {isTyping && <span className="text-red-500 animate-pulse ml-0.5">▊</span>}
            </p>

            {currentNode.type === 'death' && currentNode.deathMessage && !isTyping && (
              <div className="mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg animate-fadeIn">
                <p className="text-red-400 text-lg font-pixel">💀 EVERYONE DIED</p>
                <p className="text-red-300 text-sm mt-1">{currentNode.deathMessage}</p>
                <p className="text-red-400/60 text-xs mt-2">Restarting chapter...</p>
              </div>
            )}

            {currentNode.type === 'chapter-end' && currentNode.chapterComplete && !isTyping && (
              <div className="mt-3 p-3 bg-green-900/50 border border-green-500 rounded-lg animate-fadeIn">
                <p className="text-green-400 text-lg font-pixel">🏆 CHAPTER {currentNode.chapterComplete.chapter} COMPLETE</p>
                <p className="text-green-300/60 text-xs mt-1">Moving to next chapter...</p>
              </div>
            )}

            {currentNode.type === 'narrative' && !isTyping && (
              <p className="text-white/60 text-xs font-pixel animate-pulse mt-2">
                Continuing...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Voting Choices - Only for choice nodes */}
      {showChoices && currentNode.type === 'choice' && currentNode.choices && (
        <div className="max-w-2xl mx-auto space-y-3 animate-fadeIn">
          {/* Question */}
          {currentNode.question && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-amber-400 text-sm font-medium text-center">{currentNode.question}</p>
            </div>
          )}

          {/* Vote status */}
          <div className="text-center py-2">
            <span className="text-white/60 text-sm">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
              {myVote && <span className="text-amber-400 ml-2">• You voted!</span>}
            </span>
          </div>

          {/* Choice buttons with vote bars */}
          <div className="grid gap-3">
            {currentNode.choices.map((choice) => {
              const choiceVotes = globalState.votes[choice.id] || [];
              const voters = choiceVotes.map(v => v.visitorName);
              
              return (
                <VoteBar
                  key={choice.id}
                  choiceId={choice.id}
                  choiceText={choice.text}
                  votes={choiceVotes.length}
                  totalVotes={totalVotes}
                  isSelected={myVote === choice.id}
                  isWinner={globalState.winningChoice === choice.id}
                  isDecided={globalState.decided}
                  isLocked={isVotingLocked}
                  onVote={() => handleVote(choice.id)}
                  disabled={false}
                  voters={voters}
                />
              );
            })}
          </div>

          {/* Voting instructions */}
          {!isVotingLocked && !globalState.decided && (
            <div className="text-center p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm">
                👆 Click to vote! You can change your vote until 10 seconds remain.
              </p>
            </div>
          )}

          {/* Locked notification */}
          {isVotingLocked && !globalState.decided && (
            <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-pixel">
                🔒 VOTES LOCKED - Counting votes...
              </p>
            </div>
          )}

          {/* Decision announcement */}
          {globalState.decided && globalState.winningChoice && (
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fadeIn">
              <p className="text-green-400 text-lg font-pixel mb-2">
                ✓ DECISION MADE
              </p>
              <p className="text-white/60 text-sm">
                The community has chosen. Advancing...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completed chapters indicator */}
      {(globalState.completedChapters || 0) > 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-xs font-pixel">
            🏆 CHAPTERS COMPLETED: {globalState.completedChapters}/{TOTAL_CHAPTERS}
          </p>
          <p className="text-green-400/60 text-xs mt-1">
            Complete all 8 chapters to unlock the Vault!
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

export default GlobalGameEngine;