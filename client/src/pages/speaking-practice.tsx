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
  Users,
  BarChart3
} from "lucide-react";

export default function SpeakingPractice() {
  const [activeTab, setActiveTab] = useState<SpeakingTaskType>("Read Aloud");
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<Record<SpeakingTaskType, number>>({
    "Read Aloud": 0,
    "Repeat Sentence": 0,
    "Describe Image": 0,
    "Retell Lecture": 0,
    "Answer Short Question": 0,
    "Summarize Group Discussion": 0,
    "Respond to a Situation": 0
  });
  
  const [status, setStatus] = useState<"idle" | "preparing" | "recording" | "completed" | "playing" | "waiting">("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioTime, setAudioTime] = useState(0);
  const [audioTotalTime, setAudioTotalTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [score, setScore] = useState<SpeakingScore | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [hasSpeechDetected, setHasSpeechDetected] = useState(false); // New state for VAD
  
  // Speech Recognition State
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const recognitionRef = useRef<any>(null);
  const lastSpeechTimeRef = useRef<number>(0);

  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAudioCancelledRef = useRef(false);

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

  const speakConversation = (text: string, onEnd?: () => void) => {
    isAudioCancelledRef.current = false;
    window.speechSynthesis.cancel();
    
    // Simple split by likely speaker delimiters (Person X:, Student Y:, etc.)
    // We'll look for pattern: (Word Word): or (Word): at start or preceded by space
    const segments = text.split(/(?=(?:[A-Z][a-z]+ [A-Z0-9]+|[A-Z][a-z]+):)/g).filter(s => s.trim());

    if (segments.length === 0) {
       // Fallback for single speaker text
       const utterance = new SpeechSynthesisUtterance(text);
       utterance.lang = 'en-GB';
       if (onEnd) utterance.onend = onEnd;
       window.speechSynthesis.speak(utterance);
       return;
    }

    const voices = window.speechSynthesis.getVoices();
    // Try to pick distinct voices
    const availableVoices = voices.filter(v => v.lang.startsWith('en'));
    const speakerVoices: Record<string, SpeechSynthesisVoice> = {};
    let voiceIndex = 0;

    const speakSegment = (index: number) => {
        if (isAudioCancelledRef.current) return;

        if (index >= segments.length) {
            if (onEnd) onEnd();
            return;
        }

        const segment = segments[index];
        const match = segment.match(/^([A-Z][a-z]+(?: [A-Z0-9]+)?):/);
        const speaker = match ? match[1] : "Unknown";
        
        // Remove speaker name from spoken text for more natural dialogue
        // e.g. "Student A: Hello" -> "Hello"
        const textToSpeak = speaker !== "Unknown" ? segment.replace(/^([A-Z][a-z]+(?: [A-Z0-9]+)?):/, "").trim() : segment;

        // Assign voice if not already assigned
        if (!speakerVoices[speaker]) {
             // Rotate through available english voices
             if (availableVoices.length > 0) {
                 speakerVoices[speaker] = availableVoices[voiceIndex % availableVoices.length];
                 voiceIndex++;
             }
        }
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-GB';
        if (speakerVoices[speaker]) {
            utterance.voice = speakerVoices[speaker];
        }
        
        utterance.rate = 0.9;
        
        utterance.onend = () => {
             if (!isAudioCancelledRef.current) speakSegment(index + 1);
        };
        utterance.onerror = () => {
             if (!isAudioCancelledRef.current) speakSegment(index + 1);
        };
        
        if (!isAudioCancelledRef.current) {
             window.speechSynthesis.speak(utterance);
        }
    };

    speakSegment(0);
  };

  const speakText = (text: string, onEnd?: () => void) => {
    isAudioCancelledRef.current = false;
    // If it looks like a conversation, use speakConversation
    if (text.match(/(?:Person [A-C]|Student [A-C]|Speaker [1-3]|Admin|Teacher|Manager|Treasurer|President|Member|Librarian|Advisor|Activist|Counselor|Commuter|Professor):/)) {
        speakConversation(text, onEnd);
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      if (!isAudioCancelledRef.current && onEnd) {
        onEnd();
      }
    };
    
    if (!isAudioCancelledRef.current) {
        window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    isAudioCancelledRef.current = true;
    window.speechSynthesis.cancel();
    // Sometimes one cancel isn't enough if multiple are queued
    setTimeout(() => window.speechSynthesis.cancel(), 50);
    
    if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
        playbackAudioRef.current.currentTime = 0; // Reset position
        playbackAudioRef.current = null;
    }
  };

  const startRecordingAudio = async () => {
    try {
      setRecordedChunks([]);
      setRecordedAudioUrl(null);
      setHasSpeechDetected(false); // Reset VAD state
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      // Setup VAD (Voice Activity Detection)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;
      
      // VAD loop
      const checkAudioLevel = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average volume
        let sum = 0;
        for(let i = 0; i < dataArrayRef.current.length; i++) {
            sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length;
        
        // Threshold for "speech" (adjust > 15-20 usually works for voice vs silence)
        if (average > 20) {
            setHasSpeechDetected(true);
        }
        
        if (recorder.state === "recording") {
            requestAnimationFrame(checkAudioLevel);
        }
      };
      
      requestAnimationFrame(checkAudioLevel);
      
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
        
        // Clean up VAD
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
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
      setMediaRecorder(null);
      // In simulation mode, we assume "speech" if they don't have a mic, or random?
      // Let's assume false to prevent 0-second high scores, unless we simulate speech.
      // Actually, if it's simulated, we can't detect speech. 
      // Let's force hasSpeechDetected = true for simulation to assume they are "testing" logic,
      // BUT with a 0 duration check elsewhere it should be fine.
      setHasSpeechDetected(true); 
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
        // If we were in simulated mode (mediaRecorder is null but status was recording)
        setRecordedAudioUrl("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"); // Dummy file
    }
  };

  const playRecording = () => {
    if (recordedAudioUrl) {
      if (playbackAudioRef.current) {
          playbackAudioRef.current.pause();
      }
      const audio = new Audio(recordedAudioUrl);
      playbackAudioRef.current = audio;
      audio.onended = () => {
          playbackAudioRef.current = null;
      };
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

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      isAudioCancelledRef.current = true;
      stopAudio();
      stopRecordingAudio();
    };
  }, []);

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

  // Audio playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "playing") {
      interval = setInterval(() => {
        setAudioTime((prev) => {
          const nextTime = prev + 1;
          if (audioTotalTime > 0) {
             setAudioProgress(Math.min((nextTime / audioTotalTime) * 100, 100));
          }
          return nextTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, audioTotalTime]);

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
    if (activeTab === "Repeat Sentence" || activeTab === "Answer Short Question") {
      setStatus("playing");
      toast({
        title: "Audio Playing",
        description: "Listen carefully...",
      });
      speakText(currentQuestion.content, () => {
        setStatus("waiting");
        setTimeLeft(activeTab === "Answer Short Question" ? 2 : 5); // Faster for ASQ
        toast({
           title: "Get Ready",
           description: "Recording starts soon...",
        });
      });
      return;
    }
    
    // For Retell Lecture and Summarize Group Discussion
    // Audio plays immediately, then 10s prep, then recording
    if (activeTab === "Retell Lecture" || activeTab === "Summarize Group Discussion") {
      setStatus("playing");
      setAudioTime(0);
      setAudioProgress(0);
      
      const textToPlay = currentQuestion.audioScript || currentQuestion.content;
      
      // Calculate duration
      let duration = currentQuestion.durationSeconds || 0;
      if (!duration) {
         // Fallback estimation: ~150 words per minute -> 2.5 words per second
         const wordCount = textToPlay.split(/\s+/).length;
         duration = Math.ceil(wordCount / 2.5);
      }
      setAudioTotalTime(duration);

      toast({
        title: "Audio Playing",
        description: "Listen carefully...",
      });
      
      // Use speakConversation for SGD to get multiple voices
      if (activeTab === "Summarize Group Discussion") {
         speakConversation(textToPlay, () => {
            setStatus("preparing");
            setTimeLeft(10);
            toast({
               title: "Preparation",
               description: "You have 10 seconds to prepare.",
            });
         });
      } else {
         speakText(textToPlay, () => {
            setStatus("preparing");
            setTimeLeft(10); 
            toast({
               title: "Preparation",
               description: "You have 10 seconds to prepare.",
            });
         });
      }
      return;
    }

    // For Respond to a Situation
    // Audio plays (situation description), then 20s prep, then recording
    if (activeTab === "Respond to a Situation") {
      setStatus("playing");
      toast({
        title: "Audio Playing",
        description: "Listen to the situation...",
      });
      
      const textToPlay = currentQuestion.content; // The situation description
      
      speakText(textToPlay, () => {
        setStatus("preparing");
        setTimeLeft(20); // 20s prep for Respond to a Situation
        toast({
           title: "Preparation",
           description: "You have 20 seconds to prepare.",
        });
      });
      return;
    }

    setStatus("preparing");
    setTimeLeft(25);
    toast({
      title: "Preparation Started",
      description: "You have 25 seconds to prepare.",
    });
  };

  const startRecording = () => {
    playBeep(); // Beep on start
    startRecordingAudio(); // Start actual recording
    
    // Start Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setTranscript("");
        setPauseCount(0);
        lastSpeechTimeRef.current = Date.now();
      };

      recognition.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";
        let totalConf = 0;
        let resultCount = 0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
            totalConf += event.results[i][0].confidence;
            resultCount++;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }
        
        // Simple hesitation detection: Check time since last result
        const now = Date.now();
        if (now - lastSpeechTimeRef.current > 2000 && lastSpeechTimeRef.current > 0) {
           setPauseCount(prev => prev + 1);
        }
        lastSpeechTimeRef.current = now;

        setTranscript(prev => {
             // Avoid duplicating if we are just appending final results
             // Actually standard way is to rebuild from event.results usually or just append
             // For simplicity, let's just use the latest full transcript provided by API if continuous
             const allTrans = Array.from(event.results).map((r: any) => r[0].transcript).join("");
             return allTrans;
        });
        
        if (resultCount > 0) {
           setConfidence(prev => (prev * resultCount + totalConf) / (resultCount + 1)); // Moving average-ish
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    setStatus("recording");
    
    // Set recording time based on task type
    if (activeTab === "Summarize Group Discussion") {
      setTimeLeft(120); // 2 minutes (120 seconds) for SGD
      toast({
        title: "Recording Started",
        description: "Speak now! Recording for 2 minutes.",
        variant: "default", 
        className: "bg-red-500 text-white border-none"
      });
    } else {
      setTimeLeft(40); // 40s recording for others
      toast({
        title: "Recording Started",
        description: "Speak now! Recording for 40 seconds.",
        variant: "default", 
        className: "bg-red-500 text-white border-none"
      });
    }
    
    setRecordingDuration(0); // Reset duration
  };

  const stopRecording = () => {
    // Determine max time for calculation
    const maxTime = activeTab === "Summarize Group Discussion" ? 120 : 40;
    const duration = maxTime - timeLeft; 
    setRecordingDuration(duration);
    
    stopRecordingAudio(); // Stop actual recording
    
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
    }

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
    setAudioProgress(0);
    setAudioTime(0);
    setAudioTotalTime(0);
    setTranscript("");
    setConfidence(0);
    setPauseCount(0);
  };

  const handleScore = () => {
    setIsScoring(true);
    // Simulate processing delay
    setTimeout(() => {
      // Calculate score with real data
      const targetText = currentQuestion.content || "";
      const newScore = calculateSpeakingScore(
        activeTab, 
        recordingDuration, 
        transcript, 
        targetText, 
        confidence, 
        pauseCount
      );
      
      setScore(newScore);
      setIsScoring(false);
      toast({
        title: "Scoring Complete",
        description: `Overall Score: ${newScore.overall}/90`,
      });
    }, 1500);
  };

  const handleNext = () => {
    stopAudio();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + 1
      }));
    }
  };

  const handlePrev = () => {
    stopAudio();
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
            
            {/* Instruction for Describe Image (Moved above image) */}
            {activeTab === "Describe Image" && (
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border w-full max-w-2xl">
                  Look at the picture below. In 25 seconds, speak into the microphone and describe in detail what the picture is showing. You will have 40 seconds to complete your response.
                </div>
            )}

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
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                    Look at the text below. In 25 seconds, you must read this text aloud as naturally and clearly as possible. You have 40 seconds to read aloud.
                  </div>
                  <p className="text-2xl leading-relaxed font-serif text-foreground/90">
                    {currentQuestion.content}
                  </p>
                </div>
              )}

              {activeTab === "Repeat Sentence" && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                    You will hear a sentence. Repeat it exactly. The sentence will stay hidden until you finish your attempt.
                  </div>

                  <div
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => speakText(currentQuestion.content)}
                    data-testid="button-repeat-sentence-play"
                  >
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Click Start (or the icon above) to listen, then repeat. After you finish, you can reveal the sentence.
                  </p>

                  <Button
                    variant="secondary"
                    onClick={() => setShowTranscript(!showTranscript)}
                    disabled={status !== "completed"}
                    data-testid="button-repeat-sentence-toggle"
                  >
                    {showTranscript ? "Hide Sentence" : "Show Sentence"}
                  </Button>

                  {status !== "completed" && (
                    <div className="rounded-lg border bg-white p-4 text-center" data-testid="card-repeat-sentence-hidden">
                      <p className="text-sm font-medium text-foreground">Sentence hidden</p>
                      <p className="mt-1 text-xs text-muted-foreground">Finish your attempt to reveal it.</p>
                    </div>
                  )}

                  {status === "completed" && showTranscript && (
                    <p className="text-lg font-medium animate-in fade-in slide-in-from-bottom-2" data-testid="text-repeat-sentence">
                      {currentQuestion.content}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "Answer Short Question" && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                    You will hear a question. Give a simple and short answer -- just one or a few words is enough. Once you hear the beep, speak into the microphone and answer the question. Click next right after.
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => speakText(currentQuestion.content)}>
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click Start or the icon above to listen, then answer.</p>
                  <Button variant="secondary" onClick={() => setShowTranscript(!showTranscript)} disabled={status !== "completed"}>
                    {showTranscript ? "Hide Question" : "Show Question"}
                  </Button>
                  {showTranscript && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-lg font-medium">Q: {currentQuestion.content}</p>
                      <p className="text-sm text-muted-foreground">A: {currentQuestion.audioScript}</p>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === "Retell Lecture" || activeTab === "Summarize Group Discussion") && (
                 <div className="space-y-6">
                   {activeTab === "Retell Lecture" && (
                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                      You will hear a lecture. After listening to the lecture, you will be given 10 seconds to prepare. After 10 seconds, speak into the microphone and retell what you heard from the lecture using your own words. You will have 40 seconds to complete your response.
                    </div>
                   )}
                   
                   {activeTab === "Summarize Group Discussion" ? (
                     <div className="space-y-6 w-full max-w-xl mx-auto">
                        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                           You will hear three people having a discussion. When you hear the beep, summarize the whole discussion. You will have 10 seconds to prepare and 2 minutes to give your response.
                        </div>

                        <div className="flex flex-col items-center gap-6 py-4">
                           {/* 3 People Icon */}
                           <div className="relative">
                              <Users className="h-24 w-24 text-primary" />
                              <div className="absolute -top-2 -right-2 flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                           </div>
                           
                           {/* Play Button for SGD */}
                           <Button 
                             variant="outline" 
                             size="sm" 
                             onClick={() => speakConversation(currentQuestion.audioScript || "")} 
                             className="gap-2"
                             disabled={status === "playing" || status === "recording"}
                           >
                              <PlayCircle className="h-4 w-4" /> Play Audio
                           </Button>

                           {/* Player Interface */}
                           <div className="w-full space-y-2">
                              <div className="flex items-center justify-between text-sm font-mono font-medium text-muted-foreground">
                                 <div className="flex items-center gap-2">
                                    {status === "playing" ? (
                                       <PlayCircle className="h-5 w-5 text-green-600 animate-pulse" />
                                    ) : (
                                       <Volume2 className="h-5 w-5" />
                                    )}
                                    <span>
                                       {String(Math.floor(audioTime / 60)).padStart(2, '0')}:{String(audioTime % 60).padStart(2, '0')}
                                    </span>
                                 </div>
                                 <span>
                                    {String(Math.floor(audioTotalTime / 60)).padStart(2, '0')}:{String(audioTotalTime % 60).padStart(2, '0')}
                                 </span>
                              </div>
                              <Progress value={audioProgress} className="h-2" />
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                    <Volume2 className="h-4 w-4" />
                                    <div className="w-16 h-1 bg-muted-foreground/30 rounded-full">
                                       <div className="w-3/4 h-full bg-primary rounded-full"></div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    {status === "recording" ? (
                                       <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                                    ) : (
                                       <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                                    )}
                                    <span>{status === "recording" ? "Recording" : "Ready"}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     /* Standard Audio Player for Retell Lecture */
                     <>
                       <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => speakConversation(currentQuestion.audioScript || "")}>
                         <Volume2 className="h-10 w-10 text-secondary-foreground" />
                       </div>
                       <div className="space-y-2">
                         <h3 className="font-medium text-lg">Audio Simulation</h3>
                         <Button variant="outline" size="sm" onClick={() => speakConversation(currentQuestion.audioScript || "")} className="gap-2 mb-2">
                            <PlayCircle className="h-4 w-4" /> Play Audio
                         </Button>
                         <div className="w-full max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
                           <div className="h-full bg-secondary w-1/2 animate-[pulse_2s_ease-in-out_infinite]" />
                         </div>
                       </div>
                     </>
                   )}
                   
                   <Button variant="ghost" size="sm" onClick={() => setShowTranscript(!showTranscript)} className="gap-2" disabled={(activeTab === "Summarize Group Discussion" || activeTab === "Retell Lecture") && status !== "completed"}>
                     <FileText className="h-4 w-4" /> 
                     {showTranscript ? "Hide Transcript" : "View Transcript"}
                   </Button>
                   {showTranscript && (
                     <div className="text-left bg-muted/30 p-6 rounded-lg text-sm leading-relaxed border max-h-[200px] overflow-y-auto">
                       {currentQuestion.audioScript?.split(/(?=[A-Z][a-z]+ [A-Z0-9]+:)/).map((part, i) => (
                         <p key={i} className="mb-2">
                           {part.split(":").map((subPart, j) => (
                             j === 0 ? <span key={j} className="font-bold text-primary mr-1">{subPart}:</span> : <span key={j}>{subPart}</span>
                           ))}
                         </p>
                       )) || currentQuestion.audioScript}
                     </div>
                   )}
                 </div>
              )}

              {activeTab === "Respond to a Situation" && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-left space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border mb-4">
                    You will listen to a description of a situation. You will have 20 seconds to prepare your response. After the beep, speak into the microphone and respond to the situation. You will have 40 seconds to complete your response.
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <AlertCircle className="h-5 w-5" />
                    Situation
                  </div>
                  <p className="text-lg text-blue-900">
                    {currentQuestion.content}
                  </p>
                  
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-blue-200 transition-colors mt-4" onClick={() => speakText(currentQuestion.content)}>
                     <Volume2 className="h-10 w-10 text-blue-700" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">Click Start or the icon above to listen</p>
                </div>
              )}
               
               {activeTab === "Describe Image" && (
                 <div className="space-y-6">
                   <p className="text-muted-foreground italic">
                     {currentQuestion.content}
                   </p>
                 </div>
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

              {/* Global Reminder */}
              <div className="w-full max-w-3xl mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-bold text-center animate-pulse flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                REMINDER: CLICK NEXT ONCE ANSWER IS RECORDED. DO NOT WAIT FOR THE TIMER TO END.
              </div>
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