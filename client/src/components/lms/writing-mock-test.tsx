
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type TaskType = "swt" | "essay";

interface WritingTask {
  id: string;
  type: TaskType;
  title: string;
  prompt: string;
  durationSeconds: number; // 600 for SWT, 1200 for Essay
  wordLimit: { min: number; max: number };
  keywords: string[]; // For mock scoring content check
}

// --- Mock Data ---

const WRITING_TASKS: WritingTask[] = [
  {
    id: "swt-1",
    type: "swt",
    title: "Summarize Written Text",
    prompt: `
The sheer scale of global urbanization is unprecedented. In 1950, 30% of the world's population lived in urban areas; by 2050, this is projected to reach 68%. This rapid shift presents both immense opportunities and significant challenges. Cities are engines of economic growth, innovation, and cultural exchange, generating over 80% of global GDP. However, this concentration of people and activity also places enormous strain on infrastructure, housing, and the environment.

The challenge for policymakers is to harness the potential of urbanization while mitigating its negative impacts. Sustainable urban planning is crucial, requiring investments in public transport, renewable energy, and green spaces. Furthermore, addressing social inequality is paramount, as rapid urbanization often exacerbates the divide between the wealthy and the marginalized. Slums and informal settlements are a growing reality in many developing nations, highlighting the urgent need for inclusive housing policies. Ultimately, the future of humanity is urban, and the quality of that future depends on the decisions made today regarding how we build and manage our cities.
    `,
    durationSeconds: 600, // 10 mins
    wordLimit: { min: 5, max: 75 }, // Official is 5-75 words, single sentence
    keywords: ["urbanization", "economic growth", "challenges", "infrastructure", "sustainable", "inequality", "planning"]
  },
  {
    id: "essay-1",
    type: "essay",
    title: "Write Essay",
    prompt: "Climate change is one of the most pressing issues of our time. Some argue that technology will provide the ultimate solution, while others believe that fundamental changes in lifestyle and consumption are necessary. Discuss both views and give your opinion.",
    durationSeconds: 1200, // 20 mins
    wordLimit: { min: 200, max: 300 },
    keywords: ["climate change", "technology", "lifestyle", "consumption", "solution", "opinion", "environment"]
  }
];

// --- Components ---

function TaskTimer({ duration, onExpire }: { duration: number; onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={cn("flex items-center gap-2 font-mono font-bold", timeLeft < 60 ? "text-red-600 animate-pulse" : "text-slate-700")}>
      <Clock className="w-4 h-4" />
      {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
}

interface FeedbackItem {
  category: string;
  score: string; // e.g. "2/2"
  comments: string[];
  status: "good" | "warning" | "error";
}

export function WritingMockTest() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, FeedbackItem[]>>({});
  const [activeTab, setActiveTab] = useState<TaskType>("swt");

  const currentTask = WRITING_TASKS[currentTaskIndex];

  const handleResponseChange = (text: string) => {
    setResponses((prev) => ({ ...prev, [currentTask.id]: text }));
  };

  const analyzeResponse = (task: WritingTask, text: string): FeedbackItem[] => {
    const feedbackItems: FeedbackItem[] = [];
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Form (Length)
    let formScore = "2/2";
    let formStatus: "good" | "warning" | "error" = "good";
    const formComments = [];

    if (wordCount < task.wordLimit.min || wordCount > task.wordLimit.max) {
      formScore = "0/2";
      formStatus = "error";
      formComments.push(`Word count: ${wordCount}. Required: ${task.wordLimit.min}-${task.wordLimit.max}.`);
    } else {
      formComments.push(`Word count: ${wordCount}. Within range.`);
    }

    if (task.type === "swt") {
      // Check for single sentence (one dot at the end)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        formScore = "0/2";
        formStatus = "error";
        formComments.push("Response must be a SINGLE sentence. You have multiple.");
      } else if (text.trim().length > 0 && !text.trim().endsWith(".")) {
         formComments.push("Don't forget the full stop at the end.");
      }
    }
    
    feedbackItems.push({ category: "Form", score: formScore, comments: formComments, status: formStatus });

    // 2. Content (Keywords)
    const presentKeywords = task.keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
    const coverage = presentKeywords.length / task.keywords.length;
    let contentScore = "2/2";
    let contentStatus: "good" | "warning" | "error" = "good";
    
    if (coverage < 0.3) {
      contentScore = "0/2";
      contentStatus = "error";
    } else if (coverage < 0.6) {
      contentScore = "1/2";
      contentStatus = "warning";
    }
    
    feedbackItems.push({ 
      category: "Content", 
      score: contentScore, 
      comments: [`Found ${presentKeywords.length}/${task.keywords.length} key concepts.`, ...presentKeywords.length < 3 ? ["Try to include more key points from the prompt."] : []], 
      status: contentStatus 
    });

    // 3. Grammar/Spelling (Mock)
    // Simple heuristic: check for capitalization, common errors
    const grammarComments = [];
    let grammarStatus: "good" | "warning" = "good";
    
    if (text.length > 0 && text[0] !== text[0].toUpperCase()) {
      grammarComments.push("Start sentence with a capital letter.");
      grammarStatus = "warning";
    }
    
    // Very basic spell check simulation (mock)
    if (text.includes("teh ") || text.includes("dont ") || text.includes("i ")) {
        grammarComments.push("Potential spelling/grammar errors detected (e.g., 'teh', 'dont', lowercase 'i').");
        grammarStatus = "warning";
    }

    feedbackItems.push({
        category: "Grammar & Spelling",
        score: grammarStatus === "good" ? "2/2" : "1/2",
        comments: grammarComments.length > 0 ? grammarComments : ["No obvious errors detected."],
        status: grammarStatus === "error" ? "error" : grammarStatus
    });

    return feedbackItems;
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, FeedbackItem[]> = {};
    WRITING_TASKS.forEach(task => {
        newFeedback[task.id] = analyzeResponse(task, responses[task.id] || "");
    });
    setFeedback(newFeedback);
    setSubmitted(true);
  };

  return (
    <div className="w-full mx-auto p-8 text-left space-y-8 pb-24">
      <div className="bg-slate-900 text-white p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold mb-2">Section 1: Writing Test</h2>
           <p className="text-slate-300">Tasks: Summarize Written Text (10m) & Write Essay (20m)</p>
        </div>
        {!submitted && (
           <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              <TaskTimer 
                 key={currentTask.id} // Reset timer on task change
                 duration={currentTask.durationSeconds} 
                 onExpire={() => { /* Auto-move to next or submit */ }} 
              />
           </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Navigation / Sidebar */}
        <div className="md:col-span-1 space-y-2">
            {WRITING_TASKS.map((task, idx) => (
                <button
                    key={task.id}
                    onClick={() => setCurrentTaskIndex(idx)}
                    className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                        currentTaskIndex === idx 
                           ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-medium" 
                           : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                >
                    <span className="flex items-center gap-2">
                        {idx === 0 ? <FileText className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {task.type === "swt" ? "SWT" : "Essay"}
                    </span>
                    {submitted && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                </button>
            ))}
            
            {!submitted && (
                <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={handleSubmit}
                >
                    Submit All Tasks
                </Button>
            )}
        </div>

        {/* Task Area */}
        <div className="md:col-span-3 space-y-6">
            <Card>
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                           <CardTitle className="text-lg text-slate-800">{currentTask.title}</CardTitle>
                           <p className="text-sm text-slate-500 mt-1">
                               {currentTask.type === "swt" 
                                 ? "Read the passage and summarize it in ONE sentence. (5-75 words)"
                                 : "Write an argumentative essay on the topic below. (200-300 words)"}
                           </p>
                        </div>
                        <Badge variant="outline" className="bg-white">
                            {currentTask.durationSeconds / 60} Mins
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Prompt Box */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 leading-relaxed text-sm md:text-base">
                        {currentTask.prompt.split("\n").map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="space-y-2">
                        <Textarea 
                            className="min-h-[200px] font-mono text-base resize-none focus:ring-2 ring-indigo-500/20"
                            placeholder={currentTask.type === "swt" ? "Type your one-sentence summary here..." : "Type your essay here..."}
                            value={responses[currentTask.id] || ""}
                            onChange={(e) => handleResponseChange(e.target.value)}
                            disabled={submitted}
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>
                                {submitted ? "Read-only" : "Writing..."}
                            </span>
                            <span className={cn(
                                (responses[currentTask.id] || "").split(/\s+/).filter(w => w).length > currentTask.wordLimit.max || (responses[currentTask.id] || "").split(/\s+/).filter(w => w).length < currentTask.wordLimit.min 
                                ? "text-orange-500 font-bold" 
                                : "text-green-600"
                            )}>
                                Words: {(responses[currentTask.id] || "").split(/\s+/).filter(w => w.length > 0).length} / {currentTask.wordLimit.min}-{currentTask.wordLimit.max}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feedback Section (Shown after submit) */}
            {submitted && feedback[currentTask.id] && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Scoring & Feedback</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {feedback[currentTask.id].map((item, idx) => (
                            <div key={idx} className="p-4 flex gap-4">
                                <div className={cn(
                                    "w-1 shrink-0 rounded-full",
                                    item.status === "good" ? "bg-green-500" : item.status === "warning" ? "bg-orange-500" : "bg-red-500"
                                )} />
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-sm text-slate-700">{item.category}</h4>
                                        <Badge variant={item.status === "good" ? "default" : item.status === "error" ? "destructive" : "secondary"}>
                                            {item.score}
                                        </Badge>
                                    </div>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        {item.comments.map((c, cIdx) => (
                                            <li key={cIdx}>• {c}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-900 text-sm italic">
                        <strong>Tip:</strong> This is an automated mock analysis. In the real exam, the AI scores based on complex algorithms including vocabulary diversity and discourse coherence.
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
