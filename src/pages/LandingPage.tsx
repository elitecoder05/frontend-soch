import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">Soch AI Store</span>
        </div>
        <Button onClick={() => navigate('/')} className="rounded-full">
          Start Exploring <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 mt-10 md:mt-0">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
          Promote your AI <br /> on Soch AI Store
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          The largest directory for the next generation of AI tools. Discover, Launch, and Scale your AI business today.
        </p>

        {/* Functional Search Bar */}
        <div className="w-full max-w-md relative group mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-card border border-border rounded-full shadow-2xl p-2 pl-6">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input 
              type="text" 
              placeholder="Search for AI tools..." 
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70 text-lg"
              onFocus={() => navigate('/search')} // Redirects to functional search page
            />
            <Button size="sm" onClick={() => navigate('/search')} className="rounded-full px-6">
              Search
            </Button>
          </div>
        </div>

        {/* Popular Platforms */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Trusted Platforms</p>
          <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-bold text-xl cursor-pointer hover:text-primary" onClick={() => navigate('/explorer?search=OpenAI')}>OpenAI</span>
             <span className="font-bold text-xl cursor-pointer hover:text-primary" onClick={() => navigate('/explorer?search=Google')}>Google</span>
             <span className="font-bold text-xl cursor-pointer hover:text-primary" onClick={() => navigate('/explorer?search=HuggingFace')}>HuggingFace</span>
             <span className="font-bold text-xl cursor-pointer hover:text-primary" onClick={() => navigate('/explorer?search=MidJourney')}>MidJourney</span>
          </div>
        </div>
      </main>
    </div>
  );
};