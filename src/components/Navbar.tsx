// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import { Menu, Plus, X, ChevronRight, Sparkles } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { UserAvatar } from "@/components/UserAvatar";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { useToast } from "@/hooks/use-toast";
// // import { useState, useEffect } from "react";
// // import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// // import { cn } from "@/lib/utils";

// // interface NavbarProps {
// //   searchQuery?: string;
// //   onSearchChange?: (query: string) => void;
// // }

// // export const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
// //   const { isAuthenticated, currentUser, logout } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { toast } = useToast();
// //   const [scrolled, setScrolled] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setScrolled(window.scrollY > 10);
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   const handleSubmitToolsClick = () => {
// //     if (!isAuthenticated) {
// //       toast({ title: "Login Required", description: "Please login to submit tools.", variant: "destructive" });
// //       navigate('/login', { state: { from: { pathname: '/upload-model' } } });
// //       return;
// //     }
// //     if (!currentUser?.isProUser) {
// //       toast({ title: "Pro Required", description: "Upgrade to Pro to submit tools.", variant: "destructive" });
// //       navigate('/pricing');
// //       return;
// //     }
// //     navigate('/upload-model');
// //   };

// //   const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
// //     const isActive = location.pathname === to;
// //     return (
// //       <Link 
// //         to={to} 
// //         className={cn(
// //           "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
// //           isActive 
// //             ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]" 
// //             : "text-muted-foreground hover:text-foreground hover:bg-white/5"
// //         )}
// //       >
// //         {children}
// //       </Link>
// //     );
// //   };

// //   return (
// //     <header
// //       className={cn(
// //         "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
// //         "bg-background/80 backdrop-blur-xl border-primary/20", // Always visible base
// //         "hover:bg-background/95 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]", // Enhanced hover
// //         scrolled && "shadow-lg shadow-black/20"
// //       )}
// //     >
// //       <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        
// //         {/* LEFT: LOGO */}
// //         <Link to="/" className="flex items-center gap-3 z-20 group">
// //           <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-primary/50 transition-all duration-500">
// //             <img 
// //               src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7" 
// //               alt="Soch AI Logo" 
// //               className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
// //             />
// //           </div>
// //           <div className="hidden md:flex flex-col justify-center">
// //             <span className="text-xl font-bold text-foreground leading-none tracking-tight">
// //               Soch AI
// //             </span>
// //             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
// //               Store
// //             </span>
// //           </div>
// //         </Link>

// //         {/* CENTER: CYLINDER NAVIGATION */}
// //         <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
// //           <nav className="flex items-center p-1.5 gap-1 bg-black/40 border border-white/10 rounded-full shadow-inner ring-1 ring-white/5">
// //             <NavLink to="/explorer">Explorer</NavLink>
// //             <NavLink to="/categories">Categories</NavLink>
// //             <NavLink to="/pricing">Pricing</NavLink>
// //           </nav>
// //         </div>

// //         {/* RIGHT: ACTIONS */}
// //         <div className="hidden md:flex items-center gap-4 z-20">
// //           <button 
// //             onClick={handleSubmitToolsClick}
// //             className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
// //           >
// //             <Plus className="w-4 h-4" />
// //             <span>Submit Tool</span>
// //           </button>

// //           <div className="h-6 w-px bg-border/50" />

// //           {isAuthenticated && currentUser ? (
// //             <UserAvatar user={currentUser} />
// //           ) : (
// //             <Link to="/signup">
// //               <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6">
// //                 Get Started
// //                 <Sparkles className="w-3.5 h-3.5 ml-2 opacity-70" />
// //               </Button>
// //             </Link>
// //           )}
// //         </div>

// //         {/* MOBILE MENU */}
// //         <div className="flex md:hidden items-center gap-4">
// //           {isAuthenticated && currentUser && <UserAvatar user={currentUser} />}
// //           <Sheet>
// //             <SheetTrigger asChild>
// //               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
// //                 <Menu className="w-6 h-6" />
// //               </Button>
// //             </SheetTrigger>
// //             <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur-xl p-6">
// //               <div className="flex flex-col h-full">
// //                 <div className="flex items-center justify-between mb-8">
// //                   <span className="text-lg font-bold">Menu</span>
// //                   <SheetClose asChild>
// //                     <Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
// //                   </SheetClose>
// //                 </div>
                
// //                 <div className="flex flex-col gap-2">
// //                   <Link to="/explorer" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Explorer</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
// //                   <Link to="/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Categories</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
// //                   <Link to="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Pricing</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
// //                   <div className="h-px bg-border my-2" />
// //                   <button onClick={handleSubmitToolsClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left text-primary">
// //                     <span className="font-medium">Submit Tool</span>
// //                     <Plus className="w-4 h-4" />
// //                   </button>
// //                 </div>

// //                 <div className="mt-auto pt-6 border-t border-border">
// //                   {!isAuthenticated && (
// //                     <Link to="/signup">
// //                       <Button className="w-full rounded-full">Get Started</Button>
// //                     </Link>
// //                   )}
// //                   {isAuthenticated && (
// //                     <Button variant="outline" className="w-full rounded-full" onClick={logout}>Logout</Button>
// //                   )}
// //                 </div>
// //               </div>
// //             </SheetContent>
// //           </Sheet>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import { Menu, Plus, X, ChevronRight, Sparkles, ShieldAlert } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { UserAvatar } from "@/components/UserAvatar";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { useToast } from "@/hooks/use-toast";
// // import { useState, useEffect } from "react";
// // import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// // import { cn } from "@/lib/utils";

// // interface NavbarProps {
// //   searchQuery?: string;
// //   onSearchChange?: (query: string) => void;
// // }

// // export const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
// //   const { isAuthenticated, currentUser, logout } = useAuth();
// //   console.log("Current User Role Debug:", { 
// //   isAuthenticated, 
// //   role: currentUser?.role, 
// //   email: currentUser?.email 
// // });
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { toast } = useToast();
// //   const [scrolled, setScrolled] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setScrolled(window.scrollY > 10);
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   const handleSubmitToolsClick = () => {
// //     if (!isAuthenticated) {
// //       toast({ title: "Login Required", description: "Please login to submit tools.", variant: "destructive" });
// //       navigate('/login', { state: { from: { pathname: '/upload-model' } } });
// //       return;
// //     }
// //     if (!currentUser?.isProUser) {
// //       toast({ title: "Pro Required", description: "Upgrade to Pro to submit tools.", variant: "destructive" });
// //       navigate('/pricing');
// //       return;
// //     }
// //     navigate('/upload-model');
// //   };

// //   const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
// //     const isActive = location.pathname === to;
// //     return (
// //       <Link 
// //         to={to} 
// //         className={cn(
// //           "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
// //           isActive 
// //             ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]" 
// //             : "text-muted-foreground hover:text-foreground hover:bg-white/5"
// //         )}
// //       >
// //         {children}
// //       </Link>
// //     );
// //   };

// //   return (
// //     <header
// //       className={cn(
// //         "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
// //         "bg-background/80 backdrop-blur-xl border-primary/20", // Always visible base
// //         "hover:bg-background/95 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]", // Enhanced hover
// //         scrolled && "shadow-lg shadow-black/20"
// //       )}
// //     >
// //       <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        
// //         {/* LEFT: LOGO */}
// //         <Link to="/" className="flex items-center gap-3 z-20 group">
// //           <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-primary/50 transition-all duration-500">
// //             <img 
// //               src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7" 
// //               alt="Soch AI Logo" 
// //               className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
// //             />
// //           </div>
// //           <div className="hidden md:flex flex-col justify-center">
// //             <span className="text-xl font-bold text-foreground leading-none tracking-tight">
// //               Soch AI
// //             </span>
// //             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
// //               Store
// //             </span>
// //           </div>
// //         </Link>

// //         {/* CENTER: CYLINDER NAVIGATION */}
// //         <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
// //           <nav className="flex items-center p-1.5 gap-1 bg-black/40 border border-white/10 rounded-full shadow-inner ring-1 ring-white/5">
// //             <NavLink to="/explorer">Explorer</NavLink>
// //             <NavLink to="/categories">Categories</NavLink>
// //             <NavLink to="/pricing">Pricing</NavLink>
// //           </nav>
// //         </div>

// //         {/* RIGHT: ACTIONS */}
// //         <div className="hidden md:flex items-center gap-4 z-20">
          
// //           {/* ADMIN BUTTON (Desktop) */}
// //           {isAuthenticated && currentUser?.role === 'admin' && (
// //             <Link to="/admin">
// //               <button className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/30 rounded-full hover:bg-red-600/20 transition-all duration-300 text-sm font-medium">
// //                 <ShieldAlert className="w-4 h-4" />
// //                 <span>Admin</span>
// //               </button>
// //             </Link>
// //           )}

// //           <button 
// //             onClick={handleSubmitToolsClick}
// //             className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
// //           >
// //             <Plus className="w-4 h-4" />
// //             <span>Submit Tool</span>
// //           </button>

// //           <div className="h-6 w-px bg-border/50" />

// //           {isAuthenticated && currentUser ? (
// //             <UserAvatar user={currentUser} />
// //           ) : (
// //             <Link to="/signup">
// //               <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6">
// //                 Get Started
// //                 <Sparkles className="w-3.5 h-3.5 ml-2 opacity-70" />
// //               </Button>
// //             </Link>
// //           )}
// //         </div>

// //         {/* MOBILE MENU */}
// //         <div className="flex md:hidden items-center gap-4">
// //           {isAuthenticated && currentUser && <UserAvatar user={currentUser} />}
// //           <Sheet>
// //             <SheetTrigger asChild>
// //               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
// //                 <Menu className="w-6 h-6" />
// //               </Button>
// //             </SheetTrigger>
// //             <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur-xl p-6">
// //               <div className="flex flex-col h-full">
// //                 <div className="flex items-center justify-between mb-8">
// //                   <span className="text-lg font-bold">Menu</span>
// //                   <SheetClose asChild>
// //                     <Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
// //                   </SheetClose>
// //                 </div>
                
// //                 <div className="flex flex-col gap-2">
// //                   <Link to="/explorer" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Explorer</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
// //                   <Link to="/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Categories</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
// //                   <Link to="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
// //                     <span className="font-medium">Pricing</span>
// //                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
// //                   </Link>
                  
// //                   <div className="h-px bg-border my-2" />
                  
// //                   {/* ADMIN LINK (Mobile) */}
// //                   {isAuthenticated && currentUser?.role === 'admin' && (
// //                      <Link to="/admin" className="flex items-center justify-between p-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 transition-colors">
// //                        <div className="flex items-center gap-2">
// //                          <ShieldAlert className="w-4 h-4" />
// //                          <span className="font-medium">Admin Panel</span>
// //                        </div>
// //                        <ChevronRight className="w-4 h-4" />
// //                      </Link>
// //                   )}

// //                   <button onClick={handleSubmitToolsClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left text-primary">
// //                     <span className="font-medium">Submit Tool</span>
// //                     <Plus className="w-4 h-4" />
// //                   </button>
// //                 </div>

// //                 <div className="mt-auto pt-6 border-t border-border">
// //                   {!isAuthenticated && (
// //                     <Link to="/signup">
// //                       <Button className="w-full rounded-full">Get Started</Button>
// //                     </Link>
// //                   )}
// //                   {isAuthenticated && (
// //                     <Button variant="outline" className="w-full rounded-full" onClick={logout}>Logout</Button>
// //                   )}
// //                 </div>
// //               </div>
// //             </SheetContent>
// //           </Sheet>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };



// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Menu, Plus, X, ChevronRight, Sparkles, ShieldAlert } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { UserAvatar } from "@/components/UserAvatar";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { useState, useEffect } from "react";
// import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// import { cn } from "@/lib/utils";

// interface NavbarProps {
//   searchQuery?: string;
//   onSearchChange?: (query: string) => void;
// }

// export const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
//   const { isAuthenticated, currentUser, logout } = useAuth();
//   // Debug log retained as per your source
//   console.log("Current User Role Debug:", { 
//     isAuthenticated, 
//     role: currentUser?.role, 
//     email: currentUser?.email 
//   });
  
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSubmitToolsClick = () => {
//     if (!isAuthenticated) {
//       toast({ title: "Login Required", description: "Please login to submit tools.", variant: "destructive" });
//       navigate('/login', { state: { from: { pathname: '/upload-model' } } });
//       return;
//     }
//     // Optional: Check Pro status if that's a hard requirement
//     // if (!currentUser?.isProUser) { ... }
    
//     navigate('/upload-model');
//   };

//   const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
//     const isActive = location.pathname === to;
//     return (
//       <Link 
//         to={to} 
//         className={cn(
//           "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
//           isActive 
//             ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]" 
//             : "text-muted-foreground hover:text-foreground hover:bg-white/5"
//         )}
//       >
//         {children}
//       </Link>
//     );
//   };

//   return (
//     <header
//       className={cn(
//         "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
//         "bg-background/80 backdrop-blur-xl border-primary/20", // Always visible base
//         "hover:bg-background/95 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]", // Enhanced hover
//         scrolled && "shadow-lg shadow-black/20"
//       )}
//     >
//       <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        
//         {/* LEFT: LOGO */}
//         <Link to="/" className="flex items-center gap-3 z-20 group">
//           <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-primary/50 transition-all duration-500">
//             <img 
//               src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7" 
//               alt="Soch AI Logo" 
//               className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
//             />
//           </div>
//           {/* Text hidden on very small screens, shown on tablet+ */}
//           <div className="hidden sm:flex flex-col justify-center">
//             <span className="text-xl font-bold text-foreground leading-none tracking-tight">
//               Soch AI
//             </span>
//             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
//               Store
//             </span>
//           </div>
//         </Link>

//         {/* CENTER: CYLINDER NAVIGATION */}
//         {/* ✅ CHANGED: hidden md:flex -> hidden lg:flex */}
//         {/* This hides the center nav on Tablets (iPad) to prevent overlap */}
//         <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
//           <nav className="flex items-center p-1.5 gap-1 bg-black/40 border border-white/10 rounded-full shadow-inner ring-1 ring-white/5">
//             <NavLink to="/explorer">Explorer</NavLink>
//             <NavLink to="/categories">Categories</NavLink>
//             <NavLink to="/pricing">Pricing</NavLink>
//           </nav>
//         </div>

//         {/* RIGHT: ACTIONS */}
//         {/* ✅ CHANGED: hidden md:flex -> hidden lg:flex */}
//         <div className="hidden lg:flex items-center gap-4 z-20">
          
//           {/* ADMIN BUTTON (Desktop) */}
//           {isAuthenticated && currentUser?.role === 'admin' && (
//             <Link to="/admin">
//               <button className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/30 rounded-full hover:bg-red-600/20 transition-all duration-300 text-sm font-medium">
//                 <ShieldAlert className="w-4 h-4" />
//                 <span>Admin</span>
//               </button>
//             </Link>
//           )}

//           <button 
//             onClick={handleSubmitToolsClick}
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Submit Tool</span>
//           </button>

//           <div className="h-6 w-px bg-border/50" />

//           {isAuthenticated && currentUser ? (
//             <UserAvatar user={currentUser} />
//           ) : (
//             <Link to="/signup">
//               <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6">
//                 Get Started
//                 <Sparkles className="w-3.5 h-3.5 ml-2 opacity-70" />
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* MOBILE / TABLET MENU */}
//         {/* ✅ CHANGED: flex md:hidden -> flex lg:hidden */}
//         {/* This ensures the Hamburger menu appears on Tablets too */}
//         <div className="flex lg:hidden items-center gap-4">
//           {isAuthenticated && currentUser && <UserAvatar user={currentUser} />}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                 <Menu className="w-6 h-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur-xl p-6">
//               <div className="flex flex-col h-full">
//                 <div className="flex items-center justify-between mb-8">
//                   <span className="text-lg font-bold">Menu</span>
//                   <SheetClose asChild>
//                     <Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
//                   </SheetClose>
//                 </div>
                
//                 <div className="flex flex-col gap-2">
//                   <Link to="/explorer" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
//                     <span className="font-medium">Explorer</span>
//                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                   </Link>
//                   <Link to="/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
//                     <span className="font-medium">Categories</span>
//                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                   </Link>
//                   <Link to="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
//                     <span className="font-medium">Pricing</span>
//                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                   </Link>
                  
//                   <div className="h-px bg-border my-2" />
                  
//                   {/* ADMIN LINK (Mobile) */}
//                   {isAuthenticated && currentUser?.role === 'admin' && (
//                       <Link to="/admin" className="flex items-center justify-between p-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 transition-colors">
//                         <div className="flex items-center gap-2">
//                           <ShieldAlert className="w-4 h-4" />
//                           <span className="font-medium">Admin Panel</span>
//                         </div>
//                         <ChevronRight className="w-4 h-4" />
//                       </Link>
//                   )}

//                   <button onClick={handleSubmitToolsClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left text-primary">
//                     <span className="font-medium">Submit Tool</span>
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <div className="mt-auto pt-6 border-t border-border">
//                   {!isAuthenticated && (
//                     <Link to="/signup">
//                       <Button className="w-full rounded-full">Get Started</Button>
//                     </Link>
//                   )}
//                   {isAuthenticated && (
//                     <Button variant="outline" className="w-full rounded-full" onClick={logout}>Logout</Button>
//                   )}
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// };

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, X, ChevronRight, Sparkles, ShieldAlert, Compass, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmitToolsClick = () => {
    navigate('/submit-tool');
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={cn(
          "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
          isActive 
            ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        "bg-background/80 backdrop-blur-xl border-primary/20", 
        "hover:bg-background/95 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]",
        scrolled && "shadow-lg shadow-black/20"
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        
        {/* --- LEFT: LOGO --- */}
        <Link to="/" className="flex items-center gap-3 z-20 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-primary/50 transition-all duration-500">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7" 
              alt="Soch AI Logo" 
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {/* Logo Text: Hidden on mobile (xs), visible on sm+ */}
          <div className="hidden sm:flex flex-col justify-center">
            <span className="text-xl font-bold text-foreground leading-none tracking-tight">
              Soch AI
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              Store
            </span>
          </div>
        </Link>

        {/* --- CENTER: NAVIGATION (Desktop Only) --- */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <nav className="flex items-center p-1.5 gap-1 bg-black/40 border border-white/10 rounded-full shadow-inner ring-1 ring-white/5">
            <NavLink to="/explorer">Explorer</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/soch-ai-apps">Soch AI Apps</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
          </nav>
        </div>

        {/* --- RIGHT: ACTIONS (Desktop Only) --- */}
        <div className="hidden lg:flex items-center gap-4 z-20">
          {isAuthenticated && currentUser?.role === 'admin' && (
            <Link to="/admin">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/30 rounded-full hover:bg-red-600/20 transition-all duration-300 text-sm font-medium">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </Link>
          )}

          <button 
            onClick={handleSubmitToolsClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Tool</span>
          </button>

          <div className="h-6 w-px bg-border/50" />

          {isAuthenticated && currentUser ? (
            <UserAvatar user={currentUser} />
          ) : (
            <Link to="/signup">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6">
                Get Started
                <Sparkles className="w-3.5 h-3.5 ml-2 opacity-70" />
              </Button>
            </Link>
          )}
        </div>

        {/* --- MOBILE / TABLET MENU (Visible < lg) --- */}
        <div className="flex lg:hidden items-center gap-3">
          
          {/* ✅ 1. Explore Button (Left of Profile/Menu) */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/explorer')}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Compass className="w-6 h-6" />
          </Button>

          {/* ✅ 2. Profile Button (Only if logged in) */}
          {isAuthenticated && currentUser && <UserAvatar user={currentUser} />}
          
          {/* ✅ 3. Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur-xl p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
                  </SheetClose>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link to="/explorer" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <span className="font-medium">Explorer</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <Link to="/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <span className="font-medium">Categories</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <Link to="/soch-ai-apps" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Soch AI Apps</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <Link to="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <span className="font-medium">Pricing</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  
                  <div className="h-px bg-border my-2" />
                  
                  {isAuthenticated && currentUser?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center justify-between p-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 transition-colors">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="font-medium">Admin Panel</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                  )}

                  <button onClick={handleSubmitToolsClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left text-primary">
                    <span className="font-medium">Submit Tool</span>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  {!isAuthenticated && (
                    <Link to="/signup">
                      <Button className="w-full rounded-full">Get Started</Button>
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Button variant="outline" className="w-full rounded-full" onClick={logout}>Logout</Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};