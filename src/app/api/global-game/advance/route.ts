import { NextRequest, NextResponse } from 'next/server';

// Import chapters to get next node info
// In production, you'd import actual chapter data
// import { CHAPTER_1, CHAPTER_2, ... } from '@/components/game/chapters';

interface GlobalGameState {
  chapter: number;
  nodeId: string;
  votes: Record<string, any[]>;
  totalVoters: number;
  votingEndsAt: number;
  decided: boolean;
  winningChoice: string | null;
  completedChapters: number;
  lastActivity: number;
}

const VOTING_DURATION = 120 * 1000; // 2 minutes

function getGlobalState(): GlobalGameState | null {
  return global.globalGameState || null;
}

// POST - Advance game to next node based on winning choice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nextNodeId, nextChapter, isChapterComplete } = body;
    
    const state = getGlobalState();
    
    if (!state) {
      return NextResponse.json(
        { success: false, error: 'Game not initialized' },
        { status: 400 }
      );
    }
    
    // Update state for next node
    state.chapter = nextChapter || state.chapter;
    state.nodeId = nextNodeId;
    state.votes = {};
    state.totalVoters = 0;
    state.votingEndsAt = Date.now() + VOTING_DURATION;
    state.decided = false;
    state.winningChoice = null;
    state.lastActivity = Date.now();
    
    if (isChapterComplete) {
      state.completedChapters = Math.max(state.completedChapters, state.chapter);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Game advanced',
      newState: {
        chapter: state.chapter,
        nodeId: state.nodeId,
        votingEndsAt: state.votingEndsAt,
      },
    });
  } catch (error) {
    console.error('Error advancing game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to advance game' },
      { status: 500 }
    );
  }
}