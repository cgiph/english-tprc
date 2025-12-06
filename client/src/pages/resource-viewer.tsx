import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Lock, BookOpen, FileText, HelpCircle, List, Check, X } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useState, useEffect } from "react";

// Import existing images (generated previously)
import imgRenewable from "@assets/generated_images/bar_chart_showing_global_renewable_energy_consumption_trends.png";
import imgSmartphone from "@assets/generated_images/pie_chart_illustrating_smartphone_market_share_by_brand.png";
import imgWaterCycle from "@assets/generated_images/process_diagram_showing_the_water_cycle.png";

// Import new images (will be available after generation)
import imgPopulation from "@assets/generated_images/bar_chart_showing_population_growth_by_region.png";
import imgUnemployment from "@assets/generated_images/line_graph_showing_unemployment_rates_2010-2020.png";
import imgGoldPrice from "@assets/generated_images/line_graph_showing_gold_price_fluctuations.png";
import imgEnergy from "@assets/generated_images/pie_chart_of_household_energy_consumption.png";
import imgMajors from "@assets/generated_images/pie_chart_of_student_major_distribution.png";
import imgCoffee from "@assets/generated_images/diagram_of_coffee_production_process.png";
import imgRecycling from "@assets/generated_images/diagram_of_plastic_recycling_lifecycle.png";
import imgLibrary from "@assets/generated_images/map_comparing_library_floor_plan_2010_vs_2025.png";
import imgIsland from "@assets/generated_images/map_of_island_development_project.png";

type ChartData = {
  id: string;
  title: string;
  image: string;
  answer: string;
};

const CHARTS: Record<string, ChartData[]> = {
  "Bar Charts": [
    {
      id: "bar-1",
      title: "Global Renewable Energy Trends",
      image: imgRenewable,
      answer: "The bar chart illustrates the global trends in renewable energy consumption over a specific period. It is evident that solar and wind energy usage has seen a significant upward trend, while hydroelectric power has remained relatively stable. In conclusion, the data suggests a global shift towards sustainable energy sources to combat climate change."
    },
    {
      id: "bar-2",
      title: "Population Growth by Region",
      image: imgPopulation,
      answer: "The bar chart compares population growth across different regions including Asia, Africa, Europe, and the Americas. Africa shows the most dramatic increase in population, projected to double by 2050. In contrast, Europe's population appears to be stagnating or slightly declining. Overall, future global population growth will be driven primarily by African and Asian nations."
    },
    {
      id: "bar-3",
      title: "Smartphone Market Share",
      image: imgSmartphone,
      answer: "The chart displays the market share of leading smartphone brands. Brand A dominates the market with the largest share, followed closely by Brand B. Smaller competitors make up the remaining portion. This indicates a highly consolidated market where a few key players hold the majority of influence."
    }
  ],
  "Line Graphs": [
    {
      id: "line-1",
      title: "Unemployment Rates (2010-2020)",
      image: imgUnemployment,
      answer: "The line graph depicts the changes in unemployment rates from 2010 to 2020. There was a steady decline in unemployment from 2010 to 2019, reaching a historic low. However, a sharp spike is visible in 2020, likely attributed to the global economic impact of the pandemic. In summary, while the economy was strengthening for a decade, external shocks caused a sudden reversal in employment trends."
    },
    {
      id: "line-2",
      title: "Gold Price Fluctuations",
      image: imgGoldPrice,
      answer: "The graph illustrates the fluctuations in the price of gold over a five-year period. The price shows high volatility, with several peaks and troughs. Despite the short-term ups and downs, there is a general upward trend, suggesting that investors view gold as a safe haven asset during times of economic uncertainty."
    }
  ],
  "Pie Charts": [
    {
      id: "pie-1",
      title: "Household Energy Consumption",
      image: imgEnergy,
      answer: "The pie chart breaks down household energy consumption by category. Heating and cooling account for the largest proportion, making up nearly half of total usage. Appliances and lighting constitute smaller but significant segments. To reduce energy bills, homeowners should focus primarily on improving insulation and heating efficiency."
    },
    {
      id: "pie-2",
      title: "Student Major Distribution",
      image: imgMajors,
      answer: "The chart represents the distribution of university students across different majors. Business and Engineering are the most popular fields, collectively attracting over 50% of the student body. Arts and Sciences have smaller enrollments. This trend highlights a student preference for career-oriented degrees in the current job market."
    }
  ],
  "Process Diagrams": [
    {
      id: "proc-1",
      title: "Water Cycle",
      image: imgWaterCycle,
      answer: "The process diagram outlines the stages of the natural water cycle. It begins with evaporation from water bodies, followed by condensation into clouds. Precipitation then returns water to the earth, where it is collected in rivers and oceans. This continuous cycle is essential for maintaining life and regulating the planet's climate."
    },
    {
      id: "proc-2",
      title: "Coffee Production Process",
      image: imgCoffee,
      answer: "The diagram details the steps involved in coffee production. It starts with harvesting the coffee cherries, which are then dried and roasted to develop flavor. The roasted beans are ground and finally brewed to produce the beverage. This multi-step process transforms raw agricultural produce into a consumable consumer product."
    },
    {
      id: "proc-3",
      title: "Plastic Recycling Lifecycle",
      image: imgRecycling,
      answer: "The diagram illustrates the lifecycle of plastic recycling. Post-consumer plastic is collected and sorted at a facility. It is then shredded into flakes, melted, and reformed into new products. This circular process reduces waste and conserves raw materials, promoting environmental sustainability."
    }
  ],
  "Maps": [
    {
      id: "map-1",
      title: "Library Floor Plan (2010 vs 2025)",
      image: imgLibrary,
      answer: "The maps compare the layout of a library in 2010 and 2025. In 2010, the space was dominated by book shelves. By 2025, many shelves have been replaced with computer stations and group study areas. This transformation reflects the evolving role of libraries from book repositories to digital learning hubs."
    },
    {
      id: "map-2",
      title: "Island Development Project",
      image: imgIsland,
      answer: "The maps depict the development of an island before and after construction. Originally, the island was uninhabited with only trees and beaches. The developed map shows a new resort complex, a pier, and connecting roads. This development has transformed the natural landscape into a tourist destination."
    }
  ]
};

export default function ResourceViewer() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const resourceId = searchParams.get("id");
  
  const [activeTab, setActiveTab] = useState("Bar Charts");

  // State for Summarize Written Text - Fill in Blanks
  const [swtBlanksAnswers, setSwtBlanksAnswers] = useState<Record<string, string>>({});
  const [swtBlanksResults, setSwtBlanksResults] = useState<Record<string, boolean>>({});
  const [swtBlanksScore, setSwtBlanksScore] = useState<number | null>(null);

  // State for Summarize Written Text - Fill in Blanks Practice 2
  const [swt2BlanksAnswers, setSwt2BlanksAnswers] = useState<Record<string, string>>({});
  const [swt2BlanksResults, setSwt2BlanksResults] = useState<Record<string, boolean>>({});
  const [swt2BlanksScore, setSwt2BlanksScore] = useState<number | null>(null);

  const checkSwtBlanks = () => {
    const KEY: Record<string, string> = {
      "b1": "easier",
      "b2": "connected",
      "b3": "distractions",
      "b4": "health problems",
      "b5": "use",
      "b6": "responsibly"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (swtBlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns.includes(correctKey) || (id === "b4" && userAns.includes("poor health")); // Allow "poor health" as it's in the text
      
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setSwtBlanksResults(newResults);
    setSwtBlanksScore(correctCount);
  };

  const checkSwt2Blanks = () => {
    const KEY: Record<string, string> = {
      "swt2_b1": "offer many choices",
      "swt2_b2": "fun activities",
      "swt2_b3": "are close to home",
      "swt2_b4": "feel personal",
      "swt2_b5": "useful"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (swt2BlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      // Allow partial matches for longer phrases or minor variations
      const isCorrect = userAns.includes(correctKey) || correctKey.includes(userAns) && userAns.length > 3;
      
      // Strict match for now as per key
      const strictCorrect = userAns === correctKey;
      
      newResults[id] = strictCorrect;
      if (strictCorrect) correctCount++;
    });

    setSwt2BlanksResults(newResults);
    setSwt2BlanksScore(correctCount);
  };

  // State for Signal Words Exercise
  const [signalAnswers, setSignalAnswers] = useState<Record<string, string>>({});
  const [signalResults, setSignalResults] = useState<Record<string, boolean>>({});
  const [signalScore, setSignalScore] = useState<number | null>(null);

  // State for WH Questions Exercise
  const [whAnswers, setWhAnswers] = useState<Record<string, string>>({});
  const [whResults, setWhResults] = useState<Record<string, boolean>>({});
  const [whScore, setWhScore] = useState<number | null>(null);

  const checkSignalWords = () => {
    const KEY: Record<string, string[]> = {
      "t1-1": ["to start with", "first"],
      "t1-2": ["then", "next"],
      "t1-3": ["as a result", "finally", "therefore"],
      "t2-1": ["first", "to start with"],
      "t2-2": ["next", "then"],
      "t2-3": ["then", "next", "afterwards"],
      "t2-4": ["finally", "as a result"],
      "t3-1": ["first", "to start with"],
      "t3-2": ["next", "then"],
      "t3-3": ["then", "next"],
      "t3-4": ["finally"]
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (signalAnswers[id] || "").toLowerCase().trim().replace(/,$/, "");
      const correctOptions = KEY[id].map(s => s.toLowerCase().replace(/,$/, ""));
      const isCorrect = correctOptions.some(opt => userAns.includes(opt));
      
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setSignalResults(newResults);
    setSignalScore(correctCount);
  };

  const checkWhQuestions = () => {
    const KEY: Record<string, string> = {
      "ex1-who": "maria",
      "ex1-what": "bananas and apples",
      "ex1-where": "market",
      "ex1-why": "fruit salad",
      "ex1-how": "making a salad",
      
      "ex2-who": "ben",
      "ex2-what": "plays football",
      "ex2-where": "park",
      "ex2-why": "likes sports",
      "ex2-how": "with his friends",
      
      "ex3-who": "sara",
      "ex3-what": "reads books",
      "ex3-where": "in the library",
      "ex3-why": "to learn new things",
      "ex3-how": "every saturday"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (whAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      // Loose matching for text inputs
      const isCorrect = userAns.includes(correctKey);
      
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setWhResults(newResults);
    setWhScore(correctCount);
  };

  // Default to Describe Image if no ID or ID=2
  const isEssayGuide = resourceId === "1";
  const resourceTitle = isEssayGuide ? "Ultimate Writing Guide 2026" : "Describe Image - 50 Practice Charts";

  if (isEssayGuide) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/resources">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Resources
              </Button>
            </Link>
            <h1 className="font-serif font-bold text-xl hidden md:block">
              {resourceTitle}
            </h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </header>

        <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Summarize Written Text Practice</h2>
               <p className="text-muted-foreground mb-6">Learn to identify main ideas and summarize effectively.</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Purpose
                   </h3>
                   <ul className="list-disc pl-5 text-lg font-medium space-y-1">
                     <li>Help students identify the main idea of a short text.</li>
                     <li>Practice writing one simple sentence that summarizes the text.</li>
                   </ul>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" /> Guidelines
                   </h3>
                   <div className="grid gap-4 md:grid-cols-2">
                     <div className="bg-white p-4 rounded border">
                       <span className="font-bold block text-sm text-muted-foreground uppercase">Text Length</span>
                       30–50 words for Pre-A1, 50–70 words for A1.
                     </div>
                     <div className="bg-white p-4 rounded border">
                       <span className="font-bold block text-sm text-muted-foreground uppercase">Vocabulary</span>
                       Use familiar words and short sentences.
                     </div>
                     <div className="bg-white p-4 rounded border">
                       <span className="font-bold block text-sm text-muted-foreground uppercase">Task</span>
                       Read the text and write one sentence that tells the main idea.
                     </div>
                     <div className="bg-white p-4 rounded border">
                       <span className="font-bold block text-sm text-muted-foreground uppercase">Sentence Structure</span>
                       Encourage use of subject + verb + object.
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <List className="h-5 w-5 text-primary" /> Sentence Structures
                   </h3>
                   <p className="text-muted-foreground">Use these templates to combine main ideas into one single sentence.</p>
                   
                   <div className="grid gap-4">
                     <Card className="bg-blue-50 border-blue-100">
                       <CardContent className="pt-6">
                         <span className="font-bold text-sm text-blue-700 uppercase mb-2 block">Template 1: Contrast & Conclusion</span>
                         <p className="font-medium text-lg mb-2">[Main idea], but [contrast idea], so [conclusion].</p>
                         <div className="text-sm text-muted-foreground bg-white p-3 rounded border border-blue-100">
                           <span className="font-bold text-blue-600">Example:</span> Technology makes life easier, but it can cause problems, so people should use it responsibly.
                         </div>
                       </CardContent>
                     </Card>

                     <Card className="bg-purple-50 border-purple-100">
                       <CardContent className="pt-6">
                         <span className="font-bold text-sm text-purple-700 uppercase mb-2 block">Template 2: Although Structure</span>
                         <p className="font-medium text-lg mb-2">Although [idea 1], [idea 2] and [conclusion].</p>
                         <div className="text-sm text-muted-foreground bg-white p-3 rounded border border-purple-100">
                           <span className="font-bold text-purple-600">Example:</span> Although big malls offer many choices, small shops are important, and both should remain.
                         </div>
                       </CardContent>
                     </Card>

                     <Card className="bg-amber-50 border-amber-100">
                       <CardContent className="pt-6">
                         <span className="font-bold text-sm text-amber-700 uppercase mb-2 block">Template 3: Formal Cause & Effect</span>
                         <p className="font-medium text-lg mb-2">[Topic] provides [benefit], yet [drawback], therefore [solution].</p>
                         <div className="text-sm text-muted-foreground bg-white p-3 rounded border border-amber-100">
                           <span className="font-bold text-amber-600">Example:</span> Technology provides convenience, yet it causes distractions, therefore balance is needed.
                         </div>
                       </CardContent>
                     </Card>
                   </div>
                 </div>

                 <div className="space-y-4 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <BookOpen className="h-5 w-5 text-primary" /> Examples
                   </h3>
                   
                   <div className="grid gap-6 md:grid-cols-2">
                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Example 1</CardTitle></CardHeader>
                       <CardContent className="space-y-4">
                         <div className="bg-muted p-3 rounded text-sm">
                           <span className="font-bold block text-xs text-muted-foreground uppercase mb-1">Text</span>
                           Anna likes apples. She eats apples every day. Apples are her favorite fruit.
                         </div>
                         <div className="bg-green-50 p-3 rounded text-sm border border-green-100">
                           <span className="font-bold block text-xs text-green-700 uppercase mb-1">Summary</span>
                           Anna likes to eat apples.
                         </div>
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Example 2</CardTitle></CardHeader>
                       <CardContent className="space-y-4">
                         <div className="bg-muted p-3 rounded text-sm">
                           <span className="font-bold block text-xs text-muted-foreground uppercase mb-1">Text</span>
                           Tom goes to the park every morning. He runs and plays football with his friends. Tom enjoys being outside.
                         </div>
                         <div className="bg-green-50 p-3 rounded text-sm border border-green-100">
                           <span className="font-bold block text-xs text-green-700 uppercase mb-1">Summary</span>
                           Tom enjoys playing in the park every morning.
                         </div>
                       </CardContent>
                     </Card>
                   </div>
                 </div>

                 <div className="space-y-4 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <BookOpen className="h-5 w-5 text-primary" /> Practice Task
                   </h3>
                   
                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Task 1: Technology and Life</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           Many people believe that technology has made life easier, but it also brings challenges. Smartphones and social media help people connect quickly, share ideas, and work from anywhere. However, they can cause distractions and reduce face-to-face communication. Some experts say too much screen time affects mental health and sleep. Therefore, while technology offers convenience, it also requires balance and responsible use.
                         </p>
                       </div>
                       
                       <div className="bg-white p-4 rounded border">
                         <p className="mb-2 font-bold text-sm text-muted-foreground uppercase">Task</p>
                         <p>Write one sentence that summarizes the passage. Your sentence should be between 5 and 75 words.</p>
                       </div>

                       <div className="mt-4">
                          <details className="group">
                            <summary className="flex items-center gap-2 cursor-pointer font-medium text-primary hover:underline">
                              <span>Show Sample Answer</span>
                              <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-open:rotate-90" />
                            </summary>
                            <div className="mt-3 p-4 bg-green-50 border border-green-100 rounded text-sm">
                              <span className="font-bold block text-xs text-green-700 uppercase mb-1">Sample Summary</span>
                              Although technology like smartphones enhances connectivity and work flexibility, it can lead to distractions and health issues, so maintaining a balance is essential for responsible usage.
                              
                              <div className="mt-4 pt-4 border-t border-green-200">
                                <span className="font-bold block text-xs text-green-700 uppercase mb-2">Why is this a good summary?</span>
                                <div className="space-y-3 text-green-900">
                                  <div>
                                    <p className="font-bold text-xs">1. Covers All Key Points</p>
                                    <p className="text-xs mt-1 text-green-800">Matches structure: advantages → disadvantages → need for balance.</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs">2. One Sentence Only</p>
                                    <p className="text-xs mt-1 text-green-800">28 words (ideal length between 5-75 words).</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs">3. Paraphrased Effectively</p>
                                    <p className="text-xs mt-1 text-green-800">"offers convenience" → "enhances connectivity"</p>
                                    <p className="text-xs text-green-800">"requires balance" → "maintaining a balance is essential"</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs">4. Clear and Coherent</p>
                                    <p className="text-xs mt-1 text-green-800">Uses connectors (Although, so) to link ideas smoothly.</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs">5. Advanced Vocabulary</p>
                                    <p className="text-xs mt-1 text-green-800">Uses academic words: enhances, connectivity, flexibility, maintaining.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </details>
                       </div>
                     </CardContent>
                   </Card>
                   
                   <Card className="mt-8">
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 1: Fill-in-the-Blanks Summary</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           Technology helps people connect and work easily, but it can also cause problems like distractions and poor health. Experts say people should use technology responsibly and keep a balance.
                         </p>
                       </div>
                       
                       <div className="space-y-4">
                         <p className="font-medium text-sm text-muted-foreground uppercase">Complete the summary</p>
                         <div className="bg-white p-6 rounded border leading-loose text-lg">
                           Technology makes life 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b1"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b1": e.target.value})}
                               className={`w-24 inline-flex h-8 ${swtBlanksResults["b1"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b1"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b1"] === false && <span className="text-xs text-red-500 block text-center">easier</span>}
                           </span>
                           and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b2"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b2": e.target.value})}
                               className={`w-28 inline-flex h-8 ${swtBlanksResults["b2"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b2"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b2"] === false && <span className="text-xs text-red-500 block text-center">connected</span>}
                           </span>
                           , but it can also cause 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b3"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b3": e.target.value})}
                               className={`w-28 inline-flex h-8 ${swtBlanksResults["b3"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b3"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b3"] === false && <span className="text-xs text-red-500 block text-center">distractions</span>}
                           </span>
                           and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b4"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b4": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swtBlanksResults["b4"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b4"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b4"] === false && <span className="text-xs text-red-500 block text-center">health problems</span>}
                           </span>
                           , so people should 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b5"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b5": e.target.value})}
                               className={`w-20 inline-flex h-8 ${swtBlanksResults["b5"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b5"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b5"] === false && <span className="text-xs text-red-500 block text-center">use</span>}
                           </span>
                           it 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swtBlanksAnswers["b6"] || ""} 
                               onChange={(e) => setSwtBlanksAnswers({...swtBlanksAnswers, "b6": e.target.value})}
                               className={`w-28 inline-flex h-8 ${swtBlanksResults["b6"] === true ? "border-green-500 bg-green-50" : swtBlanksResults["b6"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swtBlanksResults["b6"] === false && <span className="text-xs text-red-500 block text-center">responsibly</span>}
                           </span>
                           .
                         </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-bold">
                             {swtBlanksScore !== null && <span>Score: {swtBlanksScore} / 6</span>}
                          </div>
                          <Button onClick={checkSwtBlanks} className="w-32">Check Answers</Button>
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="mt-8">
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 2: Fill-in-the-Blanks Summary (Practice 2)</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           Many people enjoy shopping in big malls because they offer many choices and fun activities. However, small local shops are important too. They are close to home, save time, and feel personal. Both malls and small shops are useful for different reasons.
                         </p>
                       </div>
                       
                       <div className="space-y-4">
                         <p className="font-medium text-sm text-muted-foreground uppercase">Complete the summary</p>
                         <div className="bg-white p-6 rounded border leading-loose text-lg">
                           Big malls are popular because they 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt2BlanksAnswers["swt2_b1"] || ""} 
                               onChange={(e) => setSwt2BlanksAnswers({...swt2BlanksAnswers, "swt2_b1": e.target.value})}
                               className={`w-40 inline-flex h-8 ${swt2BlanksResults["swt2_b1"] === true ? "border-green-500 bg-green-50" : swt2BlanksResults["swt2_b1"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swt2BlanksResults["swt2_b1"] === false && <span className="text-xs text-red-500 block text-center">offer many choices</span>}
                           </span>
                           and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt2BlanksAnswers["swt2_b2"] || ""} 
                               onChange={(e) => setSwt2BlanksAnswers({...swt2BlanksAnswers, "swt2_b2": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt2BlanksResults["swt2_b2"] === true ? "border-green-500 bg-green-50" : swt2BlanksResults["swt2_b2"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swt2BlanksResults["swt2_b2"] === false && <span className="text-xs text-red-500 block text-center">fun activities</span>}
                           </span>
                           , while small shops are important because they 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt2BlanksAnswers["swt2_b3"] || ""} 
                               onChange={(e) => setSwt2BlanksAnswers({...swt2BlanksAnswers, "swt2_b3": e.target.value})}
                               className={`w-40 inline-flex h-8 ${swt2BlanksResults["swt2_b3"] === true ? "border-green-500 bg-green-50" : swt2BlanksResults["swt2_b3"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swt2BlanksResults["swt2_b3"] === false && <span className="text-xs text-red-500 block text-center">are close to home</span>}
                           </span>
                           and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt2BlanksAnswers["swt2_b4"] || ""} 
                               onChange={(e) => setSwt2BlanksAnswers({...swt2BlanksAnswers, "swt2_b4": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt2BlanksResults["swt2_b4"] === true ? "border-green-500 bg-green-50" : swt2BlanksResults["swt2_b4"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swt2BlanksResults["swt2_b4"] === false && <span className="text-xs text-red-500 block text-center">feel personal</span>}
                           </span>
                           . Both are 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt2BlanksAnswers["swt2_b5"] || ""} 
                               onChange={(e) => setSwt2BlanksAnswers({...swt2BlanksAnswers, "swt2_b5": e.target.value})}
                               className={`w-24 inline-flex h-8 ${swt2BlanksResults["swt2_b5"] === true ? "border-green-500 bg-green-50" : swt2BlanksResults["swt2_b5"] === false ? "border-red-500 bg-red-50" : ""}`}
                               placeholder=""
                             />
                             {swt2BlanksResults["swt2_b5"] === false && <span className="text-xs text-red-500 block text-center">useful</span>}
                           </span>
                           for different reasons.
                         </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-bold">
                             {swt2BlanksScore !== null && <span>Score: {swt2BlanksScore} / 5</span>}
                          </div>
                          <Button onClick={checkSwt2Blanks} className="w-32">Check Answers</Button>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Essay Practice 1</h2>
               <p className="text-muted-foreground mb-6">Topic: Extreme Sports / Dangerous Activities</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Prompt
                   </h3>
                   <p className="text-lg font-medium">
                     Extreme sports (Dangerous activities) like skiing, bungee jumping, rafting, diving should be banned. Agree or disagree?
                   </p>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" /> Sample Answer
                   </h3>
                   <div className="prose max-w-none leading-relaxed text-muted-foreground">
                     <p className="mb-4">
                       Extreme sports like skiing, diving, and bungee jumping are exciting and popular. Some people believe they are too dangerous and should be banned. I disagree with this idea. I think people should be free to choose their activities, if they follow safety rules.
                     </p>
                     <p className="mb-4">
                       First, extreme sports help people stay fit and healthy. These activities require physical strength, balance, and focus. When people do sports like rafting or climbing, they improve their muscles and heart health. It also helps reduce stress and makes people feel more energetic.
                     </p>
                     <p className="mb-4">
                       Second, extreme sports give people a sense of adventure. Many people enjoy trying new things and pushing their limits. For example, someone who goes skydiving may feel scared at first, but after the jump, they feel proud and confident. These experiences can help people grow and become stronger mentally.
                     </p>
                     <p>
                       In conclusion, extreme sports should not be banned. They offer health benefits and help people build courage. Instead of stopping these activities, we should make sure they are done safely. With proper training and equipment, people can enjoy extreme sports without serious risk.
                     </p>
                   </div>
                 </div>

                 <div className="space-y-4 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <BookOpen className="h-5 w-5 text-primary" /> Comprehension Questions
                   </h3>
                   
                   <div className="grid gap-6 md:grid-cols-2">
                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">A. Understanding the Main Idea</CardTitle></CardHeader>
                       <CardContent className="text-sm space-y-2">
                         <p><strong>1. What is the writer’s opinion about banning extreme sports?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">The writer disagrees with banning them.</p>
                         
                         <p><strong>2. Why does the writer think people should be allowed to do extreme sports?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">People should be free to choose their activities if they follow safety rules.</p>
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">B. Vocabulary Check</CardTitle></CardHeader>
                       <CardContent className="text-sm space-y-2">
                         <p><strong>3. What does “banned” mean?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">To be officially forbidden or stopped.</p>
                         
                         <p><strong>4. What is “skydiving”?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">The sport of jumping from an aircraft and performing acrobatic maneuvers in the air.</p>

                         <p><strong>5. What does “pushing their limits” mean?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">Trying to do more than what they usually do or what they think they can do.</p>
                       </CardContent>
                     </Card>

                     <Card className="md:col-span-2">
                       <CardHeader className="pb-2"><CardTitle className="text-base">C. Details from the Essay</CardTitle></CardHeader>
                       <CardContent className="text-sm space-y-2">
                         <p><strong>6. Name two health benefits of doing extreme sports.</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">Improving muscles/heart health and reducing stress.</p>
                         
                         <p><strong>7. What example does the writer give to show how extreme sports help people feel confident?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">Skydiving: feeling scared at first but proud and confident after the jump.</p>

                         <p><strong>8. What does the writer suggest instead of banning extreme sports?</strong></p>
                         <p className="text-muted-foreground pl-4 border-l-2">Ensuring they are done safely with proper training and equipment.</p>
                       </CardContent>
                     </Card>
                   </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Essay Practice 2</h2>
               <p className="text-muted-foreground mb-6">Topic: Small Local Shops vs. Big Shopping Malls</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Prompt
                   </h3>
                   <p className="text-lg font-medium">
                     In town and cities, the large shopping mall should replace the small local shop. To what extent do you agree or disagree? Discuss.
                   </p>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" /> Sample Answer
                   </h3>
                   <div className="prose max-w-none leading-relaxed text-muted-foreground">
                     <p className="mb-4">
                       In towns and cities, people go shopping every day. Some people think big shopping malls should replace small local shops. I do not agree. I think both are important and should stay because they help people in different ways.
                     </p>
                     <p className="mb-4">
                       First, small shops are easy to find and close to home. People can walk to buy food, drinks, or other things. It saves time and money. Small shops also know their customers. They must be friendly and helpful since it’s a small shop. Many people like to talk to the shop owner. It feels personal and warm. Small shops also support local workers and families.
                     </p>
                     <p className="mb-4">
                       Second, big malls have many choices. People can buy clothes, shoes, phones, and more. Malls are fun places to visit with family and friends. You can eat, shop, and relax in one place. But sometimes they are far and crowded. Not everyone likes that. Some people feel tired after walking in a big mall. Also, prices in malls can be higher.
                     </p>
                     <p>
                       In conclusion, small shops and big malls are both useful. Small shops help people in the neighborhood. Big malls give many options. We should not replace small shops. We should keep both so people can choose where to shop.
                     </p>
                   </div>
                 </div>

                 <div className="space-y-4 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <BookOpen className="h-5 w-5 text-primary" /> Reading Comprehension Questions
                   </h3>
                   
                   <div className="grid gap-6 md:grid-cols-2">
                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Part A: Multiple Choice</CardTitle></CardHeader>
                       <CardContent className="text-sm space-y-4">
                         <div>
                           <p className="font-medium mb-1">1. What is the writer’s opinion about small shops and big malls?</p>
                           <p className="text-muted-foreground pl-4 border-l-2">c) Both are important</p>
                         </div>
                         <div>
                           <p className="font-medium mb-1">2. Why do people like small shops?</p>
                           <p className="text-muted-foreground pl-4 border-l-2">b) They are friendly and close to home</p>
                         </div>
                         <div>
                           <p className="font-medium mb-1">3. What can people do in big malls?</p>
                           <p className="text-muted-foreground pl-4 border-l-2">b) Eat, shop, and relax</p>
                         </div>
                         <div>
                           <p className="font-medium mb-1">4. What is one problem with big malls?</p>
                           <p className="text-muted-foreground pl-4 border-l-2">c) They can be far and tiring</p>
                         </div>
                         <div>
                           <p className="font-medium mb-1">5. What does the writer suggest at the end?</p>
                           <p className="text-muted-foreground pl-4 border-l-2">b) Keep both small shops and malls</p>
                         </div>
                       </CardContent>
                     </Card>

                     <div className="space-y-6">
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Part B: True or False</CardTitle></CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p>1. Small shops are close to home. <strong>True</strong></p>
                            <p>2. Big malls have fewer choices than small shops. <strong>False</strong></p>
                            <p>3. Prices in malls can be higher. <strong>True</strong></p>
                            <p>4. The writer likes only small shops. <strong>False</strong></p>
                            <p>5. People can relax in big malls. <strong>True</strong></p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Vocabulary Check</CardTitle></CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><strong>1. Replace:</strong> b) To take the place of something</p>
                            <p><strong>2. Neighborhood:</strong> d) Area near your home</p>
                            <p><strong>3. Crowded:</strong> a) Full of people</p>
                            <p><strong>4. Options:</strong> c) Choices</p>
                            <p><strong>5. Personal:</strong> e) Friendly and warm</p>
                          </CardContent>
                        </Card>
                     </div>
                   </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Writing Tasks: Signal Words</h2>
               <p className="text-muted-foreground mb-6">Complete the sentences below by writing in the blanks the appropriate signal words.</p>

               <div className="space-y-6">
                  <div className="bg-muted/30 p-6 rounded-lg border">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                       <List className="h-5 w-5 text-primary" /> Word Bank
                     </h3>
                     <div className="flex flex-wrap gap-2">
                       {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map((word, i) => (
                         <Badge key={i} variant="secondary" className="text-sm py-1 px-3 bg-white hover:bg-white">{word}</Badge>
                       ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Task 1: Trees</CardTitle></CardHeader>
                       <CardContent className="text-lg leading-loose">
                         Trees are subject to disease, decay and death. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t1-1": v})}>
                             <SelectTrigger className={signalResults["t1-1"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t1-1"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , when a tree is wounded, the fungus spores get into the wound. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t1-2": v})}>
                             <SelectTrigger className={signalResults["t1-2"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t1-2"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         it germinates and sends out creeping treads that attack the cell tissue. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t1-3": v})}>
                             <SelectTrigger className={signalResults["t1-3"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t1-3"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         the tree dies unless a tree surgeon saves it.
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Task 2: Processing Data</CardTitle></CardHeader>
                       <CardContent className="text-lg leading-loose">
                         Processing data takes place in several stages. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t2-1": v})}>
                             <SelectTrigger className={signalResults["t2-1"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t2-1"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         is input. The data, which is typed on the keyboard, arrives at the computer from an outside source. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t2-2": v})}>
                             <SelectTrigger className={signalResults["t2-2"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t2-2"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , the data will go straight into the computers central processing unit where it is being processed. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t2-3": v})}>
                             <SelectTrigger className={signalResults["t2-3"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t2-3"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , the data is processed for results. The computer makes the calculation with a device called the arithmetic / logic unit. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t2-4": v})}>
                             <SelectTrigger className={signalResults["t2-4"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t2-4"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         the computer might display on the monitor or print the results on paper.
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Task 3: Canning Sardines</CardTitle></CardHeader>
                       <CardContent className="text-lg leading-loose">
                         Here is how sardines are canned. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t3-1": v})}>
                             <SelectTrigger className={signalResults["t3-1"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t3-1"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , the head is removed, and each fish is cleaned and gutted. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t3-2": v})}>
                             <SelectTrigger className={signalResults["t3-2"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t3-2"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         the fish is placed in an enormous pressure cooker to which soya oil, spices, salt, and artificial and flavoring are added. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t3-3": v})}>
                             <SelectTrigger className={signalResults["t3-3"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t3-3"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , the sardines are placed into cans. Carrots and pickled cucumbers are mixed before the cans are sealed to keep the contents contamination free. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t3-4": v})}>
                             <SelectTrigger className={signalResults["t3-4"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t3-4"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         the cans are labeled, packed in boxes, and dispatched to the shops.
                       </CardContent>
                     </Card>
                     
                     <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-lg font-bold">
                           {signalScore !== null && <span>Score: {signalScore} / 11</span>}
                        </div>
                        <Button onClick={checkSignalWords} className="w-32">Check Answers</Button>
                     </div>
                  </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Understanding WH Questions</h2>
               <p className="text-muted-foreground mb-6">Learn how to use Who, What, Where, Why, and How correctly.</p>

               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Key Concepts
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     <div className="bg-white p-3 rounded border text-center">
                       <span className="block font-bold text-primary mb-1">Who</span>
                       <span className="text-sm text-muted-foreground">Person / People</span>
                     </div>
                     <div className="bg-white p-3 rounded border text-center">
                       <span className="block font-bold text-primary mb-1">What</span>
                       <span className="text-sm text-muted-foreground">Thing / Action</span>
                     </div>
                     <div className="bg-white p-3 rounded border text-center">
                       <span className="block font-bold text-primary mb-1">Where</span>
                       <span className="text-sm text-muted-foreground">Place</span>
                     </div>
                     <div className="bg-white p-3 rounded border text-center">
                       <span className="block font-bold text-primary mb-1">Why</span>
                       <span className="text-sm text-muted-foreground">Reason</span>
                     </div>
                     <div className="bg-white p-3 rounded border text-center">
                       <span className="block font-bold text-primary mb-1">How</span>
                       <span className="text-sm text-muted-foreground">Way / Method</span>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 1: Short Text + Questions</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Maria goes to the market. She buys bananas and apples. She wants to make fruit salad.</p>
                       </div>
                       <div className="space-y-3">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                           <p className="text-sm font-medium">Who goes to the market?</p>
                           <div>
                             <Input 
                               value={whAnswers["ex1-who"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex1-who": e.target.value})}
                               className={whResults["ex1-who"] === true ? "border-green-500 bg-green-50" : whResults["ex1-who"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex1-who"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Maria</span>}
                           </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                           <p className="text-sm font-medium">What does she buy?</p>
                           <div>
                             <Input 
                               value={whAnswers["ex1-what"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex1-what": e.target.value})}
                               className={whResults["ex1-what"] === true ? "border-green-500 bg-green-50" : whResults["ex1-what"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex1-what"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Bananas and apples</span>}
                           </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                           <p className="text-sm font-medium">Where does she go?</p>
                           <div>
                             <Input 
                               value={whAnswers["ex1-where"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex1-where": e.target.value})}
                               className={whResults["ex1-where"] === true ? "border-green-500 bg-green-50" : whResults["ex1-where"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex1-where"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: To the market</span>}
                           </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                           <p className="text-sm font-medium">Why does she buy fruit?</p>
                           <div>
                             <Input 
                               value={whAnswers["ex1-why"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex1-why": e.target.value})}
                               className={whResults["ex1-why"] === true ? "border-green-500 bg-green-50" : whResults["ex1-why"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex1-why"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: To make fruit salad</span>}
                           </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                           <p className="text-sm font-medium">How will she use the fruit?</p>
                           <div>
                             <Input 
                               value={whAnswers["ex1-how"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex1-how": e.target.value})}
                               className={whResults["ex1-how"] === true ? "border-green-500 bg-green-50" : whResults["ex1-how"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex1-how"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: By making a salad</span>}
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 2: Fill in the Blanks</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Ben plays football in the park. He plays with his friends because he likes sports.</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Who:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex2-who"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex2-who": e.target.value})}
                               className={whResults["ex2-who"] === true ? "border-green-500 bg-green-50" : whResults["ex2-who"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Ben..."
                             />
                             {whResults["ex2-who"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Ben / Friends</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">What:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex2-what"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex2-what": e.target.value})}
                               className={whResults["ex2-what"] === true ? "border-green-500 bg-green-50" : whResults["ex2-what"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Plays..."
                             />
                             {whResults["ex2-what"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Plays football</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Where:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex2-where"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex2-where": e.target.value})}
                               className={whResults["ex2-where"] === true ? "border-green-500 bg-green-50" : whResults["ex2-where"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="In the..."
                             />
                             {whResults["ex2-where"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: In the park</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Why:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex2-why"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex2-why": e.target.value})}
                               className={whResults["ex2-why"] === true ? "border-green-500 bg-green-50" : whResults["ex2-why"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Because..."
                             />
                             {whResults["ex2-why"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Because he likes sports</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">How:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex2-how"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex2-how": e.target.value})}
                               className={whResults["ex2-how"] === true ? "border-green-500 bg-green-50" : whResults["ex2-how"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="With..."
                             />
                             {whResults["ex2-how"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: With his friends</span>}
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 3: Match Questions to Answers</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Sara reads books in the library. She reads every Saturday to learn new things.</p>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                         <div className="bg-white p-3 rounded border text-center">
                           <span className="block font-bold text-primary mb-2">Who?</span>
                           <Select onValueChange={(v) => setWhAnswers({...whAnswers, "ex3-who": v})}>
                             <SelectTrigger className={whResults["ex3-who"] === true ? "border-green-500 bg-green-50 h-8 mt-2" : whResults["ex3-who"] === false ? "border-red-500 bg-red-50 h-8 mt-2" : "h-8 mt-2"}>
                               <SelectValue placeholder="Select" />
                             </SelectTrigger>
                             <SelectContent>
                               {["Sara", "Reads books", "In the library", "To learn new things", "Every Saturday"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           {whResults["ex3-who"] === false && <span className="text-xs text-red-500 mt-1 block">Sara</span>}
                         </div>
                         <div className="bg-white p-3 rounded border text-center">
                           <span className="block font-bold text-primary mb-2">What?</span>
                           <Select onValueChange={(v) => setWhAnswers({...whAnswers, "ex3-what": v})}>
                             <SelectTrigger className={whResults["ex3-what"] === true ? "border-green-500 bg-green-50 h-8 mt-2" : whResults["ex3-what"] === false ? "border-red-500 bg-red-50 h-8 mt-2" : "h-8 mt-2"}>
                               <SelectValue placeholder="Select" />
                             </SelectTrigger>
                             <SelectContent>
                               {["Sara", "Reads books", "In the library", "To learn new things", "Every Saturday"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           {whResults["ex3-what"] === false && <span className="text-xs text-red-500 mt-1 block">Reads books</span>}
                         </div>
                         <div className="bg-white p-3 rounded border text-center">
                           <span className="block font-bold text-primary mb-2">Where?</span>
                           <Select onValueChange={(v) => setWhAnswers({...whAnswers, "ex3-where": v})}>
                             <SelectTrigger className={whResults["ex3-where"] === true ? "border-green-500 bg-green-50 h-8 mt-2" : whResults["ex3-where"] === false ? "border-red-500 bg-red-50 h-8 mt-2" : "h-8 mt-2"}>
                               <SelectValue placeholder="Select" />
                             </SelectTrigger>
                             <SelectContent>
                               {["Sara", "Reads books", "In the library", "To learn new things", "Every Saturday"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           {whResults["ex3-where"] === false && <span className="text-xs text-red-500 mt-1 block">In the library</span>}
                         </div>
                         <div className="bg-white p-3 rounded border text-center">
                           <span className="block font-bold text-primary mb-2">Why?</span>
                           <Select onValueChange={(v) => setWhAnswers({...whAnswers, "ex3-why": v})}>
                             <SelectTrigger className={whResults["ex3-why"] === true ? "border-green-500 bg-green-50 h-8 mt-2" : whResults["ex3-why"] === false ? "border-red-500 bg-red-50 h-8 mt-2" : "h-8 mt-2"}>
                               <SelectValue placeholder="Select" />
                             </SelectTrigger>
                             <SelectContent>
                               {["Sara", "Reads books", "In the library", "To learn new things", "Every Saturday"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           {whResults["ex3-why"] === false && <span className="text-xs text-red-500 mt-1 block">To learn new things</span>}
                         </div>
                         <div className="bg-white p-3 rounded border text-center">
                           <span className="block font-bold text-primary mb-2">How?</span>
                           <Select onValueChange={(v) => setWhAnswers({...whAnswers, "ex3-how": v})}>
                             <SelectTrigger className={whResults["ex3-how"] === true ? "border-green-500 bg-green-50 h-8 mt-2" : whResults["ex3-how"] === false ? "border-red-500 bg-red-50 h-8 mt-2" : "h-8 mt-2"}>
                               <SelectValue placeholder="Select" />
                             </SelectTrigger>
                             <SelectContent>
                               {["Sara", "Reads books", "In the library", "To learn new things", "Every Saturday"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           {whResults["ex3-how"] === false && <span className="text-xs text-red-500 mt-1 block">Every Saturday</span>}
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                   
                   <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold">
                         {whScore !== null && <span>Score: {whScore} / 15</span>}
                      </div>
                      <Button onClick={checkWhQuestions} className="w-32">Check Answers</Button>
                   </div>
                 </div>
               </div>
             </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Resources
            </Button>
          </Link>
          <h1 className="font-serif font-bold text-xl hidden md:block">
            {resourceTitle}
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full justify-start md:justify-center bg-muted/50 p-1 h-auto flex-wrap">
            {Object.keys(CHARTS).map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(CHARTS).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                    <div className="aspect-video w-full bg-muted border-b relative group">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain bg-white p-4 transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-serif font-bold text-lg text-primary">{item.title}</h3>
                      <div className="bg-muted/30 p-4 rounded-lg border text-sm leading-relaxed text-muted-foreground">
                        <span className="font-bold text-foreground block mb-2 text-xs uppercase tracking-wider">Model Answer</span>
                        {item.answer}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}