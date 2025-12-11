// import { Link } from "react-router-dom";
// import { Video, Image, MessageSquare, Code, Megaphone, Zap, Bot, Music } from "lucide-react";
// import { Card } from "@/components/ui/card";

// export const CategoryBoxes = () => {
//   const categories = [
//     { name: "Video Generators", icon: Video, slug: "video", count: 12 },
//     { name: "Image Generators", icon: Image, slug: "image", count: 24 },
//     { name: "AI Chatbots", icon: MessageSquare, slug: "chatbots", count: 18 },
//     { name: "Code Assistants", icon: Code, slug: "code", count: 15 },
//     { name: "AI Marketing", icon: Megaphone, slug: "marketing", count: 9 },
//     { name: "Productivity", icon: Zap, slug: "productivity", count: 32 },
//     { name: "AI Agents", icon: Bot, slug: "agents", count: 7 },
//     { name: "Audio & Voice", icon: Music, slug: "audio", count: 11 },
//   ];

//   return (
//     <section className="container mx-auto px-4 mb-16">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Trending Categories</h2>
//         <Link to="/categories" className="text-sm text-primary hover:underline">View all categories</Link>
//       </div>
      
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {categories.map((cat) => (
//           <Link key={cat.slug} to={`/category/${cat.slug}`}>
//             <Card className="group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
//               <div className="p-6 flex flex-col items-center text-center gap-3">
//                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
//                   <cat.icon className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-foreground">{cat.name}</h3>
//                   <p className="text-xs text-muted-foreground mt-1">{cat.count} Tools</p>
//                 </div>
//               </div>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// };






// import { Link } from "react-router-dom";
// import { Video, Image, MessageSquare, Code, Megaphone, Zap, Bot, Music, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";

// export const CategoryBoxes = () => {
//   const categories = [
//     { name: "Video Generators", icon: Video, slug: "video", count: 12, color: "from-purple-500 to-indigo-500" },
//     { name: "Image Generators", icon: Image, slug: "image", count: 24, color: "from-pink-500 to-rose-500" },
//     { name: "AI Chatbots", icon: MessageSquare, slug: "chatbots", count: 18, color: "from-blue-500 to-cyan-500" },
//     { name: "Code Assistants", icon: Code, slug: "code", count: 15, color: "from-emerald-500 to-green-500" },
//     { name: "AI Marketing", icon: Megaphone, slug: "marketing", count: 9, color: "from-orange-500 to-amber-500" },
//     { name: "Productivity", icon: Zap, slug: "productivity", count: 32, color: "from-yellow-400 to-orange-400" },
//     { name: "AI Agents", icon: Bot, slug: "agents", count: 7, color: "from-red-500 to-pink-500" },
//     { name: "Audio & Voice", icon: Music, slug: "audio", count: 11, color: "from-violet-500 to-purple-500" },
//   ];

//   // Stagger animation configuration
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 }
//   };

//   return (
//     <section className="container mx-auto px-4 mb-24">
//       <div className="flex items-end justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Explore Categories</h2>
//           <p className="text-muted-foreground text-sm mt-1">Browse our curated collection by topic</p>
//         </div>
//         <Link to="/categories" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
//           View all <ChevronRight className="w-4 h-4" />
//         </Link>
//       </div>
      
//       <motion.div 
//         variants={container}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true, margin: "-50px" }}
//         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//       >
//         {categories.map((cat) => (
//           <motion.div key={cat.slug} variants={item}>
//             <Link to={`/category/${cat.slug}`} className="group block h-full">
//               <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)] hover:-translate-y-1">
//                 <div className="p-5 flex items-start justify-between h-full">
//                   <div className="flex flex-col gap-4">
//                     <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br transition-transform group-hover:scale-110 duration-300", cat.color)}>
//                       <cat.icon className="w-6 h-6" />
//                     </div>
//                     <div className="space-y-1">
//                       <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
//                         {cat.name}
//                       </h3>
//                       <p className="text-xs text-muted-foreground font-medium">
//                         {cat.count} Tools
//                       </p>
//                     </div>
//                   </div>
//                   <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-5 right-5 text-primary translate-x-2 group-hover:translate-x-0">
//                     <ChevronRight className="w-5 h-5" />
//                   </div>
//                 </div>
//                 {/* Decorative gradient blob */}
//                 <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br", cat.color)} />
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </motion.div>
//     </section>
//   );
// };






import { Link } from "react-router-dom";
import { Video, Image, MessageSquare, Code, Megaphone, Zap, Bot, Music, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const CategoryBoxes = () => {
  const categories = [
    { 
      name: "Video Generators", 
      icon: Video, 
      slug: "video", 
      count: 12, 
      color: "from-purple-600 to-indigo-600",
      textColor: "text-purple-400",
      borderColor: "group-hover:border-purple-500/50",
      triangleColor: "from-purple-500/80 via-purple-500/20 to-transparent",
      iconBg: "bg-purple-500/10 group-hover:bg-purple-500/20",
      shadowColor: "group-hover:shadow-purple-500/20",
    },
    { 
      name: "Image Generators", 
      icon: Image, 
      slug: "image", 
      count: 24, 
      color: "from-pink-600 to-rose-600",
      textColor: "text-pink-400",
      borderColor: "group-hover:border-pink-500/50",
      triangleColor: "from-pink-500/80 via-pink-500/20 to-transparent",
      iconBg: "bg-pink-500/10 group-hover:bg-pink-500/20",
      shadowColor: "group-hover:shadow-pink-500/20",
    },
    { 
      name: "AI Chatbots", 
      icon: MessageSquare, 
      slug: "chatbots", 
      count: 18, 
      color: "from-cyan-600 to-blue-600",
      textColor: "text-cyan-400",
      borderColor: "group-hover:border-cyan-500/50",
      triangleColor: "from-cyan-500/80 via-cyan-500/20 to-transparent",
      iconBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
      shadowColor: "group-hover:shadow-cyan-500/20",
    },
    { 
      name: "Code Assistants", 
      icon: Code, 
      slug: "code", 
      count: 15, 
      color: "from-emerald-600 to-green-600",
      textColor: "text-emerald-400",
      borderColor: "group-hover:border-emerald-500/50",
      triangleColor: "from-emerald-500/80 via-emerald-500/20 to-transparent",
      iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      shadowColor: "group-hover:shadow-emerald-500/20",
    },
    { 
      name: "AI Marketing", 
      icon: Megaphone, 
      slug: "marketing", 
      count: 9, 
      color: "from-orange-600 to-red-600",
      textColor: "text-orange-400",
      borderColor: "group-hover:border-orange-500/50",
      triangleColor: "from-orange-500/80 via-orange-500/20 to-transparent",
      iconBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
      shadowColor: "group-hover:shadow-orange-500/20",
    },
    { 
      name: "Productivity", 
      icon: Zap, 
      slug: "productivity", 
      count: 32, 
      color: "from-yellow-500 to-amber-500",
      textColor: "text-yellow-400",
      borderColor: "group-hover:border-yellow-500/50",
      triangleColor: "from-yellow-500/80 via-yellow-500/20 to-transparent",
      iconBg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
      shadowColor: "group-hover:shadow-yellow-500/20",
    },
    { 
      name: "AI Agents", 
      icon: Bot, 
      slug: "agents", 
      count: 7, 
      color: "from-red-600 to-rose-600",
      textColor: "text-red-400",
      borderColor: "group-hover:border-red-500/50",
      triangleColor: "from-red-500/80 via-red-500/20 to-transparent",
      iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
      shadowColor: "group-hover:shadow-red-500/20",
    },
    { 
      name: "Audio & Voice", 
      icon: Music, 
      slug: "audio", 
      count: 11, 
      color: "from-violet-600 to-purple-600",
      textColor: "text-violet-400",
      borderColor: "group-hover:border-violet-500/50",
      triangleColor: "from-violet-500/80 via-violet-500/20 to-transparent",
      iconBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
      shadowColor: "group-hover:shadow-violet-500/20",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="container mx-auto px-4 mb-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Explore Categories</h2>
          <p className="text-muted-foreground text-sm mt-1">Browse our curated collection by topic</p>
        </div>
        <Link to="/categories" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {categories.map((cat) => (
          <motion.div key={cat.slug} variants={item}>
            <Link to={`/category/${cat.slug}`} className="group block h-full">
              <div className={cn(
                "relative h-full overflow-hidden rounded-2xl border border-border bg-card/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                cat.borderColor,
                cat.shadowColor
              )}>
                
                {/* --- THE TECH TRIANGLE CORNER --- */}
                {/* This uses clip-path to create a perfect triangle in the top-left */}
                <div 
                  className={cn(
                    "absolute top-0 left-0 w-16 h-16 bg-gradient-to-br opacity-60 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100",
                    cat.triangleColor
                  )}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                />
                
                {/* Subtle Inner Glow Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
                  cat.color
                )} />

                {/* Content Container */}
                <div className="p-6 flex flex-col items-center justify-center text-center gap-4 h-full relative z-10">
                  
                  {/* Icon Container with specific color background */}
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg", 
                    cat.iconBg,
                    cat.textColor
                  )}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="space-y-1">
                    <h3 className={cn(
                      "font-bold text-base md:text-lg text-foreground transition-colors duration-300",
                      // Ensure text highlights on hover
                      `group-hover:${cat.textColor.split(' ')[0]}` 
                    )}>
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-80">
                      {cat.count} Tools
                    </p>
                  </div>
                </div>

                {/* Decorative Bottom-Right Glow Blob */}
                <div className={cn(
                  "absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-t", 
                  cat.color
                )} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};