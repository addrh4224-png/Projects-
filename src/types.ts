export interface QuizQuestion {
  id: string;
  sourceExam: string; // e.g., "Grade 12B - Sem 2, 2021/2022"
  section: "LISTENING" | "READING" | "GRAMMAR" | "VOCABULARY" | "WRITING";
  text?: string;       // Reading passage or dialogue instructions
  question: string;
  options?: string[];  // For multiple choices
  correctAnswer?: string; // For objective checking
  userAnswer?: string;
  checked?: boolean;
  score?: number;
  modelAnswer?: string; // For open/writing tasks
}

export interface VocabWord {
  word: string;
  lemma: string;
  arabicTranslation: string;
  definition: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  rawCount: number;
  percentage: number;
  sectionWeight: number; // e.g. Listening = 1.4, etc.
  contextualMultiplier: number; // 1.3 for Vision 2040 concepts, etc.
  weightedScore: number;
  priorityTier: "Emergency" | "Important" | "Normal" | "Low";
  emoji: string;
  imagePrompt: string;
  imageUrl?: string;
  audioBase64?: string; // Cache TTS audio
  isVision2040?: boolean;
}

export interface AnalysisSummary {
  totalWords: number;
  uniqueWords: number;
  emergencyCount: number;
  averageCEFR: string;
}

export interface ParsingResult {
  vocabList: VocabWord[];
  sections: { [key: string]: string[] };
  summary: AnalysisSummary;
  pythonCodeRunSuccessfully?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
