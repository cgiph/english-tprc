
import { useState } from "react";
import { Link } from "wouter";
import { COURSES, Course } from "@/lib/lms-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Lock, PlayCircle, CheckCircle2, GraduationCap, Wrench, FileText, Briefcase, Award, Clock, Zap, MapPin, Plane, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLMS } from "@/hooks/use-lms";
import { analytics } from "@/lib/analytics";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CertificateView } from "@/components/lms/certificate-view";
import { useUser } from "@/hooks/use-user";

// Import generated images
import visionStage1 from "@/assets/images/vision-stage-1.png";
import visionStage2 from "@/assets/images/vision-stage-2.png";
import visionStage3 from "@/assets/images/vision-stage-3.png";
import visionStage4 from "@/assets/images/vision-stage-4.png";

export default function LMSDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const { state } = useLMS();

  // Calculate overall progress across all courses
  const calculateOverallProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    
    COURSES.forEach(course => {
      course.modules.forEach(module => {
        totalLessons += module.lessons.length;
        const userModule = state.modules[module.id];
        if (userModule && userModule.completedLessons) {
          completedLessons += userModule.completedLessons.length;
        }
      });
    });
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };
  
  const overallProgress = calculateOverallProgress();

  // Filter logic...
  const filteredCourses = activeTab === "all" 
    ? COURSES 
    : activeTab === "certificates"
        ? COURSES // We will filter for completed courses below
        : COURSES.filter(c => c.category.toLowerCase().includes(activeTab) || (activeTab === "technical" && c.category === "Technical"));

  // Calculate completed courses for the Certificates tab
  const completedCourses = COURSES.filter(course => {
     // Check if all modules are completed for this course in user state
     // This is a simplified check: assumes course is complete if all modules are marked complete
     // In a real app we might have a specific 'isCompleted' flag on the course enrollment
     const totalModules = course.modules.length;
     let completedModules = 0;
     
     course.modules.forEach(m => {
        if (state.modules[m.id]?.status === "completed") {
            completedModules++;
        }
     });
     
     return totalModules > 0 && completedModules === totalModules;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary">Learning Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access your modular courses, technical training tracks, and mock assessments. 
            Complete modules to unlock the next stage of your journey.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/pricing">
            <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-md">
              <Zap className="h-4 w-4 fill-white" />
              Upgrade Plan
            </Button>
          </Link>
          <Link href="/lms/admin">
            <Button variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
              <Briefcase className="h-4 w-4" />
              Trainer Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Gamification: Vision Board */}
      <VisionBoard progress={overallProgress} />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="px-6">All Courses</TabsTrigger>
          <TabsTrigger value="english" className="px-6">English Levels</TabsTrigger>
          <TabsTrigger value="technical" className="px-6 data-[state=active]:bg-orange-600 data-[state=active]:text-white">Trade Prep (TSA/TRA)</TabsTrigger>
          <TabsTrigger value="mock test" className="px-6">Mock Tests</TabsTrigger>
          <TabsTrigger value="certificates" className="px-6 gap-2">
            <Award className="h-4 w-4" /> Certificates
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "certificates" ? (
             completedCourses.length > 0 ? (
               completedCourses.map(course => (
                 <CertificateCard key={course.id} course={course} />
               ))
             ) : (
               <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Award className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No Certificates Yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">Complete all modules in a course to earn your certificate of completion.</p>
                  <Button variant="link" onClick={() => setActiveTab("all")} className="mt-4 text-orange-600">Browse Courses</Button>
               </div>
             )
          ) : (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}

function VisionBoard({ progress }: { progress: number }) {
  // Determine current stage based on progress
  let currentStage = 1;
  let stageImage = visionStage1;
  let stageTitle = "The Dream";
  let stageDesc = "Visualizing your future in Australia.";
  
  if (progress >= 100) {
    currentStage = 4;
    stageImage = visionStage4;
    stageTitle = "Arrival";
    stageDesc = "Welcome to your new life in Australia!";
  } else if (progress >= 60) {
    currentStage = 3;
    stageImage = visionStage3;
    stageTitle = "The Journey";
    stageDesc = "On your way to a brighter future.";
  } else if (progress >= 20) {
    currentStage = 2;
    stageImage = visionStage2;
    stageTitle = "The Climb";
    stageDesc = "Building the skills to reach your goals.";
  }

  // Calculate progress to next stage
  let nextStageThreshold = 20;
  if (currentStage === 2) nextStageThreshold = 60;
  if (currentStage === 3) nextStageThreshold = 100;
  
  // Progress bar within the card
  const cardProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="mb-12 relative group rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
       {/* Holographic Container Effect */}
       <div className="absolute inset-0 bg-slate-900 z-0"></div>
       <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>
       
       {/* Animated Gradient Border/Glow */}
       <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-1000"></div>

       <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-0 bg-slate-900/90 backdrop-blur-md">
          {/* Image Section with Hologram Overlay */}
          <div className="col-span-1 md:col-span-1 relative overflow-hidden h-64 md:h-auto border-r border-white/10">
             <img 
               src={stageImage} 
               alt={stageTitle} 
               loading="lazy"
               className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
             />
             {/* Scanline Effect */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
             {/* Glitch/Hologram Tint */}
             <div className="absolute inset-0 bg-cyan-500/10 mix-blend-screen pointer-events-none"></div>
             
             <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur border border-cyan-500/50 text-cyan-400">
                <Star className="w-3 h-3 mr-1 fill-current" /> Stage {currentStage}
             </Badge>
          </div>

          {/* Content Section */}
          <div className="col-span-1 md:col-span-2 p-8 flex flex-col justify-center relative">
             <div className="absolute top-0 right-0 p-3 opacity-20">
                <Plane className="w-24 h-24 text-white rotate-45" />
             </div>
             
             <div className="mb-6">
                <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-2">My Journey to Australia</h3>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  {stageTitle}
                </h2>
                <p className="text-slate-300 text-lg max-w-xl">{stageDesc}</p>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-400">
                   <span>Manila</span>
                   <span className="text-white">{Math.round(cardProgress)}% Complete</span>
                   <span>Sydney</span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative border border-white/10">
                   <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                      style={{ width: `${cardProgress}%` }}
                   ></div>
                   
                   {/* Markers */}
                   <div className="absolute top-0 left-[20%] w-0.5 h-full bg-white/20"></div>
                   <div className="absolute top-0 left-[60%] w-0.5 h-full bg-white/20"></div>
                </div>
                
                <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                   <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Start</div>
                   <div className="flex items-center gap-1">The Climb</div>
                   <div className="flex items-center gap-1">The Flight</div>
                   <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Goal</div>
                </div>
             </div>
             
             {progress < 100 && (
               <div className="mt-8">
                 <p className="text-sm text-slate-400 mb-3">
                   <span className="text-orange-400 font-semibold">Next Milestone:</span> Reach {nextStageThreshold}% to unlock the next vision stage.
                 </p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
}

function CertificateCard({ course }: { course: Course }) {
  const { user } = useUser();
  
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-orange-100 group">
       <div className="relative h-40 bg-slate-900 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <Award className="h-16 w-16 text-orange-400 drop-shadow-lg" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-indigo-500"></div>
       </div>
       
       <CardHeader className="text-center pb-2">
          <Badge className="mx-auto mb-2 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>
          <CardTitle className="text-xl font-serif">{course.title}</CardTitle>
          <CardDescription>Issued on {new Date().toLocaleDateString()}</CardDescription>
       </CardHeader>
       
       <CardContent className="text-center pb-6">
          <p className="text-sm text-slate-500">
             Professional Certification Level {course.level || "Standard"}
          </p>
       </CardContent>
       
       <CardFooter>
          <Dialog>
             <DialogTrigger asChild>
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 gap-2">
                   <FileText className="h-4 w-4" /> View Certificate
                </Button>
             </DialogTrigger>
             <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                <CertificateView 
                   course={course} 
                   studentName={user?.name || "Guest User"} 
                   completionDate={new Date().toLocaleDateString()} 
                   onDownload={() => alert("Downloading PDF...")}
                />
             </DialogContent>
          </Dialog>
       </CardFooter>
    </Card>
  );
}


function CourseCard({ course }: { course: Course }) {
  const { state } = useLMS();

  // Calculate dynamic progress based on LMS state
  let totalLessons = 0;
  let completedLessonsCount = 0;
  let completedModulesCount = 0;
  let totalMinutes = 0;
  let completedMinutes = 0;

  course.modules.forEach(module => {
    totalLessons += module.lessons.length;
    
    // Calculate total duration for this module
    module.lessons.forEach(lesson => {
       const durationMatch = lesson.duration.match(/(\d+)/);
       const minutes = durationMatch ? parseInt(durationMatch[1]) : 10; // Default 10 mins if parse fail
       totalMinutes += minutes;
    });

    // Get user progress for this module
    const userModule = state.modules[module.id];
    
    if (userModule && userModule.completedLessons) {
      // Count completed lessons
      const completedInModule = userModule.completedLessons.length;
      completedLessonsCount += completedInModule;
      
      // Calculate completed minutes
      userModule.completedLessons.forEach(lessonId => {
         const lesson = module.lessons.find(l => l.id === lessonId);
         if (lesson) {
            const durationMatch = lesson.duration.match(/(\d+)/);
            const minutes = durationMatch ? parseInt(durationMatch[1]) : 10;
            completedMinutes += minutes;
         }
      });
      
      // Check if module is fully complete
      if (completedInModule === module.lessons.length && module.lessons.length > 0) {
        completedModulesCount++;
      }
    }
  });

  // Avoid division by zero
  const progressPercent = totalLessons > 0 
    ? Math.round((completedLessonsCount / totalLessons) * 100) 
    : 0;
  
  const getIcon = () => {
    switch(course.category) {
      case "English": return <GraduationCap className="h-5 w-5" />;
      case "Technical": return <Wrench className="h-5 w-5" />;
      case "Mock Test": return <FileText className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const isTechnical = course.category === "Technical";

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border-2",
      isTechnical ? "border-orange-200 hover:border-orange-500/50" : "hover:border-primary/20"
    )}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t to-transparent",
          isTechnical ? "from-orange-950/80" : "from-black/60"
        )} />
        <Badge className={cn(
          "absolute top-4 right-4 text-primary hover:bg-white",
          isTechnical ? "bg-orange-50 text-orange-700" : "bg-white/90"
        )}>
          {course.category}
        </Badge>
        {course.level && (
          <Badge variant="secondary" className="absolute bottom-4 left-4">
            Level: {course.level}
          </Badge>
        )}
        {course.silo && (
          <Badge className="absolute bottom-4 left-4 bg-orange-600 hover:bg-orange-700 text-white border-none">
            {course.silo} Track
          </Badge>
        )}
      </div>

      <CardHeader className="space-y-2 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className={cn(
            "text-xl font-bold line-clamp-1 transition-colors",
            isTechnical ? "group-hover:text-orange-600" : "group-hover:text-primary"
          )}>
            {course.title}
          </CardTitle>
          <div className="text-muted-foreground">
            {getIcon()}
          </div>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="space-y-3">
          <div className="space-y-1">
             <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span className={cn(isTechnical && "text-orange-600")}>{progressPercent}%</span>
             </div>
             <Progress value={progressPercent} className={cn("h-2", isTechnical && "[&>div]:bg-orange-600")} />
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-50 p-1.5 rounded">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>{completedModulesCount}/{course.totalModules} Mods</span>
             </div>
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-50 p-1.5 rounded">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span>{completedMinutes}/{totalMinutes} min</span>
             </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className={cn("w-full group/btn", isTechnical && "bg-slate-800 hover:bg-slate-900")} asChild>
          <Link href={`/lms/course/${course.id}`} onClick={() => {
            if (progressPercent === 0) {
              analytics.trackCourseEnrollment(course.id, course.title);
            }
          }}>
            {progressPercent === 0 ? "Start Course" : "Continue Learning"}
            <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
