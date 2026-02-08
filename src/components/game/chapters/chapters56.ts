import { BranchingChapter } from '../types';

export const CHAPTER_4: BranchingChapter = {
  id: 4, title: "CHAPTER 4", subtitle: "The Investigation", startNode: "4-soon",
  nodes: { "4-soon": { id: "4-soon", type: "chapter-end", text: "🚧 CHAPTER 4: THE INVESTIGATION — COMING SOON 🚧\n\nFBI investigation launched. Warrants prepared. But powerful people don't go down easy. Lawyers, threats, compromised agents. Can you survive the pressure?", noTimer: true, chapterComplete: { chapter: 4, nextChapter: 5, summary: "Coming soon..." } } },
};

export const CHAPTER_5: BranchingChapter = {
  id: 5, title: "CHAPTER 5", subtitle: "The Trial", startNode: "5-soon",
  nodes: { "5-soon": { id: "5-soon", type: "chapter-end", text: "🚧 CHAPTER 5: THE TRIAL — COMING SOON 🚧\n\nThe case goes to court. Defendants, lawyers, media circus. Can you hold your nerve on the witness stand? Will the jury believe you?", noTimer: true, chapterComplete: { chapter: 5, nextChapter: 6, summary: "Coming soon..." } } },
};

export const CHAPTER_6: BranchingChapter = {
  id: 6, title: "CHAPTER 6", subtitle: "The Truth", startNode: "6-soon",
  nodes: { "6-soon": { id: "6-soon", type: "chapter-end", text: "🚧 CHAPTER 6: THE TRUTH — COMING SOON 🚧\n\nThe final chapter. All secrets revealed. All scores settled. The complete truth about the island and the people who profited from human misery.", noTimer: true, chapterComplete: { chapter: 6, nextChapter: 7, summary: "Finale awaits..." } } },
};