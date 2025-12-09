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

  // State for Essay Blanks (Essay 3 & 4)
  const [essayBlanksAnswers, setEssayBlanksAnswers] = useState<Record<string, string>>({});
  const [essayBlanksResults, setEssayBlanksResults] = useState<Record<string, boolean>>({});
  const [essayBlanksScore, setEssayBlanksScore] = useState<number | null>(null);

  // State for Essay Practice 2 (Small Local Shops)
  const [essay2Answers, setEssay2Answers] = useState<Record<string, string>>({});
  const [essay2Results, setEssay2Results] = useState<Record<string, boolean>>({});
  const [essay2Score, setEssay2Score] = useState<number | null>(null);

  // State for Space Exploration - Extended Reading & Writing
  const [spaceBlanksAnswers, setSpaceBlanksAnswers] = useState<Record<string, string>>({});
  const [spaceBlanksResults, setSpaceBlanksResults] = useState<Record<string, boolean>>({});
  const [spaceBlanksScore, setSpaceBlanksScore] = useState<number | null>(null);
  const [showSpaceKey, setShowSpaceKey] = useState(false);

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

  const checkEssayBlanks = () => {
    const KEY: Record<string, string> = {
      // Essay 3
      "e3-1": "common practice",
      "e3-2": "benefits",
      "e3-3": "drawbacks",
      "e3-4": "hybrid model",
      "e3-5": "flexibility",
      "e3-6": "work-life balance",
      "e3-7": "isolating",
      "e3-8": "productivity",
      "e3-9": "compromise",
      "e3-10": "social interaction",

      // Essay 4
      "e4-1": "urgent action",
      "e4-2": "responsibility",
      "e4-3": "laws",
      "e4-4": "renewable energy",
      "e4-5": "recycle",
      "e4-6": "policies",
      "e4-7": "pollution",
      "e4-8": "cleaner methods",
      "e4-9": "accountable",
      "e4-10": "sustainably",
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (essayBlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      
      // Allow some flexibility
      let isCorrect = userAns.includes(correctKey) || correctKey.includes(userAns);
      
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setEssayBlanksResults(newResults);
    setEssayBlanksScore(correctCount);
  };

  const checkEssay2 = () => {
    const KEY: Record<string, string> = {
      "p2-a1": "c",
      "p2-a2": "b",
      "p2-a3": "b",
      "p2-a4": "c",
      "p2-a5": "b",
      "p2-b1": "true",
      "p2-b2": "false",
      "p2-b3": "true",
      "p2-b4": "false",
      "p2-b5": "true",
      "p2-v1": "b",
      "p2-v2": "d",
      "p2-v3": "a",
      "p2-v4": "c",
      "p2-v5": "e"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (essay2Answers[id] || "").toLowerCase();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns === correctKey;
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setEssay2Results(newResults);
    setEssay2Score(correctCount);
  };


  const checkSpaceBlanks = () => {
    const KEY: Record<string, string> = {
      "1": "curiosity",
      "2": "universe",
      "3": "controversial",
      "4": "technologies",
      "5": "resources",
      "6": "habitable",
      "7": "budget",
      "8": "prioritize",
      "9": "benefits",
      "10": "investment"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (spaceBlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns === correctKey;
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setSpaceBlanksResults(newResults);
    setSpaceBlanksScore(correctCount);
  };

  // Reset Functions
  const resetSwtBlanks = () => { setSwtBlanksAnswers({}); setSwtBlanksResults({}); setSwtBlanksScore(null); };
  const resetSwt2Blanks = () => { setSwt2BlanksAnswers({}); setSwt2BlanksResults({}); setSwt2BlanksScore(null); };
  const resetSwt3Blanks = () => { setSwt3BlanksAnswers({}); setSwt3BlanksResults({}); setSwt3BlanksScore(null); };
  const resetSwt4Blanks = () => { setSwt4BlanksAnswers({}); setSwt4BlanksResults({}); setSwt4BlanksScore(null); };
  const resetSwt5Blanks = () => { setSwt5BlanksAnswers({}); setSwt5BlanksResults({}); setSwt5BlanksScore(null); };
  const resetSignalWords = () => { setSignalAnswers({}); setSignalResults({}); setSignalScore(null); };
  const resetWhQuestions = () => { setWhAnswers({}); setWhResults({}); setWhScore(null); };
  const resetEssayBlanks = () => { setEssayBlanksAnswers({}); setEssayBlanksResults({}); setEssayBlanksScore(null); };
  const resetEssay2 = () => { setEssay2Answers({}); setEssay2Results({}); setEssay2Score(null); };
  const resetSpaceBlanks = () => { 
    setSpaceBlanksAnswers({}); 
    setSpaceBlanksResults({}); 
    setSpaceBlanksScore(null); 
    setShowSpaceKey(false);
  };

  // State for SWT Practice 3
  const [swt3BlanksAnswers, setSwt3BlanksAnswers] = useState<Record<string, string>>({});
  const [swt3BlanksResults, setSwt3BlanksResults] = useState<Record<string, boolean>>({});
  const [swt3BlanksScore, setSwt3BlanksScore] = useState<number | null>(null);

  // State for SWT Practice 4
  const [swt4BlanksAnswers, setSwt4BlanksAnswers] = useState<Record<string, string>>({});
  const [swt4BlanksResults, setSwt4BlanksResults] = useState<Record<string, boolean>>({});
  const [swt4BlanksScore, setSwt4BlanksScore] = useState<number | null>(null);

  // State for SWT Practice 5
  const [swt5BlanksAnswers, setSwt5BlanksAnswers] = useState<Record<string, string>>({});
  const [swt5BlanksResults, setSwt5BlanksResults] = useState<Record<string, boolean>>({});
  const [swt5BlanksScore, setSwt5BlanksScore] = useState<number | null>(null);

  const checkSwt3Blanks = () => {
    const KEY: Record<string, string> = {
      "swt3_b1": "flexibility",
      "swt3_b2": "convenience",
      "swt3_b3": "home",
      "swt3_b4": "self-discipline",
      "swt3_b5": "freedom",
      "swt3_b6": "responsibility"
    };
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    Object.keys(KEY).forEach(id => {
      const userAns = (swt3BlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns.includes(correctKey) || (id === "swt3_b1" && userAns.includes("flexible"));
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });
    setSwt3BlanksResults(newResults);
    setSwt3BlanksScore(correctCount);
  };

  const checkSwt4Blanks = () => {
    const KEY: Record<string, string> = {
      "swt4_b1": "essential",
      "swt4_b2": "waste",
      "swt4_b3": "climate change",
      "swt4_b4": "everyone",
      "swt4_b5": "planet"
    };
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    Object.keys(KEY).forEach(id => {
      const userAns = (swt4BlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns.includes(correctKey);
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });
    setSwt4BlanksResults(newResults);
    setSwt4BlanksScore(correctCount);
  };

  const checkSwt5Blanks = () => {
    const KEY: Record<string, string> = {
      "swt5_b1": "balanced diet",
      "swt5_b2": "nutrients",
      "swt5_b3": "sugar",
      "swt5_b4": "exercise"
    };
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    Object.keys(KEY).forEach(id => {
      const userAns = (swt5BlanksAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      const isCorrect = userAns.includes(correctKey);
      newResults[id] = isCorrect;
      if (isCorrect) correctCount++;
    });
    setSwt5BlanksResults(newResults);
    setSwt5BlanksScore(correctCount);
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
      "t3-4": ["finally"],
      // Task 4: Simple Contrast
      "t4-1": ["however", "on the other hand"],
      "t4-2": ["but", "although", "while"],
      // Task 5: Complex Contrast
      "t5-1": ["in contrast", "on the other hand"],
      "t5-2": ["while", "although"],
      "t5-3": ["nevertheless", "however"]
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
      "ex3-how": "every saturday",

      // Exercise 4
      "ex4-who": "smith family",
      "ex4-where": "italy",
      "ex4-when": "last summer",
      "ex4-why": "colosseum",
      "ex4-how": "plane",

      // Exercise 5
      "ex5-who": "sarah",
      "ex5-what": "job interview",
      "ex5-when": "next monday",
      "ex5-why": "good impression",
      "ex5-how": "research",

      // Exercise 6
      "ex6-who": "scientists",
      "ex6-where": "geneva",
      "ex6-when": "yesterday",
      "ex6-why": "global warming",
      "ex6-what": "sea levels"
    };

    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    Object.keys(KEY).forEach(id => {
      const userAns = (whAnswers[id] || "").toLowerCase().trim();
      const correctKey = KEY[id].toLowerCase();
      
      // Loose matching logic
      let isCorrect = userAns.includes(correctKey);

      // Special cases for loose matching on new exercises
      if (id === "ex4-where" && (userAns.includes("rome") || userAns.includes("hotel"))) isCorrect = true;
      if (id === "ex4-how" && (userAns.includes("car") || userAns.includes("rented"))) isCorrect = true;
      if (id === "ex5-how" && (userAns.includes("formal") || userAns.includes("suit"))) isCorrect = true;
      if (id === "ex6-why" && (userAns.includes("carbon") || userAns.includes("emissions"))) isCorrect = true;
      if (id === "ex6-what" && (userAns.includes("plan") || userAns.includes("data"))) isCorrect = true;

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

                 <div className="space-y-6 border-t pt-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <List className="h-5 w-5 text-primary" /> Step-by-Step Guide
                   </h3>
                   
                   <div className="grid gap-4 md:grid-cols-1">
                     <div className="bg-white p-5 rounded border space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 1: Understand the Task</h4>
                            <p className="text-sm">You have 10 minutes to read a passage (up to 300 words) and write ONE sentence (5–75 words) summarizing the main idea.</p>
                            <p className="text-sm font-medium">Goal: Capture the essence of the text, not every detail.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 2: Read and Identify Key Points</h4>
                            <p className="text-sm">Skim the passage quickly for:</p>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>Topic (What is it about?)</li>
                                <li>Main argument or purpose</li>
                                <li>Supporting points (usually 2–3)</li>
                                <li>Conclusion (often in the last sentence)</li>
                            </ul>
                            <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 font-medium">
                                Tip: Look for keywords like <em>however, therefore, in conclusion, but</em>—they signal important ideas.
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 3: Combine Ideas into One Sentence</h4>
                            <p className="text-sm">Use this formula: <strong>Main topic + key supporting points + conclusion</strong></p>
                            <div className="bg-slate-50 p-3 rounded border text-sm italic">
                                Example: Technology makes life easier and more connected, but it also causes distractions and health problems, so people need to use it responsibly.
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 4: Paraphrase</h4>
                            <p className="text-sm">Avoid copying exact sentences. Use synonyms and change sentence structure.</p>
                            <ul className="text-sm space-y-1 pl-4 border-l-2 border-blue-200">
                                <li>“Technology offers convenience” → “Technology makes life easier.”</li>
                                <li>“Requires balance” → “Needs responsible use.”</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 5: Check Grammar and Punctuation</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>Use one full stop only (it must be ONE sentence).</li>
                                <li>Use commas or conjunctions (and, but, so) to join ideas.</li>
                                <li>Avoid fragments or run-on sentences.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 6: Keep It Concise</h4>
                            <p className="text-sm">Ideal length: 25–40 words. Remove unnecessary details (examples, statistics, minor points).</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-base text-blue-700">Step 7: Review Before Submitting</h4>
                            <p className="text-sm">Check: Is it ONE sentence? Does it include the main idea and conclusion? Is grammar correct?</p>
                        </div>
                     </div>

                     <div className="bg-red-50 p-5 rounded border border-red-100">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <X className="h-4 w-4" /> Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-1 text-sm text-red-700">
                            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" /> Writing more than one sentence.</li>
                            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" /> Copying text directly.</li>
                            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" /> Missing the conclusion or main argument.</li>
                            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" /> Making the sentence too short (less than 5 words) or too long (over 75 words).</li>
                        </ul>
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
                           Anna likes to eat apples every day because it's her favorite fruit.
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
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={resetSwtBlanks}>Reset</Button>
                             <Button onClick={checkSwtBlanks} className="w-32">Check Answers</Button>
                          </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="mt-8">
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 3: Online Learning</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           Online learning has become very popular because it is flexible and convenient. Students can study from home and choose their own schedule. However, it requires self-discipline and good time management. In short, online education offers great freedom but also needs responsibility.
                         </p>
                       </div>
                       <div className="space-y-4">
                         <p className="font-medium text-sm text-muted-foreground uppercase">Complete the summary</p>
                         <div className="bg-white p-6 rounded border leading-loose text-lg">
                           Online learning is popular due to its 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b1"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b1": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt3BlanksResults["swt3_b1"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b1"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b1"] === false && <span className="text-xs text-red-500 block text-center">flexibility</span>}
                           </span>
                           and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b2"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b2": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt3BlanksResults["swt3_b2"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b2"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b2"] === false && <span className="text-xs text-red-500 block text-center">convenience</span>}
                           </span>
                           . It allows students to study from 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b3"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b3": e.target.value})}
                               className={`w-24 inline-flex h-8 ${swt3BlanksResults["swt3_b3"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b3"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b3"] === false && <span className="text-xs text-red-500 block text-center">home</span>}
                           </span>
                           . However, it demands 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b4"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b4": e.target.value})}
                               className={`w-40 inline-flex h-8 ${swt3BlanksResults["swt3_b4"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b4"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b4"] === false && <span className="text-xs text-red-500 block text-center">self-discipline</span>}
                           </span>
                           . Therefore, it offers 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b5"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b5": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt3BlanksResults["swt3_b5"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b5"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b5"] === false && <span className="text-xs text-red-500 block text-center">freedom</span>}
                           </span>
                           but requires 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt3BlanksAnswers["swt3_b6"] || ""} 
                               onChange={(e) => setSwt3BlanksAnswers({...swt3BlanksAnswers, "swt3_b6": e.target.value})}
                               className={`w-36 inline-flex h-8 ${swt3BlanksResults["swt3_b6"] === true ? "border-green-500 bg-green-50" : swt3BlanksResults["swt3_b6"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt3BlanksResults["swt3_b6"] === false && <span className="text-xs text-red-500 block text-center">responsibility</span>}
                           </span>
                           .
                         </div>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-bold">
                             {swt3BlanksScore !== null && <span>Score: {swt3BlanksScore} / 6</span>}
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={resetSwt3Blanks}>Reset</Button>
                             <Button onClick={checkSwt3Blanks} className="w-32">Check Answers</Button>
                          </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="mt-8">
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 4: Environmental Protection</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           Protecting the environment is essential for our future. We need to reduce waste, recycle more, and use renewable energy. If we do not act now, climate change will cause serious damage. Everyone must work together to save our planet.
                         </p>
                       </div>
                       <div className="space-y-4">
                         <p className="font-medium text-sm text-muted-foreground uppercase">Complete the summary</p>
                         <div className="bg-white p-6 rounded border leading-loose text-lg">
                           Environmental protection is 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt4BlanksAnswers["swt4_b1"] || ""} 
                               onChange={(e) => setSwt4BlanksAnswers({...swt4BlanksAnswers, "swt4_b1": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt4BlanksResults["swt4_b1"] === true ? "border-green-500 bg-green-50" : swt4BlanksResults["swt4_b1"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt4BlanksResults["swt4_b1"] === false && <span className="text-xs text-red-500 block text-center">essential</span>}
                           </span>
                           for the future. We must reduce 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt4BlanksAnswers["swt4_b2"] || ""} 
                               onChange={(e) => setSwt4BlanksAnswers({...swt4BlanksAnswers, "swt4_b2": e.target.value})}
                               className={`w-28 inline-flex h-8 ${swt4BlanksResults["swt4_b2"] === true ? "border-green-500 bg-green-50" : swt4BlanksResults["swt4_b2"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt4BlanksResults["swt4_b2"] === false && <span className="text-xs text-red-500 block text-center">waste</span>}
                           </span>
                           and recycle more. Inaction on 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt4BlanksAnswers["swt4_b3"] || ""} 
                               onChange={(e) => setSwt4BlanksAnswers({...swt4BlanksAnswers, "swt4_b3": e.target.value})}
                               className={`w-40 inline-flex h-8 ${swt4BlanksResults["swt4_b3"] === true ? "border-green-500 bg-green-50" : swt4BlanksResults["swt4_b3"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt4BlanksResults["swt4_b3"] === false && <span className="text-xs text-red-500 block text-center">climate change</span>}
                           </span>
                           will cause damage. 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt4BlanksAnswers["swt4_b4"] || ""} 
                               onChange={(e) => setSwt4BlanksAnswers({...swt4BlanksAnswers, "swt4_b4": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt4BlanksResults["swt4_b4"] === true ? "border-green-500 bg-green-50" : swt4BlanksResults["swt4_b4"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt4BlanksResults["swt4_b4"] === false && <span className="text-xs text-red-500 block text-center">Everyone</span>}
                           </span>
                           needs to cooperate to save the 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt4BlanksAnswers["swt4_b5"] || ""} 
                               onChange={(e) => setSwt4BlanksAnswers({...swt4BlanksAnswers, "swt4_b5": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt4BlanksResults["swt4_b5"] === true ? "border-green-500 bg-green-50" : swt4BlanksResults["swt4_b5"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt4BlanksResults["swt4_b5"] === false && <span className="text-xs text-red-500 block text-center">planet</span>}
                           </span>
                           .
                         </div>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-bold">
                             {swt4BlanksScore !== null && <span>Score: {swt4BlanksScore} / 5</span>}
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={resetSwt4Blanks}>Reset</Button>
                             <Button onClick={checkSwt4Blanks} className="w-32">Check Answers</Button>
                          </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="mt-8">
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 5: Health and Diet</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                       <div className="bg-muted p-4 rounded-lg border">
                         <p className="mb-2 font-medium text-sm text-muted-foreground uppercase">Text</p>
                         <p className="leading-relaxed">
                           A balanced diet is key to a healthy life. Eating fruits, vegetables, and whole grains provides necessary nutrients. Avoiding too much sugar and processed food helps prevent diseases. Combining good food with regular exercise ensures a strong body and mind.
                         </p>
                       </div>
                       <div className="space-y-4">
                         <p className="font-medium text-sm text-muted-foreground uppercase">Complete the summary</p>
                         <div className="bg-white p-6 rounded border leading-loose text-lg">
                           A 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt5BlanksAnswers["swt5_b1"] || ""} 
                               onChange={(e) => setSwt5BlanksAnswers({...swt5BlanksAnswers, "swt5_b1": e.target.value})}
                               className={`w-40 inline-flex h-8 ${swt5BlanksResults["swt5_b1"] === true ? "border-green-500 bg-green-50" : swt5BlanksResults["swt5_b1"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt5BlanksResults["swt5_b1"] === false && <span className="text-xs text-red-500 block text-center">balanced diet</span>}
                           </span>
                           is crucial for health. Fruits and vegetables provide 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt5BlanksAnswers["swt5_b2"] || ""} 
                               onChange={(e) => setSwt5BlanksAnswers({...swt5BlanksAnswers, "swt5_b2": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt5BlanksResults["swt5_b2"] === true ? "border-green-500 bg-green-50" : swt5BlanksResults["swt5_b2"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt5BlanksResults["swt5_b2"] === false && <span className="text-xs text-red-500 block text-center">nutrients</span>}
                           </span>
                           . Avoiding 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt5BlanksAnswers["swt5_b3"] || ""} 
                               onChange={(e) => setSwt5BlanksAnswers({...swt5BlanksAnswers, "swt5_b3": e.target.value})}
                               className={`w-28 inline-flex h-8 ${swt5BlanksResults["swt5_b3"] === true ? "border-green-500 bg-green-50" : swt5BlanksResults["swt5_b3"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt5BlanksResults["swt5_b3"] === false && <span className="text-xs text-red-500 block text-center">sugar</span>}
                           </span>
                           helps prevent diseases. Good food and 
                           <span className="inline-block mx-1">
                             <Input 
                               value={swt5BlanksAnswers["swt5_b4"] || ""} 
                               onChange={(e) => setSwt5BlanksAnswers({...swt5BlanksAnswers, "swt5_b4": e.target.value})}
                               className={`w-32 inline-flex h-8 ${swt5BlanksResults["swt5_b4"] === true ? "border-green-500 bg-green-50" : swt5BlanksResults["swt5_b4"] === false ? "border-red-500 bg-red-50" : ""}`}
                             />
                             {swt5BlanksResults["swt5_b4"] === false && <span className="text-xs text-red-500 block text-center">exercise</span>}
                           </span>
                           ensure a strong body.
                         </div>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-bold">
                             {swt5BlanksScore !== null && <span>Score: {swt5BlanksScore} / 4</span>}
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={resetSwt5Blanks}>Reset</Button>
                             <Button onClick={checkSwt5Blanks} className="w-32">Check Answers</Button>
                          </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-4">Essay Writing Guide</h2>
               <p className="text-muted-foreground mb-6">Master the structure of a high-scoring essay with these proven templates.</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <List className="h-5 w-5 text-primary" /> Sentence Structures for Essay Writing
                   </h3>
                   
                   <div className="space-y-6">
                     {/* Introduction Section */}
                     <div className="bg-white p-4 rounded border border-blue-100 shadow-sm">
                       <h4 className="font-bold text-blue-700 uppercase text-sm mb-3 flex items-center gap-2">
                         <span className="bg-blue-100 px-2 py-0.5 rounded">1</span> Introduction
                       </h4>
                       <div className="grid gap-4 md:grid-cols-2">
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Opinion Template</p>
                           <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                             Some people believe that <span className="text-blue-600">[topic]</span>, while others think <span className="text-blue-600">[opposite idea]</span>. I believe <span className="text-blue-600">[your opinion]</span> because <span className="text-blue-600">[reason]</span>.
                           </p>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Discussion Template</p>
                           <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                             <span className="text-blue-600">[Topic]</span> is an important issue today. This essay will discuss <span className="text-blue-600">[point 1]</span> and <span className="text-blue-600">[point 2]</span>.
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Body Paragraphs Section */}
                     <div className="bg-white p-4 rounded border border-purple-100 shadow-sm">
                       <h4 className="font-bold text-purple-700 uppercase text-sm mb-3 flex items-center gap-2">
                         <span className="bg-purple-100 px-2 py-0.5 rounded">2</span> Body Paragraphs
                       </h4>
                       <div className="space-y-3">
                         <div className="grid gap-4 md:grid-cols-2">
                           <div>
                             <p className="text-xs font-bold text-muted-foreground uppercase mb-1">First Point</p>
                             <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                               First, <span className="text-purple-600">[main point]</span>. This is because <span className="text-purple-600">[reason/example]</span>.
                             </p>
                           </div>
                           <div>
                             <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Second Point</p>
                             <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                               Second, <span className="text-purple-600">[main point]</span>. For example, <span className="text-purple-600">[supporting detail]</span>.
                             </p>
                           </div>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Contrast Idea</p>
                           <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                             However, <span className="text-purple-600">[contrast idea]</span>. This shows that <span className="text-purple-600">[explanation]</span>.
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Conclusion Section */}
                     <div className="bg-white p-4 rounded border border-green-100 shadow-sm">
                       <h4 className="font-bold text-green-700 uppercase text-sm mb-3 flex items-center gap-2">
                         <span className="bg-green-100 px-2 py-0.5 rounded">3</span> Conclusion
                       </h4>
                       <div className="grid gap-4 md:grid-cols-2">
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Summary Template</p>
                           <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                             In conclusion, <span className="text-green-600">[summarize main points]</span>. Therefore, <span className="text-green-600">[final opinion]</span>.
                           </p>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Balanced View</p>
                           <p className="text-sm font-medium bg-slate-50 p-2 rounded border">
                             To sum up, <span className="text-green-600">[topic]</span> has both advantages and disadvantages, but <span className="text-green-600">[your recommendation]</span>.
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <List className="h-5 w-5 text-primary" /> Useful Connectors
                   </h3>
                   <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                     <div className="bg-white p-3 rounded border">
                       <span className="font-bold text-xs text-primary uppercase block mb-1">Adding Ideas</span>
                       <p className="text-sm">and, also, moreover, in addition</p>
                     </div>
                     <div className="bg-white p-3 rounded border">
                       <span className="font-bold text-xs text-primary uppercase block mb-1">Contrasting</span>
                       <p className="text-sm">but, however, although, yet</p>
                     </div>
                     <div className="bg-white p-3 rounded border">
                       <span className="font-bold text-xs text-primary uppercase block mb-1">Cause / Effect</span>
                       <p className="text-sm">because, so, therefore, as a result</p>
                     </div>
                     <div className="bg-white p-3 rounded border">
                       <span className="font-bold text-xs text-primary uppercase block mb-1">Examples</span>
                       <p className="text-sm">for example, such as, for instance</p>
                     </div>
                     <div className="bg-white p-3 rounded border sm:col-span-2 md:col-span-2">
                       <span className="font-bold text-xs text-primary uppercase block mb-1">Conclusion</span>
                       <p className="text-sm">in conclusion, to sum up, finally</p>
                     </div>
                   </div>
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
                           <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-a1": v})}>
                             <SelectTrigger className={essay2Results["p2-a1"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-a1"] === false ? "border-red-500 bg-red-50" : ""}>
                               <SelectValue placeholder="Select answer" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="a">a) Small shops are better</SelectItem>
                               <SelectItem value="b">b) Big malls are better</SelectItem>
                               <SelectItem value="c">c) Both are important</SelectItem>
                             </SelectContent>
                           </Select>
                           {essay2Results["p2-a1"] === false && <span className="text-xs text-red-500 mt-1 block">Correct: c) Both are important</span>}
                         </div>
                         <div>
                           <p className="font-medium mb-1">2. Why do people like small shops?</p>
                           <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-a2": v})}>
                             <SelectTrigger className={essay2Results["p2-a2"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-a2"] === false ? "border-red-500 bg-red-50" : ""}>
                               <SelectValue placeholder="Select answer" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="a">a) They have cheap prices</SelectItem>
                               <SelectItem value="b">b) They are friendly and close to home</SelectItem>
                               <SelectItem value="c">c) They are open 24/7</SelectItem>
                             </SelectContent>
                           </Select>
                           {essay2Results["p2-a2"] === false && <span className="text-xs text-red-500 mt-1 block">Correct: b) They are friendly and close to home</span>}
                         </div>
                         <div>
                           <p className="font-medium mb-1">3. What can people do in big malls?</p>
                           <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-a3": v})}>
                             <SelectTrigger className={essay2Results["p2-a3"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-a3"] === false ? "border-red-500 bg-red-50" : ""}>
                               <SelectValue placeholder="Select answer" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="a">a) Only buy clothes</SelectItem>
                               <SelectItem value="b">b) Eat, shop, and relax</SelectItem>
                               <SelectItem value="c">c) Park for free</SelectItem>
                             </SelectContent>
                           </Select>
                           {essay2Results["p2-a3"] === false && <span className="text-xs text-red-500 mt-1 block">Correct: b) Eat, shop, and relax</span>}
                         </div>
                         <div>
                           <p className="font-medium mb-1">4. What is one problem with big malls?</p>
                           <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-a4": v})}>
                             <SelectTrigger className={essay2Results["p2-a4"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-a4"] === false ? "border-red-500 bg-red-50" : ""}>
                               <SelectValue placeholder="Select answer" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="a">a) They are too small</SelectItem>
                               <SelectItem value="b">b) They have no food</SelectItem>
                               <SelectItem value="c">c) They can be far and tiring</SelectItem>
                             </SelectContent>
                           </Select>
                           {essay2Results["p2-a4"] === false && <span className="text-xs text-red-500 mt-1 block">Correct: c) They can be far and tiring</span>}
                         </div>
                         <div>
                           <p className="font-medium mb-1">5. What does the writer suggest at the end?</p>
                           <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-a5": v})}>
                             <SelectTrigger className={essay2Results["p2-a5"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-a5"] === false ? "border-red-500 bg-red-50" : ""}>
                               <SelectValue placeholder="Select answer" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="a">a) Close all big malls</SelectItem>
                               <SelectItem value="b">b) Keep both small shops and malls</SelectItem>
                               <SelectItem value="c">c) Replace small shops</SelectItem>
                             </SelectContent>
                           </Select>
                           {essay2Results["p2-a5"] === false && <span className="text-xs text-red-500 mt-1 block">Correct: b) Keep both small shops and malls</span>}
                         </div>
                       </CardContent>
                     </Card>

                     <div className="space-y-6">
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Part B: True or False</CardTitle></CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span>1. Small shops are close to home.</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant={essay2Answers["p2-b1"] === "true" ? "default" : "outline"} 
                                  size="sm" 
                                  className={`h-7 ${essay2Results["p2-b1"] !== undefined ? (essay2Results["p2-b1"] ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""}`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b1": "true"})}
                                >True</Button>
                                <Button 
                                  variant={essay2Answers["p2-b1"] === "false" ? "default" : "outline"} 
                                  size="sm"
                                  className={`h-7`} 
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b1": "false"})}
                                >False</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>2. Big malls have fewer choices than small shops.</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant={essay2Answers["p2-b2"] === "true" ? "default" : "outline"} 
                                  size="sm" 
                                  className={`h-7`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b2": "true"})}
                                >True</Button>
                                <Button 
                                  variant={essay2Answers["p2-b2"] === "false" ? "default" : "outline"} 
                                  size="sm"
                                  className={`h-7 ${essay2Results["p2-b2"] !== undefined ? (essay2Results["p2-b2"] ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""}`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b2": "false"})}
                                >False</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>3. Prices in malls can be higher.</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant={essay2Answers["p2-b3"] === "true" ? "default" : "outline"} 
                                  size="sm" 
                                  className={`h-7 ${essay2Results["p2-b3"] !== undefined ? (essay2Results["p2-b3"] ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""}`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b3": "true"})}
                                >True</Button>
                                <Button 
                                  variant={essay2Answers["p2-b3"] === "false" ? "default" : "outline"} 
                                  size="sm"
                                  className={`h-7`} 
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b3": "false"})}
                                >False</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>4. The writer likes only small shops.</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant={essay2Answers["p2-b4"] === "true" ? "default" : "outline"} 
                                  size="sm" 
                                  className={`h-7`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b4": "true"})}
                                >True</Button>
                                <Button 
                                  variant={essay2Answers["p2-b4"] === "false" ? "default" : "outline"} 
                                  size="sm"
                                  className={`h-7 ${essay2Results["p2-b4"] !== undefined ? (essay2Results["p2-b4"] ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""}`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b4": "false"})}
                                >False</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>5. People can relax in big malls.</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant={essay2Answers["p2-b5"] === "true" ? "default" : "outline"} 
                                  size="sm" 
                                  className={`h-7 ${essay2Results["p2-b5"] !== undefined ? (essay2Results["p2-b5"] ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""}`}
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b5": "true"})}
                                >True</Button>
                                <Button 
                                  variant={essay2Answers["p2-b5"] === "false" ? "default" : "outline"} 
                                  size="sm"
                                  className={`h-7`} 
                                  onClick={() => setEssay2Answers({...essay2Answers, "p2-b5": "false"})}
                                >False</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Vocabulary Check</CardTitle></CardHeader>
                          <CardContent className="text-sm space-y-4">
                            <div>
                              <p className="font-medium mb-1">1. Replace</p>
                              <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-v1": v})}>
                                <SelectTrigger className={essay2Results["p2-v1"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-v1"] === false ? "border-red-500 bg-red-50" : ""}>
                                  <SelectValue placeholder="Select meaning" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">Full of people</SelectItem>
                                  <SelectItem value="b">To take the place of something</SelectItem>
                                  <SelectItem value="c">Choices</SelectItem>
                                  <SelectItem value="d">Area near your home</SelectItem>
                                  <SelectItem value="e">Friendly and warm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="font-medium mb-1">2. Neighborhood</p>
                              <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-v2": v})}>
                                <SelectTrigger className={essay2Results["p2-v2"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-v2"] === false ? "border-red-500 bg-red-50" : ""}>
                                  <SelectValue placeholder="Select meaning" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">Full of people</SelectItem>
                                  <SelectItem value="b">To take the place of something</SelectItem>
                                  <SelectItem value="c">Choices</SelectItem>
                                  <SelectItem value="d">Area near your home</SelectItem>
                                  <SelectItem value="e">Friendly and warm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="font-medium mb-1">3. Crowded</p>
                              <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-v3": v})}>
                                <SelectTrigger className={essay2Results["p2-v3"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-v3"] === false ? "border-red-500 bg-red-50" : ""}>
                                  <SelectValue placeholder="Select meaning" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">Full of people</SelectItem>
                                  <SelectItem value="b">To take the place of something</SelectItem>
                                  <SelectItem value="c">Choices</SelectItem>
                                  <SelectItem value="d">Area near your home</SelectItem>
                                  <SelectItem value="e">Friendly and warm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="font-medium mb-1">4. Options</p>
                              <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-v4": v})}>
                                <SelectTrigger className={essay2Results["p2-v4"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-v4"] === false ? "border-red-500 bg-red-50" : ""}>
                                  <SelectValue placeholder="Select meaning" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">Full of people</SelectItem>
                                  <SelectItem value="b">To take the place of something</SelectItem>
                                  <SelectItem value="c">Choices</SelectItem>
                                  <SelectItem value="d">Area near your home</SelectItem>
                                  <SelectItem value="e">Friendly and warm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="font-medium mb-1">5. Personal</p>
                              <Select onValueChange={(v) => setEssay2Answers({...essay2Answers, "p2-v5": v})}>
                                <SelectTrigger className={essay2Results["p2-v5"] === true ? "border-green-500 bg-green-50" : essay2Results["p2-v5"] === false ? "border-red-500 bg-red-50" : ""}>
                                  <SelectValue placeholder="Select meaning" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">Full of people</SelectItem>
                                  <SelectItem value="b">To take the place of something</SelectItem>
                                  <SelectItem value="c">Choices</SelectItem>
                                  <SelectItem value="d">Area near your home</SelectItem>
                                  <SelectItem value="e">Friendly and warm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold">
                         {essay2Score !== null && <span>Score: {essay2Score} / 15</span>}
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" onClick={resetEssay2}>Reset</Button>
                         <Button 
                           onClick={checkEssay2} 
                           className="w-32"
                           disabled={Object.keys(essay2Answers).length < 15}
                         >
                           {Object.keys(essay2Answers).length < 15 ? `Complete All (${Object.keys(essay2Answers).length}/15)` : "Check Answers"}
                         </Button>
                      </div>
                   </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Essay Practice 3</h2>
               <p className="text-muted-foreground mb-6">Topic: Remote Working</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Prompt
                   </h3>
                   <p className="text-lg font-medium">
                     Some companies are asking employees to return to the office full-time, while others allow remote working. Discuss the advantages and disadvantages of remote working and give your opinion.
                   </p>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" /> Fill in the Blanks
                   </h3>
                   <div className="bg-white p-6 rounded-lg border leading-loose text-lg">
                     <p className="mb-4">
                       Since the pandemic, remote working has become a 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-1"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-1": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-1"] === true ? "text-green-600" : essayBlanksResults["e3-1"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="1" 
                         />
                       </span>. 
                       Many employees enjoy working from home, but some companies want them back in the office. This essay will discuss both the 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-2"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-2": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-2"] === true ? "text-green-600" : essayBlanksResults["e3-2"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="2" 
                         />
                       </span> 
                       and 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-3"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-3": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-3"] === true ? "text-green-600" : essayBlanksResults["e3-3"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="3" 
                         />
                       </span> 
                       of remote work. In my opinion, a 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-4"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-4": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-4"] === true ? "text-green-600" : essayBlanksResults["e3-4"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="4" 
                         />
                       </span> 
                       is the best solution.
                     </p>
                     <p className="mb-4">
                       First, the main advantage of remote working is 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-5"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-5": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-5"] === true ? "text-green-600" : essayBlanksResults["e3-5"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="5" 
                         />
                       </span>. 
                       Employees can save time and money by not commuting. This leads to a better 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-6"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-6": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-6"] === true ? "text-green-600" : essayBlanksResults["e3-6"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="6" 
                         />
                       </span>. 
                       For example, parents can spend more time with their children instead of sitting in traffic.
                     </p>
                     <p className="mb-4">
                       However, there are also disadvantages. Working alone can be lonely and 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-7"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-7": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-7"] === true ? "text-green-600" : essayBlanksResults["e3-7"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="7" 
                         />
                       </span>. 
                       It is harder to build strong relationships with colleagues. Furthermore, distractions at home can reduce 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-8"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-8": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-8"] === true ? "text-green-600" : essayBlanksResults["e3-8"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="8" 
                         />
                       </span> 
                       for some people.
                     </p>
                     <p>
                       In conclusion, remote working offers freedom and savings, but it can also cause isolation. Therefore, I believe a hybrid approach is the ideal 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-9"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-9": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-9"] === true ? "text-green-600" : essayBlanksResults["e3-9"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="9" 
                         />
                       </span>. 
                       It balances the benefits of 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e3-10"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e3-10": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e3-10"] === true ? "text-green-600" : essayBlanksResults["e3-10"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="10" 
                         />
                       </span> 
                       with the flexibility of working from home.
                     </p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4">
                      <div className="text-lg font-bold">
                         {essayBlanksScore !== null && <span>Score: {essayBlanksScore} / 10</span>}
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" onClick={resetEssayBlanks}>Reset</Button>
                         <Button 
                           onClick={checkEssayBlanks} 
                           className="w-32"
                           disabled={Object.keys(essayBlanksAnswers).filter(k => k.startsWith('e3-')).length < 10}
                         >
                           {Object.keys(essayBlanksAnswers).filter(k => k.startsWith('e3-')).length < 10 ? `Complete All` : "Check Answers"}
                         </Button>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-4 rounded border text-sm text-muted-foreground mt-4">
                    <p className="font-bold mb-2">Word Bank (Use these words):</p>
                    <div className="flex flex-wrap gap-2">
                       {["common practice", "benefits", "drawbacks", "hybrid model", "flexibility", "work-life balance", "isolating", "productivity", "compromise", "social interaction"].map((word, i) => (
                         <Badge key={i} variant="secondary" className="text-sm py-1 px-3 bg-white hover:bg-white border border-input">{word}</Badge>
                       ))}
                    </div>
                  </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Essay Practice 4</h2>
               <p className="text-muted-foreground mb-6">Topic: Climate Change Responsibility</p>
               
               <div className="space-y-6">
                 <div className="bg-muted/30 p-6 rounded-lg border">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle className="h-5 w-5 text-primary" /> Prompt
                   </h3>
                   <p className="text-lg font-medium">
                     Climate change is a global problem. Who should take the most responsibility for solving it: governments, big companies, or individuals?
                   </p>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" /> Fill in the Blanks
                   </h3>
                   <div className="bg-white p-6 rounded-lg border leading-loose text-lg">
                     <p className="mb-4">
                       Climate change is threatening our planet, and 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-1"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-1": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-1"] === true ? "text-green-600" : essayBlanksResults["e4-1"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="1" 
                         />
                       </span> 
                       is needed. While everyone has a role to play, I believe governments and large corporations must take the most 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-2"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-2": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-2"] === true ? "text-green-600" : essayBlanksResults["e4-2"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="2" 
                         />
                       </span>.
                     </p>
                     <p className="mb-4">
                       First, governments can create 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-3"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-3": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-3"] === true ? "text-green-600" : essayBlanksResults["e4-3"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="3" 
                         />
                       </span> 
                       to protect the environment. They can invest in 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-4"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-4": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-4"] === true ? "text-green-600" : essayBlanksResults["e4-4"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="4" 
                         />
                       </span> 
                       like wind and solar power. Individuals can 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-5"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-5": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-5"] === true ? "text-green-600" : essayBlanksResults["e4-5"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="5" 
                         />
                       </span>, 
                       but only governments can change national 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-6"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-6": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-6"] === true ? "text-green-600" : essayBlanksResults["e4-6"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="6" 
                         />
                       </span>.
                     </p>
                     <p className="mb-4">
                       Second, big companies produce the most 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-7"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-7": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-7"] === true ? "text-green-600" : essayBlanksResults["e4-7"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="7" 
                         />
                       </span>. 
                       These companies should be forced to use 
                       <span className="inline-block w-40 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-8"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-8": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-8"] === true ? "text-green-600" : essayBlanksResults["e4-8"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="8" 
                         />
                       </span> 
                       and reduce waste. They must be held 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-9"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-9": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-9"] === true ? "text-green-600" : essayBlanksResults["e4-9"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="9" 
                         />
                       </span> 
                       for their environmental impact.
                     </p>
                     <p>
                       In conclusion, while individuals should try to live 
                       <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                         <Input 
                           value={essayBlanksAnswers["e4-10"] || ""} 
                           onChange={(e) => setEssayBlanksAnswers({...essayBlanksAnswers, "e4-10": e.target.value})}
                           className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${essayBlanksResults["e4-10"] === true ? "text-green-600" : essayBlanksResults["e4-10"] === false ? "text-red-600" : "text-blue-600"}`}
                           placeholder="10" 
                         />
                       </span>, 
                       the main responsibility lies with governments and corporations.
                     </p>
                   </div>

                   <div className="flex items-center justify-between pt-4">
                      <div className="text-lg font-bold">
                         {essayBlanksScore !== null && <span>Score: {essayBlanksScore} / 10</span>}
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" onClick={resetEssayBlanks}>Reset</Button>
                         <Button 
                           onClick={checkEssayBlanks} 
                           className="w-32"
                           disabled={Object.keys(essayBlanksAnswers).filter(k => k.startsWith('e4-')).length < 10}
                         >
                           {Object.keys(essayBlanksAnswers).filter(k => k.startsWith('e4-')).length < 10 ? `Complete All` : "Check Answers"}
                         </Button>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-4 rounded border text-sm text-muted-foreground mt-4">
                    <p className="font-bold mb-2">Word Bank (Use these words):</p>
                    <div className="flex flex-wrap gap-2">
                       {["urgent action", "responsibility", "laws", "renewable energy", "recycle", "policies", "pollution", "cleaner methods", "accountable", "sustainably"].map((word, i) => (
                         <Badge key={i} variant="secondary" className="text-sm py-1 px-3 bg-white hover:bg-white border border-input">{word}</Badge>
                       ))}
                    </div>
                  </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          <Card className="mb-8 border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <h2 className="text-2xl font-bold mb-2">Extended Reading & Writing: Space Exploration</h2>
               <p className="text-muted-foreground mb-6">Read the text and fill in the blanks with the correct words from the box.</p>
               
               <div className="space-y-6">
                  <div className="bg-muted/30 p-6 rounded-lg border">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                       <List className="h-5 w-5 text-primary" /> Word Bank
                     </h3>
                     <div className="flex flex-wrap gap-2">
                       {["investment", "curiosity", "technologies", "habitable", "resources", "controversial", "budget", "universe", "benefits", "prioritize"].map((word, i) => (
                         <Badge key={i} variant="secondary" className="text-sm py-1 px-3 bg-white hover:bg-white border border-input">{word}</Badge>
                       ))}
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border leading-loose text-lg">
                    <p>
                      Space exploration has always been a subject of human 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["1"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "1": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["1"] === true ? "text-green-600" : spaceBlanksResults["1"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="1" 
                        />
                      </span>. 
                      Since the first moon landing, countries have spent billions of dollars on missions to explore the 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["2"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "2": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["2"] === true ? "text-green-600" : spaceBlanksResults["2"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="2" 
                        />
                      </span>. 
                      However, this topic remains 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["3"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "3": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["3"] === true ? "text-green-600" : spaceBlanksResults["3"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="3" 
                        />
                      </span>.
                    </p>
                    <p className="mt-4">
                      Supporters argue that space research leads to new 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["4"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "4": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["4"] === true ? "text-green-600" : spaceBlanksResults["4"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="4" 
                        />
                      </span> 
                      that improve life on Earth, such as satellite communication and medical advances. Furthermore, as Earth's 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["5"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "5": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["5"] === true ? "text-green-600" : spaceBlanksResults["5"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="5" 
                        />
                      </span> 
                      become scarce, finding other 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["6"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "6": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["6"] === true ? "text-green-600" : spaceBlanksResults["6"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="6" 
                        />
                      </span> 
                      planets might be necessary for human survival.
                    </p>
                    <p className="mt-4">
                      On the other hand, critics believe that the huge 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["7"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "7": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["7"] === true ? "text-green-600" : spaceBlanksResults["7"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="7" 
                        />
                      </span> 
                      required for space programs could be better spent on solving problems here, like poverty and climate change. They argue that governments should 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["8"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "8": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["8"] === true ? "text-green-600" : spaceBlanksResults["8"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="8" 
                        />
                      </span> 
                      local issues before looking to the stars. Despite the cost, the 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["9"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "9": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["9"] === true ? "text-green-600" : spaceBlanksResults["9"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="9" 
                        />
                      </span> 
                      of scientific discovery often justify the 
                      <span className="inline-block w-32 mx-2 align-middle border-b-2 border-gray-300">
                        <Input 
                          value={spaceBlanksAnswers["10"] || ""} 
                          onChange={(e) => setSpaceBlanksAnswers({...spaceBlanksAnswers, "10": e.target.value})}
                          className={`h-8 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 placeholder:font-normal ${spaceBlanksResults["10"] === true ? "text-green-600" : spaceBlanksResults["10"] === false ? "text-red-600" : "text-blue-600"}`}
                          placeholder="10" 
                        />
                      </span>.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                     <div className="flex items-center gap-4">
                       <div className="text-lg font-bold">
                          {spaceBlanksScore !== null && <span>Score: {spaceBlanksScore} / 10</span>}
                       </div>
                       <Button 
                         variant="outline"
                         onClick={() => setShowSpaceKey(!showSpaceKey)}
                         disabled={Object.values(spaceBlanksAnswers).filter(Boolean).length < 10}
                         className="gap-2"
                       >
                         {showSpaceKey ? "Hide Answer Key" : "Show Answer Key"}
                         {Object.values(spaceBlanksAnswers).filter(Boolean).length < 10 && <Lock className="h-3 w-3" />}
                       </Button>
                     </div>
                     <div className="flex gap-2">
                       <Button variant="outline" onClick={resetSpaceBlanks}>Reset</Button>
                       <Button onClick={checkSpaceBlanks} className="w-32">Check Answers</Button>
                     </div>
                  </div>

                  {showSpaceKey && (
                    <div className="bg-slate-50 p-4 rounded border text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                      <p className="font-bold mb-2">Answer Key:</p>
                      <ol className="list-decimal pl-5 grid grid-cols-2 gap-2">
                          <li>curiosity</li>
                          <li>universe</li>
                          <li>controversial</li>
                          <li>technologies</li>
                          <li>resources</li>
                          <li>habitable</li>
                          <li>budget</li>
                          <li>prioritize</li>
                          <li>benefits</li>
                          <li>investment</li>
                      </ol>
                    </div>
                  )}
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
                       {["first, second, third", "before", "as a result,", "to start with", "Then", "immediately before", "the next step", "immediately after", "now", "therefore, so,", "when", "finally,", "afterwards", "Next", "later", "another", "however", "although", "despite", "on the other hand", "in contrast", "whereas", "while", "nevertheless", "but", "yet"].map((word, i) => (
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
                     
                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Task 4: Summer vs Winter (Simple Contrast)</CardTitle></CardHeader>
                       <CardContent className="text-lg leading-loose">
                         Summer is hot and sunny. 
                         <div className="inline-block w-48 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t4-1": v})}>
                             <SelectTrigger className={signalResults["t4-1"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t4-1"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["however", "on the other hand", "in contrast", "whereas", "while", "nevertheless", "but", "although", "despite"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , winter is cold and snowy. I like summer because I can swim, 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t4-2": v})}>
                             <SelectTrigger className={signalResults["t4-2"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t4-2"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["however", "on the other hand", "in contrast", "whereas", "while", "nevertheless", "but", "although", "despite"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         my brother prefers winter for skiing.
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader className="pb-2"><CardTitle className="text-base">Task 5: Economic Models (Complex Contrast)</CardTitle></CardHeader>
                       <CardContent className="text-lg leading-loose">
                         Keynesian economics suggests government intervention can stabilize the economy. 
                         <div className="inline-block w-48 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t5-1": v})}>
                             <SelectTrigger className={signalResults["t5-1"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t5-1"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["In contrast", "On the other hand", "While", "Although", "Nevertheless", "However", "Despite"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , classical economics argues that free markets are self-correcting. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t5-2": v})}>
                             <SelectTrigger className={signalResults["t5-2"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t5-2"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["In contrast", "On the other hand", "While", "Although", "Nevertheless", "However", "Despite"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         both theories have merit, modern policies often blend them. 
                         <div className="inline-block w-40 mx-2 align-middle">
                           <Select onValueChange={(v) => setSignalAnswers({...signalAnswers, "t5-3": v})}>
                             <SelectTrigger className={signalResults["t5-3"] === true ? "border-green-500 bg-green-50 h-8" : signalResults["t5-3"] === false ? "border-red-500 bg-red-50 h-8" : "h-8"}>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               {["In contrast", "On the other hand", "While", "Although", "Nevertheless", "However", "Despite"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                             </SelectContent>
                           </Select>
                         </div>
                         , debates continue about which approach is best.
                       </CardContent>
                     </Card>
                     
                     <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-lg font-bold">
                           {signalScore !== null && <span>Score: {signalScore} / 16</span>}
                        </div>
                        <div className="flex gap-2">
                           <Button variant="outline" onClick={resetSignalWords}>Reset</Button>
                           <Button 
                             onClick={checkSignalWords} 
                             className="w-32"
                             disabled={Object.keys(signalAnswers).length < 16}
                           >
                             {Object.keys(signalAnswers).length < 16 ? `Complete All (${Object.keys(signalAnswers).length}/16)` : "Check Answers"}
                           </Button>
                        </div>
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

                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 4: Travel Plans (A2/B1 Level)</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Last summer, the Smith family visited Italy for two weeks. They stayed in a small hotel near Rome because they wanted to see the Colosseum. They traveled by plane and rented a car to drive around the countryside.</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Who:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex4-who"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex4-who": e.target.value})}
                               className={whResults["ex4-who"] === true ? "border-green-500 bg-green-50" : whResults["ex4-who"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex4-who"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: The Smith family</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Where:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex4-where"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex4-where": e.target.value})}
                               className={whResults["ex4-where"] === true ? "border-green-500 bg-green-50" : whResults["ex4-where"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex4-where"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Italy / Rome</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">When:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex4-when"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex4-when": e.target.value})}
                               className={whResults["ex4-when"] === true ? "border-green-500 bg-green-50" : whResults["ex4-when"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex4-when"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Last summer</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Why:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex4-why"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex4-why": e.target.value})}
                               className={whResults["ex4-why"] === true ? "border-green-500 bg-green-50" : whResults["ex4-why"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex4-why"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: To see the Colosseum</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">How:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex4-how"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex4-how": e.target.value})}
                               className={whResults["ex4-how"] === true ? "border-green-500 bg-green-50" : whResults["ex4-how"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex4-how"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: By plane / rented car</span>}
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 5: Job Interview (B1 Level)</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Sarah is preparing for a job interview at a marketing company next Monday. She needs to research the company's history to answer questions confidently. She plans to wear a formal suit to make a good impression.</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Who:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex5-who"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex5-who": e.target.value})}
                               className={whResults["ex5-who"] === true ? "border-green-500 bg-green-50" : whResults["ex5-who"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex5-who"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Sarah</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">What:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex5-what"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex5-what": e.target.value})}
                               className={whResults["ex5-what"] === true ? "border-green-500 bg-green-50" : whResults["ex5-what"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex5-what"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Job interview</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">When:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex5-when"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex5-when": e.target.value})}
                               className={whResults["ex5-when"] === true ? "border-green-500 bg-green-50" : whResults["ex5-when"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex5-when"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Next Monday</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Why:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex5-why"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex5-why": e.target.value})}
                               className={whResults["ex5-why"] === true ? "border-green-500 bg-green-50" : whResults["ex5-why"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex5-why"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: To make a good impression</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">How:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex5-how"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex5-how": e.target.value})}
                               className={whResults["ex5-how"] === true ? "border-green-500 bg-green-50" : whResults["ex5-how"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex5-how"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: By researching / formal suit</span>}
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader className="pb-2"><CardTitle className="text-base">Exercise 6: Climate Conference (B1/B2 Level)</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                       <div className="bg-muted p-4 rounded-lg mb-4">
                         <p className="font-medium">Text:</p>
                         <p>Scientists from around the world gathered in Geneva yesterday to discuss global warming. They presented new data showing rising sea levels. The goal of the meeting was to create a plan for reducing carbon emissions by 2030.</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Who:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex6-who"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex6-who": e.target.value})}
                               className={whResults["ex6-who"] === true ? "border-green-500 bg-green-50" : whResults["ex6-who"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex6-who"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Scientists</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Where:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex6-where"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex6-where": e.target.value})}
                               className={whResults["ex6-where"] === true ? "border-green-500 bg-green-50" : whResults["ex6-where"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex6-where"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Geneva</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">When:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex6-when"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex6-when": e.target.value})}
                               className={whResults["ex6-when"] === true ? "border-green-500 bg-green-50" : whResults["ex6-when"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex6-when"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Yesterday</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">Why:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex6-why"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex6-why": e.target.value})}
                               className={whResults["ex6-why"] === true ? "border-green-500 bg-green-50" : whResults["ex6-why"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Type answer..."
                             />
                             {whResults["ex6-why"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: To discuss global warming</span>}
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold w-16">What:</span>
                           <div className="flex-1">
                             <Input 
                               value={whAnswers["ex6-what"] || ""} 
                               onChange={(e) => setWhAnswers({...whAnswers, "ex6-what": e.target.value})}
                               className={whResults["ex6-what"] === true ? "border-green-500 bg-green-50" : whResults["ex6-what"] === false ? "border-red-500 bg-red-50" : ""}
                               placeholder="Result/Goal..."
                             />
                             {whResults["ex6-what"] === false && <span className="text-xs text-red-500 mt-1 block">Answer: Rising sea levels / Reduction plan</span>}
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                   
                   <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold">
                         {whScore !== null && <span>Score: {whScore} / 30</span>}
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" onClick={resetWhQuestions}>Reset</Button>
                         <Button onClick={checkWhQuestions} className="w-32">Check Answers</Button>
                      </div>
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