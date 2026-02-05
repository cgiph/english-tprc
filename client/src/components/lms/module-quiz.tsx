
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
            <RadioGroup value={answers[questions[currentQuestion].id]?.toString()} onValueChange={handleSelect}>
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
