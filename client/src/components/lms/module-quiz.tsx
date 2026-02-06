
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

// Mock Quiz Data for demo purposes
const MOCK_QUIZZES: Record<string, Question[]> = {
  "m1": [
    {
      id: "q1",
      text: "Which of the following is a proper noun?",
      options: ["city", "London", "country", "village"],
      correctAnswer: 1
    },
    {
      id: "q2",
      text: "Identify the verb: 'The cat sleeps on the mat.'",
      options: ["The", "cat", "sleeps", "mat"],
      correctAnswer: 2
    },
    {
      id: "q3",
      text: "Choose the correct sentence structure:",
      options: ["She apple eats.", "Eats apple she.", "She eats an apple.", "Apple she eats."],
      correctAnswer: 2
    },
    {
      id: "q4",
      text: "Which word is the subject? 'John drives a car.'",
      options: ["John", "drives", "a", "car"],
      correctAnswer: 0
    },
    {
      id: "q5",
      text: "Select the plural form of 'child'.",
      options: ["childs", "children", "childrens", "childes"],
      correctAnswer: 1
    }
  ],
  "m2": [
    {
      id: "m2q1",
      text: "Which of these is an Action Verb?",
      options: ["Happy", "Run", "Slowly", "Table"],
      correctAnswer: 1
    },
    {
      id: "m2q2",
      text: "Choose the correct Past Simple form of 'Go':",
      options: ["Goed", "Gone", "Went", "Going"],
      correctAnswer: 2
    },
    {
      id: "m2q3",
      text: "Which sentence uses the Present Simple correctly?",
      options: ["I works every day.", "He work every day.", "He works every day.", "I working every day."],
      correctAnswer: 2
    },
    {
      id: "m2q4",
      text: "What is the past tense of 'Make'?",
      options: ["Maked", "Made", "Make", "Making"],
      correctAnswer: 1
    },
    {
      id: "m2q5",
      text: "Complete: 'I ______ (to be) a welder.'",
      options: ["is", "am", "are", "be"],
      correctAnswer: 1
    }
  ],
  "m3": [
    {
      id: "m3q1",
      text: "Which greeting is most appropriate for a job interview?",
      options: ["What's up?", "Hi there.", "Good morning. I am pleased to meet you.", "Hey boss!"],
      correctAnswer: 2
    },
    {
      id: "m3q2",
      text: "In Western culture, a firm handshake usually indicates:",
      options: ["Aggression", "Confidence and respect", "Disrespect", "Nervousness"],
      correctAnswer: 1
    },
    {
      id: "m3q3",
      text: "Choose the correct informal introduction:",
      options: ["Allow me to introduce myself, I am Mr. Smith.", "Hi, I'm John. Nice to meet you.", "My name is Sir John Smith.", "I hereby introduce myself as John."],
      correctAnswer: 1
    },
    {
      id: "m3q4",
      text: "When should you use 'Good evening'?",
      options: ["At 8:00 AM", "At 12:00 PM", "At 3:00 PM", "After 6:00 PM"],
      correctAnswer: 3
    },
    {
      id: "m3q5",
      text: "What is a polite way to end a conversation?",
      options: ["I'm leaving now.", "Stop talking.", "It was nice talking to you. Have a great day!", "Bye."],
      correctAnswer: 2
    }
  ],
  "tw1": [
    {
      id: "wq1",
      text: "What is the primary purpose of a welding helmet's auto-darkening lens?",
      options: ["To look cool", "To protect eyes from UV/IR radiation", "To see in the dark", "To magnify the weld"],
      correctAnswer: 1
    },
    {
      id: "wq2",
      text: "Which shade of filter lens is generally recommended for most arc welding?",
      options: ["Shade 3-5", "Shade 5-8", "Shade 10-12", "Shade 14+"],
      correctAnswer: 2
    },
    {
      id: "wq3",
      text: "Why must welding gloves be kept dry?",
      options: ["To keep hands warm", "To prevent electric shock", "To avoid shrinking", "To maintain grip"],
      correctAnswer: 1
    },
    {
      id: "wq4",
      text: "What type of clothing material is safest for welding?",
      options: ["Synthetic / Polyester", "100% Cotton or Leather", "Nylon", "Rayon"],
      correctAnswer: 1
    },
    {
      id: "wq5",
      text: "Before welding on a container, what is the most critical safety step?",
      options: ["Paint it first", "Fill it with water", "Ensure it is cleaned of all flammable vapors", "Heat it up"],
      correctAnswer: 2
    }
  ],
  "pte-grammar": [
    {
       id: "pg-q1",
       text: "Complete the sentence: 'She has ______ the report.'",
       options: ["finish", "finished", "finishing", "finishes"],
       correctAnswer: 1
    },
    {
       id: "pg-q2",
       text: "Which is correct?",
       options: ["I decided to going", "I decided to go", "I decided to went", "I decided to goes"],
       correctAnswer: 1
    },
    {
       id: "pg-q3",
       text: "Choose the correct phrase:",
       options: ["Many problem", "Many problems", "Much problem", "Problems many"],
       correctAnswer: 1
    },
    {
       id: "pg-q4",
       text: "Complete: 'Thank you for ______ me.'",
       options: ["help", "helped", "helping", "to help"],
       correctAnswer: 2
    },
    {
       id: "pg-q5",
       text: "Identify the Adjective: 'A beautiful day'",
       options: ["A", "beautiful", "day", "None"],
       correctAnswer: 1
    }
  ],
  "pte-speaking": [
    {
       id: "pm1-q1",
       text: "In the 'Read Aloud' task, what should you do if you make a mistake?",
       options: ["Stop and correct yourself immediately", "Keep speaking naturally without stopping", "Restart the sentence", "Say 'sorry' and continue"],
       correctAnswer: 1
    },
    {
       id: "pm1-q2",
       text: "For 'Repeat Sentence', which strategy is most effective?",
       options: ["Memorize every single word", "Write down the whole sentence", "Focus on phrases and mimic intonation", "Close your eyes"],
       correctAnswer: 2
    },
    {
       id: "pm1-q3",
       text: "In 'Describe Image', what is the recommended structure?",
       options: ["Introduction, Body, Conclusion", "Just list numbers", "Read the title only", "Give your personal opinion"],
       correctAnswer: 0
    },
    {
       id: "pm1-q4",
       text: "How long is the preparation time for 'Describe Image'?",
       options: ["10 seconds", "25 seconds", "40 seconds", "1 minute"],
       correctAnswer: 1
    },
    {
       id: "pm1-q5",
       text: "What affects your Oral Fluency score the most?",
       options: ["Using big words", "Speaking very fast", "Smooth rhythm and phrasing without hesitations", "Having a British accent"],
       correctAnswer: 2
    }
  ],
  "pte-reading": [
     {
        id: "pm2-q1",
        text: "What is a 'collocation'?",
        options: ["A grammatical error", "Words that naturally go together (e.g., 'heavy rain')", "A type of punctuation", "A spelling mistake"],
        correctAnswer: 1
     },
     {
        id: "pm2-q2",
        text: "In Multiple Choice questions, what should you do first?",
        options: ["Read the whole text in detail", "Read the question stem to know what to look for", "Guess the answer", "Read the options first"],
        correctAnswer: 1
     },
     {
        id: "pm2-q3",
        text: "For 'Fill in the Blanks', how can grammar help?",
        options: ["It doesn't help", "It helps identify if a noun, verb, or adjective is needed", "It tells you the topic", "It makes reading slower"],
        correctAnswer: 1
     }
  ],
  "pte-writing": [
     {
        id: "pm3-q1",
        text: "What is the word limit for 'Summarize Spoken Text'?",
        options: ["20-30 words", "50-70 words", "100-200 words", "No limit"],
        correctAnswer: 1
     },
     {
        id: "pm3-q2",
        text: "In the Essay task, how many paragraphs are recommended?",
        options: ["1 long paragraph", "2 paragraphs", "4 paragraphs (Intro, Body 1, Body 2, Conclusion)", "10 bullet points"],
        correctAnswer: 2
     }
  ],
  "tmec3": [
    {
      id: "mq1",
      text: "What are the four strokes of a four-cycle engine?",
      options: ["Intake, Compression, Power, Exhaust", "Intake, Ignition, Power, Exhaust", "Intake, Compression, Combustion, Outlet", "Suction, Squeeze, Bang, Blow"],
      correctAnswer: 0
    },
    {
      id: "mq2",
      text: "Which component connects the piston to the crankshaft?",
      options: ["Camshaft", "Connecting Rod", "Push Rod", "Valve Spring"],
      correctAnswer: 1
    },
    {
      id: "mq3",
      text: "What is the function of the camshaft?",
      options: ["To cool the engine", "To open and close valves", "To ignite the fuel", "To lubricate the piston"],
      correctAnswer: 1
    },
    {
      id: "mq4",
      text: "If an engine runs rich, what does that mean?",
      options: ["Too much air, not enough fuel", "Too much fuel, not enough air", "Perfect mixture", "Low oil pressure"],
      correctAnswer: 1
    },
    {
      id: "mq5",
      text: "Which tool is used to measure cylinder bore diameter?",
      options: ["Micrometer", "Dial Bore Gauge", "Feeler Gauge", "Torque Wrench"],
      correctAnswer: 1
    }
  ],
  "tech-m1": [
    {
      id: "tq1",
      text: "Which of the following precision measurement tools is specifically designed to measure the gap width between two mechanical parts?",
      options: ["Vernier Caliper", "Micrometer", "Feeler Gauge", "Torque Wrench"],
      correctAnswer: 2
    },
    {
      id: "tq2",
      text: "In a technical manual, 'Prior to igniting the torch, ensure the regulator pressure does not exceed 15 psi' means:",
      options: ["Pressure must be exactly 15 psi", "Pressure must be 15 psi or lower", "Pressure should be higher than 15 psi", "Check pressure after ignition"],
      correctAnswer: 1
    },
    {
      id: "tq3",
      text: "Which piece of PPE protects a welder from 'flash burn'?",
      options: ["Respirator", "Insulated Gloves", "Auto-darkening Helmet", "Steel-toed Boots"],
      correctAnswer: 2
    },
    {
      id: "tq4",
      text: "Which word indicates a 'sequencing' step in a manual?",
      options: ["Subsequently", "Approximately", "Simultaneously", "Durable"],
      correctAnswer: 0
    },
    {
      id: "tq5",
      text: "What is 'Tacking' in a mechanical/welding context?",
      options: ["A permanent finish", "Measuring thickness", "Small, temporary welds", "Grinding surface rust"],
      correctAnswer: 2
    }
  ]
};

interface ModuleQuizProps {
  moduleId: string;
  moduleTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function ModuleQuiz({ moduleId, moduleTitle, isOpen, onClose, onComplete }: ModuleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = MOCK_QUIZZES[moduleId] || MOCK_QUIZZES["m1"]; // Fallback to m1 if not found

  const handleSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const passed = score >= 80;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{submitted ? "Quiz Results" : `${moduleTitle} Quiz`}</DialogTitle>
          <DialogDescription>
            {submitted 
              ? `You scored ${score}%. ${passed ? "Great job!" : "Review the material and try again."}`
              : `Question ${currentQuestion + 1} of ${questions.length}`
            }
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].text}</h3>
            {/* Key added to force re-render when question changes, clearing selection state visually */}
            <RadioGroup 
              key={currentQuestion}
              value={answers[questions[currentQuestion].id]?.toString() ?? ""} 
              onValueChange={handleSelect}
            >
              {questions[currentQuestion].options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2 p-2 rounded hover:bg-muted/50">
                  <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                  <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            {passed ? (
              <div className="bg-green-100 p-4 rounded-full text-green-600 mb-2">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            ) : (
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-2">
                <AlertCircle className="h-12 w-12" />
              </div>
            )}
            
            <div>
              <p className="text-2xl font-bold mb-1">{score}%</p>
              <p className="text-muted-foreground">
                {passed 
                  ? "Congratulations! You have unlocked the next module." 
                  : "You need 80% to pass. Please review the lessons and retake the quiz."}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {!submitted ? (
            <>
               <Button variant="ghost" onClick={onClose}>Cancel</Button>
               <Button onClick={handleNext} disabled={answers[questions[currentQuestion].id] === undefined}>
                 {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
               </Button>
            </>
          ) : (
            <>
              {!passed && (
                <Button variant="outline" onClick={resetQuiz} className="w-full sm:w-auto">
                  Retake Quiz
                </Button>
              )}
              <Button onClick={onClose} className="w-full sm:w-auto">
                {passed ? "Continue" : "Close"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
