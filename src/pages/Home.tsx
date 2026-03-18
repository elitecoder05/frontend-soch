

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreatorHero } from "@/components/home/CreatorHero";
import { AIToolsDiscoverySection } from "@/components/home/AIToolsDiscoverySection";
import { ToolColumnList } from "@/components/home/ToolColumnList";
import { PlatformStats } from "@/components/home/PlatformStats";
import { InfoSection } from "@/components/home/InfoSection";
import AdSense from "@/components/AdSense";
import { useAllModels } from "@/hooks/useModels";
// Removed FeaturedToolsSection import
import {
  Sparkles, Trophy, Zap, MessageCircle,
  BookOpen, Search, CheckCircle2,
  ListOrdered, Loader2, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  
  const { data: modelsData, isLoading } = useAllModels({ limit: 100, randomize: true });
  const allModels = modelsData?.data?.models || [];

  // --- FILTERS ---
  // 1. Get Featured Tools (Logic kept for "Soch AI Selection" list)
  const featuredTools = allModels.filter(m => {
    if (!m.isFeatured && !m.featured) return false;
    if (m.featuredExpiresAt) {
      const expiryDate = new Date(m.featuredExpiresAt);
      const now = new Date();
      return expiryDate > now;
    }
    return true;
  });

  const sponsoredModels = allModels.filter(m => !!m.isSponsored).slice(0, 10);
  
  const latestModels = [...allModels].sort((a, b) => 
    new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  ).slice(0, 10);

  const superTools = [...allModels].sort((a, b) => 
    (b.trendingScore || 0) - (a.trendingScore || 0)
  ).slice(0, 10);

  const chatModels = allModels.filter(m => 
    ['chatbots'].includes(m.category)
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pb-24 lg:pb-0">
        <CreatorHero />

        <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-16 space-y-12 lg:space-y-24">

          {/* 1. AI Tools Discovery Section */}
          <section>
            <AIToolsDiscoverySection />
          </section>

          {/* 2. AI Tools Grid */}
          <section>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading AI Tools...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                
                {sponsoredModels.length > 0 && (
                    <ToolColumnList 
                      title="Sponsored Tools" 
                      icon={<Crown className="w-4 h-4 text-orange-500" />}
                      tools={sponsoredModels}
                      viewAllLink="/explorer?sponsored=true"
                      isScrollable={false}
                    />
                )}

                <ToolColumnList 
                  title="Latest Tools" 
                  icon={<Sparkles className="w-4 h-4 text-blue-400" />}
                  tools={latestModels}
                  viewAllLink="/explorer?sort=newest"
                />

                <ToolColumnList 
                  title="Soch AI Selection" 
                  icon={<Trophy className="w-4 h-4 text-yellow-400" />}
                  tools={featuredTools} 
                  viewAllLink="/explorer?featured=true"
                />

                <ToolColumnList 
                  title="Super Tools" 
                  icon={<Zap className="w-4 h-4 text-purple-400" />}
                  tools={superTools}
                  viewAllLink="/explorer?sort=trending"
                />

                <ToolColumnList 
                  title="AI Chatbots" 
                  icon={<MessageCircle className="w-4 h-4 text-green-400" />}
                  tools={chatModels}
                  viewAllLink="/category/chatbots"
                />
              </div>
            )}
          </section>

          {/* 3. Platform Stats */}
          <section>
            <PlatformStats />
          </section>

          {/* 4. Informational Sections */}
          <section className="pt-8 border-t border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InfoSection 
                mainIcon={BookOpen}
                mainTitle="Soch AI: Your guide"
                cards={[
                  {
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                    title: "Ergonomics & Design",
                    description: "The site is neat and clear, with good ergonomics to ensure you get quick results."
                  },
                  {
                    icon: <Search className="w-5 h-5 text-blue-500" />,
                    title: "Smart Discovery",
                    description: "Whether you're looking for translation or image generation, we have it all."
                  }
                ]}
              />
              <InfoSection 
                mainIcon={Trophy}
                mainTitle="Top 10 Best AI"
                cards={[
                  {
                    icon: <ListOrdered className="w-5 h-5 text-purple-500" />,
                    title: "Curated Rankings",
                    description: "Updates in real-time to show the top 10 AI in each category."
                  },
                  {
                    icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
                    title: "Hand-Picked Quality",
                    description: "We carefully select the most innovative and useful AIs."
                  }
                ]}
              />
            </div>
          </section>

          <section className="pb-8">
            <div className="bg-gradient-to-r from-[#005fcc] to-[#00aeef] border border-border rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group hover:border-primary/30 transition-all shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                  Have an AI Tool?
                </h2>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join the largest AI community in India. Submit your tool to Soch AI Store and reach thousands of daily users instantly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/upload-model')} 
                    className="h-12 px-8 text-base bg-white text-black hover:bg-gray-100 font-bold rounded-full transition-transform hover:scale-105"
                  >
                    Submit Your Tool
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/contact')} 
                    className="h-12 px-8 text-base bg-white text-black hover:bg-gray-100 font-bold rounded-full transition-transform hover:scale-105"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* AdSense Ad */}
        <section className="container mx-auto px-4 my-4">
          <div className="max-w-4xl mx-auto">
            <AdSense 
              adSlot="1234567890"
              adFormat="horizontal"
              style={{ display: 'block', textAlign: 'center', minHeight: '50px' }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;