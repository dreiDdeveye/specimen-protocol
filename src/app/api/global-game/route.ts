import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VOTING_DURATION = 120 * 1000; // 2 minutes
const GAME_ID = 'main';

interface VoteData {
  visitorId: string;
  visitorName: string;
  choiceId: string;
  timestamp: number;
}

// GET - Fetch current global game state
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');
    const visitorName = searchParams.get('visitorName');
    
    // Update online status with name
    if (visitorId) {
      await supabase
        .from('online_users')
        .upsert({ 
          visitor_id: visitorId,
          visitor_name: visitorName || 'Anonymous',
          last_seen: Date.now() 
        }, { 
          onConflict: 'visitor_id' 
        });
    }
    
    // Clean up offline users (inactive > 30 seconds)
    await supabase
      .from('online_users')
      .delete()
      .lt('last_seen', Date.now() - 30000);
    
    // Get online count
    const { count: onlineCount } = await supabase
      .from('online_users')
      .select('*', { count: 'exact', head: true });
    
    // Get game state
    let { data: state, error } = await supabase
      .from('global_game_state')
      .select('*')
      .eq('id', GAME_ID)
      .single();
    
    // If no state exists, create initial state
    if (error || !state) {
      const initialState = {
        id: GAME_ID,
        chapter: 1,
        node_id: '1-s1',
        votes: {},
        total_voters: 0,
        voting_ends_at: Date.now() + VOTING_DURATION,
        decided: false,
        winning_choice: null,
        completed_chapters: 0,
        deaths: 0,
        last_activity: Date.now(),
      };
      
      const { data: newState, error: insertError } = await supabase
        .from('global_game_state')
        .upsert(initialState)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating initial state:', insertError);
        return NextResponse.json({ success: false, error: 'Failed to initialize game' }, { status: 500 });
      }
      
      state = newState;
    }
    
    const now = Date.now();
    
    // Check if voting time has ended and we need to decide
    if (!state.decided && state.voting_ends_at <= now) {
      // Calculate winner
      let maxVotes = 0;
      let winningChoice: string | null = null;
      const votes = state.votes || {};
      
      Object.entries(votes).forEach(([choiceId, voteList]) => {
        const voteCount = (voteList as VoteData[]).length;
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winningChoice = choiceId;
        }
      });
      
      // Update state as decided
      const { error: updateError } = await supabase
        .from('global_game_state')
        .update({ 
          decided: true, 
          winning_choice: winningChoice,
          last_activity: now
        })
        .eq('id', GAME_ID);
      
      if (!updateError) {
        state.decided = true;
        state.winning_choice = winningChoice;
      }
    }
    
    return NextResponse.json({
      success: true,
      state: {
        chapter: state.chapter,
        nodeId: state.node_id,
        votes: state.votes || {},
        totalVoters: state.total_voters,
        votingEndsAt: state.voting_ends_at,
        decided: state.decided,
        winningChoice: state.winning_choice,
        completedChapters: state.completed_chapters,
        deaths: state.deaths || 0,
      },
      onlineCount: onlineCount || 1,
    });
  } catch (error) {
    console.error('Error fetching global state:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch state' }, { status: 500 });
  }
}

// POST - Reset or advance the game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, chapter, nodeId, isDeath, isChapterComplete } = body;
    
    if (action === 'reset') {
      const { error } = await supabase
        .from('global_game_state')
        .update({
          chapter: 1,
          node_id: '1-s1',
          votes: {},
          total_voters: 0,
          voting_ends_at: Date.now() + VOTING_DURATION,
          decided: false,
          winning_choice: null,
          completed_chapters: 0,
          deaths: 0,
          last_activity: Date.now(),
        })
        .eq('id', GAME_ID);
      
      if (error) {
        return NextResponse.json({ success: false, error: 'Failed to reset game' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Game reset' });
    }
    
    if (action === 'advance' && chapter !== undefined && nodeId) {
      // Get current state first
      const { data: currentState } = await supabase
        .from('global_game_state')
        .select('deaths, completed_chapters')
        .eq('id', GAME_ID)
        .single();
      
      const newDeaths = isDeath ? ((currentState?.deaths || 0) + 1) : (currentState?.deaths || 0);
      const newCompletedChapters = isChapterComplete 
        ? Math.max(currentState?.completed_chapters || 0, chapter - 1)
        : (currentState?.completed_chapters || 0);
      
      const { error } = await supabase
        .from('global_game_state')
        .update({
          chapter,
          node_id: nodeId,
          votes: {},
          total_voters: 0,
          voting_ends_at: Date.now() + VOTING_DURATION,
          decided: false,
          winning_choice: null,
          deaths: newDeaths,
          completed_chapters: newCompletedChapters,
          last_activity: Date.now(),
        })
        .eq('id', GAME_ID);
      
      if (error) {
        console.error('Error advancing game:', error);
        return NextResponse.json({ success: false, error: 'Failed to advance game' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Game advanced', nodeId, chapter });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating global state:', error);
    return NextResponse.json({ success: false, error: 'Failed to update state' }, { status: 500 });
  }
}