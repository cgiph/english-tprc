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
    content: "Coffee was first discovered in Ethiopia... (Mock text for summary)",
    max_score: 7
  },
  {
    id: "we-1",
    section: "Writing",
    type: "Write Essay",
    title: "Remote Work",
    content: "Do you think remote work is beneficial for society? Discuss.",
    max_score: 15
  }
];

const READING_POOL: MockQuestion[] = [
  ...QUESTION_BANK.filter(q => q.section === "Reading"),
  ...READING_QUESTIONS["Multiple Choice (Single)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Single)", max_score: 1 })),
  ...READING_QUESTIONS["Multiple Choice (Multiple)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Multiple)", max_score: 2 })),
  ...READING_QUESTIONS["R&W Fill in the Blanks"].map(q => ({ ...q, section: "Reading" as const, type: "R&W Fill in the Blanks", max_score: 5 })),
];

const LISTENING_POOL: MockQuestion[] = [
   ...QUESTION_BANK.filter(q => q.section === "Listening"),
   ...LISTENING_DATA.map(q => ({
    ...q,
    section: "Listening" as const,
    max_score: q.type === "WFD" || q.type === "SST" ? 10 : 1
  }))
];

export const ALL_QUESTIONS = [
  ...SPEAKING_POOL,
  ...WRITING_POOL,
  ...READING_POOL,
  ...LISTENING_POOL
];

export function generateMockTest(section?: string, count = 10) {
  const pool = section 
    ? ALL_QUESTIONS.filter(q => q.section === section)
    : ALL_QUESTIONS;
    
  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  
  return {
    test_id: 'test_' + Date.now(),
    items: shuffled,
    start_time: Date.now()
  };
}
