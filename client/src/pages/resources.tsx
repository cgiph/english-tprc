import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_RESOURCES } from "@/lib/mock-data";
import { Download, FileText, PlayCircle, BarChart, Shield, Keyboard } from "lucide-react";
import { Link } from "wouter";

const iconMap = {
  "Guide": FileText,
  "Video": PlayCircle,
  "Practice Test": Shield,
  "Tool": BarChart
};

export default function Resources() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Study Resources</h1>
        <p className="text-lg text-muted-foreground">
          Curated materials to help you master every section of the PTE Academic UKVI. 
          From templates to full mock tests.
        </p>
      </div>

      {/* Featured Tool: Typing Practice */}
      <div className="w-full max-w-4xl mx-auto">
        <Link href="/practice/typing">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
            <CardContent className="p-8 flex items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Keyboard className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">New Interactive Tool</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Typing Speed Trainer</h3>
                <p className="text-muted-foreground max-w-md">
                  Practice your typing speed and accuracy with our new simulation tool. 
                  Includes a 60-minute timer and real-time WPM scoring.
                </p>
              </div>
              <Button size="lg" className="shrink-0 bg-primary text-white shadow-lg group-hover:translate-x-1 transition-transform">
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RESOURCES.map((resource) => {
          const Icon = iconMap[resource.type] || FileText;
          
          return (
            <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-all duration-300 group border-muted">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10 text-secondary-foreground group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant={resource.level === "Advanced" ? "destructive" : "secondary"} className="font-normal">
                    {resource.level}
                  </Badge>
                </div>
                <h3 className="font-bold text-xl font-serif leading-tight group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {resource.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground border-t p-6 bg-muted/5">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" /> {resource.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    ★ {resource.rating}
                  </span>
                </div>
                <Button size="sm" variant="ghost" className="text-primary font-medium hover:bg-primary/5">
                  Download
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}