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
import logo from "@assets/generated_images/minimalist_academic_shield_logo_icon.png";
import { BookOpen, MessageSquare, Home, Menu, X, Mic, Book } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/practice/speaking", label: "Speaking", icon: Mic },
    { href: "/practice/reading", label: "Reading", icon: Book },
    { href: "/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span className="font-serif font-bold tracking-tight text-primary text-[15px]">
              PTE Prep<span className="text-secondary text-[20px]">PH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href}>
                      <a 
                        className={cn(
                          navigationMenuTriggerStyle(), 
                          "bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium transition-colors",
                          location === item.href && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        {item.label}
                      </a>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-2 pl-4 border-l border-border">
              <Button variant="ghost" size="sm">Log in</Button>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Get Started</Button>
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
                  <Button variant="outline" className="w-full justify-start">Log in</Button>
                  <Button className="w-full justify-start bg-primary">Get Started</Button>
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
                <img src={logo} alt="Logo" className="h-6 w-6 grayscale opacity-70" />
                <span className="font-serif font-bold text-lg text-foreground/80">PTE PrepUK</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering students to achieve their UK study dreams through comprehensive PTE Academic UKVI preparation resources and community support.
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
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Exam Policies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
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
            <p>© 2025 PTE PrepUK. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}