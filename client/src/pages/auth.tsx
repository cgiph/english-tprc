import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import logoImg from "@assets/image_1777005024578.png";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const { toast } = useToast();
  const { login } = useUser();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Details, Step 2: OTP Verification
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only for register
    mobile: "", // Required for register
    occupation: "", // Required for register
    facebook: "", // Optional for register
    otp: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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
    setStep(1); // Reset step when changing modes
  };

  const validateDetails = () => {
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

    // Register-specific validation
    if (mode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "Full Name is required";
      }
      
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile Number is required";
      } else if (!/^\+?[\d\s-]{8,15}$/.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid mobile number";
      }
      
      if (!formData.occupation) {
        newErrors.occupation = "Occupation is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp || formData.otp.length < 6) {
      newErrors.otp = "Please enter the 6-digit OTP sent to your mobile";
    } else if (formData.otp !== "123456") { // Mock OTP validation (accepts only 123456 for now)
      newErrors.otp = "Invalid OTP. Please try again. (Hint: Use 123456)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      if (mode === "register") {
        setIsSendingOtp(true);
        // Simulate API call to send OTP
        setTimeout(() => {
          setIsSendingOtp(false);
          setStep(2);
          toast({
            title: "OTP Sent",
            description: `A verification code has been sent to ${formData.mobile}`,
            variant: "default",
          });
        }, 1500);
      } else {
        // For login, skip OTP step (unless we want 2FA later)
        executeLogin();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateOTP()) {
      executeLogin();
    } else {
      toast({
        title: "Verification Failed",
        description: "Please enter the correct OTP.",
        variant: "destructive",
      });
    }
  };

  const executeLogin = () => {
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
       if (!usedIds.includes(formData.email.toUpperCase())) {
          usedIds.push(formData.email.toUpperCase());
          sessionStorage.setItem('used_user_ids', JSON.stringify(usedIds));
       }
    }

    // Store extended profile data for the session (mocking HubSpot sync)
    if (mode === "register") {
      const userProfile = {
        mobile: formData.mobile,
        occupation: formData.occupation,
        facebook: formData.facebook
      };
      sessionStorage.setItem('mock_user_profile', JSON.stringify(userProfile));
      console.log("Mock HubSpot Sync: ", { ...userProfile, email: formData.email, name: finalName });
    }

    login(finalName, formData.email, role as 'student' | 'trainer', plan);

    toast({
      title: mode === "login" ? "Login Successful" : "Registration Successful",
      description: mode === "register" ? "Your account has been created and synced with HubSpot." : `Welcome back, ${finalName.split(' ')[0]}!`,
      variant: "default",
    });
    
    // Redirect based on role
    if (isTrainer) {
       setTimeout(() => setLocation("/lms/admin"), 1000);
    } else {
       setTimeout(() => setLocation("/resources"), 1000);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] py-12">
      <Card className="w-full max-w-md border-2 shadow-xl overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-slate-50 border-b pb-6">
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="PTE PrepPH Logo" className="h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-slate-800">
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {mode === "login" 
              ? "Enter your credentials to access your dashboard" 
              : "Sign up to access mock tests and study resources"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {step === 1 ? (
            <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100/80">
                <TabsTrigger value="login" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSendOTP} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Full Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-slate-700">Mobile Number <span className="text-red-500">*</span></Label>
                      <Input 
                        id="mobile" 
                        type="tel"
                        placeholder="+61 400 000 000" 
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className={errors.mobile ? "border-red-500" : ""}
                      />
                      {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="text-slate-700">Occupation / Trade <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.occupation} 
                        onValueChange={(value) => setFormData({...formData, occupation: value})}
                      >
                        <SelectTrigger className={errors.occupation ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select your trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carpenter">Carpenter</SelectItem>
                          <SelectItem value="mechanic">Motor Mechanic</SelectItem>
                          <SelectItem value="welder">Welder / Fabricator</SelectItem>
                          <SelectItem value="chef">Chef / Cook</SelectItem>
                          <SelectItem value="electrician">Electrician</SelectItem>
                          <SelectItem value="plumber">Plumber</SelectItem>
                          <SelectItem value="other">Other Trade</SelectItem>
                          <SelectItem value="nursing">Nursing / Healthcare</SelectItem>
                          <SelectItem value="student">International Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.occupation && <p className="text-xs text-red-500">{errors.occupation}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-slate-700">Facebook Profile Link (Optional)</Label>
                      <Input 
                        id="facebook" 
                        placeholder="https://facebook.com/username" 
                        value={formData.facebook}
                        onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      />
                      <p className="text-[10px] text-muted-foreground">Helps us connect with you easier for support</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Username or Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="text" 
                    placeholder="name@example.com or PTEC01_2026" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  {mode === "login" && <p className="text-[10px] text-muted-foreground">Enter your email address or assigned student username</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  {mode === "login" && <p className="text-[10px] text-muted-foreground">Minimum 6 characters</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-bold text-md bg-blue-900 hover:bg-blue-800 text-white mt-6" 
                  size="lg"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? "Processing..." : (mode === "login" ? "Sign In" : "Register & Send OTP")}
                </Button>
              </form>
            </Tabs>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2a9 9 0 0 1 8 7.94"></path><path d="M14.05 6A5 5 0 0 1 18 10"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Verify Your Number</h3>
                <p className="text-sm text-slate-500">
                  We've sent a 6-digit code to <span className="font-medium text-slate-800">{formData.mobile}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-700 text-center block">Enter Verification Code</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                    className={`text-center text-2xl tracking-widest font-mono h-14 ${errors.otp ? "border-red-500" : ""}`}
                  />
                  {errors.otp && <p className="text-xs text-red-500 text-center">{errors.otp}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full font-bold text-md bg-blue-900 hover:bg-blue-800 text-white" size="lg">
                    Verify & Complete Registration
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-slate-500" 
                    onClick={() => setStep(1)}
                  >
                    Back to Details
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
        {step === 1 && (
          <CardFooter className="flex flex-col gap-2 text-center text-sm text-slate-500 bg-slate-50 border-t py-4">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button onClick={() => handleModeChange("register")} className="text-blue-900 font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => handleModeChange("login")} className="text-blue-900 font-semibold hover:underline">
                  Log in
                </button>
              </p>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
