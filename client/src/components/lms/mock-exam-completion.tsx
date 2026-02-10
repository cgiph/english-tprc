
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lock, ArrowRight, Trophy, Star } from "lucide-react";
import { Link } from "wouter";

export function MockExamCompletion() {
  return (
    <div className="w-full mx-auto p-8 text-center space-y-8 max-w-3xl">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-12 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg mb-6 animate-in zoom-in duration-500">
                <Trophy className="w-10 h-10 text-yellow-900" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Module 6 Completed!</h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-lg mx-auto leading-relaxed">
                You have successfully finished all section mock tests. You are now ready for the final challenge.
            </p>
            
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
