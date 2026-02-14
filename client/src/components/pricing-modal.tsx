import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, X, CreditCard, Shield, Zap, Star, Layout, Briefcase, Award, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function PricingContent({ onClose }: { onClose?: () => void }) {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const plans = [
    {
      name: "Starter",
      description: "Essential tools to start your journey.",
      price: "Free",
      period: "forever",
      features: [
        "Access to Module 1 of all courses",
        "5 Daily Practice Questions",
        "Basic Score Reports",
        "Community Forum Access"
      ],
      limitations: [
        "No AI Speaking Scoring",
        "Limited Mock Tests",
        "No Technical Trade Content"
      ],
      cta: "Start Learning",
      variant: "outline" as const
    },
    {
      name: "PTE Pro",
      description: "Perfect for students aiming for 79+.",
      price: isYearly ? "$24" : "$29",
      period: "per month",
      originalPrice: isYearly ? "$29" : null,
      popular: true,
      features: [
        "Unlimited AI Speaking Scoring",
        "Full Length Mock Tests (20/mo)",
        "Advanced Analytics & Trends",
        "Writing Essay Grader",
        "Priority Support"
      ],
      cta: "Get Pro Access",
      variant: "default" as const
    },
    {
      name: "Trade Master",
      description: "Complete preparation for TSA/TRA trades.",
      price: "$199",
      period: "one-time payment",
      features: [
        "Full Technical Course Access",
        "Trades Recognition Australia (TRA) Prep",
        "Technical Skilling Australia (TSA) Prep",
        "1-on-1 Trainer Review Session",
        "Job Readiness Certificate"
      ],
      cta: "Buy Certification",
      variant: "outline" as const,
      highlight: "Career Ready"
    }
  ];

  return (
    <div className="bg-slate-50/50 max-h-[80vh] overflow-y-auto p-4 rounded-lg">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 border-none px-3 py-1">Simple Pricing</Badge>
        <h2 className="text-3xl font-bold font-serif mb-4">Invest in Your Future</h2>
        <p className="text-muted-foreground mb-6">
          Choose the plan that fits your goals. Whether you're mastering English for PTE or preparing for a technical trade, we have you covered.
        </p>
        
        <div className="flex items-center justify-center gap-4 bg-white w-fit mx-auto p-1.5 rounded-full border shadow-sm">
          <span className={`text-sm font-medium px-3 ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm font-medium px-3 flex items-center gap-1 ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
            Yearly <Badge variant="secondary" className="bg-green-500 text-white text-[10px] h-4 px-1">SAVE 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard 
            key={index} 
            plan={plan} 
            isYearly={isYearly} 
            onSelect={() => {
              if (plan.price === "Free") {
                if (onClose) onClose();
                toast({ title: "Welcome to Starter Plan!", description: "You have free access to basic materials." });
              }
            }} 
          />
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
         <div className="bg-blue-100 p-4 rounded-full">
            <Briefcase className="w-8 h-8 text-blue-600" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-blue-900">Are you a Cirrus Candidate?</h3>
            <p className="text-blue-700">Candidates who have applied through our recruitment partners get <span className="font-bold">Full Access for FREE</span>. Contact your trainer for an access code.</p>
         </div>
         <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">Enter Access Code</Button>
      </div>

      <div className="text-center mt-12 mb-4">
        <p className="text-sm text-muted-foreground">
            Still have questions? <span className="text-primary font-medium cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
}

function PricingCard({ plan, isYearly, onSelect }: { plan: any, isYearly: boolean, onSelect: () => void }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const handleCheckout = () => {
    setShowCheckout(false);
    toast({
      title: "Payment Successful!",
      description: `Welcome to ${plan.name}. Your account has been upgraded.`,
      className: "bg-green-50 border-green-200"
    });
  };

  const isFree = plan.price === "Free";

  return (
    <Card className={`flex flex-col relative transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-orange-500 shadow-lg scale-105 z-10' : 'border-slate-200'}`}>
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </div>
      )}
      {plan.highlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          {plan.highlight}
        </div>
      )}

      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
        <CardDescription className="text-sm mt-2 min-h-[40px]">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex justify-center items-baseline mb-6">
           {plan.originalPrice && (
             <span className="text-muted-foreground line-through text-lg mr-2">{plan.originalPrice}</span>
           )}
           <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
           {plan.period !== "forever" && <span className="text-muted-foreground ml-1 text-sm">/{plan.period.replace("per ", "")}</span>}
        </div>

        <div className="space-y-3">
          {plan.features.map((feature: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 min-w-[16px]">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-slate-700">{feature}</span>
            </div>
          ))}
          {plan.limitations?.map((limit: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-sm opacity-60">
              <div className="mt-0.5 min-w-[16px]">
                <X className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-slate-500">{limit}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {isFree ? (
          <Button variant={plan.variant} className="w-full h-11" onClick={onSelect}>
            {plan.cta}
          </Button>
        ) : (
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogTrigger asChild>
              <Button variant={plan.variant} className={`w-full h-11 ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : ''}`}>
                {plan.cta}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Secure Checkout</DialogTitle>
                <DialogDescription>
                  Complete your purchase for the <span className="font-semibold text-primary">{plan.name}</span> plan.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                 <div className="p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                    <div>
                       <p className="font-medium">{plan.name} Plan</p>
                       <p className="text-sm text-muted-foreground">{isYearly ? "Yearly billing" : "Monthly billing"}</p>
                    </div>
                    <p className="text-xl font-bold">{plan.price}</p>
                 </div>

                 <div className="space-y-2">
                    <Label>Card Information</Label>
                    <div className="relative">
                       <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="0000 0000 0000 0000" className="pl-9" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <Input placeholder="MM/YY" />
                       <Input placeholder="CVC" />
                    </div>
                 </div>

                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Shield className="h-3 w-3 text-green-600" />
                    Payments are secure and encrypted.
                 </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCheckout(false)}>Cancel</Button>
                <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto" onClick={handleCheckout}>
                   Pay {plan.price}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}