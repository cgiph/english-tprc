import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap, Target, XCircle, ArrowRight, CheckCircle2, XOctagon, RotateCcw, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// Types
type QuestionType = "fast_decision" | "main_idea" | "elimination";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  explanation: string;
}

interface AnswerRecord {
  questionId: number;
  isCorrect: boolean;
  timeTaken: number;
}

// Question Bank
const QUESTION_BANK: Question[] = [
  {
    id: 1,
    type: "fast_decision",
    question: "Choose the correct preposition: 'She is completely dedicated ____ her research.'",
    options: ["in", "on", "to", "for"],
    correctAnswer: 2,
    timeLimit: 10,
    explanation: "The adjective 'dedicated' is always followed by the preposition 'to'."
  },
  {
    id: 2,
    type: "main_idea",
    question: "Read quickly: 'The rapid advancement of artificial intelligence has led to unprecedented changes in how we work, communicate, and solve complex problems, though it also raises significant ethical concerns.'",
    options: ["AI is mostly dangerous and unethical.", "AI is changing society but brings ethical issues.", "AI helps us communicate better.", "People are losing jobs to AI."],
    correctAnswer: 1,
    timeLimit: 15,
    explanation: "The passage balances the unprecedented changes (benefits) with the ethical concerns."
  },
  {
    id: 3,
    type: "elimination",
    question: "Which of the following is NOT a renewable energy source?",
    options: ["Solar power", "Wind energy", "Natural gas", "Geothermal energy"],
    correctAnswer: 2,
    timeLimit: 12,
    explanation: "Natural gas is a fossil fuel and therefore non-renewable."
  },
  {
    id: 4,
    type: "fast_decision",
    question: "Select the correctly spelled word.",
    options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
    correctAnswer: 2,
    timeLimit: 8,
    explanation: "'Accommodate' has two 'c's and two 'm's."
  },
  {
    id: 5,
    type: "main_idea",
    question: "Read quickly: 'Despite early setbacks and limited funding, the start-up managed to secure a major partnership that effectively saved it from bankruptcy.'",
    options: ["The start-up failed due to lack of money.", "A major partnership rescued the struggling start-up.", "Early setbacks are common in business.", "The start-up is now the most successful in its field."],
    correctAnswer: 1,
    timeLimit: 15,
    explanation: "The core message is that the partnership saved the company from bankruptcy."
  },
  {
    id: 6,
    type: "elimination",
    question: "Which of these words does NOT function as an adjective?",
    options: ["Beautiful", "Quickly", "Energetic", "Massive"],
    correctAnswer: 1,
    timeLimit: 12,
    explanation: "'Quickly' is an adverb; the others are adjectives."
  },
  {
    id: 7,
    type: "fast_decision",
    question: "Complete the idiom: 'Bite the ____'",
    options: ["apple", "dust", "bullet", "tongue"],
    correctAnswer: 2,
    timeLimit: 8,
    explanation: "'Bite the bullet' means to endure a painful or difficult situation."
  },
  {
    id: 8,
    type: "main_idea",
    question: "Read quickly: 'Urban green spaces not only provide residents with recreational areas but also play a crucial role in reducing the urban heat island effect and supporting local biodiversity.'",
    options: ["City parks are mostly for playing sports.", "Green spaces cool down cities and help wildlife.", "Urban heat islands destroy local biodiversity.", "More funding is needed for city parks."],
    correctAnswer: 1,
    timeLimit: 15,
    explanation: "The text highlights two benefits: reducing heat and supporting biodiversity."
  },
  {
    id: 9,
    type: "elimination",
    question: "Identify the false statement about the human body.",
    options: ["The heart has four chambers.", "The femur is the longest bone.", "Adults have 206 bones.", "The liver is part of the respiratory system."],
    correctAnswer: 3,
    timeLimit: 12,
    explanation: "The liver is part of the digestive/metabolic system, not the respiratory system."
  },
  {
    id: 10,
    type: "fast_decision",
    question: "Which sentence is grammatically correct?",
    options: ["He don't like vegetables.", "She has went to the store.", "They are going to the park.", "I seen that movie yesterday."],
    correctAnswer: 2,
    timeLimit: 10,
    explanation: "'They are going to the park' uses the correct subject-verb agreement."
  }
];

export default function TimePressureSimulator() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'results'>('intro');
  const [mode, setMode] = useState<5 | 10>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulator = (selectedMode: 5 | 10) => {
    setMode(selectedMode);
    // Shuffle and slice
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, selectedMode);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers([]);
    setGameState('playing');
    startQuestion(shuffled[0]);
  };

  const startQuestion = (question: Question) => {
    setTimeLeft(question.timeLimit);
    setSelectedOption(null);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    // Auto submit empty if time runs out
    submitAnswer(null);
  };

  const submitAnswer = (optionIndex: number | null) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optionIndex);
    
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    const timeTaken = currentQ.timeLimit - timeLeft;
    
    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      isCorrect,
      timeTaken
    }]);
    
    setGameState('feedback');
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
      startQuestion(questions[currentIndex + 1]);
    } else {
      setGameState('results');
    }
  };

  const currentQ = questions[currentIndex];

  // Helper UI components
  const getTypeInfo = (type: QuestionType) => {
    switch(type) {
      case "fast_decision": return { icon: Zap, label: "Fast Decision", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
      case "main_idea": return { icon: Target, label: "Main Idea", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
      case "elimination": return { icon: XCircle, label: "Elimination", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl min-h-[80vh] flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* INTRO SCREEN */}
        {gameState === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center space-y-8"
          >
            <div className="text-center space-y-4 max-w-2xl">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Timer className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Time Pressure Simulator</h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Train your brain to make quick, accurate decisions under exam conditions. 
                Questions are timed individually, and auto-submit when the clock hits zero.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
              <Card className="hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer border-2" onClick={() => startSimulator(5)}>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Quick Drill</h3>
                    <p className="text-slate-500 text-sm">5 Questions • ~1 Minute</p>
                  </div>
                  <Button className="w-full" variant="outline">Start Quick Drill</Button>
                </CardContent>
              </Card>

              <Card className="hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer border-2 border-blue-100 bg-blue-50/30" onClick={() => startSimulator(10)}>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-blue-900">Full Practice</h3>
                    <p className="text-blue-600/80 text-sm">10 Questions • ~2.5 Minutes</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Full Practice</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && currentQ && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-3xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-500">Question {currentIndex + 1} of {questions.length}</span>
                <Badge variant="outline" className={`gap-1.5 ${getTypeInfo(currentQ.type).bg} ${getTypeInfo(currentQ.type).color} ${getTypeInfo(currentQ.type).border} border`}>
                  {(() => {
                    const Icon = getTypeInfo(currentQ.type).icon;
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                  {getTypeInfo(currentQ.type).label}
                </Badge>
              </div>
              
              <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                <Timer className="w-6 h-6" />
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            <Progress value={(timeLeft / currentQ.timeLimit) * 100} className="h-2" indicatorClassName={timeLeft <= 3 ? "bg-red-500" : "bg-blue-500"} />

            <Card className="border-2 shadow-sm mt-8">
              <CardContent className="p-6 md:p-8 space-y-8">
                <h2 className="text-2xl font-serif text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className="inline-block w-8 h-8 rounded-full bg-white border border-slate-300 text-center leading-8 mr-3 font-bold text-slate-500">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FEEDBACK SCREEN */}
        {gameState === 'feedback' && currentQ && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-sm font-medium text-slate-500">
                Time taken: <span className="text-slate-900 font-bold">{answers[answers.length - 1].timeTaken}s</span>
              </span>
            </div>

            <Card className={`border-2 shadow-sm mt-8 ${
              selectedOption === currentQ.correctAnswer 
                ? 'border-emerald-200 bg-emerald-50/30' 
                : 'border-rose-200 bg-rose-50/30'
            }`}>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  {selectedOption === currentQ.correctAnswer ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0 mt-1" />
                  ) : (
                    <XOctagon className="w-8 h-8 text-rose-500 shrink-0 mt-1" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedOption === currentQ.correctAnswer ? 'Correct!' : selectedOption === null ? 'Time\'s Up!' : 'Incorrect'}
                    </h2>
                    <p className="text-slate-700 mb-6">{currentQ.question}</p>
                    
                    <div className="space-y-3">
                      {currentQ.options.map((opt, i) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border-2 font-medium opacity-70 ";
                        let icon = null;
                        
                        if (i === currentQ.correctAnswer) {
                          btnClass = "w-full text-left p-4 rounded-xl border-2 font-bold bg-emerald-100 border-emerald-500 text-emerald-900";
                          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />;
                        } else if (i === selectedOption) {
                          btnClass = "w-full text-left p-4 rounded-xl border-2 font-bold bg-rose-100 border-rose-500 text-rose-900";
                          icon = <XCircle className="w-5 h-5 text-rose-600 ml-auto" />;
                        } else {
                          btnClass += "bg-white border-slate-200 text-slate-500";
                        }

                        return (
                          <div key={i} className={`flex items-center ${btnClass}`}>
                             <span className="inline-block w-8 h-8 rounded-full bg-white/50 border border-black/10 text-center leading-8 mr-3 font-bold">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                            {icon}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <p className="text-sm text-slate-600">
                        <strong className="text-slate-900 block mb-1">Explanation:</strong>
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button size="lg" onClick={nextQuestion} className="bg-slate-900 text-white hover:bg-slate-800 gap-2">
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
           <motion.div 
           key="results"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-2xl mx-auto space-y-6"
         >
           <Card className="border-2 border-slate-200 shadow-xl overflow-hidden">
             <div className="bg-slate-900 p-8 text-center text-white">
               <Award className="w-16 h-16 mx-auto mb-4 text-blue-400" />
               <h2 className="text-3xl font-serif font-bold mb-2">Practice Complete</h2>
               <p className="text-slate-300">Here is how you handled the time pressure.</p>
             </div>
             
             <CardContent className="p-8">
               {(() => {
                 const correctCount = answers.filter(a => a.isCorrect).length;
                 const accuracy = Math.round((correctCount / questions.length) * 100);
                 const avgTime = (answers.reduce((acc, curr) => acc + curr.timeTaken, 0) / questions.length).toFixed(1);
                 
                 let label = "Needs Improvement";
                 let labelColor = "text-rose-600 bg-rose-100";
                 if (accuracy >= 80) {
                   label = "Test Ready";
                   labelColor = "text-emerald-600 bg-emerald-100";
                 } else if (accuracy >= 60) {
                   label = "Getting There";
                   labelColor = "text-amber-600 bg-amber-100";
                 }

                 return (
                   <div className="space-y-8">
                     <div className="flex justify-center">
                       <span className={`px-4 py-1.5 rounded-full font-bold text-sm tracking-wider uppercase ${labelColor}`}>
                         {label}
                       </span>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                         <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Accuracy</div>
                         <div className="text-4xl font-bold text-slate-900">{accuracy}%</div>
                         <div className="text-sm text-slate-500">{correctCount} of {questions.length} correct</div>
                       </div>
                       
                       <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                         <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg Time</div>
                         <div className="text-4xl font-bold text-slate-900">{avgTime}s</div>
                         <div className="text-sm text-slate-500">per question</div>
                       </div>
                     </div>

                     <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
                       <Button variant="outline" onClick={() => setGameState('intro')} className="gap-2">
                         <RotateCcw className="w-4 h-4" />
                         Try Again
                       </Button>
                       <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                         <a href="/resources">Back to Resources</a>
                       </Button>
                     </div>
                   </div>
                 );
               })()}
             </CardContent>
           </Card>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
