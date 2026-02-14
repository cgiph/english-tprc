
import { useParams, Link } from "wouter";
import { getCourseById, Module } from "@/lib/lms-data";
import type { Lesson } from "@/lib/lms-data";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";

type ActiveLesson = {
  lesson: Lesson;
  moduleId: string;
};
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Lock, PlayCircle, ChevronLeft, FileText, HelpCircle, Video, Download, ChevronRight, Circle, MessageSquare, ChevronDown, ChevronUp, PanelRightClose, PanelRightOpen, SidebarClose, SidebarOpen, Volume2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import { useRef, useState, useEffect } from "react";
import { Mic, StopCircle, RefreshCw } from "lucide-react";
import { useLMS } from "@/hooks/use-lms";
import { ModuleQuiz } from "@/components/lms/module-quiz";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { NounPractice } from "@/components/lms/noun-practice";
import { GrammarGuard } from "@/components/lms/grammar-guard";
import { SwtPracticeLab } from "@/components/lms/swt-practice-lab";
import { RepeatSentencePractice } from "@/components/lms/repeat-sentence-practice";
import { ReadingMockTest } from "@/components/lms/reading-mock-test";
import { ListeningMockTest } from "@/components/lms/listening-mock-test";
import { WritingMockTest } from "@/components/lms/writing-mock-test";
import { MockExamCompletion } from "@/components/lms/mock-exam-completion";
import pteBarChart from "@/assets/images/pte-bar-chart.png";
import waveformBad from "@/assets/images/waveform-bad.png";
import waveformGood from "@/assets/images/waveform-good.png";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PricingContent } from "@/components/pricing-modal";

function SpeakingPractice({ content, lessonId }: { content: string; lessonId?: string }) {
  const { submitSectionScore, state } = useLMS();
  const [isMemorizeMode, setIsMemorizeMode] = useState(false);
  const [isPlayingBad, setIsPlayingBad] = useState(false);
  const [isPlayingGood, setIsPlayingGood] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [gradingStatus, setGradingStatus] = useState<'idle' | 'analyzing' | 'graded'>('idle');
  const [score, setScore] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Check if this lesson has already been graded
  useEffect(() => {
    if (lessonId && state.sectionScores?.[lessonId]) {
       setScore(state.sectionScores[lessonId].score);
       setGradingStatus('graded');
    }
  }, [lessonId, state.sectionScores]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  const simulateGrading = () => {
    setGradingStatus('analyzing');
    
    // Simulate AI processing time
    setTimeout(() => {
        // Generate a random score between 55 and 90 for the mockup
        // In a real app, this would come from the backend AI service
        const mockScore = Math.floor(Math.random() * (90 - 55 + 1)) + 55;
        
        setScore(mockScore);
        setGradingStatus('graded');
        setAttemptCount(prev => prev + 1);
        
        // Track Speaking Submission
        // Mock values for fluency and pronunciation since this is a simulation
        analytics.trackSpeakingSubmission(Math.min(90, mockScore - 2), mockScore, Math.min(90, mockScore + 5), attemptCount + 1);

        if (lessonId) {
            submitSectionScore(lessonId, mockScore);
        }
    }, 2000);
  };


  const playBadExample = () => {
    if (isPlayingBad) return;
    setIsPlayingBad(true);
    const u1 = new SpeechSynthesisUtterance("One smooth...");
    u1.rate = 0.8;
    const u2 = new SpeechSynthesisUtterance("incorrect sentence...");
    u2.rate = 0.7;
    const u3 = new SpeechSynthesisUtterance("is... uhm... is worth more.");
    u3.rate = 0.6;
    
    u1.onend = () => window.speechSynthesis.speak(u2);
    u2.onend = () => {
      setTimeout(() => window.speechSynthesis.speak(u3), 500);
    };
    u3.onend = () => setIsPlayingBad(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u1);
  };

  const playGoodExample = () => {
    if (isPlayingGood) return;
    setIsPlayingGood(true);
    const u = new SpeechSynthesisUtterance("One smooth, incorrect sentence is worth more than one hesitant, perfect sentence.");
    u.rate = 1.1;
    u.pitch = 1.1;
    u.onend = () => setIsPlayingGood(false);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        // Don't set src immediately here to avoid race conditions or empty sources
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permission is granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playUserAudio = () => {
    if (userAudioRef.current && audioBlob) {
        // Create object URL only when playing if not already set or valid
        if (!userAudioRef.current.src || userAudioRef.current.src === "") {
            const url = URL.createObjectURL(audioBlob);
            userAudioRef.current.src = url;
            
            // Clean up old URL when audio ends or source changes
            userAudioRef.current.onended = () => {
                setIsPlayingUser(false);
            };
        }
        
        setIsPlayingUser(true);
        userAudioRef.current.play().catch(e => {
            console.error("Playback failed:", e);
            setIsPlayingUser(false);
        });
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (userAudioRef.current) {
        userAudioRef.current.pause();
        userAudioRef.current.removeAttribute('src'); // Better than setting to empty string
        userAudioRef.current.load(); // Reload to reset state
    }
  };

  // Basic check to see if we should render the interactive mode
  // This is a simple heuristic based on the presence of specific keywords or structure
  // In a real app, this would be a specific lesson type or metadata
  const isTemplateLesson = content.includes("Template Teleprompter") || content.includes("AI Scoring Rules") || content.includes("Grammar Guard") || content.includes("SWT Practice Lab") || content.includes("REPEAT_SENTENCE_PRACTICE") || content.includes("DESCRIBE_IMAGE_PRACTICE") || content.includes("SPEAKING_MOCK_TEST") || content.includes("READING_MOCK_TEST") || content.includes("LISTENING_MOCK_TEST") || content.includes("WRITING_MOCK_TEST") || content.includes("MOCK_EXAM_COMPLETION");

  if (!isTemplateLesson) {
    return <div className="w-full mx-auto p-8 text-left" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Handle Mock Exam Completion
  if (content.includes("<!-- MOCK_EXAM_COMPLETION -->")) {
     return <MockExamCompletion />;
  }

  // Handle Speaking Mock Test
  if (content.includes("SPEAKING_MOCK_TEST")) {
     const parts = content.split("<!-- SPEAKING_MOCK_TEST -->");
     const mainContent = parts[0] || content;
     
     // Extract TTS text from data-tts attribute
     const ttsMatch = mainContent.match(/data-tts="([^"]+)"/);
     const ttsText = ttsMatch ? ttsMatch[1] : null;

     const playTTS = () => {
       if (!ttsText) return;
       const u = new SpeechSynthesisUtterance(ttsText);
       u.rate = 1.0;
       window.speechSynthesis.cancel();
       window.speechSynthesis.speak(u);
     };

     // Check for custom audio player placement
     if (mainContent.includes("<!-- AUDIO_PLAYER_PLACEHOLDER -->")) {
        const [part1, part2] = mainContent.split("<!-- AUDIO_PLAYER_PLACEHOLDER -->");
        
        return (
            <div className="w-full mx-auto p-8 text-left space-y-6">
                <div dangerouslySetInnerHTML={{ __html: part1 }} />
                
                {ttsText && (
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <Button onClick={playTTS} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                            <Volume2 className="w-4 h-4" />
                            Play Audio
                        </Button>
                        <span className="text-sm text-slate-500 italic">Click to listen to the prompt</span>
                    </div>
                )}
                
                <div dangerouslySetInnerHTML={{ __html: part2 }} />

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center max-w-2xl mx-auto mt-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                        <span className="p-1 bg-red-100 text-red-700 rounded-lg">⏺️</span>
                        Record Response
                    </h4>
                    
                    {!audioBlob ? (
                        <div className="flex justify-center">
                            <Button 
                                size="lg" 
                                className={cn(
                                    "rounded-full w-20 h-20 flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:scale-105", 
                                    isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200" : "bg-indigo-600 hover:bg-indigo-700"
                                )}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? <div className="w-8 h-8 bg-white rounded-sm" /> : <Mic className="w-10 h-10 text-white" />}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300 w-full">
                            <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-full shadow-md border border-slate-200 w-full max-w-sm justify-center">
                                <button 
                                    onClick={playUserAudio}
                                    disabled={isPlayingUser}
                                    className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors shrink-0"
                                >
                                    {isPlayingUser ? <div className="w-4 h-4 bg-indigo-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-6 h-6 ml-0.5" />}
                                </button>
                                <span className="text-sm font-bold text-slate-700 truncate">Recording Saved</span>
                                <audio ref={userAudioRef} className="hidden" />
                            </div>
                            
                            {/* Grading Section */}
                            {gradingStatus === 'idle' && (
                                <div className="flex gap-3">
                                    <Button variant="ghost" size="sm" onClick={resetRecording} className="text-slate-500 hover:text-red-500 hover:bg-red-50">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Record Again
                                    </Button>
                                    <Button size="lg" onClick={simulateGrading} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg animate-pulse">
                                        Submit for Grading
                                    </Button>
                                </div>
                            )}

                            {gradingStatus === 'analyzing' && (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <span className="text-sm text-indigo-600 font-medium">Analyzing pronunciation & fluency...</span>
                                </div>
                            )}

                            {gradingStatus === 'graded' && score !== null && (
                                <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4">
                                    <div className="text-center mb-4">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your AI Score</div>
                                        <div className={cn("text-5xl font-black mb-2", score >= 65 ? "text-emerald-600" : "text-amber-500")}>
                                            {score}
                                        </div>
                                        <div className="text-sm font-medium text-slate-600">
                                            {score >= 65 ? "Passing Score! Great job." : "Needs Improvement. Try again."}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium text-slate-500">
                                            <span>Content</span>
                                            <span className="text-slate-900">{Math.min(90, score + 5)}/90</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((score + 5)/90)*100}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
                                            <span>Fluency</span>
                                            <span className="text-slate-900">{Math.min(90, score - 2)}/90</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((score - 2)/90)*100}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-tight bg-slate-50 p-2 rounded">
                                        * Simulated Score: Official PTE scoring uses complex spectral analysis not available in this demo mode.
                                    </div>

                                    <Button variant="outline" size="sm" onClick={resetRecording} className="mt-4 w-full text-slate-500">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Try for a better score
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <p className="text-sm text-slate-500 mt-6 font-medium">
                        {isRecording ? "Recording in progress..." : audioBlob ? "" : "Click microphone to start."}
                    </p>
                </div>
            </div>
        );
     }

     return (
       <div className="w-full mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: mainContent }} />
          
          {ttsText && (
             <div className="flex justify-center -mt-4 mb-8">
                <Button onClick={playTTS} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                   <Volume2 className="w-5 h-5" />
                   Play Audio Prompt
                </Button>
             </div>
          )}
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center max-w-2xl mx-auto">
              <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                  <span className="p-1 bg-red-100 text-red-700 rounded-lg">⏺️</span>
                  Record Response
              </h4>
              
              {!audioBlob ? (
                  <div className="flex justify-center">
                      <Button 
                          size="lg" 
                          className={cn(
                              "rounded-full w-20 h-20 flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:scale-105", 
                              isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200" : "bg-indigo-600 hover:bg-indigo-700"
                          )}
                          onClick={isRecording ? stopRecording : startRecording}
                      >
                          {isRecording ? <div className="w-8 h-8 bg-white rounded-sm" /> : <Mic className="w-10 h-10 text-white" />}
                      </Button>
                  </div>
              ) : (
                  <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 w-full">
                       <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-full shadow-md border border-slate-200 w-full max-w-sm justify-center">
                          <button 
                              onClick={playUserAudio}
                              disabled={isPlayingUser}
                              className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors shrink-0"
                          >
                              {isPlayingUser ? <div className="w-4 h-4 bg-indigo-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-6 h-6 ml-0.5" />}
                          </button>
                          <span className="text-sm font-bold text-slate-700 truncate">Recording Saved</span>
                          <audio ref={userAudioRef} className="hidden" />
                       </div>
                       
                       <Button variant="ghost" size="sm" onClick={resetRecording} className="text-slate-500 hover:text-red-500 hover:bg-red-50">
                          <RefreshCw className="w-4 h-4 mr-2" /> Record Again
                       </Button>
                  </div>
              )}
              
              <p className="text-sm text-slate-500 mt-6 font-medium">
                  {isRecording ? "Recording in progress..." : audioBlob ? "Click play to review." : "Click microphone to start."}
              </p>
          </div>
       </div>
     );
  }

  // Handle AI Scoring Rules / Audio Examples
  if (content.includes("AI Scoring Rules") || content.includes("AUDIO_EXAMPLES")) {
     const parts = content.split("<!-- AUDIO_EXAMPLES -->");
     const mainContent = parts[0] || content;

     return (
       <div className="w-full mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: mainContent }} />
          
          <div className="space-y-4 pt-4 border-t border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="p-1 bg-indigo-100 text-indigo-700 rounded-lg">🎧</span>
                Listen and Compare
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
                {/* Bad Example */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-2 opacity-10 text-red-600">
                      <Video className="w-24 h-24" />
                   </div>
                   
                   <div className="relative z-10">
                      <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                         <span className="bg-red-200 text-red-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider">Bad Example</span>
                      </h4>
                      <p className="text-sm text-red-700 mb-4 h-10">Hesitant, includes fillers, and restarts sentences.</p>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 border border-red-100">
                         <button 
                           onClick={playBadExample}
                           disabled={isPlayingBad}
                           className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50"
                         >
                            {isPlayingBad ? <div className="w-3 h-3 bg-red-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-6 h-6 ml-0.5" />}
                         </button>
                         <div className="flex-1 flex items-center justify-center h-10 overflow-hidden relative">
                            <img src={waveformBad} alt="Erratic waveform" className="h-full w-full object-contain opacity-80" />
                            {isPlayingBad && <div className="absolute inset-0 bg-red-100/30 animate-pulse" />}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Good Example */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-2 opacity-10 text-green-600">
                      <CheckCircle2 className="w-24 h-24" />
                   </div>
                   
                   <div className="relative z-10">
                      <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                         <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider">Good Example</span>
                      </h4>
                      <p className="text-sm text-green-700 mb-4 h-10">Smooth flow, steady pace, even with minor grammar errors.</p>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 border border-green-100">
                         <button 
                           onClick={playGoodExample}
                           disabled={isPlayingGood}
                           className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50"
                         >
                            {isPlayingGood ? <div className="w-3 h-3 bg-green-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-6 h-6 ml-0.5" />}
                         </button>
                         <div className="flex-1 flex items-center justify-center h-10 overflow-hidden relative">
                            <img src={waveformGood} alt="Smooth waveform" className="h-full w-full object-contain opacity-80" />
                            {isPlayingGood && <div className="absolute inset-0 bg-green-100/30 animate-pulse" />}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Try it yourself section */}
             <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <span className="p-1 bg-orange-100 text-orange-700 rounded-lg">🎤</span>
                    Try It Yourself
                </h3>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-600 mb-6 font-medium">"One smooth, incorrect sentence is worth more than one hesitant, perfect sentence."</p>
                    
                    {!audioBlob ? (
                        <div className="flex justify-center">
                            <Button 
                                size="lg" 
                                className={cn(
                                    "rounded-full w-16 h-16 flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105", 
                                    isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700"
                                )}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic className="w-8 h-8 text-white" />}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                             <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-200">
                                <button 
                                    onClick={playUserAudio}
                                    disabled={isPlayingUser}
                                    className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors"
                                >
                                    {isPlayingUser ? <div className="w-3 h-3 bg-indigo-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
                                </button>
                                <span className="text-sm font-medium text-slate-600">Your Recording</span>
                                <audio ref={userAudioRef} className="hidden" />
                             </div>
                             
                             <Button variant="ghost" size="sm" onClick={resetRecording} className="text-slate-500 hover:text-red-500">
                                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                             </Button>
                        </div>
                    )}
                    
                    <p className="text-xs text-slate-400 mt-4 h-4">
                        {isRecording ? "Recording... Speak now!" : audioBlob ? "Great! Listen to compare." : "Click microphone to record"}
                    </p>
                </div>
             </div>
          </div>
       </div>
     );
  }

  // Handle Describe Image Practice
  if (content.includes("DESCRIBE_IMAGE_PRACTICE")) {
     const parts = content.split("<!-- DESCRIBE_IMAGE_PRACTICE -->");
     const theoryContent = parts[0] || content;
     const tipsContent = parts[1] || "";

     return (
       <div className="w-full mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: theoryContent }} />
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center max-w-2xl mx-auto">
             <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                   Practice Image
                </h3>
                <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">Bar Chart</span>
             </div>
             
             <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm w-full bg-white mb-4">
                <img src={pteBarChart} alt="PTE Practice Bar Chart: World Population" className="w-full h-auto object-contain max-h-[400px]" />
             </div>
             
             <div className="w-full bg-blue-50 p-4 rounded text-sm text-blue-800 italic border border-blue-100">
                "Describe this image using the template above. Focus on the highest (Asia) and lowest (Europe) values."
             </div>
             
             {/* Recording Tool */}
             <div className="w-full mt-6 pt-6 border-t border-slate-100 flex flex-col items-center">
                 <h4 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
                     <span className="p-1 bg-orange-100 text-orange-700 rounded-lg">🎤</span>
                     Record Your Answer
                 </h4>
                 
                 {!audioBlob ? (
                    <div className="flex justify-center">
                        <Button 
                            size="lg" 
                            className={cn(
                                "rounded-full w-16 h-16 flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105", 
                                isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700"
                            )}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic className="w-8 h-8 text-white" />}
                        </Button>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 w-full">
                         <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-full shadow-sm border border-slate-200 w-full max-w-sm justify-center">
                            <button 
                                onClick={playUserAudio}
                                disabled={isPlayingUser}
                                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors shrink-0"
                            >
                                {isPlayingUser ? <div className="w-3 h-3 bg-indigo-600 rounded-sm animate-pulse" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
                            </button>
                            <span className="text-sm font-medium text-slate-600 truncate">Your Recording</span>
                            <audio ref={userAudioRef} className="hidden" />
                         </div>
                         
                         <Button variant="ghost" size="sm" onClick={resetRecording} className="text-slate-500 hover:text-red-500">
                            <RefreshCw className="w-4 h-4 mr-2" /> Record Again
                         </Button>
                    </div>
                 )}
                 
                 <p className="text-xs text-slate-400 mt-4 h-4">
                     {isRecording ? "Recording... Describe the image now!" : audioBlob ? "Click play to review your description." : "Click microphone to start recording"}
                 </p>
             </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: tipsContent }} />
       </div>
     );
  }

  // Handle Repeat Sentence Practice
  if (content.includes("REPEAT_SENTENCE_PRACTICE")) {
     // Split content to show the theory part first, then the interactive component
     const parts = content.split("<!-- REPEAT_SENTENCE_PRACTICE -->");
     const theoryContent = parts[0] || content;

     return (
       <div className="w-full mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: theoryContent }} />
          <RepeatSentencePractice />
       </div>
     );
  }

  // Handle SWT Practice Lab
  if (content.includes("SWT Practice Lab")) {
      return (
          <div className="w-full mx-auto p-8 text-left h-full flex flex-col">
              <div className="mb-6">
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Summarize Written Text: Interactive Lab</h2>
                 <p className="text-slate-600">Read the passage on the left and summarize it into ONE sentence on the right.</p>
              </div>
              <SwtPracticeLab />
          </div>
      );
  }

  // Handle Grammar Guard Lesson
  if (content.includes("Grammar Guard")) {
     // Split content to show the theory part first, then the interactive component
     const parts = content.split("<!-- INTERACTIVE_COMPONENT -->");
     const theoryContent = parts[0] || content;

     return (
       <div className="w-full mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: theoryContent }} />
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Interactive Practice: The One-Sentence Challenge</h3>
             <GrammarGuard />
          </div>
       </div>
     );
  }

  // Handle Writing Mock Test
  if (content.includes("<!-- WRITING_MOCK_TEST -->")) {
     return <WritingMockTest />;
  }

  // Handle Reading Mock Test
  if (content.includes("<!-- READING_MOCK_TEST -->")) {
     return <ReadingMockTest />;
  }

  // Handle Listening Mock Test
  if (content.includes("<!-- LISTENING_MOCK_TEST -->")) {
     return <ListeningMockTest />;
  }

  // Parse content to extract the main parts if needed, or just render the specialized view directly
  // For this mockup, we'll replace the static HTML with the interactive React component
  // based on which lesson it looks like (Retell Lecture vs AI Auditor)
  
  if (content.includes("Template Teleprompter")) {
    return (
      <div className="w-full mx-auto p-8 text-left space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <p className="text-amber-900 text-sm"><strong>The 80/20 Rule:</strong> 80% of your score comes from the notes you take; 20% comes from using this template smoothly.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="bg-slate-800 px-3 py-1 text-white font-bold text-center uppercase tracking-widest text-xs rounded-t-lg inline-block">
              Template Teleprompter
            </div>
            <button 
              onClick={() => setIsMemorizeMode(!isMemorizeMode)}
              className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
            >
              {isMemorizeMode ? "👁️ Show Full Template" : "🧠 Practice Recall Mode"}
            </button>
          </div>

          <div className={`p-8 rounded-xl border-2 transition-all duration-500 shadow-sm ${isMemorizeMode ? 'bg-slate-900 border-indigo-500' : 'bg-white border-slate-200'}`}>
            <div className={`text-xl font-serif leading-relaxed ${isMemorizeMode ? 'text-slate-400 italic' : 'text-slate-800'}`}>
              {isMemorizeMode ? (
                <>
                  "The speaker was... <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Topic]</span>. 
                  He mentioned... <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Keyword 1]</span>, 
                  <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Keyword 2]</span>, and 
                  <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Keyword 3]</span>... 
                  Furthermore... <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Keyword 4]</span>. 
                  In conclusion... <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">[Keyword 5]</span>..."
                </>
              ) : (
                <>
                  "The speaker was discussing <span className="bg-yellow-200 px-1 rounded text-black font-bold">[Topic]</span>. 
                  He mentioned <span className="text-indigo-600 font-bold underline">[Keyword 1]</span>, 
                  <span className="text-indigo-600 font-bold underline">[Keyword 2]</span>, and 
                  <span className="text-indigo-600 font-bold underline">[Keyword 3]</span>. 
                  Furthermore, the lecture highlighted <span className="text-indigo-600 font-bold underline">[Keyword 4]</span>. 
                  In conclusion, the speaker suggested that <span className="text-indigo-600 font-bold underline">[Keyword 5]</span> is vital."
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for AI Auditor or other lessons
  return <div className="w-full mx-auto p-8 text-left" dangerouslySetInnerHTML={{ __html: content }} />;
}

export default function CourseViewer() {
  const { id } = useParams();
  const { user } = useUser();
  const rawCourse = getCourseById(id || "");
  const { state, completeLesson, unlockModule, submitQuizScore, submitSupportTicket } = useLMS();
  
  // Quiz State
  const [quizOpen, setQuizOpen] = useState(false);
  const [lessonQuizOpen, setLessonQuizOpen] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<{id: string, title: string, quizId?: string} | null>(null);
  const { toast } = useToast();

  // Active Lesson State (for Player)
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  
  // Expanded Modules State
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Trainer Support State
  const [supportQuestion, setSupportQuestion] = useState("");
  
  // Sidebar State
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!rawCourse) return <NotFound />;

  // Merge static course data with user progress state
  const course = {
    ...rawCourse,
    modules: rawCourse.modules.map((m, index) => {
      const userModule = state.modules[m.id];
      return {
        ...m,
        // If state exists use it, otherwise fallback to Locked (unless it's the very first one which is default unlocked)
        status: userModule ? userModule.status : (index === 0 ? "unlocked" : "locked"),
        lessons: m.lessons.map(l => ({
          ...l,
          isCompleted: userModule?.completedLessons?.includes(l.id) || false
        }))
      };
    }),
    // Recalculate course progress based on user state
    completedModules: rawCourse.modules.filter(m => state.modules[m.id]?.status === "completed").length
  };

  // Calculate total course progress percentage
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);
  const courseProgressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  // Initialize active lesson if none selected (find first incomplete unlocked lesson or just first lesson)
  // Also initialize expanded state for modules
  useEffect(() => {
    // Only initialize if we haven't already selected a lesson
    if (!activeLesson && course.modules.length > 0) {
      // Find first unlocked module
      const firstUnlocked = course.modules.find(m => m.status === "unlocked" || m.status === "in-progress" || m.status === "completed");
      if (firstUnlocked && firstUnlocked.lessons.length > 0) {
        // Find first incomplete lesson in this module
        const firstIncomplete = firstUnlocked.lessons.find(l => !l.isCompleted);
        const targetLesson = firstIncomplete || firstUnlocked.lessons[0];
        setActiveLesson({
          lesson: targetLesson,
          moduleId: firstUnlocked.id
        });
        
        // Expand the active module by default
        setExpandedModules(prev => ({
          ...prev,
          [firstUnlocked.id]: true
        }));
      }
    }
  }, [course.modules, activeLesson]); // Depend on course.modules to re-run when data loads/changes

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };


  const handleLessonStart = (moduleId: string, lessonId: string, type: string) => {
    const module = course.modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (lesson) {
        setActiveLesson({
            lesson,
            moduleId
        });
    }

    if (type === "quiz") {
      if (module) {
        // Pass the lessonId as the specific quizId (e.g., "pte-m2-quiz-ai")
        setActiveQuizModule({ id: module.id, title: module.title, quizId: lessonId });
        setQuizOpen(true);
      }
    }
  };

  // Track lesson start when active lesson changes
  useEffect(() => {
    if (activeLesson) {
      analytics.trackLessonStart(activeLesson.lesson.id, activeLesson.lesson.title, activeLesson.moduleId);
      
      return () => {
        // Track abandonment if component unmounts or lesson changes without completion
        // Note: Ideally we'd check if it was completed, but for now this tracks time spent
        analytics.trackAbandonedLesson(activeLesson.lesson.id);
      };
    }
  }, [activeLesson?.lesson.id]);

  const handleMarkComplete = () => {
    if (activeLesson) {
        if (activeLesson.lesson.type === "quiz") {
            // Re-open quiz modal if it's a quiz type
            const module = course.modules.find(m => m.id === activeLesson.moduleId);
            if (module) {
                setActiveQuizModule({ id: module.id, title: module.title });
                setQuizOpen(true);
            }
        } else if (activeLesson.lesson.quizId) {
            // If lesson has a specific quiz, open it
            setLessonQuizOpen(true);
        } else {
            completeLesson(activeLesson.moduleId, activeLesson.lesson.id);
            analytics.trackLessonComplete(activeLesson.lesson.id, activeLesson.lesson.title);
            toast({
                title: "Lesson Completed",
                description: "Progress saved."
            });
        }
    }
  };

  const handleLessonQuizComplete = (score: number) => {
    if (activeLesson && activeLesson.lesson.quizId) {
        if (score >= 80) { // 80% pass mark for lesson quizzes too
            completeLesson(activeLesson.moduleId, activeLesson.lesson.id);
            analytics.trackLessonComplete(activeLesson.lesson.id, activeLesson.lesson.title);
            toast({
                title: "Lesson Completed",
                description: `You passed the quiz with ${score}%. Lesson marked as complete.`,
                className: "bg-green-50 border-green-200"
            });
            setLessonQuizOpen(false);
        } else {
             toast({
                variant: "destructive",
                title: "Quiz Failed",
                description: `You scored ${score}%. You need 80% to complete this lesson.`
             });
        }
    }
  };

  const handleSupportSubmit = () => {
    if (!supportQuestion.trim()) return;
    
    // Send to LMS state
    if (activeLesson) {
      submitSupportTicket(activeLesson.lesson.id, activeLesson.lesson.title, supportQuestion);
    } else {
      submitSupportTicket("general", course.title, supportQuestion);
    }

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the Cirrus Training Team.",
      className: "bg-blue-50 border-blue-200"
    });
    setSupportQuestion("");
  };

  const handleQuizComplete = (score: number) => {
    if (activeQuizModule) {
       submitQuizScore(activeQuizModule.id, score);
       
       if (score >= 80) {
         // Mark lesson complete
         // In real app we'd find the quiz lesson ID, here we assume it's the last one or pass it
         const module = course.modules.find(m => m.id === activeQuizModule.id);
         const quizLesson = module?.lessons.find(l => l.type === "quiz");
         if (quizLesson) {
            completeLesson(activeQuizModule.id, quizLesson.id);
         }

         // Unlock NEXT module logic
         const currentIndex = course.modules.findIndex(m => m.id === activeQuizModule.id);
         if (currentIndex >= 0 && currentIndex < course.modules.length - 1) {
           const nextModule = course.modules[currentIndex + 1];
           unlockModule(nextModule.id);
           
           if (nextModule.id.includes("mock")) {
             analytics.trackMockTestUnlocked(nextModule.id);
           }
           
           toast({
             title: "Next Module Unlocked!",
             description: `You passed with ${score}%. ${nextModule.title} is now available.`,
             className: "bg-green-50 border-green-200"
           });
         }
       } else {
         toast({
            variant: "destructive",
            title: "Quiz Failed",
            description: `You scored ${score}%. You need 80% to proceed.`
         });
       }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Quiz Modal */}
      {activeQuizModule && (
        <ModuleQuiz 
          key={activeQuizModule.id + (activeQuizModule.quizId || "")}
          isOpen={quizOpen} 
          onClose={() => setQuizOpen(false)} 
          moduleId={activeQuizModule.id}
          moduleTitle={activeQuizModule.title}
          quizId={activeQuizModule.quizId}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Lesson Quiz Modal */}
      {activeLesson && activeLesson.lesson.quizId && (
        <ModuleQuiz
            key={`lesson-quiz-${activeLesson.lesson.id}`}
            isOpen={lessonQuizOpen}
            onClose={() => setLessonQuizOpen(false)}
            moduleId={activeLesson.moduleId}
            moduleTitle={`Lesson Quiz: ${activeLesson.lesson.title}`}
            quizId={activeLesson.lesson.quizId}
            onComplete={handleLessonQuizComplete}
        />
      )}

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 text-slate-100 relative scroll-smooth">
        {/* Header Overlay */}
        <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
           <div>
             <Link href="/lms" onClick={() => analytics.trackBackToDashboard("Course Viewer")} className="text-xs text-slate-400 hover:text-white flex items-center mb-1">
               <ChevronLeft className="h-3 w-3 mr-1" /> Back to Dashboard
             </Link>
             <h1 className="text-lg font-bold text-white">{activeLesson?.lesson.title || course.title}</h1>
           </div>
           <div className="flex items-center gap-2">
             <Badge variant="outline" className="text-slate-300 border-slate-700 hidden md:flex">{course.title}</Badge>
             <Button 
               variant="ghost" 
               size="icon" 
               className="text-slate-400 hover:text-white hover:bg-slate-800 ml-2"
               onClick={() => setSidebarOpen(!isSidebarOpen)}
               title={isSidebarOpen ? "Hide Syllabus" : "Show Syllabus"}
             >
               {isSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
             </Button>
           </div>
        </div>

        {/* Lesson Content Container */}
        <div className="flex-grow shrink-0 relative w-full z-0">
           {activeLesson ? (
              <div className={cn(
                "w-full transition-all duration-300",
                activeLesson.lesson.type === "video" 
                   ? "flex items-center justify-center bg-black/40 p-8 min-h-[600px]" 
                   : activeLesson.lesson.type === "quiz"
                     ? "bg-slate-50 flex flex-col min-h-[500px]" 
                     : "bg-white text-slate-900" 
              )}>
                 {activeLesson.lesson.type === "video" ? (
                    <div className="w-full max-w-5xl aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    {activeLesson.lesson.videoUrl ? (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={activeLesson.lesson.videoUrl} 
                        title={activeLesson.lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                        <PlayCircle className="h-24 w-24 text-slate-700 group-hover:text-primary transition-colors cursor-pointer" />
                        <p className="text-slate-500 font-medium">Video Placeholder: {activeLesson.lesson.title}</p>
                      </div>
                    )}
                    </div>
                 ) : activeLesson.lesson.type === "quiz" ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-8">
                       <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                         <HelpCircle className="h-20 w-20 text-orange-500 mx-auto" />
                         <h3 className="text-2xl font-bold text-slate-900">Module Assessment</h3>
                         <p className="text-slate-500">Pass this quiz with 80% or higher to unlock the next module.</p>
                         <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white w-full" onClick={() => handleLessonStart(activeLesson.moduleId, activeLesson.lesson.id, "quiz")}>Start Quiz</Button>
                       </div>
                    </div>
                 ) : activeLesson.lesson.id === "l3-bonus" ? (
                    <div className="p-8 max-w-6xl mx-auto w-full">
                       <NounPractice onComplete={handleMarkComplete} />
                    </div>
                 ) : (
                    <div className="w-full max-w-6xl mx-auto">
                       {(activeLesson.lesson.type === "reading" || activeLesson.lesson.type === "assignment") && activeLesson.lesson.content ? (
                         <div className="bg-white min-h-[600px]">
                            <SpeakingPractice content={activeLesson.lesson.content} lessonId={activeLesson.lesson.id} />
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-2xl px-8 mx-auto">
                            <FileText className="h-20 w-20 text-slate-300 mx-auto" />
                            <h3 className="text-2xl font-bold text-slate-400">{activeLesson.lesson.title}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                              Reading content for this lesson would appear here. This is a mockup for the reading interface.
                            </p>
                         </div>
                       )}
                    </div>
                 )}
              </div>
           ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <p>Select a lesson to begin</p>
              </div>
           )}
        </div>

        {/* Lesson Controls & Resources */}
        <div className="bg-slate-900 p-8 border-t border-slate-800 z-10 relative">
           <div className="w-full mx-auto grid md:grid-cols-2 gap-8">
              <div>
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <Download className="h-5 w-5 text-primary" /> Lesson Resources
                 </h3>
                 <div className="space-y-3">
                    {activeLesson?.lesson.resources && activeLesson.lesson.resources.length > 0 ? (
                      activeLesson.lesson.resources.map((resource, idx) => (
                        <a 
                          key={idx} 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
                        >
                           <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                              <span className="text-sm font-medium text-slate-300">{resource.title}</span>
                           </div>
                           <Download className="h-4 w-4 text-slate-500 group-hover:text-white" />
                        </a>
                      ))
                    ) : (
                       <div className="p-4 rounded-lg border border-dashed border-slate-800 text-slate-500 text-sm text-center">
                          No downloadable resources for this lesson.
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex flex-col justify-center items-end space-y-4">
                 <p className="text-slate-400 text-sm">
                   {activeLesson?.lesson.type === "quiz" 
                     ? "Complete the quiz to proceed." 
                     : "Review the materials above before continuing."}
                 </p>
                 <Button 
                   size="lg" 
                   className={cn(
                     "w-full md:w-auto px-8 py-6 text-lg font-bold transition-all",
                     activeLesson?.lesson.type === "quiz" ? "bg-orange-600 hover:bg-orange-700" : "bg-primary hover:bg-primary/90"
                   )}
                   onClick={handleMarkComplete}
                 >
                   {activeLesson?.lesson.type === "quiz" ? "Take Quiz" : "Mark as Complete"}
                   <ChevronRight className="ml-2 h-5 w-5" />
                 </Button>
              </div>
           </div>

           {/* Trainer Support Section */}
           <div className="w-full mx-auto mt-8 pt-8 border-t border-slate-800">
             <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                        <MessageSquare className="h-5 w-5 text-blue-400" /> 
                        Trainer Support
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Stuck on this lesson? Send a question directly to our training team.</p>
                 </div>
                 <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-800/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">Trainers Online</span>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <Textarea 
                   placeholder="Type your question here..." 
                   className="bg-slate-900 border-slate-700 text-slate-200 min-h-[100px] resize-none focus:border-blue-500"
                   value={supportQuestion}
                   onChange={(e) => setSupportQuestion(e.target.value)}
                 />
                 <div className="flex justify-end">
                   <Button 
                     variant="secondary" 
                     onClick={handleSupportSubmit}
                     disabled={!supportQuestion.trim()}
                     className="bg-slate-700 hover:bg-slate-600 text-slate-200"
                   >
                     Submit Question
                   </Button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Sidebar - Course Syllabus */}
      <div className={cn(
        "bg-background border-l border-border flex flex-col h-full overflow-hidden shrink-0 transition-all duration-300 ease-in-out absolute md:relative right-0 z-30",
        isSidebarOpen ? "w-80 translate-x-0 opacity-100 shadow-2xl md:shadow-none" : "w-0 translate-x-full opacity-0 overflow-hidden border-none"
      )}>
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
           <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Course Syllabus</h2>
           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSidebarOpen(false)}>
             <SidebarClose className="h-4 w-4" />
           </Button>
        </div>
        <div className="p-4 border-b border-border">
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">{courseProgressPercent}% Complete</span>
                <span className="font-medium text-primary text-xs">{completedLessonsCount}/{totalLessons} Lessons</span>
              </div>
              <Progress value={courseProgressPercent} className="h-1.5" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {course.modules.map((module, mIdx) => {
             const isPlanLocked = (user?.plan === 'free' && mIdx > 0) || (user?.plan === 'free' && course.category === "Technical");
             const isLocked = module.status === "locked" || isPlanLocked;
             const isExpanded = expandedModules[module.id];
             
             return (
               <div key={module.id} className={cn("rounded-lg border relative overflow-hidden", isLocked ? "opacity-90 bg-slate-50" : "bg-card")}>
                  {isPlanLocked && (
                    <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                       <Dialog>
                         <DialogTrigger asChild>
                           <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0 shadow-sm gap-2 h-8 text-xs">
                             <Zap className="w-3 h-3 fill-white" />
                             Unlock
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <PricingContent />
                         </DialogContent>
                       </Dialog>
                    </div>
                  )}

                  <div  
                    className={cn(
                        "p-3 border-b bg-muted/30 flex items-center gap-3 cursor-pointer select-none", 
                        !isLocked && "hover:bg-muted/50"
                    )}
                    onClick={() => !isLocked && toggleModule(module.id)}
                  >
                     {module.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                      isLocked ? <Lock className="h-5 w-5 text-slate-400" /> :
                      <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">{mIdx + 1}</div>}
                     <div className="flex-1">
                       <h3 className="font-semibold text-sm line-clamp-1">{module.title}</h3>
                     </div>
                     {!isLocked && (
                        isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                     )}
                  </div>
                  
                  {!isLocked && isExpanded && (
                    <div className="divide-y">
                       {module.lessons.map((lesson, lIdx) => {
                         const isActive = activeLesson?.lesson.id === lesson.id;
                         // Check if previous lesson is completed to unlock this one
                         const isLessonLocked = lIdx > 0 && !module.lessons[lIdx - 1].isCompleted;
                         
                         return (
                           <div 
                             key={lesson.id} 
                             className={cn(
                               "p-3 flex items-start gap-3 transition-colors text-sm",
                               isActive && "bg-primary/5 border-l-2 border-primary",
                               isLessonLocked ? "opacity-50 cursor-not-allowed bg-slate-50/50" : "hover:bg-muted/50 cursor-pointer"
                             )}
                             onClick={() => !isLessonLocked && handleLessonStart(module.id, lesson.id, lesson.type)}
                           >
                             <div className="mt-0.5">
                               {lesson.isCompleted ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                                isLessonLocked ? <Lock className="h-4 w-4 text-slate-400" /> :
                                isActive ? <PlayCircle className="h-4 w-4 text-primary fill-primary/10" /> :
                                <Circle className="h-4 w-4 text-muted-foreground" />}
                             </div>
                             <div>
                               <p className={cn("font-medium", lesson.isCompleted && "text-muted-foreground")}>{lesson.title}</p>
                               <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                 {lesson.type === "video" && <Video className="h-3 w-3" />}
                                 {lesson.type === "quiz" && <HelpCircle className="h-3 w-3" />}
                                 {lesson.type === "reading" && <FileText className="h-3 w-3" />}
                                 {lesson.duration}
                               </p>
                             </div>
                           </div>
                         );
                       })}
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}
