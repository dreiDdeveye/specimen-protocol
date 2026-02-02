import { NextRequest, NextResponse } from 'next/server';
import {
  findObserverByFingerprint,
  findObserverByUsername,
  createObserver,
  updateObserverLastSeen,
} from '@/db/observers';

// POST - Register or retrieve observer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    // Check if observer already exists by fingerprint
    const existingByFingerprint = await findObserverByFingerprint(fingerprint);
    
    if (existingByFingerprint) {
      // Update last seen
      await updateObserverLastSeen(existingByFingerprint.id);
      return NextResponse.json({
        success: true,
        observer: existingByFingerprint,
        isExisting: true,
      });
    }

    // New observer - username required
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username required for new observer' },
        { status: 400 }
      );
    }

    // Validate username
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Username must be 2-20 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { success: false, error: 'Username can only contain letters, numbers, _ and -' },
        { status: 400 }
      );
    }

    // Check reserved names
    const reserved = ['admin', 'system', 'mod', 'moderator', 'specimen', 'protocol'];
    if (reserved.includes(trimmedUsername.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'This username is reserved' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingByUsername = await findObserverByUsername(trimmedUsername);
    if (existingByUsername) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new observer
    const observer = await createObserver(trimmedUsername, fingerprint);

    return NextResponse.json({
      success: true,
      observer,
      isExisting: false,
    });
  } catch (error) {
    console.error('[API] Observer registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check observer by fingerprint
export async function GET(request: NextRequest) {
  try {
    const fingerprint = request.nextUrl.searchParams.get('fingerprint');

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    const observer = await findObserverByFingerprint(fingerprint);

    if (observer) {
      await updateObserverLastSeen(observer.id);
      return NextResponse.json({
        success: true,
        observer,
        exists: true,
      });
    }

    return NextResponse.json({
      success: true,
      observer: null,
      exists: false,
    });
  } catch (error) {
    console.error('[API] Observer lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
