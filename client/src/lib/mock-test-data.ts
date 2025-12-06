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
  text?: string; // For Reading
  audioScript?: string; // For Listening/Speaking
  imageUrl?: string; // For Describe Image
  prompt?: string; // For SST, etc.
  options?: string[]; 
  correctAnswer?: any;
  max_score: number;
};

const SPEAKING_POOL: MockQuestion[] = [
  ...SPEAKING_QUESTIONS["Read Aloud"].map(q => ({ ...q, id: `ra-${Math.random()}`, section: "Speaking" as const, type: "Read Aloud", max_score: 15 })),
  ...SPEAKING_QUESTIONS["Repeat Sentence"].map(q => ({ ...q, id: `rs-${Math.random()}`, section: "Speaking" as const, type: "Repeat Sentence", max_score: 13 })),
  ...SPEAKING_QUESTIONS["Describe Image"].map(q => ({ ...q, id: `di-${Math.random()}`, section: "Speaking" as const, type: "Describe Image", max_score: 15 })),
  ...SPEAKING_QUESTIONS["Retell Lecture"].map(q => ({ ...q, id: `rl-${Math.random()}`, section: "Speaking" as const, type: "Retell Lecture", max_score: 15 })),
];

// Mock writing questions since we didn't implement a dedicated writing page yet
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
  ...READING_QUESTIONS["Multiple Choice (Single)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Single)", max_score: 1 })),
  ...READING_QUESTIONS["Multiple Choice (Multiple)"].map(q => ({ ...q, section: "Reading" as const, type: "Multiple Choice (Multiple)", max_score: 2 })),
  ...READING_QUESTIONS["R&W Fill in the Blanks"].map(q => ({ ...q, section: "Reading" as const, type: "R&W Fill in the Blanks", max_score: 5 })),
];

const LISTENING_POOL: MockQuestion[] = LISTENING_DATA.map(q => ({
  ...q,
  section: "Listening" as const,
  max_score: q.type === "WFD" || q.type === "SST" ? 10 : 1
}));

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
