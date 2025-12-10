import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare, Home, Menu, X, Mic, Book, Headphones, User, LogOut, PenTool } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useUser();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/guide/speaking", label: "Speaking", icon: Mic },
    { href: "/guide/reading", label: "Reading", icon: Book },
    { href: "/guide/listening", label: "Listening", icon: Headphones },
    { href: "/guide/writing", label: "Writing", icon: PenTool },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span className="font-serif font-bold tracking-tight text-primary text-[20px]">
              PTE Prep<span className="text-secondary text-[20px]">PH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(), 
                        "bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium transition-colors",
                        location === item.href && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-2 pl-4 border-l border-border">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/auth?mode=login">Log in</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                    <Link href="/auth?mode=register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {user && (
                    <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-muted/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 text-lg font-medium px-4 py-2 rounded-md transition-colors cursor-pointer",
                        location === item.href 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  
                  {user ? (
                    <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/auth?mode=login">Log in</Link>
                      </Button>
                      <Button asChild className="w-full justify-start bg-primary">
                         <Link href="/auth?mode=register">Get Started</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-muted/30 border-t py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg text-foreground/80">PTE PrepPH</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering our candidates to achieve their dreams through a comprehensive PTE Academic preparation, resources, and community support.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif font-semibold mb-4 text-foreground">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/reviews" className="hover:text-primary transition-colors">Exam Reviews</Link></li>
                <li><Link href="/resources" className="hover:text-primary transition-colors">Study Materials</Link></li>
                <li><Link href="/practice/speaking" className="hover:text-primary transition-colors">Speaking Practice</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Exam Policies</a></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-semibold mb-4 text-foreground">Stay Updated</h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button size="sm" className="bg-primary">Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PTE PrepPH. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}