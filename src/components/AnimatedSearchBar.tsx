import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Search for 'Chatbots'...",
  "Search for 'Video Generators'...",
  "Try 'Coding Assistants'...",
  "Find 'Marketing Tools'...",
  "Discover 'Image Generators'..."
];

export const AnimatedSearchBar = () => {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explorer?search=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full max-w-2xl mx-auto">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-md"></div>
      
      <div className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl overflow-hidden h-14">
        <Search className="w-5 h-5 text-muted-foreground ml-5 z-10" />
        
        <div className="flex-1 relative h-full flex items-center ml-3">
          <Input 
            type="text" 
            className="absolute inset-0 w-full h-full border-0 bg-transparent focus-visible:ring-0 text-lg z-20 placeholder:text-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          {/* Animated Placeholder Text */}
          {!query && (
            <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-muted-foreground/60 text-lg font-medium"
                >
                  {placeholders[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="rounded-full mr-1.5 px-6 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.4)] z-20"
        >
          Search
        </Button>
      </div>
    </form>
  );
};