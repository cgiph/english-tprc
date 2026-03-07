import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  original: string;
  suggestedAnswer: string;
  hints: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    original: "A new study suggests that the number of children a woman has might affect her rate of ageing and her lifespan.",
    suggestedAnswer: "Recent research indicates that a female's lifespan and how quickly she ages could be influenced by how many kids she gives birth to.",
    hints: ["Study -> Research", "Suggests -> Indicates", "Woman -> Female", "Affect -> Influence"]
  },
  {
    id: 2,
    original: "Women who had five children or more, or no children, aged faster than those who had a small number of kids.",
    suggestedAnswer: "Females with zero or at least five kids experienced more rapid ageing compared to those with fewer offspring.",
    hints: ["Aged faster -> Experienced more rapid ageing", "Small number of kids -> Fewer offspring"]
  },
  {
    id: 3,
    original: "When a large amount of energy is invested in reproduction, it is taken away from bodily maintenance.",
    suggestedAnswer: "Dedicating significant energy to having children reduces the resources available for keeping the body healthy.",
    hints: ["Large amount -> Significant", "Invested in reproduction -> Dedicating to having children", "Bodily maintenance -> Keeping the body healthy"]
  },
  {
    id: 4,
    original: "The researchers used historical data in their analysis of parenthood and ageing.",
    suggestedAnswer: "Scientists examined past records to study the relationship between having children and getting older.",
    hints: ["Researchers -> Scientists", "Historical data -> Past records", "Analysis -> Study", "Parenthood -> Having children"]
  },
  {
    id: 5,
    original: "Another factor that could increase longevity is the increased social support a mother receives.",
    suggestedAnswer: "A mother's lifespan might also be extended due to the extra societal help she gets.",
    hints: ["Increase longevity -> Extended lifespan", "Increased social support -> Extra societal help", "Receives -> Gets"]
  }
];

export function IeltsParaphrasePractice({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ = QUESTIONS[currentQIndex];
  const isLastQuestion = currentQIndex === QUESTIONS.length - 1;

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onComplete(true);
    } else {
      setCurrentQIndex(prev => prev + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setShowHint(false);
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
              Paraphrase Training
            </h2>
            <p className="text-slate-400 text-sm mt-1">Rewrite the sentence using synonyms.</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-blue-400">{currentQIndex + 1}/{QUESTIONS.length}</div>
             <div className="text-xs text-slate-500 uppercase font-bold">Progress</div>
          </div>
        </div>

        <div className="p-8 min-h-[300px] flex flex-col justify-center bg-slate-50">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-6">
             <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Original Sentence</p>
             <p className="text-lg text-slate-800 font-medium leading-relaxed">"{currentQ.original}"</p>
          </div>
          
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <p className="text-slate-700 font-medium">Your Paraphrased Version:</p>
                 {!showFeedback && (
                     <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => setShowHint(!showHint)}>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {showHint ? "Hide Hints" : "Show Hints"}
                     </Button>
                 )}
             </div>

             <AnimatePresence>
                 {showHint && !showFeedback && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50 border border-amber-200 p-4 rounded-lg"
                     >
                         <p className="text-sm font-semibold text-amber-800 mb-2">Try using these synonyms:</p>
                         <ul className="list-disc pl-5 text-sm text-amber-900 space-y-1">
                             {currentQ.hints.map((hint, idx) => (
                                 <li key={idx}>{hint}</li>
                             ))}
                         </ul>
                     </motion.div>
                 )}
             </AnimatePresence>

             <Textarea 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your rewritten sentence here..."
                className="min-h-[120px] text-lg p-4 resize-none border-slate-300 focus:border-blue-500"
                disabled={showFeedback}
             />
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6 border-t border-slate-200 space-y-6"
              >
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-bold">Suggested Answer</p>
                    </div>
                    <p className="text-green-900 text-lg">"{currentQ.suggestedAnswer}"</p>
                    <p className="text-green-700 text-sm mt-3 border-t border-green-200/50 pt-3">
                        Compare your answer with the suggested one. Did you capture the same meaning using different words?
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={nextQuestion} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                    {isLastQuestion ? "Finish Exercise" : "Next Sentence"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!showFeedback && (
          <div className="bg-white p-4 border-t border-slate-100 flex justify-end items-center">
            <Button onClick={handleSubmit} disabled={userAnswer.trim().length < 10} className="px-8 bg-slate-900 text-white hover:bg-slate-800">
              Submit & Compare
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
