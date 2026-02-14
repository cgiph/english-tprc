import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Save, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useUser();
  const { toast } = useToast();
  
  // Local state for form fields (mocking user data since the actual user object might be limited)
  const [formData, setFormData] = useState({
    fullName: user?.name || "Alex Johnson",
    username: (user as any)?.username || "alex_j",
    email: user?.email || "alex.johnson@example.com",
    reason: "To prepare for PTE Academic",
    password: "password123" // Mock password
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      setChangePasswordMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    }, 1000);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <Button asChild>
          <a href="/auth?mode=login">Log In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`} />
                <AvatarFallback>{formData.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold">{formData.fullName}</h2>
                <p className="text-muted-foreground">@{formData.username}</p>
                <div className="flex gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Student
                  </span>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    Premium Member
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                 {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Card */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5 text-orange-600" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>
              Manage your local data. You can download a backup of your progress to keep it safe.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                   <h4 className="text-sm font-medium text-slate-900">Backup & Restore</h4>
                   <p className="text-xs text-slate-500">
                     Export your progress to a JSON file or restore from a previous backup.
                   </p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="restore-backup"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".json"
                      title="Select a backup file to restore"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const json = event.target?.result as string;
                            const data = JSON.parse(json);
                            
                            // Validate it looks like our backup (check if it's an object)
                            if (typeof data === 'object' && data !== null) {
                              // Restore to localStorage
                              Object.keys(data).forEach(key => {
                                localStorage.setItem(key, data[key]);
                              });
                              
                              toast({
                                title: "Backup Restored",
                                description: "Your progress has been restored. Reloading page...",
                                className: "bg-green-50 border-green-200"
                              });
                              
                              // Reload to apply changes
                              setTimeout(() => window.location.reload(), 1500);
                            } else {
                              throw new Error("Invalid backup format");
                            }
                          } catch (err) {
                            console.error(err);
                            toast({
                              title: "Restore Failed",
                              description: "The file you selected is not a valid backup file.",
                              variant: "destructive"
                            });
                          }
                          // Reset input
                          e.target.value = '';
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 relative pointer-events-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </div>

                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-orange-50 text-orange-700 border-orange-200"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href",     dataStr);
                      downloadAnchorNode.setAttribute("download", "pte_prep_backup_" + new Date().toISOString().split('T')[0] + ".json");
                      document.body.appendChild(downloadAnchorNode); // required for firefox
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                      
                      toast({
                        title: "Backup Downloaded",
                        description: "Your progress has been saved to your device.",
                        className: "bg-green-50 border-green-200"
                      });
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Backup
                  </Button>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={formData.fullName} 
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={formData.username} 
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Signing Up</Label>
                {isEditing ? (
                  <Select 
                    value={formData.reason} 
                    onValueChange={(val) => handleInputChange("reason", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To prepare for PTE Academic">To prepare for PTE Academic</SelectItem>
                      <SelectItem value="To prepare for PTE General">To prepare for PTE General</SelectItem>
                      <SelectItem value="For Migration Purposes">For Migration Purposes</SelectItem>
                      <SelectItem value="For University Admission">For University Admission</SelectItem>
                      <SelectItem value="Professional Development">Professional Development</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id="reason" 
                    value={formData.reason} 
                    disabled={true}
                  />
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-medium">Security</h3>
                 {!changePasswordMode && isEditing && (
                   <Button variant="ghost" size="sm" onClick={() => setChangePasswordMode(true)} className="text-primary h-auto p-0 hover:bg-transparent">
                     Change Password
                   </Button>
                 )}
               </div>

               {!changePasswordMode ? (
                 <div className="space-y-2 max-w-md">
                   <Label htmlFor="password">Current Password</Label>
                   <div className="relative">
                     <Input 
                       id="password" 
                       type={showPassword ? "text" : "password"} 
                       value={formData.password} 
                       readOnly
                       disabled={!isEditing} // Though it's read-only, disabling it makes it look consistent if not in edit mode
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="sm"
                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       {showPassword ? (
                         <EyeOff className="h-4 w-4 text-muted-foreground" />
                       ) : (
                         <Eye className="h-4 w-4 text-muted-foreground" />
                       )}
                     </Button>
                   </div>
                   <p className="text-xs text-muted-foreground">Click the eye icon to reveal your password.</p>
                 </div>
               ) : (
                 <div className="space-y-4 max-w-md animate-in fade-in slide-in-from-top-2">
                   <div className="space-y-2">
                     <Label htmlFor="newPassword">New Password</Label>
                     <Input 
                       id="newPassword" 
                       type="password" 
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       placeholder="Enter new password"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <Input 
                       id="confirmPassword" 
                       type="password" 
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="Confirm new password"
                     />
                   </div>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={() => setChangePasswordMode(false)}>Cancel</Button>
                   </div>
                 </div>
               )}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end gap-4 border-t bg-muted/20 px-6 py-4">
              <Button variant="ghost" onClick={() => { setIsEditing(false); setChangePasswordMode(false); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
