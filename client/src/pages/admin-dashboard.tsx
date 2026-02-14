import { useState } from "react";
import { Link } from "wouter";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Briefcase, 
  Download, 
  ChevronLeft, 
  MessageSquare,
  MoreHorizontal,
  ArrowUpRight,
  History,
  GraduationCap,
  Activity,
  BookOpen,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { COURSES, Course } from "@/lib/lms-data";
import { ContentManager } from "@/components/lms/admin/content-manager";
import { BrandingSettings } from "@/components/lms/admin/branding-settings";
import { TenantManager } from "@/components/lms/admin/tenant-manager";
import { StressTest } from "@/components/debug/stress-test";

// Mock Data for Candidates
const CANDIDATES = [
  {
    id: "C-1024",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Welder (MIG/TIG)",
    englishLevel: "B1",
    englishScore: 82,
    techScore: 88,
    status: "ready", // ready, training, review
    location: "Philippines",
    lastActive: "2 hours ago"
  },
  {
    id: "C-1025",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Automotive Mechanic",
    englishLevel: "A2",
    englishScore: 65,
    techScore: 92,
    status: "training",
    location: "Vietnam",
    lastActive: "5 mins ago"
  },
  {
    id: "C-1026",
    name: "Miguel Rodriguez",
    email: "m.rodriguez@example.com",
    role: "Carpenter",
    englishLevel: "B2",
    englishScore: 90,
    techScore: 85,
    status: "ready",
    location: "Mexico",
    lastActive: "1 day ago"
  },
  {
    id: "C-1027",
    name: "Ahmadi Hassan",
    email: "ahmadi.h@example.com",
    role: "Welder (Arc)",
    englishLevel: "A1",
    englishScore: 45,
    techScore: 78,
    status: "training",
    location: "Indonesia",
    lastActive: "3 hours ago"
  },
  {
    id: "C-1028",
    name: "Priya Patel",
    email: "p.patel@example.com",
    role: "Nurse Assistant",
    englishLevel: "C1",
    englishScore: 95,
    techScore: 92,
    status: "ready",
    location: "India",
    lastActive: "10 mins ago"
  }
];

// Mock Data for Inbox
const MESSAGES = [
  {
    id: 1,
    sender: "Sarah Chen",
    role: "Automotive Mechanic",
    subject: "Question about Module 2 Brake Systems",
    preview: "I'm confused about the difference between disc and drum brake maintenance schedules...",
    time: "10:30 AM",
    status: "unread"
  },
  {
    id: 2,
    sender: "Ahmadi Hassan",
    role: "Welder",
    subject: "PPE Assessment clarify",
    preview: "For the safety quiz, is the Level 10 shade helmet mandatory for all types of welding or just...",
    time: "Yesterday",
    status: "read"
  }
];

import { useLMS } from "@/hooks/use-lms";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { state, toggleCourseEnrollment } = useLMS();
  const { user } = useUser();
  const [_, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  
  // Available courses for enrollment dropdown
  const availableCourses = COURSES;

  // Protect the route - Only trainers allowed
  useEffect(() => {
    if (!user || user.role !== 'trainer') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view the Trainer Dashboard.",
        variant: "destructive"
      });
      setLocation("/");
    }
  }, [user, setLocation, toast]);

  if (!user || user.role !== 'trainer') return null;

  // Combine Mock Messages + Real Support Tickets from LMS State
  const dynamicMessages = (state.supportTickets || []).map(ticket => ({
    id: ticket.id,
    sender: ticket.userId === "guest" ? "Guest User" : ticket.userId,
    role: "Candidate",
    subject: `Question: ${ticket.lessonTitle}`,
    preview: ticket.question,
    time: new Date(ticket.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    status: ticket.status === 'open' ? 'unread' : 'read'
  }));

  const allMessages = [...dynamicMessages, ...MESSAGES];

  const handleExport = () => {
    setExporting(true);
    
    // Simulate API call and file generation
    setTimeout(() => {
      setExporting(false);
      
      // Create a fake CSV download
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Candidate ID,Name,Role,Location,English Score,Tech Score,Status\n"
        + CANDIDATES.map(c => `${c.id},${c.name},${c.role},${c.location},${c.englishScore},${c.techScore},${c.status}`).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "candidate_export_v2.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${CANDIDATES.length} candidates exported to CSV. HubSpot sync initiated.`,
        className: "bg-green-50 border-green-200"
      });
    }, 2000);
  };

  const filteredCandidates = CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-1 text-xs font-medium text-center sticky top-0 z-[60]">
        PROTOTYPE: Institutional Mode - Feature Frozen
      </div>
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/lms">
               <div className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                 <ChevronLeft className="h-5 w-5 text-slate-400" />
               </div>
            </Link>
            <div className="ml-2">
               <h1 className="text-xl font-bold text-white flex items-center gap-2">
                 <Briefcase className="h-6 w-6 text-orange-500" />
                 Trainer Dashboard
               </h1>
               {user?.role === 'trainer' && (
                 <p className="text-xs text-slate-400 mt-1">Logged in as: {user.name}</p>
               )}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-800 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">HubSpot Connected</span>
             </div>
             <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold border-2 border-slate-800" title={user?.name || "Admin"}>
                {user?.name ? user.name.charAt(0) : "T"}
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Total Pipeline</p>
                   <h3 className="text-2xl font-bold">1,248</h3>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
              <div className="mt-4 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Deployment Ready</p>
                   <h3 className="text-2xl font-bold">86</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
              </div>
               <div className="mt-4 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +5 this week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Tech Verified</p>
                   <h3 className="text-2xl font-bold">342</h3>
                </div>
                <Briefcase className="h-8 w-8 text-purple-500 opacity-20" />
              </div>
               <div className="mt-4 flex items-center text-xs text-slate-500">
                 Waitlist: 45
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Trainer Inbox</p>
                   <h3 className="text-2xl font-bold">12</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
               <div className="mt-4 flex items-center text-xs text-red-500">
                 2 urgent messages
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface Tabs */}
        <Tabs defaultValue="pipeline" className="space-y-4">
           <div className="flex items-center justify-between">
              <TabsList className="bg-white border">
                 <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
                 <TabsTrigger value="inbox">Trainer Inbox</TabsTrigger>
                 <TabsTrigger value="content">Content Manager</TabsTrigger>
                 <TabsTrigger value="branding">White Label</TabsTrigger>
                 <TabsTrigger value="tenants">Multi-Tenant</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                 <Button 
                   onClick={handleExport} 
                   disabled={exporting}
                   className="bg-[#ff5c35] hover:bg-[#ff5c35]/90 text-white"
                 >
                    {exporting ? (
                      <>Exporting...</>
                    ) : (
                      <>
                        <img src="https://fs.hubspotusercontent00.net/hubfs/53/HubSpot_Logos/HubSpot_Inversed_Favicon_RGB.png" className="h-4 w-4 mr-2 filter brightness-0 invert" alt="HubSpot" />
                        Export to HubSpot
                      </>
                    )}
                 </Button>
              </div>
           </div>

           <TabsContent value="content" className="space-y-4">
              <ContentManager />
           </TabsContent>

           <TabsContent value="branding" className="space-y-4">
              <BrandingSettings />
           </TabsContent>

           <TabsContent value="tenants" className="space-y-4">
              <TenantManager />
           </TabsContent>

           <TabsContent value="pipeline" className="space-y-4">
              <Card>
                 <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                       <div>
                         <CardTitle>Global Talent Pool</CardTitle>
                         <CardDescription>Manage and filter candidates for deployment.</CardDescription>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="relative w-64">
                             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input 
                               placeholder="Search name, role, country..." 
                               className="pl-8" 
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                             />
                          </div>
                          <Button variant="outline" size="icon">
                             <Filter className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent>
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead>Candidate</TableHead>
                             <TableHead>Role</TableHead>
                             <TableHead>Location</TableHead>
                             <TableHead>English Score</TableHead>
                             <TableHead>Tech Verify</TableHead>
                             <TableHead>Status</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredCandidates.map((candidate) => (
                             <TableRow key={candidate.id} className="hover:bg-slate-50">
                                <TableCell>
                                   <div className="flex flex-col">
                                      <span className="font-medium">{candidate.name}</span>
                                      <span className="text-xs text-muted-foreground">{candidate.email}</span>
                                   </div>
                                </TableCell>
                                <TableCell>{candidate.role}</TableCell>
                                <TableCell>{candidate.location}</TableCell>
                                <TableCell>
                                   <div className="flex items-center gap-2">
                                      <Badge variant={candidate.englishScore >= 80 ? "default" : "secondary"} className={candidate.englishScore >= 80 ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : ""}>
                                         {candidate.englishLevel}
                                      </Badge>
                                      <span className="text-sm font-medium">{candidate.englishScore}%</span>
                                   </div>
                                </TableCell>
                                <TableCell>
                                   <div className="flex items-center gap-2">
                                      {candidate.techScore >= 80 ? (
                                         <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Verified
                                         </Badge>
                                      ) : (
                                         <Badge variant="outline" className="text-slate-500 gap-1">
                                            Pending
                                         </Badge>
                                      )}
                                      <span className="text-xs text-muted-foreground">({candidate.techScore}%)</span>
                                   </div>
                                </TableCell>
                                <TableCell>
                                   {candidate.status === "ready" ? (
                                      <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                                         <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                         Ready
                                      </div>
                                   ) : (
                                      <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm">
                                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                         Training
                                      </div>
                                   )}
                                </TableCell>
                                <TableCell className="text-right">
                                   <Dialog>
                                     <DialogTrigger asChild>
                                       <Button variant="ghost" size="icon">
                                         <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                       </Button>
                                     </DialogTrigger>
                                     <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                                       <DialogHeader className="p-6 pb-2">
                                         <DialogTitle>Candidate Progress Report</DialogTitle>
                                         <DialogDescription>
                                           Viewing detailed activity for {candidate.name}
                                         </DialogDescription>
                                       </DialogHeader>
                                       
                                       <ScrollArea className="flex-1 px-6 pb-6">
                                         <div className="space-y-6 py-4">
                                           
                                           {/* Mock Test History */}
                                           <div className="space-y-3">
                                              <div className="flex items-center gap-2">
                                                <GraduationCap className="h-5 w-5 text-purple-600" />
                                                <h3 className="font-bold text-lg">Mock Test Results</h3>
                                              </div>
                                              {state.mockTestResults.length === 0 ? (
                                                <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border">No mock tests attempted yet.</div>
                                              ) : (
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Date</TableHead>
                                                      <TableHead>Test ID</TableHead>
                                                      <TableHead>Difficulty</TableHead>
                                                      <TableHead>Overall Score</TableHead>
                                                      <TableHead>Status</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {state.mockTestResults.map((result) => (
                                                      <TableRow key={result.attemptId}>
                                                        <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                                                        <TableCell>{result.testId}</TableCell>
                                                        <TableCell>
                                                          <Badge variant={result.difficulty === "Hard" ? "destructive" : "secondary"}>
                                                            {result.difficulty}
                                                          </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-bold text-blue-600">{result.overallScore}/90</TableCell>
                                                        <TableCell>
                                                          {result.overallScore >= 65 ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Passed</Badge>
                                                          ) : (
                                                            <Badge variant="outline">Failed</Badge>
                                                          )}
                                                        </TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              )}
                                           </div>

                                           {/* Quiz History */}
                                           <div className="space-y-3">
                                              <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-bold text-lg">Module Quizzes</h3>
                                              </div>
                                              {state.quizHistory.length === 0 ? (
                                                <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border">No quizzes taken yet.</div>
                                              ) : (
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Date</TableHead>
                                                      <TableHead>Module</TableHead>
                                                      <TableHead>Score</TableHead>
                                                      <TableHead>Result</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {state.quizHistory.map((quiz) => (
                                                      <TableRow key={quiz.attemptId}>
                                                        <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                                                        <TableCell>{quiz.moduleId}</TableCell>
                                                        <TableCell className="font-medium">{quiz.score}%</TableCell>
                                                        <TableCell>
                                                          {quiz.passed ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pass</Badge>
                                                          ) : (
                                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Fail</Badge>
                                                          )}
                                                        </TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              )}
                                           </div>

                                           {/* Practice History */}
                                           <div className="space-y-3">
                                              <div className="flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-orange-600" />
                                                <h3 className="font-bold text-lg">Practice Sessions</h3>
                                              </div>
                                              {(!state.practiceHistory || state.practiceHistory.length === 0) ? (
                                                <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border">No practice sessions recorded yet.</div>
                                              ) : (
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Type</TableHead>
                                                      <TableHead>Score</TableHead>
                                                      <TableHead>Date</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {state.practiceHistory.map((practice) => (
                                                      <TableRow key={practice.id}>
                                                        <TableCell className="capitalize">{practice.type.replace("-", " ")}</TableCell>
                                                        <TableCell>{practice.score}/{practice.maxScore}</TableCell>
                                                        <TableCell>{new Date(practice.date).toLocaleDateString()}</TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              )}
                                           </div>

                                           {/* Enrollment Management (New Section) */}
                                           <div className="space-y-3 pt-6 border-t border-slate-200">
                                              <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                                <h3 className="font-bold text-lg">Enrollment Management</h3>
                                              </div>
                                              
                                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                 <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                       <h4 className="font-semibold text-slate-800">Active Courses</h4>
                                                       <p className="text-sm text-slate-500">Manage course access for this candidate.</p>
                                                    </div>
                                                    <Button size="sm" variant="outline" className="gap-2">
                                                       <Plus className="h-4 w-4" /> Assign Course
                                                    </Button>
                                                 </div>

                                                 <div className="space-y-2">
                                                    {/* If it's the current user, show actual state, otherwise show mock data + ability to toggle for demo */}
                                                    {(() => {
                                                      const isCurrentUser = user && candidate.email === user.email;
                                                      const displayedCourses = isCurrentUser ? state.enrolledCourses : ["eng-a1", "tech-welder"];
                                                      
                                                      return displayedCourses.map(courseId => {
                                                       const course = availableCourses.find(c => c.id === courseId);
                                                       if (!course) return null;
                                                       
                                                       return (
                                                          <div key={courseId} className="flex items-center justify-between bg-white p-3 rounded border border-slate-200 shadow-sm">
                                                             <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                                   {course.title.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                   <p className="font-medium text-sm text-slate-900">{course.title}</p>
                                                                   <p className="text-xs text-slate-500">{course.category} • {course.level || course.silo}</p>
                                                                </div>
                                                             </div>
                                                             <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    if (isCurrentUser) {
                                                                        toggleCourseEnrollment(courseId);
                                                                        toast({
                                                                            title: "Enrollment Updated",
                                                                            description: `Removed ${course.title} from your enrollment.`
                                                                        });
                                                                    } else {
                                                                        toast({
                                                                            title: "Demo Action",
                                                                            description: `In a real app, this would remove ${course.title} from ${candidate.name}.`
                                                                        });
                                                                    }
                                                                }}
                                                             >
                                                                <Trash2 className="h-4 w-4" />
                                                             </Button>
                                                          </div>
                                                       );
                                                    });
                                                    })()}
                                                    
                                                    {/* Add Course Demo Dropdown Area */}
                                                    <div className="mt-4 pt-4 border-t border-slate-200 border-dashed">
                                                        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Available to Assign</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {availableCourses
                                                                .filter(c => {
                                                                    const isCurrentUser = user && candidate.email === user.email;
                                                                    const displayedCourses = isCurrentUser ? state.enrolledCourses : ["eng-a1", "tech-welder"];
                                                                    return !displayedCourses.includes(c.id);
                                                                })
                                                                .map(course => (
                                                                <Button 
                                                                    key={course.id} 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    className="justify-start gap-2 h-auto py-2"
                                                                    onClick={() => {
                                                                        const isCurrentUser = user && candidate.email === user.email;
                                                                        if (isCurrentUser) {
                                                                            toggleCourseEnrollment(course.id);
                                                                            toast({
                                                                                title: "Enrollment Updated",
                                                                                description: `Enrolled in ${course.title}.`,
                                                                                className: "bg-green-50 border-green-200"
                                                                            });
                                                                        } else {
                                                                            toast({
                                                                                title: "Demo Action",
                                                                                description: `In a real app, this would assign ${course.title} to ${candidate.name}.`
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <Plus className="h-3 w-3 text-green-600" />
                                                                    <div className="text-left">
                                                                        <div className="text-xs font-semibold">{course.title}</div>
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                 </div>
                                              </div>
                                           </div>

                                         </div>
                                       </ScrollArea>
                                     </DialogContent>
                                   </Dialog>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="inbox" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                 {/* Message List */}
                 <Card className="md:col-span-1 h-[600px] flex flex-col">
                    <CardHeader className="p-4 border-b">
                       <CardTitle className="text-lg">Inbox</CardTitle>
                       <Input placeholder="Search messages..." className="mt-2" />
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto">
                       {allMessages.map((msg) => (
                          <div key={msg.id} className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${msg.id === 1 ? 'bg-blue-50/50' : ''}`}>
                             <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold text-sm ${msg.status === 'unread' ? 'text-slate-900' : 'text-slate-600'}`}>{msg.sender}</span>
                                <span className="text-xs text-slate-400">{msg.time}</span>
                             </div>
                             <p className="text-xs font-medium text-slate-500 mb-1">{msg.role}</p>
                             <p className="text-sm font-medium text-slate-800 line-clamp-1">{msg.subject}</p>
                             <p className="text-xs text-slate-500 line-clamp-2 mt-1">{msg.preview}</p>
                          </div>
                       ))}
                    </div>
                 </Card>

                 {/* Message Detail */}
                 <Card className="md:col-span-2 h-[600px] flex flex-col">
                    <CardHeader className="p-6 border-b flex flex-row justify-between items-start">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h2 className="text-xl font-bold">Question about Module 2 Brake Systems</h2>
                             <Badge>Technical Support</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <span>From: <strong>Sarah Chen</strong> (Automotive Mechanic)</span>
                             <span>•</span>
                             <span>Candidate ID: C-1025</span>
                          </div>
                       </div>
                       <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" /> View Profile
                       </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 overflow-y-auto">
                       <div className="prose prose-sm max-w-none">
                          <p>Hi Trainer Team,</p>
                          <p>I'm currently working through the Brake Systems module and I'm a bit confused about the maintenance schedule differences between disc and drum brakes presented in Lesson 2.</p>
                          <p>The video mentions a 50,000km check for drums, but the reading material says 30,000km. Could you clarify which standard we should follow for the final assessment?</p>
                          <p>Thanks,<br/>Sarah</p>
                       </div>
                    </CardContent>
                    <div className="p-4 border-t bg-slate-50">
                       <div className="space-y-4">
                          <Input placeholder="Reply to Sarah..." />
                          <div className="flex justify-end gap-2">
                             <Button variant="outline">Mark as Resolved</Button>
                             <Button>Send Reply</Button>
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
           </TabsContent>
        </Tabs>

      </main>
      <StressTest />
    </div>
  );
}