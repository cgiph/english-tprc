import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Keyboard, Clock, Trophy, AlertCircle, Flame, Zap, Target, Award, Star, Medal, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";

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

const MODES = {
  speed: { id: 'speed', name: 'Speed Run', icon: Zap, time: 30, desc: "Type as many words as possible in 30 seconds." },
  accuracy: { id: 'accuracy', name: 'Accuracy Mode', icon: Target, time: 60, desc: "Focus on zero mistakes. 1 minute." },
  streak: { id: 'streak', name: 'Streak Challenge', icon: Flame, time: 45, desc: "Build the highest streak possible in 45 seconds." }
};

type PracticeMode = keyof typeof MODES;

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const AVAILABLE_BADGES: Achievement[] = [
  { id: 'wpm-50', name: 'Speedster', description: 'Reach 50 WPM', icon: Zap, color: 'text-amber-500 bg-amber-100 border-amber-200' },
  { id: 'acc-95', name: 'Sharpshooter', description: '95%+ Accuracy', icon: Target, color: 'text-emerald-500 bg-emerald-100 border-emerald-200' },
  { id: 'streak-20', name: 'Unstoppable', description: '20 Word Streak', icon: Flame, color: 'text-orange-500 bg-orange-100 border-orange-200' },
  { id: 'xp-1000', name: 'Dedicated Scholar', description: 'Earn 1000 XP', icon: Award, color: 'text-purple-500 bg-purple-100 border-purple-200' }
];

export default function TypingPractice() {
  const [mode, setMode] = useState<PracticeMode>('speed');
  const [text, setText] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(MODES.speed.time);
  const [wpm, setWpm] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  // Gamification states
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [sessionXp, setSessionXp] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [newBadgesThisSession, setNewBadgesThisSession] = useState<Achievement[]>([]);
  
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
    } else if (isActive && timeLeft === 0) {
      endSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const endSession = () => {
    setIsFinished(true);
    setIsActive(false);
    
    // Calculate final stats
    let earnedXp = Math.floor(wpm * (accuracy / 100)) + (maxStreak * 2);
    if (mode === 'accuracy' && accuracy >= 95) earnedXp += 50;
    if (mode === 'streak' && maxStreak >= 20) earnedXp += 50;
    
    setSessionXp(earnedXp);
    
    const newTotalXp = xp + earnedXp;
    setXp(newTotalXp);
    
    // Level up every 500 XP
    const newLevel = Math.floor(newTotalXp / 500) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
    
    // Check badges
    const earnedBadges: Achievement[] = [];
    if (wpm >= 50 && !unlockedBadges.includes('wpm-50')) earnedBadges.push(AVAILABLE_BADGES[0]);
    if (accuracy >= 95 && currentIndex > 10 && !unlockedBadges.includes('acc-95')) earnedBadges.push(AVAILABLE_BADGES[1]);
    if (maxStreak >= 20 && !unlockedBadges.includes('streak-20')) earnedBadges.push(AVAILABLE_BADGES[2]);
    if (newTotalXp >= 1000 && !unlockedBadges.includes('xp-1000')) earnedBadges.push(AVAILABLE_BADGES[3]);
    
    if (earnedBadges.length > 0) {
      setNewBadgesThisSession(earnedBadges);
      setUnlockedBadges(prev => [...prev, ...earnedBadges.map(b => b.id)]);
    }
    
    analytics.trackTypingTest(wpm, accuracy);
  };

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
        
        // Gamification
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        
        // Calculate stats
        if (startTime) {
          const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
          const wordsTyped = currentIndex + 1;
          setWpm(Math.round(wordsTyped / timeElapsed));
        }
      } else {
        // Incorrect word attempt
        setMistakes(prev => prev + 1);
        setStreak(0); // Reset streak
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
    const totalAttempts = currentIndex + mistakes + (value.length > 0 && !currentWord.startsWith(value.trim()) ? 1 : 0);
    const calculatedAccuracy = totalAttempts > 0 
      ? Math.round((currentIndex / totalAttempts) * 100) 
      : 100;
    setAccuracy(calculatedAccuracy);
  };

  const changeMode = (newMode: PracticeMode) => {
    setMode(newMode);
    resetPractice(newMode);
  };

  const resetPractice = (forcedMode?: PracticeMode) => {
    const currentMode = forcedMode || mode;
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(MODES[currentMode].time);
    setCurrentIndex(0);
    setUserInput("");
    setWpm(0);
    setMistakes(0);
    setAccuracy(100);
    setStreak(0);
    setSessionXp(0);
    setNewBadgesThisSession([]);
    setStartTime(null);
    generateText();
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const formatTime = (seconds: number) => {
    if (seconds === 60) return "01:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate level progress
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const levelProgress = Math.min(100, Math.max(0, (progressInLevel / xpNeeded) * 100));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            Typing Speed Trainer
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Gamified</Badge>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Level up your typing speed and accuracy for PTE Written Discourse.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl border">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary font-bold text-xl border border-primary/20">
            {level}
          </div>
          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>XP</span>
              <span>{xp} / {xpForNextLevel}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </div>
      </div>
      
      {/* Mode Selection */}
      {!isActive && !isFinished && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(MODES) as PracticeMode[]).map((m) => {
            const modeInfo = MODES[m];
            const Icon = modeInfo.icon;
            const isSelected = mode === m;
            return (
              <Card 
                key={m}
                className={cn(
                  "cursor-pointer transition-all border-2",
                  isSelected ? "border-primary bg-primary/5 shadow-md scale-100" : "hover:border-primary/40 hover:bg-muted/10 scale-[0.98] opacity-80"
                )}
                onClick={() => changeMode(m)}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={cn("p-3 rounded-lg", isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>{modeInfo.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{modeInfo.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Clock className="h-6 w-6 text-primary mb-1" />
            <div className="text-2xl font-bold font-mono text-primary">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Time</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Zap className="h-6 w-6 text-secondary-foreground mb-1" />
            <div className="text-2xl font-bold font-mono text-secondary-foreground">
              {wpm}
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold">WPM</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Target className="h-6 w-6 text-emerald-600 mb-1" />
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {accuracy}%
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Accuracy</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200 relative overflow-hidden">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center relative z-10">
            <Flame className={cn("h-6 w-6 mb-1 transition-all", streak >= 5 ? "text-orange-500 fill-orange-500 scale-125" : "text-orange-400")} />
            <div className={cn("text-2xl font-bold font-mono transition-all", streak >= 5 ? "text-orange-600 scale-110" : "text-orange-600")}>
              {streak}
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Streak</p>
          </CardContent>
          {streak >= 5 && (
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
          )}
        </Card>
      </div>

      {/* Practice Area */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-muted/10 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Keyboard className="h-5 w-5" /> Practice Area: {MODES[mode].name}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => resetPractice()}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8 relative">
          
          <AnimatePresence>
            {isFinished ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white"
              >
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                    <Trophy className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-slate-800">Session Complete!</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Words Typed</p>
                      <p className="text-3xl font-bold text-slate-800">{currentIndex}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">WPM</p>
                      <p className="text-3xl font-bold text-secondary-foreground">{wpm}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Max Streak</p>
                      <p className="text-3xl font-bold text-orange-500">{maxStreak}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">XP Earned</p>
                      <p className="text-3xl font-bold text-purple-600">+{sessionXp}</p>
                    </div>
                  </div>

                  {newBadgesThisSession.length > 0 && (
                    <div className="py-6 border-t border-b border-muted my-6">
                      <h4 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500" /> New Achievements Unlocked!
                      </h4>
                      <div className="flex flex-wrap justify-center gap-4">
                        {newBadgesThisSession.map(badge => {
                          const BadgeIcon = badge.icon;
                          return (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              key={badge.id} 
                              className={cn("flex items-center gap-3 p-3 rounded-lg border-2", badge.color)}
                            >
                              <div className="p-2 bg-white/50 rounded-full">
                                <BadgeIcon className="w-6 h-6" />
                              </div>
                              <div className="text-left pr-2">
                                <p className="font-bold text-sm leading-tight">{badge.name}</p>
                                <p className="text-xs opacity-80">{badge.description}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button size="lg" onClick={() => resetPractice()} className="font-bold w-full max-w-sm gap-2 text-lg h-14">
                      <RotateCcw className="w-5 h-5" /> Play Again
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Text Display Area */}
                <div 
                  className="relative font-mono text-xl leading-relaxed p-6 rounded-xl bg-muted/10 min-h-[160px] border-2 border-transparent focus-within:border-primary/20 transition-all"
                  onClick={() => inputRef.current?.focus()}
                >
                  <div className="flex flex-wrap gap-2 select-none pointer-events-none">
                    {text.map((word, i) => {
                      let status = "";
                      if (i < currentIndex) status = "text-emerald-500 opacity-50";
                      else if (i === currentIndex) status = "bg-primary/10 text-primary rounded px-1 -ml-1 shadow-sm font-bold";
                      else status = "text-slate-400";

                      return (
                        <span key={i} className={cn("transition-colors duration-200", status)}>
                          {word}
                        </span>
                      );
                    })}
                  </div>
                  
                  {!isActive && currentIndex === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl z-10">
                      <div className="bg-primary text-white px-8 py-4 rounded-full shadow-xl animate-pulse font-bold flex items-center gap-3 text-lg">
                        <Keyboard className="w-6 h-6" /> Start Typing to Begin
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="relative max-w-2xl mx-auto">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full text-2xl p-5 rounded-xl border-4 outline-none transition-all font-mono text-center shadow-sm",
                      userInput && text[currentIndex] && !text[currentIndex].startsWith(userInput.trim()) 
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50 text-red-700" 
                        : "border-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                    )}
                    placeholder={!isActive ? "Type here..." : ""}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {/* Visual Feedback for current word correctness */}
                  {userInput && (
                     <div className={cn(
                       "absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold p-2 rounded-full shadow-sm",
                       text[currentIndex]?.startsWith(userInput.trim()) 
                         ? "text-emerald-600 bg-emerald-100" 
                         : "text-red-600 bg-red-100"
                     )}>
                       {text[currentIndex]?.startsWith(userInput.trim()) ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t p-4 flex justify-between items-center text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded font-mono text-xs font-bold shadow-sm">SPACE</span>
            <span>to advance to the next word</span>
          </div>
          <div className="flex gap-2">
            {unlockedBadges.length > 0 && (
              <Badge variant="outline" className="gap-1 font-bold text-amber-600 border-amber-200 bg-amber-50">
                <Medal className="w-3.5 h-3.5" /> {unlockedBadges.length} Badges
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}