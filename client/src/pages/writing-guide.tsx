import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation } from "wouter";
import { PenTool, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export default function WritingGuide() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();

  const handleStartPractice = () => {
    if (user) {
      setLocation("/practice/writing");
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in or sign up to access writing practice.",
        variant: "destructive",
      });
      // Redirect to auth page after a short delay or immediately
      setLocation("/auth?mode=login");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Writing Section Guide</h1>
        <p className="text-lg text-muted-foreground">
          The Writing section tests your ability to produce written English in an academic setting.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Test Format
            </CardTitle>
            <CardDescription>Duration: 30-40 minutes (approx)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Summarize Written Text:</span>
                <span className="text-muted-foreground">Read a passage and summarize it in one sentence (5-75 words). Time: 10 mins per task.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Write Essay:</span>
                <span className="text-muted-foreground">Write a 200-300 word essay on a given topic. Time: 20 mins per task.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Scoring Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Content</h4>
                <p className="text-xs text-muted-foreground">Addressing the topic fully.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Form</h4>
                <p className="text-xs text-muted-foreground">Word count & sentence constraints.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Grammar</h4>
                <p className="text-xs text-muted-foreground">Correct structure and usage.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Vocabulary</h4>
                <p className="text-xs text-muted-foreground">Range and appropriateness.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Spelling</h4>
                <p className="text-xs text-muted-foreground">Correct spelling conventions.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Discourse</h4>
                <p className="text-xs text-muted-foreground">Structure and coherence.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-muted/30 p-8 rounded-xl border text-center space-y-6">
        <h3 className="text-2xl font-bold">Ready to practice?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Refine your writing skills with timed exercises and automated word count checks.
        </p>
        <Button size="lg" className="gap-2 font-bold text-lg px-8" onClick={handleStartPractice}>
          <PenTool className="h-5 w-5" />
          Start Writing Practice
        </Button>
      </div>
    </div>
  );
}
