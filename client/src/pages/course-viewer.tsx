
import { useParams, Link } from "wouter";
import { getCourseById, Module } from "@/lib/lms-data";
import type { Lesson } from "@/lib/lms-data";
import { Button } from "@/components/ui/button";

type ActiveLesson = {
  lesson: Lesson;
  moduleId: string;
};
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Lock, PlayCircle, ChevronLeft, FileText, HelpCircle, Video, Download, ChevronRight, Circle, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { useLMS } from "@/hooks/use-lms";
import { ModuleQuiz } from "@/components/lms/module-quiz";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { NounPractice } from "@/components/lms/noun-practice";
import { GrammarGuard } from "@/components/lms/grammar-guard";
import { SwtPracticeLab } from "@/components/lms/swt-practice-lab";

function SpeakingPractice({ content }: { content: string }) {
  const [isMemorizeMode, setIsMemorizeMode] = useState(false);
  
  // Basic check to see if we should render the interactive mode
  // This is a simple heuristic based on the presence of specific keywords or structure
  // In a real app, this would be a specific lesson type or metadata
  const isTemplateLesson = content.includes("Template Teleprompter") || content.includes("AI Scoring Rules") || content.includes("Grammar Guard") || content.includes("SWT Practice Lab");

  if (!isTemplateLesson) {
    return <div className="max-w-4xl mx-auto p-8 text-left" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Handle SWT Practice Lab
  if (content.includes("SWT Practice Lab")) {
      return (
          <div className="max-w-6xl mx-auto p-8 text-left h-full flex flex-col">
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
       <div className="max-w-4xl mx-auto p-8 text-left space-y-8">
          <div dangerouslySetInnerHTML={{ __html: theoryContent }} />
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Interactive Practice: The One-Sentence Challenge</h3>
             <GrammarGuard />
          </div>
       </div>
     );
  }

  // Parse content to extract the main parts if needed, or just render the specialized view directly
  // For this mockup, we'll replace the static HTML with the interactive React component
  // based on which lesson it looks like (Retell Lecture vs AI Auditor)
  
  if (content.includes("Template Teleprompter")) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-left space-y-6">
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
  return <div className="max-w-4xl mx-auto p-8 text-left" dangerouslySetInnerHTML={{ __html: content }} />;
}

export default function CourseViewer() {
  const { id } = useParams();
  const rawCourse = getCourseById(id || "");
  const { state, completeLesson, unlockModule, submitQuizScore } = useLMS();
  
  // Quiz State
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<{id: string, title: string, quizId?: string} | null>(null);
  const { toast } = useToast();

  // Active Lesson State (for Player)
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  
  // Expanded Modules State
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Trainer Support State
  const [supportQuestion, setSupportQuestion] = useState("");

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

  const handleMarkComplete = () => {
    if (activeLesson) {
        if (activeLesson.lesson.type === "quiz") {
            // Re-open quiz modal if it's a quiz type
            const module = course.modules.find(m => m.id === activeLesson.moduleId);
            if (module) {
                setActiveQuizModule({ id: module.id, title: module.title });
                setQuizOpen(true);
            }
        } else {
            completeLesson(activeLesson.moduleId, activeLesson.lesson.id);
            toast({
                title: "Lesson Completed",
                description: "Progress saved."
            });
        }
    }
  };

  const handleSupportSubmit = () => {
    if (!supportQuestion.trim()) return;
    
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
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

      {/* Main Content Area - Video Player Style */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 text-slate-100">
        {/* Header Overlay */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
           <div>
             <Link href="/lms" className="text-sm text-slate-400 hover:text-white flex items-center mb-1">
               <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
             </Link>
             <h1 className="text-xl font-bold text-white">{activeLesson?.lesson.title || course.title}</h1>
           </div>
           <Badge variant="outline" className="text-slate-300 border-slate-700">{course.title}</Badge>
        </div>

        {/* Cinema Mode Player */}
        <div className="flex-1 flex items-center justify-center p-8 bg-black/40 min-h-[500px]">
           {activeLesson ? (
              <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center relative group">
                 {activeLesson.lesson.type === "video" ? (
                    activeLesson.lesson.videoUrl ? (
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
                      <div className="text-center space-y-4">
                        <PlayCircle className="h-24 w-24 text-slate-700 group-hover:text-primary transition-colors cursor-pointer" />
                        <p className="text-slate-500 font-medium">Video Placeholder: {activeLesson.lesson.title}</p>
                      </div>
                    )
                 ) : activeLesson.lesson.type === "quiz" ? (
                    <div className="text-center space-y-6 max-w-md p-8">
                       <HelpCircle className="h-20 w-20 text-orange-500 mx-auto" />
                       <h3 className="text-2xl font-bold">Module Assessment</h3>
                       <p className="text-slate-400">Pass this quiz with 80% or higher to unlock the next module.</p>
                       <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white w-full" onClick={() => handleLessonStart(activeLesson.moduleId, activeLesson.lesson.id, "quiz")}>Start Quiz</Button>
                    </div>
                 ) : activeLesson.lesson.id === "l3-bonus" ? (
                    <NounPractice onComplete={handleMarkComplete} />
                 ) : (
                    <div className="w-full h-full overflow-y-auto">
                       {(activeLesson.lesson.type === "reading" || activeLesson.lesson.type === "assignment") && activeLesson.lesson.content ? (
                         <SpeakingPractice content={activeLesson.lesson.content} />
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-2xl px-8 mx-auto">
                            <FileText className="h-20 w-20 text-slate-600 mx-auto" />
                            <h3 className="text-2xl font-bold">{activeLesson.lesson.title}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                              Reading content for this lesson would appear here. This is a mockup for the reading interface.
                            </p>
                         </div>
                       )}
                    </div>
                 )}
              </div>
           ) : (
              <p className="text-slate-500">Select a lesson to begin</p>
           )}
        </div>

        {/* Lesson Controls & Resources */}
        <div className="bg-slate-900 p-8 border-t border-slate-800">
           <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
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
           <div className="max-w-4xl mx-auto mt-8 pt-8 border-t border-slate-800">
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
      <div className="w-96 bg-background border-l border-border flex flex-col h-full overflow-hidden shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-border">
           <h2 className="font-bold text-lg mb-2">Course Syllabus</h2>
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{courseProgressPercent}% Complete</span>
                <span className="font-medium text-primary">{completedLessonsCount}/{totalLessons} Lessons</span>
              </div>
              <Progress value={courseProgressPercent} className="h-2" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {course.modules.map((module, mIdx) => {
             const isLocked = module.status === "locked";
             const isExpanded = expandedModules[module.id];
             
             return (
               <div key={module.id} className={cn("rounded-lg border", isLocked ? "opacity-60 bg-muted/50" : "bg-card")}>
                  <div 
                    className={cn(
                        "p-3 border-b bg-muted/30 flex items-center gap-3 cursor-pointer select-none", 
                        !isLocked && "hover:bg-muted/50"
                    )}
                    onClick={() => !isLocked && toggleModule(module.id)}
                  >
                     {module.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                      module.status === "locked" ? <Lock className="h-5 w-5 text-muted-foreground" /> :
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
                       {module.lessons.map((lesson) => {
                         const isActive = activeLesson?.lesson.id === lesson.id;
                         return (
                           <div 
                             key={lesson.id} 
                             className={cn(
                               "p-3 flex items-start gap-3 hover:bg-muted/50 cursor-pointer transition-colors text-sm",
                               isActive && "bg-primary/5 border-l-2 border-primary"
                             )}
                             onClick={() => handleLessonStart(module.id, lesson.id, lesson.type)}
                           >
                             <div className="mt-0.5">
                               {lesson.isCompleted ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
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
