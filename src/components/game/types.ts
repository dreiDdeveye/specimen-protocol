// Game Types - Escape from Epstein's Island

export interface StoryStage {
  id: number;
  text: string;
  question: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  document?: {
    title: string;
    preview: string;
    pdfUrl: string;
  };
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  stages: StoryStage[];
}

export interface GameState {
  currentChapter: number;
  currentStage: number;
  completedChapters: number[];
  unlockedDocuments: string[];
}

// Legacy types for backward compatibility
export type GamePhase = 'voting' | 'waiting' | 'results';

export interface StoryChoice {
  id: string;
  text: string;
  votes: number;
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

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  narratives: Narrative[];
  choices: StoryChoice[];
}