import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Keyboard, Clock, Trophy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS = [
  "Academic", "research", "university", "Student's", "exam", "studies", "analysis", "Theory", "He's", "She's",
  "I", "practice", "success", "knowledge", "writing", "reading", "speaking", "listening",
  "Global", "Economy", "Economics", "Science", "History", "Future", "Technology", "Development",
  "Artificial Intelligence", "Environment", "Sustainable", "Innovation", "Creative", "Method", "Process", "Result",
  "Conclusion", "Introduction", "Abstract", "Reference", "Citations", "Library", "Campus", "Librarian", "Lecture",
  "Lecturers", "Professor", "Assignment", "Deadline", "Grades", "Score", "Achievement", "Educational", "Learning",
  "Challenges", "Opportunities", "Community", "Society", "Culture", "Languages", "Communication", "Association",
  "Copywriter", "Habitat", "Buildings", "Construction", "Engineering", "They're", "Can't", "Won't", "Don't",
  "It's", "You're", "We're", "Monday", "July", "English", "PTE", "Universities", "Children", "Women", "Men",
  "Countries", "Companies", "Employees", "Employer's", "Government", "Policies", "Strategies"
];

const DURATION = 30; // 30 seconds

export default function TypingPractice() {
  const [text, setText] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [wpm, setWpm] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate random text
  const generateText = useCallback(() => {
    const newText: string[] = [];
    for (let i = 0; i < 50; i++) {
      newText.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    setText(newText);
  }, []);

  useEffect(() => {
    generateText();
  }, [generateText]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (isFinished) return;

    const currentWord = text[currentIndex];

    // Check if space is pressed (word completion)
    if (value.endsWith(" ")) {
      const word = value.trim();
      if (word === currentWord) {
        // Correct word
        setUserInput("");
        setCurrentIndex((prev) => prev + 1);
        
        // Calculate stats
        if (startTime) {
          const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
          const wordsTyped = currentIndex + 1;
          setWpm(Math.round(wordsTyped / timeElapsed));
        }
      } else {
        // Incorrect word attempt
        setMistakes(prev => prev + 1);
        // Force retry by keeping input or just flashing red? 
        // User wants to know mistakes. 
        // Let's keep the current behavior of not advancing, but count the mistake.
        setUserInput(value); 
      }
      
      // If reached end of generated text, generate more
      if (currentIndex === text.length - 1) {
        const newText: string[] = [];
        for (let i = 0; i < 20; i++) {
          newText.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
        }
        setText(prev => [...prev, ...newText]);
      }
    } else {
      setUserInput(value);
    }

    // Live Accuracy Calculation
    const totalChars = text.slice(0, currentIndex).join("").length + value.length;
    // Calculate accuracy based on mistakes vs total words attempted so far
    const totalAttempts = currentIndex + mistakes + (value.length > 0 ? 1 : 0);
    const calculatedAccuracy = totalAttempts > 0 
      ? Math.round((currentIndex / totalAttempts) * 100) 
      : 100;
    setAccuracy(calculatedAccuracy);
  };

  const resetPractice = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(DURATION);
    setCurrentIndex(0);
    setUserInput("");
    setWpm(0);
    setMistakes(0);
    setAccuracy(100);
    setStartTime(null);
    generateText();
    if (inputRef.current) inputRef.current.focus();
  };

  const formatTime = (seconds: number) => {
    if (seconds === 60) return "00:60";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary">Typing Speed Test</h1>
        <p className="text-lg text-muted-foreground">
          Improve your typing speed and accuracy for the PTE Written Discourse tasks.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold font-mono text-primary">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-muted-foreground">Time Remaining</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Keyboard className="h-8 w-8 text-secondary-foreground mb-2" />
            <div className="text-3xl font-bold font-mono text-secondary-foreground">
              {wpm}
            </div>
            <p className="text-sm text-muted-foreground">Words Per Minute</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Trophy className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-3xl font-bold font-mono text-green-700">
              {accuracy}%
            </div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-2 shadow-lg">
        <CardHeader className="border-b bg-muted/10 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Keyboard className="h-5 w-5" /> Practice Area
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={resetPractice}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Text Display Area */}
          <div 
            className="relative font-mono text-xl leading-relaxed p-6 rounded-xl bg-muted/10 min-h-[160px] border-2 border-transparent focus-within:border-primary/20 transition-all"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex flex-wrap gap-2 select-none pointer-events-none">
              {text.map((word, i) => {
                let status = "";
                if (i < currentIndex) status = "text-green-600 opacity-50";
                else if (i === currentIndex) status = "bg-primary/10 text-primary rounded px-1 -ml-1";
                else status = "text-muted-foreground";

                return (
                  <span key={i} className={cn("transition-colors duration-200", status)}>
                    {word}
                  </span>
                );
              })}
            </div>
            
            {!isActive && !isFinished && currentIndex === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl">
                <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg animate-pulse font-bold flex items-center gap-2 cursor-pointer">
                  Start Typing to Begin
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={isFinished}
              className="w-full text-2xl p-4 rounded-lg border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-center placeholder:text-muted-foreground/50"
              placeholder={isFinished ? "Time's up!" : "Type here..."}
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            {/* Visual Feedback for current word correctness */}
            {userInput && (
               <div className={cn(
                 "absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold px-2 py-1 rounded",
                 text[currentIndex]?.startsWith(userInput.trim()) 
                   ? "text-green-600 bg-green-50" 
                   : "text-red-600 bg-red-50"
               )}>
                 {text[currentIndex]?.startsWith(userInput.trim()) ? "✓" : "✗"}
               </div>
            )}
          </div>

          {isFinished && (
            <div className="bg-primary/5 p-6 rounded-xl text-center space-y-4 animate-in zoom-in-50 duration-300 border-2 border-primary/20">
              <h3 className="text-3xl font-serif font-bold text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="h-8 w-8" />
                Time's Up!
              </h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto py-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <p className="text-sm text-muted-foreground uppercase font-bold">Words Typed</p>
                      <p className="text-4xl font-bold text-primary">{currentIndex}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <p className="text-sm text-muted-foreground uppercase font-bold">Mistakes</p>
                      <p className="text-4xl font-bold text-red-500">{mistakes}</p>
                  </div>
              </div>
              <p className="text-muted-foreground">
                Accuracy: <span className="font-bold text-foreground">{accuracy}%</span>
              </p>
              <Button size="lg" onClick={resetPractice} className="font-bold w-full max-w-xs">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/5 border-t p-4">
          <div className="w-full flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Press <strong>Space</strong> to advance to the next word</span>
            </div>
            <span>PTE Academic Standard Layout</span>
          </div>
        </CardFooter>
      </Card>
      {/* Keyboard Visualization (Decorative/Static for now) */}
      <div className="opacity-50 pointer-events-none select-none" aria-hidden="true">
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-2 items-center transform scale-95 origin-top">
          {/* Simple Row 1 */}
          <div className="flex gap-1">
            {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
              <div key={k} className={cn(
                "w-10 h-10 flex items-center justify-center rounded border bg-muted/30 font-bold text-muted-foreground",
                userInput.toUpperCase().endsWith(k) && "bg-primary text-white border-primary scale-95 transition-all"
              )}>{k}</div>
            ))}
          </div>
          {/* Simple Row 2 */}
          <div className="flex gap-1 pl-4">
            {['A','S','D','F','G','H','J','K','L'].map(k => (
              <div key={k} className={cn(
                "w-10 h-10 flex items-center justify-center rounded border bg-muted/30 font-bold text-muted-foreground",
                userInput.toUpperCase().endsWith(k) && "bg-primary text-white border-primary scale-95 transition-all"
              )}>{k}</div>
            ))}
          </div>
          {/* Simple Row 3 */}
          <div className="flex gap-1 pl-8">
            {['Z','X','C','V','B','N','M'].map(k => (
              <div key={k} className={cn(
                "w-10 h-10 flex items-center justify-center rounded border bg-muted/30 font-bold text-muted-foreground",
                userInput.toUpperCase().endsWith(k) && "bg-primary text-white border-primary scale-95 transition-all"
              )}>{k}</div>
            ))}
          </div>
           {/* Space */}
           <div className="w-64 h-10 border rounded bg-muted/30 mt-1 flex items-center justify-center text-xs text-muted-foreground">SPACE</div>
        </div>
      </div>
    </div>
  );
}