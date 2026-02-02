import { NextRequest, NextResponse } from 'next/server';
import { calculateAndUpdateEvolution, createSystemEvent } from '@/db/specimen';
import { getRegulationSetting } from '@/db/regulation';

// DexScreener API endpoint
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens';

// GET - Fetch market data for a token
export async function GET(request: NextRequest) {
  try {
    const tokenAddress = request.nextUrl.searchParams.get('token');
    
    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: 'Token address is required. Use ?token=4T7XUugzhMtqxY8F7fmYaBGQyd6D7KdNJR7MvzVVpump',
      }, { status: 400 });
    }

    // Fetch from DexScreener
    const response = await fetch(`${DEXSCREENER_API}/${tokenAddress}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 },
    });

    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No pairs found for this token. Make sure the contract address is correct.',
      }, { status: 404 });
    }

    // Get the pair with highest liquidity (main pair)
    const mainPair = data.pairs.reduce((best: any, pair: any) => {
      const bestLiquidity = best?.liquidity?.usd || 0;
      const pairLiquidity = pair?.liquidity?.usd || 0;
      return pairLiquidity > bestLiquidity ? pair : best;
    }, data.pairs[0]);

    const marketCap = mainPair.marketCap || mainPair.fdv || 0;

    return NextResponse.json({
      success: true,
      data: {
        tokenAddress,
        tokenName: mainPair.baseToken?.name || 'Unknown',
        tokenSymbol: mainPair.baseToken?.symbol || 'UNKNOWN',
        marketCap,
        price: parseFloat(mainPair.priceUsd) || 0,
        priceChange24h: mainPair.priceChange?.h24 || 0,
        volume24h: mainPair.volume?.h24 || 0,
        liquidity: mainPair.liquidity?.usd || 0,
        pairAddress: mainPair.pairAddress,
        dexId: mainPair.dexId,
        chain: mainPair.chainId,
        url: mainPair.url,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] DexScreener fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch market data',
    }, { status: 500 });
  }
}

// POST - Fetch market cap and update specimen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tokenAddress = body.token;

    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: 'Token address is required in body: { "token": "DyprcxbNBgA41JNsDc3Ku395vVXSQC9xWV75mUrMqThW" }',
      }, { status: 400 });
    }

    // Check if evolution is enabled
    const evolutionEnabled = await getRegulationSetting<boolean>('evolution_enabled');
    const evolutionPaused = await getRegulationSetting<boolean>('evolution_paused');
    
    if (!evolutionEnabled || evolutionPaused) {
      return NextResponse.json({
        success: false,
        error: 'Evolution is currently disabled or paused',
      }, { status: 400 });
    }

    // Fetch from DexScreener
    const response = await fetch(`${DEXSCREENER_API}/${tokenAddress}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No pairs found for this token',
      }, { status: 404 });
    }

    // Get the pair with highest liquidity
    const mainPair = data.pairs.reduce((best: any, pair: any) => {
      const bestLiquidity = best?.liquidity?.usd || 0;
      const pairLiquidity = pair?.liquidity?.usd || 0;
      return pairLiquidity > bestLiquidity ? pair : best;
    }, data.pairs[0]);

    const marketCap = mainPair.marketCap || mainPair.fdv || 0;
    const tokenName = mainPair.baseToken?.name || 'Unknown';
    const tokenSymbol = mainPair.baseToken?.symbol || 'UNKNOWN';

    // Update specimen with new market cap
    const result = await calculateAndUpdateEvolution(marketCap);

    // Log the update
    await createSystemEvent('MARKET_CAP_UPDATE', {
      source: 'dexscreener',
      tokenAddress,
      tokenName,
      tokenSymbol,
      marketCap,
      evolved: result.evolved,
      stage: result.stage.name,
    });

    return NextResponse.json({
      success: true,
      data: {
        tokenName,
        tokenSymbol,
        marketCap,
        formattedMarketCap: formatMarketCap(marketCap),
        evolved: result.evolved,
        currentStage: {
          number: result.stage.stage,
          name: result.stage.name,
        },
        progress: result.state.evolution_progress,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] DexScreener update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update market cap',
    }, { status: 500 });
  }
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}