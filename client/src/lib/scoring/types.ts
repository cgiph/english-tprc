export interface SpeakingMeta {
  audioBlob?: Blob;
  duration?: number;
}

export interface ScoreResult {
  itemId: string;
  section: "Speaking" | "Writing" | "Reading" | "Listening";
  score: number;
  maxScore: number;
  skills?: {
    fluency?: number;
    pronunciation?: number;
    content?: number;
  };
  autoZero?: boolean;
}
