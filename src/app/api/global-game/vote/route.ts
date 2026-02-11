import { NextRequest, NextResponse } from 'next/server';

interface VoteData {
  visitorId: string;
  visitorName: string;
  choiceId: string;
  timestamp: number;
}

interface GlobalGameState {
  chapter: number;
  nodeId: string;
  votes: Record<string, VoteData[]>;
  totalVoters: number;
  votingEndsAt: number;
  decided: boolean;
  winningChoice: string | null;
  completedChapters: number;
  lastActivity: number;
}

// Chapter data for advancing (simplified - you'll need to import actual chapter data)
const CHAPTER_CHOICES: Record<string, Record<string, string>> = {
  // Map choice IDs to next node IDs
  // This should match your actual chapter data
};

const VOTING_DURATION = 120 * 1000; // 2 minutes

// Get global state
function getGlobalState(): GlobalGameState | null {
  return global.globalGameState || null;
}

// POST - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, visitorName, choiceId, chapter, nodeId, previousVote } = body;
    
    if (!visitorId || !choiceId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const state = getGlobalState();
    
    if (!state) {
      return NextResponse.json(
        { success: false, error: 'Game not initialized' },
        { status: 400 }
      );
    }
    
    // Verify we're voting on the current node
    if (state.chapter !== chapter || state.nodeId !== nodeId) {
      return NextResponse.json(
        { success: false, error: 'Vote is for outdated game state' },
        { status: 400 }
      );
    }
    
    // Check if voting has ended
    if (state.decided) {
      return NextResponse.json(
        { success: false, error: 'Voting has ended' },
        { status: 400 }
      );
    }
    
    // Remove previous vote if changing vote
    if (previousVote && state.votes[previousVote]) {
      state.votes[previousVote] = state.votes[previousVote].filter(
        v => v.visitorId !== visitorId
      );
    } else {
      // Check if user already voted (and didn't send previousVote)
      let existingVoteChoice: string | null = null;
      Object.entries(state.votes).forEach(([cId, votes]) => {
        const found = votes.find(v => v.visitorId === visitorId);
        if (found) {
          existingVoteChoice = cId;
        }
      });
      
      // Remove from previous choice if found
      if (existingVoteChoice && state.votes[existingVoteChoice]) {
        state.votes[existingVoteChoice] = state.votes[existingVoteChoice].filter(
          v => v.visitorId !== visitorId
        );
      }
    }
    
    // Initialize votes array for this choice if needed
    if (!state.votes[choiceId]) {
      state.votes[choiceId] = [];
    }
    
    // Add the vote
    state.votes[choiceId].push({
      visitorId,
      visitorName: visitorName || 'Anonymous',
      choiceId,
      timestamp: Date.now(),
    });
    
    state.lastActivity = Date.now();
    
    // Recalculate total voters
    const allVoterIds = new Set<string>();
    Object.values(state.votes).forEach(votes => {
      votes.forEach(v => allVoterIds.add(v.visitorId));
    });
    state.totalVoters = allVoterIds.size;
    
    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
      yourVote: choiceId,
      currentVotes: Object.fromEntries(
        Object.entries(state.votes).map(([k, v]) => [k, v.length])
      ),
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}