import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, fetchMessages, sanitizeMessage } from '@/services/chatService';
import { getRegulationSetting } from '@/db/regulation';
import { findObserverById } from '@/db/observers';

// GET - Fetch recent messages
export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);
    const messages = await fetchMessages(Math.min(100, Math.max(1, limit)));

    const chatEnabled = await getRegulationSetting<boolean>('chat_enabled');
    const cooldownSeconds = await getRegulationSetting<number>('chat_cooldown_seconds');
    const maxLength = await getRegulationSetting<number>('chat_max_length');

    return NextResponse.json({
      success: true,
      messages,
      settings: {
        chatEnabled,
        cooldownSeconds,
        maxLength,
      },
    });
  } catch (error) {
    console.error('[API] Fetch messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { observerId, message } = body;

    if (!observerId || !message) {
      return NextResponse.json(
        { success: false, error: 'Observer ID and message required' },
        { status: 400 }
      );
    }

    // Verify observer exists
    const observer = await findObserverById(observerId);
    if (!observer) {
      return NextResponse.json(
        { success: false, error: 'Observer not found' },
        { status: 404 }
      );
    }

    // Sanitize and send message
    const sanitized = sanitizeMessage(message);
    const result = await sendMessage(observerId, observer.username, sanitized);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.shadowMuted ? null : result.message,
    });
  } catch (error) {
    console.error('[API] Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
