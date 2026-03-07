import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  type: "date" | "number" | "name" | "reason";
  correctAnswer: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: "date",
    text: "When will the tariffs on Denmark, Germany, and others start?",
    options: ["First of February", "In June", "On Saturday", "Last year"],
    correctAnswer: "First of February"
  },
  {
    id: 2,
    type: "number",
    text: "What percentage will the levy increase to in June?",
    options: ["10 per cent", "25 per cent", "50 per cent", "100 per cent"],
    correctAnswer: "25 per cent"
  },
  {
    id: 3,
    type: "name",
    text: "Who said applying tariffs on allies is 'completely wrong'?",
    options: ["President Donald Trump", "Officials sent to Greenland", "UK Prime Minister Sir Keir Starmer", "Protesters in Nuuk"],
    correctAnswer: "UK Prime Minister Sir Keir Starmer"
  },
  {
    id: 4,
    type: "reason",
    text: "Why did Trump stress that national security is at stake?",
    options: ["Greenland is not for sale", "To protect global peace", "Because China and Russia want Greenland", "To pursue collective security of NATO"],
    correctAnswer: "Because China and Russia want Greenland"
  }
];

export function IeltsReadingPractice({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds total for the exercise
  const [timerActive, setTimerActive] = useState(false);

  const currentQ = QUESTIONS[currentQIndex];
  const isLastQuestion = currentQIndex === QUESTIONS.length - 1;

  // Timer logic
  useState(() => {
     let interval: NodeJS.Timeout;
     if (timerActive && timeLeft > 0) {
        interval = setInterval(() => {
           setTimeLeft(prev => prev - 1);
        }, 1000);
     } else if (timeLeft === 0 && !hasSubmitted) {
        // Auto-submit if time runs out
        setHasSubmitted(true);
     }
     return () => clearInterval(interval);
  }, [timerActive, timeLeft, hasSubmitted]);

  const startQuiz = () => {
     setTimerActive(true);
  };

  const selectOption = (option: string) => {
    if (hasSubmitted) return;
    setSelectedOption(option);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    
    if (selectedOption === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
    setHasSubmitted(true);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onComplete(true);
    } else {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  if (!timerActive) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 w-full max-w-4xl mx-auto">
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-200">
                  <Search className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Scanning Practice Quiz</h2>
                  <p className="text-slate-600 mb-8 text-lg">
                      You have <strong>45 seconds</strong> to answer 4 questions by scanning the text. 
                      Look quickly for specific information: dates, numbers, names, and reasons.
                  </p>
                  <Button onClick={startQuiz} size="lg" className="px-10 py-6 text-xl bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                      Start Scanning Quiz
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 w-full max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {currentQIndex + 1}
              </span>
              Find the {currentQ.type}
            </h2>
          </div>
          <div className="flex items-center gap-6 text-right">
             <div className={cn("flex items-center gap-2 font-bold text-lg", timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-yellow-400")}>
                <Clock className="w-5 h-5" />
                {timeLeft}s
             </div>
             <div>
                 <div className="text-2xl font-bold text-blue-400">{score}/{QUESTIONS.length}</div>
                 <div className="text-xs text-slate-500 uppercase font-bold">Score</div>
             </div>
          </div>
        </div>

        <div className="p-8 min-h-[250px] flex flex-col justify-center bg-slate-50">
          <h3 className="text-xl text-slate-800 font-medium mb-8 text-center">{currentQ.text}</h3>
          
          <div className="grid gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQ.correctAnswer;
              
              let stateClass = "bg-white border-slate-200 hover:border-blue-300 text-slate-700";
              
              if (hasSubmitted) {
                if (isCorrect) {
                   stateClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                } else if (isSelected && !isCorrect) {
                   stateClass = "bg-red-100 border-red-500 text-red-800 opacity-70";
                } else {
                   stateClass = "opacity-50";
                }
              } else if (isSelected) {
                stateClass = "bg-blue-100 border-blue-600 text-blue-900 shadow-sm";
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "px-6 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer font-medium text-left",
                    stateClass
                  )}
                  disabled={hasSubmitted}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {hasSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center border-t border-slate-200 pt-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  {selectedOption === currentQ.correctAnswer ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <CheckCircle2 className="w-5 h-5" /> Correct!
                    </div>
                  ) : (
                     <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full border border-red-200">
                        <XCircle className="w-5 h-5" /> {timeLeft === 0 && !selectedOption ? "Time's up!" : "Incorrect"}
                     </div>
                  )}
                </div>

                <Button onClick={nextQuestion} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                  {isLastQuestion ? "Finish Quiz" : "Next Question"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!hasSubmitted && (
          <div className="bg-white p-4 border-t border-slate-100 flex justify-end items-center">
            <Button onClick={checkAnswer} disabled={!selectedOption} className="px-8 bg-slate-900 text-white hover:bg-slate-800">
              Submit Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
