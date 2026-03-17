import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, CheckCircle2, Ear, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SLANG_WORDS = [
  { word: "Arvo", meaning: "Afternoon", example: "See you this arvo!" },
  { word: "Defo", meaning: "Definitely", example: "I will defo be there." },
  { word: "Servo", meaning: "Service Station / Gas Station", example: "I'm going to the servo for some petrol." },
  { word: "Hard yakka", meaning: "Hard work", example: "That was some hard yakka." },
  { word: "She'll be right", meaning: "Everything will be okay", example: "Don't worry mate, she'll be right." }
];

export function AustralianMimicPractice({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [auVoice, setAuVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = SLANG_WORDS[currentIndex];
  const isLastItem = currentIndex === SLANG_WORDS.length - 1;

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const au = voices.find(v => v.lang === "en-AU" || v.lang.includes("AU")) || voices[0];
      setAuVoice(au || null);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const playAudio = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    window.speechSynthesis.cancel();
    
    const uWord = new SpeechSynthesisUtterance(currentItem.word);
    if (auVoice) uWord.voice = auVoice;
    uWord.rate = 0.85; // slightly slower for clarity
    
    const uExample = new SpeechSynthesisUtterance(currentItem.example);
    if (auVoice) uExample.voice = auVoice;
    uExample.rate = 0.9;

    uWord.onend = () => {
        setTimeout(() => {
            window.speechSynthesis.speak(uExample);
        }, 500);
    };

    uExample.onend = () => {
        setIsPlaying(false);
    };

    window.speechSynthesis.speak(uWord);
  };

  const startMockRecording = () => {
    setIsRecording(true);
    setScore(null);
    
    // Simulate recording and AI evaluation
    setTimeout(() => {
      setIsRecording(false);
      // Generate a mock score between 75 and 98
      const mockScore = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
      setScore(mockScore);
    }, 2500);
  };

  const handleNext = () => {
    if (isLastItem) {
      setIsCompleted(true);
      onComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setScore(null);
    }
  };

  if (isCompleted) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 w-full max-w-4xl mx-auto">
            <div className="w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-green-200">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Bloody Brilliant!</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    You've successfully completed the Aussie Slang Mimicry practice. You sound like a true local!
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">Aussie Slang Mimicry</h2>
            <p className="text-slate-400 text-sm mt-1">Listen and repeat the phrases.</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-blue-400">{currentIndex + 1}/{SLANG_WORDS.length}</div>
             <div className="text-xs text-slate-500 uppercase font-bold">Word</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 bg-slate-50 min-h-[300px] flex flex-col items-center justify-center">
            
            <div className="text-center mb-10 w-full">
                <h3 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">"{currentItem.word}"</h3>
                <p className="text-xl text-slate-500 font-medium bg-slate-200 inline-block px-4 py-1 rounded-full mb-6">
                    Means: {currentItem.meaning}
                </p>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl max-w-md mx-auto relative shadow-inner">
                    <p className="text-blue-900 text-lg font-medium italic">"{currentItem.example}"</p>
                </div>
            </div>

            <div className="flex gap-6 items-center">
                <Button 
                    size="lg" 
                    variant="outline"
                    onClick={playAudio}
                    disabled={isPlaying || isRecording}
                    className={cn(
                        "w-16 h-16 rounded-full border-2",
                        isPlaying ? "border-blue-500 text-blue-500 bg-blue-50" : "border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                    )}
                >
                    <Ear className={cn("w-6 h-6", isPlaying && "animate-pulse")} />
                </Button>

                <Button 
                    size="lg" 
                    onClick={startMockRecording}
                    disabled={isPlaying || isRecording}
                    className={cn(
                        "w-20 h-20 rounded-full shadow-lg transition-all duration-300",
                        isRecording 
                            ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110" 
                            : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    <Mic className="w-8 h-8 text-white" />
                </Button>
            </div>

            <div className="mt-8 h-16 flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                    {score !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white px-6 py-3 rounded-full border-2 border-green-400 shadow-sm flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div className="text-lg font-bold text-slate-800">
                                Match Score: <span className={score >= 90 ? "text-green-600" : "text-amber-500"}>{score}%</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-slate-100 flex justify-end items-center">
            <Button 
                onClick={handleNext} 
                disabled={score === null} 
                className="px-8 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300"
            >
                {isLastItem ? "Finish Practice" : "Next Word"} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
