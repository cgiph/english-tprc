import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateMockTest, MockQuestion } from "@/lib/mock-test-data";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function FullMockTest() {
  const [testState, setTestState] = useState<"intro" | "active" | "finished">("intro");
  const [currentTest, setCurrentTest] = useState<{ test_id: string; items: MockQuestion[]; start_time: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [score, setScore] = useState<{ total: number, details: any[] } | null>(null);

  // Mock API Call simulation
  const generateTest = async (section?: string, count = 20) => {
    // In a real app, this would be:
    // const res = await fetch("http://localhost:3000/api/generate-test", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ section: section, count: count })
    // });
    // const data = await res.json();
    // console.log("Test:", data);

    // Simulating network delay for realistic effect
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return local mock data
    const data = generateMockTest(section, count);
    console.log("Test Generated (Mock API):", data);
    return data;
  };

  const startTest = async () => {
    setTestState("active"); // Show active state immediately (or loading state could be added)
    const test = await generateTest(undefined, 20); // Generate 20 mixed questions
    setCurrentTest(test);
    setCurrentIndex(0);
    setResponses({});
  };

  const submitAnswer = (val: any) => {
    if (!currentTest) return;
    const q = currentTest.items[currentIndex];
    setResponses(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    if (!currentTest) return;
    if (currentIndex < currentTest.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    if (!currentTest) return;
    
    // Calculate Score (Mock Logic based on user's provided server code)
    let total = 0;
    const details = [];

    for (const item of currentTest.items) {
      const response = responses[item.id];
      let itemScore = 0;

      // Simplified auto-scoring
      if (item.correctAnswer) {
         if (Array.isArray(item.correctAnswer) && Array.isArray(response)) {
            // simplistic array match
            const correct = item.correctAnswer.sort().join();
            const user = response.sort().join();
            if (correct === user) itemScore = item.max_score;
         } else if (response === item.correctAnswer) {
            itemScore = item.max_score;
         }
      } else {
        // Give partial points for open-ended responses just for the mockup feel
        if (response && response.length > 10) itemScore = Math.floor(item.max_score * 0.7);
      }

      total += itemScore;
      details.push({ question_id: item.id, score: itemScore, max: item.max_score });
    }

    setScore({ total, details });
    setTestState("finished");
  };

  // Render different question types
  const renderQuestion = (q: MockQuestion) => {
    const currentVal = responses[q.id];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="space-y-2">
          <Badge variant="outline" className="mb-2">{q.section} - {q.type}</Badge>
          <h3 className="text-xl font-serif font-bold">{q.title}</h3>
          
          {/* Content/Prompt */}
          {q.content && <p className="text-lg leading-relaxed">{q.content}</p>}
          {q.text && <p className="text-lg leading-relaxed">{q.text}</p>}
          {q.prompt && <p className="font-medium text-blue-800 bg-blue-50 p-3 rounded">{q.prompt}</p>}
          
          {/* Image */}
          {q.imageUrl && (
             <div className="border rounded-lg p-2 bg-white max-w-md">
               <img src={q.imageUrl} alt="Task" className="w-full h-auto" />
             </div>
          )}

          {/* Audio Script (Mock Audio) */}
          {q.audioScript && (
            <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
              <Button size="icon" variant="secondary" className="rounded-full">
                <PlayCircle className="h-6 w-6" />
              </Button>
              <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary/50" />
              </div>
              <span className="text-xs text-muted-foreground">Audio Playing...</span>
            </div>
          )}
        </div>

        {/* Interaction Area */}
        <div className="pt-4 border-t">
          {q.options ? (
             // MCQ Logic
             <RadioGroup value={currentVal} onValueChange={submitAnswer}>
               {q.options.map(opt => (
                 <div key={opt} className="flex items-center space-x-2 mb-2">
                   <RadioGroupItem value={opt} id={opt} />
                   <Label htmlFor={opt} className="text-base">{opt}</Label>
                 </div>
               ))}
             </RadioGroup>
          ) : (
             // Text Input Logic
             <Textarea 
               placeholder="Type your answer here..." 
               className="min-h-[150px] font-medium text-lg"
               value={currentVal || ""}
               onChange={(e) => submitAnswer(e.target.value)}
             />
          )}
        </div>
      </div>
    );
  };

  if (testState === "intro") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="text-center space-y-4 pb-8 pt-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold">Full Mock Test - UKVI Edition</CardTitle>
            <CardDescription className="text-lg max-w-lg mx-auto">
              A complete simulation of the PTE Academic UKVI exam. 
              Includes Speaking, Writing, Reading, and Listening sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/30 rounded-lg">
                <strong className="block text-2xl font-bold text-primary">20</strong>
                <span className="text-muted-foreground">Questions (Mock)</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <strong className="block text-2xl font-bold text-primary">30m</strong>
                <span className="text-muted-foreground">Duration</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex gap-3 items-start text-sm text-yellow-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>
                This is a simulation mode. Your responses will be auto-scored where possible, 
                but speaking and writing tasks use estimated scoring for this demo.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pb-10 justify-center">
            <Button size="lg" className="w-full max-w-xs text-lg font-bold h-12" onClick={startTest}>
              Start Mock Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testState === "finished") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-green-900">Test Completed!</CardTitle>
            <CardDescription className="text-lg">
              You have finished the full mock test simulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">
                {score?.total} <span className="text-2xl text-muted-foreground font-normal">/ {score?.details.reduce((a, b) => a + b.max, 0)}</span>
              </div>
              <p className="text-muted-foreground font-medium">Estimated Overall Score</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Performance Breakdown</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {score?.details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded border text-sm">
                    <span className="font-medium text-muted-foreground">Question {i + 1}</span>
                    <Badge variant={d.score === d.max ? "default" : "secondary"}>
                      {d.score} / {d.max} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center gap-4">
            <Button variant="outline" onClick={() => setTestState("intro")}>Retake Test</Button>
            <Link href="/resources">
              <Button>Back to Resources</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentTest) return null;
  const q = currentTest.items[currentIndex];
  const progress = ((currentIndex + 1) / currentTest.items.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {currentTest.items.length}</span>
          <span>{q.section} Section</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="flex-1 flex flex-col border-2 shadow-sm">
        <CardContent className="p-8 flex-1">
          {renderQuestion(q)}
        </CardContent>
        <CardFooter className="bg-muted/5 border-t p-6 flex justify-end">
          <Button size="lg" onClick={handleNext} className="gap-2 pl-6">
            {currentIndex === currentTest.items.length - 1 ? "Submit Test" : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
