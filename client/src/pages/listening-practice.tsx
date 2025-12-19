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
import { Headphones, PlayCircle, PauseCircle, CheckCircle2, AlertCircle, ArrowRight, Timer, RotateCcw } from "lucide-react";
import { LISTENING_DATA, ListeningQuestion } from "@/lib/listening-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ListeningPractice() {
  const [activeTab, setActiveTab] = useState("SST");
  const [playingId, setPlayingId] = useState<string | null>(null);
  
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
        // Only increment timer if audio is NOT playing for that question, 
        // assuming timer counts "answering time" after audio.
        // But simplified: just count time since component mount/reset, maybe pause during audio?
        // Requirement: "audio timer plus answering time". 
        // Let's just count total time for simplicity and alert on answering time threshold.
        
        filterQuestions(activeTab).forEach(q => {
          if (playingId !== q.id && !showResults[q.id]) { // Count only when not playing audio and not finished
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

  const togglePlay = (id: string, text: string) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      window.speechSynthesis.cancel();
      setPlayingId(id);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      
      // Try to find a British voice
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(v => v.lang.includes("GB") || v.name.includes("UK"));
      if (britishVoice) utterance.voice = britishVoice;

      utterance.onend = () => setPlayingId(null);
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
  const renderSST = (q: ListeningQuestion) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">Prompt: {q.prompt}</p>
        <Textarea 
          placeholder="Type your summary here..." 
          className="min-h-[120px]"
          value={sstAnswers[q.id] || ""}
          onChange={(e) => setSstAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Word count: {(sstAnswers[q.id] || "").split(/\s+/).filter(Boolean).length}</span>
          <span>Target: 50-70 words</span>
        </div>
      </div>
      {showResults[q.id] && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 animate-in fade-in">
          <p className="text-sm font-semibold text-green-800 mb-1">Transcript:</p>
          <p className="text-sm text-green-700">{q.audioScript}</p>
        </div>
      )}
    </div>
  );

  const renderMCMA = (q: ListeningQuestion) => (
    <div className="space-y-4">
      <p className="font-medium text-sm">{q.prompt}</p>
      <div className="space-y-2">
        {q.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox 
              id={`${q.id}-${option}`}
              checked={(mcmaAnswers[q.id] || []).includes(option)}
              onCheckedChange={(checked) => {
                const current = mcmaAnswers[q.id] || [];
                if (checked) {
                  setMcmaAnswers(prev => ({ ...prev, [q.id]: [...current, option] }));
                } else {
                  setMcmaAnswers(prev => ({ ...prev, [q.id]: current.filter(o => o !== option) }));
                }
              }}
            />
            <Label htmlFor={`${q.id}-${option}`} className="text-sm cursor-pointer">{option}</Label>
            {showResults[q.id] && (q.correctAnswer as string[])?.includes(option) && (
              <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFIB = (q: ListeningQuestion) => {
    if (!q.transcript) return null;

    const parts = q.transcript.split(/(\[.*?\])/g);
    let inputIndex = 0;

    return (
      <div className="space-y-4">
        <div className="leading-8 text-lg">
          {parts.map((part, idx) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              const answer = part.slice(1, -1);
              const currentInputIndex = inputIndex++;
              const userAnswer = (fibAnswers[q.id] || [])[currentInputIndex] || "";
              
              return (
                <span key={idx} className="inline-block mx-1">
                  <Input 
                    className={`h-8 w-32 inline-block text-center ${
                      showResults[q.id] 
                        ? userAnswer.toLowerCase() === answer.toLowerCase() 
                          ? "border-green-500 bg-green-50 text-green-700" 
                          : "border-red-500 bg-red-50 text-red-700"
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
                    <span className="text-xs text-green-600 font-bold block text-center">{answer}</span>
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
                        onClick={() => togglePlay(q.id, q.audioScript)}
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