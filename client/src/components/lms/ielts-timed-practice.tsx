import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, AlertCircle, Play, ArrowRight, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParagraphData {
    id: string;
    title: string;
    text: string;
    vocabulary: { word: string; definition: string }[];
}

const PARAGRAPHS: ParagraphData[] = [
    {
        id: "p1",
        title: "Paragraph 1: Re-shaping Landscapes",
        text: "Over the past century, the world’s rapid urbanization has dramatically reshaped natural landscapes. Forests have been cleared to make space for roads, wetlands drained for housing, and riverbanks reinforced with concrete to prevent flooding. Yet in an unexpected reversal, many cities today are moving toward a strikingly different vision of urban life—one that seeks to reintroduce nature rather than suppress it. This emerging movement, broadly known as urban rewilding, proposes that cities can improve ecological health, human well-being, and even economic resilience by allowing certain areas to return to a more natural state.",
        vocabulary: [
            { word: "Urbanization", definition: "growth of cities" },
            { word: "Reshaped", definition: "altered significantly" },
            { word: "Wetlands", definition: "areas of land saturated with water" },
            { word: "Reintroduce", definition: "bring back" },
            { word: "Suppress", definition: "prevent from happening" },
            { word: "Resilience", definition: "ability to recover quickly" },
        ]
    },
    {
        id: "p2",
        title: "Paragraph 2: The Core of Rewilding",
        text: "Urban rewilding is not merely the planting of trees or the creation of public parks, though these may form part of the strategy. Instead, its defining characteristic is the intentional reduction of human control over certain spaces. Advocates argue that by giving natural processes more freedom—such as allowing native plant species to regenerate, refraining from chemical management of lawns, or removing old concrete river channels—cities can create environments where wildlife can flourish. But beyond ecological concerns, rewilding also challenges long-held assumptions about how cities should look and function.",
        vocabulary: [
            { word: "Defining characteristic", definition: "the most important feature" },
            { word: "Intentional", definition: "deliberate" },
            { word: "Regenerate", definition: "grow again" },
            { word: "Refraining", definition: "stopping oneself from doing something" },
            { word: "Flourish", definition: "grow well" },
        ]
    },
    {
        id: "p3",
        title: "Paragraph 3: The Berlin Example",
        text: "One of the most cited early examples of urban rewilding comes from Berlin, where many abandoned sites left over from World War II and the Cold War gradually transformed into accidental nature reserves. Areas once occupied by rail yards and military structures became home to rare birds, insects, and even small mammals. This “accidental wilderness” attracted ecologists from across Europe, who found that species long absent from rural areas were thriving in the city’s neglected corners. Strikingly, Berlin residents came to embrace these sites, valuing them as peaceful refuges amid urban density.",
        vocabulary: [
            { word: "Abandoned", definition: "left empty" },
            { word: "Accidental nature reserves", definition: "natural areas created unintentionally" },
            { word: "Ecologists", definition: "scientists who study ecosystems" },
            { word: "Rural", definition: "countryside" },
            { word: "Refuges", definition: "safe places" },
        ]
    },
    {
        id: "p4",
        title: "Paragraph 4: Singapore's Intentional Approach",
        text: "In contrast, Singapore represents a highly intentional approach to rewilding. Despite being one of the most densely populated countries on Earth, the city-state has invested heavily in creating what it calls a “City in Nature.” A key component of this strategy is the development of nature corridors—continuous stretches of greenery that connect parks, wetlands, and forests. These corridors allow species such as macaques, butterflies, and migratory birds to move safely across the city. The result is a mosaic of semi-wild spaces integrated into a modern urban environment.",
        vocabulary: [
            { word: "Densely populated", definition: "with many people per area" },
            { word: "Corridors", definition: "connected pathways" },
            { word: "Migratory", definition: "moving from place to place seasonally" },
            { word: "Mosaic", definition: "mixture" },
            { word: "Integrated", definition: "combined harmoniously" },
        ]
    },
    {
        id: "p5",
        title: "Paragraph 5: Challenges and Concerns",
        text: "Yet not all rewilding efforts have been met with enthusiasm. In some cities, residents express concern about the potential risks associated with wildlife. For instance, when London adopted a policy to encourage wildflower meadows in public parks, some communities complained that the tall grasses made them feel unsafe, particularly at night. Others worried that rewilded riverbanks could attract rodents or lead to increased flooding. These concerns highlight a central tension in urban rewilding: while many people romanticize the idea of nature, they may resist its unpredictable realities.",
        vocabulary: [
            { word: "Enthusiasm", definition: "strong excitement or approval" },
            { word: "Adopted", definition: "put into practice" },
            { word: "Romanticize", definition: "idealize" },
            { word: "Unpredictable", definition: "not easy to foresee" },
            { word: "Tension", definition: "conflict or struggle" },
        ]
    },
    {
        id: "p6",
        title: "Paragraph 6: Economic Implications",
        text: "Economists also debate rewilding’s long-term implications. Critics argue that maintaining biodiverse spaces can be costly, especially in cities where land is scarce. They point out that rewilding often requires careful monitoring to prevent invasive species from taking over, and that restoring ecosystems that were previously destroyed can require substantial investment. However, supporters counter that the benefits outweigh the costs. They point to research demonstrating that urban green spaces lower healthcare expenses by reducing stress and pollution-related illnesses.",
        vocabulary: [
            { word: "Implications", definition: "possible effects" },
            { word: "Scarce", definition: "limited" },
            { word: "Monitoring", definition: "observing carefully" },
            { word: "Substantial", definition: "large" },
            { word: "Outweigh", definition: "be greater than" },
        ]
    }
];

export function IeltsTimedPractice({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [currentPIndex, setCurrentPIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per paragraph to read and review vocab
  const [isCompleted, setIsCompleted] = useState(false);

  const currentP = PARAGRAPHS[currentPIndex];
  const isLastParagraph = currentPIndex === PARAGRAPHS.length - 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up for this paragraph
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (isLastParagraph) {
      setIsCompleted(true);
      onComplete(true);
    } else {
      setCurrentPIndex(prev => prev + 1);
      setTimeLeft(120); // Reset timer to 2 minutes
      setTimerActive(false);
    }
  };

  if (isCompleted) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 w-full max-w-4xl mx-auto">
            <div className="w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-green-200">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Practice Completed!</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    You've successfully completed the timed reading and vocabulary review for all 6 paragraphs.
                </p>
                <Button onClick={() => onComplete(true)} size="lg" className="px-10 bg-green-600 hover:bg-green-700">
                    Continue to Next Lesson
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 w-full max-w-5xl mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold">Module 4: Timed Reading Practice</h2>
            <p className="text-slate-400 mt-1">Urban Rewilding</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                 <div className="text-xl font-bold text-blue-400">{currentPIndex + 1} / {PARAGRAPHS.length}</div>
                 <div className="text-xs text-slate-500 uppercase font-bold">Paragraph</div>
             </div>
             <div className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold",
                 timeLeft <= 30 ? "bg-red-900/50 text-red-400 animate-pulse" : "bg-slate-800 text-yellow-400"
             )}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
            {!timerActive && timeLeft === 120 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{currentP.title}</h3>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                        You will have 2 minutes to read this paragraph and review the key vocabulary words. Focus on understanding the main idea and how the vocabulary is used in context.
                    </p>
                    <Button onClick={startTimer} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                        <Play className="mr-2 w-6 h-6" /> Start Reading
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Paragraph Text */}
                    <div className={cn(
                        "md:col-span-2 p-8 rounded-xl leading-loose text-lg transition-all duration-500 relative",
                        timeLeft === 0 ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-100"
                    )}>
                        {timeLeft === 0 && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                                <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg font-bold border border-red-200 shadow-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5" /> Time's Up!
                                </div>
                            </div>
                        )}
                        <h3 className="font-bold text-slate-800 mb-4 text-xl">{currentP.title}</h3>
                        <p className="text-slate-700 text-justify">{currentP.text}</p>
                    </div>

                    {/* Vocabulary */}
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col h-full">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-500" />
                            Key Vocabulary
                        </h3>
                        <div className="space-y-4 flex-1">
                            {currentP.vocabulary.map((v, i) => (
                                <div key={i} className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                    <p className="font-bold text-indigo-900">{v.word}</p>
                                    <p className="text-sm text-slate-600 mt-1">{v.definition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
            <div>
               {timerActive && (
                   <Button variant="outline" onClick={() => setTimerActive(false)} className="text-slate-600">
                       <Pause className="w-4 h-4 mr-2" /> Pause Timer
                   </Button>
               )}
            </div>
            <Button 
               size="lg" 
               className={cn(
                   "px-10 font-bold",
                   timeLeft === 0 ? "bg-green-600 hover:bg-green-700 text-white animate-bounce" : "bg-slate-800 text-white"
               )} 
               onClick={handleNext}
               disabled={!timerActive && timeLeft === 120} // Disabled if hasn't started
            >
                {isLastParagraph ? "Finish Practice" : "Next Paragraph"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
