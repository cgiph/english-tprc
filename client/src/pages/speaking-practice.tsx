import { useState, useEffect, useRef } from "react";
import { SPEAKING_QUESTIONS, SpeakingTaskType } from "@/lib/speaking-data";
import { calculateSpeakingScore, SpeakingScore, SCORING_CRITERIA } from "@/lib/scoring-utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  StopCircle,
  BarChart3
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
  
  const [status, setStatus] = useState<"idle" | "preparing" | "recording" | "completed" | "playing" | "waiting">("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [score, setScore] = useState<SpeakingScore | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Beep for 0.5 seconds
  };

  const speakText = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    if (onEnd) {
      utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
  };

  const startRecordingAudio = async () => {
    try {
      setRecordedChunks([]);
      setRecordedAudioUrl(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop()); 
      };

      // Request data every 1s to ensure we have chunks even if stopped early
      recorder.start(1000); 
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Failed",
        description: "Using simulated recording mode.",
      });
      
      // Fallback: Simulate a recording so playback isn't empty
      // Create a dummy blob or just a timer to set a fake URL?
      // We can't easily create a fake audio blob without Web Audio API complex setup.
      // We'll just simulate the state so the UI doesn't break, but playback won't produce sound.
      // OR we can use a very short silent audio base64 if needed.
      
      setMediaRecorder(null);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
        // If we were in simulated mode (mediaRecorder is null but status was recording)
        // We should set a dummy URL so "Playback" button works (even if silent/fake)
        // so the user doesn't see "No Recording" error.
        // Use a placeholder audio for simulation
        setRecordedAudioUrl("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"); // Dummy file
    }
  };

  const playRecording = () => {
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      audio.play();
    } else {
      toast({
        title: "No Recording",
        description: "No audio was recorded.",
        variant: "destructive"
      });
    }
  };

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

    if (status === "preparing" || status === "recording" || status === "waiting") {
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

  // Silence detection simulation (Mock) - REMOVED AGGRESSIVE ALERT
  // Instead, we just use a visualizer to show "fake" audio presence
  useEffect(() => {
    if (status === "recording") {
      // Auto-reset silence timer to prevent any weird states, though we removed the toast trigger
      const interval = setInterval(() => {
         // Do nothing, just keep interval for cleanup if we need it
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleTimerComplete = () => {
    if (status === "preparing") {
      startRecording();
    } else if (status === "waiting") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    }
  };

  const startPreparation = () => {
    if (activeTab === "Repeat Sentence") {
      setStatus("playing");
      toast({
        title: "Audio Playing",
        description: "Listen carefully...",
      });
      speakText(currentQuestion.content, () => {
        setStatus("waiting");
        setTimeLeft(5); // 5 second delay before beep/recording
        toast({
           title: "Get Ready",
           description: "Recording starts in 5 seconds...",
        });
      });
      return;
    }
    
    // For Retell Lecture, Summarize Group Discussion, and Respond to a Situation
    // Audio plays immediately, then 10s prep, then recording
    if (activeTab === "Retell Lecture" || activeTab === "Summarize Group Discussion" || activeTab === "Respond to a Situation") {
      setStatus("playing");
      toast({
        title: "Audio Playing",
        description: "Listen carefully...",
      });
      
      // Use audioScript if available, otherwise content (for Respond to a Situation)
      const textToPlay = currentQuestion.audioScript || currentQuestion.content;
      
      speakText(textToPlay, () => {
        setStatus("preparing"); // Reusing "preparing" state which triggers countdown
        setTimeLeft(10); // 10s prep
        toast({
           title: "Preparation",
           description: "You have 10 seconds to prepare.",
        });
      });
      return;
    }

    setStatus("preparing");
    setTimeLeft(40); // 40s prep
    toast({
      title: "Preparation Started",
      description: "You have 40 seconds to prepare.",
    });
  };

  const startRecording = () => {
    playBeep(); // Beep on start
    startRecordingAudio(); // Start actual recording
    setStatus("recording");
    setTimeLeft(40); // 40s recording
    setRecordingDuration(0); // Reset duration
    toast({
      title: "Recording Started",
      description: "Speak now! Recording for 40 seconds.",
      variant: "default", 
      className: "bg-red-500 text-white border-none"
    });
  };

  const stopRecording = () => {
    const duration = 40 - timeLeft; // Calculate duration before resetting time
    setRecordingDuration(duration);
    
    stopRecordingAudio(); // Stop actual recording
    setStatus("completed");
    setTimeLeft(0);
    toast({
      title: "Recording Completed",
      description: "Your response has been saved (mock).",
    });
  };

  const resetState = () => {
    stopAudio();
    setStatus("idle");
    setTimeLeft(0);
    setShowTranscript(false);
    setSilenceTimer(0);
    setRecordedAudioUrl(null);
    setRecordedChunks([]);
    setMediaRecorder(null);
    setScore(null);
    setIsScoring(false);
    setRecordingDuration(0);
  };

  const handleScore = () => {
    setIsScoring(true);
    // Simulate processing delay
    setTimeout(() => {
      // Calculate mock score based on task and duration
      // In real app, we'd send the audio blob to backend
      const newScore = calculateSpeakingScore(activeTab, recordingDuration);
      setScore(newScore);
      setIsScoring(false);
      toast({
        title: "Scoring Complete",
        description: `Overall Score: ${newScore.overall}/90`,
      });
    }, 1500);
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

  // Mock function to simulate "speaking" which resets silence timer
  // In a real app, this would be connected to AudioContext analyzer
  const simulateSpeaking = () => {
    setSilenceTimer(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
                 {(status === "preparing" || status === "recording" || status === "waiting") && (
                   <div className={`flex items-center gap-2 font-mono text-xl font-bold ${status === "recording" ? "text-red-500 animate-pulse" : "text-blue-600"}`}>
                     <Timer className="h-5 w-5" />
                     {timeLeft}s
                     <Badge variant={status === "recording" ? "destructive" : "secondary"} className="ml-2">
                       {status === "preparing" ? "PREPARING" : status === "waiting" ? "GET READY" : "RECORDING"}
                     </Badge>
                   </div>
                 )}
                 
                 {status === "playing" && (
                    <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-600">
                      <Volume2 className="h-5 w-5 animate-pulse" />
                      <Badge variant="secondary" className="ml-2">PLAYING AUDIO</Badge>
                    </div>
                 )}

                 {/* Audio Visualizer Simulation */}
                 {status === "recording" && (
                   <div className="flex items-end gap-1 h-8 w-24">
                     {[...Array(8)].map((_, i) => (
                       <div 
                         key={i} 
                         className="w-2 bg-red-500 rounded-full animate-bounce"
                         style={{ 
                           height: `${Math.random() * 100}%`,
                           animationDuration: `${0.5 + Math.random() * 0.5}s`,
                           animationDelay: `${Math.random() * 0.5}s`
                         }}
                       />
                     ))}
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
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => speakText(currentQuestion.content)}>
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click Start or the icon above to listen, then repeat.</p>
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
                   <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => speakText(currentQuestion.audioScript || "")}>
                     <Volume2 className="h-10 w-10 text-secondary-foreground" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="font-medium text-lg">Audio Simulation</h3>
                     <Button variant="outline" size="sm" onClick={() => speakText(currentQuestion.audioScript || "")} className="gap-2 mb-2">
                        <PlayCircle className="h-4 w-4" /> Play Audio
                     </Button>
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
              {/* Score Display */}
              {score && (
                <div className="w-full max-w-3xl bg-slate-50 border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                       <BarChart3 className="h-6 w-6" /> 
                       Score Analysis
                     </h3>
                     <Badge variant={score.overall >= 65 ? "default" : "secondary"} className="text-lg px-3 py-1">
                       Overall: {score.overall}/90
                     </Badge>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm font-medium">
                         <span>Content</span>
                         <span>{score.content}/90</span>
                       </div>
                       <Progress value={(score.content / 90) * 100} className="h-2" />
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm font-medium">
                         <span>Fluency</span>
                         <span>{score.fluency}/90</span>
                       </div>
                       <Progress value={(score.fluency / 90) * 100} className="h-2" />
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm font-medium">
                         <span>Pronunciation</span>
                         <span>{score.pronunciation}/90</span>
                       </div>
                       <Progress value={(score.pronunciation / 90) * 100} className="h-2" />
                     </div>
                   </div>

                   <div className="bg-white border p-4 rounded-lg">
                     <h4 className="font-bold mb-2 text-sm text-muted-foreground uppercase">Feedback</h4>
                     <p className="text-foreground">{score.feedback}</p>
                   </div>
                </div>
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
               
               {(status === "playing" || status === "waiting") && (
                 <Button size="lg" className="w-40 gap-2 font-bold" disabled>
                   {status === "playing" ? "Listening..." : "Wait..."}
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
                 <>
                   <Button size="lg" variant="outline" className="w-32 gap-2" onClick={playRecording}>
                     <PlayCircle className="h-4 w-4" /> Playback
                   </Button>
                   {!score && (
                     <Button size="lg" className="w-32 gap-2" onClick={handleScore} disabled={isScoring}>
                       {isScoring ? "Analyzing..." : "Get Score"}
                     </Button>
                   )}
                 </>
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