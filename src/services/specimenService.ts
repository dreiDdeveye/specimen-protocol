import {
  getSpecimenState,
  calculateAndUpdateEvolution,
  getAllEvolutionStages,
  getEvolutionStage,
  resetSpecimenState,
  createSystemEvent,
} from '@/db/specimen';
import { getRegulationSetting } from '@/db/regulation';
import type { SpecimenState, EvolutionStage } from '@/types';

export interface SpecimenStatus {
  state: SpecimenState;
  stage: EvolutionStage;
  nextStage: EvolutionStage | null;
}

export async function getSpecimenStatus(): Promise<SpecimenStatus | null> {
  const state = await getSpecimenState();
  if (!state) return null;

  const stages = await getAllEvolutionStages();
  const currentStage = stages.find(s => s.stage === state.current_stage);
  if (!currentStage) return null;

  const currentIndex = stages.findIndex(s => s.stage === state.current_stage);
  const nextStage = stages[currentIndex + 1] || null;

  return {
    state,
    stage: currentStage,
    nextStage,
  };
}

export async function updateMarketCap(
  newMarketCap: number
): Promise<{
  success: boolean;
  evolved?: boolean;
  state?: SpecimenState;
  stage?: EvolutionStage;
  error?: string;
}> {
  // Check if evolution is enabled
  const evolutionEnabled = await getRegulationSetting<boolean>('evolution_enabled');
  if (!evolutionEnabled) {
    return { success: false, error: 'Evolution is disabled' };
  }

  // Check if evolution is paused
  const evolutionPaused = await getRegulationSetting<boolean>('evolution_paused');
  if (evolutionPaused) {
    return { success: false, error: 'Evolution is paused' };
  }

  try {
    const result = await calculateAndUpdateEvolution(newMarketCap);
    
    if (result.evolved) {
      // Log system event for evolution
      await createSystemEvent('SPECIMEN_EVOLVED', {
        newStage: result.stage.stage,
        stageName: result.stage.name,
        marketCap: newMarketCap,
      });
    }

    return {
      success: true,
      evolved: result.evolved,
      state: result.state,
      stage: result.stage,
    };
  } catch (error) {
    console.error('[SpecimenService] Failed to update market cap:', error);
    return { success: false, error: 'Failed to update market cap' };
  }
}

export async function forceEvolution(targetStage: number): Promise<{
  success: boolean;
  state?: SpecimenState;
  stage?: EvolutionStage;
  error?: string;
}> {
  const stage = await getEvolutionStage(targetStage);
  if (!stage) {
    return { success: false, error: `Stage ${targetStage} not found` };
  }

  try {
    // Set market cap to exactly the required amount for this stage
    const result = await calculateAndUpdateEvolution(Number(stage.market_cap_required));
    
    await createSystemEvent('FORCE_EVOLUTION', {
      targetStage,
      stageName: stage.name,
      marketCap: stage.market_cap_required,
    });

    return {
      success: true,
      state: result.state,
      stage: result.stage,
    };
  } catch (error) {
    console.error('[SpecimenService] Failed to force evolution:', error);
    return { success: false, error: 'Failed to force evolution' };
  }
}

export async function resetSpecimen(): Promise<{
  success: boolean;
  state?: SpecimenState;
  error?: string;
}> {
  try {
    const state = await resetSpecimenState();
    
    await createSystemEvent('SPECIMEN_RESET', {
      timestamp: new Date().toISOString(),
    });

    return { success: true, state };
  } catch (error) {
    console.error('[SpecimenService] Failed to reset specimen:', error);
    return { success: false, error: 'Failed to reset specimen' };
  }
}

export async function getAllStages(): Promise<EvolutionStage[]> {
  return getAllEvolutionStages();
}

export async function injectSystemMessage(message: string): Promise<void> {
  await createSystemEvent('SYSTEM_MESSAGE', {
    message,
    timestamp: new Date().toISOString(),
  });
}
