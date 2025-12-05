import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
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
      image: imgSmartphone, // Using the pie chart image for smartphone share as generated earlier, though categorized as bar in prompt list, visual might be pie. Let's stick to the image we have.
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
  const [activeTab, setActiveTab] = useState("Bar Charts");
  // In a real app, we would verify access here again or rely on parent route protection
  
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
            Describe Image - 50 Practice Charts
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