import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch leaderboard (top feeders)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get top feeders ordered by total amount
    const { data: feeders, error } = await supabase
      .from('specimen_feeds')
      .select('id, observer_id, username, wallet_address, amount, feed_count, last_feed_at')
      .order('amount', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching feeders:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    // Add rank to each feeder
    const rankedFeeders = (feeders || []).map((feeder, index) => ({
      rank: index + 1,
      name: feeder.username,
      amount: parseFloat(feeder.amount) || 0,
      wallet: feeder.wallet_address 
        ? `${feeder.wallet_address.slice(0, 4)}...${feeder.wallet_address.slice(-4)}`
        : null,
      feedCount: feeder.feed_count,
      lastFeedAt: feeder.last_feed_at,
    }));

    // Get total stats
    const { data: statsData } = await supabase
      .from('specimen_feeds')
      .select('amount');

    const totalFed = (statsData || []).reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    const totalFeeders = (statsData || []).length;

    return NextResponse.json({
      success: true,
      feeders: rankedFeeders,
      stats: {
        totalFed,
        totalFeeders,
      },
    });
  } catch (error) {
    console.error('Feeds GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Record a new feed
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { observerId, username, amount, walletAddress, txSignature } = body;

    if (!observerId || !username || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const feedAmount = parseFloat(amount);
    if (isNaN(feedAmount) || feedAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    // Check if observer exists in feeds table
    const { data: existingFeed } = await supabase
      .from('specimen_feeds')
      .select('id, amount, feed_count')
      .eq('observer_id', observerId)
      .single();

    if (existingFeed) {
      // Update existing feed record
      const newAmount = (parseFloat(existingFeed.amount) || 0) + feedAmount;
      const newCount = (existingFeed.feed_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('specimen_feeds')
        .update({
          amount: newAmount,
          feed_count: newCount,
          wallet_address: walletAddress || null,
          last_feed_at: new Date().toISOString(),
        })
        .eq('observer_id', observerId);

      if (updateError) {
        console.error('Error updating feed:', updateError);
        return NextResponse.json({ success: false, error: 'Failed to update feed' }, { status: 500 });
      }
    } else {
      // Create new feed record
      const { error: insertError } = await supabase
        .from('specimen_feeds')
        .insert({
          observer_id: observerId,
          username: username,
          wallet_address: walletAddress || null,
          amount: feedAmount,
          feed_count: 1,
          last_feed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting feed:', insertError);
        return NextResponse.json({ success: false, error: 'Failed to record feed' }, { status: 500 });
      }
    }

    // Record the transaction
    if (txSignature) {
      await supabase
        .from('feed_transactions')
        .insert({
          observer_id: observerId,
          username: username,
          amount: feedAmount,
          tx_signature: txSignature,
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Feed recorded successfully',
    });
  } catch (error) {
    console.error('Feeds POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}