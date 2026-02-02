import { getSupabaseServer } from '@/lib/supabase';
import type { SpecimenState, EvolutionStage, MarketCapSnapshot, SystemEvent } from '@/types';

// ============ SPECIMEN STATE ============

export async function getSpecimenState(): Promise<SpecimenState | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('specimen_state')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting specimen state:', error);
  }
  return data as SpecimenState | null;
}

export async function updateSpecimenState(
  marketCap: number,
  currentStage: number,
  evolutionProgress: number
): Promise<SpecimenState> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('specimen_state')
    .update({
      market_cap: marketCap,
      current_stage: currentStage,
      evolution_progress: evolutionProgress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('[DB] Error updating specimen state:', error);
    throw error;
  }
  return data as SpecimenState;
}

export async function resetSpecimenState(): Promise<SpecimenState> {
  return updateSpecimenState(0, 1, 0);
}

// ============ EVOLUTION STAGES ============

export async function getAllEvolutionStages(): Promise<EvolutionStage[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('evolution_stages')
    .select('*')
    .order('stage', { ascending: true });

  if (error) {
    console.error('[DB] Error getting evolution stages:', error);
    return [];
  }
  return (data || []) as EvolutionStage[];
}

export async function getEvolutionStage(
  stage: number
): Promise<EvolutionStage | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('evolution_stages')
    .select('*')
    .eq('stage', stage)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting evolution stage:', error);
  }
  return data as EvolutionStage | null;
}

export async function getNextEvolutionStage(
  currentStage: number
): Promise<EvolutionStage | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('evolution_stages')
    .select('*')
    .gt('stage', currentStage)
    .order('stage', { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting next evolution stage:', error);
  }
  return data as EvolutionStage | null;
}

export async function createEvolutionStage(
  stage: number,
  name: string,
  marketCapRequired: number,
  description?: string,
  assetUrl?: string
): Promise<EvolutionStage> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('evolution_stages')
    .upsert({
      stage,
      name,
      market_cap_required: marketCapRequired,
      description: description || null,
      asset_url: assetUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error creating evolution stage:', error);
    throw error;
  }
  return data as EvolutionStage;
}

export async function updateEvolutionThreshold(
  stage: number,
  marketCapRequired: number
): Promise<EvolutionStage | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('evolution_stages')
    .update({ market_cap_required: marketCapRequired })
    .eq('stage', stage)
    .select()
    .single();

  if (error) {
    console.error('[DB] Error updating evolution threshold:', error);
    return null;
  }
  return data as EvolutionStage;
}

export async function deleteEvolutionStage(stage: number): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('evolution_stages')
    .delete()
    .eq('stage', stage);

  if (error) {
    console.error('[DB] Error deleting evolution stage:', error);
    throw error;
  }
}

// ============ MARKET CAP SNAPSHOTS ============

export async function recordMarketCapSnapshot(
  marketCap: number
): Promise<MarketCapSnapshot> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('market_cap_snapshots')
    .insert({ market_cap: marketCap })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error recording market cap snapshot:', error);
    throw error;
  }
  return data as MarketCapSnapshot;
}

export async function getMarketCapHistory(
  limit: number = 100
): Promise<MarketCapSnapshot[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('market_cap_snapshots')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[DB] Error getting market cap history:', error);
    return [];
  }
  return (data || []) as MarketCapSnapshot[];
}

export async function getMarketCapSince(
  since: Date
): Promise<MarketCapSnapshot[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('market_cap_snapshots')
    .select('*')
    .gt('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) {
    console.error('[DB] Error getting market cap since:', error);
    return [];
  }
  return (data || []) as MarketCapSnapshot[];
}

// ============ SYSTEM EVENTS ============

export async function createSystemEvent(
  eventType: string,
  payload?: Record<string, unknown>
): Promise<SystemEvent> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('system_events')
    .insert({
      event_type: eventType,
      payload: payload || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[DB] Error creating system event:', error);
    throw error;
  }
  return data as SystemEvent;
}

export async function getRecentSystemEvents(
  limit: number = 50
): Promise<SystemEvent[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('system_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[DB] Error getting recent system events:', error);
    return [];
  }
  return (data || []) as SystemEvent[];
}

export async function getSystemEventsByType(
  eventType: string,
  limit: number = 50
): Promise<SystemEvent[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('system_events')
    .select('*')
    .eq('event_type', eventType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[DB] Error getting system events by type:', error);
    return [];
  }
  return (data || []) as SystemEvent[];
}

// ============ EVOLUTION CALCULATION ============

export async function calculateAndUpdateEvolution(
  newMarketCap: number
): Promise<{ state: SpecimenState; evolved: boolean; stage: EvolutionStage }> {
  const supabase = getSupabaseServer();
  
  // Get current state
  const currentState = await getSpecimenState();
  if (!currentState) {
    throw new Error('Specimen state not initialized');
  }

  // Get all stages
  const stages = await getAllEvolutionStages();
  if (stages.length === 0) {
    throw new Error('No evolution stages configured');
  }

  // Determine current stage based on market cap
  let newStage = stages[0];
  for (const stage of stages) {
    if (newMarketCap >= Number(stage.market_cap_required)) {
      newStage = stage;
    } else {
      break;
    }
  }

  // Calculate progress to next stage
  const currentStageIndex = stages.findIndex(s => s.stage === newStage.stage);
  const nextStage = stages[currentStageIndex + 1];
  
  let progress = 100;
  if (nextStage) {
    const currentThreshold = Number(newStage.market_cap_required);
    const nextThreshold = Number(nextStage.market_cap_required);
    const range = nextThreshold - currentThreshold;
    const current = newMarketCap - currentThreshold;
    progress = Math.min(100, Math.max(0, (current / range) * 100));
  }

  const evolved = newStage.stage > currentState.current_stage;

  // Update state
  const updatedState = await updateSpecimenState(newMarketCap, newStage.stage, progress);

  // Record snapshot
  await recordMarketCapSnapshot(newMarketCap);

  // Log evolution event if evolved
  if (evolved) {
    await createSystemEvent('EVOLUTION', {
      from_stage: currentState.current_stage,
      to_stage: newStage.stage,
      market_cap: newMarketCap,
    });
  }

  return {
    state: updatedState,
    evolved,
    stage: newStage,
  };
}
