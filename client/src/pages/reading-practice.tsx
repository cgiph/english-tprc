import { useState, useEffect } from "react";
import { READING_QUESTIONS, ReadingTaskType, ReadingQuestion } from "@/lib/reading-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Check, RotateCcw, ChevronLeft, ChevronRight, GripVertical, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ReadingPractice() {
  const [activeTab, setActiveTab] = useState<ReadingTaskType>("Multiple Choice (Single)");
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<Record<ReadingTaskType, number>>({
    "Multiple Choice (Single)": 0,
    "Multiple Choice (Multiple)": 0,
    "R&W Fill in the Blanks": 0,
    "Reading Fill in the Blanks": 0,
    "Reorder Paragraphs": 0
  });
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const { toast } = useToast();

  const currentQuestionIndex = currentQuestionIndices[activeTab];
  const questions = READING_QUESTIONS[activeTab];
  const currentQuestion = questions[currentQuestionIndex];
  const questionId = currentQuestion.id;

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => {
        const newVal = prev + 1;
        if (newVal === 120) { // 2 minutes warning
           toast({
             variant: "destructive",
             title: "Time Alert",
             description: "You have spent 2 minutes on this question. Consider moving on.",
             duration: 5000
           });
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questionId, toast]); // Reset timer on question change

  // Reset timer when question changes
  useEffect(() => {
    setTimeSpent(0);
  }, [questionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + 1
      }));
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] - 1
      }));
      setShowResult(false);
    }
  };

  const resetQuestion = () => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
    setShowResult(false);
    setTimeSpent(0);
  };

  const renderQuestionContent = () => {
    switch (activeTab) {
      case "Multiple Choice (Single)":
        return (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">{currentQuestion.text}</p>
            {currentQuestion.prompt && (
              <p className="font-medium text-primary bg-primary/5 p-3 rounded-md border border-primary/10">
                {currentQuestion.prompt}
              </p>
            )}
            <RadioGroup 
              value={answers[questionId] || ""} 
              onValueChange={(val) => setAnswers(prev => ({ ...prev, [questionId]: val }))}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option) => (
                <div key={option} className={cn(
                  "flex items-center space-x-2 p-4 rounded-lg border transition-colors",
                  showResult && option === currentQuestion.correctAnswer ? "bg-green-50 border-green-500" : "",
                  showResult && answers[questionId] === option && option !== currentQuestion.correctAnswer ? "bg-red-50 border-red-500" : "",
                  !showResult && "hover:bg-accent"
                )}>
                  <RadioGroupItem value={option} id={option} disabled={showResult} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer text-base font-medium">{option}</Label>
                  {showResult && option === currentQuestion.correctAnswer && <Check className="h-5 w-5 text-green-600" />}
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "Multiple Choice (Multiple)":
        return (
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="bg-muted/30 p-6 rounded-lg border text-lg leading-relaxed h-full overflow-y-auto max-h-[600px] shadow-inner">
               {currentQuestion.text.split('\n\n').map((para, i) => (
                 <p key={i} className="mb-4 last:mb-0">{para}</p>
               ))}
            </div>
            
            <div className="space-y-6">
               <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-semibold text-primary mb-2">Read the text and answer the multiple-choice question by selecting the correct response. More than one response is correct.</p>
                  <p className="font-medium text-lg">{currentQuestion.prompt}</p>
               </div>
               
               <div className="space-y-3">
                 {currentQuestion.options?.map((option) => {
                  const isSelected = (answers[questionId] || []).includes(option);
                  const isCorrect = (currentQuestion.correctAnswer as string[]).includes(option);
                  
                  return (
                    <div key={option} className={cn(
                      "flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                      showResult && isCorrect ? "bg-green-50 border-green-500 shadow-sm" : "",
                      showResult && isSelected && !isCorrect ? "bg-red-50 border-red-500 shadow-sm" : "",
                      !showResult && isSelected ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-accent",
                      !showResult && "hover:border-primary/50"
                    )}
                    onClick={() => {
                        if (showResult) return;
                        const current = answers[questionId] || [];
                        if (isSelected) {
                          setAnswers(prev => ({ ...prev, [questionId]: current.filter((i: string) => i !== option) }));
                        } else {
                          setAnswers(prev => ({ ...prev, [questionId]: [...current, option] }));
                        }
                    }}
                    >
                      <Checkbox 
                        id={option} 
                        checked={isSelected}
                        disabled={showResult}
                        className="mt-1"
                        onCheckedChange={(checked) => {
                          const current = answers[questionId] || [];
                          if (checked) {
                            setAnswers(prev => ({ ...prev, [questionId]: [...current, option] }));
                          } else {
                            setAnswers(prev => ({ ...prev, [questionId]: current.filter((i: string) => i !== option) }));
                          }
                        }}
                      />
                      <Label htmlFor={option} className="flex-1 cursor-pointer text-base leading-relaxed pointer-events-none">{option}</Label>
                      {showResult && isCorrect && <Check className="h-5 w-5 text-green-600 shrink-0" />}
                    </div>
                  );
                })}
               </div>
            </div>
          </div>
        );

      case "R&W Fill in the Blanks":
        const parts = currentQuestion.text.split(/(\{\{\d+\}\})/);
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
              Below is a text with blanks. Click on each blank, a list of choice will appear. Select the appropriate answer choice for each blank.
            </div>
            <div className="text-lg leading-loose font-normal">
              {parts.map((part, i) => {
                const match = part.match(/\{\{(\d+)\}\}/);
                if (match) {
                  const index = parseInt(match[1]);
                  const blank = currentQuestion.blanks?.find(b => b.index === index);
                  const selected = (answers[questionId] || {})[index];
                  const isCorrect = showResult && selected === blank?.correct;
                  
                  return (
                    <span key={i} className="inline-block mx-1 align-middle">
                      <Select 
                        value={selected || ""} 
                        onValueChange={(val) => setAnswers(prev => ({ 
                          ...prev, 
                          [questionId]: { ...(prev[questionId] || {}), [index]: val } 
                        }))}
                        disabled={showResult}
                      >
                        <SelectTrigger className={cn(
                          "w-[160px] h-9 inline-flex items-center justify-between px-3 bg-white border-input shadow-sm transition-all",
                          showResult && isCorrect && "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500",
                          showResult && !isCorrect && "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500",
                          selected && !showResult && "border-primary/50 bg-primary/5 text-primary"
                        )}>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {blank?.options?.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          </div>
        );

      case "Reading Fill in the Blanks":
        const fibParts = currentQuestion.text.split(/(\{\{\d+\}\})/);
        const usedWords = Object.values(answers[questionId] || {});
        
        return (
          <div className="space-y-8">
            <div className="text-lg leading-loose p-6 bg-muted/10 rounded-xl border-2 border-dashed border-muted">
              {fibParts.map((part, i) => {
                const match = part.match(/\{\{(\d+)\}\}/);
                if (match) {
                  const index = parseInt(match[1]);
                  const selected = (answers[questionId] || {})[index];
                  const blank = currentQuestion.blanks?.find(b => b.index === index);
                  const isCorrect = showResult && selected === blank?.correct;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!showResult) {
                           const newAns = { ...(answers[questionId] || {}) };
                           delete newAns[index];
                           setAnswers(prev => ({ ...prev, [questionId]: newAns }));
                        }
                      }}
                      className={cn(
                        "inline-block min-w-[80px] px-3 py-1 mx-1 border-b-2 text-center font-medium transition-all",
                        selected ? "border-primary text-primary bg-primary/5 rounded-t-md" : "border-muted-foreground/30 text-muted-foreground",
                        showResult && isCorrect && "border-green-500 text-green-600 bg-green-50",
                        showResult && selected && !isCorrect && "border-red-500 text-red-600 bg-red-50"
                      )}
                    >
                      {selected || "______"}
                    </button>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>

            <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-xl">
              {currentQuestion.options?.map((option) => {
                 const isUsed = usedWords.includes(option);
                 return (
                   <Button
                     key={option}
                     variant={isUsed ? "secondary" : "outline"}
                     className={cn(
                       "bg-background shadow-sm hover:bg-primary/5", 
                       isUsed && "opacity-50 cursor-not-allowed"
                     )}
                     disabled={isUsed || showResult}
                     onClick={() => {
                       // Find first empty blank
                       const currentAns = answers[questionId] || {};
                       const blanks = currentQuestion.blanks || [];
                       for (let b of blanks) {
                         if (!currentAns[b.index]) {
                           setAnswers(prev => ({
                             ...prev,
                             [questionId]: { ...currentAns, [b.index]: option }
                           }));
                           break;
                         }
                       }
                     }}
                   >
                     {option}
                   </Button>
                 );
              })}
            </div>
            <p className="text-sm text-muted-foreground text-center">Click a word to add it to the next available blank. Click a filled blank to remove the word.</p>
          </div>
        );

      case "Reorder Paragraphs":
        const currentOrder = answers[questionId] || currentQuestion.paragraphs;
        
        const moveItem = (index: number, direction: 'up' | 'down') => {
          if (showResult) return;
          const newOrder = [...currentOrder];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex >= 0 && targetIndex < newOrder.length) {
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            setAnswers(prev => ({ ...prev, [questionId]: newOrder }));
          }
        };

        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            {currentOrder?.map((para: any, index: number) => (
              <div 
                key={para.id} 
                className={cn(
                  "flex gap-4 p-4 bg-card rounded-xl border shadow-sm transition-all",
                  showResult && para.correctOrder === index + 1 ? "border-green-500 ring-1 ring-green-500 bg-green-50/30" : "",
                  showResult && para.correctOrder !== index + 1 ? "border-red-500 ring-1 ring-red-500 bg-red-50/30" : ""
                )}
              >
                <div className="flex flex-col gap-2 justify-center">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0 || showResult}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === currentOrder.length - 1 || showResult}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-base leading-relaxed py-2">
                   {para.text}
                </div>
                {showResult && (
                   <div className="flex items-center justify-center font-bold text-muted-foreground w-8">
                     {para.correctOrder}
                   </div>
                )}
              </div>
            ))}
            {showResult && <p className="text-center text-sm text-muted-foreground">Numbers indicate the correct position.</p>}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Reading Practice</h1>
        <p className="text-lg text-muted-foreground">
          Master the Reading section with targeted practice questions. 
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => {
        setActiveTab(val as ReadingTaskType);
        setShowResult(false);
      }} className="space-y-8">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start md:justify-center bg-muted/50 p-1 h-auto flex-wrap">
            {Object.keys(READING_QUESTIONS).map((type) => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm whitespace-nowrap"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card className="min-h-[500px] flex flex-col border-2 border-muted">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="bg-white">
                     Question {currentQuestionIndex + 1} of {questions.length}
                   </Badge>
                   <Badge variant={currentQuestion.difficulty === "Easy" ? "secondary" : "destructive"} className="capitalize">
                     {currentQuestion.difficulty}
                   </Badge>
                </div>
                <CardTitle className="text-xl font-serif">
                  {currentQuestion.title}
                </CardTitle>
              </div>
              
              <div className="flex items-center gap-4">
                 {/* Timer Display */}
                 <div className={cn(
                   "flex items-center gap-2 font-mono text-lg",
                   timeSpent >= 120 ? "text-red-500 font-bold animate-pulse" : "text-muted-foreground"
                 )}>
                   <Timer className="h-4 w-4" />
                   {formatTime(timeSpent)}
                 </div>

                 <div className="flex gap-2">
                   <Button 
                     variant="outline" 
                     size="icon" 
                     onClick={handlePrev} 
                     disabled={currentQuestionIndex === 0}
                   >
                     <ChevronLeft className="h-4 w-4" />
                   </Button>
                   <Button 
                     variant="outline" 
                     size="icon" 
                     onClick={handleNext} 
                     disabled={currentQuestionIndex === questions.length - 1}
                   >
                     <ChevronRight className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-8">
            {renderQuestionContent()}
          </CardContent>
          
          <CardFooter className="border-t p-6 bg-muted/5 flex justify-between items-center">
             <Button variant="ghost" onClick={resetQuestion}>
               <RotateCcw className="mr-2 h-4 w-4" /> Reset Question
             </Button>
             
             <div className="flex gap-4">
               <Button 
                 variant="outline" 
                 className="border-primary/20 hover:bg-primary/5"
                 onClick={() => setShowResult(!showResult)}
               >
                 {showResult ? "Hide Answer" : "Show Answer"}
               </Button>
               <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                 Next Question
               </Button>
             </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}