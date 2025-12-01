import { Link } from "react-router-dom";
import { Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Soch AI</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              Store
            </span>
          </div>
        </Link>



        <div className="hidden md:flex items-center gap-3">
          <Link to="/explorer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Explorer
          </Link>
          <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link to="/subscription-plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Subscription Plans
          </Link>
          {isAuthenticated && currentUser ? (
            <UserAvatar user={currentUser} />
          ) : (
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 mt-6">
              <nav className="flex flex-col gap-4">
                <Link to="/explorer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explorer
                </Link>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
                <Link to="/subscription-plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Subscription Plans
                </Link>
                <div className="border-t border-border pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">About Soch AI</h3>
                  <div className="flex flex-col gap-3 pl-2">
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </Link>
                    <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                    <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Refund Policy
                    </Link>
                    <Link to="/data-safety" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      User Data Safety
                    </Link>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
                <Link to="/upload-model" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Submit Your Tools
                </Link>
                {isAuthenticated && currentUser ? (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                        {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3" 
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/signup" className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>


    </nav>
  );
};
