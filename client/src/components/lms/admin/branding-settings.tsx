
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranding } from "@/hooks/use-branding";
import { useToast } from "@/hooks/use-toast";
import { Palette, Building2, Upload, RefreshCw } from "lucide-react";

export function BrandingSettings() {
  const { branding, updateBranding, resetBranding } = useBranding();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    institutionName: branding.institutionName,
    primaryColor: branding.primaryColor,
    poweredBy: branding.poweredBy
  });

  const handleSave = () => {
    updateBranding(formData);
    toast({
      title: "Branding Updated",
      description: "The platform appearance has been updated.",
      className: "bg-green-50 border-green-200"
    });
  };

  const handleReset = () => {
    resetBranding();
    setFormData({
      institutionName: "PTE PrepPH",
      primaryColor: "hsl(221.2 83.2% 53.3%)",
      poweredBy: "Powered by TPRC"
    });
    toast({
      title: "Branding Reset",
      description: "Restored default platform branding.",
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Institution Identity
          </CardTitle>
          <CardDescription>
            Customize the platform name and branding for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inst-name">Institution Name</Label>
            <Input 
              id="inst-name"
              value={formData.institutionName}
              onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
              placeholder="e.g. Acme Academy"
            />
            <p className="text-xs text-muted-foreground">Appears in the header and document titles.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="powered-by">Footer / Sub-branding</Label>
            <Input 
              id="powered-by"
              value={formData.poweredBy}
              onChange={(e) => setFormData(prev => ({ ...prev, poweredBy: e.target.value }))}
              placeholder="e.g. Powered by Acme"
            />
            <p className="text-xs text-muted-foreground">Small text typically shown under the logo or in the footer.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Visual Style
          </CardTitle>
          <CardDescription>
            Adjust the color scheme to match your brand guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Brand Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border shadow-sm shrink-0" 
                style={{ backgroundColor: formData.primaryColor.startsWith('hsl') ? 'blue' : formData.primaryColor }} // Fallback preview for HSL
              ></div>
              <Input 
                id="primary-color"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                placeholder="#000000 or hsl(...)"
              />
            </div>
            <p className="text-xs text-muted-foreground">Supports Hex, RGB, or HSL values.</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <Label className="mb-2 block">Live Preview</Label>
             <div className="flex items-center justify-between bg-white p-3 rounded border shadow-sm">
                <div className="font-bold text-lg" style={{ color: formData.primaryColor }}>
                   {formData.institutionName}
                </div>
                <Button size="sm" style={{ backgroundColor: formData.primaryColor }}>
                   Primary Button
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset Defaults
        </Button>
        <Button onClick={handleSave} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
          <Upload className="h-4 w-4" />
          Save Branding
        </Button>
      </div>
    </div>
  );
}
