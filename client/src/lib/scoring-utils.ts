import { SpeakingTaskType } from "./speaking-data";

export interface SpeakingScore {
  overall: number;
  content: number;
  fluency: number;
  pronunciation: number;
  feedback: string;
}

export const calculateSpeakingScore = (
  taskType: SpeakingTaskType, 
  durationSeconds: number, 
  transcript: string = "",
  targetText: string = "",
  confidenceScore: number = 0,
  pauseCount: number = 0
): SpeakingScore => {
  // Demo Mode: If duration is extremely short (< 1s) and no transcript
  if (durationSeconds < 1 && !transcript) {
    return {
      overall: 10, content: 10, fluency: 10, pronunciation: 10,
      feedback: "No voice detected. Please speak clearly into the microphone."
    };
  }

  // --- 1. Content Scoring ---
  let content = 0;
  
  // Normalize texts
  const cleanTranscript = (transcript || "").toLowerCase().replace(/[^\w\s]/g, '').trim();
  const cleanTarget = (targetText || "").toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  const transcriptWords = cleanTranscript.split(/\s+/).filter(w => w.length > 0);
  const targetWords = cleanTarget.split(/\s+/).filter(w => w.length > 0);
  
  if (transcriptWords.length === 0) {
      content = 10; // Minimum score
  } else {
      // Logic depends on task type
      if (taskType === "Read Aloud" || taskType === "Repeat Sentence" || taskType === "Answer Short Question") {
          // Exact match needed (Sequence matters ideally, but set intersection is a good proxy for "words mentioned")
          // For strictness, let's use simple match count / target count
          const matchCount = targetWords.filter(w => transcriptWords.includes(w)).length;
          // Calculate percentage
          const rawPercentage = (matchCount / Math.max(targetWords.length, 1)) * 100;
          
          // Boost score slightly because speech recognition isn't perfect
          content = Math.min(90, Math.max(10, rawPercentage * 1.1));
          
          // Special case for ASQ (Answer Short Question) - needs to contain the keyword
          if (taskType === "Answer Short Question") {
              // targetText in ASQ is the answer (e.g. "Author")
              if (cleanTranscript.includes(cleanTarget)) {
                  content = 90;
              } else {
                  content = 10;
              }
          }
      } else {
          // Open ended tasks (Describe Image, Retell Lecture, etc.)
          // We don't have exact keywords for all, so we check for:
          // 1. Length (Fluency proxy for content)
          // 2. Vocabulary richness (unique words)
          // 3. Keywords from targetText if it looks like a script (e.g. Retell Lecture)
          
          let keywordMatchRate = 0;
          
          // If targetText is long (audio script), treat it as keywords source
          if (targetWords.length > 20) {
               // Extract "keywords" (words > 4 chars)
               const keywords = targetWords.filter(w => w.length > 4);
               const matchedKeywords = keywords.filter(w => transcriptWords.includes(w)).length;
               keywordMatchRate = (matchedKeywords / Math.max(keywords.length, 1)) * 100;
          } else {
               // No script, just prompt. Rely on length/richness.
               // Expected length ~100 words for 40s speech
               const lengthScore = Math.min(100, (transcriptWords.length / 60) * 100); 
               keywordMatchRate = lengthScore;
          }
          
          content = Math.min(90, Math.max(10, 40 + (keywordMatchRate * 0.5))); 
      }
  }

  // --- 2. Fluency Scoring ---
  // Base 90, subtract for pauses and bad speed
  let fluency = 90;
  
  // Hesitation penalty
  fluency -= (pauseCount * 5); 
  
  // WPM check (Words Per Minute)
  const wpm = (transcriptWords.length / Math.max(durationSeconds, 1)) * 60;
  
  if (wpm < 40) fluency -= 30; // Too slow
  else if (wpm < 80) fluency -= 15; // Slow
  else if (wpm > 200) fluency -= 10; // Too fast (maybe unclear)
  
  fluency = Math.min(90, Math.max(10, fluency));

  // --- 3. Pronunciation Scoring ---
  // Use confidence from API (0-1) -> map to 0-90
  // If confidence is 0 (simulated), fallback to content-based estimation
  let pronunciation = 0;
  
  if (confidenceScore > 0) {
      // API confidence is usually 0.8-0.99 for good speech
      // Map 0.7-1.0 to 50-90
      const normalizedConf = Math.max(0, confidenceScore - 0.5) * 2; // 0.5->0, 1.0->1
      pronunciation = Math.min(90, Math.max(10, normalizedConf * 90));
  } else {
      // Fallback: If content is high, pronunciation is likely decent
      pronunciation = Math.min(90, Math.max(10, content * 0.9 + (Math.random() * 10)));
  }

  // Final Aggregation
  const overall = Math.round((content * 0.4 + fluency * 0.3 + pronunciation * 0.3));

  // Feedback Generation
  let feedback = "";
  if (overall > 79) feedback = "Excellent response! Native-like fluency and pronunciation.";
  else if (overall > 65) feedback = "Good response. Clear articulation with minor hesitations.";
  else if (overall > 50) feedback = "Fair response. Try to reduce hesitations and improve clarity.";
  else feedback = "Needs improvement. Focus on content coverage and speaking continuously.";

  // Debug info for "simulation" if no transcript
  if (!transcript && durationSeconds > 1) {
      feedback += " (Note: No speech detected. Check microphone permissions.)";
      content = 10;
      fluency = 10;
      pronunciation = 10;
  }

  return {
    overall: Math.round(overall),
    content: Math.round(content),
    fluency: Math.round(fluency),
    pronunciation: Math.round(pronunciation),
    feedback
  };
};

export const SCORING_CRITERIA = {
  "Read Aloud": {
    content: "Does the response match the text exactly?",
    fluency: "Is the rhythm and phrasing natural?",
    pronunciation: "Are all words articulated clearly?"
  },
  "Repeat Sentence": {
    content: "Did you repeat all words in the correct sequence?",
    fluency: "Did you speak without hesitation?",
    pronunciation: "Is the speech intelligible?"
  },
  "Describe Image": {
    content: "Did you cover key features and implications?",
    fluency: "Is the flow smooth without long pauses?",
    pronunciation: "Is the speech clear and natural?"
  },
  // ... defaults for others
};
