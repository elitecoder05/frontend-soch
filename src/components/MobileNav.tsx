// // import { Link, useLocation } from "react-router-dom";
// // import { Home, Search, Plus, User, Zap } from "lucide-react";
// // import { motion } from "framer-motion";
// // import { cn } from "@/lib/utils";

// // export const MobileNav = () => {
// //   const location = useLocation();
// //   const pathname = location.pathname;

// //   const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
// //     const isActive = pathname === to;
// //     return (
// //       <Link to={to} className="flex flex-col items-center justify-center gap-1 w-full h-full">
// //         <Icon 
// //           className={cn(
// //             "w-6 h-6 transition-all duration-300", 
// //             isActive ? "text-primary fill-primary/20 scale-110" : "text-muted-foreground"
// //           )} 
// //         />
// //         <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
// //           {label}
// //         </span>
// //       </Link>
// //     );
// //   };

// //   return (
// //     <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
// //       {/* Glassmorphism Background */}
// //       <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10" />
      
// //       <div className="relative flex items-center justify-between px-2 h-16 sm:h-20 max-w-md mx-auto">
// //         <NavItem to="/" icon={Home} label="Home" />
// //         <NavItem to="/explorer" icon={Search} label="Search" />
        
// //         {/* Central Rotating Add Button */}
// //         <div className="relative -top-5">
// //           <Link to="/upload-model">
// //             <motion.div
// //               whileTap={{ scale: 0.9, rotate: 90 }}
// //               className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] border-4 border-background"
// //             >
// //               <Plus className="w-7 h-7 text-white font-bold" />
// //             </motion.div>
// //           </Link>
// //         </div>

// //         <NavItem to="/launch" icon={Zap} label="Launch" />
// //         <NavItem to="/profile" icon={User} label="Profile" />
// //       </div>
// //     </div>
// //   );
// // };






// import { Link, useLocation } from "react-router-dom";
// import { Home, Search, Plus, User, Zap } from "lucide-react";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

// export const MobileNav = () => {
//   const location = useLocation();
//   const pathname = location.pathname;

//   // Point #3: Hide tabs on Intro (Landing) page and Admin routes
//   if (pathname === '/intro' || pathname.startsWith('/admin')) {
//     return null;
//   }

//   const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
//     const isActive = pathname === to;
//     return (
//       <Link to={to} className="flex flex-col items-center justify-center gap-1 w-full h-full">
//         <Icon 
//           className={cn(
//             "w-6 h-6 transition-all duration-300", 
//             isActive ? "text-primary fill-primary/20 scale-110" : "text-muted-foreground"
//           )} 
//         />
//         <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
//           {label}
//         </span>
//       </Link>
//     );
//   };

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
//       {/* Glassmorphism Background */}
//       <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10" />
      
//       <div className="relative flex items-center justify-between px-2 h-16 sm:h-20 max-w-md mx-auto">
//         <NavItem to="/" icon={Home} label="Home" />
//         <NavItem to="/search" icon={Search} label="Search" />
        
//         {/* Central Rotating Add Button */}
//         <div className="relative -top-5">
//           <Link to="/upload-model">
//             <motion.div
//               whileTap={{ scale: 0.9, rotate: 90 }}
//               className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] border-4 border-background"
//             >
//               <Plus className="w-7 h-7 text-white font-bold" />
//             </motion.div>
//           </Link>
//         </div>

//         <NavItem to="/launch" icon={Zap} label="Launch" />
//         <NavItem to="/profile" icon={User} label="Profile" />
//       </div>
//     </div>
//   );
// };


import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // 1. Hide on Intro and Admin pages
  if (pathname === '/intro' || pathname.startsWith('/admin')) {
    return null;
  }

  // 2. Helper Component for Nav Items
  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    // Active state logic
    const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
    
    return (
      <Link 
        to={to} 
        className={cn(
          "flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300 relative",
          // Text & Icon Color
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {/* Active Indicator Dot (Optional aesthetic touch) */}
        {isActive && (
          <span className="absolute -top-3 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        )}

        <Icon 
          strokeWidth={isActive ? 2.5 : 2}
          className={cn(
            "w-6 h-6 transition-transform duration-300",
            isActive && "scale-110"
          )} 
        />
        <span className="text-[10px] font-medium tracking-tight">{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 md:hidden flex justify-center px-4">
      {/* Floating Capsule Container */}
      <div className="flex items-center justify-between w-full max-w-sm h-16 px-2 bg-[#0f1117]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
        
        {/* 1. Home */}
        <NavItem to="/" icon={Home} label="Home" />
        
        {/* 2. Search */}
        <NavItem to="/explorer" icon={Search} label="Search" />
        
        {/* 3. Add (Inline, behaves exactly like other tabs) */}
        <NavItem to="/upload-model" icon={Plus} label="Add" />

        {/* 4. Profile */}
        <NavItem to="/profile" icon={User} label="Profile" />
        
      </div>
    </div>
  );
};