import { NextRequest, NextResponse } from 'next/server';
import { getSpecimenStatus, getAllStages } from '@/services/specimenService';

// Disable ALL caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// GET - Get current specimen state
export async function GET(request: NextRequest) {
  try {
    const status = await getSpecimenStatus();

    if (!status) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Specimen state not initialized' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
            'CDN-Cache-Control': 'no-store',
            'Vercel-CDN-Cache-Control': 'no-store',
          },
        }
      );
    }

    const stages = await getAllStages();

    return new NextResponse(
      JSON.stringify({
        success: true,
        state: status.state,
        stage: status.stage,
        nextStage: status.nextStage,
        allStages: stages,
        _timestamp: Date.now(), // Add timestamp to verify fresh data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('[API] Get specimen state error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Failed to fetch specimen state' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}