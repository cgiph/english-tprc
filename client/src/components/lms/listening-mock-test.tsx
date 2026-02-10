
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayCircle, PauseCircle, Clock, Volume2, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// --- Types ---

type QuestionType = "sst" | "mcma-l" | "fib-l" | "hcs" | "mcsa-l" | "smw" | "hiw" | "wfd";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  transcript: string; // Used for TTS
  displayTranscript?: string; // For HIW (interactive) or FIB-L (with blanks)
  options?: string[]; // For MC/HCS/SMW
  correctAnswer?: string | string[] | Record<string, string> | number[]; 
  // correct for HIW is array of indices
  // correct for FIB-L is map of blank_id -> word
  blanks?: { id: string; correct: string }[];
  missingWordAtEnd?: boolean; // For SMW (stop TTS early)
}

// --- Data ---

const LISTENING_QUESTIONS: Question[] = [
  // 1. Summarize Spoken Text
  {
    id: "sst-1",
    type: "sst",
    title: "Summarize Spoken Text",
    transcript: "Technological singularity poses a unique challenge to future governance. As artificial intelligence surpasses human cognitive capabilities, the decision-making interval—the time between a problem arising and its solution—will shrink to nanoseconds. Traditional bureaucracies, designed for the speed of paper and human debate, will be hopelessly outpaced. We must therefore conceive of 'algorithmic governance', where core values are encoded into the system itself, allowing for instantaneous yet ethical adjudication of complex issues.",
    correctAnswer: "Keywords: Technological singularity, artificial intelligence, cognitive capabilities, governance, bureaucracies, algorithmic governance, ethical adjudication." 
    // Scoring in SST is complex (content, form, grammar, vocab). We'll do simple keyword match for mock.
  },
  
  // 2. MCMA
  {
    id: "mcma-l-1",
    type: "mcma-l",
    title: "Multiple Choice (Multiple Answers)",
    transcript: "The Antarctic Treaty System is often cited as a model for international cooperation. However, its stability relies on the suspension of territorial claims, a mechanism that may be strained by resource scarcity. While the treaty prohibits mining, the definition of 'scientific research' remains purposefully vague, allowing nations to prospect for minerals under the guise of geology.",
    options: [
        "The treaty permanently resolves all territorial disputes.",
        "Resource scarcity could threaten the treaty's stability.",
        "Mining is explicitly encouraged for economic growth.",
        "Scientific research is sometimes used as a cover for prospecting."
    ],
    correctAnswer: ["Resource scarcity could threaten the treaty's stability.", "Scientific research is sometimes used as a cover for prospecting."]
  },

  // 3. FIB-L (Difficult)
  {
    id: "fib-l-1",
    type: "fib-l",
    title: "Fill in the Blanks (Listening)",
    transcript: "Neuroplasticity is not merely a developmental phase but a lifelong attribute. The brain's architecture is constantly remodeled by synaptic pruning and strengthening. This adaptability, while beneficial for learning, also makes us vulnerable to maladaptive patterns, such as chronic pain or addiction, which can be viewed as the brain 'learning' a pathology.",
    displayTranscript: "Neuroplasticity is not merely a developmental phase but a lifelong {0}. The brain's architecture is constantly remodeled by synaptic {1} and strengthening. This adaptability, while beneficial for learning, also makes us vulnerable to {2} patterns, such as chronic pain or addiction, which can be viewed as the brain 'learning' a {3}.",
    blanks: [
        { id: "0", correct: "attribute" },
        { id: "1", correct: "pruning" },
        { id: "2", correct: "maladaptive" },
        { id: "3", correct: "pathology" }
    ]
  },
  {
    id: "fib-l-2",
    type: "fib-l",
    title: "Fill in the Blanks (Listening)",
    transcript: "The economic principle of comparative advantage suggests that trade can benefit all parties even if one is more efficient at producing everything. However, this model assumes perfect factor mobility and ignores the transitional costs of industrial dislocation. In reality, the friction of shifting labor from declining sectors to emerging ones often leads to prolonged structural unemployment.",
    displayTranscript: "The economic principle of comparative advantage suggests that trade can benefit all parties even if one is more {0} at producing everything. However, this model assumes perfect factor {1} and ignores the transitional costs of industrial {2}. In reality, the friction of shifting labor from declining sectors to emerging ones often leads to prolonged {3} unemployment.",
    blanks: [
        { id: "0", correct: "efficient" },
        { id: "1", correct: "mobility" },
        { id: "2", correct: "dislocation" },
        { id: "3", correct: "structural" }
    ]
  },

  // 4. HCS (Difficult)
  {
    id: "hcs-1",
    type: "hcs",
    title: "Highlight Correct Summary",
    transcript: "Dark energy, unlike dark matter, does not clump together. It is a smooth, pervasive field that exerts a negative pressure, driving the accelerated expansion of the universe. While dark matter pulls things together via gravity, dark energy pushes them apart. The interplay between these two invisible forces will determine the ultimate fate of the cosmos—whether it ends in a 'Big Crunch' or a 'Big Rip'.",
    options: [
        "Dark energy and dark matter are essentially the same force, both pulling the universe together towards a Big Crunch.",
        "Dark energy is a clumping force that counteracts gravity, while dark matter is a smooth field that accelerates expansion.",
        "Dark energy is a uniform field causing acceleration via negative pressure, contrasting with dark matter's gravitational pull, with their balance determining the universe's fate.",
        "The universe is slowing down its expansion due to the combined effects of dark energy and dark matter."
    ],
    correctAnswer: "Dark energy is a uniform field causing acceleration via negative pressure, contrasting with dark matter's gravitational pull, with their balance determining the universe's fate."
  },

  // 5. MCSA
  {
    id: "mcsa-l-1",
    type: "mcsa-l",
    title: "Multiple Choice (Single Answer)",
    transcript: "While cryptography secures data, steganography hides its very existence. A message encrypted is like a locked safe in a room; everyone knows it's there. A message hidden via steganography is like a safe hidden behind a painting; no one even thinks to look for it.",
    options: [
        "Steganography is a stronger form of encryption.",
        "Cryptography hides the existence of the message.",
        "Steganography conceals the presence of the data itself.",
        "Both methods are obsolete in modern security."
    ],
    correctAnswer: "Steganography conceals the presence of the data itself."
  },

  // 6. SMW
  {
    id: "smw-1",
    type: "smw",
    title: "Select Missing Word",
    transcript: "In the study of linguistics, prescriptivism dictates how language should be used based on established rules. Descriptivism, on the other hand, observes how language is actually used in daily life. While prescriptivists might criticize slang as an error, descriptivists view it as evidence of language...",
    missingWordAtEnd: true,
    options: [
        "stagnation",
        "evolution",
        "regression",
        "collapse"
    ],
    correctAnswer: "evolution"
  },

  // 7. HIW (Difficult)
  {
    id: "hiw-1",
    type: "hiw",
    title: "Highlight Incorrect Words",
    transcript: "The history of medicine is replete with accidental discoveries. Penicillin was found in a contaminated petri dish. X-rays were noticed when a cathode tube caused a nearby screen to glow. These serendipitous events remind us that while rigorous methodology is crucial, we must remain open to the unexpected.",
    // The "display" version contains the errors.
    displayTranscript: "The history of medicine is complete with accidental discoveries. Penicillin was found in a contaminated petri dish. X-rays were noticed when a cathode tube caused a nearby screen to blow. These serendipitous events remind us that while rigorous methodology is crucial, we must remain open to the undetected.",
    // Errors: complete->replete(0), blow->glow(4), undetected->unexpected(7) 
    // Let's map word indices.
    // "The history of medicine is [complete]..."
    // Words: The(0) history(1) of(2) medicine(3) is(4) complete(5)...
    // Let's manually list the incorrect words for checking.
    correctAnswer: [5, 27, 43] // Indices of incorrect words in the split string
  },
  {
    id: "hiw-2",
    type: "hiw",
    title: "Highlight Incorrect Words",
    transcript: "Quantum entanglement describes a phenomenon where particles remain connected regardless of distance. A change in the state of one instantly affects the other. Einstein famously derided this as 'spooky action at a distance', yet experiments have consistently validated its reality.",
    displayTranscript: "Quantum entanglement describes a phenomenon where particles remain connected regardless of distance. A change in the state of one instantly affects the other. Einstein famously derided this as 'spooky action at a distance', yet experiments have consistently violated its reality.",
    // violated -> validated
    correctAnswer: [38]
  },

  // 8. WFD (Difficult)
  {
    id: "wfd-1",
    type: "wfd",
    title: "Write From Dictation",
    transcript: "The accompanying references should be cited in the bibliography.",
    correctAnswer: "The accompanying references should be cited in the bibliography."
  },
  {
    id: "wfd-2",
    type: "wfd",
    title: "Write From Dictation",
    transcript: "Statistical results should be expressed in terms of probability.",
    correctAnswer: "Statistical results should be expressed in terms of probability."
  }
];

// --- Helper Components ---

function AudioPlayer({ 
  text, 
  onEnd, 
  onStart,
  stopAtEnd = false 
}: { 
  text: string; 
  onEnd?: () => void; 
  onStart?: () => void;
  stopAtEnd?: boolean 
}) {
    const [playing, setPlaying] = useState(false);
    
    const togglePlay = () => {
        if (playing) {
            window.speechSynthesis.cancel();
            setPlaying(false);
        } else {
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.0;
            // Provide a slightly more natural voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes("Google")) || voices[0];
            if (preferred) u.voice = preferred;

            u.onstart = () => {
                setPlaying(true);
                if (onStart) onStart();
            };

            u.onend = () => {
                setPlaying(false);
                if (stopAtEnd && onEnd) onEnd();
            };
            
            // If stopAtEnd is true (for Missing Word), we need to actually cut it off? 
            // The transcript for SMW usually *omits* the last word in the text passed to this player.
            // So we just play what is given.
            
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
            // setPlaying(true); // Moved to onstart
        }
    };
    
    // Cleanup
    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    return (
        <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200 w-fit mb-4">
            <Button 
                size="icon" 
                variant="ghost" 
                onClick={togglePlay}
                className={cn("h-10 w-10 rounded-full", playing ? "text-indigo-600 bg-indigo-100" : "text-slate-600 hover:bg-slate-200")}
            >
                {playing ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
            </Button>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audio Status</span>
                <span className="text-sm font-medium text-slate-800">{playing ? "Playing..." : "Ready to Play"}</span>
            </div>
            {playing && (
                 <div className="flex gap-0.5 items-end h-4 ml-2">
                    <div className="w-1 bg-indigo-500 animate-[pulse_0.5s_ease-in-out_infinite] h-2"></div>
                    <div className="w-1 bg-indigo-500 animate-[pulse_0.7s_ease-in-out_infinite] h-4"></div>
                    <div className="w-1 bg-indigo-500 animate-[pulse_0.6s_ease-in-out_infinite] h-3"></div>
                 </div>
            )}
        </div>
    );
}

function QuestionTimer({ 
    startTrigger, 
    initialSeconds 
}: { 
    startTrigger: boolean; 
    initialSeconds: number 
}) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        if (startTrigger && !active && timeLeft === initialSeconds) {
            setActive(true);
        }
    }, [startTrigger]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (active && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setActive(false);
        }
        return () => clearInterval(interval);
    }, [active, timeLeft]);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return (
        <div className={cn(
            "flex items-center gap-2 font-mono text-sm mb-2 transition-colors",
            timeLeft < 60 ? "text-red-600 animate-pulse" : "text-slate-600"
        )}>
            <Clock className="w-4 h-4" />
            <span>
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')} (Simulated)
            </span>
        </div>
    );
}

// --- Main Component ---

export function ListeningMockTest() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ total: number; max: number } | null>(null);
  
  // Timers
  const [sstAudioStarted, setSstAudioStarted] = useState<Record<string, boolean>>({});
  const [groupTimerStarted, setGroupTimerStarted] = useState(false);

  const handleAudioStart = (qId: string, type: QuestionType) => {
      if (type === "sst") {
          setSstAudioStarted(prev => ({ ...prev, [qId]: true }));
      } else {
          // For any other type, start the group timer if not already started
          if (!groupTimerStarted) {
              setGroupTimerStarted(true);
          }
      }
  };

  const updateAnswer = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
      let total = 0;
      let max = 0;

      LISTENING_QUESTIONS.forEach(q => {
          const ans = answers[q.id];

          if (q.type === "sst") {
             // Mock score: 1 point if > 10 words + 1 point per keyword
             max += 10;
             if (ans && ans.length > 50) total += 5; // Length check
             // Simple keyword check
             const keywords = (q.correctAnswer as string).replace("Keywords: ", "").split(", ");
             let hits = 0;
             if (ans) {
                 keywords.forEach(k => {
                     if (ans.toLowerCase().includes(k.toLowerCase())) hits++;
                 });
             }
             if (hits > 3) total += 5;
             else total += hits;
             if (total > 10) total = 10;

          } else if (q.type === "mcma-l") {
             const correct = q.correctAnswer as string[];
             max += correct.length;
             const userAns = ans || [];
             let qScore = 0;
             userAns.forEach((a: string) => {
                 if (correct.includes(a)) qScore++;
                 else qScore--;
             });
             if (qScore < 0) qScore = 0;
             total += qScore;

          } else if (q.type === "fib-l") {
             const blanks = q.blanks!;
             max += blanks.length;
             const userAns = ans || {};
             blanks.forEach(b => {
                 if (userAns[b.id]?.toLowerCase().trim() === b.correct.toLowerCase()) total++;
             });

          } else if (q.type === "hcs" || q.type === "mcsa-l" || q.type === "smw") {
             max += 1;
             if (ans === q.correctAnswer) total++;

          } else if (q.type === "hiw") {
             const correctIndices = q.correctAnswer as number[];
             max += correctIndices.length;
             const userIndices = ans || [];
             
             // +1 correct, -1 incorrect
             let qScore = 0;
             userIndices.forEach((idx: number) => {
                 if (correctIndices.includes(idx)) qScore++;
                 else qScore--;
             });
             if (qScore < 0) qScore = 0;
             total += qScore;

          } else if (q.type === "wfd") {
             const correctWords = (q.correctAnswer as string).toLowerCase().split(" "); // Simplified punct
             max += correctWords.length;
             
             if (ans) {
                 const userWords = ans.toLowerCase().split(" ");
                 // Simple match count
                 let matchCount = 0;
                 // Very naive matching (bag of words)
                 const userSet = new Set(userWords);
                 correctWords.forEach(w => {
                     const cleanW = w.replace(/[.,]/g, "");
                     // Check if any user word matches
                     if (userWords.some(uw => uw.replace(/[.,]/g, "") === cleanW)) matchCount++;
                 });
                 total += matchCount;
             }
          }
      });
      
      setScore({ total, max });
      setSubmitted(true);
  };

  return (
    <div className="w-full mx-auto p-8 text-left space-y-12 pb-24 relative">
      <div className="bg-slate-900 text-white p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Section 3: Listening Test</h2>
        <p className="text-slate-300">Contains: SST, MCMA, FIB-L, HCS, MCSA, SMW, HIW, WFD</p>
        <p className="text-sm text-slate-400 mt-2 italic">Audio will play automatically (simulated). Manage your time.</p>
        {score && (
            <div className="mt-4 p-4 bg-indigo-900/50 rounded-lg border border-indigo-500/50">
                <h3 className="text-xl font-bold text-white">Your Score: {score.total} / {score.max}</h3>
            </div>
        )}
      </div>
      
      {/* Sticky Group Timer Header */}
      {groupTimerStarted && !submitted && (
         <div className="sticky top-20 z-10 bg-white/95 backdrop-blur shadow-md p-4 rounded-lg border border-slate-200 flex justify-between items-center animate-in slide-in-from-top-2">
            <span className="font-bold text-slate-800">Part 2: Listening & Writing</span>
            <QuestionTimer 
                  startTrigger={true} 
                  initialSeconds={1200} // 20 minutes for the group
            />
         </div>
      )}

      {LISTENING_QUESTIONS.map((q, i) => (
          <div key={q.id} className="space-y-4 pt-8 border-t border-slate-200 first:border-0 first:pt-0">
              <div className="flex items-center justify-between">
                  <h4 className="font-bold text-indigo-900 text-lg">{q.title}</h4>
              </div>

              {/* Individual Timer ONLY for SST */}
              {q.type === "sst" && (
                  <QuestionTimer 
                      startTrigger={!!sstAudioStarted[q.id]} 
                      initialSeconds={600} // 10 mins for SST
                  />
              )}

              <AudioPlayer 
                  text={q.transcript} 
                  onStart={() => handleAudioStart(q.id, q.type)}
              />

              <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
                  {/* SST */}
                  {q.type === "sst" && (
                      <div className="space-y-2">
                          <label className="text-sm text-slate-600">Summarize the spoken text in 50-70 words.</label>
                          <Textarea 
                              className="min-h-[150px]" 
                              placeholder="Type your summary here..."
                              value={answers[q.id] || ""}
                              onChange={e => updateAnswer(q.id, e.target.value)}
                              disabled={submitted}
                          />
                          <div className="text-right text-xs text-slate-400">
                              Word Count: {(answers[q.id] || "").split(/\s+/).filter((w:string) => w.length > 0).length}
                          </div>
                      </div>
                  )}

                  {/* MCMA / MCSA / SMW / HCS */}
                  {(q.type === "mcma-l" || q.type === "mcsa-l" || q.type === "smw" || q.type === "hcs") && (
                      <div className="space-y-3">
                          <p className="font-medium text-slate-700 mb-2">Select the correct option(s):</p>
                          {q.options!.map((opt, idx) => {
                              const isMultiple = q.type === "mcma-l";
                              const isSelected = isMultiple 
                                  ? (answers[q.id] || []).includes(opt)
                                  : answers[q.id] === opt;
                              
                              let style = "border-slate-200 hover:bg-slate-50";
                              if (submitted) {
                                  // Highlight correct/incorrect
                                  if (isMultiple) {
                                      const correct = q.correctAnswer as string[];
                                      if (correct.includes(opt)) style = "border-green-500 bg-green-50";
                                      else if (isSelected) style = "border-red-500 bg-red-50";
                                  } else {
                                      if (opt === q.correctAnswer) style = "border-green-500 bg-green-50";
                                      else if (isSelected) style = "border-red-500 bg-red-50";
                                  }
                              } else if (isSelected) {
                                  style = "border-indigo-500 bg-indigo-50";
                              }

                              return (
                                  <div 
                                      key={idx}
                                      onClick={() => {
                                          if (submitted) return;
                                          if (isMultiple) {
                                              const curr = answers[q.id] || [];
                                              if (curr.includes(opt)) updateAnswer(q.id, curr.filter((x:string) => x !== opt));
                                              else updateAnswer(q.id, [...curr, opt]);
                                          } else {
                                              updateAnswer(q.id, opt);
                                          }
                                      }}
                                      className={cn("p-4 border rounded cursor-pointer transition-all", style)}
                                  >
                                      {opt}
                                  </div>
                              )
                          })}
                      </div>
                  )}

                  {/* FIB-L */}
                  {q.type === "fib-l" && (
                      <div className="leading-8 text-lg">
                          {q.displayTranscript!.split(/\{(\d+)\}/).map((part, idx) => {
                              if (idx % 2 === 1) {
                                  const blankId = part;
                                  const val = (answers[q.id] || {})[blankId] || "";
                                  const correct = q.blanks!.find(b => b.id === blankId)?.correct;
                                  
                                  const isCorrect = submitted && val.toLowerCase().trim() === correct?.toLowerCase();
                                  
                                  return (
                                      <span key={idx} className="mx-1 inline-block">
                                          <input 
                                              type="text" 
                                              className={cn(
                                                  "border-b-2 bg-slate-50 px-2 py-0 w-32 text-center focus:outline-none focus:border-indigo-500 transition-colors",
                                                  submitted && isCorrect && "border-green-500 bg-green-50 text-green-900",
                                                  submitted && !isCorrect && "border-red-500 bg-red-50 text-red-900"
                                              )}
                                              value={val}
                                              onChange={e => updateAnswer(q.id, { ...(answers[q.id] || {}), [blankId]: e.target.value })}
                                              disabled={submitted}
                                          />
                                          {submitted && !isCorrect && (
                                              <span className="text-xs text-green-600 block text-center font-bold">({correct})</span>
                                          )}
                                      </span>
                                  )
                              }
                              return <span key={idx}>{part}</span>
                          })}
                      </div>
                  )}

                  {/* HIW */}
                  {q.type === "hiw" && (
                      <div className="leading-8 text-lg">
                          {q.displayTranscript!.split(" ").map((word, idx) => {
                              const isSelected = (answers[q.id] || []).includes(idx);
                              const correctIndices = q.correctAnswer as number[];
                              const isActuallyError = correctIndices.includes(idx);

                              let style = "hover:bg-indigo-100 cursor-pointer rounded px-1 transition-colors";
                              if (submitted) {
                                  if (isActuallyError && isSelected) style = "bg-green-200 text-green-900 line-through decoration-red-500"; // Correctly identified error
                                  else if (isActuallyError && !isSelected) style = "bg-yellow-200 border-b-2 border-red-500"; // Missed error
                                  else if (!isActuallyError && isSelected) style = "bg-red-200"; // False positive
                              } else if (isSelected) {
                                  style = "bg-yellow-200";
                              }

                              return (
                                  <span 
                                      key={idx} 
                                      onClick={() => {
                                          if (submitted) return;
                                          const curr = answers[q.id] || [];
                                          if (curr.includes(idx)) updateAnswer(q.id, curr.filter((x:number) => x !== idx));
                                          else updateAnswer(q.id, [...curr, idx]);
                                      }}
                                      className={cn("inline-block mr-1", style)}
                                  >
                                      {word}
                                  </span>
                              );
                          })}
                      </div>
                  )}

                  {/* WFD */}
                  {q.type === "wfd" && (
                      <div className="space-y-2">
                          <label className="text-sm text-slate-600">Type the sentence exactly as you hear it:</label>
                          <input 
                              type="text"
                              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Type here..."
                              value={answers[q.id] || ""}
                              onChange={e => updateAnswer(q.id, e.target.value)}
                              disabled={submitted}
                          />
                          {submitted && (
                              <div className="mt-2 text-sm">
                                  <span className="font-bold text-green-700">Correct: </span>
                                  <span className="text-slate-700">{q.correctAnswer as string}</span>
                              </div>
                          )}
                      </div>
                  )}

              </div>
          </div>
      ))}

      <div className="mt-12 p-6 bg-slate-50 border-t border-slate-200 rounded-lg flex justify-between items-center gap-4">
         <div className="text-sm text-slate-500 italic">
             Ready to submit?
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
                disabled={submitted}
                className={cn("min-w-[150px]", submitted ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700")}
             >
                {submitted ? "Submitted" : "SUBMIT LISTENING TEST"}
             </Button>
         </div>
      </div>

    </div>
  );
}
