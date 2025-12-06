import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateMockTest, MockQuestion } from "@/lib/mock-test-data";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ChevronRight, Mic, Volume2, UserCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

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

  // Intro Recording State
  const [isRecordingIntro, setIsRecordingIntro] = useState(false);
  const [introTimer, setIntroTimer] = useState(25);

  // Timer for active test question (Countdown)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testState === "active" && currentTest) {
      const currentQ = currentTest.items[currentIndex];
      const limit = currentQ.time_limit_seconds || 120; 
      
      setTimeLeft(limit); 

      interval = setInterval(() => {
        setTimeLeft(prev => {
           if (prev <= 1) {
             // Auto next for mockup simplicity when time runs out, or just sit at 0
             return 0;
           }
           
           // Specific Alerts
           const spent = limit - prev + 1;
           if (currentQ.section === "Reading" && spent === 60) {
             toast({
               variant: "destructive",
               title: "Time Management Alert",
               description: "You have spent 1 minute on this question. Please manage your time.",
               duration: 5000
             });
           }

           // Simulate Silence Detection for Speaking (Mock Logic)
           // If it's a speaking task and user hasn't "interacted" (we simulate interaction via time passing here)
           // In a real app we'd use Web Audio API. Here we just show the alert.
           if (currentQ.section === "Speaking" && spent === 4 && Math.random() > 0.95) {
              // Rare random event to show the UI feature exists
              toast({
                variant: "destructive",
                title: "Microphone Error",
                description: "No audio detected for 3 seconds. Microphone closed automatically.",
                duration: 4000
              });
           }

           return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, testState, currentTest]);

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
    setTestState("intro-recording");
  };

  const startIntroRecording = () => {
    setIsRecordingIntro(true);
    const interval = setInterval(() => {
      setIntroTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRecordingIntro(false);
          setTestState("test-intro"); // Auto move to next
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startTestProper = async () => {
    setTestState("active");
    const test = await generateTest(undefined, 56); 
    setCurrentTest(test);
    setCurrentIndex(0);
    setResponses({});
  };

  const submitAnswer = (val: any) => {
    if (!currentTest) return;
    const q = currentTest.items[currentIndex];
    setResponses(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    if (!currentTest) return;
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
    let speakingScore = 0, speakingMax = 0;
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
      if (item.section === "Speaking") { speakingScore += itemScore; speakingMax += item.max_score; }
      if (item.section === "Writing") { writingScore += itemScore; writingMax += item.max_score; }
      if (item.section === "Reading") { readingScore += itemScore; readingMax += item.max_score; }
      if (item.section === "Listening") { listeningScore += itemScore; listeningMax += item.max_score; }

      totalPoints += itemScore;
      maxPoints += item.max_score;
      details.push({ question_id: item.id, score: itemScore, max: item.max_score, type: item.type });
    }

    // Scale to 90
    const scale = (curr: number, max: number) => max === 0 ? 0 : Math.round((curr / max) * 90);

    const finalScores = {
      overall: scale(totalPoints, maxPoints),
      communicative: {
        speaking: scale(speakingScore, speakingMax),
        writing: scale(writingScore, writingMax),
        reading: scale(readingScore, readingMax),
        listening: scale(listeningScore, listeningMax)
      },
      skills: { // Mocked breakdown based on overall performance
        grammar: scale(totalPoints, maxPoints) - 5,
        fluency: scale(speakingScore, speakingMax),
        pronunciation: scale(speakingScore, speakingMax) - 2,
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
            {timeLeft < 30 && timeLeft > 0 && (
               <Badge variant="destructive" className="animate-pulse">Time Remaining: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</Badge>
            )}
            {timeLeft >= 30 && (
               <Badge variant="secondary">Time Remaining: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</Badge>
            )}
          </div>
          <h3 className="text-xl font-serif font-bold">{q.title}</h3>
          
          {/* Descriptions and Reminders for Listening */}
          {q.type === "Summarize Spoken Text" && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 mb-4">
              <strong>Reminder:</strong> You have 10 minutes to summarize the spoken text. This task tests your listening comprehension and writing skills.
            </div>
          )}
          {/* Add specific constraints warnings */}
          {q.type === "Summarize Written Text" && (
             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-yellow-800 mb-4">
               <strong>Constraint:</strong> Must be 5-75 words and exactly ONE sentence. Score will be zero if not followed.
             </div>
          )}
          {q.type === "Write Essay" && (
             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-yellow-800 mb-4">
               <strong>Constraint:</strong> 200-300 words. Auto-zero if under/over limit or >3 grammar errors.
             </div>
          )}
          
          {/* Content/Prompt */}
          {q.content && <p className="text-lg leading-relaxed">{q.content}</p>}
          {q.text && <p className="text-lg leading-relaxed">{q.text}</p>}
          {q.prompt && <p className="font-medium text-blue-800 bg-blue-50 p-3 rounded">{q.prompt}</p>}
          
          {/* Image */}
          {q.imageUrl && (
             <div className="border rounded-lg p-2 bg-white max-w-md">
               <img src={q.imageUrl} alt="Task" className="w-full h-auto" />
             </div>
          )}

          {/* Audio Script (Mock Audio) */}
          {q.audioScript && (
            <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
              <Button size="icon" variant="secondary" className="rounded-full">
                <PlayCircle className="h-6 w-6" />
              </Button>
              <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary/50" />
              </div>
              <span className="text-xs text-muted-foreground">Audio Playing...</span>
            </div>
          )}
        </div>

        {/* Interaction Area */}
        <div className="pt-4 border-t">
          {q.section === "Speaking" ? (
             <div className="flex flex-col items-center p-8 bg-muted/10 rounded-xl border-2 border-dashed">
                <Mic className="h-12 w-12 text-primary mb-4" />
                <p className="font-medium mb-4">Microphone is active. Recording answer...</p>
                <div className="h-2 w-full max-w-xs bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 animate-pulse w-2/3" />
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Recording stops automatically after 3 seconds of silence.
                </p>
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
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="text-center space-y-4 pb-8 pt-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold">Full Mock Test - UKVI Edition</CardTitle>
            <CardDescription className="text-lg max-w-lg mx-auto">
              A complete simulation of the PTE Academic UKVI exam.
            </CardDescription>
          </CardHeader>
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
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Mic className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Microphone Check</p>
                  <p className="text-sm text-muted-foreground">Say "Testing, one, two, three"</p>
                </div>
              </div>
              <Button variant={micChecked ? "secondary" : "default"} onClick={() => setMicChecked(true)}>
                {micChecked ? "Checked" : "Test Mic"}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Volume2 className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Audio Playback Check</p>
                  <p className="text-sm text-muted-foreground">Click to hear a sample sound</p>
                </div>
              </div>
              <Button variant={audioChecked ? "secondary" : "default"} onClick={() => setAudioChecked(true)}>
                {audioChecked ? "Checked" : "Play Sound"}
              </Button>
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <span className="font-mono border px-2 py-1 rounded">Q W E R T Y</span>
                <div>
                  <p className="font-medium">Keyboard Check</p>
                  <p className="text-sm text-muted-foreground">Type a few characters to verify</p>
                </div>
              </div>
              <Button variant={keyboardChecked ? "secondary" : "default"} onClick={() => setKeyboardChecked(true)}>
                {keyboardChecked ? "Checked" : "Test Keys"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
             <Button 
               disabled={!micChecked || !audioChecked || !keyboardChecked} 
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
              <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                <div className="h-3 w-3 bg-red-500 rounded-full" /> Recording...
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
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Speaking:</strong> Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, etc.</li>
              <li><strong>Writing:</strong> Summarize Written Text, Essay.</li>
              <li><strong>Reading:</strong> Fill in Blanks, MCQ, Reorder Paragraphs.</li>
              <li><strong>Listening:</strong> Summarize Spoken Text, MCQ, Dictation.</li>
            </ul>
            <div className="mt-4 bg-muted p-4 rounded text-sm">
              <strong>Note:</strong> You cannot save and exit. All questions must be attempted.
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
            <Link href="/resources">
              <Button>Back to Resources</Button>
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