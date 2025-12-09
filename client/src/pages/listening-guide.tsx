import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Headphones, BarChart3, Clock, CheckCircle2 } from "lucide-react";

export default function ListeningGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Listening Section Guide</h1>
        <p className="text-lg text-muted-foreground">
          The Listening section measures your ability to understand spoken English in an academic context.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Test Format
            </CardTitle>
            <CardDescription>Duration: 30-43 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Summarize Spoken Text:</span>
                <span>Write a 50-70 word summary of a recording.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Multiple Choice (Multiple):</span>
                <span>Select all correct answers based on the recording.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Fill in the Blanks:</span>
                <span>Type missing words into a transcript while listening.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Highlight Correct Summary:</span>
                <span>Select the paragraph that best summarizes the audio.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Select Missing Word:</span>
                <span>Select the missing word that completes the recording.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Highlight Incorrect Words:</span>
                <span>Click on words in the transcript that differ from the audio.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[160px]">Write from Dictation:</span>
                <span>Type a sentence exactly as you hear it.</span>
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
                <h4 className="font-semibold mb-1">Content Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  For tasks like Write from Dictation, every correct word adds to your score.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Partial Credit</h4>
                <p className="text-sm text-muted-foreground">
                  Many listening tasks award points for each correct element but deduct for incorrect choices (e.g., Highlight Incorrect Words).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Spelling & Grammar</h4>
                <p className="text-sm text-muted-foreground">
                  In tasks requiring written responses, correct spelling and grammar are essential for full marks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-muted/30 p-8 rounded-xl border text-center space-y-6">
        <h3 className="text-2xl font-bold">Ready to practice?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Train your ear with various accents and speeds using our interactive listening exercises.
        </p>
        <Link href="/practice/listening">
          <Button size="lg" className="gap-2 font-bold text-lg px-8">
            <Headphones className="h-5 w-5" />
            Start Listening Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
