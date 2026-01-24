import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Timer, AlertTriangle, RefreshCw, Trophy, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PROMPTS = [
  "Describe your favorite city.",
  "What is your favorite food and why?",
  "Describe the room you are currently in.",
  "Talk about your daily routine.",
  "What are your plans for the weekend?",
  "Describe your best friend.",
  "Talk about a movie you watched recently.",
  "Why are you learning English?",
  "Describe your dream job.",
  "What is the most interesting place you have visited?",
  "Talk about a hobby you enjoy.",
  "Describe a typical day in your life.",
];

export default function SpeakNowTimer() {
  const [status, setStatus] = useState<"idle" | "countdown" | "success" | "fail">("idle");
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [prompt, setPrompt] = useState("");
  const [reactionTime, setReactionTime] = useState(0);
  const [volume, setVolume] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startChallenge = async () => {
    try {
      // 1. Get Mic Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Setup Audio Analysis
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyserRef.current = analyser;

      // 3. Set Prompt & State
      setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
      setStatus("countdown");
      setTimeLeft(3.0);
      setVolume(0);
      startTimeRef.current = Date.now();
      
      // 4. Start Monitoring Loop
      monitorAudio();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for this feature.");
    }
  };

  const monitorAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    setVolume(average); // For visual feedback

    // Threshold for "speaking" (adjustable)
    const threshold = 20; 

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, 3.0 - elapsed);
    
    setTimeLeft(remaining);

    if (average > threshold && elapsed > 0.1) { // 0.1s buffer to avoid initial click noise
      // SUCCESS: Sound detected!
      setStatus("success");
      setReactionTime(elapsed);
      stopMonitoring();
    } else if (remaining <= 0) {
      // FAILURE: Time up!
      setStatus("fail");
      stopMonitoring();
    } else {
      // Continue
      requestRef.current = requestAnimationFrame(monitorAudio);
    }
  };

  const stopMonitoring = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <Card className={`border-2 transition-all duration-300 ${
      status === "fail" ? "border-red-500 bg-red-50" : 
      status === "success" ? "border-green-500 bg-green-50" : 
      "border-primary/20 hover:border-primary/40"
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Speak-Now Timer
              <Badge variant={status === "countdown" ? "destructive" : "secondary"} className="ml-2 animate-in fade-in">
                {status === "countdown" ? "MIC LIVE" : "3-Second Rule"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Train your reflex! Start speaking within 3 seconds or the mic closes.
            </CardDescription>
          </div>
          {status !== "idle" && (
            <div className="text-2xl font-bold font-mono w-20 text-right">
              {timeLeft.toFixed(2)}s
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Main Display Area */}
        <div className="min-h-[160px] flex flex-col items-center justify-center p-6 rounded-xl bg-white border shadow-inner text-center relative overflow-hidden">
          
          {status === "idle" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                 <Mic className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">
                Click start to receive a random prompt.
                <br/>
                <span className="text-xs text-muted-foreground/70">Warning: You only have 3 seconds to start speaking!</span>
              </p>
            </div>
          )}

          {status === "countdown" && (
            <div className="space-y-4 relative z-10 w-full">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold animate-pulse">Speak Now!</p>
              <h3 className="text-2xl font-bold text-foreground leading-tight px-4">
                "{prompt}"
              </h3>
              <div className="w-full max-w-xs mx-auto">
                 <Progress value={(volume / 100) * 100} className="h-2" />
              </div>
            </div>
          )}

          {status === "success" && (
             <div className="space-y-3 animate-in zoom-in-50 duration-300">
               <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                 <Trophy className="h-8 w-8 text-green-600" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-green-700">Excellent!</h3>
                 <p className="text-green-600">You started speaking in <span className="font-bold text-2xl">{reactionTime.toFixed(2)}s</span></p>
               </div>
             </div>
          )}

          {status === "fail" && (
             <div className="space-y-3 animate-in shake duration-300">
               <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                 <AlertTriangle className="h-8 w-8 text-red-600" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-red-700">MIC CLOSED</h3>
                 <p className="text-red-600 font-medium">Score: 0</p>
                 <p className="text-xs text-red-500 mt-1">You waited too long!</p>
               </div>
             </div>
          )}
          
          {/* Background Progress Bar for Countdown */}
          {status === "countdown" && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-100 ease-linear"
              style={{ width: `${(timeLeft / 3) * 100}%` }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          {status === "idle" ? (
             <Button size="lg" onClick={startChallenge} className="w-full sm:w-auto min-w-[200px] gap-2 shadow-md">
               <Volume2 className="h-5 w-5" /> Start Challenge
             </Button>
          ) : (
             <Button 
               size="lg" 
               variant={status === "countdown" ? "ghost" : "default"} 
               onClick={status === "countdown" ? undefined : startChallenge}
               disabled={status === "countdown"}
               className="w-full sm:w-auto min-w-[200px] gap-2"
             >
               {status === "countdown" ? (
                 <span className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                   <div className="h-3 w-3 bg-red-500 rounded-full" /> Recording...
                 </span>
               ) : (
                 <>
                   <RefreshCw className="h-5 w-5" /> Try Another
                 </>
               )}
             </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
