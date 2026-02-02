import { NextRequest, NextResponse } from 'next/server';
import {
  getSettings,
  updateSettings,
  toggleChat,
  setChatCooldown,
  setChatMaxLength,
  toggleEvolution,
  pauseEvolution,
  listMutedUsers,
  muteObserver,
  unmuteObserver,
  clearMutes,
  clearChat,
  pruneChat,
  getChatStats,
  upsertEvolutionStage,
  updateStageThreshold,
  removeEvolutionStage,
  injectEvent,
  broadcastSystemMessage,
} from '@/services/regulationService';
import {
  updateMarketCap,
  forceEvolution,
  resetSpecimen,
  getSpecimenStatus,
  getAllStages,
} from '@/services/specimenService';
import { getRecentSystemEvents } from '@/db/specimen';
import { getAllObservers } from '@/db/observers';

// Middleware to check admin auth
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('[Admin] ADMIN_PASSWORD not set');
    return false;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7);
  return token === adminPassword;
}

// GET - Get admin dashboard data
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const [settings, mutedUsers, chatStats, specimenStatus, stages, events, observers] = await Promise.all([
      getSettings(),
      listMutedUsers(),
      getChatStats(),
      getSpecimenStatus(),
      getAllStages(),
      getRecentSystemEvents(50),
      getAllObservers(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        settings,
        mutedUsers,
        chatStats,
        specimen: specimenStatus,
        stages,
        events,
        observers,
      },
    });
  } catch (error) {
    console.error('[Admin API] Get dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}

// POST - Execute admin actions
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      // ===== SETTINGS =====
      case 'updateSettings':
        await updateSettings(params.settings);
        return NextResponse.json({ success: true });

      case 'toggleChat':
        await toggleChat(params.enabled);
        return NextResponse.json({ success: true });

      case 'setChatCooldown':
        await setChatCooldown(params.seconds);
        return NextResponse.json({ success: true });

      case 'setChatMaxLength':
        await setChatMaxLength(params.length);
        return NextResponse.json({ success: true });

      case 'toggleEvolution':
        await toggleEvolution(params.enabled);
        return NextResponse.json({ success: true });

      case 'pauseEvolution':
        await pauseEvolution(params.paused);
        return NextResponse.json({ success: true });

      // ===== CHAT MANAGEMENT =====
      case 'clearChat':
        await clearChat();
        return NextResponse.json({ success: true });

      case 'pruneChat':
        const pruned = await pruneChat(params.hoursOld || 24);
        return NextResponse.json({ success: true, pruned });

      // ===== USER MANAGEMENT =====
      case 'muteUser':
        const muted = await muteObserver(
          params.observerId,
          params.username,
          {
            duration: params.duration,
            shadowMuted: params.shadowMuted,
            reason: params.reason,
          }
        );
        return NextResponse.json({ success: true, muted });

      case 'unmuteUser':
        await unmuteObserver(params.observerId);
        return NextResponse.json({ success: true });

      case 'clearMutes':
        await clearMutes();
        return NextResponse.json({ success: true });

      // ===== SPECIMEN CONTROL =====
      case 'updateMarketCap':
        const mcResult = await updateMarketCap(params.marketCap);
        return NextResponse.json({ ...mcResult, success: true });

      case 'forceEvolution':
        const evolveResult = await forceEvolution(params.stage);
        return NextResponse.json({ ...evolveResult, success: true });

      case 'resetSpecimen':
        const resetResult = await resetSpecimen();
        return NextResponse.json({ ...resetResult, success: true });

      // ===== EVOLUTION STAGES =====
      case 'upsertStage':
        await upsertEvolutionStage(
          params.stage,
          params.name,
          params.marketCapRequired,
          params.description,
          params.assetUrl
        );
        return NextResponse.json({ success: true });

      case 'updateThreshold':
        await updateStageThreshold(params.stage, params.marketCapRequired);
        return NextResponse.json({ success: true });

      case 'removeStage':
        await removeEvolutionStage(params.stage);
        return NextResponse.json({ success: true });

      // ===== SYSTEM EVENTS =====
      case 'injectEvent':
        await injectEvent(params.eventType, params.payload);
        return NextResponse.json({ success: true });

      case 'broadcast':
        await broadcastSystemMessage(params.message);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Admin API] Action error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Action failed' },
      { status: 500 }
    );
  }
}