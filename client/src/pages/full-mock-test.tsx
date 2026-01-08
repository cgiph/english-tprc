import { useState, useEffect, useRef, useCallback } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DisclaimerModal from "@/components/disclaimer-modal";
import { generateMockTest, MockQuestion } from "@/lib/mock-test-data";
import { calculateSpeakingScore, SpeakingScore } from "@/lib/scoring-utils";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ChevronRight, Mic, Volume2, UserCircle, Square, Play, RotateCcw, GripVertical } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function FullMockTest() {
  const [testState, setTestState] = useState<"intro" | "candidate-info" | "tech-check" | "intro-recording" | "test-intro" | "active" | "finished">("intro");
  const [currentTest, setCurrentTest] = useState<{ test_id: string; items: MockQuestion[]; start_time: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [score, setScore] = useState<{ 
    overall: number, 
    communicative: { speaking: number, writing: number, reading: number, listening: number },
    skills: { grammar: number, fluency: number, pronunciation: number, spelling: number, vocabulary: number, discourse: number },
    details: any[] 
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0); // For countdown
  const { toast } = useToast();
  
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("pteFullMockDisclaimerAccepted");
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("pteFullMockDisclaimerAccepted", "true");
    setShowDisclaimer(false);
  };

  // Candidate Info
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    dob: "",
    country: "",
    id: "CGI-" + Math.floor(Math.random() * 10000)
  });

  // Tech Check States
  const [micChecked, setMicChecked] = useState(false);
  const [audioChecked, setAudioChecked] = useState(false);
  const [keyboardChecked, setKeyboardChecked] = useState(false);
  const [micRecording, setMicRecording] = useState(false);
  const [micPlayback, setMicPlayback] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Real Audio Recording State (Question specific)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
  const [questionAudioURL, setQuestionAudioURL] = useState<string | null>(null);
  
  const playBeep = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); 
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); 
  }, []);

  const startQuestionRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setQuestionAudioURL(url);
        setResponses(prev => {
           if (!currentTest) return prev;
           const qId = currentTest.items[currentIndex].id;
           return { ...prev, [qId + "_audio"]: url }; 
        });
      };

      recorder.start(1000); // Timeslice to ensure data
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Mic error", err);
      // Fallback for simulation
      setMediaRecorder(null);
    }
  };

  const stopQuestionRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    } else {
      // Simulation fallback
      const fakeUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
      setQuestionAudioURL(fakeUrl);
      setResponses(prev => {
         if (!currentTest) return prev;
         const qId = currentTest.items[currentIndex].id;
         return { ...prev, [qId + "_audio"]: fakeUrl }; 
      });
    }
  };
  
  // Real Microphone Functions
  const startMicCheckRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedAudioURL(url);
      };

      recorder.start(); // No timeslice, standard recording
      setMediaRecorder(recorder);
      setMicRecording(true);
      setMicPlayback(false);
      setRecordedAudioURL(null);
    } catch (err) {
      console.error("Mic access denied:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Error",
        description: "Could not access microphone. Simulating recording mode.",
      });
      // Fallback simulation
      setMicRecording(true);
      setMediaRecorder(null);
    }
  };

  const stopMicCheckRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    } else {
      // Simulation fallback: URL null so we fallback to speech in playMicRecording
      setRecordedAudioURL(null);
    }
    setMicRecording(false);
    setMicPlayback(true);
  };

  const playMicRecording = () => {
    if (recordedAudioURL) {
      const audio = new Audio(recordedAudioURL);
      audio.onended = () => console.log("Playback ended");
      audio.onerror = (e) => {
         console.error("Playback error", e);
         toast({ description: "Playback failed, using simulation.", variant: "destructive" });
         speakText("This is a simulated playback of your recording.");
      };
      audio.play().catch(e => {
         console.error("Play failed", e);
         speakText("This is a simulated playback of your recording.");
      });
    } else {
      speakText("This is a simulated playback of your recording.");
    }
  };

  // Intro Recording State
  const [isRecordingIntro, setIsRecordingIntro] = useState(false);
  const [introTimer, setIntroTimer] = useState(25);
  const introIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Speaking Section States
  const [speakingState, setSpeakingState] = useState<"prep" | "recording" | "idle">("idle");
  const [speakingTimer, setSpeakingTimer] = useState(0);

  // Keyboard Listener for Tech Check
  useEffect(() => {
    if (testState === "tech-check") {
      const handleKeyDown = (e: KeyboardEvent) => {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.add(e.key.toUpperCase());
          return newSet;
        });
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [testState]);

  // Timer for active test question (Countdown)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testState === "active" && currentTest) {
      const currentQ = currentTest.items[currentIndex];
      const limit = currentQ.time_limit_seconds || 120; 
      
      // Initialize Speaking Logic
      if (currentQ.section === "Speaking" && speakingState === "idle") {
        setSpeakingState("prep");
        // Repeat Sentence: shorter prep (3s after audio), others: 40s
        setSpeakingTimer(currentQ.type === "Repeat Sentence" ? 3 : 40);
      } else if (speakingState === "idle") {
        // Standard Timer for non-speaking
        setTimeLeft(prev => (prev === 0 ? limit : prev));
      }

      interval = setInterval(() => {
        // Global/Standard Timer
        if (currentQ.section !== "Speaking") {
          setTimeLeft(prev => {
             if (prev <= 1) return 0;
             
             const spent = limit - prev + 1;
             if (currentQ.section === "Reading" && spent === 60) {
               toast({
                 variant: "destructive",
                 title: "Time Management Alert",
                 description: "You have spent 1 minute on this question. Please manage your time.",
                 duration: 5000
               });
             }
             return prev - 1;
          });
        } else {
          // Speaking Timer Logic
          setSpeakingTimer(prev => {
            if (prev <= 1) {
              if (speakingState === "prep") {
                playBeep(); // Beep on transition to recording
                startQuestionRecording(); // Start recording
                setSpeakingState("recording");
                // Repeat Sentence: 10s recording, others: 40s
                return currentQ.type === "Repeat Sentence" ? 10 : 40;
              } else if (speakingState === "recording") {
                stopQuestionRecording(); // Stop recording
                handleNext(); // Auto next
                return 0;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, testState, currentTest, speakingState]);

  // Audio Playback Logic
  const speakText = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopAudio = () => window.speechSynthesis.cancel();

  // Effect to play audio for Listening/Speaking questions automatically
  useEffect(() => {
    if (testState === "active" && currentTest) {
      const q = currentTest.items[currentIndex];
      // Determine text to speak: audioScript for Listening/Retell Lecture, content for Repeat Sentence
      const textToSpeak = q.audioScript || (q.type === "Repeat Sentence" ? q.content : null);

      if ((q.section === "Listening" || q.section === "Speaking") && textToSpeak) {
        // Brief delay to allow UI to settle
        const timer = setTimeout(() => speakText(textToSpeak), 1000);
        return () => {
          clearTimeout(timer);
          stopAudio();
        };
      }
    }
  }, [currentIndex, testState, currentTest, speakText]);


  // Mock API Call simulation
  const generateTest = async (section?: string, count = 20) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const test = generateMockTest(section, 56); 
    console.log("Test Generated (Mock API):", test);
    return test;
  };

  const startCandidateInfo = () => {
    setTestState("candidate-info");
  };

  const submitCandidateInfo = () => {
    if (!candidateInfo.name || !candidateInfo.dob || !candidateInfo.country) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all candidate details."
      });
      return;
    }
    setTestState("tech-check");
  };

  const finishTechCheck = () => {
    if (!micChecked) {
        toast({
            variant: "destructive",
            title: "Check Required",
            description: "Please complete the microphone check and click 'Confirm'."
        });
        // Scroll to mic section
        document.getElementById("mic-check-section")?.scrollIntoView({ behavior: "smooth" });
        return;
    }
    if (!audioChecked) {
        toast({
            variant: "destructive",
            title: "Check Required",
            description: "Please play the sample audio to verify playback."
        });
        return;
    }
    if (!keyboardChecked) {
        toast({
            variant: "destructive",
            title: "Check Required",
            description: "Please verify your keyboard and click 'Confirm Keys Working'."
        });
        return;
    }
    setTestState("intro-recording");
  };

  const startIntroRecording = () => {
    setIsRecordingIntro(true);
    if (introIntervalRef.current) clearInterval(introIntervalRef.current);
    
    introIntervalRef.current = setInterval(() => {
      setIntroTimer(prev => {
        if (prev <= 1) {
          if (introIntervalRef.current) clearInterval(introIntervalRef.current);
          setIsRecordingIntro(false);
          setTestState("test-intro"); // Auto move to next
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopIntroRecording = () => {
    if (introIntervalRef.current) clearInterval(introIntervalRef.current);
    setIsRecordingIntro(false);
    setTestState("test-intro");
  };

  const startTestProper = async () => {
    setTestState("active");
    const test = await generateTest(undefined, 56); 
    setCurrentTest(test);
    setCurrentIndex(0);
    setResponses({});
    setSpeakingState("idle");
  };

  const submitAnswer = (val: any) => {
    if (!currentTest) return;
    const q = currentTest.items[currentIndex];
    setResponses(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    stopAudio();
    if (!currentTest) return;
    
    // Reset states for next question
    setSpeakingState("idle");
    setQuestionAudioURL(null); // Clear current audio
    setTimeLeft(0);

    if (currentIndex < currentTest.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    if (!currentTest) return;
    
    let totalPoints = 0;
    let maxPoints = 0;
    
    // Communicative Skills Buckets
    let speakingScoreTotal = 0, speakingMax = 0;
    let writingScore = 0, writingMax = 0;
    let readingScore = 0, readingMax = 0;
    let listeningScore = 0, listeningMax = 0;

    const details = [];

    for (const item of currentTest.items) {
      const response = responses[item.id];
      let itemScore = 0;
      let autoZero = false;

      // Logic for specific constraints
      if (item.type === "Summarize Written Text") {
         if (!response) {
           itemScore = 0;
         } else {
            const wordCount = response.trim().split(/\s+/).length;
            const sentenceCount = response.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
            
            // Constraint: 5-75 words, single sentence
            if (wordCount < 5 || wordCount > 75 || sentenceCount > 1) {
               autoZero = true;
               itemScore = 0;
            } else {
               // Mock score if valid
               itemScore = Math.floor(item.max_score * 0.8); 
            }
         }
      } else if (item.type === "Write Essay") {
         if (!response) {
           itemScore = 0;
         } else {
           const wordCount = response.trim().split(/\s+/).length;
           // Constraint: 200-300 words
           if (wordCount < 200 || wordCount > 300) {
             autoZero = true;
             itemScore = 0;
           } else {
             // Mock Grammar Check (Simulated 10% failure rate)
             const hasGrammarErrors = Math.random() > 0.9; 
             if (hasGrammarErrors) {
               autoZero = true; // > 3 errors logic simulation
               itemScore = 0;
             } else {
               itemScore = Math.floor(item.max_score * 0.85);
             }
           }
         }
      } else if (item.correctAnswer) {
         if (Array.isArray(item.correctAnswer) && Array.isArray(response)) {
            const correct = item.correctAnswer.sort().join();
            const user = response.sort().join();
            if (correct === user) itemScore = item.max_score;
         } else if (response === item.correctAnswer) {
            itemScore = item.max_score;
         }
      } else {
        // Speaking/Open ended mock
        if (response && response.length > 5) itemScore = Math.floor(item.max_score * 0.75);
      }

      if (autoZero) itemScore = 0;

      // Aggregate Skills
      if (item.section === "Speaking") { 
        // Enhanced Scoring for Speaking
        // Use our utility to generate consistent mock sub-scores
        const speakingScore = calculateSpeakingScore(item.type as any, 20); // Mock duration
        
        // Update the item score to match the utility's result roughly scaled to max_score
        // The utility returns 0-90, max_score might be different (e.g. 15)
        const ratio = speakingScore.overall / 90;
        itemScore = Math.round(item.max_score * ratio);
        
        // Add sub-skills
        details.push({
           question_id: item.id,
           score: itemScore,
           max: item.max_score,
           type: item.type,
           subscores: {
             fluency: speakingScore.fluency,
             pronunciation: speakingScore.pronunciation,
             content: speakingScore.content
           }
        });

        speakingScoreTotal += itemScore; 
        speakingMax += item.max_score; 
      } else {
        // Normal handling for other sections
        details.push({ question_id: item.id, score: itemScore, max: item.max_score, type: item.type });
      }

      if (item.section === "Writing") { writingScore += itemScore; writingMax += item.max_score; }
      if (item.section === "Reading") { readingScore += itemScore; readingMax += item.max_score; }
      if (item.section === "Listening") { listeningScore += itemScore; listeningMax += item.max_score; }

      totalPoints += itemScore;
      maxPoints += item.max_score;
    }

    // Scale to 90
    const scale = (curr: number, max: number) => max === 0 ? 0 : Math.round((curr / max) * 90);

    const finalScores = {
      overall: scale(totalPoints, maxPoints),
      communicative: {
        speaking: scale(speakingScoreTotal, speakingMax),
        writing: scale(writingScore, writingMax),
        reading: scale(readingScore, readingMax),
        listening: scale(listeningScore, listeningMax)
      },
      skills: { // Mocked breakdown based on overall performance
        grammar: scale(totalPoints, maxPoints) - 5,
        fluency: scale(speakingScoreTotal, speakingMax), // Use actual calc
        pronunciation: scale(speakingScoreTotal, speakingMax) - 2, // Use actual calc
        spelling: scale(writingScore, writingMax),
        vocabulary: scale(readingScore, readingMax),
        discourse: scale(writingScore, writingMax)
      },
      details
    };

    setScore(finalScores);
    setTestState("finished");
  };

  // Render different question types
  const renderQuestion = (q: MockQuestion) => {
    const currentVal = responses[q.id];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2">{q.section} - {q.type}</Badge>
            {q.section === "Speaking" ? (
               <Badge variant={speakingState === "recording" ? "destructive" : "secondary"}>
                 {speakingState === "prep" ? "Prep Time: " : "Recording: "}
                 {speakingTimer}s
               </Badge>
            ) : (
               <Badge variant={timeLeft < 30 ? "destructive" : "secondary"} className={timeLeft < 30 ? "animate-pulse" : ""}>
                 Time Remaining: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}
               </Badge>
            )}
          </div>
          <h3 className="text-xl font-serif font-bold">{q.title}</h3>
          
          {/* Descriptions and Reminders */}
          {q.type === "Summarize Spoken Text" && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 mb-4">
              <strong>Reminder:</strong> You have 10 minutes to summarize the spoken text. This task tests your listening comprehension and writing skills.
            </div>
          )}
          {q.type === "Summarize Written Text" && (
             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-yellow-800 mb-4">
               <strong>Constraint:</strong> Must be 5-75 words and exactly ONE sentence. Score will be zero if not followed.
             </div>
          )}
          {q.type === "Write Essay" && (
             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-yellow-800 mb-4">
               <strong>Constraint:</strong> 200-300 words. Auto-zero if under/over limit or more than 3 grammar errors.
             </div>
          )}
          
          {/* Content/Prompt */}
          {/* Prioritize 'text' for reading, 'content' for others, but check both */}
          {/* Hide content for Repeat Sentence - students must listen and repeat */}
          {(q.text || q.content) && q.type !== "Repeat Sentence" && (
            <div className="bg-muted/10 p-6 rounded-lg border leading-relaxed text-lg">
               {q.text || q.content}
            </div>
          )}
          
          {/* Repeat Sentence instruction */}
          {q.type === "Repeat Sentence" && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-amber-800">
              <strong>Instructions:</strong> Listen carefully to the sentence. After the audio ends, you will have 10 seconds to repeat the sentence exactly as you heard it.
            </div>
          )}
          
          {q.prompt && <p className="font-medium text-blue-800 bg-blue-50 p-3 rounded">{q.prompt}</p>}
          
          {/* Image */}
          {q.imageUrl && (
             <div className="border rounded-lg p-2 bg-white max-w-md">
               <img src={q.imageUrl} alt="Task" className="w-full h-auto" />
             </div>
          )}

          {/* Audio Controls */}
          {((q.section === "Listening" && q.audioScript) || (q.section === "Speaking" && (q.audioScript || q.type === "Repeat Sentence"))) && (
            <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
              <Button size="icon" variant="secondary" className="rounded-full" onClick={() => speakText(q.audioScript || q.content || "")}>
                <PlayCircle className="h-6 w-6" />
              </Button>
              <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary/50 animate-pulse" />
              </div>
              <span className="text-xs text-muted-foreground">Audio Playing...</span>
            </div>
          )}
        </div>
        {/* Interaction Area */}
        <div className="pt-4 border-t">
          {q.section === "Speaking" ? (
             <div className="flex flex-col items-center p-8 bg-muted/10 rounded-xl border-2 border-dashed relative overflow-hidden">
                {speakingState === "prep" && (
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium text-muted-foreground">
                      {q.type === "Repeat Sentence" ? "Listen to the audio above, then speak" : "Prepare your answer"}
                    </p>
                    <div className="text-4xl font-mono font-bold">{speakingTimer}s</div>
                    {q.type === "Repeat Sentence" && (
                      <p className="text-sm text-muted-foreground mt-2">Recording will begin automatically</p>
                    )}
                  </div>
                )}
                {speakingState === "recording" && (
                  <div className="flex flex-col items-center w-full">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                       {/* Circular Timer SVG Mock */}
                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                         <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="8" className="text-red-500 transition-all duration-1000" 
                           strokeDasharray={276} strokeDashoffset={276 * (1 - speakingTimer/(q.type === "Repeat Sentence" ? 10 : 40))} />
                       </svg>
                       <Mic className="h-10 w-10 text-red-500 animate-pulse" />
                    </div>
                    <p className="font-medium mb-4 text-red-600">
                      {q.type === "Repeat Sentence" ? "Repeat the sentence now..." : "Recording..."}
                    </p>
                    
                    {/* Sound Wave Visualizer */}
                    <div className="flex items-end justify-center gap-1 h-12 w-full max-w-xs">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} 
                             className="w-2 bg-primary/60 rounded-full animate-bounce" 
                             style={{ 
                               height: `${Math.random() * 100}%`, 
                               animationDelay: `${i * 0.08}s`,
                               animationDuration: '0.4s'
                             }} 
                        />
                      ))}
                    </div>
                    
                    {q.type === "Repeat Sentence" && (
                      <p className="text-xs text-muted-foreground mt-4">Time remaining: {speakingTimer}s</p>
                    )}
                  </div>
                )}
             </div>
          ) : q.type === "Reorder Paragraphs" && q.paragraphs ? (
             <div className="space-y-2">
               <p className="text-sm text-muted-foreground mb-2">Drag and drop paragraphs to reorder (Mock: Click to move)</p>
               {/* Mock Reorder Interface using simplified Click-to-Swap for prototype */}
               {q.paragraphs.map((p, i) => (
                 <div key={p.id} className="flex items-start gap-3 p-3 bg-white border rounded cursor-grab hover:border-primary">
                   <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                   <p>{p.text}</p>
                 </div>
               ))}
             </div>
          ) : q.type === "R&W Fill in the Blanks" && q.blanks ? (
             <div className="leading-loose text-lg">
               {/* Render text with dropdowns */}
               {q.text?.split(/\{\{\d+\}\}/g).map((part, i) => (
                 <span key={i}>
                   {part}
                   {i < (q.blanks?.length || 0) && (
                     <select className="inline-block mx-1 border rounded p-1 text-base bg-white" onChange={(e) => submitAnswer({...currentVal, [i]: e.target.value})}>
                       <option value="">Select...</option>
                       {q.blanks![i].options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                     </select>
                   )}
                 </span>
               ))}
             </div>
          ) : q.type === "Reading Fill in the Blanks" && q.blanks ? (
             <div className="space-y-4">
               <div className="leading-loose text-lg bg-muted/10 p-4 rounded border">
                 {q.text?.split(/\{\{\d+\}\}/g).map((part, i) => (
                   <span key={i}>
                     {part}
                     {i < (q.blanks?.length || 0) && (
                       <span className="inline-block w-24 h-8 border-b-2 border-primary mx-1 bg-white/50 align-bottom" />
                     )}
                   </span>
                 ))}
               </div>
               <div className="flex gap-2 flex-wrap p-4 bg-muted rounded">
                 {q.options?.map(opt => (
                   <Badge key={opt} variant="outline" className="text-base py-1 px-3 cursor-grab hover:bg-white">{opt}</Badge>
                 ))}
               </div>
             </div>
          ) : q.section === "Writing" || q.type === "Summarize Spoken Text" ? (
             <div className="space-y-2">
                <Textarea 
                  placeholder={q.type === "Summarize Written Text" ? "Type one sentence summary..." : "Type your response here..."} 
                  className="min-h-[300px] font-serif text-lg leading-relaxed p-6"
                  value={currentVal || ""}
                  onChange={(e) => submitAnswer(e.target.value)}
                />
                <div className="flex justify-end text-sm text-muted-foreground">
                   Words: {currentVal ? currentVal.trim().split(/\s+/).length : 0}
                </div>
             </div>
          ) : q.options ? (
             <RadioGroup value={currentVal} onValueChange={submitAnswer}>
               {q.options.map(opt => (
                 <div key={opt} className="flex items-center space-x-2 mb-2">
                   <RadioGroupItem value={opt} id={opt} />
                   <Label htmlFor={opt} className="text-base">{opt}</Label>
                 </div>
               ))}
             </RadioGroup>
          ) : (
             <Input 
               placeholder="Type your answer here..." 
               className="font-medium text-lg"
               value={currentVal || ""}
               onChange={(e) => submitAnswer(e.target.value)}
             />
          )}
        </div>
      </div>
    );
  };

  // 1. Intro Screen
  if (testState === "intro") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <DisclaimerModal
          isOpen={showDisclaimer}
          onAccept={handleAcceptDisclaimer}
        />
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6 pt-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold">Full Mock Test - PTE Academic</CardTitle>
            <CardDescription className="text-lg max-w-lg mx-auto">A complete simulation of the PTE Academic exam.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 leading-relaxed">
              <p>This is not an official PTE Academic test and does not replicate the test format. Results from the test do not predict official scores. For skills assessment, visa, or migration purposes, candidates must take an official IELTS or PTE Academic test at an authorized test centre.</p>
            </div>
          </CardContent>
          <CardFooter className="pb-10 justify-center">
            <Button size="lg" className="w-full max-w-xs text-lg font-bold h-12" onClick={startCandidateInfo}>
              Start Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 1.5 Candidate Info
  if (testState === "candidate-info") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
         <Card>
           <CardHeader>
             <CardTitle>Candidate Information</CardTitle>
             <CardDescription>Please verify your details before proceeding.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid gap-2">
               <Label>Full Name</Label>
               <Input 
                 value={candidateInfo.name} 
                 onChange={e => setCandidateInfo({...candidateInfo, name: e.target.value})}
                 placeholder="Enter your full name"
               />
             </div>
             <div className="grid gap-2">
               <Label>Date of Birth</Label>
               <Input 
                 type="date"
                 value={candidateInfo.dob} 
                 onChange={e => setCandidateInfo({...candidateInfo, dob: e.target.value})}
               />
             </div>
             <div className="grid gap-2">
               <Label>Country of Origin</Label>
               <Input 
                 value={candidateInfo.country} 
                 onChange={e => setCandidateInfo({...candidateInfo, country: e.target.value})}
                 placeholder="e.g. United Kingdom"
               />
             </div>
             <div className="p-4 bg-muted rounded text-sm font-mono">
               <p><strong>Test Center:</strong> CGI English Review</p>
               <p><strong>Candidate ID:</strong> {candidateInfo.id}</p>
             </div>
           </CardContent>
           <CardFooter className="justify-end">
             <Button onClick={submitCandidateInfo}>Proceed to Equipment Check</Button>
           </CardFooter>
         </Card>
      </div>
    );
  }

  // 2. Technical Check
  if (testState === "tech-check") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Check</CardTitle>
            <CardDescription>Ensure your hardware is working correctly before starting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mic Check */}
            <div id="mic-check-section" className="flex flex-col gap-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mic className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Microphone Check</p>
                    <p className="text-sm text-muted-foreground">Record yourself saying "Testing"</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!micRecording && !micPlayback && (
                    <Button size="sm" onClick={startMicCheckRecording}>Record</Button>
                  )}
                  {micRecording && (
                    <Button size="sm" variant="destructive" onClick={stopMicCheckRecording}>Stop</Button>
                  )}
                  {micPlayback && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={startMicCheckRecording}>Record</Button>
                      <Button size="sm" variant="outline" onClick={playMicRecording}> <Play className="h-3 w-3 mr-1"/> Playback</Button>
                      <Button size="sm" onClick={() => { setMicChecked(true); setMicPlayback(false); }}>Confirm</Button>
                    </div>
                  )}
                </div>
              </div>
              {micChecked && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Microphone verified</p>}
            </div>

            {/* Audio Check */}
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Volume2 className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Audio Playback Check</p>
                    <p className="text-sm text-muted-foreground">Click to hear a sample sound</p>
                  </div>
                </div>
                <Button variant={audioChecked ? "secondary" : "default"} onClick={() => { speakText("This is a sample audio check."); setAudioChecked(true); }}>
                  <Play className="h-4 w-4 mr-2"/> Play Sound
                </Button>
              </div>
              {audioChecked && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Audio verified</p>}
            </div>

            {/* Keyboard Check */}
             <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Keyboard Check</p>
                  <p className="text-sm text-muted-foreground">Type on your keyboard to light up the keys below</p>
                </div>
              </div>
              {/* Virtual Keyboard Visual */}
              <div className="flex gap-1 justify-center bg-muted/20 p-4 rounded-lg overflow-hidden">
                {['Q','W','E','R','T','Y','U','I','O','P'].map(key => (
                  <div key={key} className={cn(
                    "w-8 h-8 flex items-center justify-center border rounded font-mono text-sm transition-colors",
                    pressedKeys.has(key) ? "bg-primary text-white border-primary" : "bg-white border-border"
                  )}>
                    {key}
                  </div>
                ))}
              </div>
              <Button className="self-end" size="sm" variant={keyboardChecked ? "secondary" : "default"} onClick={() => setKeyboardChecked(true)}>
                {keyboardChecked ? "Verified" : "Confirm Keys Working"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
             <Button 
               onClick={finishTechCheck}
             >
               Next Step
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 3. Intro Recording
  if (testState === "intro-recording") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Introduction Recording</CardTitle>
            <CardDescription>
              Record a short introduction about yourself. This is not scored but is sent to institutions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10 space-y-6">
            <div className="text-6xl font-mono font-bold text-primary">
              {introTimer}s
            </div>
            {isRecordingIntro ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                  <div className="h-3 w-3 bg-red-500 rounded-full" /> Recording...
                </div>
                <Button variant="destructive" onClick={stopIntroRecording}> <Square className="h-4 w-4 mr-2 fill-current"/> Stop Recording</Button>
              </div>
            ) : (
              <Button size="lg" onClick={startIntroRecording}>Start Recording</Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Test Proper Intro
  if (testState === "test-intro") {
    return (
       <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Ready to Start</CardTitle>
            <CardDescription>
              The test contains Speaking, Writing, Reading, and Listening sections.
              Total duration: approx. 2 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-primary">
                  <span>🗣️</span> SPEAKING
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Total group time: ~30–35 minutes</p>
                  <p>Total speaking questions: ~22–28 tasks</p>
                </div>
                
                <h4 className="font-semibold text-sm mb-2">🔹 Speaking Task Types & Question Counts</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Task Type</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Typical No. of Questions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="px-4 py-2">Read Aloud</td><td className="px-4 py-2">6–7</td></tr>
                      <tr><td className="px-4 py-2">Repeat Sentence</td><td className="px-4 py-2">10–12</td></tr>
                      <tr><td className="px-4 py-2">Describe Image</td><td className="px-4 py-2">3–4</td></tr>
                      <tr><td className="px-4 py-2">Re-tell Lecture</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Answer Short Question</td><td className="px-4 py-2">5–6</td></tr>
                      <tr><td className="px-4 py-2">Summarize Group Discussion</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Respond to a Situation</td><td className="px-4 py-2">1–2</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-primary">
                  <span>✍️</span> WRITING (Integrated with Reading)
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Group time (Reading + Writing): 54–67 minutes</p>
                  <p>Pure writing questions: 2–3</p>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Task Type</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">No. of Questions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="px-4 py-2">Summarize Written Text</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Essay</td><td className="px-4 py-2">1</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-primary">
                  <span>📖</span> READING
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Group time: 29–30 minutes</p>
                  <p>Total questions: 13–18</p>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Task Type</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Typical No.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="px-4 py-2">Fill in the Blanks (R&W – drag & drop)</td><td className="px-4 py-2">5–6</td></tr>
                      <tr><td className="px-4 py-2">Re-order Paragraphs</td><td className="px-4 py-2">2–3</td></tr>
                      <tr><td className="px-4 py-2">Fill in the Blanks (Reading – type-in)</td><td className="px-4 py-2">4–5</td></tr>
                      <tr><td className="px-4 py-2">MCQ – Single Answer</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">MCQ – Multiple Answers</td><td className="px-4 py-2">1–2</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-primary">
                  <span>🎧</span> LISTENING (EXCLUDING Summarize Spoken Text)
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Questions: ~10–18</p>
                  <p>Effective group time: ~20–33 minutes</p>
                  <p className="text-xs italic mt-1">(Each SST uses 10 minutes writing time)</p>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Task Type</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Typical No.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="px-4 py-2">Summarize Spoken Text</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">MCQ – Multiple Answers</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">MCQ – Single Answer</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Highlight Correct Summary</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Select Missing Word</td><td className="px-4 py-2">1–2</td></tr>
                      <tr><td className="px-4 py-2">Fill in the Blanks</td><td className="px-4 py-2">2–3</td></tr>
                      <tr><td className="px-4 py-2">Highlight Incorrect Words</td><td className="px-4 py-2">2–3</td></tr>
                      <tr><td className="px-4 py-2">Write from Dictation</td><td className="px-4 py-2">3–4</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 bg-muted p-4 rounded text-sm">
                <strong>Note:</strong> You cannot save and exit. All questions must be attempted.
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={startTestProper}>Start Exam</Button>
          </CardFooter>
        </Card>
       </div>
    );
  }

  if (testState === "finished") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-green-100 bg-green-50/30 mb-6">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-green-900">Test Report</CardTitle>
            <CardDescription className="text-lg">
              PTE Academic UKVI Simulation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Candidate Info Display */}
            <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
               <div>
                 <span className="text-muted-foreground block">Name</span>
                 <span className="font-bold">{candidateInfo.name}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block">Candidate ID</span>
                 <span className="font-bold">{candidateInfo.id}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block">Date of Birth</span>
                 <span className="font-bold">{candidateInfo.dob}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block">Test Center</span>
                 <span className="font-bold">CGI English Review</span>
               </div>
               <div>
                 <span className="text-muted-foreground block">Date Taken</span>
                 <span className="font-bold">{new Date().toLocaleDateString()}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block">Country</span>
                 <span className="font-bold">{candidateInfo.country}</span>
               </div>
            </div>

            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-primary">
                {score?.overall} <span className="text-2xl text-muted-foreground font-normal">/ 90</span>
              </div>
              <p className="text-muted-foreground font-medium text-lg">Overall Score</p>
            </div>

            {/* Communicative Skills */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg border-b pb-2">Communicative Skills</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded shadow-sm text-center">
                     <div className="text-2xl font-bold text-blue-600">{score?.communicative.listening}</div>
                     <div className="text-sm text-muted-foreground">Listening</div>
                  </div>
                  <div className="p-4 bg-white rounded shadow-sm text-center">
                     <div className="text-2xl font-bold text-blue-600">{score?.communicative.reading}</div>
                     <div className="text-sm text-muted-foreground">Reading</div>
                  </div>
                  <div className="p-4 bg-white rounded shadow-sm text-center">
                     <div className="text-2xl font-bold text-blue-600">{score?.communicative.speaking}</div>
                     <div className="text-sm text-muted-foreground">Speaking</div>
                  </div>
                  <div className="p-4 bg-white rounded shadow-sm text-center">
                     <div className="text-2xl font-bold text-blue-600">{score?.communicative.writing}</div>
                     <div className="text-sm text-muted-foreground">Writing</div>
                  </div>
               </div>
            </div>

            {/* Enabling Skills Breakdown */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg border-b pb-2">Skills Breakdown</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded"><span>Grammar</span> <b>{score?.skills.grammar}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Oral Fluency</span> <b>{score?.skills.fluency}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Pronunciation</span> <b>{score?.skills.pronunciation}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Spelling</span> <b>{score?.skills.spelling}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Vocabulary</span> <b>{score?.skills.vocabulary}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Written Discourse</span> <b>{score?.skills.discourse}</b></div>
               </div>
            </div>

          </CardContent>
          <CardFooter className="justify-center gap-4">
            <Button variant="outline" onClick={() => setTestState("intro")}>Retake Test</Button>
            <Link href="/resources" className={buttonVariants({ variant: "default" })}>
              Back to Resources
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentTest) return null;
  const q = currentTest.items[currentIndex];
  const progress = ((currentIndex + 1) / currentTest.items.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {currentTest.items.length}</span>
          <span>{q.section} Section</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="flex-1 flex flex-col border-2 shadow-sm">
        <CardContent className="p-8 flex-1">
          {renderQuestion(q)}
        </CardContent>
        <CardFooter className="bg-muted/5 border-t p-6 flex justify-end">
          <Button size="lg" onClick={handleNext} className="gap-2 pl-6">
            {currentIndex === currentTest.items.length - 1 ? "Submit Test" : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}