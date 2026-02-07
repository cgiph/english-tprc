import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function GrammarGuard() {
  const [text, setText] = useState("");
  
  // Count the number of periods
  const periodCount = (text.match(/\./g) || []).length;
  const isError = periodCount > 1;

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border-l-4 ${isError ? "bg-red-50 border-red-500" : "bg-blue-50 border-blue-500"}`}>
        <div className="flex items-center justify-between mb-2">
           <h4 className={`font-bold ${isError ? "text-red-800" : "text-blue-800"}`}>
             {isError ? "CRITICAL ERROR: Multiple sentences detected." : "Grammar Guard Active"}
           </h4>
           <div className={`px-3 py-1 rounded-full text-xs font-bold ${isError ? "bg-red-200 text-red-800 animate-pulse" : "bg-blue-200 text-blue-800"}`}>
             Period Count: {periodCount}
           </div>
        </div>
        <p className={`text-sm ${isError ? "text-red-700" : "text-blue-700"}`}>
          {isError 
            ? "You have used more than one full stop. In 'Summarize Written Text', this results in an automatic ZERO for the entire question." 
            : "Type your summary below. The guard will alert you if you accidentally split your sentence."}
        </p>
      </div>

      <Textarea 
        placeholder="Type your one-sentence summary here..."
        className={`min-h-[150px] text-lg font-serif p-4 resize-y transition-all ${isError ? "border-red-500 ring-2 ring-red-200 focus:ring-red-200" : "focus:border-blue-500"}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-2 text-sm text-slate-500">
        {isError ? (
           <AlertCircle className="h-4 w-4 text-red-500" /> 
        ) : (
           <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        <span>
          {isError ? "Fix punctuation immediately." : "Punctuation looks good."}
        </span>
      </div>
    </div>
  );
}
