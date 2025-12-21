import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const placeholders = [
  "Search for 'Chatbots'...",
  "Search for 'Video Generators'...",
  "Try 'Coding Assistants'...",
  "Find 'Marketing Tools'...",
  "Discover 'Image Generators'..."
];

interface AnimatedSearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void; // Callback for live search (Explorer)
  initialValue?: string; // Initial value from URL
}

export const AnimatedSearchBar = ({ 
  className, 
  autoFocus = false, 
  onSearch, 
  initialValue = "" 
}: AnimatedSearchBarProps) => {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  // 1. Cycle through placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. Sync local state if parent (URL) changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // 3. Handle Input Change (Live Search)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    
    // If a handler exists (Explorer page), trigger immediately for "Play Store" feel
    if (onSearch) {
      onSearch(newVal);
    }
  };

  // 4. Handle Submit (Enter Key or Button)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // If we are NOT on a page that handles search (like Home), navigate
    if (!onSearch && query.trim()) {
      navigate(`/explorer?search=${encodeURIComponent(query)}`);
    }
  };

  // 5. Clear Search
  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative group w-full ${className}`}>
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-md"></div>
      
      <div className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl overflow-hidden h-12 md:h-14">
        <Search className="w-5 h-5 text-muted-foreground ml-5 z-10" />
        
        <div className="flex-1 relative h-full flex items-center ml-3">
          <Input 
            type="text" 
            autoFocus={autoFocus}
            className="absolute inset-0 w-full h-full border-0 bg-transparent focus-visible:ring-0 text-base md:text-lg z-20 placeholder:text-transparent text-foreground"
            value={query}
            onChange={handleInputChange}
          />
          
          {/* Animated Placeholder Text - Only show if query is empty */}
          {!query && (
            <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-muted-foreground/60 text-sm md:text-lg font-medium truncate pr-4"
                >
                  {placeholders[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Clear Button (Visible only when typing) */}
        {query && (
          <button 
            type="button"
            onClick={handleClear}
            className="mr-2 p-1 rounded-full hover:bg-muted/50 text-muted-foreground transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <Button 
          type="submit" 
          size="lg" 
          className="rounded-full mr-1.5 px-4 md:px-6 h-9 md:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.4)] z-20"
        >
          Search
        </Button>
      </div>
    </form>
  );
};