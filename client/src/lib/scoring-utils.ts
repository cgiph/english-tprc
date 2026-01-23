import { SpeakingTaskType } from "./speaking-data";

export interface SpeakingScore {
  overall: number;
  content: number;
  fluency: number;
  pronunciation: number;
  feedback: string;
}

export interface SSTScore {
    overall: number;
    content: number;
    form: number;
    grammar: number;
    vocabulary: number;
    spelling: number;
    feedback: string;
}

export const calculateSSTScore = (
    transcript: string, // User summary
    audioScript: string // Original lecture text
): SSTScore => {
    let content = 2; // Default starting points
    let form = 2;
    let grammar = 2;
    let vocabulary = 2;
    let spelling = 2;
    let feedbackParts: string[] = [];

    // 1. Form (Word Count) - CRITICAL
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    if (wordCount < 50 || wordCount > 70) {
        form = 0;
        feedbackParts.push(`Form: 0/2 (Word count ${wordCount} is outside 50-70 range. Task score is 0).`);
        // If form is 0, PTE usually gives 0 for everything
        return {
            overall: 0, content: 0, form: 0, grammar: 0, vocabulary: 0, spelling: 0,
            feedback: feedbackParts.join(" ")
        };
    } else {
        feedbackParts.push(`Form: 2/2 (Word count ${wordCount} is perfect).`);
    }

    // 2. Content (Keyword Matching)
    // Simple heuristic: check for keywords from audio script
    const scriptWords = audioScript.toLowerCase().match(/\b\w+\b/g) || [];
    // Filter common stop words
    const stopWords = ["the", "and", "is", "in", "to", "of", "a", "it", "that", "on", "for", "with", "as", "are", "this", "be", "was", "at", "by", "an"];
    const keywords = [...new Set(scriptWords.filter(w => w.length > 4 && !stopWords.includes(w)))];
    
    const userWords = transcript.toLowerCase().match(/\b\w+\b/g) || [];
    const matchedKeywords = keywords.filter(k => userWords.includes(k));
    const matchPercentage = matchedKeywords.length / Math.max(keywords.length, 1);

    if (matchPercentage > 0.4) content = 2;
    else if (matchPercentage > 0.2) content = 1;
    else content = 0;
    
    feedbackParts.push(`Content: ${content}/2 (${matchedKeywords.length} keywords found).`);

    // 3. Spelling (Simple dictionary check simulation)
    // We can't do full spell check easily without a library, but let's simulate
    // by assuming very long words might be typos if they don't appear in source or common list?
    // Actually, let's just use a simple heuristic: random "errors" based on input length or 
    // real implementation: check against a small set of common words + source words
    
    // For MOCKUP: Let's assume spelling is perfect unless we see obvious non-words (e.g. "teh")
    // OR just randomization for demo purposes if we can't validate.
    // Let's implement a dummy "typo detector" for "teh", "recieve", etc.
    const commonTypos = ["teh", "recieve", "seperate", "occured", "until", "definately"];
    const typosFound = userWords.filter(w => commonTypos.includes(w)).length;
    
    if (typosFound > 3) spelling = 0;
    else if (typosFound > 0) spelling = 1;
    else spelling = 2;
    
    feedbackParts.push(`Spelling: ${spelling}/2.`);

    // 4. Grammar & Vocabulary
    // Difficult to check client-side without NLP.
    // We will base this on sentence structure complexity (avg word length, sentence length)
    
    // Avg word length
    const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / wordCount;
    if (avgWordLen > 5) vocabulary = 2;
    else if (avgWordLen > 4) vocabulary = 1;
    else vocabulary = 0;
    
    feedbackParts.push(`Vocabulary: ${vocabulary}/2.`);

    // Grammar: Check for capitalization and punctuation at basic level
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const validSentences = sentences.filter(s => {
        const trimmed = s.trim();
        return /^[A-Z]/.test(trimmed); // Starts with capital
    });
    
    const grammarErrors = sentences.length - validSentences.length;
    if (grammarErrors > 3) grammar = 0;
    else if (grammarErrors > 0) grammar = 1;
    else grammar = 2;
    
    feedbackParts.push(`Grammar: ${grammar}/2.`);

    return {
        overall: content + form + grammar + vocabulary + spelling,
        content,
        form,
        grammar,
        vocabulary,
        spelling,
        feedback: feedbackParts.join("\n")
    };
};

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
