import { useState, useEffect } from "react";
import { WRITING_QUESTIONS, WritingTaskType } from "@/lib/writing-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Timer,
  RotateCcw, 
  ChevronRight,
  ChevronLeft,
  FileText,
  PenTool,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function WritingPractice() {
  const [activeTab, setActiveTab] = useState<WritingTaskType>("Summarize Written Text");
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<Record<WritingTaskType, number>>({
    "Summarize Written Text": 0,
    "Write Essay": 0
  });
  
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const { toast } = useToast();

  const currentQuestionIndex = currentQuestionIndices[activeTab];
  const questions = WRITING_QUESTIONS[activeTab];
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestion.id] || "";

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            toast({
              title: "Time's Up!",
              description: "The practice time for this question has ended.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Reset/Init when question changes
  useEffect(() => {
    setIsActive(false);
    setTimeLeft(currentQuestion.timeLimit);
  }, [currentQuestion]);

  const handleStart = () => {
    setIsActive(true);
    toast({
      title: "Timer Started",
      description: `You have ${Math.floor(currentQuestion.timeLimit / 60)} minutes for this task.`,
    });
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(currentQuestion.timeLimit);
    setResponses(prev => ({ ...prev, [currentQuestion.id]: "" }));
    setWordCounts(prev => ({ ...prev, [currentQuestion.id]: 0 }));
  };

  const handleTextChange = (text: string) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: text }));
    const count = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    setWordCounts(prev => ({ ...prev, [currentQuestion.id]: count }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + 1
      }));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] - 1
      }));
    }
  };

  const getStatusColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-secondary";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Writing Practice</h1>
        <p className="text-lg text-muted-foreground">
          Master the writing section with summarized text and essay writing tasks. 
          Timed practice with instant word count tracking.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as WritingTaskType)} className="space-y-8">
        <TabsList className="w-full justify-start md:justify-center bg-muted/50 p-1">
          <TabsTrigger value="Summarize Written Text" className="px-8 py-2 gap-2">
            <FileText className="h-4 w-4" /> Summarize Written Text
          </TabsTrigger>
          <TabsTrigger value="Write Essay" className="px-8 py-2 gap-2">
            <PenTool className="h-4 w-4" /> Write Essay
          </TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          <Card className="border-2 border-muted">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </Badge>
                    <Badge className={getStatusColor(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">
                    {currentQuestion.title}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-4">
                   <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 && isActive ? "text-red-500 animate-pulse" : "text-primary"}`}>
                     <Timer className="h-5 w-5" />
                     {formatTime(timeLeft)}
                   </div>

                   <div className="flex gap-2">
                     <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                       <ChevronLeft className="h-4 w-4" />
                     </Button>
                     <Button variant="outline" size="icon" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                       <ChevronRight className="h-4 w-4" />
                     </Button>
                   </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Task Instructions */}
              {activeTab === "Summarize Written Text" && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 flex gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <strong>Task:</strong> Read the passage below and summarize it using one sentence. Type your response in the box at the bottom of the screen. You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage.
                  </div>
                </div>
              )}

              {activeTab === "Write Essay" && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 flex gap-2">
                   <AlertCircle className="h-5 w-5 shrink-0" />
                   <div>
                     <strong>Task:</strong> You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200-300 words.
                   </div>
                </div>
              )}

              {/* Question Content */}
              <div className="bg-muted/10 p-6 rounded-lg border text-lg leading-relaxed">
                {currentQuestion.content}
              </div>

              {/* Writing Area */}
              <div className="space-y-2">
                <Textarea 
                  placeholder={activeTab === "Summarize Written Text" ? "Type your one-sentence summary here..." : "Type your essay here..."}
                  className="min-h-[200px] font-serif text-lg leading-relaxed p-6 resize-y"
                  value={currentResponse}
                  onChange={(e) => handleTextChange(e.target.value)}
                  disabled={!isActive && timeLeft > 0 && timeLeft !== currentQuestion.timeLimit} // Disabled only if time ended? No, usually editable unless submitted. Let's keep enabled but maybe visually dimmed if time up.
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex gap-4">
                     <span>Word Count: <span className="font-bold text-foreground">{wordCounts[currentQuestion.id] || 0}</span></span>
                     {currentQuestion.minWords && currentQuestion.maxWords && (
                       <span className={
                         (wordCounts[currentQuestion.id] || 0) < currentQuestion.minWords || (wordCounts[currentQuestion.id] || 0) > currentQuestion.maxWords
                         ? "text-red-500" 
                         : "text-green-600"
                       }>
                         (Target: {currentQuestion.minWords}-{currentQuestion.maxWords})
                       </span>
                     )}
                  </div>
                  {activeTab === "Summarize Written Text" && (
                    <span className={
                      (currentResponse.match(/[.!?]+/g) || []).length > 1 || (currentResponse.match(/[.!?]+/g) || []).length === 0
                      ? "text-red-500"
                      : "text-green-600"
                    }>
                      Sentence Count: {(currentResponse.match(/[.!?]+/g) || []).length} (Target: 1)
                    </span>
                  )}
                </div>
              </div>

            </CardContent>
            
            <CardFooter className="border-t p-6 bg-muted/5 flex justify-between items-center">
               <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
               </Button>

               {!isActive ? (
                 <Button size="lg" onClick={handleStart} className="w-40 font-bold">
                   Start Timer
                 </Button>
               ) : (
                 <Button size="lg" variant="destructive" onClick={() => setIsActive(false)} className="w-40 font-bold">
                   Stop Timer
                 </Button>
               )}
            </CardFooter>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
