import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AixploriaHero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explorer?search=${encodeURIComponent(query)}`);
    }
  };

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
    // FIX: Increased top padding to pt-40 so content is not hidden by navbar
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
          Soch AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 animate-pulse">Explorer</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Discover, compare, and find the perfect AI tools for your workflow. 
          The largest curated library of AI models in India.
        </motion.p>

        {/* Central Search Bar */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full opacity-25 group-hover:opacity-60 transition duration-500 blur-lg"></div>
            <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-full p-2 border border-border shadow-2xl transition-all duration-300 group-hover:scale-[1.01]">
              <Search className="w-6 h-6 text-muted-foreground ml-4" />
              <Input 
                type="text" 
                placeholder="Search over 120+ AI tools..." 
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-lg placeholder:text-muted-foreground/70"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button size="lg" type="submit" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                Search
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Platform Logos */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Popular Platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-4 opacity-70">
            {platforms.map((p, i) => (
              <motion.div 
                key={p.name} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-lg border border-border/50 hover:bg-card hover:border-primary/30 transition-colors cursor-default"
              >
                <span className="font-semibold text-sm text-foreground">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};