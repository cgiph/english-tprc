import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/bright_modern_university_library_study_area_with_natural_light.png";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, TrendingUp, Users } from "lucide-react";
import { MOCK_REVIEWS, MOCK_RESOURCES } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Students studying in library" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <Badge className="bg-secondary/90 text-secondary-foreground hover:bg-secondary border-none px-4 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
              #1 Community for PTE UKVI
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-sm">
              Your Path to <br/>
              <span className="text-secondary">UKVI Success</span>
            </h1>
            <p className="text-xl text-white/90 max-w-lg leading-relaxed font-light">
              Join thousands of students sharing real exam experiences, strategies, and verified study resources for the PTE Academic UKVI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg h-14 px-8 shadow-xl shadow-secondary/20">
                <Link href="/reviews">Read Reviews</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-medium text-lg h-14 px-8">
                <Link href="/resources">Explore Resources</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-sm pt-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>10k+ Members</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Scores</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Real Exam Reviews",
              desc: "Read detailed breakdowns of recent exam questions and center experiences.",
              icon: Star,
              color: "bg-blue-50 text-blue-700"
            },
            {
              title: "Smart Analysis",
              desc: "Track score trends and identify high-frequency questions for 2025.",
              icon: TrendingUp,
              color: "bg-amber-50 text-amber-700"
            },
            {
              title: "Verified Resources",
              desc: "Access community-vetted templates and practice materials that actually work.",
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-700"
            }
          ].map((feature, i) => (
            <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary">Recent Experiences</h2>
            <p className="text-muted-foreground mt-2">Fresh insights from test-takers this week</p>
          </div>
          <Button asChild variant="ghost" className="group text-primary">
            <Link href="/reviews">
              View all reviews <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <Card key={review.id} className="hover:border-primary/50 transition-colors duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-medium text-sm">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-primary font-serif">{review.overallScore}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Overall</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-muted/50 rounded p-1">
                    <div className="font-bold text-foreground">{review.scores.speaking}</div>
                    <div className="text-muted-foreground">SPK</div>
                  </div>
                  <div className="bg-muted/50 rounded p-1">
                    <div className="font-bold text-foreground">{review.scores.writing}</div>
                    <div className="text-muted-foreground">WRT</div>
                  </div>
                  <div className="bg-muted/50 rounded p-1">
                    <div className="font-bold text-foreground">{review.scores.reading}</div>
                    <div className="text-muted-foreground">RED</div>
                  </div>
                  <div className="bg-muted/50 rounded p-1">
                    <div className="font-bold text-foreground">{review.scores.listening}</div>
                    <div className="text-muted-foreground">LST</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-foreground transition-colors">
                  "{review.content}"
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {review.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Ready to start practicing?</h2>
              <p className="text-primary-foreground/80 text-lg">
                Access our library of {MOCK_RESOURCES.length}+ verified templates, mock tests, and study guides curated by top scorers.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8 font-semibold shadow-lg">
              <Link href="/resources">Browse Library</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}