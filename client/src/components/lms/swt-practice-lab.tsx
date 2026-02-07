import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SwtPracticeLab() {
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);

  // Validation Logic
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const startsWithCapital = /^[A-Z]/.test(text);
  
  // Danger Checks
  const isMultipleSentences = sentenceCount > 1;
  const isTooShort = wordCount > 0 && wordCount < 5;
  const isTooLong = wordCount > 75;
  const isCapitalizationError = text.length > 0 && !startsWithCapital;

  const isValid = !isMultipleSentences && !isTooShort && !isTooLong && !isCapitalizationError && wordCount > 0;

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
        <div className={`flex-1 flex flex-col rounded-xl border-2 transition-all duration-300 overflow-hidden ${isMultipleSentences ? "border-red-500 bg-red-50" : isValid ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}>
            
            {/* Validation Header */}
            <div className={`p-3 border-b flex items-center justify-between ${isMultipleSentences ? "bg-red-100 border-red-200" : isValid ? "bg-green-100 border-green-200" : "bg-slate-100 border-slate-200"}`}>
               <div className="flex items-center gap-2">
                 {isMultipleSentences ? <AlertTriangle className="h-5 w-5 text-red-600" /> : isValid ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-slate-400" />}
                 <span className={`font-bold text-sm ${isMultipleSentences ? "text-red-700" : isValid ? "text-green-700" : "text-slate-700"}`}>
                   {isMultipleSentences ? "CRITICAL ERROR" : isValid ? "Validation Passed" : "Drafting..."}
                 </span>
               </div>
               <div className="flex gap-2">
                  <Badge variant={wordCount >= 5 && wordCount <= 75 ? "outline" : "destructive"} className="bg-white/50">
                    Words: {wordCount}/75
                  </Badge>
               </div>
            </div>

            {/* Warning Banner */}
            {isMultipleSentences && (
               <div className="bg-red-500 text-white px-4 py-2 text-xs font-bold animate-pulse text-center">
                 ⚠️ DANGER: You have used more than one sentence. Use a comma or semicolon instead!
               </div>
            )}
            
            {/* Editor */}
            <Textarea 
              className={`flex-1 resize-none border-0 focus-visible:ring-0 text-lg p-6 leading-relaxed bg-transparent font-serif ${isMultipleSentences ? "text-red-900 placeholder:text-red-300" : "text-slate-800"}`}
              placeholder="Type your one-sentence summary here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Live Checks Footer */}
            <div className="p-3 bg-white/50 border-t border-black/5 text-xs grid grid-cols-2 gap-2">
               <div className={`flex items-center gap-1 ${isMultipleSentences ? "text-red-600 font-bold" : "text-green-600"}`}>
                 {isMultipleSentences ? "❌ Single Sentence" : "✅ Single Sentence"}
               </div>
               <div className={`flex items-center gap-1 ${isCapitalizationError ? "text-red-600 font-bold" : "text-green-600"}`}>
                 {isCapitalizationError ? "❌ Capitalization" : "✅ Capitalization"}
               </div>
               <div className={`flex items-center gap-1 ${isTooShort || isTooLong ? "text-red-600 font-bold" : "text-green-600"}`}>
                 {isTooShort || isTooLong ? "❌ Length (5-75)" : "✅ Length (5-75)"}
               </div>
            </div>
        </div>

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
