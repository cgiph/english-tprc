import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Mic, BarChart3, Clock, CheckCircle2 } from "lucide-react";

export default function SpeakingGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Speaking Section Guide</h1>
        <p className="text-lg text-muted-foreground">
          The Speaking section assesses your ability to express yourself verbally in English in an academic environment.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Test Format
            </CardTitle>
            <CardDescription>Duration: 30-35 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold min-w-[140px]">Read Aloud:</span>
                <span className="text-muted-foreground">Read a short text aloud using correct pronunciation and intonation.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[140px]">Repeat Sentence:</span>
                <span className="text-muted-foreground">Listen to a sentence and repeat it exactly as you heard it.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[140px]">Describe Image:</span>
                <span className="text-muted-foreground">Describe an image (graph, map, chart) in detail.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[140px]">Retell Lecture:</span>
                <span className="text-muted-foreground">Listen to a lecture and retell the key points in your own words.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[140px]">Answer Short Question:</span>
                <span className="text-muted-foreground">Answer a question with a single word or a few words.</span>
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
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Content</h4>
                <p className="text-sm text-muted-foreground">Does your response cover all the key information required by the task?</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Oral Fluency</h4>
                <p className="text-sm text-muted-foreground">Can you speak in a smooth, effortless, and natural rhythm without hesitations or repetitions?</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pronunciation</h4>
                <p className="text-sm text-muted-foreground">Is your speech easily understandable to most regular speakers of the language?</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-muted/30 p-8 rounded-xl border text-center space-y-6">
        <h3 className="text-2xl font-bold">Ready to practice?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Put your skills to the test with our interactive practice modules. Get real-time feedback and improve your score.
        </p>
        <Link href="/practice/speaking">
          <Button size="lg" className="gap-2 font-bold text-lg px-8">
            <Mic className="h-5 w-5" />
            Start Speaking Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
