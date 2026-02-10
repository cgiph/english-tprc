import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Mic, Eye, CheckCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";

interface PracticeSentence {
  id: string;
  text: string;
  audioRate: number; // 1.0 is normal, 0.9 slow, 1.2 fast
}

const SENTENCES: Record<Difficulty, PracticeSentence[]> = {
  easy: [
    { id: "e1", text: "The library is located on the north side of the campus.", audioRate: 0.9 },
    { id: "e2", text: "Please turn off your mobile phones during the lecture.", audioRate: 0.9 },
    { id: "e3", text: "All students must submit their assignments by Friday.", audioRate: 0.9 },
    { id: "e4", text: "The cafeteria serves breakfast until nine o'clock.", audioRate: 0.9 },
    { id: "e5", text: "We have a lot of work to do before the deadline.", audioRate: 0.9 },
  ],
  medium: [
    { id: "m1", text: "The results of the experiment were inconclusive and further research is needed.", audioRate: 1.0 },
    { id: "m2", text: "Globalization has interconnected the world's economies in unprecedented ways.", audioRate: 1.0 },
    { id: "m3", text: "Statistical analysis indicates a strong correlation between the two variables.", audioRate: 1.0 },
    { id: "m4", text: "The professor demonstrated how to use the new software in the laboratory.", audioRate: 1.0 },
    { id: "m5", text: "Critical thinking is an essential skill for success in higher education.", audioRate: 1.0 },
  ],
  hard: [
    { id: "h1", text: "The intricate relationship between climate change and economic stability cannot be overstated.", audioRate: 1.1 },
    { id: "h2", text: "Contemporary urban planning focuses on sustainable development and reducing carbon footprints.", audioRate: 1.2 },
    { id: "h3", text: "Philosophical arguments regarding the nature of consciousness have evolved significantly over centuries.", audioRate: 1.1 },
    { id: "h4", text: "The archaeological evidence suggests that the settlement was abandoned due to environmental degradation.", audioRate: 1.2 },
    { id: "h5", text: "Microeconomic theory assumes that individuals act rationally to maximize their utility.", audioRate: 1.2 },
  ]
};

export function RepeatSentencePractice() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const handlePlay = (sentence: PracticeSentence) => {
    if (playingId) return; // Prevent overlapping playback
    
    setPlayingId(sentence.id);
    setRevealedId(null); // Hide text when re-playing to force listening

    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.rate = sentence.audioRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use a decent voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en-GB")) || voices.find(v => v.lang.includes("en-US"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleReveal = (id: string) => {
    if (revealedId === id) {
      setRevealedId(null);
    } else {
      setRevealedId(id);
    }
  };

  const handleRecord = (id: string) => {
    if (recordingId === id) {
      setRecordingId(null);
      // Simulate completion
      if (!completedIds.includes(id)) {
        setCompletedIds([...completedIds, id]);
      }
    } else {
      setRecordingId(id);
      // Auto-stop after 5 seconds
      setTimeout(() => {
        setRecordingId(null);
        if (!completedIds.includes(id)) {
            setCompletedIds(prev => [...prev, id]);
        }
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-6">
        <div>
           <h3 className="text-2xl font-bold text-slate-800">Audio Practice Lab</h3>
           <p className="text-slate-500">Listen carefully and repeat. Select your difficulty level.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
                difficulty === level 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {SENTENCES[difficulty].map((item, index) => (
          <Card key={item.id} className={cn("transition-all border-l-4", 
             completedIds.includes(item.id) ? "border-l-green-500 bg-green-50/30" : "border-l-slate-200 hover:border-l-blue-400"
          )}>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-grow">
                   {revealedId === item.id || completedIds.includes(item.id) ? (
                     <p className="text-lg font-medium text-slate-800">{item.text}</p>
                   ) : (
                     <div className="h-7 w-full max-w-md bg-slate-100 rounded animate-pulse" />
                   )}
                   <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 border-slate-200">
                        {difficulty === "easy" ? "Short" : difficulty === "medium" ? "Standard" : "Complex"}
                      </Badge>
                      {completedIds.includes(item.id) && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                      )}
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button 
                  size="icon" 
                  variant="outline"
                  className={cn("h-10 w-10 rounded-full", playingId === item.id && "animate-pulse border-blue-400 text-blue-600")}
                  onClick={() => handlePlay(item)}
                  disabled={!!playingId && playingId !== item.id}
                >
                  <Play className={cn("h-4 w-4", playingId === item.id && "fill-current")} />
                </Button>

                <Button 
                  size="icon" 
                  variant={recordingId === item.id ? "destructive" : "secondary"}
                  className={cn("h-10 w-10 rounded-full", recordingId === item.id && "animate-pulse")}
                  onClick={() => handleRecord(item.id)}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-10 w-10 rounded-full text-slate-400 hover:text-slate-600"
                  onClick={() => toggleReveal(item.id)}
                  title={revealedId === item.id ? "Hide Text" : "Show Text"}
                >
                  {revealedId === item.id ? <RotateCcw className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
         <p className="text-sm text-slate-500">
           <strong>Pro Tip:</strong> Listen once, close your eyes, repeat, then check the text. Don't read while listening!
         </p>
      </div>
    </div>
  );
}
