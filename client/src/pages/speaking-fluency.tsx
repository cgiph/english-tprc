import SpeakNowTimer from "@/components/speaking/speak-now-timer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer, Waves } from "lucide-react";

export default function SpeakingFluency() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" data-testid="page-speaking-fluency">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-2" data-testid="badge-speaking-fluency">
                <Waves className="h-3.5 w-3.5" /> Speaking Fluency
              </Badge>
              <Badge variant="outline" className="gap-2" data-testid="badge-3-second-rule">
                <Timer className="h-3.5 w-3.5" /> 3‑Second Rule
              </Badge>
            </div>
            <h1 className="text-4xl font-serif font-bold text-primary" data-testid="text-speaking-fluency-title">
              Speak‑Now Timer
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="text-speaking-fluency-subtitle">
              A reflex + fluency trainer that simulates the mic‑closure rule. Practice starting fast, then staying alive mid‑speech.
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2" data-testid="button-back-to-speaking-practice">
            <Link href="/practice/speaking">
              <ArrowLeft className="h-4 w-4" /> Back to Speaking Practice
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-muted/20" data-testid="card-tip-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Start instantly</CardTitle>
              <CardDescription className="text-xs">Beat the initial 3 seconds.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Train a reliable opener: a breath + first sentence template.
            </CardContent>
          </Card>
          <Card className="bg-muted/20" data-testid="card-tip-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Never go silent</CardTitle>
              <CardDescription className="text-xs">Silence &gt; 3s closes the mic.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use fillers strategically: “Overall…”, “What stands out is…”, “In addition…”.
            </CardContent>
          </Card>
          <Card className="bg-muted/20" data-testid="card-tip-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Increase difficulty</CardTitle>
              <CardDescription className="text-xs">Longer recording, more pressure.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Easy (5s) → Standard (10s) → Hard (20s).
            </CardContent>
          </Card>
        </div>
      </div>

      <SpeakNowTimer />
    </div>
  );
}
