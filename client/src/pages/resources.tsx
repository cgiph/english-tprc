import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_RESOURCES, Resource } from "@/lib/mock-data";
import { Download, FileText, PlayCircle, BarChart, Shield, Keyboard, Lock, BookA } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

const iconMap = {
  "Guide": FileText,
  "Video": PlayCircle,
  "Practice Test": Shield,
  "Tool": BarChart
};

export default function Resources() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { user } = useUser();

  const [_location, setLocation] = useLocation();

  const handleDownloadClick = (resource: Resource) => {
    if (resource.locked && !user) {
      setSelectedResource(resource);
      setPasswordDialogOpen(true);
      setPassword("");
    } else {
      // Simulate download or open viewer
      if (resource.viewerUrl) {
        // Check if internal link
        if (resource.viewerUrl.startsWith('/')) {
          // Explicitly use hash navigation to ensure reliability
          window.location.hash = resource.viewerUrl;
        } else {
          window.location.href = resource.viewerUrl;
        }
      } else {
        window.open(resource.downloadUrl || "#", "_blank");
      }
      
      toast({
        title: resource.viewerUrl ? "Opening Resource" : "Download Started",
        description: resource.viewerUrl ? `Opening ${resource.title}...` : `Downloading ${resource.title}...`,
      });
    }
  };

  const handleUnlock = () => {
    // Mock password validation
    if (password === "admin123" || password === "TPRC2026") {
      setPasswordDialogOpen(false);
      
      if (selectedResource?.viewerUrl) {
        // Navigate to viewer
        if (selectedResource.viewerUrl.startsWith('/')) {
          window.location.hash = selectedResource.viewerUrl;
        } else {
          window.location.href = selectedResource.viewerUrl;
        }
      } else {
        // Download file
        window.open(selectedResource?.downloadUrl || "#", "_blank");
      }
      
      toast({
        title: "Access Granted",
        description: selectedResource?.viewerUrl ? "Opening resource..." : "Download starting...",
        variant: "default",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid access key. Please contact your administrator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Study Resources</h1>
        <p className="text-lg text-muted-foreground">Curated materials to help you master every section of the PTE Academic. From guides to full mock tests.</p>
      </div>
      {/* Featured Tool: Typing Practice */}
      <div className="w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        <Link href="/practice/typing">
          <Card className="h-full bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
            <CardContent className="p-8 flex flex-col justify-between h-full gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Keyboard className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">New Interactive Tool</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Typing Speed Trainer</h3>
                <p className="text-muted-foreground">
                  Practice your typing speed and accuracy with our new simulation tool. 
                  Includes a 60-minute timer and real-time WPM scoring.
                </p>
              </div>
              <Button size="lg" className="shrink-0 bg-primary text-white shadow-lg group-hover:translate-x-1 transition-transform w-full md:w-auto">
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/practice/vocabulary">
          <Card className="h-full bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-2 border-pink-500/10 hover:border-pink-500/30 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
            <CardContent className="p-8 flex flex-col justify-between h-full gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-pink-600 font-bold">
                  <BookA className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">Vocabulary Tool</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Vocabulary Builder</h3>
                <p className="text-muted-foreground">
                  Master essential PTE Academic collocations and academic words with definitions and examples.
                </p>
              </div>
              <Button size="lg" className="shrink-0 bg-pink-600 hover:bg-pink-700 text-white shadow-lg group-hover:translate-x-1 transition-transform w-full md:w-auto">
                Explore Words
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/resources/grammar-tool">
          <Card className="h-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-2 border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
            <CardContent className="p-8 flex flex-col justify-between h-full gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <FileText className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">Grammar Tool</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Grammar Refresher</h3>
                <p className="text-muted-foreground">
                  Quick reference guide for essential grammar rules, tenses, and sentence structures for PTE Academic.
                </p>
              </div>
              <Button size="lg" className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg group-hover:translate-x-1 transition-transform w-full md:w-auto">
                Review Grammar
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RESOURCES.map((resource) => {
          const Icon = iconMap[resource.type] || FileText;
          const isLocked = resource.locked && !user;
          
          return (
            <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-all duration-300 group border-muted relative">
              {isLocked && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-background/80 backdrop-blur p-1.5 rounded-full border shadow-sm" title="Restricted Access">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
              
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
                <Button 
                  size="sm" 
                  variant={isLocked ? "outline" : "ghost"}
                  className={isLocked ? "gap-2 border-primary/20 text-primary" : "text-primary font-medium hover:bg-primary/5"}
                  onClick={() => handleDownloadClick(resource)}
                >
                  {isLocked ? (
                    <>
                      <Lock className="h-3 w-3" /> Access
                    </>
                  ) : (
                    "Access"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restricted Access</DialogTitle>
            <DialogDescription>
              This resource is protected. Please enter your log-in key from Cirrus Global Inc. and TPRC to verify your access level.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="access-key" className="sr-only">
                Access Key
              </Label>
              <Input
                id="access-key"
                type="password"
                placeholder="Enter Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
             <div className="text-xs text-muted-foreground self-center">
               * Contact administrator if you lost your key
             </div>
            <Button type="button" onClick={handleUnlock} className="bg-primary">
              Verify & Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}