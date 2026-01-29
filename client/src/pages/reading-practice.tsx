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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sectionSubmitted, setSectionSubmitted] = useState<Record<ReadingTaskType, boolean>>({
    "Multiple Choice (Single)": false,
    "Multiple Choice (Multiple)": false,
    "R&W Fill in the Blanks": false,
    "Reading Fill in the Blanks": false,
    "Reorder Paragraphs": false,
  });
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

      const revealed = sectionSubmitted[activeTab];
      setShowResult(revealed);
      setIsSubmitted(revealed);
    }
  };

  const handleSubmit = () => {
    setSectionSubmitted(prev => ({ ...prev, [activeTab]: true }));
    setShowResult(true);
    setIsSubmitted(true);
    toast({
      title: "Submitted",
      description: "Answer key revealed for this section.",
    });
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] - 1
      }));

      const revealed = sectionSubmitted[activeTab];
      setShowResult(revealed);
      setIsSubmitted(revealed);
    }
  };

  const resetQuestion = () => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);

    // If the section answer key is already revealed, keep result view on.
    const revealed = sectionSubmitted[activeTab];
    setShowResult(revealed);
    setIsSubmitted(revealed);

    setTimeSpent(0);
  };

  const revealAnswers = sectionSubmitted[activeTab];

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
                  revealAnswers && option === currentQuestion.correctAnswer ? "bg-green-50 border-green-500" : "",
                  revealAnswers && answers[questionId] === option && option !== currentQuestion.correctAnswer ? "bg-red-50 border-red-500" : "",
                  !revealAnswers && "hover:bg-accent"
                )}>
                  <RadioGroupItem value={option} id={option} disabled={revealAnswers} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer text-base font-medium">{option}</Label>
                  {revealAnswers && option === currentQuestion.correctAnswer && <Check className="h-5 w-5 text-green-600" />}
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
                      revealAnswers && isCorrect ? "bg-green-50 border-green-500 shadow-sm" : "",
                      revealAnswers && isSelected && !isCorrect ? "bg-red-50 border-red-500 shadow-sm" : "",
                      !revealAnswers && isSelected ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-accent",
                      !revealAnswers && "hover:border-primary/50"
                    )}
                    onClick={() => {
                        if (revealAnswers) return;
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
                        disabled={revealAnswers}
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
                      {revealAnswers && isCorrect && <Check className="h-5 w-5 text-green-600 shrink-0" />}
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
                  const isCorrect = revealAnswers && selected === blank?.correct;
                  
                  return (
                    <span key={i} className="inline-block mx-1 align-middle">
                      <Select 
                        value={selected || ""} 
                        onValueChange={(val) => setAnswers(prev => ({ 
                          ...prev, 
                          [questionId]: { ...(prev[questionId] || {}), [index]: val } 
                        }))}
                        disabled={revealAnswers}
                      >
                        <SelectTrigger className={cn(
                          "w-[160px] h-9 inline-flex items-center justify-between px-3 bg-white border-input shadow-sm transition-all",
                          revealAnswers && isCorrect && "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500",
                          revealAnswers && !isCorrect && "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500",
                          selected && !revealAnswers && "border-primary/50 bg-primary/5 text-primary"
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
                  const isCorrect = revealAnswers && selected === blank?.correct;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!revealAnswers) {
                           const newAns = { ...(answers[questionId] || {}) };
                           delete newAns[index];
                           setAnswers(prev => ({ ...prev, [questionId]: newAns }));
                        }
                      }}
                      className={cn(
                        "inline-block min-w-[80px] px-3 py-1 mx-1 border-b-2 text-center font-medium transition-all",
                        selected ? "border-primary text-primary bg-primary/5 rounded-t-md" : "border-muted-foreground/30 text-muted-foreground",
                        revealAnswers && isCorrect && "border-green-500 text-green-600 bg-green-50",
                        revealAnswers && selected && !isCorrect && "border-red-500 text-red-600 bg-red-50"
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
                     disabled={isUsed || revealAnswers}
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
          if (revealAnswers) return;
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
                  revealAnswers && para.correctOrder === index + 1 ? "border-green-500 ring-1 ring-green-500 bg-green-50/30" : "",
                  revealAnswers && para.correctOrder !== index + 1 ? "border-red-500 ring-1 ring-red-500 bg-red-50/30" : ""
                )}
              >
                <div className="flex flex-col gap-2 justify-center">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0 || revealAnswers}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === currentOrder.length - 1 || revealAnswers}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-base leading-relaxed py-2">
                   {para.text}
                </div>
                {revealAnswers && (
                   <div className="flex items-center justify-center font-bold text-muted-foreground w-8">
                     {para.correctOrder}
                   </div>
                )}
              </div>
            ))}
            {revealAnswers && <p className="text-center text-sm text-muted-foreground">Numbers indicate the correct position.</p>}
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
        const nextTab = val as ReadingTaskType;
        setActiveTab(nextTab);

        const revealed = sectionSubmitted[nextTab];
        setShowResult(revealed);
        setIsSubmitted(revealed);
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

            {sectionSubmitted[activeTab] && (currentQuestion.explanation || currentQuestion.correctAnswer) && (
              <div className="mt-8 rounded-xl border bg-muted/10 p-5" data-testid="card-reading-explanation">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-semibold text-foreground" data-testid="text-reading-explanation-title">Explanation</p>
                  <Badge variant="secondary" data-testid="badge-reading-answers-revealed">Answers revealed</Badge>
                </div>

                {currentQuestion.explanation ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="text-reading-explanation">
                    {currentQuestion.explanation}
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="text-reading-explanation">
                    The correct answer is shown by the highlighted option(s) above.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t p-6 bg-muted/5 flex justify-between items-center">
            <Button variant="ghost" onClick={resetQuestion} data-testid="button-reading-reset">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Question
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                data-testid="button-reading-back"
              >
                Back
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={sectionSubmitted[activeTab]}
                  data-testid="button-reading-submit"
                >
                  {sectionSubmitted[activeTab] ? "Submitted" : "Submit"}
                </Button>
              ) : (
                <Button onClick={handleNext} data-testid="button-reading-next">
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}