import { NextRequest, NextResponse } from 'next/server';

// In-memory global game state (in production, use Redis or database)
// This will be shared across all players

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
  deaths: number;
  lastActivity: number;
}

// Global state storage (use Redis in production)
declare global {
  var globalGameState: GlobalGameState | undefined;
  var onlineUsers: Map<string, number> | undefined;
}

const VOTING_DURATION = 120 * 1000; // 2 minutes per decision

// Initialize or get global state
function getGlobalState(): GlobalGameState {
  if (!global.globalGameState) {
    global.globalGameState = {
      chapter: 1,
      nodeId: '1-s1',
      votes: {},
      totalVoters: 0,
      votingEndsAt: Date.now() + VOTING_DURATION,
      decided: false,
      winningChoice: null,
      completedChapters: 0,
      deaths: 0,
      lastActivity: Date.now(),
    };
  }
  return global.globalGameState;
}

// Track online users
function getOnlineUsers(): Map<string, number> {
  if (!global.onlineUsers) {
    global.onlineUsers = new Map();
  }
  return global.onlineUsers;
}

// GET - Fetch current global game state
export async function GET(request: NextRequest) {
  try {
    const state = getGlobalState();
    const onlineUsers = getOnlineUsers();
    
    // Get visitor ID from query to track online status
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');
    
    if (visitorId) {
      onlineUsers.set(visitorId, Date.now());
    }
    
    // Clean up offline users (inactive for more than 30 seconds)
    const now = Date.now();
    const usersToDelete: string[] = [];
    onlineUsers.forEach((lastSeen, id) => {
      if (now - lastSeen > 30000) {
        usersToDelete.push(id);
      }
    });
    usersToDelete.forEach(id => onlineUsers.delete(id));
    
    // Check if voting time has ended and we need to decide
    if (!state.decided && state.votingEndsAt <= now) {
      // Calculate winner
      let maxVotes = 0;
      let winningChoice: string | null = null;
      
      for (const [choiceId, votes] of Object.entries(state.votes)) {
        if (votes.length > maxVotes) {
          maxVotes = votes.length;
          winningChoice = choiceId;
        }
      }
      
      // If no votes, pick first choice as default
      if (!winningChoice && Object.keys(state.votes).length === 0) {
        // Will be set when advancing to next node
      }
      
      state.decided = true;
      state.winningChoice = winningChoice;
    }
    
    return NextResponse.json({
      success: true,
      state: {
        chapter: state.chapter,
        nodeId: state.nodeId,
        votes: state.votes,
        totalVoters: state.totalVoters,
        votingEndsAt: state.votingEndsAt,
        decided: state.decided,
        winningChoice: state.winningChoice,
        completedChapters: state.completedChapters,
        deaths: state.deaths || 0,
      },
      onlineCount: onlineUsers.size,
    });
  } catch (error) {
    console.error('Error fetching global state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch state' },
      { status: 500 }
    );
  }
}

// POST - Reset or advance the game (admin action)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, chapter, nodeId, isDeath, isChapterComplete } = body;
    
    const state = getGlobalState();
    
    if (action === 'reset') {
      // Reset to beginning
      global.globalGameState = {
        chapter: 1,
        nodeId: '1-s1',
        votes: {},
        totalVoters: 0,
        votingEndsAt: Date.now() + VOTING_DURATION,
        decided: false,
        winningChoice: null,
        completedChapters: 0,
        lastActivity: Date.now(),
      };
      
      return NextResponse.json({ success: true, message: 'Game reset' });
    }
    
    if (action === 'advance' && chapter && nodeId) {
      // Track deaths
      if (isDeath) {
        state.deaths = (state.deaths || 0) + 1;
      }
      
      // Track chapter completion
      if (isChapterComplete) {
        state.completedChapters = Math.max(state.completedChapters || 0, chapter - 1);
      }
      
      // Advance to specific node
      state.chapter = chapter;
      state.nodeId = nodeId;
      state.votes = {};
      state.totalVoters = 0;
      state.votingEndsAt = Date.now() + VOTING_DURATION;
      state.decided = false;
      state.winningChoice = null;
      state.lastActivity = Date.now();
      
      return NextResponse.json({ success: true, message: 'Game advanced' });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating global state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update state' },
      { status: 500 }
    );
  }
}