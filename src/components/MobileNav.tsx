import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = pathname === to;
    return (
      <Link to={to} className="flex flex-col items-center justify-center gap-1 w-full h-full">
        <Icon 
          className={cn(
            "w-6 h-6 transition-all duration-300", 
            isActive ? "text-primary fill-primary/20 scale-110" : "text-muted-foreground"
          )} 
        />
        <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10" />
      
      <div className="relative flex items-center justify-between px-2 h-16 sm:h-20 max-w-md mx-auto">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/explorer" icon={Search} label="Search" />
        
        {/* Central Rotating Add Button */}
        <div className="relative -top-5">
          <Link to="/upload-model">
            <motion.div
              whileTap={{ scale: 0.9, rotate: 90 }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] border-4 border-background"
            >
              <Plus className="w-7 h-7 text-white font-bold" />
            </motion.div>
          </Link>
        </div>

        <NavItem to="/launch" icon={Zap} label="Launch" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </div>
    </div>
  );
};