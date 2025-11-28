import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { Search, Filter, ThumbsUp, MessageCircle } from "lucide-react";

export default function Reviews() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-serif font-bold text-primary">Exam Reviews</h1>
        <p className="text-lg text-muted-foreground">
          Read authentic experiences from students who recently took the PTE Academic UKVI. 
          Filter by score, center location, or specific modules.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by test center, city, or keywords..." className="pl-10 border-muted-foreground/20" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="flex-1 md:flex-none bg-primary text-white">
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-6">
        {MOCK_REVIEWS.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Score Sidebar */}
              <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r min-w-[160px] gap-2">
                <div className="text-center">
                  <span className="text-4xl font-serif font-bold text-primary">{review.overallScore}</span>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mt-1">Overall Score</p>
                </div>
                {review.verified && (
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 hover:bg-green-100 border-none">
                    Verified Result
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full bg-muted" />
                    <div>
                      <h3 className="font-bold text-lg">{review.author}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.center}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Scores */}
                <div className="grid grid-cols-4 gap-4 max-w-md">
                  {[
                    { label: "Speaking", score: review.scores.speaking },
                    { label: "Writing", score: review.scores.writing },
                    { label: "Reading", score: review.scores.reading },
                    { label: "Listening", score: review.scores.listening },
                  ].map((module) => (
                    <div key={module.label} className="text-center p-2 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                      <div className="font-bold text-foreground">{module.score}</div>
                      <div className="text-[10px] uppercase text-muted-foreground">{module.label}</div>
                    </div>
                  ))}
                </div>

                <div className="prose prose-sm max-w-none text-foreground/90">
                  <p>{review.content}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex gap-2">
                    {review.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="font-normal text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" /> Helpful (12)
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" /> Comments (3)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}