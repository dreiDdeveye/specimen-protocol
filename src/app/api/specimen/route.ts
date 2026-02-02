import { NextRequest, NextResponse } from 'next/server';
import { getSpecimenStatus, getAllStages } from '@/services/specimenService';

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Get current specimen state
export async function GET() {
  try {
    const status = await getSpecimenStatus();

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Specimen state not initialized' },
        { status: 500 }
      );
    }

    const stages = await getAllStages();

    return NextResponse.json({
      success: true,
      state: status.state,
      stage: status.stage,
      nextStage: status.nextStage,
      allStages: stages,
    });
  } catch (error) {
    console.error('[API] Get specimen state error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch specimen state' },
      { status: 500 }
    );
  }
}