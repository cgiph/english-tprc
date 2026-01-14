import { MockQuestion } from "../mock-test-data";
import { ScoreResult } from "./types";
import { scoreSpeakingItem } from "./scoreSpeaking";

export function scoreItem(item: MockQuestion, responses: Record<string, any>): ScoreResult {
  if (item.section === "Speaking") {
    const audioBlob = responses[item.id + "_audio_blob"];
    const duration = responses[item.id + "_duration"];
    
    return scoreSpeakingItem(item, { audioBlob, duration });
  }

  // Non-speaking logic
  const response = responses[item.id];
  let score = 0;

  // If no response exists → score 0
  // If response === item.correctAnswer → full score
  // Else → score 0
  if (response !== undefined && response !== null) {
    // Basic equality check. 
    // Note: This is simplified as per instructions "Do NOT migrate complex logic yet."
    if (response === item.correctAnswer) {
      score = item.max_score;
    }
  }

  return {
    itemId: item.id,
    section: item.section,
    score,
    maxScore: item.max_score
  };
}
