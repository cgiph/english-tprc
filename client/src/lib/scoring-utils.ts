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
  isSimulated: boolean = false,
  hasSpeechDetected: boolean = true 
): SpeakingScore => {
  // Demo Mode: Always return a high "simulated" score for board presentation
  // unless duration is extremely short (< 1s)
  if (durationSeconds < 1) {
    return {
      overall: 10, content: 10, fluency: 10, pronunciation: 10,
      feedback: "No voice detected. Please speak clearly into the microphone."
    };
  }

  // Generate realistic passing scores for demo (65-90 range)
  const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const fluency = randomScore(65, 90);
  const pronunciation = randomScore(65, 90);
  const content = randomScore(70, 90);
  
  const overall = Math.round((content + fluency + pronunciation) / 3);

  let feedback = "";
  if (overall > 79) feedback = "Excellent response! Native-like fluency and pronunciation.";
  else feedback = "Good response. Clear articulation with minor hesitations.";

  return {
    overall,
    content,
    fluency,
    pronunciation,
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
