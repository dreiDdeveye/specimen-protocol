import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GAME_ID = 'main';

interface VoteData {
  visitorId: string;
  visitorName: string;
  choiceId: string;
  timestamp: number;
}

// POST - Submit or change a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, visitorName, choiceId, chapter, nodeId } = body;
    
    if (!visitorId || !choiceId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get current state
    const { data: state, error: fetchError } = await supabase
      .from('global_game_state')
      .select('*')
      .eq('id', GAME_ID)
      .single();
    
    if (fetchError || !state) {
      return NextResponse.json({ success: false, error: 'Game not initialized' }, { status: 400 });
    }
    
    // Verify we're voting on current node
    if (state.chapter !== chapter || state.node_id !== nodeId) {
      return NextResponse.json({ success: false, error: 'Game state has changed, please refresh' }, { status: 400 });
    }
    
    // Check if voting ended
    if (state.decided) {
      return NextResponse.json({ success: false, error: 'Voting has ended' }, { status: 400 });
    }
    
    // Check if locked (last 10 seconds)
    const timeLeft = Math.floor((state.voting_ends_at - Date.now()) / 1000);
    if (timeLeft <= 10) {
      return NextResponse.json({ success: false, error: 'Voting is locked' }, { status: 400 });
    }
    
    // Update votes
    const votes: Record<string, VoteData[]> = state.votes || {};
    
    // Remove previous vote from any choice
    Object.keys(votes).forEach(cId => {
      votes[cId] = (votes[cId] || []).filter(v => v.visitorId !== visitorId);
      // Clean up empty arrays
      if (votes[cId].length === 0) {
        delete votes[cId];
      }
    });
    
    // Add new vote
    if (!votes[choiceId]) {
      votes[choiceId] = [];
    }
    
    votes[choiceId].push({
      visitorId,
      visitorName: visitorName || 'Anonymous',
      choiceId,
      timestamp: Date.now(),
    });
    
    // Calculate total voters
    const allVoterIds = new Set<string>();
    Object.values(votes).forEach(voteList => {
      (voteList as VoteData[]).forEach(v => allVoterIds.add(v.visitorId));
    });
    
    // Update database
    const { error: updateError } = await supabase
      .from('global_game_state')
      .update({
        votes,
        total_voters: allVoterIds.size,
        last_activity: Date.now(),
      })
      .eq('id', GAME_ID)
      .eq('node_id', nodeId); // Ensure we're still on the same node
    
    if (updateError) {
      console.error('Error updating vote:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to record vote' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
      yourVote: choiceId,
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit vote' }, { status: 500 });
  }
}