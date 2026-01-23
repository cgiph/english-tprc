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
    const keywords = Array.from(new Set(scriptWords.filter(w => w.length > 4 && !stopWords.includes(w))));
    
    const userWords: string[] = transcript.toLowerCase().match(/\b\w+\b/g) || [];
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

export interface SWTScore {
    overall: number;
    content: number;
    form: number;
    grammar: number;
    vocabulary: number;
    feedback: string;
}

export interface EssayScore {
    overall: number;
    content: number;
    form: number;
    structure: number;
    grammar: number;
    vocabulary: number;
    spelling: number;
    linguistic: number;
    feedback: string;
}

export const calculateSWTScore = (
    response: string,
    sourceText: string
): SWTScore => {
    let content = 2;
    let form = 1;
    let grammar = 2;
    let vocabulary = 2;
    let feedbackParts: string[] = [];

    // 1. Form: One single complete sentence, 5-75 words
    const words = response.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Check sentence count (approximate by punctuation)
    // PTE defines a sentence as ending with full stop, question mark or exclamation mark.
    // It must start with capital letter.
    const sentences = response.match(/[.!?]+/g);
    const sentenceCount = sentences ? sentences.length : 0;
    
    // Check if written in all caps
    const isAllCaps = response.length > 10 && response === response.toUpperCase();

    if (wordCount < 5 || wordCount > 75) {
        form = 0;
        feedbackParts.push(`Form: 0/1 (Word count ${wordCount} is outside 5-75 range).`);
    } else if (sentenceCount > 1) {
        form = 0;
        feedbackParts.push(`Form: 0/1 (Written in ${sentenceCount} sentences. Must be exactly 1).`);
    } else if (isAllCaps) {
        form = 0;
        feedbackParts.push(`Form: 0/1 (Written in capital letters).`);
    } else {
        feedbackParts.push(`Form: 1/1 (One sentence, correct length).`);
    }

    // If form is 0, usually other scores suffer, but strict 0 is only for word count extremes sometimes.
    // PTE rule: If form is 0, usually 0 for content too? 
    // Image says: "0 Not written in one single...". 
    // Let's keep other scores independent but maybe cap them?
    
    // 2. Content
    // Keyword matching
    const scriptWords: string[] = sourceText.toLowerCase().match(/\b\w+\b/g) || [];
    const stopWords = ["the", "and", "is", "in", "to", "of", "a", "it", "that", "on", "for", "with", "as", "are", "this", "be", "was", "at", "by", "an", "text", "passage"];
    const keywords = Array.from(new Set(scriptWords.filter(w => w.length > 4 && !stopWords.includes(w))));
    
    const userWords: string[] = response.toLowerCase().match(/\b\w+\b/g) || [];
    const matchedKeywords = keywords.filter(k => userWords.includes(k));
    const matchPercentage = matchedKeywords.length / Math.max(keywords.length, 1);

    if (matchPercentage > 0.3) content = 2;
    else if (matchPercentage > 0.1) content = 1;
    else content = 0;
    
    feedbackParts.push(`Content: ${content}/2 (${matchedKeywords.length} keywords matched).`);

    // 3. Grammar
    let grammarErrors = 0;
    
    // Check for capitalization
    if (!/^[A-Z]/.test(response.trim())) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Missing capital letter at start.`);
    }
    // Check for ending punctuation
    if (!/[.!?]$/.test(response.trim())) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Missing punctuation at end.`);
    }
    
    // Heuristic: Subject-Verb Agreement checks (very basic)
    // "Sleeping are" -> "Sleeping is"
    if (response.match(/\b(sleeping|reading|writing|listening|speaking)\s+are\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Subject-verb agreement error (Gerunds take singular verbs).`);
    }
    // "He/She/It have" -> "He/She/It has"
    if (response.match(/\b(he|she|it|one)\s+have\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Subject-verb agreement error (Third person singular).`);
    }
    
    if (grammarErrors > 3) {
        grammar = 0;
        feedbackParts.push(`Grammar: 0/2 (>3 grammatical errors found).`);
    } else if (grammarErrors > 0) {
        grammar = Math.max(0, 2 - grammarErrors); // Deduct points for errors? Or just 1?
        // Let's follow the "correct structure" = 2, "errors but no hindrance" = 1 logic from image
        // If errors > 0 but <= 3, give 1.
        grammar = 1;
        feedbackParts.push(`Grammar: 1/2 (${grammarErrors} grammatical errors).`);
    } else {
        grammar = 2;
        feedbackParts.push(`Grammar: 2/2 (No obvious grammatical errors).`);
    }


    // 4. Vocabulary
    // Check for connectors
    const connectors = ["and", "but", "so", "because", "however", "therefore", "although", "moreover", "furthermore", "nevertheless", "despite", "while", "whereas", "consequently", "thus", "hence"];
    const foundConnectors = connectors.filter(c => response.toLowerCase().includes(c));
    
    // Check if vocabulary is purely copied (excluding stopwords)
    // We already have userWords and scriptWords
    // Get unique non-stop words from user response
    const userUniqueWords: string[] = Array.from(new Set(userWords.filter(w => !stopWords.includes(w))));
    // Check how many of them are NOT in the source text
    const newWords = userUniqueWords.filter(w => !scriptWords.includes(w));
    
    // Logic: 
    // - If NO connectors -> -1
    // - If mostly copied (newWords count is very low, e.g. < 2) -> -1
    
    let vocabScore = 2;
    let vocabIssues = [];
    
    if (foundConnectors.length === 0) {
        vocabScore--;
        vocabIssues.push("No transitions/connectors used");
    }
    
    if (newWords.length < 2) {
         vocabScore--;
         vocabIssues.push("Vocabulary matches passage too closely (try using synonyms)");
    }
    
    vocabulary = Math.max(0, vocabScore);
    if (vocabulary < 2) {
        feedbackParts.push(`Vocabulary: ${vocabulary}/2 (${vocabIssues.join(", ")}).`);
    } else {
        feedbackParts.push(`Vocabulary: 2/2 (Good use of connectors and original vocabulary).`);
    }

    // 5. Spelling (Simulated for copied words)
    // If a word appears in the user text that is ALMOST a word in the passage but slightly different, mark it.
    // Or just use the standard typo list + heuristic
    const commonTypos = ["teh", "recieve", "seperate", "occured", "until", "definately", "its", "their", "buidling", "goverment"];
    let spellingErrors = userWords.filter(w => commonTypos.includes(w)).length;
    
    // Heuristic: Check for words from script that are misspelled in user text
    // (This is hard to distinguish from synonyms without Levenshtein distance, but let's try strict substring checks or just assume if it's not in script AND not in common words list, might be typo? Too risky for mockup).
    // Let's stick to the commonTypos list and maybe checking length?
    
    if (spellingErrors > 3) {
        // Deduct from grammar or vocab? User said "criteria for this should fall under vocabulary or grammar"
        // But usually there is a spelling trait? Wait, SWT image shows only Content, Form, Grammar, Vocab.
        // So Spelling errors > 3 should deduct from Vocabulary or Grammar.
        // Let's deduct from Vocabulary as per user hint.
        vocabulary = Math.max(0, vocabulary - 1);
        feedbackParts.push(`Vocabulary: -1 penalty for >3 spelling errors.`);
    }

    return {
        overall: content + form + grammar + vocabulary,
        content,
        form,
        grammar,
        vocabulary,
        feedback: feedbackParts.join("\n")
    };
};

export const calculateEssayScore = (
    response: string,
    topic: string
): EssayScore => {
    let content = 3;
    let form = 2;
    let structure = 2;
    let grammar = 2;
    let vocabulary = 2;
    let spelling = 2;
    let linguistic = 2;
    let feedbackParts: string[] = [];

    const words = response.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Form (Word Count)
    // 2 pts: 200-300
    // 1 pt: 120-199 OR 301-380
    // 0 pts: <120 OR >380
    if (wordCount >= 200 && wordCount <= 300) {
        form = 2;
        feedbackParts.push(`Form: 2/2 (Length is perfect).`);
    } else if ((wordCount >= 120 && wordCount < 200) || (wordCount > 300 && wordCount <= 380)) {
        form = 1;
        feedbackParts.push(`Form: 1/2 (Length ${wordCount} is acceptable but not optimal).`);
    } else {
        form = 0;
        feedbackParts.push(`Form: 0/2 (Length ${wordCount} is critically off target).`);
    }

    // 2. Content
    // Match topic keywords
    const topicKeywords = topic.toLowerCase().match(/\b\w+\b/g) || [];
    const importantTopicWords = topicKeywords.filter(w => w.length > 4);
    const userText = response.toLowerCase();
    
    const mentionedTopicWords = importantTopicWords.filter(w => userText.includes(w));
    
    // Stricter Content logic based on word count & relevance
    if (wordCount < 50) {
        content = 0; // Too short to be relevant
        feedbackParts.push(`Content: 0/3 (Response is too short to be relevant).`);
    } else if (wordCount < 100) {
        content = 1; // Underdeveloped
        feedbackParts.push(`Content: 1/3 (Ideas are very limited and underdeveloped).`);
    } else if (importantTopicWords.length > 0 && mentionedTopicWords.length === 0) {
        content = 1;
        feedbackParts.push(`Content: 1/3 (You barely mentioned the topic keywords).`);
    } else if (wordCount < 150) {
        content = 2; // Relevant but maybe lacks depth
        feedbackParts.push(`Content: 2/3 (Relevant to topic, but could be more developed).`);
    } else {
        feedbackParts.push(`Content: 3/3 (Relevant to topic and well developed).`);
    }

    // 3. Structure
    // Check paragraphs (newlines)
    const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length < 2) {
        structure = 0;
        feedbackParts.push(`Structure: 0/2 (No paragraph structure detected).`);
    } else if (paragraphs.length < 3) {
        structure = 1;
        feedbackParts.push(`Structure: 1/2 (Basic separation, but lacks clear Intro/Body/Conclusion structure).`);
    } else {
        feedbackParts.push(`Structure: 2/2 (Good paragraph structure).`);
    }

    // 4. Grammar
    let grammarErrors = 0;
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    
    // Check capitalization for EVERY sentence
    sentences.forEach(s => {
        if (!/^[A-Z]/.test(s.trim())) grammarErrors++;
    });

    // Subject-verb agreement heuristics
    if (response.match(/\b(sleeping|reading|writing|listening|speaking|technology|education)\s+are\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Subject-verb agreement error (Singular subject + 'are').`);
    }
    if (response.match(/\b(computers|schools|people|they|we)\s+is\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Subject-verb agreement error (Plural subject + 'is').`);
    }
    // "more improve" -> "more improvement" or "improve more"
    if (response.match(/\bmore\s+improve\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Incorrect usage "more improve".`);
    }
    
    // Article/Preposition check (very rough heuristic)
    // "use in global world" -> "use in the global world"
    if (response.match(/\bin\s+global\s+world\b/i)) {
        grammarErrors++;
        feedbackParts.push(`Grammar: Missing article "the global world".`);
    }

    if (grammarErrors > 2) {
        grammar = 0;
        feedbackParts.push(`Grammar: 0/2 (Multiple grammatical issues including sentence structure and capitalization).`);
    } else if (grammarErrors > 0) {
        grammar = 1;
        feedbackParts.push(`Grammar: 1/2 (${grammarErrors} grammatical errors found).`);
    } else {
        feedbackParts.push(`Grammar: 2/2 (Good grammatical control).`);
    }


    // 5. Vocabulary
    // Check for "basic" words
    const basicWords = ["good", "bad", "thing", "stuff", "lot", "many", "computer", "use"];
    const usedBasicWords = words.filter(w => basicWords.includes(w.toLowerCase()));
    
    // Check for "academic" words (simple list)
    const academicWords = ["significantly", "furthermore", "consequently", "nevertheless", "aspect", "impact", "perspective", "analyze", "demonstrate"];
    const usedAcademicWords = words.filter(w => academicWords.includes(w.toLowerCase()));

    if (wordCount < 100) {
        vocabulary = 1;
        feedbackParts.push(`Vocabulary: 1/2 (Vocabulary is limited due to short length).`);
    } else if (usedAcademicWords.length < 2 && usedBasicWords.length > 5) {
        vocabulary = 1;
        feedbackParts.push(`Vocabulary: 1/2 (Vocabulary is basic and repetitive. Use more academic expressions).`);
    } else {
        feedbackParts.push(`Vocabulary: 2/2 (Good range of vocabulary).`);
    }

    // 6. Linguistic Range (Sentence Complexity)
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);
    const complexIndicators = ["which", "that", "although", "because", "while", "since", "however"];
    const complexityScore = sentences.filter(s => complexIndicators.some(i => s.toLowerCase().includes(i))).length;
    
    if (wordCount < 100 || avgSentenceLength < 10) {
        linguistic = 1;
        feedbackParts.push(`Linguistic Range: 1/2 (Sentences are mostly simple/short. Use complex structures).`);
    } else if (complexityScore < 2) {
        linguistic = 1;
        feedbackParts.push(`Linguistic Range: 1/2 (Limited use of complex or compound sentences).`);
    } else {
        feedbackParts.push(`Linguistic Range: 2/2 (Good variety of sentence structures).`);
    }

    // 7. Spelling
    const commonTypos = ["teh", "recieve", "seperate", "occured", "until", "definately", "its", "their", "positve", "buidling", "goverment"];
    const typosFound = words.filter(w => commonTypos.includes(w.toLowerCase())).length;
    
    if (typosFound > 1) {
        spelling = 0;
        feedbackParts.push(`Spelling: 0/2 (>1 spelling errors detected).`);
    } else if (typosFound > 0) {
        spelling = 1;
        feedbackParts.push(`Spelling: 1/2 (1 spelling error detected).`);
    } else {
         feedbackParts.push(`Spelling: 2/2 (No obvious errors).`);
    }

    // Add Key Advice
    feedbackParts.push(`\nKEY ADVICE TO IMPROVE:`);
    feedbackParts.push(`- Always write 200–300 words.`);
    feedbackParts.push(`- Use a clear 4-paragraph structure (Intro, Body 1, Body 2, Conclusion).`);
    feedbackParts.push(`- Include specific examples to support your ideas.`);
    feedbackParts.push(`- Use more academic vocabulary (e.g., "significantly" instead of "a lot").`);
    feedbackParts.push(`- Check capital letters and sentence grammar carefully.`);

    return {
        overall: content + form + structure + grammar + vocabulary + spelling + linguistic,
        content,
        form,
        structure,
        grammar,
        vocabulary,
        spelling,
        linguistic,
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
