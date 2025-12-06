import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Lock, BookOpen, FileText, HelpCircle } from "lucide-react";
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

  // Default to Describe Image if no ID or ID=2
  const isEssayGuide = resourceId === "1";
  const resourceTitle = isEssayGuide ? "Ultimate Essay Guide 2026" : "Describe Image - 50 Practice Charts";

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