import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Book, BarChart3, Clock, CheckCircle2 } from "lucide-react";

export default function ReadingGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Reading Section Guide</h1>
        <p className="text-lg text-muted-foreground">
          The Reading section evaluates your ability to understand written English in an academic context.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Test Format
            </CardTitle>
            <CardDescription>Duration: 29-30 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Fill in the Blanks (R&W):</span>
                <span className="text-muted-foreground">Select the best word from a dropdown list to complete the text.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Multiple Choice (Multiple):</span>
                <span className="text-muted-foreground">Select more than one correct answer.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Reorder Paragraphs:</span>
                <span className="text-muted-foreground">Drag and drop paragraphs into the correct order.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Fill in the Blanks (Reading):</span>
                <span className="text-muted-foreground">Drag words from a box to fill gaps in the text.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold min-w-[180px]">Multiple Choice (Single):</span>
                <span className="text-muted-foreground">Select the single best answer.</span>
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
                <h4 className="font-semibold mb-1">Correct / Incorrect</h4>
                <p className="text-sm text-muted-foreground">
                  Some tasks (like Multiple Choice Single Answer) are scored simply as correct (1 point) or incorrect (0 points).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Partial Credit</h4>
                <p className="text-sm text-muted-foreground">
                  Tasks like Fill in the Blanks and Multiple Choice (Multiple Answers) offer partial credit for each correct element identified.
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm">
                 <strong className="text-yellow-800">Note:</strong> For Multiple Choice (Multiple), incorrect selections may deduct points from the question total (but not below zero).
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-muted/30 p-8 rounded-xl border text-center space-y-6">
        <h3 className="text-2xl font-bold">Ready to practice?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Practice with realistic reading tasks and improve your comprehension speed.
        </p>
        <Link href="/practice/reading">
          <Button size="lg" className="gap-2 font-bold text-lg px-8">
            <Book className="h-5 w-5" />
            Start Reading Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
