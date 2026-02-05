import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST - Save wallet address to observer
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { observerId, walletAddress } = body;

    if (!observerId || !walletAddress) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Update observer with wallet address
    const { error } = await supabase
      .from('observers')
      .update({ wallet_address: walletAddress })
      .eq('id', observerId);

    if (error) {
      console.error('Error updating wallet:', error);
      return NextResponse.json({ success: false, error: 'Failed to save wallet' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet address saved',
    });
  } catch (error) {
    console.error('Wallet POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}