import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const HEADINGS = [
    "Concerns and criticism from local communities",
    "The roots of urban rewilding in Berlin",
    "Economic arguments for and against rewilding",
    "What urban rewilding aims to achieve",
    "Why public attitudes will shape the future of rewilding",
    "Rewilding as a challenge to traditional city planning",
    "A highly organized model of rewilding",
    "The rise of rewilding as a solution to urbanization",
    "The importance of natural corridors",
    "Public misunderstanding of environmental policy"
];

export function IeltsReadingModule4Quiz({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [currentPart, setCurrentPart] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Part 1: Scanning State
  const [scanAnswers, setScanAnswers] = useState<Record<string, string>>({});
  const [scanTimeLeft, setScanTimeLeft] = useState(180); // 3 minutes
  const [scanTimerActive, setScanTimerActive] = useState(false);
  
  // Part 2: Matching Headings State
  const [headingAnswers, setHeadingAnswers] = useState<Record<string, string>>({});

  // Part 3: TFNG State
  const [tfngAnswers, setTfngAnswers] = useState<Record<string, string>>({});

  // Part 4: Sentence Completion State
  const [completionAnswers, setCompletionAnswers] = useState<Record<string, string>>({});

  // Scanning Timer
  useState(() => {
     let interval: NodeJS.Timeout;
     if (scanTimerActive && scanTimeLeft > 0) {
        interval = setInterval(() => {
           setScanTimeLeft(prev => prev - 1);
        }, 1000);
     } else if (scanTimeLeft === 0 && !hasSubmitted && currentPart === 1) {
        submitPart1();
     }
     return () => clearInterval(interval);
  }, [scanTimerActive, scanTimeLeft, currentPart]);

  const startScanTimer = () => setScanTimerActive(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitPart1 = () => {
      let currentScore = 0;
      if (scanAnswers["intentional reduction"] === "2") currentScore++;
      if (scanAnswers["accidental wilderness"] === "3") currentScore++;
      if (scanAnswers["corridors"] === "4") currentScore++;
      if (scanAnswers["rodents"] === "5") currentScore++;
      if (scanAnswers["monitoring"] === "6") currentScore++;
      if (scanAnswers["public perception"] === "7") currentScore++;
      if (scanAnswers["rare birds"] === "3") currentScore++;
      if (scanAnswers["semi-wild"] === "4") currentScore++;
      if (scanAnswers["economic resilience"] === "1") currentScore++;
      
      setScore(currentScore);
      setHasSubmitted(true);
      setScanTimerActive(false);
  };

  const submitPart2 = () => {
      let currentScore = 0;
      if (headingAnswers["p1"] === "The rise of rewilding as a solution to urbanization") currentScore++;
      if (headingAnswers["p2"] === "Rewilding as a challenge to traditional city planning" || headingAnswers["p2"] === "What urban rewilding aims to achieve") currentScore++;
      if (headingAnswers["p3"] === "The roots of urban rewilding in Berlin") currentScore++;
      if (headingAnswers["p4"] === "A highly organized model of rewilding") currentScore++;
      if (headingAnswers["p5"] === "Concerns and criticism from local communities") currentScore++;
      if (headingAnswers["p6"] === "Economic arguments for and against rewilding") currentScore++;
      if (headingAnswers["p7"] === "Why public attitudes will shape the future of rewilding") currentScore++;
      
      setScore(currentScore);
      setHasSubmitted(true);
  };

  const submitPart3 = () => {
      let currentScore = 0;
      if (tfngAnswers["q1"] === "False") currentScore++; // Berlin intentionally designed... (False, it was accidental)
      if (tfngAnswers["q2"] === "True") currentScore++; // Singapore's rewilding strategy helps wildlife move... (True)
      if (tfngAnswers["q3"] === "False") currentScore++; // All residents fully support... (False, some complained)
      if (tfngAnswers["q4"] === "False") currentScore++; // Economists unanimously agree... (False, they debate)
      if (tfngAnswers["q5"] === "False" || tfngAnswers["q5"] === "Not Given") currentScore++; // Urban rewilding always results in increased flooding. (False/NG, it's a worry, not a result)
      if (tfngAnswers["q6"] === "True") currentScore++; // Some cities originally developed... (True, Berlin)
      if (tfngAnswers["q7"] === "False") currentScore++; // Rewilding requires no long-term maintenance. (False, critics argue it requires monitoring)
      
      setScore(currentScore);
      setHasSubmitted(true);
  };

  const submitPart4 = () => {
      let currentScore = 0;
      if (completionAnswers["q1"]?.toLowerCase().includes("freedom") || completionAnswers["q1"]?.toLowerCase().includes("regeneration")) currentScore++;
      if (completionAnswers["q2"]?.toLowerCase().includes("nature reserves") || completionAnswers["q2"]?.toLowerCase().includes("wilderness")) currentScore++;
      if (completionAnswers["q3"]?.toLowerCase().includes("corridors") || completionAnswers["q3"]?.toLowerCase().includes("nature corridors")) currentScore++;
      if (completionAnswers["q4"]?.toLowerCase().includes("safety") || completionAnswers["q4"]?.toLowerCase().includes("feeling unsafe")) currentScore++;
      if (completionAnswers["q5"]?.toLowerCase().includes("healthcare") || completionAnswers["q5"]?.toLowerCase().includes("medical")) currentScore++;
      
      setScore(currentScore);
      setHasSubmitted(true);
  };

  const nextPart = () => {
      if (currentPart === 4) {
          onComplete(true);
      } else {
          setCurrentPart(prev => prev + 1);
          setHasSubmitted(false);
          setScore(0);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 w-full max-w-5xl mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold">Module 4: Urban Rewilding Quiz</h2>
            <p className="text-slate-400 mt-1">
                {currentPart === 1 && "Part 1: 3-Minute Scanning Task"}
                {currentPart === 2 && "Part 2: Match the Headings"}
                {currentPart === 3 && "Part 3: True / False / Not Given"}
                {currentPart === 4 && "Part 4: Sentence Completion"}
            </p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                 <div className="text-xl font-bold text-blue-400">Part {currentPart} / 4</div>
             </div>
             {currentPart === 1 && (
                 <div className={cn(
                     "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold",
                     scanTimeLeft <= 30 ? "bg-red-900/50 text-red-400 animate-pulse" : "bg-slate-800 text-yellow-400"
                 )}>
                    <Clock className="w-5 h-5" />
                    {formatTime(scanTimeLeft)}
                 </div>
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
            {/* PART 1 */}
            {currentPart === 1 && (
                <div className="space-y-8">
                    {!scanTimerActive && scanTimeLeft === 180 && !hasSubmitted ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Scanning Challenge</h3>
                            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                                You have 3 minutes to scan the passage and identify which paragraph (1-7) contains specific phrases. Ready?
                            </p>
                            <Button onClick={startScanTimer} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                                Start 3-Minute Timer
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                                <p className="text-sm text-blue-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Scan the passage and quickly locate the paragraph number (1-7) containing these words or phrases.</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                {["intentional reduction", "accidental wilderness", "corridors", "rodents", "monitoring", "public perception", "rare birds", "semi-wild", "economic resilience"].map((phrase, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <span className="font-medium text-slate-700">"{phrase}"</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-500">Para:</span>
                                            <Input 
                                                className="w-16 text-center font-bold" 
                                                maxLength={1}
                                                disabled={hasSubmitted || scanTimeLeft === 0}
                                                value={scanAnswers[phrase] || ""}
                                                onChange={(e) => setScanAnswers(prev => ({...prev, [phrase]: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasSubmitted && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
                                    <p className="font-bold mb-2">Answers:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                        <p>intentional reduction: <strong>2</strong></p>
                                        <p>accidental wilderness: <strong>3</strong></p>
                                        <p>corridors: <strong>4</strong></p>
                                        <p>rodents: <strong>5</strong></p>
                                        <p>monitoring: <strong>6</strong></p>
                                        <p>public perception: <strong>7</strong></p>
                                        <p>rare birds: <strong>3</strong></p>
                                        <p>semi-wild: <strong>4</strong></p>
                                        <p>economic resilience: <strong>1</strong></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* PART 2 */}
            {currentPart === 2 && (
                <div className="space-y-8">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
                        <p className="text-sm text-amber-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Choose the correct heading for each paragraph from the list below.</p>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <div key={num} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <span className="font-bold text-slate-700 w-32 shrink-0">Paragraph {num}</span>
                                <Select 
                                    disabled={hasSubmitted}
                                    value={headingAnswers[`p${num}`] || ""}
                                    onValueChange={(val) => setHeadingAnswers(prev => ({...prev, [`p${num}`]: val}))}
                                >
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Select a heading..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HEADINGS.map((h, i) => (
                                            <SelectItem key={i} value={h}>{h}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PART 3 */}
            {currentPart === 3 && (
                <div className="space-y-8">
                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                        <p className="text-sm text-purple-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> True / False / Not Given</p>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { id: "q1", text: "Berlin intentionally designed nature reserves after World War II." },
                            { id: "q2", text: "Singapore’s rewilding strategy helps wildlife move across different parts of the city." },
                            { id: "q3", text: "All residents fully support the introduction of wildflower meadows in London." },
                            { id: "q4", text: "Economists unanimously agree that rewilding is too expensive for most cities." },
                            { id: "q5", text: "Urban rewilding always results in increased flooding." },
                            { id: "q6", text: "Some cities originally developed rewilded spaces without planning to do so." },
                            { id: "q7", text: "Rewilding requires no long-term maintenance." }
                        ].map((q, i) => (
                            <div key={q.id} className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="font-medium text-slate-700">{i+1}. {q.text}</p>
                                <RadioGroup 
                                    value={tfngAnswers[q.id]} 
                                    onValueChange={(val) => setTfngAnswers(prev => ({...prev, [q.id]: val}))} 
                                    disabled={hasSubmitted} 
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="True" id={`${q.id}-t`} />
                                        <Label htmlFor={`${q.id}-t`}>True</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="False" id={`${q.id}-f`} />
                                        <Label htmlFor={`${q.id}-f`}>False</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Not Given" id={`${q.id}-ng`} />
                                        <Label htmlFor={`${q.id}-ng`}>Not Given</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PART 4 */}
            {currentPart === 4 && (
                <div className="space-y-8">
                     <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 mb-6">
                        <p className="text-sm text-rose-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Sentence Completion (NO MORE THAN TWO WORDS)</p>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { id: "q1", prefix: "Urban rewilding encourages the", suffix: "of natural processes." },
                            { id: "q2", prefix: "Berlin’s unused areas evolved into", suffix: "without human planning." },
                            { id: "q3", prefix: "Singapore created connected", suffix: "to support animal movement." },
                            { id: "q4", prefix: "Some residents feared tall grasses would affect their", suffix: "." },
                            { id: "q5", prefix: "Supporters argue that green spaces reduce", suffix: "costs." }
                        ].map((q, i) => (
                            <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-lg text-slate-700 leading-loose">
                                {i+1}. {q.prefix} 
                                <span className="inline-block mx-2">
                                    <Input 
                                        className="inline-block w-40 h-8 border-slate-300 border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-blue-500 px-0 text-center" 
                                        disabled={hasSubmitted} 
                                        placeholder="(1-2 words)"
                                        value={completionAnswers[q.id] || ""} 
                                        onChange={(e) => setCompletionAnswers(prev => ({...prev, [q.id]: e.target.value}))} 
                                    />
                                </span> 
                                {q.suffix}
                            </div>
                        ))}

                        {hasSubmitted && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
                                <p className="font-bold mb-2">Suggested Answers:</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>1. freedom / regeneration</li>
                                    <li>2. nature reserves / wilderness</li>
                                    <li>3. corridors / nature corridors</li>
                                    <li>4. safety / feeling unsafe</li>
                                    <li>5. healthcare / medical</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
            {!hasSubmitted ? (
                <Button 
                    size="lg" 
                    className="bg-slate-900 hover:bg-slate-800 text-white px-10" 
                    onClick={() => {
                        if (currentPart === 1) submitPart1();
                        if (currentPart === 2) submitPart2();
                        if (currentPart === 3) submitPart3();
                        if (currentPart === 4) submitPart4();
                    }}
                    disabled={currentPart === 1 && !scanTimerActive && scanTimeLeft === 180}
                >
                    Submit Answers
                </Button>
            ) : (
                <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10" 
                    onClick={nextPart}
                >
                    {currentPart === 4 ? "Finish Quiz" : `Continue to Part ${currentPart + 1}`} <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
