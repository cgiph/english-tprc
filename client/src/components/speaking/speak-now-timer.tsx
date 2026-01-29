import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Timer, AlertTriangle, RefreshCw, Trophy, Volume2, Square } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { playBuzzer } from "@/components/speaking/buzzer";

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
  const [status, setStatus] = useState<"idle" | "countdown" | "recording" | "success" | "fail" | "mid-silence-fail">("idle");
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [prompt, setPrompt] = useState("");
  const [reactionTime, setReactionTime] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">("standard");
  const [volume, setVolume] = useState(0);
  const [flashFail, setFlashFail] = useState(false);
  const [silenceMs, setSilenceMs] = useState(0);
  const [attempt, setAttempt] = useState<{
    startedAt: number;
    endedAt: number;
    prompt: string;
    reactionTimeSec: number | null;
    silenceWarnings: number;
    result: "PASS" | "FAIL" | "FAIL (MID-SILENCE)" | null;
  } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const recordingStartTimeRef = useRef<number>(0);
  const silenceStartRef = useRef<number>(0);
  const lastWarningBucketRef = useRef<number>(-1);
  const attemptStartRef = useRef<number>(0);
  
  // State required for the monitoring loop to know the current status without stale closures
  const statusRef = useRef<"idle" | "countdown" | "recording" | "success" | "fail" | "mid-silence-fail">("idle");

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
      statusRef.current = "countdown";
      
      setTimeLeft(3.0);
      setVolume(0);
      setSilenceMs(0);
      setAttempt(null);
      attemptStartRef.current = Date.now();
      startTimeRef.current = attemptStartRef.current;
      silenceStartRef.current = 0; // Reset silence tracker
      lastWarningBucketRef.current = -1;
      
      // 4. Start Monitoring Loop
      monitorAudio();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for this feature.");
    }
  };

  const triggerFailUX = () => {
    // Loud buzzer + quick red flash overlay (subtle)
    try {
      playBuzzer({ volume: 1 });
    } catch {
      // ignore
    }

    setFlashFail(true);
    window.setTimeout(() => setFlashFail(false), 220);
  };

  const recordingLimitSec = difficulty === "easy" ? 5 : difficulty === "hard" ? 20 : 10;

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
    const threshold = 15; 
    const now = Date.now();

    if (statusRef.current === "countdown") {
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 3.0 - elapsed);
      setTimeLeft(remaining);

      if (average > threshold && elapsed > 0.1) { 
        // SUCCESS: Sound detected! Switch to RECORDING phase
        setStatus("recording");
        statusRef.current = "recording";
        
        setReactionTime(elapsed);
        recordingStartTimeRef.current = now;
        silenceStartRef.current = 0; // Initialize silence tracker for recording phase
        lastWarningBucketRef.current = -1;
        setSilenceMs(0);
        setTimeLeft(recordingLimitSec);
      } else if (remaining <= 0) {
        // FAILURE: Time up!
        triggerFailUX();
        setStatus("fail");
        statusRef.current = "fail";
        setAttempt({
          startedAt: attemptStartRef.current,
          endedAt: now,
          prompt,
          reactionTimeSec: null,
          silenceWarnings: 0,
          result: "FAIL",
        });
        stopMonitoring();
      }
    } else if (statusRef.current === "recording") {
      const elapsedRecording = (now - recordingStartTimeRef.current) / 1000;
      const remainingRecording = Math.max(0, recordingLimitSec - elapsedRecording);
      setTimeLeft(remainingRecording);

      // Mid-speech silence detection
      if (average < threshold) {
        if (silenceStartRef.current === 0) {
          silenceStartRef.current = now;
        }

        const silenceDuration = now - silenceStartRef.current;
        setSilenceMs(silenceDuration);

        // Count \"silence warnings\" as you approach cutoff (every 0.5s after 1.5s)
        const warningBucket = silenceDuration >= 1500 ? Math.floor((silenceDuration - 1500) / 500) : -1;
        if (warningBucket > lastWarningBucketRef.current) {
          lastWarningBucketRef.current = warningBucket;
        }

        if (silenceDuration > 3000) { // 3 seconds silence
          triggerFailUX();
          setStatus("mid-silence-fail");
          statusRef.current = "mid-silence-fail";
          setAttempt({
            startedAt: attemptStartRef.current,
            endedAt: now,
            prompt,
            reactionTimeSec: reactionTimeSecSafe(reactionTime),
            silenceWarnings: Math.max(0, lastWarningBucketRef.current + 1),
            result: "FAIL (MID-SILENCE)",
          });
          stopMonitoring();
          return;
        }
      } else {
        silenceStartRef.current = 0; // Reset silence if sound detected
        setSilenceMs(0);
      }

      if (remainingRecording <= 0) {
        // Recording finished successfully
        finishRecording();
      }
    }

    if (statusRef.current !== "idle" && statusRef.current !== "success" && statusRef.current !== "fail" && statusRef.current !== "mid-silence-fail") {
       requestRef.current = requestAnimationFrame(monitorAudio);
    }
  };

  const finishRecording = () => {
    const now = Date.now();
    setStatus("success");
    statusRef.current = "success";
    setAttempt({
      startedAt: attemptStartRef.current,
      endedAt: now,
      prompt,
      reactionTimeSec: reactionTimeSecSafe(reactionTime),
      silenceWarnings: Math.max(0, lastWarningBucketRef.current + 1),
      result: "PASS",
    });
    stopMonitoring();
  };

  const reactionTimeSecSafe = (rt: number) => {
    if (!Number.isFinite(rt) || rt <= 0) return null;
    return rt;
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
    <div className="relative" data-testid="card-speak-now-timer">
      <div
        className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200 ${flashFail ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(239, 68, 68, 0.22)" }}
        data-testid="overlay-fail-flash"
      />

      <Card className={`border-2 transition-all duration-300 ${
      status === "fail" || status === "mid-silence-fail" ? "border-red-500 bg-red-50" : 
      status === "success" ? "border-green-500 bg-green-50" : 
      status === "recording" ? "border-blue-500 bg-blue-50" :
      "border-primary/20 hover:border-primary/40"
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Speak-Now Timer
              <Badge variant={status === "countdown" ? "destructive" : status === "recording" ? "default" : "secondary"} className="ml-2 animate-in fade-in">
                {status === "countdown" ? "MIC LIVE" : status === "recording" ? `RECORDING • ${difficulty === "easy" ? "Easy 5s" : difficulty === "hard" ? "Hard 20s" : "Standard 10s"}` : "3-Second Rule"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Train your reflex! Start speaking within 3 seconds or the mic closes.
            </CardDescription>
          </div>
          {status !== "idle" && status !== "success" && status !== "fail" && status !== "mid-silence-fail" && (
            <div className="text-2xl font-bold font-mono w-20 text-right">
              {timeLeft.toFixed(1)}s
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Main Display Area */}
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 rounded-xl bg-white border shadow-inner text-center relative overflow-hidden">
          
          {status === "idle" && (
            <div className="space-y-4">
              <div className="w-full max-w-md mx-auto" data-testid="group-difficulty">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recording difficulty</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDifficulty("easy")}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${difficulty === "easy" ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" : "bg-white hover:bg-muted/40"}`}
                    data-testid="button-difficulty-easy"
                  >
                    Easy
                    <span className="block text-[11px] font-normal text-muted-foreground">5s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty("standard")}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${difficulty === "standard" ? "bg-blue-50 border-blue-300 text-blue-800 shadow-sm" : "bg-white hover:bg-muted/40"}`}
                    data-testid="button-difficulty-standard"
                  >
                    Standard
                    <span className="block text-[11px] font-normal text-muted-foreground">10s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty("hard")}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${difficulty === "hard" ? "bg-red-50 border-red-300 text-red-800 shadow-sm" : "bg-white hover:bg-muted/40"}`}
                    data-testid="button-difficulty-hard"
                  >
                    Hard
                    <span className="block text-[11px] font-normal text-muted-foreground">20s</span>
                  </button>
                </div>
              </div>
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

          {(status === "countdown" || status === "recording") && (
            <div className="space-y-4 relative z-10 w-full">
              {status === "countdown" ? (
                 <p className="text-sm uppercase tracking-widest text-red-500 font-bold animate-pulse">Speak Now!</p>
              ) : (
                 <p className="text-sm uppercase tracking-widest text-blue-500 font-bold flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Keep Speaking...
                 </p>
              )}
              
              <h3 className="text-2xl font-bold text-foreground leading-tight px-4 transition-all duration-300">
                "{prompt}"
              </h3>
              
              <div className="w-full max-w-xs mx-auto space-y-1">
                 <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Volume Level</span>
                 </div>
                 <Progress value={(volume / 100) * 100} className={`h-2 ${status === "recording" ? "bg-blue-100" : "bg-red-100"}`} />
              </div>

              {status === "recording" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Good start! Keep going for {timeLeft.toFixed(0)}s...</p>

                  <div className="mx-auto max-w-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Silence meter</span>
                      <span className={`font-mono ${silenceMs >= 2000 ? "text-amber-700" : "text-muted-foreground"}`}>
                        {(silenceMs / 1000).toFixed(1)}s / 3.0s
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-[width] duration-75 ${
                          silenceMs >= 2500 ? "bg-red-500" : silenceMs >= 1500 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, (silenceMs / 3000) * 100)}%` }}
                        data-testid="meter-silence"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      If you pause for <span className="font-semibold">3 seconds</span>, the mic closes.
                    </p>
                  </div>
                </div>
              )}
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
                 <p className="text-sm text-muted-foreground mt-2">Reflex test passed.</p>
               </div>
             </div>
          )}

          {attempt && (status === "success" || status === "fail" || status === "mid-silence-fail") && (
            <div className="mt-6 w-full max-w-xl mx-auto rounded-xl border bg-muted/20 p-4 text-left" data-testid="card-attempt-summary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attempt Summary</p>
                  <p className="mt-1 text-sm font-semibold text-foreground" data-testid="text-attempt-result">
                    Result: <span className={attempt.result === "PASS" ? "text-green-700" : "text-red-700"}>{attempt.result}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-mono text-sm" data-testid="text-attempt-duration">
                    {Math.max(0, (attempt.endedAt - attempt.startedAt) / 1000).toFixed(1)}s
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-white border p-3">
                  <p className="text-xs text-muted-foreground">Reaction time</p>
                  <p className="font-mono text-sm" data-testid="text-attempt-reaction">
                    {attempt.reactionTimeSec ? `${attempt.reactionTimeSec.toFixed(2)}s` : "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-white border p-3">
                  <p className="text-xs text-muted-foreground">Silence warnings</p>
                  <p className="font-mono text-sm" data-testid="text-attempt-warnings">{attempt.silenceWarnings}</p>
                </div>
                <div className="rounded-lg bg-white border p-3">
                  <p className="text-xs text-muted-foreground">Prompt</p>
                  <p className="text-sm font-medium leading-snug" data-testid="text-attempt-prompt">{attempt.prompt}</p>
                </div>
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
                 <p className="text-xs text-red-500 mt-1">You waited too long to start!</p>
               </div>
             </div>
          )}
          
          {status === "mid-silence-fail" && (
             <div className="space-y-3 animate-in shake duration-300">
               <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                 <AlertTriangle className="h-8 w-8 text-orange-600" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-orange-700">SILENCE DETECTED</h3>
                 <p className="text-orange-600 font-medium">Score: 0</p>
                 <p className="text-xs text-orange-500 mt-1">Mic closed due to &gt;3s silence mid-speech.</p>
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
          
          {/* Background Progress Bar for Recording */}
          {status === "recording" && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-linear"
              style={{ width: `${(timeLeft / recordingLimitSec) * 100}%` }}
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
               variant={status === "recording" ? "destructive" : status === "countdown" ? "ghost" : "default"} 
               onClick={status === "recording" ? finishRecording : status === "countdown" ? undefined : startChallenge}
               disabled={status === "countdown"}
               className="w-full sm:w-auto min-w-[200px] gap-2"
             >
               {status === "countdown" ? (
                 <span className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                   <div className="h-3 w-3 bg-red-500 rounded-full" /> Waiting for sound...
                 </span>
               ) : status === "recording" ? (
                 <>
                   <Square className="h-5 w-5 fill-current" /> Stop Recording
                 </>
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
    </div>
  );
}
