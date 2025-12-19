import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Headphones, PlayCircle, PauseCircle, CheckCircle2, AlertCircle, ArrowRight, Timer, RotateCcw, Volume2, Settings, MoreVertical, Music } from "lucide-react";
import { LISTENING_DATA, ListeningQuestion } from "@/lib/listening-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ListeningPractice() {
  const [activeTab, setActiveTab] = useState("SST");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  // State for user answers
  const [sstAnswers, setSstAnswers] = useState<Record<string, string>>({});
  const [mcmaAnswers, setMcmaAnswers] = useState<Record<string, string[]>>({});
  const [fibAnswers, setFibAnswers] = useState<Record<string, string[]>>({});
  const [mcsaAnswers, setMcsaAnswers] = useState<Record<string, string>>({});
  const [smwAnswers, setSmwAnswers] = useState<Record<string, string>>({});
  const [hiwAnswers, setHiwAnswers] = useState<Record<string, number[]>>({}); // indices of clicked words
  const [wfdAnswers, setWfdAnswers] = useState<Record<string, string>>({});
  
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [questionTimers, setQuestionTimers] = useState<Record<string, number>>({});
  
  const { toast } = useToast();

  const filterQuestions = (type: string) => LISTENING_DATA.filter(q => q.type === type);

  // Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionTimers(prev => {
        const next = { ...prev };
        
        filterQuestions(activeTab).forEach(q => {
          if (!showResults[q.id]) { // Count continuously until answered/submitted
             const currentTime = next[q.id] || 0;
             next[q.id] = currentTime + 1;

             // Alerts for specific types
             // FIB-L, HIW, WFD
             if (["FIB-L", "HIW", "WFD"].includes(q.type)) {
               if (currentTime === 60) { // Alert at 60s for these types
                  toast({
                    variant: "destructive",
                    title: "Time Alert",
                    description: "You're taking a while! Try to answer faster.",
                    duration: 3000
                  });
               }
             }
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab, playingId, showResults, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playBeep = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3); // 300ms beep
  };

  const togglePlay = (id: string, text: string, type?: string, speed: number = 1.0) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      window.speechSynthesis.cancel();
      setPlayingId(id);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.volume = volume;
      
      // Try to find a British voice
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(v => v.lang.includes("GB") || v.name.includes("UK"));
      if (britishVoice) utterance.voice = britishVoice;

      utterance.onend = () => {
        if (type === "SMW") {
          playBeep();
        }
        setPlayingId(null);
      };
      
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = (id: string) => {
    setShowResults(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetQuestion = (id: string, type: string) => {
     // Clear answer based on type
     if (type === "SST") setSstAnswers(prev => ({ ...prev, [id]: "" }));
     else if (type === "MC-MA") setMcmaAnswers(prev => ({ ...prev, [id]: [] }));
     else if (type === "FIB-L") setFibAnswers(prev => ({ ...prev, [id]: [] }));
     else if (type === "MC-SA") setMcsaAnswers(prev => ({ ...prev, [id]: "" }));
     else if (type === "SMW") setSmwAnswers(prev => ({ ...prev, [id]: "" }));
     else if (type === "HIW") setHiwAnswers(prev => ({ ...prev, [id]: [] }));
     else if (type === "WFD") setWfdAnswers(prev => ({ ...prev, [id]: "" }));

     setShowResults(prev => ({ ...prev, [id]: false }));
     setQuestionTimers(prev => ({ ...prev, [id]: 0 }));
  };

  // Renderers for different question types

  const handleCut = (id: string) => {
    const text = sstAnswers[id] || "";
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setSstAnswers(prev => ({ ...prev, [id]: "" }));
      toast({ description: "Text cut to clipboard" });
    });
  };

  const handleCopy = (id: string) => {
    const text = sstAnswers[id] || "";
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast({ description: "Text copied to clipboard" });
    });
  };

  const handlePaste = async (id: string) => {
    try {
      const text = await navigator.clipboard.readText();
      setSstAnswers(prev => ({ ...prev, [id]: (prev[id] || "") + text }));
      toast({ description: "Text pasted from clipboard" });
    } catch (err) {
      toast({ variant: "destructive", description: "Failed to paste. Please use Ctrl+V." });
    }
  };

  // ... renderers ...

  const renderSST = (q: ListeningQuestion) => (
    <div className="space-y-6">
       <div className="bg-slate-50 p-6 rounded-md text-sm leading-relaxed text-slate-800 border border-slate-200">
         <p className="font-semibold mb-2">Instructions:</p>
         You will hear a short lecture. Write a summary for a fellow student who was not present at the lecture. You should write 50-70 words. You have 10 minutes to finish this task. Your response will be judged on the Quality of Your writing and on how well your response presents the key points presented in the lecture.
       </div>

       {/* Audio Player Section */}
       <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center gap-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 w-full justify-center">
             <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-400 font-bold text-slate-600 bg-white shadow-sm text-lg">
                10
             </div>
             <span className="text-slate-500 font-medium text-lg">Ready</span>
             
             {/* Progress bar simulation */}
             <div className="h-3 flex-1 bg-slate-300 rounded-full overflow-hidden max-w-md mx-4 relative">
                <div 
                  className={cn("h-full bg-blue-500 origin-left transition-all duration-1000 ease-linear", playingId === q.id ? "w-full animate-[progress_30s_linear]" : "w-0")} 
                />
             </div>
             
             <div className="flex items-center gap-2 text-slate-500">
               <Volume2 className="h-5 w-5" />
               <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
               <Music className="h-4 w-4 ml-1" />
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-4 border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 hover:bg-slate-100 rounded-full" 
                  onClick={() => togglePlay(q.id, q.audioScript, q.type, audioSpeed)}
                >
                  {playingId === q.id ? <PauseCircle className="h-8 w-8 fill-slate-800 text-slate-800" /> : <PlayCircle className="h-8 w-8 fill-slate-800 text-slate-800" />}
                </Button>
                <div className="text-sm font-mono text-slate-500 min-w-[80px] text-center">
                  {playingId === q.id ? "Playing..." : "0:00 / 1:32"}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                   <MoreVertical className="h-4 w-4" />
                </Button>
             </div>
             
             <div className="flex items-center gap-0 bg-teal-500 rounded-md overflow-hidden p-0.5">
                {[0.8, 1.0, 1.2, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 transition-colors", 
                      audioSpeed === speed 
                        ? "bg-teal-700 text-white shadow-sm rounded-sm" 
                        : "text-white hover:bg-teal-600/50"
                    )}
                    onClick={() => setAudioSpeed(speed)}
                  >
                    {speed}x speed
                  </button>
                ))}
             </div>
          </div>
       </div>

       <Card className="border-slate-300 shadow-sm">
         <CardContent className="p-0">
            <Textarea 
              placeholder="" 
              className="min-h-[200px] resize-none text-base p-4 border-0 focus-visible:ring-0 rounded-none rounded-t-lg"
              value={sstAnswers[q.id] || ""}
              onChange={(e) => setSstAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            />
            <div className="bg-slate-50 border-t p-2 flex justify-between items-center rounded-b-lg">
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 min-w-[80px] h-8 text-xs border-slate-300" onClick={() => handleCut(q.id)}>Cut</Button>
                 <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 min-w-[80px] h-8 text-xs border-slate-300" onClick={() => handleCopy(q.id)}>Copy</Button>
                 <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 min-w-[80px] h-8 text-xs border-slate-300" onClick={() => handlePaste(q.id)}>Paste</Button>
               </div>
               <span className="font-bold text-sm text-slate-700 mr-2">Total Word Count: {(sstAnswers[q.id] || "").split(/\s+/).filter(Boolean).length}</span>
            </div>
         </CardContent>
       </Card>

      {showResults[q.id] && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 animate-in fade-in shadow-sm">
          <p className="text-sm font-semibold text-green-800 mb-2 uppercase tracking-wide">Transcript</p>
          <p className="text-base text-green-800 leading-relaxed">{q.audioScript}</p>
        </div>
      )}
    </div>
  );

  const renderMCMA = (q: ListeningQuestion) => (
    <div className="space-y-6">
       <div className="bg-slate-50 p-6 rounded-md text-sm leading-relaxed text-slate-800 border border-slate-200">
         <p className="font-semibold mb-2">Instructions:</p>
         Listen to the recording and answer the question by selecting all the correct responses. You will need to select more than one response.
       </div>

       {/* Audio Player Section */}
       <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center gap-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 w-full justify-center">
             <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-400 font-bold text-slate-600 bg-white shadow-sm text-lg">
                6
             </div>
             <span className="text-slate-500 font-medium text-lg">Ready</span>
             
             {/* Progress bar simulation */}
             <div className="h-3 flex-1 bg-slate-300 rounded-full overflow-hidden max-w-md mx-4 relative">
                <div 
                  className={cn("h-full bg-blue-500 origin-left transition-all duration-1000 ease-linear", playingId === q.id ? "w-full animate-[progress_30s_linear]" : "w-0")} 
                />
             </div>
             
             <div className="flex items-center gap-2 text-slate-500">
               <Volume2 className="h-5 w-5" />
               <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
               <Music className="h-4 w-4 ml-1" />
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-4 border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 hover:bg-slate-100 rounded-full" 
                  onClick={() => togglePlay(q.id, q.audioScript, q.type, audioSpeed)}
                >
                  {playingId === q.id ? <PauseCircle className="h-8 w-8 fill-slate-800 text-slate-800" /> : <PlayCircle className="h-8 w-8 fill-slate-800 text-slate-800" />}
                </Button>
                <div className="text-sm font-mono text-slate-500 min-w-[80px] text-center">
                  {playingId === q.id ? "Playing..." : "0:00 / 2:18"}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                   <MoreVertical className="h-4 w-4" />
                </Button>
             </div>
             
             <div className="flex items-center gap-0 bg-teal-500 rounded-md overflow-hidden p-0.5">
                {[0.8, 1.0, 1.2, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 transition-colors", 
                      audioSpeed === speed 
                        ? "bg-teal-700 text-white shadow-sm rounded-sm" 
                        : "text-white hover:bg-teal-600/50"
                    )}
                    onClick={() => setAudioSpeed(speed)}
                  >
                    {speed}x speed
                  </button>
                ))}
             </div>
          </div>
       </div>

      <div className="space-y-4">
        <p className="font-semibold text-lg text-slate-800">{q.prompt}</p>
        <div className="space-y-2">
          {q.options?.map((option) => {
             const isChecked = (mcmaAnswers[q.id] || []).includes(option);
             const isCorrect = (q.correctAnswer as string[])?.includes(option);
             
             let borderClass = "border-slate-200";
             let bgClass = "bg-white hover:bg-slate-50";
             
             if (showResults[q.id]) {
                if (isCorrect) {
                  borderClass = "border-green-500 bg-green-50/50";
                } else if (isChecked && !isCorrect) {
                  borderClass = "border-red-500 bg-red-50/50";
                }
             } else if (isChecked) {
                bgClass = "bg-slate-100 border-blue-400";
             }
             
             return (
              <div 
                key={option} 
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-md border transition-all cursor-pointer",
                  borderClass,
                  bgClass
                )}
                onClick={() => {
                  if (showResults[q.id]) return;
                  const current = mcmaAnswers[q.id] || [];
                  if (current.includes(option)) {
                    setMcmaAnswers(prev => ({ ...prev, [q.id]: current.filter(o => o !== option) }));
                  } else {
                    setMcmaAnswers(prev => ({ ...prev, [q.id]: [...current, option] }));
                  }
                }}
              >
                <Checkbox 
                  id={`${q.id}-${option}`}
                  checked={isChecked}
                  onCheckedChange={() => {}} // Handled by parent div
                  className={cn(
                    "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                    showResults[q.id] && isCorrect ? "border-green-600 text-green-600" : ""
                  )}
                />
                <Label 
                  htmlFor={`${q.id}-${option}`} 
                  className="text-base cursor-pointer flex-1 font-medium text-slate-700"
                >
                  {option}
                </Label>
                {showResults[q.id] && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFIB = (q: ListeningQuestion) => {
    if (!q.transcript) return null;

    const parts = q.transcript.split(/(\[.*?\])/g);
    let inputIndex = 0;

    return (
      <div className="space-y-6">
       <div className="bg-slate-50 p-6 rounded-md text-sm leading-relaxed text-slate-800 border border-slate-200">
         <p className="font-semibold mb-2">Instructions:</p>
         You will hear a recording. Type the missing words in each blank.
       </div>

       {/* Audio Player Section */}
       <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center gap-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 w-full justify-center">
             <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-400 font-bold text-slate-600 bg-white shadow-sm text-lg">
                2
             </div>
             <span className="text-slate-500 font-medium text-lg">Ready</span>
             
             {/* Progress bar simulation */}
             <div className="h-3 flex-1 bg-slate-300 rounded-full overflow-hidden max-w-md mx-4 relative">
                <div 
                  className={cn("h-full bg-blue-500 origin-left transition-all duration-1000 ease-linear", playingId === q.id ? "w-full animate-[progress_30s_linear]" : "w-0")} 
                />
             </div>
             
             <div className="flex items-center gap-2 text-slate-500">
               <Volume2 className="h-5 w-5" />
               <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
               <Music className="h-4 w-4 ml-1" />
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-4 border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 hover:bg-slate-100 rounded-full" 
                  onClick={() => togglePlay(q.id, q.audioScript, q.type, audioSpeed)}
                >
                  {playingId === q.id ? <PauseCircle className="h-8 w-8 fill-slate-800 text-slate-800" /> : <PlayCircle className="h-8 w-8 fill-slate-800 text-slate-800" />}
                </Button>
                <div className="text-sm font-mono text-slate-500 min-w-[80px] text-center">
                  {playingId === q.id ? "Playing..." : "0:00 / 1:09"}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                   <MoreVertical className="h-4 w-4" />
                </Button>
             </div>
             
             <div className="flex items-center gap-0 bg-teal-500 rounded-md overflow-hidden p-0.5">
                {[0.8, 1.0, 1.2, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 transition-colors", 
                      audioSpeed === speed 
                        ? "bg-teal-700 text-white shadow-sm rounded-sm" 
                        : "text-white hover:bg-teal-600/50"
                    )}
                    onClick={() => setAudioSpeed(speed)}
                  >
                    {speed}x speed
                  </button>
                ))}
             </div>
          </div>
       </div>

        <div className="leading-9 text-lg text-slate-800">
          {parts.map((part, idx) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              const answer = part.slice(1, -1);
              const currentInputIndex = inputIndex++;
              const userAnswer = (fibAnswers[q.id] || [])[currentInputIndex] || "";
              
              return (
                <span key={idx} className="inline-block mx-1">
                  <Input 
                    className={`h-8 w-40 inline-block px-2 py-0 border border-slate-400 rounded-sm bg-white focus:ring-1 focus:ring-blue-500 text-base ${
                      showResults[q.id] 
                        ? userAnswer.toLowerCase() === answer.toLowerCase() 
                          ? "border-green-500 bg-green-50 text-green-700 font-medium" 
                          : "border-red-500 bg-red-50 text-red-700 font-medium"
                        : ""
                    }`}
                    value={userAnswer}
                    onChange={(e) => {
                      const newAnswers = [...(fibAnswers[q.id] || [])];
                      newAnswers[currentInputIndex] = e.target.value;
                      setFibAnswers(prev => ({ ...prev, [q.id]: newAnswers }));
                    }}
                  />
                  {showResults[q.id] && userAnswer.toLowerCase() !== answer.toLowerCase() && (
                    <span className="text-xs text-green-600 font-bold block ml-1">{answer}</span>
                  )}
                </span>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      </div>
    );
  };

  const renderMCSA = (q: ListeningQuestion) => (
    <div className="space-y-4">
      <p className="font-medium text-sm">{q.prompt}</p>
      <RadioGroup 
        value={mcsaAnswers[q.id] || ""} 
        onValueChange={(val) => setMcsaAnswers(prev => ({ ...prev, [q.id]: val }))}
      >
        {q.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${q.id}-${option}`} />
            <Label htmlFor={`${q.id}-${option}`} className="text-sm cursor-pointer">{option}</Label>
            {showResults[q.id] && q.correctAnswer === option && (
              <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderSMW = (q: ListeningQuestion) => renderMCSA(q); 

  const renderHIW = (q: ListeningQuestion) => {
    if (!q.displayTranscript) return null;
    
    const words = q.displayTranscript.split(" ");
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-2">Click on the words that are different from the audio:</p>
        <div className="text-lg leading-8">
          {words.map((word, idx) => {
            const isSelected = (hiwAnswers[q.id] || []).includes(idx);
            const isWrong = (q.wrongWords || []).includes(idx);
            
            let className = "cursor-pointer hover:bg-yellow-100 rounded px-1 transition-colors ";
            if (isSelected) className += "bg-yellow-200 border-b-2 border-yellow-400 ";
            
            if (showResults[q.id]) {
               if (isWrong && isSelected) className += "bg-green-200 border-green-500 text-green-800 "; 
               else if (isWrong && !isSelected) className += "bg-red-100 border-red-500 text-red-800 "; 
               else if (!isWrong && isSelected) className += "bg-red-100 text-red-500 line-through "; 
            }

            return (
              <span 
                key={idx} 
                className={className}
                onClick={() => {
                  if (showResults[q.id]) return;
                  const current = hiwAnswers[q.id] || [];
                  if (current.includes(idx)) {
                    setHiwAnswers(prev => ({ ...prev, [q.id]: current.filter(i => i !== idx) }));
                  } else {
                    setHiwAnswers(prev => ({ ...prev, [q.id]: [...current, idx] }));
                  }
                }}
              >
                {word}{" "}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWFD = (q: ListeningQuestion) => (
    <div className="space-y-4">
      <Input 
        placeholder="Type the sentence exactly as you hear it..."
        value={wfdAnswers[q.id] || ""}
        onChange={(e) => setWfdAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
        className="text-lg font-medium"
      />
      {showResults[q.id] && (
        <div className="mt-2 p-3 bg-muted rounded text-sm font-medium">
          <span className="text-muted-foreground mr-2">Correct:</span>
          {q.correctAnswer}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Listening Practice</h1>
          <p className="text-muted-foreground">Master all listening task types with interactive exercises.</p>
        </div>
        <Badge variant="outline" className="text-base px-4 py-1 gap-2">
          <Headphones className="h-4 w-4" />
          50 Questions
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1 gap-1">
          <TabsTrigger value="SST">SST (5)</TabsTrigger>
          <TabsTrigger value="MC-MA">MC-MA (5)</TabsTrigger>
          <TabsTrigger value="FIB-L">FIB-L (10)</TabsTrigger>
          <TabsTrigger value="MC-SA">MC-SA (5)</TabsTrigger>
          <TabsTrigger value="SMW">SMW (5)</TabsTrigger>
          <TabsTrigger value="HIW">HIW (10)</TabsTrigger>
          <TabsTrigger value="WFD">WFD (10)</TabsTrigger>
        </TabsList>

        {["SST", "MC-MA", "FIB-L", "MC-SA", "SMW", "HIW", "WFD"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-6">
            {filterQuestions(type).map((q, idx) => (
              <Card key={q.id} className="overflow-hidden">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="bg-primary/10 text-primary text-sm font-bold px-2 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        {q.title}
                      </CardTitle>
                      <CardDescription>
                        {type === "SST" && "Summarize Spoken Text"}
                        {type === "MC-MA" && "Multiple Choice, Multiple Answers"}
                        {type === "FIB-L" && "Fill in the Blanks (Listening)"}
                        {type === "MC-SA" && "Multiple Choice, Single Answer"}
                        {type === "SMW" && "Select Missing Word"}
                        {type === "HIW" && "Highlight Incorrect Words"}
                        {type === "WFD" && "Write From Dictation"}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Timer Display */}
                      {playingId !== q.id && !showResults[q.id] && (questionTimers[q.id] || 0) > 0 && (
                        <div className={cn(
                          "flex items-center gap-1 font-mono text-sm",
                          (questionTimers[q.id] || 0) > 60 ? "text-red-500 animate-pulse" : "text-muted-foreground"
                        )}>
                           <Timer className="h-3 w-3" />
                           {formatTime(questionTimers[q.id] || 0)}
                        </div>
                      )}

                      <Button
                        size="icon"
                        variant={playingId === q.id ? "destructive" : "default"}
                        className="rounded-full shadow-md"
                        onClick={() => togglePlay(q.id, q.audioScript, q.type)}
                      >
                        {playingId === q.id ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                      </Button>
                    </div>
                  </div>
                  {playingId === q.id && (
                    <div className="h-1 w-full bg-muted mt-4 overflow-hidden rounded-full">
                      <div className="h-full bg-primary animate-[progress_10s_linear] w-full origin-left" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  {type === "SST" && renderSST(q)}
                  {type === "MC-MA" && renderMCMA(q)}
                  {type === "FIB-L" && renderFIB(q)}
                  {type === "MC-SA" && renderMCSA(q)}
                  {type === "SMW" && renderSMW(q)}
                  {type === "HIW" && renderHIW(q)}
                  {type === "WFD" && renderWFD(q)}

                  <div className="mt-6 flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={() => resetQuestion(q.id, q.type)}>
                       <RotateCcw className="h-3 w-3 mr-2" /> Reset
                    </Button>

                    <Button 
                      onClick={() => checkAnswer(q.id)} 
                      variant={showResults[q.id] ? "outline" : "default"}
                    >
                      {showResults[q.id] ? "Hide Answer" : "Submit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}