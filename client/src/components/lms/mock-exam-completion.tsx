
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lock, ArrowRight, Trophy, Star, XCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useLMS } from "@/hooks/use-lms";

export function MockExamCompletion() {
  const { state } = useLMS();
  
  const requiredTests = [
    { id: "pte-mock-1", title: "Read Aloud" },
    { id: "pte-mock-2", title: "Repeat Sentence" },
    { id: "pte-mock-3", title: "Describe Image" },
    { id: "pte-mock-4", title: "Retell Lecture" },
    { id: "pte-mock-5", title: "Answer Short Question" },
    { id: "pte-mock-6", title: "Summarize Group Discussion" },
    { id: "pte-mock-7", title: "Respond to a Situation" },
  ];

  const incompleteTests = requiredTests.filter(test => {
     const scoreData = state.sectionScores?.[test.id];
     return !scoreData || !scoreData.passed;
  });

  const isUnlocked = incompleteTests.length === 0;

  return (
    <div className="w-full mx-auto p-8 text-center space-y-8 max-w-3xl">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-12 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="relative z-10 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-6 animate-in zoom-in duration-500 ${isUnlocked ? 'bg-yellow-400' : 'bg-slate-700'}`}>
                {isUnlocked ? <Trophy className="w-10 h-10 text-yellow-900" /> : <Lock className="w-10 h-10 text-slate-400" />}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {isUnlocked ? "Module 6 Completed!" : "Full Mock Locked"}
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-lg mx-auto leading-relaxed">
                {isUnlocked 
                    ? "You have successfully passed all section mock tests. You are now ready for the final challenge."
                    : "You must pass all Speaking Mock Tests (Score ≥ 65) to unlock the Full Mock Exam."
                }
            </p>
            
            {isUnlocked ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10 text-left">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <div>
                                <div className="text-xs text-indigo-200">Section 1</div>
                                <div className="font-bold">Speaking & Writing</div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <div>
                                <div className="text-xs text-indigo-200">Section 2</div>
                                <div className="font-bold">Reading</div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <div>
                                <div className="text-xs text-indigo-200">Section 3</div>
                                <div className="font-bold">Listening</div>
                            </div>
                        </div>
                    </div>

                    <Link href="/resources">
                        <Button size="lg" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-lg px-8 py-6 h-auto shadow-xl hover:translate-y-[-2px] transition-all">
                            Unlock Full Mock Test
                            <ArrowRight className="w-6 h-6 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-sm text-indigo-300 mt-4">
                        Located in the Resources Center
                    </p>
                </>
            ) : (
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 w-full max-w-md text-left">
                    <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        Pending Requirements:
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {incompleteTests.map(test => (
                            <div key={test.id} className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700">
                                <span className="text-sm text-slate-300">{test.title}</span>
                                <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Incomplete</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      <Card className="bg-slate-50 border-slate-200">

        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                Why take the Full Mock Test?
            </CardTitle>
        </CardHeader>
        <CardContent className="text-left text-slate-600 space-y-2">
            <p>• <strong>Real Exam Simulation:</strong> 2-hour continuous test without pauses.</p>
            <p>• <strong>Performance Analysis:</strong> Get a holistic score report.</p>
            <p>• <strong>Stamina Check:</strong> Test your focus and endurance.</p>
        </CardContent>
      </Card>
    </div>
  );
}
