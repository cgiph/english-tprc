import { LISTENING_DATA } from "./listening-data";
import { READING_QUESTIONS } from "./reading-data";
import { SPEAKING_QUESTIONS } from "./speaking-data";

// Flatten the categorized data into a single pool for the mock test
export type MockQuestion = {
  id: string;
  section: "Speaking" | "Writing" | "Reading" | "Listening";
  type: string;
  title: string;
  content?: string; // For Speaking/Reading
  stimulus?: string; // Standardized field for text/content
  text?: string; // For Reading
  audioScript?: string; // For Listening/Speaking
  imageUrl?: string; // For Describe Image
  prompt?: string; // For SST, etc.
  options?: string[]; 
  correctAnswer?: any;
  correct?: any; // Standardized field for correct answer
  max_score: number;
  time_limit_seconds?: number;
  // New fields for complex types
  paragraphs?: { id: string; text: string; correctOrder: number }[]; // For Reorder Paragraphs
  blanks?: { index: number; correct: string; options?: string[] }[]; // For FIB
};

// User provided question bank
const QUESTION_BANK: MockQuestion[] = [
  {
    id: "Q001",
    section: "Speaking",
    type: "Read Aloud",
    title: "Technology Communication",
    prompt: "Read the following text aloud.",
    stimulus: "Technology has rapidly transformed the way people communicate.",
    content: "Technology has rapidly transformed the way people communicate.", // Mapping for UI
    time_limit_seconds: 40,
    max_score: 5
  },
  {
    id: "Q002",
    section: "Reading",
    type: "Multiple Choice (Single)",
    title: "Main Idea",
    prompt: "What is the main idea of the passage?",
    text: "Passage text would go here...", // Placeholder for context
    options: ["Option A", "Option B", "Option C"],
    correct: "Option B",
    correctAnswer: "Option B", // Mapping for UI
    time_limit_seconds: 90,
    max_score: 2
  },
  {
    id: "Q003",
    section: "Listening",
    type: "Fill in the Blanks", // Changed from FillBlank to match UI
    title: "Innovation Audio",
    prompt: "Fill in the missing word you hear.",
    stimulus: "audio_url_placeholder",
    audioScript: "The key to success is often innovation.", // Mock script for audio
    correct: "innovation",
    correctAnswer: "innovation", // Mapping for UI
    time_limit_seconds: 30,
    max_score: 2
  },
  {
    id: "Q001",
    section: "Speaking",
    type: "Read Aloud",
    title: "Technology Communication",
    prompt: "Read the following text aloud.",
    stimulus: "Technology has rapidly transformed the way people communicate.",
    content: "Technology has rapidly transformed the way people communicate.", // Mapping for UI
    time_limit_seconds: 40,
    max_score: 5
  },
  {
    id: "Q002",
    section: "Reading",
    type: "Multiple Choice (Single)",
    title: "Main Idea",
    prompt: "What is the main idea of the passage?",
    text: "Passage text would go here...", // Placeholder for context
    options: ["Option A", "Option B", "Option C"],
    correct: "Option B",
    correctAnswer: "Option B", // Mapping for UI
    time_limit_seconds: 90,
    max_score: 2
  },
  {
    id: "Q003",
    section: "Listening",
    type: "Fill in the Blanks", // Changed from FillBlank to match UI
    title: "Innovation Audio",
    prompt: "Fill in the missing word you hear.",
    stimulus: "audio_url_placeholder",
    audioScript: "The key to success is often innovation.", // Mock script for audio
    correct: "innovation",
    correctAnswer: "innovation", // Mapping for UI
    time_limit_seconds: 30,
    max_score: 2
  }
];

const SPEAKING_POOL: MockQuestion[] = [
  ...QUESTION_BANK.filter(q => q.section === "Speaking"),
  ...SPEAKING_QUESTIONS["Read Aloud"].map(q => ({ ...q, id: `ra-${Math.random()}`, section: "Speaking" as const, type: "Read Aloud", max_score: 15, title: q.title || "Read Aloud" })),
  ...SPEAKING_QUESTIONS["Repeat Sentence"].map(q => ({ ...q, id: `rs-${Math.random()}`, section: "Speaking" as const, type: "Repeat Sentence", max_score: 13, title: q.title || "Repeat Sentence" })),
  ...SPEAKING_QUESTIONS["Describe Image"].map(q => ({ ...q, id: `di-${Math.random()}`, section: "Speaking" as const, type: "Describe Image", max_score: 15, title: q.title || "Describe Image" })),
  ...SPEAKING_QUESTIONS["Retell Lecture"].map(q => ({ ...q, id: `rl-${Math.random()}`, section: "Speaking" as const, type: "Retell Lecture", max_score: 15, title: q.title || "Retell Lecture" })),
];

const WRITING_POOL: MockQuestion[] = [
  {
    id: "swt-1",
    section: "Writing",
    type: "Summarize Written Text",
    title: "Coffee History",
    content: "Coffee was first discovered in Eastern Africa in an area we know today as Ethiopia. A popular legend refers to a goat herder by the name of Kaldi, who observed his goats becoming unusually frisky after eating berries from a certain tree. Curious about this phenomenon, Kaldi tried the berries himself and found that they gave him a renewed energy. The news of this energy-laden fruit quickly spread throughout the region. Monks hearing about this amazing fruit dried the berries so that they could be transported to distant monasteries. They reconstituted these berries in water, ate the fruit, and drank the liquid to provide stimulation for a more awakened time of prayer.",
    max_score: 7,
    time_limit_seconds: 600
  },
  {
    id: "we-1",
    section: "Writing",
    type: "Write Essay",
    title: "Remote Work",
    content: "It is often argued that working from home is more productive than working in an office. Others believe that the office environment is essential for collaboration and company culture. Discuss both views and give your own opinion. Support your answer with relevant examples from your own knowledge or experience.",
    max_score: 15,
    time_limit_seconds: 1200
  }
];

const READING_POOL: MockQuestion[] = [
  ...QUESTION_BANK.filter(q => q.section === "Reading"),
  ...READING_QUESTIONS["Multiple Choice (Single)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Single)", max_score: 1 })),
  ...READING_QUESTIONS["Multiple Choice (Multiple)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Multiple)", max_score: 2 })),
  ...READING_QUESTIONS["R&W Fill in the Blanks"].map(q => ({ ...q, section: "Reading" as const, type: "R&W Fill in the Blanks", max_score: 5 })),
  ...READING_QUESTIONS["Reorder Paragraphs"].map(q => ({ ...q, section: "Reading" as const, type: "Reorder Paragraphs", max_score: 4 })),
  ...READING_QUESTIONS["Reading Fill in the Blanks"].map(q => ({ ...q, section: "Reading" as const, type: "Reading Fill in the Blanks", max_score: 5 })),
];

// Define new Listening Types based on request if not present
// Highlight Correct Summary, Select Missing Word are in LISTENING_DATA?
// Checking LISTENING_DATA: SST, MC-MA, FIB-L, MC-SA, SMW, HIW, WFD.
// Highlight Correct Summary (HCS) is MISSING in LISTENING_DATA export? Let's check listening-data.ts content first.
// Wait, I previously read listening-data.ts and it had: SST, MC-MA, FIB-L, MC-SA, SMW, HIW, WFD.
// "Highlight Correct Summary" corresponds to HCS (not present in listening-data.ts previously created).
// "Select Missing Word" corresponds to SMW (present).

// I will mock HCS here directly in the pool since I cannot edit listening-data.ts easily without potentially breaking other things, or I can extend it.
// The user wants:
// 2 SST (10m)
// 2 MC-MA (2m)
// 3 FIB-L (2m)
// 2 Highlight Correct Summary (2m) -> New
// 2 Select Missing Word (2m) -> SMW
// 3 Highlight Incorrect Words (2-3m) -> HIW
// 4 Write From Dictation (2-3m) -> WFD

// I will add mock HCS questions to the LISTENING_POOL locally here.

const MOCK_HCS: MockQuestion[] = [
  {
    id: "hcs-1",
    section: "Listening",
    type: "Highlight Correct Summary",
    title: "Climate Change Summary",
    prompt: "Highlight the summary that best matches the recording.",
    audioScript: "Climate change is accelerating due to human activities...",
    options: ["Summary A: It is natural.", "Summary B: It is human-caused and accelerating.", "Summary C: It is slowing down."],
    correctAnswer: "Summary B: It is human-caused and accelerating.",
    max_score: 1,
    time_limit_seconds: 120
  },
  {
    id: "hcs-2",
    section: "Listening",
    type: "Highlight Correct Summary",
    title: "Economic Policy Summary",
    prompt: "Highlight the summary that best matches the recording.",
    audioScript: "Inflation targeting is a key central bank policy...",
    options: ["Summary A: Banks ignore inflation.", "Summary B: Banks target employment only.", "Summary C: Banks use inflation targeting."],
    correctAnswer: "Summary C: Banks use inflation targeting.",
    max_score: 1,
    time_limit_seconds: 120
  }
];

const LISTENING_POOL: MockQuestion[] = [
   ...QUESTION_BANK.filter(q => q.section === "Listening"),
   ...LISTENING_DATA.map(q => ({
    ...q,
    section: "Listening" as const,
    // Map types to user friendly names if needed or keep codes
    // SST -> Summarize Spoken Text
    // MC-MA -> Multiple Choice, Multiple Answers
    // FIB-L -> Fill in the Blanks (Listening)
    // MC-SA -> Multiple Choice, Single Answer
    // SMW -> Select Missing Word
    // HIW -> Highlight Incorrect Words
    // WFD -> Write From Dictation
    type: q.type === "SST" ? "Summarize Spoken Text" :
          q.type === "MC-MA" ? "Multiple Choice, Multiple Answers" :
          q.type === "FIB-L" ? "Fill in the Blanks (Listening)" :
          q.type === "MC-SA" ? "Multiple Choice, Single Answer" :
          q.type === "SMW" ? "Select Missing Word" :
          q.type === "HIW" ? "Highlight Incorrect Words" :
          q.type === "WFD" ? "Write From Dictation" : q.type,
    max_score: q.type === "WFD" || q.type === "SST" ? 10 : 1,
    time_limit_seconds: q.type === "SST" ? 600 : // 10 mins
                        q.type === "MC-MA" ? 120 : // 2 mins
                        q.type === "FIB-L" ? 120 : // 2 mins
                        q.type === "SMW" ? 120 : // 2 mins
                        q.type === "HIW" ? 180 : // 3 mins
                        q.type === "WFD" ? 180 : // 3 mins
                        120 // Default
  })),
  ...MOCK_HCS
];

export const ALL_QUESTIONS = [
  ...SPEAKING_POOL,
  ...WRITING_POOL,
  ...READING_POOL,
  ...LISTENING_POOL
];

export function generateMockTest(section?: string, count = 10) {
  // If specific section is requested, filter.
  // If Full Mock Test (undefined section), we need to construct the SPECIFIC composition requested.
  
  if (section) {
    const pool = ALL_QUESTIONS.filter(q => q.section === section);
    return {
      test_id: 'test_' + Date.now(),
      items: pool.sort(() => Math.random() - 0.5).slice(0, count),
      start_time: Date.now()
    };
  }

  // Full Mock Test Composition Logic
  const getQuestions = (pool: MockQuestion[], type: string, n: number) => {
    const filtered = pool.filter(q => q.type === type);
    return filtered.sort(() => Math.random() - 0.5).slice(0, n);
  };

  // Listening Composition
  const sst = getQuestions(LISTENING_POOL, "Summarize Spoken Text", 2);
  const mcma = getQuestions(LISTENING_POOL, "Multiple Choice, Multiple Answers", 2);
  const fib = getQuestions(LISTENING_POOL, "Fill in the Blanks (Listening)", 3);
  const hcs = getQuestions(LISTENING_POOL, "Highlight Correct Summary", 2);
  const smw = getQuestions(LISTENING_POOL, "Select Missing Word", 2);
  const hiw = getQuestions(LISTENING_POOL, "Highlight Incorrect Words", 3);
  const wfd = getQuestions(LISTENING_POOL, "Write From Dictation", 4);

  // Other sections (simplified for now based on previous request, but Listening is specific)
  // We'll just grab some randoms for others to fill the mock
  const speaking = SPEAKING_POOL.slice(0, 10); // Placeholder count
  const writing = WRITING_POOL.slice(0, 2);
  const reading = READING_POOL.slice(0, 10);

  const items = [
    ...speaking,
    ...writing,
    ...reading,
    ...sst, ...mcma, ...fib, ...hcs, ...smw, ...hiw, ...wfd
  ];

  return {
    test_id: 'test_' + Date.now(),
    items: items,
    start_time: Date.now()
  };
}
