
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
