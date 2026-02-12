import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Get online players list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');
    const visitorName = searchParams.get('visitorName');
    
    const now = Date.now();
    
    // Update this user's online status with name
    if (visitorId) {
      await supabase
        .from('online_users')
        .upsert({ 
          visitor_id: visitorId,
          visitor_name: visitorName || 'Anonymous',
          last_seen: now,
        }, { 
          onConflict: 'visitor_id' 
        });
    }
    
    // Clean up offline users (inactive > 30 seconds)
    await supabase
      .from('online_users')
      .delete()
      .lt('last_seen', now - 30000);
    
    // Get all online users
    const { data: onlineUsers, error } = await supabase
      .from('online_users')
      .select('visitor_id, visitor_name, last_seen')
      .order('last_seen', { ascending: false });
    
    if (error) {
      console.error('Error fetching online users:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch online users' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      count: onlineUsers?.length || 0,
      players: onlineUsers?.map(u => ({
        id: u.visitor_id,
        name: u.visitor_name || 'Anonymous',
        lastSeen: u.last_seen,
        isActive: now - u.last_seen < 10000, // Active in last 10 seconds
      })) || [],
    });
  } catch (error) {
    console.error('Error in online players API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Heartbeat / Update presence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, visitorName } = body;
    
    if (!visitorId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing visitorId' 
      }, { status: 400 });
    }
    
    await supabase
      .from('online_users')
      .upsert({ 
        visitor_id: visitorId,
        visitor_name: visitorName || 'Anonymous',
        last_seen: Date.now(),
      }, { 
        onConflict: 'visitor_id' 
      });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating presence:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update presence' 
    }, { status: 500 });
  }
}