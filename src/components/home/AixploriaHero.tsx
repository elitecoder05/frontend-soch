import { Sparkles } from "lucide-react";
import { AnimatedSearchBar } from "@/components/AnimatedSearchBar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AixploriaHero = () => {
  const navigate = useNavigate();

  const platforms = [
    { name: "OpenAI", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Google", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Midjourney", icon: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    // Top padding (pt-40) ensures content is below the fixed Navbar
    <div className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
      {/* Pulsing Background Orb */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,217,255,0.15),transparent_55%)] pointer-events-none" 
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Sparkles className="w-3 h-3" />
          <span>The World's Best AI Tools Directory</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
          Soch AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 animate-pulse">Store</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Discover, compare, and find the perfect AI tools for your workflow. 
          India’s largest curated AI tools directory for creators, developers, students, and businesses.
        </motion.p>

        {/* Animated Search Bar Integration */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
          <AnimatedSearchBar />
        </motion.div>

        {/* Popular Platforms - Now Clickable filters */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Popular Platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-4 opacity-90">
            {platforms.map((p, i) => (
              <motion.button 
                key={p.name} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/explorer?search=${p.name}`)}
                className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-lg border border-border/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                {/* If you want to render the icons, uncomment the img tag below. 
                   For now, we stick to text as per your previous design to keep it clean.
                   <img src={p.icon} alt={p.name} className="w-4 h-4" /> 
                */}
                <span className="font-semibold text-sm text-foreground">{p.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};