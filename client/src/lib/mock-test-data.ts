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
    title: "Climate Change",
    prompt: "What is the main warning given by scientists?",
    text: "The rapid acceleration of climate change has led to unpredictable weather patterns. Scientists warn that without immediate intervention, the consequences could be irreversible. Recent studies show that global temperatures have risen by an average of 1.1 degrees Celsius since pre-industrial times, with the past decade being the warmest on record. The melting of polar ice caps, rising sea levels, and increased frequency of extreme weather events are all indicators of this accelerating crisis.",
    options: ["Weather is becoming more predictable", "Immediate action is unnecessary", "Consequences may be permanent", "Scientists are optimistic"],
    correct: "Consequences may be permanent",
    correctAnswer: "Consequences may be permanent",
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

// Mock data for missing speaking types
const MOCK_ASQ: MockQuestion[] = [
  {
    id: "asq-1", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "What is the term for a period of ten years?",
    content: "What is the term for a period of ten years?", correct: "Decade", max_score: 1, time_limit_seconds: 10
  },
  {
    id: "asq-2", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "Which organ pumps blood through the body?",
    content: "Which organ pumps blood through the body?", correct: "Heart", max_score: 1, time_limit_seconds: 10
  },
  {
    id: "asq-3", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "What comes after Monday?",
    content: "What comes after Monday?", correct: "Tuesday", max_score: 1, time_limit_seconds: 10
  },
  {
    id: "asq-4", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "How many hours are there in a day?",
    content: "How many hours are there in a day?", correct: "24", max_score: 1, time_limit_seconds: 10
  },
  {
    id: "asq-5", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "What is the frozen form of water?",
    content: "What is the frozen form of water?", correct: "Ice", max_score: 1, time_limit_seconds: 10
  },
  {
    id: "asq-6", section: "Speaking", type: "Answer Short Question", title: "Answer Short Question",
    prompt: "Answer the question in one or a few words.", stimulus: "What do you use to unlock a door?",
    content: "What do you use to unlock a door?", correct: "Key", max_score: 1, time_limit_seconds: 10
  }
];

const MOCK_SGD: MockQuestion[] = [
  {
    id: "sgd-1", section: "Speaking", type: "Summarize Group Discussion", title: "Impact of AI on Education",
    prompt: "You will hear a group discussion. After the audio ends, summarize the main points in 60 seconds.", stimulus: "audio_placeholder",
    audioScript: "Moderator: Welcome everyone. Today we're discussing the integration of Artificial Intelligence in higher education. Professor Chen, let's start with you. Some argue AI tools are undermining critical thinking skills in students. What is your perspective on this growing concern? Professor Chen: That's a valid concern, but I believe it's a bit shortsighted. While there is a risk of students over-relying on AI for essay writing, the technology also offers unprecedented opportunities for personalized learning. AI tutors can provide 24/7 support, adapting to each student's pace and learning style in a way that a single human instructor simply cannot manage for a class of hundreds. The key is not banning these tools, but redesigning our assessment methods to focus on analysis and synthesis rather than rote information retrieval. Student Rep: As a student, I have to agree with Professor Chen. The reality is that we will be using these tools in the workforce. Ignoring them now puts us at a disadvantage later. However, I do worry about the equity issue. Premium AI tools are expensive. If universities don't provide access to everyone, we risk creating a two-tiered system where wealthy students have a significant technological edge over their peers who can't afford subscriptions. Moderator: That's an excellent point about the digital divide. Professor, how do universities address this cost barrier? Professor Chen: It's a challenge. Ideally, institutions should license these tools for all students, treating them like library resources. But budgets are tight. We might need to look at open-source alternatives or government grants to ensure a level playing field. Student Rep: Exactly. Also, we need more guidance on ethics. Many students are unsure about where the line is between assistance and plagiarism when using AI. Clearer policies would actually help us use these tools more responsibly.",
    max_score: 12, time_limit_seconds: 60
  },
  {
    id: "sgd-2", section: "Speaking", type: "Summarize Group Discussion", title: "University Funding Allocation",
    prompt: "You will hear a group discussion. After the audio ends, summarize the main points in 60 seconds.", stimulus: "audio_placeholder",
    audioScript: "Dean: We have received a significant government grant of $2 million, specifically earmarked for Campus Modernization. The board is split on how to best utilize these funds. One faction wants to build a new state-of-the-art sports complex to attract more undergraduates. The other side argues we should renovate the science laboratories, which are decades old. Head of Sciences: It shouldn't even be a debate. Our chemistry labs are a safety hazard at this point. Ventilation is poor, and equipment is outdated. We are losing top research grants because our facilities aren't up to standard. A sports complex is a luxury; safe and functional labs are a necessity for a research university. Athletics Director: I disagree with the characterization of sports as a luxury. Athletics brings in alumni donations and school spirit, which indirectly funds academics. Enrollment is down 5% this year. A new stadium would boost our visibility and appeal to prospective students who are looking for a holistic college experience, not just a degree factory. Dean: Both valid points. But we must consider the grant's stipulations. It mentions modernization. Could we potentially split the funds? Or perhaps renovate the labs now and launch a separate fundraising campaign for the sports complex? Head of Sciences: Splitting the money would result in two half-finished projects that satisfy no one. $1 million isn't enough to properly overhaul the labs. We need to prioritize academic integrity. If we can't do research, we aren't a university. Athletics Director: Maybe there's a compromise. What if we use the funds for the labs, but commit a percentage of future patent royalties from that research towards the athletics fund? That aligns our interests.",
    max_score: 12, time_limit_seconds: 60
  }
];

const MOCK_RTS: MockQuestion[] = [
  {
    id: "rts-1", section: "Speaking", type: "Respond to a Situation", title: "Hospital Visit",
    prompt: "Listen to the situation and respond appropriately in 40 seconds.", stimulus: "audio_placeholder",
    content: "Your friend is in the hospital after a minor surgery. You visit them during visiting hours. What would you say to comfort them and wish them a speedy recovery?",
    audioScript: "Your friend is in the hospital after a minor surgery. You visit them during visiting hours. What would you say to comfort them and wish them a speedy recovery?",
    max_score: 5, time_limit_seconds: 40
  },
  {
    id: "rts-2", section: "Speaking", type: "Respond to a Situation", title: "Late to Meeting",
    prompt: "Listen to the situation and respond appropriately in 40 seconds.", stimulus: "audio_placeholder",
    content: "You are 30 minutes late for an important team meeting with your manager. The delay was caused by unexpected traffic due to an accident on the highway. What would you say to your manager when you arrive?",
    audioScript: "You are 30 minutes late for an important team meeting with your manager. The delay was caused by unexpected traffic due to an accident on the highway. What would you say to your manager when you arrive?",
    max_score: 5, time_limit_seconds: 40
  },
  {
    id: "rts-3", section: "Speaking", type: "Respond to a Situation", title: "Cultural Festival Committee",
    prompt: "Listen to the situation and respond appropriately in 40 seconds.", stimulus: "audio_placeholder",
    content: "You're on a student committee organizing a cultural festival. One of the team members hasn't delivered their tasks, and the event is just a week away. You need to address this in the next team meeting without sounding aggressive. What would you say to the team?",
    audioScript: "You're on a student committee organizing a cultural festival. One of the team members hasn't delivered their tasks, and the event is just a week away. You need to address this in the next team meeting without sounding aggressive. What would you say to the team?",
    max_score: 5, time_limit_seconds: 40
  }
];


const SPEAKING_POOL: MockQuestion[] = [
  ...QUESTION_BANK.filter(q => q.section === "Speaking"),
  ...SPEAKING_QUESTIONS["Read Aloud"].map(q => ({ ...q, id: `ra-${Math.random()}`, section: "Speaking" as const, type: "Read Aloud", max_score: 15, title: q.title || "Read Aloud" })),
  ...SPEAKING_QUESTIONS["Repeat Sentence"].map(q => ({ ...q, id: `rs-${Math.random()}`, section: "Speaking" as const, type: "Repeat Sentence", max_score: 13, title: q.title || "Repeat Sentence" })),
  ...SPEAKING_QUESTIONS["Describe Image"].map(q => ({ ...q, id: `di-${Math.random()}`, section: "Speaking" as const, type: "Describe Image", max_score: 15, title: q.title || "Describe Image" })),
  ...SPEAKING_QUESTIONS["Retell Lecture"].map(q => ({ ...q, id: `rl-${Math.random()}`, section: "Speaking" as const, type: "Retell Lecture", max_score: 15, title: q.title || "Retell Lecture" })),
  ...MOCK_ASQ,
  ...MOCK_SGD,
  ...MOCK_RTS
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

  // Speaking Composition
  const ra = getQuestions(SPEAKING_POOL, "Read Aloud", 6);
  const rs = getQuestions(SPEAKING_POOL, "Repeat Sentence", 10);
  const di = getQuestions(SPEAKING_POOL, "Describe Image", 3);
  const rl = getQuestions(SPEAKING_POOL, "Retell Lecture", 1);
  const asq = getQuestions(SPEAKING_POOL, "Answer Short Question", 5);
  const sgd = getQuestions(SPEAKING_POOL, "Summarize Group Discussion", 1);
  const rts = getQuestions(SPEAKING_POOL, "Respond to a Situation", 1);
  
  const speaking = [...ra, ...rs, ...di, ...rl, ...asq, ...sgd, ...rts];

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
