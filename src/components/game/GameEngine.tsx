'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BranchingChapter, StoryNode, BranchingChoice, GameState } from './types';
import { StoryNodeDisplay } from './StoryNodeDisplay';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5, CHAPTER_6 } from './chapters';

// All chapters (branching system)
const CHAPTERS: Record<number, BranchingChapter> = {
  1: CHAPTER_1,
  2: CHAPTER_2,
  3: CHAPTER_3,
  4: CHAPTER_4,
  5: CHAPTER_5,
  6: CHAPTER_6,
};

const TOTAL_CHAPTERS = 6;

// Local storage keys
const SAVE_KEY = 'island-escape-save';

interface GameEngineProps {
  onChapterComplete?: (chapter: number, documents: string[]) => void;
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
      
      // Check if the new node has a document
      const chapter = CHAPTERS[prev.currentChapter];
      const nextNode = chapter?.nodes[choice.nextNode];
      if (nextNode?.document) {
        newState.unlockedDocuments = [...prev.unlockedDocuments, nextNode.document.pdfUrl];
      }
      
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
    // Notify parent
    if (onChapterComplete) {
      onChapterComplete(gameState.currentChapter, gameState.unlockedDocuments);
    }
    
    const nextChapterData = CHAPTERS[nextChapter];
    
    if (nextChapterData && nextChapter <= TOTAL_CHAPTERS) {
      setGameState(prev => {
        const newState: GameState = {
          ...prev,
          currentChapter: nextChapter,
          currentNodeId: nextChapterData.startNode,
          path: [...prev.path, `CHAPTER_${nextChapter}`, nextChapterData.startNode],
        };
        saveGame(newState);
        return newState;
      });
    } else {
      // No more chapters - game complete!
      console.log('Game complete!');
    }
  }, [gameState.currentChapter, gameState.unlockedDocuments, onChapterComplete, saveGame]);

  // Reset game
  const resetGame = useCallback(() => {
    const chapter = CHAPTERS[1];
    const newState: GameState = {
      currentChapter: 1,
      currentNodeId: chapter.startNode,
      path: [chapter.startNode],
      unlockedDocuments: [],
      startTime: Date.now(),
      deaths: 0,
    };
    setGameState(newState);
    saveGame(newState);
  }, [saveGame]);

  // Get current stage from node ID (e.g., "1-s2" -> stage 2)
  const getCurrentStage = (): number => {
    const nodeId = gameState.currentNodeId;
    const match = nodeId.match(/-s(\d)/);
    if (match) return parseInt(match[1]);
    if (nodeId.includes('complete') || nodeId.includes('soon')) return 5;
    return 1;
  };

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

  return (
    <div className="space-y-4">
      {/* Chapter & Stage header */}
      <div className="flex items-center justify-between mb-4">
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
      <div className="mb-6">
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

      {/* Story node display */}
      <StoryNodeDisplay
        node={currentNode}
        onChoice={handleChoice}
        onContinue={handleContinue}
        onDeath={handleDeath}
        onChapterComplete={handleChapterComplete}
        soundEnabled={soundEnabled}
      />

      {/* Documents count */}
      {gameState.unlockedDocuments.length > 0 && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-400 text-xs font-pixel">
            📄 DOCUMENTS UNLOCKED: {gameState.unlockedDocuments.length}
          </p>
        </div>
      )}

      {/* Reset Game Button */}
      <div className="mt-6 pt-4 border-t border-white/10">
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

      {/* Path history (debug/development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="text-white/20 text-xs cursor-pointer">Debug: Path History</summary>
          <div className="mt-2 p-2 bg-black/50 rounded text-white/30 text-xs font-mono max-h-32 overflow-auto">
            {gameState.path.join(' → ')}
          </div>
          <button
            onClick={resetGame}
            className="mt-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs"
          >
            Reset Game
          </button>
        </details>
      )}
    </div>
  );
};

export default GameEngine;