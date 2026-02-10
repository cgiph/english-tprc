
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, GripVertical } from "lucide-react";

// --- Types ---

type QuestionType = "fib-rw" | "mcma" | "reorder" | "fib-r" | "mcsa";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  estTime: string;
  content?: string; // HTML content or text
  options?: string[]; // For MC
  correctAnswer?: string[] | string | Record<string, string>;
  items?: { id: string; text: string }[]; // For reorder
  correctOrder?: string[]; // For reorder
  blanks?: { id: string; options: string[]; correct: string }[]; // For FIB-RW
  textWithBlanks?: string; // For FIB-R (contains placeholders)
  dragWords?: string[]; // For FIB-R (word pool)
  correctBlanks?: Record<string, string>; // For FIB-R (slotId -> word)
}

// --- Data ---

const READING_QUESTIONS: Question[] = [
  // Q1: FIB-RW
  {
    id: "q1",
    type: "fib-rw",
    title: "Question 1: Fill in the Blanks (Reading & Writing)",
    estTime: "2 min",
    content: "The proliferation of deepfake technology poses a significant threat to epistemic security. Without robust verification mechanisms, the public's ability to {0} truth from falsehood diminishes, potentially leading to a state of 'reality apathy'. Furthermore, the legal frameworks surrounding digital identity are currently {1} to address these nuances, leaving victims with little recourse.",
    blanks: [
      { id: "0", options: ["discern", "ignore", "fabricate", "abolish"], correct: "discern" },
      { id: "1", options: ["insufficient", "robust", "excessive", "punitive"], correct: "insufficient" }
    ]
  },
  // Q2: FIB-RW
  {
    id: "q2",
    type: "fib-rw",
    title: "Question 2: Fill in the Blanks (Reading & Writing)",
    estTime: "2 min",
    content: "Epigenetics challenges the traditional view of genetic determinism. It suggests that while our DNA code remains {0}, the chemical markers that control gene expression can be altered by environmental factors. This {1} means that lifestyle choices may have heritable consequences for future generations.",
    blanks: [
      { id: "0", options: ["static", "malleable", "hidden", "random"], correct: "static" },
      { id: "1", options: ["plasticity", "rigidity", "fragility", "velocity"], correct: "plasticity" }
    ]
  },
  // Q3: MCMA
  {
    id: "q3",
    type: "mcma",
    title: "Question 3: Multiple Choice (Multiple Answers)",
    estTime: "2 min",
    content: "\"The urbanization of the late 19th century was driven not only by industrialization but also by agricultural mechanization, which reduced the need for rural labor. Consequently, cities became melting pots of culture, though they often suffered from poor sanitation and overcrowding.\"\n\nWhich factors contributed to 19th-century urbanization according to the text?",
    options: [
      "Industrial growth attracting workers",
      "Improved sanitation in cities",
      "Reduced demand for farm workers due to machines",
      "Government mandates moving people to cities"
    ],
    correctAnswer: ["Industrial growth attracting workers", "Reduced demand for farm workers due to machines"]
  },
  // Q4: Reorder
  {
    id: "q4",
    type: "reorder",
    title: "Question 4: Reorder Paragraphs",
    estTime: "2-3 min",
    items: [
      { id: "A", text: "However, this initial optimism was soon tempered by the realization of the complexity of natural language." },
      { id: "B", text: "Early AI researchers believed that machine translation would be solved within a few years." },
      { id: "C", text: "Consequently, the field shifted focus towards statistical models rather than rule-based systems." },
      { id: "D", text: "The ambiguity of context and idiom proved to be an insurmountable hurdle for simple algorithms." }
    ],
    correctOrder: ["B", "A", "D", "C"]
  },
  // Q5: Reorder
  {
    id: "q5",
    type: "reorder",
    title: "Question 5: Reorder Paragraphs",
    estTime: "2-3 min",
    items: [
      { id: "A", text: "These micro-transactions, while individually small, cumulatively represent a massive shift in economic behavior." },
      { id: "B", text: "The digital economy has facilitated the rise of the 'gig worker', allowing for fragmented employment." },
      { id: "C", text: "Regulatory bodies are now struggling to classify these workers under traditional labor laws." },
      { id: "D", text: "Platforms connect freelancers with short-term tasks in real-time." }
    ],
    correctOrder: ["B", "D", "A", "C"]
  },
  // Q6: FIB-R
  {
    id: "q6",
    type: "fib-r",
    title: "Question 6: Fill in the Blanks (Reading)",
    estTime: "2 min",
    content: "The concept of 'dark matter' was introduced to explain the {0} rotational speeds of galaxies. Without this invisible mass, galaxies would {1} apart due to lack of gravitational pull.",
    dragWords: ["anomalous", "fly", "stabilize", "predictable", "drift"],
    correctBlanks: { "0": "anomalous", "1": "fly" }
  },
  // Q7: FIB-R
  {
    id: "q7",
    type: "fib-r",
    title: "Question 7: Fill in the Blanks (Reading)",
    estTime: "2 min",
    content: "Cognitive dissonance occurs when an individual holds two {0} beliefs simultaneously. To resolve this psychological discomfort, the mind often {1} one of the beliefs to restore consistency.",
    dragWords: ["conflicting", "harmonious", "rationalizes", "amplifies", "ignores"],
    correctBlanks: { "0": "conflicting", "1": "rationalizes" }
  },
  // Q8: MCSA
  {
    id: "q8",
    type: "mcsa",
    title: "Question 8: Multiple Choice (Single Answer)",
    estTime: "1 min",
    content: "\"While correlation suggests a relationship between two variables, it does not imply causation. A common fallacy is 'post hoc ergo propter hoc'—assuming that because event Y followed event X, event Y must have been caused by event X.\"\n\nWhat is the main warning in the text?",
    options: [
      "Events that happen together always have a cause-and-effect link.",
      "Temporal sequence does not prove causality.",
      "Variables are rarely related to each other."
    ],
    correctAnswer: "Temporal sequence does not prove causality."
  }
];

// --- Components ---

export function ReadingMockTest() {
  // State for all answers
  // Structure: { [questionId]: answerValue }
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
      const initial: Record<string, any> = {};
      READING_QUESTIONS.forEach(q => {
          if (q.type === "reorder") {
              initial[q.id] = q.items!.map(i => i.id);
          }
      });
      return initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ total: number; max: number } | null>(null);

  // Helper to update answer
  const updateAnswer = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  // Check completion
  const isComplete = READING_QUESTIONS.every(q => {
    const ans = answers[q.id];
    
    if (q.type === "fib-rw") {
      if (!ans) return false;
      // Check if all blanks have values
      return Object.keys(ans).length === q.blanks!.length && Object.values(ans).every(v => !!v);
    }
    if (q.type === "mcma") {
      return ans && ans.length > 0;
    }
    if (q.type === "reorder") {
        return !!ans; // Always true if initialized
    }
    if (q.type === "fib-r") {
       if (!ans) return false;
       return Object.keys(ans).length === Object.keys(q.correctBlanks!).length && Object.values(ans).every(v => !!v);
    }
    if (q.type === "mcsa") {
        return !!ans;
    }
    return false;
  });


  const handleSubmit = () => {
    let totalScore = 0;
    let maxScore = 0;

    READING_QUESTIONS.forEach(q => {
      if (q.type === "fib-rw") {
        const qAns = answers[q.id] || {};
        q.blanks!.forEach(b => {
          maxScore++;
          if (qAns[b.id] === b.correct) totalScore++;
        });
      } else if (q.type === "mcma") {
        // +1 for correct, -1 for incorrect (but min 0 for question) - Simplified for Mock: +1 per correct option found
        const qAns = answers[q.id] || [];
        const correct = q.correctAnswer as string[];
        maxScore += correct.length;
        
        // Simple logic: +1 if correct selected. 
        // Real PTE is +1 correct, -1 incorrect.
        let qScore = 0;
        qAns.forEach((a: string) => {
            if (correct.includes(a)) qScore++;
            else qScore--;
        });
        if (qScore < 0) qScore = 0;
        totalScore += qScore;
      } else if (q.type === "reorder") {
        // Pairs logic is complex. Simplified: +1 if full order matches? 
        // Real PTE: +1 for each correct adjacent pair.
        // Let's implement pair logic.
        const userOrder = answers[q.id] as string[];
        const correctOrder = q.correctOrder!;
        
        // Max score = n - 1
        maxScore += (correctOrder.length - 1);
        
        let qScore = 0;
        for (let i = 0; i < userOrder.length - 1; i++) {
            const pair = userOrder[i] + userOrder[i+1];
            // Check if this pair exists in correct order
            // Find index of first item in correct order
            const idx = correctOrder.indexOf(userOrder[i]);
            if (idx !== -1 && idx < correctOrder.length - 1) {
                if (correctOrder[idx + 1] === userOrder[i+1]) {
                    qScore++;
                }
            }
        }
        totalScore += qScore;

      } else if (q.type === "fib-r") {
        const qAns = answers[q.id] || {};
        const correct = q.correctBlanks!;
        Object.keys(correct).forEach(k => {
            maxScore++;
            if (qAns[k] === correct[k]) totalScore++;
        });
      } else if (q.type === "mcsa") {
        maxScore++;
        if (answers[q.id] === q.correctAnswer) totalScore++;
      }
    });

    setScore({ total: totalScore, max: maxScore });
    setSubmitted(true);
  };

  return (
    <div className="w-full mx-auto p-8 text-left space-y-12 pb-24">
      <div className="bg-slate-900 text-white p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Section 2: Reading Test</h2>
        <p className="text-slate-300">Time Allowed: <strong>13-18 Minutes</strong></p>
        <p className="text-sm text-slate-400 mt-2 italic">Note: In the actual exam, each section is timed individually. Manage your time wisely.</p>
        {score && (
            <div className="mt-4 p-4 bg-indigo-900/50 rounded-lg border border-indigo-500/50">
                <h3 className="text-xl font-bold text-white">Your Score: {score.total} / {score.max}</h3>
            </div>
        )}
      </div>

      {READING_QUESTIONS.map((q, idx) => (
        <div key={q.id} className="space-y-4 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
           <div className="flex items-center justify-between">
              <h4 className="font-bold text-indigo-900">{q.title}</h4>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded border">Est. Time: {q.estTime}</span>
           </div>
           
           <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
              {q.type === "fib-rw" && (
                 <FibRWQuestion 
                    q={q} 
                    value={answers[q.id] || {}} 
                    onChange={(val) => updateAnswer(q.id, val)} 
                    submitted={submitted}
                 />
              )}
              {q.type === "mcma" && (
                 <McmaQuestion 
                    q={q} 
                    value={answers[q.id] || []} 
                    onChange={(val) => updateAnswer(q.id, val)} 
                    submitted={submitted}
                 />
              )}
              {q.type === "reorder" && (
                 <ReorderQuestion 
                    q={q} 
                    value={answers[q.id] || q.items!.map(i => i.id)} 
                    onChange={(val) => updateAnswer(q.id, val)} 
                    submitted={submitted}
                 />
              )}
              {q.type === "fib-r" && (
                 <FibRQuestion 
                    q={q} 
                    value={answers[q.id] || {}} 
                    onChange={(val) => updateAnswer(q.id, val)} 
                    submitted={submitted}
                 />
              )}
              {q.type === "mcsa" && (
                 <McsaQuestion 
                    q={q} 
                    value={answers[q.id] || ""} 
                    onChange={(val) => updateAnswer(q.id, val)} 
                    submitted={submitted}
                 />
              )}
           </div>
        </div>
      ))}

      <div className="mt-12 p-6 bg-slate-50 border-t border-slate-200 rounded-lg flex justify-between items-center gap-4">
         <div className="text-sm text-slate-500 italic">
             {isComplete ? "All questions answered." : "Please answer all questions to submit."}
         </div>
         <div className="flex items-center gap-4">
             {score && (
                 <div className="text-xl font-bold text-indigo-700 mr-4">
                     Score: {score.total} / {score.max}
                 </div>
             )}
             <Button 
                size="lg" 
                onClick={handleSubmit} 
                disabled={!isComplete || submitted}
                className={cn("min-w-[150px]", submitted ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700")}
             >
                {submitted ? "Submitted" : "SUBMIT ANSWERS"}
             </Button>
         </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function FibRWQuestion({ q, value, onChange, submitted }: { q: Question; value: Record<string, string>; onChange: (v: any) => void; submitted: boolean }) {
  // Split content by placeholders {0}, {1}...
  const parts = q.content!.split(/\{(\d+)\}/g);
  
  return (
    <div className="leading-8 text-lg text-slate-800">
      {parts.map((part, i) => {
        if (i % 2 === 1) { // It's a placeholder ID
           const blankId = part;
           const blank = q.blanks!.find(b => b.id === blankId);
           if (!blank) return null;
           
           const isCorrect = submitted && value[blankId] === blank.correct;
           const isWrong = submitted && value[blankId] !== blank.correct;

           return (
             <span key={i} className="inline-block mx-1">
               <select 
                 className={cn(
                    "border-b-2 bg-indigo-50 px-2 py-1 rounded text-sm font-bold text-indigo-900 focus:outline-none transition-colors",
                    isCorrect && "border-green-500 bg-green-50 text-green-900",
                    isWrong && "border-red-500 bg-red-50 text-red-900"
                 )}
                 value={value[blankId] || ""}
                 onChange={(e) => onChange({ ...value, [blankId]: e.target.value })}
                 disabled={submitted}
               >
                 <option value="" disabled hidden></option>
                 {blank.options.map(opt => (
                   <option key={opt} value={opt}>{opt}</option>
                 ))}
               </select>
               {isWrong && (
                   <span className="text-xs text-green-600 font-bold ml-1">({blank.correct})</span>
               )}
             </span>
           );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

function McmaQuestion({ q, value, onChange, submitted }: { q: Question; value: string[]; onChange: (v: string[]) => void; submitted: boolean }) {
  const toggle = (opt: string) => {
    if (submitted) return;
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  const correctAnswers = q.correctAnswer as string[];

  return (
    <div className="space-y-4">
      <p className="font-serif text-slate-700 whitespace-pre-wrap">{q.content}</p>
      <div className="space-y-2">
        {q.options!.map(opt => {
            const isSelected = value.includes(opt);
            const isCorrect = correctAnswers.includes(opt);
            
            let borderClass = "border-slate-200 hover:bg-slate-50";
            if (submitted) {
                if (isSelected && isCorrect) borderClass = "border-green-500 bg-green-50";
                else if (isSelected && !isCorrect) borderClass = "border-red-500 bg-red-50";
                else if (!isSelected && isCorrect) borderClass = "border-green-500 border-dashed bg-green-50/50";
            } else if (isSelected) {
                borderClass = "border-indigo-500 bg-indigo-50";
            }

            return (
              <div 
                key={opt} 
                className={cn("flex items-center gap-3 p-3 border rounded cursor-pointer transition-all", borderClass)}
                onClick={() => toggle(opt)}
              >
                <div className={cn("w-5 h-5 border rounded flex items-center justify-center bg-white", isSelected && "bg-indigo-600 border-indigo-600")}>
                   {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">{opt}</span>
              </div>
            );
        })}
      </div>
    </div>
  );
}

function ReorderQuestion({ q, value, onChange, submitted }: { q: Question; value: string[]; onChange: (v: string[]) => void; submitted: boolean }) {
  // Simple swap implementation for DnD-less environment (or minimal DnD)
  // Let's use simple up/down buttons for robustness without extra libs
  
  const move = (idx: number, dir: -1 | 1) => {
      if (submitted) return;
      const newValue = [...value];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= newValue.length) return;
      
      [newValue[idx], newValue[targetIdx]] = [newValue[targetIdx], newValue[idx]];
      onChange(newValue);
  };

  // Calculate pairs score for display
  const getPairStatus = (idx: number) => {
      if (!submitted || idx === value.length - 1) return null;
      const current = value[idx];
      const next = value[idx + 1];
      const correctOrder = q.correctOrder!;
      
      // Check if pair exists in correct order
      const correctIdx = correctOrder.indexOf(current);
      const isPairCorrect = correctIdx !== -1 && correctIdx < correctOrder.length - 1 && correctOrder[correctIdx + 1] === next;
      
      return isPairCorrect ? "correct" : "incorrect";
  };

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <span>Source Paragraphs</span>
          <span>Target Order</span>
       </div>
       <div className="space-y-2">
          {value.map((itemId, idx) => {
             const item = q.items!.find(i => i.id === itemId)!;
             const pairStatus = getPairStatus(idx);
             
             return (
               <div key={itemId} className="relative">
                   <div className={cn(
                       "bg-white p-3 pl-10 border rounded shadow-sm flex items-start gap-3 transition-all", 
                       submitted ? "border-slate-200" : "hover:border-indigo-300"
                   )}>
                      <div className="absolute left-3 top-3 flex flex-col gap-1 text-slate-400">
                          <button onClick={() => move(idx, -1)} disabled={idx === 0 || submitted} className="hover:text-indigo-600 disabled:opacity-30">▲</button>
                          <button onClick={() => move(idx, 1)} disabled={idx === value.length - 1 || submitted} className="hover:text-indigo-600 disabled:opacity-30">▼</button>
                      </div>
                      <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs mt-0.5">{item.id}</span>
                      <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                   </div>
                   {/* Connection Line Indicator for pairs */}
                   {pairStatus && (
                       <div className={cn(
                           "absolute left-6 -bottom-3 w-1 h-4 z-10", 
                           pairStatus === "correct" ? "bg-green-500" : "bg-transparent"
                       )} />
                   )}
               </div>
             );
          })}
       </div>
       {submitted && (
           <div className="mt-4 p-3 bg-slate-100 rounded text-xs font-mono text-slate-600">
               Correct Order: {q.correctOrder!.join(" → ")}
           </div>
       )}
    </div>
  );
}

function FibRQuestion({ q, value, onChange, submitted }: { q: Question; value: Record<string, string>; onChange: (v: any) => void; submitted: boolean }) {
  // Simplified Drag and Drop: Click word in pool, then click slot.
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handlePoolClick = (word: string) => {
      if (submitted) return;
      if (selectedWord === word) setSelectedWord(null);
      else setSelectedWord(word);
  };

  const handleSlotClick = (slotId: string) => {
      if (submitted) return;
      if (selectedWord) {
          // Place word
          onChange({ ...value, [slotId]: selectedWord });
          setSelectedWord(null);
      } else if (value[slotId]) {
          // Clear slot
          const newValue = { ...value };
          delete newValue[slotId];
          onChange(newValue);
      }
  };

  // Filter out used words from pool (unless we want them reusable? Usually in PTE they are moved, so consumed)
  // Let's assume consumed.
  const usedWords = Object.values(value);
  const poolWords = q.dragWords!.filter(w => !usedWords.includes(w) || (selectedWord === w)); // Keep selected visible

  const parts = q.content!.split(/\{(\d+)\}/g);

  return (
    <div className="space-y-6">
       <div className="leading-9 text-lg text-slate-800 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          {parts.map((part, i) => {
            if (i % 2 === 1) { 
               const slotId = part;
               const filledWord = value[slotId];
               const isCorrect = submitted && filledWord === q.correctBlanks![slotId];
               
               return (
                 <span 
                    key={i} 
                    onClick={() => handleSlotClick(slotId)}
                    className={cn(
                        "inline-flex items-center justify-center mx-1 min-w-[100px] h-8 border-b-2 px-3 py-1 rounded text-sm font-bold cursor-pointer transition-all align-middle",
                        filledWord ? "bg-indigo-100 text-indigo-900 border-indigo-500" : "bg-white border-indigo-200 hover:bg-indigo-50",
                        selectedWord && !filledWord && !submitted && "ring-2 ring-indigo-400 ring-offset-1 animate-pulse",
                        submitted && isCorrect && "bg-green-100 border-green-500 text-green-900",
                        submitted && !isCorrect && "bg-red-100 border-red-500 text-red-900"
                    )}
                 >
                    {filledWord || ""}
                 </span>
               );
            }
            return <span key={i}>{part}</span>;
          })}
       </div>

       {/* Word Pool */}
       <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-3">
          {poolWords.map(word => (
              <button
                 key={word}
                 onClick={() => handlePoolClick(word)}
                 disabled={submitted}
                 className={cn(
                     "px-4 py-2 rounded-lg border shadow-sm text-sm font-medium transition-all transform hover:-translate-y-0.5 active:translate-y-0",
                     selectedWord === word 
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-indigo-200 ring-2 ring-indigo-300 ring-offset-1" 
                        : "bg-white text-slate-700 border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                 )}
              >
                 {word}
              </button>
          ))}
          {poolWords.length === 0 && !submitted && (
              <span className="text-xs text-slate-400 italic">All words placed. Click a slot to remove.</span>
          )}
       </div>
       
       {submitted && (
           <div className="text-xs text-slate-500">
               Correct Answers: {Object.entries(q.correctBlanks!).map(([k, v]) => `${v}`).join(", ")}
           </div>
       )}
    </div>
  );
}

function McsaQuestion({ q, value, onChange, submitted }: { q: Question; value: string; onChange: (v: string) => void; submitted: boolean }) {
    const isCorrect = submitted && value === q.correctAnswer;
    
    return (
        <div className="space-y-4">
          <p className="font-serif text-slate-700 whitespace-pre-wrap">{q.content}</p>
          <div className="space-y-2">
            {q.options!.map(opt => {
                const isSelected = value === opt;
                
                let borderClass = "border-slate-200 hover:bg-slate-50";
                if (submitted) {
                    if (opt === q.correctAnswer) borderClass = "border-green-500 bg-green-50";
                    else if (isSelected) borderClass = "border-red-500 bg-red-50";
                } else if (isSelected) {
                    borderClass = "border-indigo-500 bg-indigo-50";
                }
    
                return (
                  <div 
                    key={opt} 
                    className={cn("flex items-center gap-3 p-3 border rounded cursor-pointer transition-all", borderClass)}
                    onClick={() => !submitted && onChange(opt)}
                  >
                    <div className={cn("w-5 h-5 border rounded-full flex items-center justify-center bg-white", isSelected && "border-indigo-600")}>
                       {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{opt}</span>
                  </div>
                );
            })}
          </div>
        </div>
      );
}
