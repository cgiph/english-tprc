
import { useState } from "react";
import { Link } from "wouter";
import { COURSES, Course } from "@/lib/lms-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Lock, PlayCircle, CheckCircle2, GraduationCap, Wrench, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LMSDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = activeTab === "all" 
    ? COURSES 
    : COURSES.filter(c => c.category.toLowerCase().includes(activeTab) || (activeTab === "technical" && c.category === "Technical"));

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
        <Link href="/lms/admin">
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
            <Briefcase className="h-4 w-4" />
            Trainer Dashboard
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="px-6">All Courses</TabsTrigger>
          <TabsTrigger value="english" className="px-6">English Levels</TabsTrigger>
          <TabsTrigger value="technical" className="px-6 data-[state=active]:bg-orange-600 data-[state=active]:text-white">Trade Prep (TSA/TRA)</TabsTrigger>
          <TabsTrigger value="mock test" className="px-6">Mock Tests</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const progressPercent = Math.round((course.completedModules / course.totalModules) * 100);
  
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn(isTechnical && "text-orange-600")}>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className={cn("h-2", isTechnical && "[&>div]:bg-orange-600")} />
          <p className="text-xs text-muted-foreground pt-1">
            {course.completedModules} of {course.totalModules} modules completed
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className={cn("w-full group/btn", isTechnical && "bg-slate-800 hover:bg-slate-900")} asChild>
          <Link href={`/lms/course/${course.id}`}>
            {progressPercent === 0 ? "Start Course" : "Continue Learning"}
            <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
