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
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ChevronRight, ChevronUp, ChevronDown, Mic, Volume2, UserCircle, Square, Play, RotateCcw, GripVertical } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { scoreItem, aggregateScores, ScoreResult } from "@/lib/scoring";

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
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null); // Moved here

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

  const startQuestionRecording = async (questionId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      // Determine QID now to close over it
      const targetQId = questionId || (currentTest ? currentTest.items[currentIndex].id : null);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setQuestionAudioURL(url);
        
        // FIX 2: Estimate Fluency from Audio Length
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setResponses(prev => {
             // Use the captured targetQId to ensure we save to the correct question
             // even if currentIndex has moved on.
             const qId = targetQId; 
             if (!qId) return prev; // Should not happen if logic is correct
             
             console.log(`Recording saved for ${qId}:`, url, "Blob size:", blob.size, "Duration:", audio.duration);
             return { 
               ...prev, 
               [qId + "_audio"]: url, 
               [qId + "_audio_blob"]: blob,
               [qId + "_duration"]: audio.duration 
             }; 
          });
        };
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
      // UX FIX: Prevent Fake Audio Scoring
      toast({
        variant: "destructive",
        title: "No response detected",
        description: "No speaking response was recorded for this item."
      });
      // Do not set fake URL or response
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
      // Types that have audio, then beep, then (maybe) prep, then recording
      const audioThenBeepTypes = ["Repeat Sentence", "Retell Lecture", "Summarize Group Discussion", "Respond to a Situation"];
      const skipPrepForAudio = audioThenBeepTypes.includes(currentQ.type);
      
      if (currentQ.section === "Speaking" && speakingState === "idle") {
        if (skipPrepForAudio) {
          // These types will be handled by the audio onend callback - stay idle until audio finishes
          // The audio callback will play beep and start recording directly
        } else {
          // Other speaking types: use prep timer
          setSpeakingState("prep");
          // Full Mock Test exam-condition prep time
          const prepTime = 25;
          setSpeakingTimer(prepTime);
        }
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
                // If we arrived here from an after-audio prep phase, do NOT beep again.
                // For classic (Read Aloud / Describe Image) prep, we beep to begin recording.
                const alreadyBeeped = (currentQ.type === "Summarize Group Discussion" || currentQ.type === "Respond to a Situation");
                if (!alreadyBeeped) {
                  playBeep();
                }

                startQuestionRecording(currentQ.id);
                setSpeakingState("recording");

                const recordTime = (currentQ.type === "Repeat Sentence") ? 10
                  : (currentQ.type === "Retell Lecture") ? 40
                  : (currentQ.type === "Summarize Group Discussion") ? 120
                  : (currentQ.type === "Respond to a Situation") ? 40
                  : 40;
                return recordTime;
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
  const speakText = useCallback((text: string, onEndCallback?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; 
    utterance.rate = 0.9;
    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopAudio = () => window.speechSynthesis.cancel();
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  const stopAllAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
  }, []);

  const playAudioFile = useCallback((url: string, onEndCallback?: () => void) => {
    stopAllAudio();
    const audio = new Audio(url);
    audioElementRef.current = audio;
    if (onEndCallback) {
      audio.onended = onEndCallback;
    }
    audio.onerror = () => {
      console.error("Audio file failed to load, falling back to TTS");
      // Fallback to TTS if file fails
      if (currentTest) {
          const q = currentTest.items[currentIndex];
          const text = q.audioScript || q.content || "";
          if (text) speakText(text, onEndCallback);
      }
    };
    audio.play().catch(err => {
        console.error("Audio play failed:", err);
        // Fallback to TTS on play error too
        if (currentTest) {
            const q = currentTest.items[currentIndex];
            const text = q.audioScript || q.content || "";
            if (text) speakText(text, onEndCallback);
        }
    });
  }, [stopAllAudio, speakText, currentTest, currentIndex]);

  // Types that need beep at end of audio
  const audioThenBeepTypes = ["Repeat Sentence", "Retell Lecture", "Summarize Group Discussion", "Respond to a Situation"];

  // Effect to play audio for Listening/Speaking questions automatically
  useEffect(() => {
    if (testState === "active" && currentTest) {
      const q = currentTest.items[currentIndex];
      // Check if stimulus is a real audio file URL (and not a placeholder)
      const isRealAudio = q.stimulus && (q.stimulus.endsWith('.mp3') || q.stimulus.endsWith('.ogg') || q.stimulus.endsWith('.wav') || q.stimulus.startsWith('http')) && !q.stimulus.includes("placeholder");
      
      // Determine text to speak: audioScript for Listening/Retell Lecture, content for Repeat Sentence/Answer Short Question/Respond to a Situation
      const textToSpeak = q.audioScript || ((q.type === "Repeat Sentence" || q.type === "Retell Lecture" || q.type === "Summarize Group Discussion" || q.type === "Respond to a Situation") ? q.content : null);

      if ((q.section === "Listening" || q.section === "Speaking") && (isRealAudio || textToSpeak)) {
        // Check if this type needs beep-then-record flow
        const needsBeepAfterAudio = audioThenBeepTypes.includes(q.type);
        // Select Missing Word needs beep at end to signal missing word
        const needsBeepOnly = q.type === "Select Missing Word";
        
        const onAudioEnd = needsBeepAfterAudio ? () => {
          // Beep plays immediately when audio ends
          playBeep();

          const prepSeconds = (q.type === "Summarize Group Discussion" || q.type === "Respond to a Situation") ? 10 : 0;
          if (prepSeconds > 0) {
            setSpeakingState("prep");
            setSpeakingTimer(prepSeconds);
            return;
          }

          // Start recording after a brief moment for beep
          setTimeout(() => {
            // FIX: Pass the current Question ID explicitly to avoid race conditions
            startQuestionRecording(q.id);
            setSpeakingState("recording");
            // Exam-condition recording windows
            const recordTime = (q.type === "Repeat Sentence") ? 10
              : (q.type === "Retell Lecture") ? 40
              : (q.type === "Summarize Group Discussion") ? 120
              : (q.type === "Respond to a Situation") ? 40
              : 40;
            setSpeakingTimer(recordTime);
          }, 300);
        } : needsBeepOnly ? () => {
          playBeep();
        } : undefined;

        // Brief delay to allow UI to settle
        const timer = setTimeout(() => {
          if (isRealAudio && q.stimulus) {
            playAudioFile(q.stimulus, onAudioEnd);
          } else if (textToSpeak) {
            speakText(textToSpeak, onAudioEnd);
          }
        }, 1000);
        return () => {
          clearTimeout(timer);
          stopAllAudio();
        };
      }
    }
  }, [currentIndex, testState, currentTest, speakText, playAudioFile, stopAllAudio]);



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
    
    // 1. Score all items using the new dispatcher
    const results: ScoreResult[] = currentTest.items.map(item => 
      scoreItem(item, responses)
    );

    // 2. Aggregate scores
    const { communicative, skills } = aggregateScores(results);

    // 3. Prepare legacy "details" array for UI compatibility
    const details = results.map(res => {
      // If score > 0, we treat it as answered correctly/partially.
      // If autoZero is true, it's definitely not "answered" in a valid way.
      return {
        question_id: res.itemId,
        score: res.score,
        max: res.maxScore,
        type: currentTest.items.find(i => i.id === res.itemId)?.type || "Unknown",
        answered: !res.autoZero && res.score > 0, // Simplified assumption for UI
        subscores: res.skills ? {
          fluency: res.skills.fluency || 0,
          pronunciation: res.skills.pronunciation || 0,
          content: res.skills.content || 0
        } : undefined,
        note: res.autoZero ? "Audio too short or empty" : undefined
      };
    });

    // 4. Calculate overall score (Reconstructed from enabling skills)
    const writingScaled = communicative.writing;
    const readingScaled = communicative.reading;
    const listeningScaled = communicative.listening;

    const clamp = (v: number) => Math.max(0, Math.min(90, v));

    const grammarScore = clamp(writingScaled * 0.6 + readingScaled * 0.4);
    const vocabularyScore = clamp(readingScaled * 0.4 + listeningScaled * 0.3 + writingScaled * 0.3);
    const spellingScore = clamp(writingScaled);
    const discourseScore = clamp(writingScaled);
    
    // Scale 1-5 fluency/pronunciation to 10-90
    const scale5to90 = (v: number) => {
        if (v === 0) return 0; 
        return Math.min(90, Math.max(10, v * 18));
    };

    const finalFluency = scale5to90(skills.fluency || 0);
    const finalPronunciation = scale5to90(skills.pronunciation || 0);

    // Overall Score Formula
    let overallScore = 
      (grammarScore * 0.20) +
      (finalFluency * 0.20) +
      (finalPronunciation * 0.15) +
      (vocabularyScore * 0.15) +
      (discourseScore * 0.20) +
      (spellingScore * 0.10);
      
    // Sanity check
    const strongestSkill = Math.max(grammarScore, finalFluency, finalPronunciation, vocabularyScore, discourseScore, spellingScore);
    const minFloor = strongestSkill * 0.6;
    if (overallScore < minFloor && strongestSkill > 0) {
      overallScore = minFloor;
    }
    overallScore = Math.round(overallScore);

    const finalScores = {
      overall: overallScore,
      communicative,
      skills: { 
        grammar: Math.round(grammarScore),
        fluency: Math.round(finalFluency),
        pronunciation: Math.round(finalPronunciation),
        spelling: Math.round(spellingScore),
        vocabulary: Math.round(vocabularyScore),
        discourse: Math.round(discourseScore)
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
          {/* Hide content for types that have custom rendering: Repeat Sentence, Answer Short Question, Fill in Blanks types */}
          {(q.text || q.content) && 
           q.type !== "Repeat Sentence" && 
           q.type !== "Answer Short Question" && 
           q.type !== "R&W Fill in the Blanks" && 
           q.type !== "Reading Fill in the Blanks" && (
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
          
          {/* Answer Short Question instruction */}
          {q.type === "Answer Short Question" && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
              <strong>Instructions:</strong> Listen to the question carefully. You will have 10 seconds to provide a short answer (one or a few words).
            </div>
          )}
          
          {/* Summarize Group Discussion instruction */}
          {q.type === "Summarize Group Discussion" && (
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm text-purple-800">
              <strong>Instructions:</strong> Listen carefully to the group discussion (approximately 1-2 minutes). After the audio ends, you will have 60 seconds to summarize the main points discussed.
            </div>
          )}
          
          {/* Respond to a Situation instruction */}
          {q.type === "Respond to a Situation" && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm text-green-800">
              <strong>Instructions:</strong> Listen to the situation described. After the audio ends, you will have 40 seconds to respond appropriately to the situation.
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
          {((q.section === "Listening" && q.audioScript) || (q.section === "Speaking" && (q.audioScript || q.type === "Repeat Sentence" || q.type === "Answer Short Question" || q.type === "Respond to a Situation" || (q.stimulus && q.stimulus.endsWith('.mp3'))))) && (
            <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
              <Button size="icon" variant="secondary" className="rounded-full" onClick={() => {
                const isRealAudio = q.stimulus && (q.stimulus.endsWith('.mp3') || q.stimulus.endsWith('.ogg') || q.stimulus.endsWith('.wav'));
                if (isRealAudio && q.stimulus) {
                  playAudioFile(q.stimulus);
                } else {
                  speakText(q.audioScript || q.content || "");
                }
              }}>
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
                      {q.type === "Repeat Sentence" ? "Listen to the audio above, then speak" : 
                       q.type === "Answer Short Question" ? "Listen to the question, then answer" : 
                       q.type === "Summarize Group Discussion" ? "Audio finished. Get ready to summarize" : 
                       q.type === "Respond to a Situation" ? "Audio finished. Get ready to respond" : "Prepare your answer"}
                    </p>
                    <div className="text-4xl font-mono font-bold">{speakingTimer}s</div>
                    {(q.type === "Repeat Sentence" || q.type === "Summarize Group Discussion" || q.type === "Respond to a Situation") && (
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
                           strokeDasharray={276} strokeDashoffset={276 * (1 - speakingTimer/((q.type === "Repeat Sentence") ? 10 : (q.type === "Summarize Group Discussion") ? 120 : 40))} />
                       </svg>
                       <Mic className="h-10 w-10 text-red-500 animate-pulse" />
                    </div>
                    <p className="font-medium mb-4 text-red-600">
                      {q.type === "Repeat Sentence" ? "Repeat the sentence now..." : 
                       q.type === "Summarize Group Discussion" ? "Summarize the discussion now..." : 
                       q.type === "Respond to a Situation" ? "Respond to the situation now..." : "Recording..."}
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
                    
                    {(q.type === "Repeat Sentence" || q.type === "Answer Short Question" || q.type === "Summarize Group Discussion" || q.type === "Respond to a Situation") && (
                      <p className="text-xs text-muted-foreground mt-4">Time remaining: {speakingTimer}s</p>
                    )}
                  </div>
                )}
             </div>
          ) : q.type === "Reorder Paragraphs" && q.paragraphs ? (
             <div className="space-y-2">
               <p className="text-sm text-muted-foreground mb-2">Click a paragraph to select, then click another to swap positions</p>
               {/* Interactive Reorder using click-to-swap */}
               {(() => {
                 const currentOrder = (currentVal as string[]) || q.paragraphs.map(p => p.id);
                 const orderedParagraphs = currentOrder.map(id => q.paragraphs!.find(p => p.id === id)!).filter(Boolean);
                 const selectedIdx = responses[`${q.id}_selected`] as number | undefined;
                 
                 return orderedParagraphs.map((p, i) => (
                   <div 
                     key={p.id} 
                     className={`flex items-start gap-3 p-3 bg-white border rounded cursor-pointer transition-all ${
                       selectedIdx === i 
                         ? "border-primary ring-2 ring-primary/30 bg-primary/5" 
                         : "hover:border-primary hover:bg-muted/30"
                     }`}
                     onClick={() => {
                       if (selectedIdx === undefined) {
                         setResponses(prev => ({...prev, [`${q.id}_selected`]: i}));
                       } else if (selectedIdx === i) {
                         setResponses(prev => ({...prev, [`${q.id}_selected`]: undefined}));
                       } else {
                         const newOrder = [...currentOrder];
                         [newOrder[selectedIdx], newOrder[i]] = [newOrder[i], newOrder[selectedIdx]];
                         submitAnswer(newOrder);
                         setResponses(prev => ({...prev, [`${q.id}_selected`]: undefined}));
                       }
                     }}
                   >
                     <div className="flex flex-col items-center gap-1">
                       <Button 
                         size="icon" 
                         variant="ghost" 
                         className="h-6 w-6"
                         onClick={(e) => {
                           e.stopPropagation();
                           if (i > 0) {
                             const newOrder = [...currentOrder];
                             [newOrder[i-1], newOrder[i]] = [newOrder[i], newOrder[i-1]];
                             submitAnswer(newOrder);
                           }
                         }}
                         disabled={i === 0}
                       >
                         <ChevronUp className="h-4 w-4" />
                       </Button>
                       <GripVertical className="h-5 w-5 text-muted-foreground" />
                       <Button 
                         size="icon" 
                         variant="ghost" 
                         className="h-6 w-6"
                         onClick={(e) => {
                           e.stopPropagation();
                           if (i < orderedParagraphs.length - 1) {
                             const newOrder = [...currentOrder];
                             [newOrder[i], newOrder[i+1]] = [newOrder[i+1], newOrder[i]];
                             submitAnswer(newOrder);
                           }
                         }}
                         disabled={i === orderedParagraphs.length - 1}
                       >
                         <ChevronDown className="h-4 w-4" />
                       </Button>
                     </div>
                     <p className="flex-1">{p.text}</p>
                     <Badge variant="outline" className="ml-2">{i + 1}</Badge>
                   </div>
                 ));
               })()}
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
               {(() => {
                 const filledBlanks = (currentVal as Record<number, string>) || {};
                 const usedWords = Object.values(filledBlanks);
                 const selectedBlank = responses[`${q.id}_selectedBlank`] as number | undefined;
                 
                 return (
                   <>
                     <p className="text-sm text-muted-foreground">Click a blank to select it, then click a word to fill it. Click a filled blank to clear it.</p>
                     <div className="leading-loose text-lg bg-muted/10 p-4 rounded border">
                       {q.text?.split(/\{\{\d+\}\}/g).map((part, i) => (
                         <span key={i}>
                           {part}
                           {i < (q.blanks?.length || 0) && (
                             <span 
                               className={`inline-block min-w-24 h-8 border-b-2 mx-1 align-bottom px-2 cursor-pointer transition-all ${
                                 filledBlanks[i] 
                                   ? "bg-primary/10 border-primary text-primary font-medium" 
                                   : selectedBlank === i 
                                     ? "bg-yellow-100 border-yellow-500 ring-2 ring-yellow-300" 
                                     : "bg-white/50 border-primary hover:bg-primary/5"
                               }`}
                               onClick={() => {
                                 if (filledBlanks[i]) {
                                   // Clear this blank
                                   const newFilled = {...filledBlanks};
                                   delete newFilled[i];
                                   submitAnswer(newFilled);
                                 } else {
                                   // Select this blank
                                   setResponses(prev => ({...prev, [`${q.id}_selectedBlank`]: i}));
                                 }
                               }}
                             >
                               {filledBlanks[i] || ""}
                             </span>
                           )}
                         </span>
                       ))}
                     </div>
                     <div className="flex gap-2 flex-wrap p-4 bg-muted rounded">
                       {q.options?.map(opt => {
                         const isUsed = usedWords.includes(opt);
                         return (
                           <Badge 
                             key={opt} 
                             variant={isUsed ? "secondary" : "outline"} 
                             className={`text-base py-1 px-3 transition-all ${
                               isUsed 
                                 ? "opacity-40 cursor-not-allowed" 
                                 : "cursor-pointer hover:bg-primary hover:text-white"
                             }`}
                             onClick={() => {
                               if (isUsed) return;
                               if (selectedBlank !== undefined) {
                                 // Fill the selected blank
                                 const newFilled = {...filledBlanks, [selectedBlank]: opt};
                                 submitAnswer(newFilled);
                                 setResponses(prev => ({...prev, [`${q.id}_selectedBlank`]: undefined}));
                               } else {
                                 // Find first empty blank
                                 const firstEmpty = q.blanks?.findIndex((_, idx) => !filledBlanks[idx]);
                                 if (firstEmpty !== undefined && firstEmpty >= 0) {
                                   const newFilled = {...filledBlanks, [firstEmpty]: opt};
                                   submitAnswer(newFilled);
                                 }
                               }
                             }}
                           >
                             {opt}
                           </Badge>
                         );
                       })}
                     </div>
                   </>
                 );
               })()}
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
          ) : (q.type === "Multiple Choice, Multiple Answers" || q.type === "Multiple Choice (Multiple)") && q.options ? (
             // FIX 1: Checkboxes for multiple answer selection (max 3)
             (<div className="space-y-2">
               <p className="text-sm text-muted-foreground mb-2">Select up to 3 answers that apply</p>
               {q.options.map(opt => {
                 const current = (currentVal as string[]) || [];
                 const selected = current.includes(opt);
                 const atLimit = current.length >= 3 && !selected;
                 return (
                   <div 
                     key={opt} 
                     className={`flex items-center space-x-3 p-3 border rounded transition-all ${
                       selected ? "bg-primary/10 border-primary cursor-pointer" : 
                       atLimit ? "bg-muted/20 border-muted cursor-not-allowed opacity-60" : 
                       "bg-white hover:bg-muted/30 cursor-pointer"
                     }`}
                     onClick={() => {
                       if (atLimit) return; // Don't allow more than 3
                       if (selected) {
                         submitAnswer(current.filter(c => c !== opt));
                       } else {
                         submitAnswer([...current, opt]);
                       }
                     }}
                   >
                     <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                       selected ? "bg-primary border-primary" : "border-muted-foreground"
                     }`}>
                       {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
                     </div>
                     <Label className={`text-base flex-1 ${atLimit ? "cursor-not-allowed" : "cursor-pointer"}`}>{opt}</Label>
                   </div>
                 );
               })}
               <p className="text-xs text-muted-foreground mt-2">Selected: {((currentVal as string[]) || []).length} / 3</p>
             </div>)
          ) : q.type === "Fill in the Blanks (Listening)" && q.transcript ? (
             // FIX 2: Listening Fill in the Blanks with passage
             (<div className="space-y-4">
               <p className="text-sm text-muted-foreground">Listen to the audio and fill in the missing words in the passage below</p>
               <div className="leading-loose text-lg bg-muted/10 p-4 rounded border">
                 {(() => {
                   const parts = q.transcript!.split(/\[([^\]]+)\]/g);
                   const filledBlanks = (currentVal as Record<number, string>) || {};
                   let blankIdx = 0;
                   return parts.map((part, i) => {
                     if (i % 2 === 1) {
                       const idx = blankIdx++;
                       return (
                         <Input
                           key={i}
                           className="inline-block w-28 mx-1 text-center"
                           placeholder="..."
                           value={filledBlanks[idx] || ""}
                           onChange={(e) => submitAnswer({...filledBlanks, [idx]: e.target.value})}
                         />
                       );
                     }
                     return <span key={i}>{part}</span>;
                   });
                 })()}
               </div>
             </div>)
          ) : q.type === "Highlight Incorrect Words" && q.displayTranscript ? (
             // FIX 5: Highlight Incorrect Words with clickable passage
             (<div className="space-y-4">
               <p className="text-sm text-muted-foreground">Listen to the audio and click on the words that differ from what you hear</p>
               <div className="leading-loose text-lg bg-muted/10 p-4 rounded border">
                 {(() => {
                   const words = (q.displayTranscript || "").split(/\s+/);
                   const selected = (currentVal as number[]) || [];
                   return words.map((word, i) => (
                     <span
                       key={i}
                       className={`inline-block mx-0.5 px-1 py-0.5 rounded cursor-pointer transition-all ${
                         selected.includes(i) 
                           ? "bg-red-500 text-white line-through" 
                           : "hover:bg-yellow-100"
                       }`}
                       onClick={() => {
                         if (selected.includes(i)) {
                           submitAnswer(selected.filter(s => s !== i));
                         } else {
                           submitAnswer([...selected, i]);
                         }
                       }}
                     >
                       {word}
                     </span>
                   ));
                 })()}
               </div>
             </div>)
          ) : q.options ? (
             <RadioGroup value={currentVal || ""} onValueChange={submitAnswer}>
               {q.options.map(opt => (
                 <div key={opt} className="flex items-center space-x-2 mb-2">
                   <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                   <Label htmlFor={`${q.id}-${opt}`} className="text-base">{opt}</Label>
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

  // Helper to get questions by section
  const getQuestionsBySection = (section: string) => {
    if (!currentTest) return [];
    return currentTest.items.filter(q => q.section === section);
  };

  // Helper to get answer summary for a question
  const getAnswerSummary = (q: MockQuestion) => {
    const userAnswer = responses[q.id];
    let correctAnswer = q.correctAnswer;
    let isCorrect: boolean | null = false;
    let displayUser = userAnswer;
    let displayCorrect = correctAnswer;

    // 1. Speaking
    if (q.section === "Speaking") {
      const hasRecording = responses[q.id + "_audio"];
      return {
        userAnswer: hasRecording ? "Audio recorded" : "No response",
        correctAnswer: q.audioScript || q.content || "Spoken response required",
        isCorrect: hasRecording ? null : false, 
        type: "speaking"
      };
    }
    
    // 2. Writing
    if (q.section === "Writing") {
      return {
        userAnswer: userAnswer || "No response",
        correctAnswer: "Written response required (Evaluated on length, grammar, and content)",
        isCorrect: userAnswer ? null : false,
        type: "writing"
      };
    }

    // 3. Reorder Paragraphs
    if (q.type === "Reorder Paragraphs") {
       // Correct Answer: Array of IDs in correct order
       const correctOrderIds = q.paragraphs 
          ? [...q.paragraphs].sort((a,b) => a.correctOrder - b.correctOrder).map(p => p.id)
          : [];
       
       // User Answer: Array of IDs
       const userOrderIds = Array.isArray(userAnswer) ? userAnswer : [];
       
       isCorrect = JSON.stringify(userOrderIds) === JSON.stringify(correctOrderIds);
       
       // Map to text for display
       const getSnippet = (id: string) => {
          const p = q.paragraphs?.find(x => x.id === id);
          return p ? `[${p.text.substring(0, 30)}...]` : id;
       };

       displayUser = userOrderIds.map(getSnippet).join(" → ");
       displayCorrect = correctOrderIds.map(getSnippet).join(" → ");
    }
    
    // 4. Fill in the Blanks (Reading / Listening / R&W)
    else if (q.type.includes("Fill in the Blanks")) {
       // Correct: Object {0: "word", 1: "word"} or Array
       // User: Object {0: "word"}
       
       // Normalize Correct Answer to Map
       const correctMap: Record<string, string> = {};
       if (q.blanks) {
          q.blanks.forEach((b, i) => correctMap[i] = b.correct);
       } else if (typeof q.correctAnswer === 'object') {
          Object.assign(correctMap, q.correctAnswer);
       }

       // Check correctness (all blanks match)
       let allCorrect = true;
       if (!userAnswer) allCorrect = false;
       else {
          Object.keys(correctMap).forEach(k => {
             if ((userAnswer[k] || "").toLowerCase() !== correctMap[k].toLowerCase()) allCorrect = false;
          });
       }
       isCorrect = allCorrect;

       // Format Display
       displayUser = userAnswer ? Object.entries(userAnswer).map(([k,v]) => `${Number(k)+1}: ${v}`).join(", ") : "No response";
       displayCorrect = Object.entries(correctMap).map(([k,v]) => `${Number(k)+1}: ${v}`).join(", ");
    }

    // 5. Highlight Incorrect Words
    else if (q.type === "Highlight Incorrect Words") {
       const userIndices = (Array.isArray(userAnswer) ? userAnswer : []).sort();
       const correctIndices = (Array.isArray(q.correctAnswer) ? q.correctAnswer : q.wrongWords || []).sort();
       
       isCorrect = JSON.stringify(userIndices) === JSON.stringify(correctIndices);
       
       // Display words
       // Fallback to stimulus or content if displayTranscript is missing
       const textSource = q.displayTranscript || q.stimulus || q.text || q.content || "";
       const words = textSource.split(/\s+/);
       
       displayUser = userIndices.map((i: number) => words[i] || `Index ${i}`).join(", ");
       displayCorrect = correctIndices.map((i: number) => words[i] || `Index ${i}`).join(", ");
       
       // Ensure displayCorrect is not empty for UI
       if (!displayCorrect && correctIndices.length > 0) {
           displayCorrect = `Indices: ${correctIndices.join(", ")}`;
       }
    }
    
    // 6. Multiple Choice (Multiple)
    else if (q.type.includes("Multiple Choice") && q.type.includes("Multiple")) {
        // Sort arrays before comparing
        const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
        const correctArr = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
        
        isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
        displayUser = userArr.join(", ");
        displayCorrect = correctArr.join(", ");
    }

    // 7. Summarize Spoken Text (SST) & Write From Dictation (WFD) Handling
    // Check for both full name and code
    else if (q.type === "Summarize Spoken Text" || q.type === "SST") {
       return {
          userAnswer: userAnswer || "No response",
          // Show keywords or model guidance instead of N/A
          correctAnswer: "Evaluation based on: Content (keywords), Form (50-70 words), Grammar, and Spelling.",
          isCorrect: null, 
          type: "writing"
       };
    }
    else if (q.type === "Write From Dictation" || q.type === "WFD") {
       // WFD: Show Diff if possible, otherwise simple comparison
       const correctText = q.audioScript || q.correctAnswer || "";
       
       // Simple check
       const userClean = String(userAnswer || "").trim().toLowerCase().replace(/[.,!?;]/g, "");
       const correctClean = String(correctText).trim().toLowerCase().replace(/[.,!?;]/g, "");
       
       // Perfect match check
       isCorrect = userClean === correctClean;
       
       // Partial credit heuristic for UI color
       if (!isCorrect && userAnswer) {
           const userWords = userClean.split(" ");
           const correctWords = correctClean.split(" ");
           const matchCount = userWords.filter((w: string) => correctWords.includes(w)).length;
           // If > 50% match, show as Partial (Yellow/Null), else Incorrect (False)
           if (matchCount > (correctWords.length * 0.5)) {
               isCorrect = null; 
           } else {
               isCorrect = false;
           }
       }
       
       return {
          userAnswer: userAnswer || "No response",
          correctAnswer: correctText,
          isCorrect: isCorrect, 
          type: "objective"
       };
    }

    // 8. Default Objective (Single Choice, etc.)
    else {
       // Fallback for standard text/string comparison
       const userStr = String(userAnswer || "").trim().toLowerCase();
       const correctStr = String(q.correctAnswer || "").trim().toLowerCase();
       isCorrect = userAnswer && (userStr === correctStr);
       
       displayUser = userAnswer || "No response";
       displayCorrect = q.correctAnswer;
    }

    return {
      userAnswer: displayUser || "No response",
      correctAnswer: displayCorrect || "N/A",
      isCorrect,
      type: "objective"
    };
  };

  // State for expanded sections
  // const [expandedSection, setExpandedSection] = useState<string | null>(null); // Moved to top

  if (testState === "finished") {
    const sections = ["Listening", "Reading", "Speaking", "Writing"];
    
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-green-100 bg-green-50/30 mb-6">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-green-900">Test Report</CardTitle>
            <CardDescription className="text-lg">PTE Academic Simulation</CardDescription>
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

            {/* Communicative Skills - Clickable */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg border-b pb-2">Communicative Skills <span className="text-sm font-normal text-muted-foreground">(click to view details)</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sections.map(section => {
                    const sectionQuestions = getQuestionsBySection(section);
                    const correctCount = sectionQuestions.filter(q => getAnswerSummary(q).isCorrect === true).length;
                    const totalCount = sectionQuestions.length;
                    const sectionScore = section === "Listening" ? score?.communicative.listening :
                                         section === "Reading" ? score?.communicative.reading :
                                         section === "Speaking" ? score?.communicative.speaking :
                                         score?.communicative.writing;
                    
                    return (
                      <button
                        key={section}
                        onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                        className={cn(
                          "p-4 bg-white rounded shadow-sm text-center transition-all hover:shadow-md hover:ring-2 hover:ring-blue-200 cursor-pointer",
                          expandedSection === section && "ring-2 ring-blue-500 bg-blue-50"
                        )}
                      >
                        <div className="text-2xl font-bold text-blue-600">{sectionScore}</div>
                        <div className="text-sm text-muted-foreground">{section}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {totalCount} questions
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 mx-auto mt-1 text-muted-foreground transition-transform",
                          expandedSection === section && "rotate-180"
                        )} />
                      </button>
                    );
                  })}
               </div>
               
               {/* Expanded Section Details */}
               {expandedSection && (
                 <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-100 animate-in slide-in-from-top-2">
                   <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Badge variant="outline">{expandedSection}</Badge>
                     Detailed Results
                   </h4>
                   
                   {getQuestionsBySection(expandedSection).map((q, idx) => {
                     const summary = getAnswerSummary(q);
                     const isCorrectIcon = summary.isCorrect === true ? (
                       <CheckCircle2 className="h-5 w-5 text-green-600" />
                     ) : summary.isCorrect === false ? (
                       <AlertCircle className="h-5 w-5 text-red-500" />
                     ) : (
                       <div className="h-5 w-5 rounded-full bg-yellow-200 flex items-center justify-center text-xs">?</div>
                     );
                     
                     return (
                       <div key={q.id} className={cn(
                         "p-4 rounded-lg mb-3 border",
                         summary.isCorrect === true ? "bg-green-50 border-green-200" :
                         summary.isCorrect === false ? "bg-red-50 border-red-200" :
                         "bg-yellow-50 border-yellow-200"
                       )}>
                         <div className="flex items-start gap-3">
                           <div className="mt-1">{isCorrectIcon}</div>
                           <div className="flex-1">
                             <div className="font-medium text-sm mb-1">
                               Q{idx + 1}: {q.type} {q.title && `- ${q.title}`}
                             </div>
                             
                             {/* Question Content Preview */}
                             {q.content && (
                               <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                 {q.content.substring(0, 150)}{q.content.length > 150 ? "..." : ""}
                               </p>
                             )}
                             
                             {/* Your Answer */}
                             <div className="mt-2 p-2 bg-white/80 rounded text-sm">
                               <span className="font-medium text-muted-foreground">Your Answer: </span>
                               <span className={cn(
                                 summary.isCorrect === false ? "text-red-700" : 
                                 summary.isCorrect === true ? "text-green-700" : "text-gray-700"
                               )}>
                                 {typeof summary.userAnswer === 'object' ? 
                                   JSON.stringify(summary.userAnswer) : 
                                   summary.userAnswer || "No response"}
                               </span>
                             </div>
                             
                             {/* Correct Answer (for objective questions) */}
                             {summary.type === "objective" && summary.isCorrect === false && (
                               <div className="mt-1 p-2 bg-green-100/50 rounded text-sm">
                                 <span className="font-medium text-green-800">Correct Answer: </span>
                                 <span className="text-green-700">
                                   {typeof summary.correctAnswer === 'object' ? 
                                     JSON.stringify(summary.correctAnswer) : 
                                     summary.correctAnswer}
                                 </span>
                               </div>
                             )}
                             
                             {/* For Speaking - show expected content */}
                             {summary.type === "speaking" && (
                               <div className="mt-1 p-2 bg-blue-50 rounded text-sm">
                                 <span className="font-medium text-blue-800">Expected Response: </span>
                                 <span className="text-blue-700 text-xs">
                                   {summary.correctAnswer?.substring(0, 200)}{(summary.correctAnswer?.length || 0) > 200 ? "..." : ""}
                                 </span>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     );
                   })}
                   
                   {/* Section Summary */}
                   <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                     <div className="font-medium mb-2">What to improve in {expandedSection}:</div>
                     <ul className="list-disc list-inside text-muted-foreground space-y-1">
                       {expandedSection === "Speaking" && (
                         <>
                           <li>Practice pronunciation and oral fluency</li>
                           <li>Work on content delivery and pacing</li>
                           <li>Record yourself and compare with native speakers</li>
                         </>
                       )}
                       {expandedSection === "Writing" && (
                         <>
                           <li>Review grammar and sentence structure</li>
                           <li>Expand vocabulary for academic writing</li>
                           <li>Practice spelling commonly misspelled words</li>
                         </>
                       )}
                       {expandedSection === "Reading" && (
                         <>
                           <li>Improve vocabulary recognition</li>
                           <li>Practice reading comprehension strategies</li>
                           <li>Work on grammar patterns in context</li>
                         </>
                       )}
                       {expandedSection === "Listening" && (
                         <>
                           <li>Practice with different accents</li>
                           <li>Improve note-taking while listening</li>
                           <li>Focus on catching key words and phrases</li>
                         </>
                       )}
                     </ul>
                   </div>
                 </div>
               )}
            </div>

            {/* Enabling Skills Breakdown */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg border-b pb-2">Skills Breakdown</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded"><span>Grammar</span> <b>{Math.round((score?.skills.grammar || 0) * 10) / 10}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Oral Fluency</span> <b>{Math.round((score?.skills.fluency || 0) * 10) / 10}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Pronunciation</span> <b>{Math.round((score?.skills.pronunciation || 0) * 10) / 10}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Spelling</span> <b>{Math.round((score?.skills.spelling || 0) * 10) / 10}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Vocabulary</span> <b>{Math.round((score?.skills.vocabulary || 0) * 10) / 10}</b></div>
                  <div className="flex justify-between p-2 bg-white rounded"><span>Written Discourse</span> <b>{Math.round((score?.skills.discourse || 0) * 10) / 10}</b></div>
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