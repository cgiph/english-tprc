import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const { toast } = useToast();
  const { login } = useUser();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only for register
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync mode with URL param if it changes externally or on mount
  useEffect(() => {
    const currentMode = searchParams.get("mode");
    if (currentMode === "register" || currentMode === "login") {
      setMode(currentMode);
    }
  }, [search]);

  const handleModeChange = (value: string) => {
    setMode(value as "login" | "register");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // User ID Validation (Mocking predefined IDs)
    const validUserIds = [
      "PTEC01_2026", "PTEC02_2026", "PTEC03_2026", 
      "TRA01_2026", "TRA02_2026", "TRA03_2026"
    ];
    
    // Email Validation or User ID
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = "Username or Email is required";
    } else if (!emailRegex.test(formData.email) && !/^[a-zA-Z0-9_.-]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email or username";
    }

    // If using a User ID format, check if it's in our valid list (mock verification)
    const isUserIdFormat = /^[A-Z]{3,4}\d{2}_202[0-9]$/i.test(formData.email);
    if (isUserIdFormat && !validUserIds.includes(formData.email.toUpperCase())) {
      newErrors.email = "Invalid User ID. Please check your assigned ID.";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Name Validation (Register only)
    if (mode === "register" && !formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Mock Authentication
      // Use Name from form for register, or extract from email for login
      const displayName = mode === "register" ? formData.name : formData.email.split('@')[0];
      const normalizedEmail = formData.email.toLowerCase().trim();
      
      // Check for Trainer Emails
      const trainerEmails = [
        "jorge.catiempo@cirrusrecruitment.com",
        "susan.centino@cirrusrecruitment.com",
        "jobart.benedito@cirrusrecruitment.com"
      ];

      const isTrainer = trainerEmails.includes(normalizedEmail);
      const isUserIdFormat = /^[A-Z]{3,4}\d{2}_202[0-9]$/i.test(formData.email);
      
      let finalName = displayName;
      let role = isTrainer ? 'trainer' : 'student';
      let plan: 'free' | 'pro' | 'trade' = 'free';

      if (isTrainer) {
        if (normalizedEmail === "jorge.catiempo@cirrusrecruitment.com") finalName = "Jorge Catiempo";
        if (normalizedEmail === "susan.centino@cirrusrecruitment.com") finalName = "Susan Centino";
        if (normalizedEmail === "jobart.benedito@cirrusrecruitment.com") finalName = "Jobart Benedito";
        plan = 'pro';
      } else if (isUserIdFormat) {
         // Auto-upgrade plan based on User ID prefix for the mockup
         if (formData.email.toUpperCase().startsWith("PTEC")) {
            plan = "pro";
         } else if (formData.email.toUpperCase().startsWith("TRA")) {
            plan = "trade";
         }
         
         // Mock "Already used" check
         const usedIds = JSON.parse(sessionStorage.getItem('used_user_ids') || '[]');
         // In a real app this would check the DB. Here we just check if it's been used in this browser session
         // Since we don't want to permanently block them in a mockup, we'll just simulate the login
         if (!usedIds.includes(formData.email.toUpperCase())) {
            usedIds.push(formData.email.toUpperCase());
            sessionStorage.setItem('used_user_ids', JSON.stringify(usedIds));
         }
      }

      login(finalName, formData.email, role as 'student' | 'trainer', plan);

      toast({
        title: mode === "login" ? "Login Successful" : "Registration Successful",
        description: isTrainer ? `Welcome back, Trainer ${finalName.split(' ')[0]}!` : (mode === "login" ? "Welcome back!" : "Your account has been created."),
        variant: "default",
      });
      
      // Redirect based on role
      if (isTrainer) {
         setTimeout(() => setLocation("/lms/admin"), 1000);
      } else {
         setTimeout(() => setLocation("/resources"), 1000);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] py-12">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-serif font-bold">
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Enter your credentials to access your dashboard" 
              : "Sign up to access mock tests and study resources"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input 
                  id="email" 
                  type="text" 
                  placeholder="name@example.com or PTEC01_2026" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                <p className="text-[10px] text-muted-foreground">Enter your email address or assigned student username</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                <p className="text-[10px] text-muted-foreground">Minimum 6 characters</p>
              </div>

              <Button type="submit" className="w-full font-bold text-md" size="lg">
                {mode === "login" ? "Sign In" : "Get Started"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => handleModeChange("register")} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => handleModeChange("login")} className="text-primary font-semibold hover:underline">
                Log in
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
