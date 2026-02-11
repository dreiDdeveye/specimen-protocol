'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BranchingChapter, StoryNode, BranchingChoice } from './types';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5, CHAPTER_6, CHAPTER_7, CHAPTER_8 } from './chapters';

// All chapters
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

// Types
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
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playClick = useCallback(() => {
    if (!enabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const time = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      osc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.03);
    } catch (e) {}
  }, [enabled]);

  return playClick;
};

// Get stage image
const getStageImage = (chapter: number, nodeId: string, stage: number): string => {
  const nodeIdLower = nodeId.toLowerCase();
  
  if (chapter === 1) {
    if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
    if (nodeIdLower.startsWith('1-s1')) return '/C1/C1S1.jpg';
    if (nodeIdLower.startsWith('1-s2')) {
      if (nodeIdLower.includes('vent')) return '/C1/C1S2%20VENT.jpg';
      if (nodeIdLower.includes('cot')) return '/C1/C1S2-Cot.jpg';
      if (nodeIdLower.includes('door')) return '/C1/C1S2-door.jpg';
      return '/C1/C1S2.jpg';
    }
    if (nodeIdLower.startsWith('1-s3')) {
      if (nodeIdLower.includes('earring')) return '/C1/C1S3-earrings.jpg';
      return '/C1/C1S3.jpg';
    }
    if (nodeIdLower.startsWith('1-s4')) {
      if (nodeIdLower.includes('pretend')) return '/C1/C1S4-pretend.jpg';
      return '/C1/C1S4.jpg';
    }
    if (nodeIdLower.startsWith('1-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('door')) return '/C1/C1S5-door.jpg';
      if (nodeIdLower.includes('guest')) return '/C1/C1S5-guest%20quarters.jpg';
      if (nodeIdLower.includes('prisoner')) return '/C1/C1S5-prisoners.jpg';
      if (nodeIdLower.includes('runner')) return '/C1/C1S5-runner.jpg';
      return '/C1/C1S5.jpg';
    }
    return '/C1/C1S1.jpg';
  }
  
  if (chapter === 2) {
    if (nodeIdLower.includes('death')) return '/C2/C2S1-death.jpg';
    if (nodeIdLower.startsWith('2-s1')) {
      if (nodeIdLower.includes('marina')) return '/C2/C2S1-MARINA.jpg';
      return '/C2/C2S1.jpg';
    }
    if (nodeIdLower.startsWith('2-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('freedom')) return '/C2/C2S5-FREEDOM.jpg';
      if (nodeIdLower.includes('file')) return '/C2/C2S5-FILES.jpg';
      return '/C2/C2S5-FREEDOM.jpg';
    }
    return '/C2/C2S1.jpg';
  }
  
  if (chapter === 3) {
    if (nodeIdLower.startsWith('3-s1')) return '/C3/C3S1.png';
    if (nodeIdLower.startsWith('3-s2')) return '/C3/C3S2-WATER.png';
    if (nodeIdLower.startsWith('3-s3')) return '/C3/C3S3-boat.png';
    if (nodeIdLower.startsWith('3-s4')) return '/C3/C3S4-police.png';
    if (nodeIdLower.startsWith('3-s5') || nodeIdLower.includes('complete')) return '/C3/C3S5-investigate.png';
    return '/C3/C3S1.png';
  }
  
  if (chapter === 4) return '/C4/C5S1.png';
  
  return `/C${chapter}/C${chapter}S${stage}.jpg`;
};

// Props
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
  // State
  const [globalState, setGlobalState] = useState<GlobalVoteState | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isVotingLocked, setIsVotingLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Text display
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  
  // Refs to prevent double actions
  const lastNodeIdRef = useRef<string>('');
  const isAdvancingRef = useRef(false);
  const hasHandledTimerEndRef = useRef(false);
  
  const playTypeSound = useTypingSound(soundEnabled);

  // Advance to next node - single function for all advances
  const advanceGame = useCallback(async (nextNodeId: string, nextChapter: number, isDeath = false, isChapterComplete = false) => {
    if (isAdvancingRef.current) {
      console.log('Already advancing, skipping...');
      return;
    }
    
    isAdvancingRef.current = true;
    console.log(`Advancing to: Chapter ${nextChapter}, Node ${nextNodeId}`);
    
    try {
      const res = await fetch('/api/global-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance',
          chapter: nextChapter,
          nodeId: nextNodeId,
          isDeath,
          isChapterComplete,
        }),
      });
      
      const data = await res.json();
      console.log('Advance response:', data);
      
      if (data.success) {
        // Reset local state
        setMyVote(null);
        setIsVotingLocked(false);
        hasHandledTimerEndRef.current = false;
        lastNodeIdRef.current = nextNodeId;
      }
    } catch (err) {
      console.error('Failed to advance:', err);
    } finally {
      // Small delay before allowing next advance
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  }, []);

  // Fetch global state
  const fetchGlobalState = useCallback(async () => {
    try {
      const res = await fetch(`/api/global-game?visitorId=${visitorId}`);
      const data = await res.json();
      
      if (data.success && data.state) {
        const state = data.state;
        setGlobalState(state);
        setOnlineCount(data.onlineCount || 1);
        
        // Check if node changed
        if (lastNodeIdRef.current !== state.nodeId) {
          console.log(`Node changed: ${lastNodeIdRef.current} -> ${state.nodeId}`);
          lastNodeIdRef.current = state.nodeId;
          setMyVote(null);
          setIsVotingLocked(false);
          hasHandledTimerEndRef.current = false;
          setShowChoices(false);
          setIsTyping(true);
          setDisplayedText('');
        }
        
        // Find my vote
        if (state.votes) {
          let foundVote: string | null = null;
          Object.entries(state.votes).forEach(([choiceId, votes]) => {
            const myV = (votes as VoteData[]).find(v => v.visitorId === visitorId);
            if (myV) foundVote = choiceId;
          });
          setMyVote(foundVote);
        }
        
        // Update current node
        const chapter = CHAPTERS[state.chapter];
        if (chapter && chapter.nodes[state.nodeId]) {
          setCurrentNode(chapter.nodes[state.nodeId]);
        }
        
        // Calculate time left
        const remaining = Math.max(0, Math.floor((state.votingEndsAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        // Lock at 10 seconds
        if (remaining <= 10 && remaining > 0) {
          setIsVotingLocked(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [visitorId]);

  // Poll for updates
  useEffect(() => {
    fetchGlobalState();
    const interval = setInterval(fetchGlobalState, 1500);
    return () => clearInterval(interval);
  }, [fetchGlobalState]);

  // Handle timer end - called when timeLeft reaches 0
  useEffect(() => {
    if (!globalState || !currentNode || currentNode.type !== 'choice') return;
    if (hasHandledTimerEndRef.current) return;
    
    // Check if timer has actually ended
    const now = Date.now();
    const remaining = globalState.votingEndsAt - now;
    
    if (remaining <= 0) {
      hasHandledTimerEndRef.current = true;
      console.log('Timer ended! Processing vote result...');
      
      // Calculate winner
      let maxVotes = 0;
      let winningChoiceId: string | null = null;
      
      Object.entries(globalState.votes).forEach(([choiceId, votes]) => {
        if (votes.length > maxVotes) {
          maxVotes = votes.length;
          winningChoiceId = choiceId;
        }
      });
      
      // Default to first choice if no votes
      if (!winningChoiceId && currentNode.choices && currentNode.choices.length > 0) {
        winningChoiceId = currentNode.choices[0].id;
        console.log('No votes, defaulting to first choice:', winningChoiceId);
      }
      
      console.log('Winning choice:', winningChoiceId, 'with', maxVotes, 'votes');
      
      // Find winning choice and advance after delay
      if (winningChoiceId && currentNode.choices) {
        const winningChoice = currentNode.choices.find(c => c.id === winningChoiceId);
        if (winningChoice) {
          console.log('Will advance to:', winningChoice.nextNode);
          setTimeout(() => {
            advanceGame(winningChoice.nextNode, globalState.chapter);
          }, 2500);
        } else {
          console.error('Could not find winning choice in choices array');
        }
      }
    }
  }, [globalState?.votingEndsAt, globalState?.votes, currentNode, advanceGame]);

  // Also handle if server already decided (e.g., player joins late)
  useEffect(() => {
    if (!globalState || !currentNode || currentNode.type !== 'choice') return;
    if (hasHandledTimerEndRef.current) return;
    
    if (globalState.decided && globalState.winningChoice) {
      hasHandledTimerEndRef.current = true;
      console.log('Server already decided, winner:', globalState.winningChoice);
      
      const winningChoice = currentNode.choices?.find(c => c.id === globalState.winningChoice);
      if (winningChoice) {
        setTimeout(() => {
          advanceGame(winningChoice.nextNode, globalState.chapter);
        }, 2500);
      }
    }
  }, [globalState?.decided, globalState?.winningChoice, currentNode, advanceGame]);

  // Typewriter effect
  useEffect(() => {
    if (!currentNode || lastNodeIdRef.current !== globalState?.nodeId) return;
    
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);

    let index = 0;
    const text = currentNode.text;
    
    const typeNext = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        if (text[index] !== ' ' && soundEnabled) playTypeSound();
        index++;
        setTimeout(typeNext, 35);
      } else {
        setIsTyping(false);
        
        // Show choices for choice nodes
        if (currentNode.type === 'choice') {
          setTimeout(() => setShowChoices(true), 500);
        }
        
        // Auto-advance for narrative nodes
        if (currentNode.type === 'narrative' && currentNode.nextNode && globalState) {
          setTimeout(() => {
            advanceGame(currentNode.nextNode!, globalState.chapter);
          }, 2500);
        }
        
        // Handle death
        if (currentNode.type === 'death' && globalState) {
          setTimeout(() => {
            const chapter = CHAPTERS[globalState.chapter];
            advanceGame(chapter.startNode, globalState.chapter, true);
          }, 4000);
        }
        
        // Handle chapter complete
        if (currentNode.type === 'chapter-end' && currentNode.chapterComplete && globalState) {
          const nextChapter = currentNode.chapterComplete.nextChapter;
          setTimeout(() => {
            if (nextChapter <= TOTAL_CHAPTERS) {
              const nextChapterData = CHAPTERS[nextChapter];
              advanceGame(nextChapterData.startNode, nextChapter, false, true);
              if (onChapterComplete) onChapterComplete(globalState.chapter);
            }
          }, 4000);
        }
      }
    };
    
    typeNext();
  }, [currentNode?.id, globalState?.nodeId, soundEnabled, playTypeSound, advanceGame, onChapterComplete]);

  // Submit vote
  const handleVote = async (choiceId: string) => {
    if (!globalState || isVotingLocked || myVote === choiceId) return;
    
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
          previousVote: myVote,
        }),
      });
      
      if ((await res.json()).success) {
        setMyVote(choiceId);
        fetchGlobalState();
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // Get current stage
  const getCurrentStage = (): number => {
    if (!globalState) return 1;
    const match = globalState.nodeId.match(/-s(\d)/);
    if (match) return parseInt(match[1]);
    if (globalState.nodeId.includes('complete')) return 5;
    return 1;
  };

  // Emit game state updates
  useEffect(() => {
    if (!globalState) return;
    window.dispatchEvent(new CustomEvent('gameStateUpdate', { 
      detail: { 
        completedChapters: globalState.completedChapters || 0,
        currentChapter: globalState.chapter,
        currentStage: getCurrentStage(),
        currentNodeId: globalState.nodeId,
      }
    }));
  }, [globalState?.completedChapters, globalState?.chapter, globalState?.nodeId]);

  // Loading
  if (isLoading || !globalState || !currentNode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-pixel animate-pulse">CONNECTING...</div>
      </div>
    );
  }

  const chapter = CHAPTERS[globalState.chapter];
  const currentStage = getCurrentStage();
  const stageImage = getStageImage(globalState.chapter, globalState.nodeId, currentStage);
  const totalVotes = Object.values(globalState.votes).flat().length;
  
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="space-y-4">
      {/* Global Status Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 via-red-500/20 to-amber-500/20 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 font-pixel text-sm">LIVE</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60 text-sm">
              <span className="text-amber-400 font-bold">{onlineCount}</span> online
            </span>
          </div>
          <span className="text-purple-400 text-xs font-pixel">🌍 GLOBAL VOTING</span>
        </div>
      </div>

      {/* Chapter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-red-400 font-pixel text-lg">{chapter.title}</h2>
          <p className="text-white/40 text-sm">{chapter.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs font-pixel">CH {globalState.chapter}/{TOTAL_CHAPTERS}</p>
          <p className="text-white/30 text-xs">Deaths: {globalState.deaths || 0}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`flex-1 h-2 rounded ${s <= currentStage ? 'bg-amber-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {/* Timer for choice nodes */}
      {currentNode.type === 'choice' && showChoices && (
        <div className={`text-center p-3 rounded-xl border ${
          timeLeft <= 10 
            ? 'bg-red-900/50 border-red-500' 
            : timeLeft <= 30 
            ? 'bg-red-500/20 border-red-500/50' 
            : 'bg-black/50 border-white/20'
        }`}>
          <div className="text-white/40 text-xs mb-1">
            {timeLeft <= 10 ? '🔒 VOTES LOCKED' : 'VOTING ENDS IN'}
          </div>
          <div className={`font-mono text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          {timeLeft <= 10 && timeLeft > 0 && (
            <div className="text-red-400 text-xs mt-1">DECIDING...</div>
          )}
        </div>
      )}

      {/* Stage Image */}
      <div className="relative w-full max-w-3xl mx-auto">
        <img src={stageImage} alt="Stage" className="w-full h-auto rounded-lg" />
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="relative z-10 p-4 md:p-6">
            <p className={`text-sm md:text-base leading-relaxed font-mono ${
              currentNode.type === 'death' ? 'text-red-300' : 
              currentNode.type === 'chapter-end' ? 'text-green-300' : 'text-white'
            }`}>
              {displayedText}
              {isTyping && <span className="text-red-500 animate-pulse">▊</span>}
            </p>

            {currentNode.type === 'death' && !isTyping && (
              <div className="mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-400 text-lg font-pixel">💀 EVERYONE DIED</p>
                <p className="text-red-400/60 text-xs mt-1">Restarting chapter...</p>
              </div>
            )}

            {currentNode.type === 'chapter-end' && !isTyping && currentNode.chapterComplete && (
              <div className="mt-3 p-3 bg-green-900/50 border border-green-500 rounded-lg">
                <p className="text-green-400 text-lg font-pixel">🏆 CHAPTER {currentNode.chapterComplete.chapter} COMPLETE</p>
              </div>
            )}

            {currentNode.type === 'narrative' && !isTyping && (
              <p className="text-white/40 text-xs mt-2 animate-pulse">Continuing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Voting Choices */}
      {showChoices && currentNode.type === 'choice' && currentNode.choices && (
        <div className="space-y-3">
          {currentNode.question && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-amber-400 text-sm text-center">{currentNode.question}</p>
            </div>
          )}

          <div className="text-center text-white/50 text-sm">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
            {myVote && <span className="text-amber-400 ml-2">• You voted</span>}
          </div>

          {currentNode.choices.map((choice) => {
            const votes = globalState.votes[choice.id] || [];
            const percentage = totalVotes > 0 ? Math.round((votes.length / totalVotes) * 100) : 0;
            const isSelected = myVote === choice.id;
            const isWinner = timeLeft === 0 && votes.length === Math.max(...Object.values(globalState.votes).map(v => v.length));
            
            return (
              <button
                key={choice.id}
                onClick={() => handleVote(choice.id)}
                disabled={isVotingLocked}
                className={`w-full p-4 text-left rounded-xl border transition-all relative overflow-hidden ${
                  timeLeft === 0 && isWinner
                    ? 'border-green-500 bg-green-500/10'
                    : isSelected
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-white/20 bg-black/40 hover:border-amber-500/50'
                } ${isVotingLocked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {/* Progress bar */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${
                    timeLeft === 0 && isWinner ? 'bg-green-500' : isSelected ? 'bg-amber-500' : 'bg-white'
                  } opacity-20`}
                  style={{ width: `${percentage}%` }}
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      timeLeft === 0 && isWinner
                        ? 'border-green-500 text-green-400'
                        : isSelected
                        ? 'border-amber-500 text-amber-400'
                        : 'border-white/30 text-white/60'
                    }`}>
                      {choice.id.toUpperCase()}
                    </span>
                    <span className={timeLeft === 0 && isWinner ? 'text-green-400' : isSelected ? 'text-amber-400' : 'text-white/80'}>
                      {choice.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        timeLeft === 0 && isWinner ? 'text-green-400' : isSelected ? 'text-amber-400' : 'text-white/60'
                      }`}>
                        {percentage}%
                      </div>
                      <div className="text-white/40 text-xs">{votes.length} votes</div>
                    </div>
                    
                    {isSelected && (
                      <span className={`px-2 py-1 rounded text-xs font-pixel ${
                        isVotingLocked ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {isVotingLocked ? '🔒' : '✓'}
                      </span>
                    )}
                    
                    {timeLeft === 0 && isWinner && (
                      <span className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-xs font-pixel">
                        WINNER
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Voters */}
                {votes.length > 0 && (
                  <div className="relative z-10 mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                    <span className="text-white/30 text-xs">Voters:</span>
                    {votes.map((v, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 bg-white/10 rounded text-white/60">
                        {v.visitorName}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}

          {!isVotingLocked && (
            <p className="text-center text-amber-400/60 text-xs">
              Click to vote • You can change until 10 seconds remain
            </p>
          )}
        </div>
      )}

      {/* Completed chapters */}
      {globalState.completedChapters > 0 && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-xs font-pixel">
            🏆 CHAPTERS COMPLETED: {globalState.completedChapters}/{TOTAL_CHAPTERS}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalGameEngine;