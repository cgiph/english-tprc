import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  words: { text: string; isNoun: boolean }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "The cat sleeps on the soft mat.",
    words: [
      { text: "The", isNoun: false },
      { text: "cat", isNoun: true },
      { text: "sleeps", isNoun: false },
      { text: "on", isNoun: false },
      { text: "the", isNoun: false },
      { text: "soft", isNoun: false },
      { text: "mat", isNoun: true },
      { text: ".", isNoun: false },
    ]
  },
  {
    id: 2,
    text: "John drives a fast red car.",
    words: [
      { text: "John", isNoun: true },
      { text: "drives", isNoun: false },
      { text: "a", isNoun: false },
      { text: "fast", isNoun: false },
      { text: "red", isNoun: false },
      { text: "car", isNoun: true },
      { text: ".", isNoun: false },
    ]
  },
  {
    id: 3,
    text: "Beauty is in the eye of the beholder.",
    words: [
      { text: "Beauty", isNoun: true },
      { text: "is", isNoun: false },
      { text: "in", isNoun: false },
      { text: "the", isNoun: false },
      { text: "eye", isNoun: true },
      { text: "of", isNoun: false },
      { text: "the", isNoun: false },
      { text: "beholder", isNoun: true },
      { text: ".", isNoun: false },
    ]
  }
];

export function NounPractice({ onComplete }: { onComplete: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUESTIONS[currentQIndex];
  const isLastQuestion = currentQIndex === QUESTIONS.length - 1;

  const toggleWord = (index: number) => {
    if (hasSubmitted) return;
    setSelectedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const checkAnswer = () => {
    const correctIndices = currentQ.words
      .map((w, i) => w.isNoun ? i : -1)
      .filter(i => i !== -1);
    
    // Check if selected matches correct exactly
    const isCorrect = 
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every(i => correctIndices.includes(i));

    if (isCorrect) {
      setScore(s => s + 1);
    }
    setHasSubmitted(true);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQIndex(prev => prev + 1);
      setSelectedIndices([]);
      setHasSubmitted(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 w-full max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {currentQIndex + 1}
              </span>
              Noun Identification
            </h2>
            <p className="text-slate-400 text-sm mt-1">Select all the nouns in the sentence below.</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-blue-400">{score}/{QUESTIONS.length}</div>
             <div className="text-xs text-slate-500 uppercase font-bold">Score</div>
          </div>
        </div>

        <div className="p-12 min-h-[300px] flex flex-col items-center justify-center bg-slate-50">
          <div className="flex flex-wrap justify-center gap-3 text-2xl leading-relaxed">
            {currentQ.words.map((word, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const isCorrectNoun = word.isNoun;
              
              let stateClass = "bg-white border-slate-200 hover:border-blue-300 text-slate-700";
              
              if (hasSubmitted) {
                if (isCorrectNoun) {
                   stateClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                } else if (isSelected && !isCorrectNoun) {
                   stateClass = "bg-red-100 border-red-500 text-red-800 line-through opacity-70";
                } else {
                   stateClass = "opacity-50 grayscale";
                }
              } else if (isSelected) {
                stateClass = "bg-blue-600 border-blue-600 text-white shadow-lg transform scale-110";
              }

              return (
                <button
                  key={idx}
                  onClick={() => toggleWord(idx)}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer font-medium",
                    stateClass
                  )}
                  disabled={hasSubmitted}
                >
                  {word.text}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {hasSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-4">
                  {score > (currentQIndex) ? ( // Simple check if score increased
                     selectedIndices.length === currentQ.words.filter(w => w.isNoun).length && 
                     selectedIndices.every(i => currentQ.words[i].isNoun) ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
                          <CheckCircle2 className="w-5 h-5" /> Perfect!
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                           <XCircle className="w-5 h-5" /> Missed some!
                        </div>
                     )
                  ) : (
                     <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full border border-red-200">
                        <XCircle className="w-5 h-5" /> Incorrect
                     </div>
                  )}
                </div>

                <Button onClick={nextQuestion} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                  {isLastQuestion ? "Finish Exercise" : "Next Sentence"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white p-6 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <div>
            {!hasSubmitted ? "Click on the words that are nouns." : "Review your answers."}
          </div>
          {!hasSubmitted && (
            <Button onClick={checkAnswer} disabled={selectedIndices.length === 0} className="px-8">
              Check Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
