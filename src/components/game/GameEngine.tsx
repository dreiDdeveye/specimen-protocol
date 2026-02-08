'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BranchingChapter, StoryNode, BranchingChoice, GameState } from './types';
import { StoryNodeDisplay } from './StoryNodeDisplay';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5} from './chapters';

// All chapters (branching system)
const CHAPTERS: Record<number, BranchingChapter> = {
  1: CHAPTER_1,
  2: CHAPTER_2,
  3: CHAPTER_3,
  4: CHAPTER_4,
  5: CHAPTER_5,
};

const TOTAL_CHAPTERS = 6;

// Local storage keys
const SAVE_KEY = 'island-escape-save';

// Get dynamic stage image based on current node
const getStageImage = (chapter: number, nodeId: string, stage: number): string => {
  const nodeIdLower = nodeId.toLowerCase();
  
  // Chapter 1 image mapping based on node IDs
  if (chapter === 1) {
    // Stage 1: Wake up
    if (nodeIdLower.startsWith('1-s1')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      return '/C1/C1S1.jpg';
    }
    
    // Stage 2: Assess the room
    if (nodeIdLower.startsWith('1-s2')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('vent')) return '/C1/C1S2%20VENT.jpg';
      if (nodeIdLower.includes('cot')) return '/C1/C1S2-Cot.jpg';
      if (nodeIdLower.includes('door')) return '/C1/C1S2-door.jpg';
      return '/C1/C1S2.jpg';
    }
    
    // Stage 3: Free yourself
    if (nodeIdLower.startsWith('1-s3')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('earring')) return '/C1/C1S3-earrings.jpg';
      return '/C1/C1S3.jpg';
    }
    
    // Stage 4: The plan
    if (nodeIdLower.startsWith('1-s4')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('pretend')) return '/C1/C1S4-pretend.jpg';
      return '/C1/C1S4.jpg';
    }
    
    // Stage 5: Execute escape (NO TV FRAME images)
    if (nodeIdLower.startsWith('1-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('death')) return '/C1/C1S3-death.jpg';
      if (nodeIdLower.includes('door')) return '/C1/C1S5-door.jpg';
      if (nodeIdLower.includes('guest') || nodeIdLower.includes('quarters')) return '/C1/C1S5-guest%20quarters.jpg';
      if (nodeIdLower.includes('prisoner')) return '/C1/C1S5-prisoners.jpg';
      if (nodeIdLower.includes('runner') || nodeIdLower.includes('run')) return '/C1/C1S5-runner.jpg';
      return '/C1/C1S5.jpg';
    }
    
    // Default for chapter 1
    return '/C1/C1S1.jpg';
  }
  
  // Chapter 2 image mapping
  if (chapter === 2) {
    // Stage 1
    if (nodeIdLower.startsWith('2-s1')) {
      if (nodeIdLower.includes('death')) return '/C2/C2S1-death.jpg';
      if (nodeIdLower.includes('marina')) return '/C2/C2S1-MARINA.jpg';
      return '/C2/C2S1.jpg';
    }
    
    // Stage 2
    if (nodeIdLower.startsWith('2-s2')) {
      if (nodeIdLower.includes('death') || nodeIdLower.includes('escape')) return '/C2/C2S2-escape%20death.jpg';
      return '/C2/C2S1.jpg'; // Fallback
    }
    
    // Stage 5
    if (nodeIdLower.startsWith('2-s5') || nodeIdLower.includes('complete')) {
      if (nodeIdLower.includes('death')) return '/C2/C2S5-DEATH.jpg';
      if (nodeIdLower.includes('freedom') || nodeIdLower.includes('escape')) return '/C2/C2S5-FREEDOM.jpg';
      if (nodeIdLower.includes('file')) return '/C2/C2S5-FILES.jpg';
      if (nodeIdLower.includes('girl') || nodeIdLower.includes('2girl')) return '/C2/C2S5-2GIRLS.jpg';
      return '/C2/C2S5-FREEDOM.jpg';
    }
    
    // Default for chapter 2
    return '/C2/C2S1.jpg';
  }
  
  // For other chapters, use generic stage image pattern
  return `/C${chapter}/C${chapter}S${stage}.jpg`;
};

interface GameEngineProps {
  onChapterComplete?: (completedChapter: number) => void;
  soundEnabled?: boolean;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  onChapterComplete,
  soundEnabled = true,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    currentChapter: 1,
    currentNodeId: CHAPTER_1.startNode,
    path: [CHAPTER_1.startNode],
    unlockedDocuments: [],
    completedChapters: 0,
    startTime: Date.now(),
    deaths: 0,
  });

  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved) as GameState;
        if (savedState.completedChapters === undefined) {
          savedState.completedChapters = 0;
        }
        setGameState(savedState);
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Update current node when game state changes
  useEffect(() => {
    const chapter = CHAPTERS[gameState.currentChapter];
    if (chapter) {
      const node = chapter.nodes[gameState.currentNodeId];
      if (node) {
        setCurrentNode(node);
      }
    }
  }, [gameState.currentChapter, gameState.currentNodeId]);

  // Save game state
  const saveGame = useCallback((state: GameState) => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, []);

  // Handle choice selection
  const handleChoice = useCallback((choice: BranchingChoice) => {
    setGameState(prev => {
      const newState: GameState = {
        ...prev,
        currentNodeId: choice.nextNode,
        path: [...prev.path, choice.nextNode],
      };
      
      saveGame(newState);
      return newState;
    });
  }, [saveGame]);

  // Handle auto-continue for narrative nodes
  const handleContinue = useCallback(() => {
    if (!currentNode || currentNode.type !== 'narrative' || !currentNode.nextNode) return;
    
    setGameState(prev => {
      const newState: GameState = {
        ...prev,
        currentNodeId: currentNode.nextNode!,
        path: [...prev.path, currentNode.nextNode!],
      };
      saveGame(newState);
      return newState;
    });
  }, [currentNode, saveGame]);

  // Handle death - restart chapter
  const handleDeath = useCallback(() => {
    const chapter = CHAPTERS[gameState.currentChapter];
    
    setGameState(prev => {
      const newState: GameState = {
        ...prev,
        currentNodeId: chapter.startNode,
        path: [...prev.path, 'DEATH', chapter.startNode],
        deaths: prev.deaths + 1,
      };
      saveGame(newState);
      return newState;
    });
  }, [gameState.currentChapter, saveGame]);

  // Handle chapter complete
  const handleChapterComplete = useCallback((nextChapter: number) => {
    const justCompletedChapter = gameState.currentChapter;
    
    if (onChapterComplete) {
      onChapterComplete(justCompletedChapter);
    }
    
    const nextChapterData = CHAPTERS[nextChapter];
    
    if (nextChapterData && nextChapter <= TOTAL_CHAPTERS) {
      setGameState(prev => {
        const newState: GameState = {
          ...prev,
          currentChapter: nextChapter,
          currentNodeId: nextChapterData.startNode,
          path: [...prev.path, `CHAPTER_${nextChapter}`, nextChapterData.startNode],
          completedChapters: Math.max(prev.completedChapters || 0, justCompletedChapter),
        };
        saveGame(newState);
        return newState;
      });
    } else {
      setGameState(prev => {
        const newState: GameState = {
          ...prev,
          completedChapters: TOTAL_CHAPTERS,
        };
        saveGame(newState);
        return newState;
      });
      console.log('Game complete!');
    }
  }, [gameState.currentChapter, onChapterComplete, saveGame]);

  // Reset game
  const resetGame = useCallback(() => {
    const chapter = CHAPTERS[1];
    const newState: GameState = {
      currentChapter: 1,
      currentNodeId: chapter.startNode,
      path: [chapter.startNode],
      unlockedDocuments: [],
      completedChapters: 0,
      startTime: Date.now(),
      deaths: 0,
    };
    setGameState(newState);
    saveGame(newState);
  }, [saveGame]);

  // Get current stage from node ID
  const getCurrentStage = (): number => {
    const nodeId = gameState.currentNodeId;
    const match = nodeId.match(/-s(\d)/);
    if (match) return parseInt(match[1]);
    if (nodeId.includes('complete') || nodeId.includes('soon')) return 5;
    return 1;
  };

  // Expose game state for parent components
  useEffect(() => {
    const currentStage = getCurrentStage();
    window.dispatchEvent(new CustomEvent('gameStateUpdate', { 
      detail: { 
        completedChapters: gameState.completedChapters || 0,
        currentChapter: gameState.currentChapter,
        currentStage: currentStage,
        currentNodeId: gameState.currentNodeId,
      }
    }));
  }, [gameState.completedChapters, gameState.currentChapter, gameState.currentNodeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-pixel animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-400 font-pixel">Node not found: {gameState.currentNodeId}</p>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm font-pixel hover:bg-red-500/30"
        >
          Reset Game
        </button>
      </div>
    );
  }

  const chapter = CHAPTERS[gameState.currentChapter];
  const currentStage = getCurrentStage();
  const stageImage = getStageImage(gameState.currentChapter, gameState.currentNodeId, currentStage);

  return (
    <div className="space-y-4">
      {/* Chapter & Stage header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-red-400 font-pixel text-lg">{chapter.title}</h2>
          <p className="text-white/40 text-sm">{chapter.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs font-pixel">
            CHAPTER {gameState.currentChapter}/{TOTAL_CHAPTERS}
          </p>
          <p className="text-white/30 text-xs">Deaths: {gameState.deaths}</p>
        </div>
      </div>

      {/* Progress bar for stages */}
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

      {/* Story node display with TV overlay */}
      <StoryNodeDisplay
        node={currentNode}
        onChoice={handleChoice}
        onContinue={handleContinue}
        onDeath={handleDeath}
        onChapterComplete={handleChapterComplete}
        soundEnabled={soundEnabled}
        stageImage={stageImage}
      />

      {/* Completed chapters indicator */}
      {(gameState.completedChapters || 0) > 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-xs font-pixel">
            🏆 CHAPTERS COMPLETED: {gameState.completedChapters}/{TOTAL_CHAPTERS}
          </p>
          <p className="text-green-400/60 text-xs mt-1">
            Check the Vault to view unlocked documents!
          </p>
        </div>
      )}

      {/* Reset Game Button */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              resetGame();
            }
          }}
          className="w-full px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-pixel hover:bg-red-500/20 transition-colors"
        >
          🔄 RESET GAME (Start Over)
        </button>
      </div>
    </div>
  );
};

export default GameEngine;