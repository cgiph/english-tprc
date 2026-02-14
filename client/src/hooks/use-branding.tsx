
import { createContext, useContext, useEffect, useState } from "react";

interface BrandingState {
  institutionName: string;
  logoUrl?: string;
  primaryColor: string; // Hex color
  secondaryColor: string; // Hex color
  poweredBy: string;
}

const defaultBranding: BrandingState = {
  institutionName: "PTE PrepPH",
  primaryColor: "hsl(221.2 83.2% 53.3%)", // Default primary blue
  secondaryColor: "hsl(210 40% 96.1%)",
  poweredBy: "Powered by TPRC"
};

interface BrandingContextType {
  branding: BrandingState;
  updateBranding: (newBranding: Partial<BrandingState>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingState>(defaultBranding);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("app_branding");
    if (stored) {
      try {
        setBranding({ ...defaultBranding, ...JSON.parse(stored) });
      } catch (e) {
        console.error("Failed to parse branding settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("app_branding", JSON.stringify(branding));
    
    // Apply CSS variables for colors if needed (optional advanced feature)
    // For now we just use the state to render UI elements
  }, [branding, isLoaded]);

  const updateBranding = (newBranding: Partial<BrandingState>) => {
    setBranding(prev => ({ ...prev, ...newBranding }));
  };

  const resetBranding = () => {
    setBranding(defaultBranding);
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
