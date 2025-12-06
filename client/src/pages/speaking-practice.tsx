import { useState, useEffect, useRef } from "react";
import { SPEAKING_QUESTIONS, SpeakingTaskType } from "@/lib/speaking-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  PlayCircle, 
  RotateCcw, 
  Volume2, 
  FileText, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Timer,
  StopCircle
} from "lucide-react";

export default function SpeakingPractice() {
  const [activeTab, setActiveTab] = useState<SpeakingTaskType>("Read Aloud");
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<Record<SpeakingTaskType, number>>({
    "Read Aloud": 0,
    "Repeat Sentence": 0,
    "Describe Image": 0,
    "Retell Lecture": 0,
    "Summarize Group Discussion": 0,
    "Respond to a Situation": 0
  });
  
  const [status, setStatus] = useState<"idle" | "preparing" | "recording" | "completed">("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const currentQuestionIndex = currentQuestionIndices[activeTab];
  const questions = SPEAKING_QUESTIONS[activeTab];
  const currentQuestion = questions[currentQuestionIndex];

  // Reset state when tab or question changes
  useEffect(() => {
    resetState();
  }, [activeTab, currentQuestionIndex]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "preparing" || status === "recording") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  // Silence detection simulation (Mock)
  useEffect(() => {
    if (status === "recording") {
      silenceIntervalRef.current = setInterval(() => {
        setSilenceTimer(prev => {
          if (prev >= 2) {
            toast({
              variant: "destructive",
              title: "Silence Detected",
              description: "No audio detected for 2 seconds. Speak up!",
              duration: 2000
            });
            return 0; // Reset to avoid spamming, or keep warning
          }
          return prev + 0.5; // Increment mock silence
        });
      }, 500); // Check every 0.5s
    } else {
      setSilenceTimer(0);
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    }

    return () => {
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    };
  }, [status]);

  // Mock function to simulate "speaking" which resets silence timer
  // In a real app, this would be connected to AudioContext analyzer
  const simulateSpeaking = () => {
    setSilenceTimer(0);
  };

  // Add keypress listener to simulate speaking for testing? 
  // Or just assume user is "speaking" if they click something.
  // Since we can't access mic volume in this mock easily without user permission prompt issues in iframe,
  // we'll just show the alert if they DON'T interact or if we let the timer run.
  // Actually, let's auto-reset silence timer randomly to simulate intermittent speech for the prototype feel,
  // unless we really want to annoy the user. 
  // Better: Just strictly warn if they don't click a "I'm Speaking" button? No that's bad UX.
  // Let's just implement the timer and the *logic* for the alert, but maybe disable the actual trigger 
  // to avoid annoying the user who is just testing the UI, OR make it trigger once to show the feature.
  // I'll make it trigger if they don't click "Record" to stop? 
  // Let's just implement the visual timer and state transitions.

  const handleTimerComplete = () => {
    if (status === "preparing") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    }
  };

  const startPreparation = () => {
    setStatus("preparing");
    setTimeLeft(40); // 40s prep
    toast({
      title: "Preparation Started",
      description: "You have 40 seconds to prepare.",
    });
  };

  const startRecording = () => {
    setStatus("recording");
    setTimeLeft(40); // 40s recording
    toast({
      title: "Recording Started",
      description: "Speak now! Recording for 40 seconds.",
      variant: "default", 
      className: "bg-red-500 text-white border-none"
    });
  };

  const stopRecording = () => {
    setStatus("completed");
    setTimeLeft(0);
    toast({
      title: "Recording Completed",
      description: "Your response has been saved (mock).",
    });
  };

  const resetState = () => {
    setStatus("idle");
    setTimeLeft(0);
    setShowTranscript(false);
    setSilenceTimer(0);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + 1
      }));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] - 1
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" onMouseMove={simulateSpeaking} onKeyDown={simulateSpeaking}>
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Speaking Practice</h1>
        <p className="text-lg text-muted-foreground">
          Practice the key speaking tasks with our interactive simulation. Record your response and evaluate your fluency.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as SpeakingTaskType)} className="space-y-8">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start md:justify-center bg-muted/50 p-1 h-auto flex-wrap">
            {Object.keys(SPEAKING_QUESTIONS).map((type) => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card className="min-h-[500px] flex flex-col border-2 border-muted">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-2 bg-white">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <CardTitle className="text-xl font-serif">
                  {currentQuestion.title || activeTab}
                </CardTitle>
              </div>
              <div className="flex items-center gap-4">
                 {/* Timer Display */}
                 {(status === "preparing" || status === "recording") && (
                   <div className={`flex items-center gap-2 font-mono text-xl font-bold ${status === "recording" ? "text-red-500 animate-pulse" : "text-blue-600"}`}>
                     <Timer className="h-5 w-5" />
                     {timeLeft}s
                     <Badge variant={status === "recording" ? "destructive" : "secondary"} className="ml-2">
                       {status === "preparing" ? "PREPARING" : "RECORDING"}
                     </Badge>
                   </div>
                 )}

                 <div className="flex gap-2">
                   <Button 
                     variant="outline" 
                     size="icon" 
                     onClick={handlePrev} 
                     disabled={currentQuestionIndex === 0}
                   >
                     <ChevronLeft className="h-4 w-4" />
                   </Button>
                   <Button 
                     variant="outline" 
                     size="icon" 
                     onClick={handleNext} 
                     disabled={currentQuestionIndex === questions.length - 1}
                   >
                     <ChevronRight className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 text-center">
            
            {/* Image Display */}
            {currentQuestion.imageUrl && (
              <div className="rounded-lg overflow-hidden border shadow-sm max-w-2xl w-full">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt={currentQuestion.title} 
                  className="w-full h-auto max-h-[400px] object-contain bg-white"
                />
              </div>
            )}

            {/* Content Display */}
            <div className="max-w-3xl space-y-6 w-full">
              {activeTab === "Read Aloud" && (
                <p className="text-2xl leading-relaxed font-serif text-foreground/90">
                  {currentQuestion.content}
                </p>
              )}

              {activeTab === "Repeat Sentence" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click Start to prepare, then listen and repeat.</p>
                  <Button variant="secondary" onClick={() => setShowTranscript(!showTranscript)}>
                    {showTranscript ? "Hide Sentence" : "Show Sentence"}
                  </Button>
                  {showTranscript && (
                    <p className="text-lg font-medium animate-in fade-in slide-in-from-bottom-2">
                      {currentQuestion.content}
                    </p>
                  )}
                </div>
              )}

              {(activeTab === "Retell Lecture" || activeTab === "Summarize Group Discussion") && (
                 <div className="space-y-6">
                   <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                     <Volume2 className="h-10 w-10 text-secondary-foreground" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="font-medium text-lg">Audio Simulation</h3>
                     <div className="w-full max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-secondary w-1/2 animate-[pulse_2s_ease-in-out_infinite]" />
                     </div>
                   </div>
                   <Button variant="ghost" size="sm" onClick={() => setShowTranscript(!showTranscript)} className="gap-2">
                     <FileText className="h-4 w-4" /> 
                     {showTranscript ? "Hide Transcript" : "View Transcript"}
                   </Button>
                   {showTranscript && (
                     <div className="text-left bg-muted/30 p-6 rounded-lg text-sm leading-relaxed border max-h-[200px] overflow-y-auto">
                       {currentQuestion.audioScript}
                     </div>
                   )}
                 </div>
              )}

              {activeTab === "Respond to a Situation" && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-left space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <AlertCircle className="h-5 w-5" />
                    Situation
                  </div>
                  <p className="text-lg text-blue-900">
                    {currentQuestion.content}
                  </p>
                </div>
              )}
               
               {activeTab === "Describe Image" && (
                 <p className="text-muted-foreground italic">
                   {currentQuestion.content}
                 </p>
               )}
            </div>

          </CardContent>
          
          <CardFooter className="border-t p-6 bg-muted/5 flex justify-between items-center">
             <Button variant="ghost" onClick={resetState}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset / Redo
             </Button>

             <div className="flex gap-4">
               {status === "idle" && (
                 <Button size="lg" className="w-40 gap-2 font-bold" onClick={startPreparation}>
                   Start
                 </Button>
               )}

               {status === "preparing" && (
                 <Button size="lg" className="w-40 gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white" onClick={startRecording}>
                   Skip Prep
                 </Button>
               )}

               {status === "recording" && (
                 <Button 
                   size="lg" 
                   className="w-40 gap-2 font-bold bg-red-500 hover:bg-red-600 text-white animate-pulse"
                   onClick={stopRecording}
                 >
                   <StopCircle className="h-4 w-4" /> Stop
                 </Button>
               )}

               {status === "completed" && (
                 <Button size="lg" variant="outline" className="w-40 gap-2">
                   <PlayCircle className="h-4 w-4" /> Playback
                 </Button>
               )}
             </div>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-muted-foreground mt-8">
          <div className="p-4 rounded-lg bg-muted/20">
            <strong className="block text-foreground mb-1">Fluency</strong>
            Speak naturally without long pauses
          </div>
          <div className="p-4 rounded-lg bg-muted/20">
            <strong className="block text-foreground mb-1">Pronunciation</strong>
            Articulate words clearly
          </div>
          <div className="p-4 rounded-lg bg-muted/20">
            <strong className="block text-foreground mb-1">Content</strong>
            Cover all key points
          </div>
        </div>
      </Tabs>
    </div>
  );
}