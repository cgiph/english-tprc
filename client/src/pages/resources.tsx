import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_RESOURCES } from "@/lib/mock-data";
import { Download, FileText, PlayCircle, BarChart, Shield } from "lucide-react";

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