
import { useParams, Link } from "wouter";
import { getCourseById, Module } from "@/lib/lms-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Lock, PlayCircle, ChevronLeft, FileText, HelpCircle, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import { useState } from "react";

export default function CourseViewer() {
  const { id } = useParams();
  const course = getCourseById(id || "");
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (!course) return <NotFound />;

  // Find the first active/in-progress module to open by default
  const defaultOpen = course.modules.find(m => m.status === "in-progress" || m.status === "unlocked")?.id || course.modules[0].id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/lms" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex gap-2">
              <Badge>{course.category}</Badge>
              {course.level && <Badge variant="outline">{course.level}</Badge>}
              {course.silo && <Badge variant="outline">{course.silo}</Badge>}
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
          
          <Card className="w-full md:w-80 shrink-0 bg-muted/30 border-none shadow-none">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Course Progress</span>
                  <span>{Math.round((course.completedModules / course.totalModules) * 100)}%</span>
                </div>
                <Progress value={(course.completedModules / course.totalModules) * 100} />
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                 <div className="flex items-center gap-1">
                   <CheckCircle2 className="h-4 w-4 text-green-500" />
                   {course.completedModules} Completed
                 </div>
                 <div className="flex items-center gap-1">
                   <Lock className="h-4 w-4" />
                   {course.totalModules - course.completedModules} Remaining
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        
        <Accordion type="single" collapsible defaultValue={defaultOpen} className="w-full space-y-4">
          {course.modules.map((module, index) => (
            <ModuleItem key={module.id} module={module} index={index} />
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function ModuleItem({ module, index }: { module: Module, index: number }) {
  const isLocked = module.status === "locked";
  
  return (
    <AccordionItem value={module.id} className="border rounded-xl bg-card px-4" disabled={isLocked}>
      <AccordionTrigger className={cn(
        "hover:no-underline py-4",
        isLocked && "opacity-70 cursor-not-allowed"
      )}>
        <div className="flex items-center gap-4 w-full text-left">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
            module.status === "completed" ? "bg-green-100 text-green-600" :
            module.status === "in-progress" ? "bg-primary/10 text-primary" :
            module.status === "unlocked" ? "bg-secondary text-secondary-foreground" :
            "bg-muted text-muted-foreground"
          )}>
            {module.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> :
             module.status === "locked" ? <Lock className="h-5 w-5" /> :
             <span className="font-bold text-sm">{index + 1}</span>}
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {module.title}
              {module.status === "in-progress" && <Badge variant="secondary" className="text-xs">In Progress</Badge>}
            </h3>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
          
          <div className="text-sm text-muted-foreground mr-4 hidden md:block">
            {module.lessons.length} Lessons
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="pb-4 pt-2 pl-[3.5rem] pr-4">
        <div className="space-y-3 border-l-2 border-muted pl-6 ml-5">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between group p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted-foreground/10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-md",
                  lesson.isCompleted ? "bg-green-50 text-green-600" : "bg-primary/5 text-primary"
                )}>
                  {lesson.type === "video" ? <Video className="h-4 w-4" /> :
                   lesson.type === "quiz" ? <HelpCircle className="h-4 w-4" /> :
                   <FileText className="h-4 w-4" />}
                </div>
                <div>
                  <p className={cn("font-medium", lesson.isCompleted && "text-muted-foreground line-through decoration-border")}>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{lesson.type} • {lesson.duration}</p>
                </div>
              </div>
              
              <Button size="sm" variant={lesson.isCompleted ? "ghost" : "secondary"} className="gap-2">
                {lesson.isCompleted ? (
                  <>Completed <CheckCircle2 className="h-3 w-3" /></>
                ) : (
                  <>Start <PlayCircle className="h-3 w-3" /></>
                )}
              </Button>
            </div>
          ))}
          {module.lessons.length === 0 && (
             <div className="p-4 text-center text-muted-foreground italic border-2 border-dashed rounded-lg bg-muted/20">
               Content is locked until previous modules are completed.
             </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
