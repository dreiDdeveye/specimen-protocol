// ============================================
// OLD SYSTEM TYPES (current game - keep these)
// ============================================

// Old choice with isCorrect (for current game)
export interface StoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  // Optional: for future branching
  votes?: number;
}

// Old stage structure (for current game)
export interface StoryStage {
  id: number;
  text: string;
  question: string;
  choices: StoryChoice[];
  document?: {
    title: string;
    preview: string;
    pdfUrl: string;
  };
}

// Old chapter structure (for current game with stages array)
export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  stages: StoryStage[];
}

export interface Narrative {
  id: number;
  text: string;
  document?: {
    title: string;
    preview: string;
    pdfUrl: string;
  };
}

export type GamePhase = 'narrative' | 'voting' | 'waiting' | 'results';

export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

// ============================================
// NEW BRANCHING SYSTEM TYPES (for future use)
// ============================================

// New choice that leads to different outcomes
export interface BranchingChoice {
  id: string;
  text: string;
  nextNode: string; // ID of the next story node
  consequence?: string; // Brief description shown after choosing
}

// A story node - can be narrative, choice, death, or chapter-end
export interface StoryNode {
  id: string;
  type: 'narrative' | 'choice' | 'chapter-end' | 'death' | 'victory';
  text: string;
  question?: string;
  choices?: BranchingChoice[];
  nextNode?: string;
  document?: {
    title: string;
    preview: string;
    pdfUrl: string;
  };
  deathMessage?: string;
  chapterComplete?: {
    chapter: number;
    nextChapter: number;
    summary: string;
  };
  timerSeconds?: number;
  noTimer?: boolean;
}

// New chapter structure with nodes graph
export interface BranchingChapter {
  id: number;
  title: string;
  subtitle: string;
  startNode: string;
  nodes: Record<string, StoryNode>;
}

// Player's journey state
export interface GameState {
  currentChapter: number;
  currentNodeId: string;
  path: string[];
  unlockedDocuments: string[];
  completedChapters: number; // Highest chapter number completed (0 = none, 1 = ch1 done, etc.)
  startTime: number;
  deaths: number;
}