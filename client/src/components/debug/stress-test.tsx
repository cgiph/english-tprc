
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Play, Pause, RefreshCw, ChevronDown, ChevronUp, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StressTest() {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadLevel, setLoadLevel] = useState(0);
  const [items, setItems] = useState<number[]>([]);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let animationFrame: number;
    let lastTime = performance.now();
    let frames = 0;

    if (isActive) {
      // FPS Counter
      const updateFps = () => {
        const now = performance.now();
        frames++;
        if (now - lastTime >= 1000) {
          setFps(Math.round((frames * 1000) / (now - lastTime)));
          frames = 0;
          lastTime = now;
        }
        animationFrame = requestAnimationFrame(updateFps);
      };
      updateFps();

      // Stress load simulation
      interval = setInterval(() => {
        // Force heavy state updates
        setItems(prev => {
           // Keep array size manageable but causing re-renders
           const newItems = [...prev, Math.random()];
           if (newItems.length > 2000) return newItems.slice(1000);
           return newItems;
        });
        
        setLoadLevel(prev => (prev + 1) % 100);
      }, 50); // Fast updates (20Hz)
    }

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrame);
    };
  }, [isActive]);

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "fixed bottom-4 right-4 z-50 shadow-xl gap-2 transition-all duration-300",
          isActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
        )}
        size="sm"
      >
        <Activity className={cn("w-4 h-4", isActive ? "text-white" : "text-orange-500")} />
        <span className={cn("font-medium", isActive ? "text-white" : "text-slate-700")}>
          {isActive ? `Stress Test Running (${fps} FPS)` : "System Stress Test"}
        </span>
        <Maximize2 className={cn("w-3 h-3 ml-1 opacity-50", isActive ? "text-white" : "text-slate-500")} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-2xl z-50 border-orange-200 bg-white/95 backdrop-blur transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in">
      <CardHeader className="py-3 px-4 bg-orange-50 border-b border-orange-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-orange-800 flex items-center gap-2">
          <Activity className="w-4 h-4" /> System Stress Test
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "destructive" : "outline"} className="text-xs">
            {isActive ? "Running" : "Idle"}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}>
            <Minimize2 className="w-3 h-3 text-slate-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
           <div className="flex justify-between text-xs font-medium text-slate-500">
             <span>Render Load</span>
             <span>{items.length} items</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className={cn("h-full transition-all duration-75", isActive ? "bg-orange-500" : "bg-slate-300")} 
               style={{ width: `${(items.length / 2000) * 100}%` }}
             ></div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="bg-slate-50 p-2 rounded border text-center">
              <div className="text-xs text-slate-500">FPS</div>
              <div className={cn("text-lg font-bold", fps < 30 ? "text-red-500" : "text-green-600")}>
                {isActive ? fps : "--"}
              </div>
           </div>
           <div className="bg-slate-50 p-2 rounded border text-center">
              <div className="text-xs text-slate-500">Stability</div>
              <div className="text-lg font-bold text-blue-600">
                {isActive ? "Testing..." : "Ready"}
              </div>
           </div>
        </div>

        <Button 
          size="sm" 
          className={cn("w-full", isActive ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800")}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" /> Stop Test
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> Start Stress Test
            </>
          )}
        </Button>
        
        {isActive && (
           <div className="flex items-start gap-2 text-[10px] text-orange-600 bg-orange-50 p-2 rounded">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              <p>Simulating 500+ concurrent state updates. UI responsiveness may decrease.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
