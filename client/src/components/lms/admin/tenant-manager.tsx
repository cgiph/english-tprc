
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBranding } from "@/hooks/use-branding";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, Check, Trash2, Users, Settings, ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tenant {
  id: string;
  name: string;
  primaryColor: string;
  poweredBy: string;
  userCount: number;
  status: 'active' | 'inactive';
}

const DEFAULT_TENANTS: Tenant[] = [
  {
    id: "default",
    name: "PTE PrepPH",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    poweredBy: "Powered by TPRC",
    userCount: 124,
    status: 'active'
  },
  {
    id: "acme-corp",
    name: "Acme Corp Academy",
    primaryColor: "#e11d48", // Red-600
    poweredBy: "Powered by Acme HR",
    userCount: 45,
    status: 'active'
  },
  {
    id: "tech-institute",
    name: "Global Tech Institute",
    primaryColor: "#059669", // Emerald-600
    poweredBy: "Technology Partner",
    userCount: 89,
    status: 'active'
  }
];

export function TenantManager() {
  const { branding, updateBranding } = useBranding();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>(DEFAULT_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState<string>("default");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New Tenant Form
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantColor, setNewTenantColor] = useState("#2563eb");

  // Load tenants from storage on mount
  useEffect(() => {
    const storedTenants = localStorage.getItem("app_tenants");
    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    }
    
    // Try to match current branding to a tenant
    const current = tenants.find(t => t.name === branding.institutionName);
    if (current) {
      setActiveTenantId(current.id);
    }
  }, [branding.institutionName]);

  // Save tenants to storage whenever they change
  useEffect(() => {
    localStorage.setItem("app_tenants", JSON.stringify(tenants));
  }, [tenants]);

  const handleSwitchTenant = (tenant: Tenant) => {
    // Update the global branding context
    updateBranding({
      institutionName: tenant.name,
      primaryColor: tenant.primaryColor,
      poweredBy: tenant.poweredBy
    });
    
    setActiveTenantId(tenant.id);
    
    toast({
      title: `Switched to ${tenant.name}`,
      description: "Platform branding and context updated successfully.",
      className: "bg-blue-50 border-blue-200"
    });
  };

  const handleCreateTenant = () => {
    if (!newTenantName) return;

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: newTenantName,
      primaryColor: newTenantColor,
      poweredBy: `Powered by ${newTenantName}`,
      userCount: 0,
      status: 'active'
    };

    setTenants([...tenants, newTenant]);
    setNewTenantName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Organization Created",
      description: `${newTenantName} has been added to the tenant list.`,
    });
  };

  const handleDeleteTenant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tenants.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one organization.",
        variant: "destructive"
      });
      return;
    }
    
    setTenants(tenants.filter(t => t.id !== id));
    
    if (activeTenantId === id) {
      // If we deleted the active one, switch to the first available
      const remaining = tenants.filter(t => t.id !== id);
      if (remaining.length > 0) {
        handleSwitchTenant(remaining[0]);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organization Management</h2>
          <p className="text-muted-foreground">Manage multi-tenant environments and switch contexts.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new tenant environment with its own branding and user pool.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input 
                  id="name" 
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="e.g. Global Tech Solutions" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Brand Color</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{ backgroundColor: newTenantColor }}></div>
                  <Input 
                    id="color" 
                    value={newTenantColor}
                    onChange={(e) => setNewTenantColor(e.target.value)}
                    placeholder="#000000" 
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTenant}>Create Organization</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <Card 
            key={tenant.id} 
            className={`cursor-pointer transition-all hover:border-slate-400 ${activeTenantId === tenant.id ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={() => handleSwitchTenant(tenant)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {tenant.name}
              </CardTitle>
              {activeTenantId === tenant.id && (
                <Badge variant="default" className="bg-green-600 hover:bg-green-600">Active</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mt-2">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  {tenant.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{tenant.userCount}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Active Users
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-slate-50/50 p-4 border-t">
              <div className="text-xs text-muted-foreground truncate max-w-[120px]" title={tenant.poweredBy}>
                {tenant.poweredBy}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                  <Settings className="h-4 w-4" />
                </Button>
                {activeTenantId !== tenant.id && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                    onClick={(e) => handleDeleteTenant(tenant.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {activeTenantId !== tenant.id && (
                   <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => handleSwitchTenant(tenant)}>
                     Switch
                   </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-2">
          <div className="p-3 bg-slate-100 rounded-full">
            <ArrowRightLeft className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="font-semibold text-lg">Simulating Multi-Tenancy</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This prototype simulates a multi-tenant environment. In a production deployment, 
            each organization would have isolated data partitions and custom subdomains (e.g., acme.pteprep.ph).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
