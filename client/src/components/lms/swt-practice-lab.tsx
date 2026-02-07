import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Internal Component for Validation Display
const LiveValidator = ({ text }: { text: string }) => {
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  // Count periods to determine sentence count more accurately for this specific validator logic
  const sentenceCount = (text.match(/\./g) || []).length;
  const startsWithCapital = /^[A-Z]/.test(text);
  const endsWithPeriod = text.trim().endsWith('.');

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mt-2">
      {/* Word Count Gauge */}
      <div className={`text-center ${wordCount > 75 || (wordCount < 5 && wordCount > 0) ? 'text-red-600' : 'text-slate-600'}`}>
        <span className="block text-xs uppercase font-bold text-slate-500">Words</span>
        <span className="text-xl font-mono font-bold">{wordCount}/75</span>
      </div>

      {/* Sentence Counter */}
      <div className={`text-center ${sentenceCount > 1 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
        <span className="block text-xs uppercase font-bold text-slate-500">Sentences</span>
        <span className="text-xl font-mono font-bold">{sentenceCount}/1</span>
        {sentenceCount > 1 && <span className="block text-[10px] animate-pulse text-red-600 mt-1">FIX: REMOVE EXTRA PERIODS</span>}
      </div>

      {/* Mechanics Check */}
      <div className="text-center">
        <span className="block text-xs uppercase font-bold text-slate-500">Format</span>
        <div className="flex justify-center gap-2 mt-2">
          <div className="flex flex-col items-center gap-1">
             <span className={`w-3 h-3 rounded-full ${startsWithCapital ? 'bg-green-500' : 'bg-slate-300'}`} title="Starts with Capital"></span>
             <span className="text-[10px] text-slate-400">Cap</span>
          </div>
          <div className="flex flex-col items-center gap-1">
             <span className={`w-3 h-3 rounded-full ${endsWithPeriod ? 'bg-green-500' : 'bg-slate-300'}`} title="Ends with Period"></span>
             <span className="text-[10px] text-slate-400">End</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SwtPracticeLab() {
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [checklist, setChecklist] = useState({
    oneStop: false,
    grammar: false,
    capital: false,
    keywords: false
  });

  // Validation Logic for Main Component State (reused for checklist gating)
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const periodCount = (text.match(/\./g) || []).length;
  const endsWithPeriod = text.trim().endsWith(".");
  
  // Danger Checks
  const isMultipleSentences = periodCount > 1;
  const isTooShort = wordCount > 0 && wordCount < 5;
  const isTooLong = wordCount > 75;
  const isMissingFinalPeriod = text.length > 0 && !endsWithPeriod;
  
  // All gauges green?
  const isGaugesGreen = !isMultipleSentences && !isTooShort && !isTooLong && !isMissingFinalPeriod && wordCount > 0;

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
      {/* Left: Passage */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col h-full overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
           <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded uppercase tracking-wider">Source Text</span>
           <span className="text-sm font-normal text-slate-500">Read carefully</span>
        </h3>
        
        <div className="prose prose-slate flex-1 overflow-y-auto pr-2">
          <p className="text-lg leading-relaxed text-slate-700">
            "Modern hybrid vehicles utilize a dual-loop cooling system to manage the distinct thermal requirements of the internal combustion engine and the high-voltage battery pack. While the engine operates efficiently at higher temperatures, the lithium-ion battery requires a much cooler environment to prevent thermal runaway and ensure longevity. This complex thermal management is regulated by an electric water pump and a series of intelligent valves that redirect coolant flow based on real-time sensor data. Consequently, the integration of these two loops is essential for maximizing fuel economy and maintaining the safety of the electrical components under heavy load conditions."
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-600 mb-2">Key Strategy:</h4>
          <p className="text-sm text-slate-500 italic">Identify the main subject (Hybrid Cooling) and the result (Efficiency & Safety). Combine them into one sentence.</p>
        </div>
      </div>

      {/* Right: Editor & Validation */}
      <div className="flex flex-col h-full space-y-4">
        <div className={`flex-1 flex flex-col rounded-xl border-2 transition-all duration-300 overflow-hidden ${isMultipleSentences ? "border-red-500 bg-red-50" : isGaugesGreen ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}>
            
            {/* Warning Banner */}
            {isMultipleSentences && (
               <div className="bg-red-500 text-white px-4 py-2 text-xs font-bold animate-pulse text-center">
                 ⚠️ DANGER: You have used more than one sentence. Use a comma or semicolon instead!
               </div>
            )}
            {isMissingFinalPeriod && !isMultipleSentences && text.length > 0 && (
               <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold text-center">
                 ⚠️ WARNING: Your sentence must end with a full stop.
               </div>
            )}
            
            {/* Editor */}
            <Textarea 
              className={`flex-1 resize-none border-0 focus-visible:ring-0 text-lg p-6 leading-relaxed bg-transparent font-serif ${isMultipleSentences ? "text-red-900 placeholder:text-red-300" : "text-slate-800"}`}
              placeholder="Type your one-sentence summary here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Live Validator Component */}
            <div className="p-3 bg-white/50 border-t border-black/5">
               <LiveValidator text={text} />
            </div>
        </div>

        {/* Phase 2: Pre-Flight Checklist */}
        {isGaugesGreen && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              Pre-Flight Checklist
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={checklist.oneStop} onChange={() => handleChecklistChange('oneStop')} />
                <span className="text-sm text-indigo-800 group-hover:text-indigo-900 transition-colors"><strong>The One-Stop Test:</strong> Exactly one period at the very end?</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={checklist.grammar} onChange={() => handleChecklistChange('grammar')} />
                <span className="text-sm text-indigo-800 group-hover:text-indigo-900 transition-colors"><strong>The Grammar Check:</strong> Comma before connector?</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={checklist.capital} onChange={() => handleChecklistChange('capital')} />
                <span className="text-sm text-indigo-800 group-hover:text-indigo-900 transition-colors"><strong>The Capital Start:</strong> Starts with Capital letter?</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={checklist.keywords} onChange={() => handleChecklistChange('keywords')} />
                <span className="text-sm text-indigo-800 group-hover:text-indigo-900 transition-colors"><strong>The Keyword Check:</strong> 3+ technical nouns?</span>
              </label>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold" disabled={!allChecked}>
              {allChecked ? "Submit Response" : "Complete Checklist to Submit"}
            </Button>
          </div>
        )}

        {/* Model Answer Toggle */}
        <div className="bg-slate-900 rounded-xl p-4 text-slate-300 shadow-lg">
           <div className="flex justify-between items-center mb-3">
             <h4 className="text-sm font-bold text-white uppercase tracking-widest">Model Answer Analysis</h4>
             <Button 
               variant="outline" 
               size="sm" 
               className="h-7 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
               onClick={() => setShowModel(!showModel)}
             >
               {showModel ? "Hide Model" : "Show Model"}
             </Button>
           </div>
           
           {showModel ? (
             <div className="animate-in fade-in slide-in-from-top-2">
               <p className="font-serif text-lg leading-relaxed text-emerald-400 border-l-2 border-emerald-500 pl-3 mb-2">
                 "The dual-loop cooling system in hybrid vehicles manages different thermal requirements for the engine and battery pack, and this integration is essential for maximizing fuel efficiency and safety."
               </p>
               <div className="flex gap-2 mt-2">
                 <Badge variant="secondary" className="bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50">1 Sentence</Badge>
                 <Badge variant="secondary" className="bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50">32 Words</Badge>
               </div>
             </div>
           ) : (
             <div className="h-20 flex items-center justify-center text-slate-600 italic text-sm border border-dashed border-slate-700 rounded">
               Try to write your own summary first...
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
