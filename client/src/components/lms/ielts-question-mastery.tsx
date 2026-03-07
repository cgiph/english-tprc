import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function IeltsQuestionMastery({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [tfng1, setTfng1] = useState<string>("");
  const [tfng2, setTfng2] = useState<string>("");
  const [tfng3, setTfng3] = useState<string>("");
  
  const [gap4, setGap4] = useState<string>("");
  const [gap5, setGap5] = useState<string>("");
  const [gap6, setGap6] = useState<string>("");

  const [match7, setMatch7] = useState<string>("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const checkAnswers = () => {
    let currentScore = 0;
    if (tfng1 === "False") currentScore++;
    if (tfng2 === "Not Given") currentScore++;
    if (tfng3 === "True") currentScore++;
    
    if (gap4.trim().toLowerCase().includes("stacked layers") || gap4.trim().toLowerCase() === "layers") currentScore++;
    if (gap5.trim().toLowerCase().includes("initial setup costs") || gap5.trim().toLowerCase() === "costs" || gap5.trim().toLowerCase() === "setup costs") currentScore++;
    if (gap6.trim().toLowerCase().includes("weather") || gap6.trim().toLowerCase() === "season" || gap6.trim().toLowerCase() === "changing climate") currentScore++;

    if (match7.trim().toLowerCase().includes("vertical") || match7.trim().toLowerCase().includes("hydroponic") || match7.trim().toLowerCase().includes("traditional") || match7.trim().toLowerCase().includes("conventional") || match7.trim() !== "") currentScore++; // Flexible for matching, let's say they just write "Yes" or anything reasonable, or specifically "Paragraph 1". The text is just one paragraph. Let's accept any non-empty answer or "1".
    
    setScore(currentScore);
    setHasSubmitted(true);
    
    // Mark as complete regardless of score for practice purposes, or maybe only if they get a good score? Let's just complete it on submit.
    onComplete(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] py-8 w-full max-w-5xl mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 text-white">
          <h2 className="text-2xl font-bold">Module 3: Question-type Mastery Practice</h2>
          <p className="text-slate-400 mt-1">Complete all three sections below.</p>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: TFNG */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-6">Part 1: True / False / Not Given</h3>
             <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <p className="text-sm text-blue-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Focus: Locating "proof" sentences and identifying contradictions.</p>
                    <p className="text-xs text-blue-600 mt-1">Self-Review Tip: If the text says the opposite, it’s False. If the text doesn't mention the specific detail (like "nutrition"), it’s Not Given.</p>
                </div>

                <div className="space-y-3">
                   <p className="font-medium text-slate-700">1. Vertical farming requires more water than traditional farming methods.</p>
                   <RadioGroup value={tfng1} onValueChange={setTfng1} disabled={hasSubmitted} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="True" id="q1-t" />
                        <Label htmlFor="q1-t">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="False" id="q1-f" />
                        <Label htmlFor="q1-f">False</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Not Given" id="q1-ng" />
                        <Label htmlFor="q1-ng">Not Given</Label>
                      </div>
                   </RadioGroup>
                   {hasSubmitted && (
                       <p className={cn("text-sm font-bold mt-2", tfng1 === "False" ? "text-green-600" : "text-red-500")}>
                           {tfng1 === "False" ? <CheckCircle2 className="inline w-4 h-4 mr-1" /> : <XCircle className="inline w-4 h-4 mr-1" />}
                           Correct Answer: False (The text says they recycle nearly 95% of water used, an improvement over wasteful runoff in conventional farming)
                       </p>
                   )}
                </div>

                <div className="space-y-3">
                   <p className="font-medium text-slate-700">2. Vegetables grown in vertical farms are more nutritious than those grown in soil.</p>
                   <RadioGroup value={tfng2} onValueChange={setTfng2} disabled={hasSubmitted} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="True" id="q2-t" />
                        <Label htmlFor="q2-t">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="False" id="q2-f" />
                        <Label htmlFor="q2-f">False</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Not Given" id="q2-ng" />
                        <Label htmlFor="q2-ng">Not Given</Label>
                      </div>
                   </RadioGroup>
                   {hasSubmitted && (
                       <p className={cn("text-sm font-bold mt-2", tfng2 === "Not Given" ? "text-green-600" : "text-red-500")}>
                           {tfng2 === "Not Given" ? <CheckCircle2 className="inline w-4 h-4 mr-1" /> : <XCircle className="inline w-4 h-4 mr-1" />}
                           Correct Answer: Not Given (Nutrition is not mentioned in the text)
                       </p>
                   )}
                </div>

                <div className="space-y-3">
                   <p className="font-medium text-slate-700">3. The location of vertical farms can help decrease greenhouse gas emissions from transport.</p>
                   <RadioGroup value={tfng3} onValueChange={setTfng3} disabled={hasSubmitted} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="True" id="q3-t" />
                        <Label htmlFor="q3-t">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="False" id="q3-f" />
                        <Label htmlFor="q3-f">False</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Not Given" id="q3-ng" />
                        <Label htmlFor="q3-ng">Not Given</Label>
                      </div>
                   </RadioGroup>
                   {hasSubmitted && (
                       <p className={cn("text-sm font-bold mt-2", tfng3 === "True" ? "text-green-600" : "text-red-500")}>
                           {tfng3 === "True" ? <CheckCircle2 className="inline w-4 h-4 mr-1" /> : <XCircle className="inline w-4 h-4 mr-1" />}
                           Correct Answer: True (The text says it reduces carbon footprint associated with transporting produce from rural to urban centers)
                       </p>
                   )}
                </div>
             </div>
          </section>

          {/* Section 2: Fill-in-the-Gaps */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-6">Part 2: Fill-in-the-Gaps (Summary Completion)</h3>
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
                <p className="text-sm text-amber-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Focus: Identifying paraphrases.</p>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 leading-loose text-lg text-slate-700">
                Vertical farming involves cultivating plants in 
                <span className="inline-block mx-2">
                    <span className="text-sm text-slate-400 mr-1">(4)</span>
                    <Input className="inline-block w-40 h-8 border-slate-300" disabled={hasSubmitted} value={gap4} onChange={(e) => setGap4(e.target.value)} />
                </span> 
                indoors. Although the 
                <span className="inline-block mx-2">
                    <span className="text-sm text-slate-400 mr-1">(5)</span>
                    <Input className="inline-block w-40 h-8 border-slate-300" disabled={hasSubmitted} value={gap5} onChange={(e) => setGap5(e.target.value)} />
                </span>
                of building these systems is high, they provide a consistent food supply because they are not affected by 
                <span className="inline-block mx-2">
                    <span className="text-sm text-slate-400 mr-1">(6)</span>
                    <Input className="inline-block w-40 h-8 border-slate-300" disabled={hasSubmitted} value={gap6} onChange={(e) => setGap6(e.target.value)} />
                </span>.
             </div>

             {hasSubmitted && (
                 <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 text-sm space-y-2">
                    <p className="font-bold mb-2">Suggested Answers:</p>
                    <p>(4) stacked layers (or layers)</p>
                    <p>(5) initial setup costs (or costs)</p>
                    <p>(6) weather conditions (or seasons/weather)</p>
                 </div>
             )}
          </section>

          {/* Section 3: Matching Information */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-6">Part 3: Matching Information</h3>
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                <p className="text-sm text-purple-800 font-medium"><AlertCircle className="inline w-4 h-4 mr-1" /> Focus: Scanning for specific concepts.</p>
             </div>
             
             <div className="space-y-4">
                 <Label htmlFor="match7" className="text-base text-slate-700">Which paragraph (if there were more) would contain the following? <br/><br/><strong>(7) A comparison of water efficiency between two farming techniques.</strong></p>
                 <Input id="match7" placeholder="Type your answer here..." className="max-w-md border-slate-300" disabled={hasSubmitted} value={match7} onChange={(e) => setMatch7(e.target.value)} />
                 
                 {hasSubmitted && (
                     <div className="mt-2 text-sm text-green-700 font-medium">
                         <p>Correct Idea: It is mentioned in the paragraph where it compares 95% water recycling (hydroponic) to wasteful runoff (conventional soil-based).</p>
                     </div>
                 )}
             </div>
          </section>

          {hasSubmitted && (
            <div className="bg-slate-900 text-white p-6 rounded-xl flex items-start gap-4">
               <div className="bg-blue-600 rounded-full p-2 mt-1">
                   <AlertCircle className="w-6 h-6" />
               </div>
               <div>
                   <h4 className="font-bold text-lg mb-2">Need Help? Message Your Trainer</h4>
                   <ul className="list-disc pl-5 text-slate-300 space-y-1 text-sm">
                       <li>Did you misunderstand vocabulary?</li>
                       <li>Did you locate the wrong paragraph?</li>
                       <li>Did you misread the question?</li>
                   </ul>
                   <p className="mt-3 text-sm text-blue-300">Use the Trainer Support section below to ask for clarification on any of these questions.</p>
               </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
            <Button 
               size="lg" 
               className="bg-blue-600 hover:bg-blue-700 text-white px-10" 
               onClick={checkAnswers}
               disabled={hasSubmitted || !tfng1 || !tfng2 || !tfng3}
            >
                {hasSubmitted ? "Practice Completed" : "Submit Answers"}
            </Button>
        </div>
      </div>
    </div>
  );
}
