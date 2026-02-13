import { useState, useEffect } from "react";
import { WRITING_QUESTIONS, WritingTaskType } from "@/lib/writing-data";
import { calculateSWTScore, calculateEssayScore, SWTScore, EssayScore } from "@/lib/scoring-utils";
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
  const [swtScores, setSwtScores] = useState<Record<string, SWTScore>>({});
  const [essayScores, setEssayScores] = useState<Record<string, EssayScore>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

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
    setShowResults(prev => ({ ...prev, [currentQuestion.id]: false }));
    setSwtScores(prev => ({ ...prev, [currentQuestion.id]: undefined as any }));
    setEssayScores(prev => ({ ...prev, [currentQuestion.id]: undefined as any }));
  };

  const handleSubmit = () => {
    setIsActive(false);
    setShowResults(prev => ({ ...prev, [currentQuestion.id]: true }));
    
    if (activeTab === "Summarize Written Text") {
        const score = calculateSWTScore(currentResponse, currentQuestion.content);
        setSwtScores(prev => ({ ...prev, [currentQuestion.id]: score }));
    } else {
        const score = calculateEssayScore(currentResponse, currentQuestion.title); // Using title as "topic" usually
        setEssayScores(prev => ({ ...prev, [currentQuestion.id]: score }));
    }
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
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start md:justify-center bg-muted/50 p-1 h-auto flex-wrap sm:flex-nowrap">
            <TabsTrigger value="Summarize Written Text" className="px-4 sm:px-8 py-2 gap-2 whitespace-nowrap flex-grow sm:flex-grow-0">
              <FileText className="h-4 w-4" /> Summarize Written Text
            </TabsTrigger>
            <TabsTrigger value="Write Essay" className="px-4 sm:px-8 py-2 gap-2 whitespace-nowrap flex-grow sm:flex-grow-0">
              <PenTool className="h-4 w-4" /> Write Essay
            </TabsTrigger>
          </TabsList>
        </div>

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
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 flex gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div>
                        <strong>Task:</strong> Read the passage below and summarize it using one sentence. Type your response in the box at the bottom of the screen. You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                         <p className="font-bold text-yellow-800 mb-2">Scoring Criteria:</p>
                         <ul className="list-disc pl-5 space-y-1 text-yellow-900">
                             <li><strong>Form (1 pt):</strong> Must be one single complete sentence (5-75 words). Capital letter to start, punctuation to end.</li>
                             <li><strong>Content (2 pts):</strong> Provides a good summary of all relevant aspects.</li>
                             <li><strong>Grammar (2 pts):</strong> Correct grammatical structure.</li>
                             <li><strong>Vocabulary (2 pts):</strong> Appropriate choice of words.</li>
                         </ul>
                    </div>
                </div>
              )}

              {activeTab === "Write Essay" && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 flex gap-2">
                       <AlertCircle className="h-5 w-5 shrink-0" />
                       <div>
                         <strong>Task:</strong> You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200-300 words.
                       </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                         <p className="font-bold text-yellow-800 mb-2">Scoring Criteria:</p>
                         <ul className="list-disc pl-5 space-y-1 text-yellow-900 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                             <li><strong>Content (3 pts):</strong> Deals adequately with the prompt.</li>
                             <li><strong>Form (2 pts):</strong> Length 200-300 words.</li>
                             <li><strong>Structure (2 pts):</strong> Good development and logical structure.</li>
                             <li><strong>Grammar (2 pts):</strong> Consistent grammatical control.</li>
                             <li><strong>Vocabulary (2 pts):</strong> Good range and precision.</li>
                             <li><strong>Spelling (2 pts):</strong> Correct spelling.</li>
                             <li><strong>Linguistic Range (2 pts):</strong> Effective communication of complex ideas.</li>
                         </ul>
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
                  // Enable textarea if result is not shown (allow editing before submitting)
                  disabled={showResults[currentQuestion.id]} 
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
              
              {/* Score Display */}
              {showResults[currentQuestion.id] && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {/* SWT Score */}
                    {activeTab === "Summarize Written Text" && swtScores[currentQuestion.id] && (
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
                             <p className="text-sm font-semibold text-green-800 mb-4 uppercase tracking-wide">Score Analysis</p>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-white p-3 rounded border border-green-100 text-center">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Content</span>
                                    <span className="font-bold text-green-700 text-xl">{swtScores[currentQuestion.id].content}/2</span>
                                </div>
                                <div className="bg-white p-3 rounded border border-green-100 text-center">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Form</span>
                                    <span className={`font-bold text-xl ${swtScores[currentQuestion.id].form === 0 ? "text-red-600" : "text-green-700"}`}>{swtScores[currentQuestion.id].form}/1</span>
                                </div>
                                <div className="bg-white p-3 rounded border border-green-100 text-center">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Grammar</span>
                                    <span className="font-bold text-green-700 text-xl">{swtScores[currentQuestion.id].grammar}/2</span>
                                </div>
                                <div className="bg-white p-3 rounded border border-green-100 text-center">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Vocab</span>
                                    <span className="font-bold text-green-700 text-xl">{swtScores[currentQuestion.id].vocabulary}/2</span>
                                </div>
                             </div>
                             
                             <div className="bg-white p-4 rounded border border-green-100 mb-4">
                                  <p className="text-sm font-bold text-slate-700 mb-2">Detailed Feedback:</p>
                                  <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">{swtScores[currentQuestion.id].feedback}</pre>
                             </div>

                             <div className="flex justify-between items-center pt-2 border-t border-green-200">
                                <span className="font-bold text-green-900 text-lg">Overall Score:</span>
                                <span className="text-3xl font-bold text-green-700">{swtScores[currentQuestion.id].overall}/7</span>
                             </div>
                        </div>
                    )}

                    {/* Essay Score */}
                    {activeTab === "Write Essay" && essayScores[currentQuestion.id] && (
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
                             <p className="text-sm font-semibold text-green-800 mb-4 uppercase tracking-wide">Score Analysis</p>
                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Content</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].content}/3</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Form</span>
                                    <span className={`font-bold ${essayScores[currentQuestion.id].form === 0 ? "text-red-600" : "text-green-700"}`}>{essayScores[currentQuestion.id].form}/2</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Structure</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].structure}/2</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Grammar</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].grammar}/2</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Vocab</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].vocabulary}/2</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Spelling</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].spelling}/2</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-green-100 text-center">
                                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Linguistic</span>
                                    <span className="font-bold text-green-700">{essayScores[currentQuestion.id].linguistic}/2</span>
                                </div>
                             </div>
                             
                             <div className="bg-white p-4 rounded border border-green-100 mb-4">
                                  <p className="text-sm font-bold text-slate-700 mb-2">Detailed Feedback:</p>
                                  <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">{essayScores[currentQuestion.id].feedback}</pre>
                             </div>

                             <div className="flex justify-between items-center pt-2 border-t border-green-200">
                                <span className="font-bold text-green-900 text-lg">Overall Score:</span>
                                <span className="text-3xl font-bold text-green-700">{essayScores[currentQuestion.id].overall}/15</span>
                             </div>
                        </div>
                    )}
                </div>
              )}

            </CardContent>
            
            <CardFooter className="border-t p-6 bg-muted/5 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex gap-2 w-full sm:w-auto order-2 sm:order-1">
                   <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                   </Button>
               </div>

               <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
                   {!isActive && timeLeft === currentQuestion.timeLimit && (
                     <Button size="lg" onClick={handleStart} className="w-full sm:w-40 font-bold" disabled={showResults[currentQuestion.id]}>
                       Start Timer
                     </Button>
                   )}
                   
                   {isActive && (
                     <Button size="lg" variant="destructive" onClick={() => setIsActive(false)} className="w-full sm:w-40 font-bold">
                       Stop Timer
                     </Button>
                   )}

                   {/* Submit Button - visible if timer stopped or running (user can finish early) */}
                   <Button 
                      size="lg" 
                      onClick={handleSubmit} 
                      className="w-full sm:w-40 font-bold bg-green-600 hover:bg-green-700 text-white"
                      disabled={showResults[currentQuestion.id] || currentResponse.length < 5}
                   >
                     Submit & Score
                   </Button>
               </div>
            </CardFooter>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
