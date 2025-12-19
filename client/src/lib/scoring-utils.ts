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
  hasSpeechDetected: boolean = true // Default to true for backward compatibility if not passed, but we pass it now
): SpeakingScore => {
  // If duration is effectively zero or very short (no recording), return 0 score
  // OR if no speech was detected by VAD
  if (durationSeconds < 3 || !hasSpeechDetected) {
    return {
      overall: 0,
      content: 10,
      fluency: 10,
      pronunciation: 10,
      feedback: !hasSpeechDetected 
        ? "No voice detected. Please speak clearly into the microphone." 
        : "Recording was too short. Please try again."
    };
  }

  // Base randomness for prototype
  const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Logic based on duration (if too short, score penalty)
  let durationFactor = 1;
  if (durationSeconds < 5) durationFactor = 0.3; // Significantly penalize very short answers
  else if (durationSeconds < 10) durationFactor = 0.5;
  else if (durationSeconds < 20) durationFactor = 0.8;

  // Generate scores (0-90 scale like PTE)
  // In a real app, this would use AI speech analysis
  let fluency = randomScore(40, 90);
  let pronunciation = randomScore(40, 90);
  let content = randomScore(50, 90);

  // Apply duration penalty
  content = Math.round(content * durationFactor);
  fluency = Math.round(fluency * Math.min(1, durationFactor + 0.2));
  
  // Calculate overall based on PTE-like weights (approximate)
  // Fluency and Pronunciation are key for Speaking
  const overall = Math.round((content + fluency + pronunciation) / 3);

  let feedback = "";
  if (overall > 80) feedback = "Excellent response! Your fluency and pronunciation are native-like.";
  else if (overall > 65) feedback = "Good response. Try to minimize pauses to improve fluency.";
  else if (overall > 50) feedback = "Average response. Focus on clear articulation and continuous speech.";
  else feedback = "Response was too short or unclear. Please try again and speak for longer.";

  // Safety floor for scores if penalty was harsh
  if (durationSeconds < 5) {
      feedback = "Response too short. Elaborate more to improve your score.";
  }

  return {
    overall: Math.max(10, overall), // PTE minimum is usually 10
    content: Math.max(10, content),
    fluency: Math.max(10, fluency),
    pronunciation: Math.max(10, pronunciation),
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
