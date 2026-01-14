import { MockQuestion } from "../mock-test-data";
import { ScoreResult, SpeakingMeta } from "./types";

export function scoreSpeakingItem(item: MockQuestion, meta: SpeakingMeta): ScoreResult {
  const result: ScoreResult = {
    itemId: item.id,
    section: "Speaking",
    score: 0,
    maxScore: item.max_score,
    skills: {
      fluency: 0,
      pronunciation: 0,
      content: 0
    },
    autoZero: false
  };

  const { audioBlob, duration } = meta;

  // Auto-score ZERO checks
  // no audioBlob OR no duration OR audioBlob.size < 8000
  if (!audioBlob || !duration || audioBlob.size < 8000) {
    result.score = 0;
    result.autoZero = true;
    return result;
  }

  // Calculate fluency based on duration
  let fluency = 1; // Default "else -> 1"
  if (duration >= 30) fluency = 5;
  else if (duration >= 20) fluency = 4;
  else if (duration >= 10) fluency = 3;
  else if (duration >= 5) fluency = 2;
  
  // Calculate pronunciation: max(0, fluency - 1)
  const pronunciation = Math.max(0, fluency - 1);

  // Calculate content: min(5, floor(duration / 3))
  const content = Math.min(5, Math.floor(duration / 3));

  // Normalize score
  // (fluency + pronunciation + content) to item.max_score
  // Assuming denominator is 15 based on max possible values (5+4+5=14? wait. fluency max 5, pron max 4, content max 5. Total 14. But formula in prompt says /15)
  // Prompt says: "Normalizes (fluency + pronunciation + content) to item.max_score"
  // Previous prompt said: "itemScore = Math.round((speakingRaw / 15) * item.max_score);"
  // So I will use 15 as the denominator.
  const speakingRaw = fluency + pronunciation + content;
  result.score = Math.round((speakingRaw / 15) * item.max_score);
  
  result.skills = {
    fluency,
    pronunciation,
    content
  };

  return result;
}
