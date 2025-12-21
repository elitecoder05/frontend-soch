import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AixploriaHero } from "@/components/home/AixploriaHero";
import { CategoryBoxes } from "@/components/home/CategoryBoxes";
import { ToolColumnList } from "@/components/home/ToolColumnList";
import { InfoSection } from "@/components/home/InfoSection";
import { PromotionWidget } from "@/components/home/PromotionWidget";
import AdSense from "@/components/AdSense";
import { useAllModels } from "@/hooks/useModels";
import { 
  Sparkles, Trophy, Zap, MessageCircle, 
  BookOpen, Search, CheckCircle2, 
  ListOrdered, Loader2, Crown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SpotlightBanner } from "@/components/home/SpotlightBanner"; 

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch all models
  const { data: modelsData, isLoading } = useAllModels({ limit: 100 });
  const allModels = modelsData?.data?.models || [];

  // --- FILTERS ---
  const campaignModels = allModels.filter(m => !!m.hasCustomCampaign);
  const sponsoredModels = allModels.filter(m => !!m.isSponsored);
  const selectedModels = allModels.filter(m => !!m.featured).slice(0, 10);

  const latestModels = [...allModels].sort((a, b) => 
    new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  ).slice(0, 10);

  const superTools = [...allModels].sort((a, b) => 
    (b.trendingScore || 0) - (a.trendingScore || 0)
  ).slice(0, 10);

  const chatModels = allModels.filter(m => 
    ['chatbots', 'assistants', 'agents'].includes(m.category)
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar />
      
      <main className="flex-1">
        <AixploriaHero />

        {/* Spotlight Banner (Custom Campaigns) */}
        {campaignModels.length > 0 && (
           <SpotlightBanner tools={campaignModels} />
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8 relative">
            
            {/* LEFT COLUMN: Main Content */}
            <div className="w-full lg:w-3/4 space-y-16">
              
              <section>
                <CategoryBoxes />
              </section>

              <section>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading AI Tools...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-8 gap-y-12">
                    
                    {/* --- SPONSORED SECTION (FIRST BOX) --- */}
                    {sponsoredModels.length > 0 && (
                        <ToolColumnList 
                          title="Sponsored Tools" 
                          icon={<Crown className="w-4 h-4 text-orange-500" />}
                          tools={sponsoredModels}
                          viewAllLink="/explorer?sponsored=true"
                        />
                    )}

                    {/* Latest AI */}
                    <ToolColumnList 
                      title="Latest AI" 
                      icon={<Sparkles className="w-4 h-4 text-blue-400" />}
                      tools={latestModels}
                      viewAllLink="/explorer?sort=newest"
                    />

                    {/* Soch AI Selection */}
                    <ToolColumnList 
                      title="Soch AI Selection" 
                      icon={<Trophy className="w-4 h-4 text-yellow-400" />}
                      tools={selectedModels}
                      viewAllLink="/explorer?featured=true"
                    />

                    {/* SuperTools */}
                    <ToolColumnList 
                      title="SuperTools" 
                      icon={<Zap className="w-4 h-4 text-purple-400" />}
                      tools={superTools}
                      viewAllLink="/explorer?sort=trending"
                    />

                    {/* Chatbots */}
                    <ToolColumnList 
                      title="AI Chat & Assistant" 
                      icon={<MessageCircle className="w-4 h-4 text-green-400" />}
                      tools={chatModels}
                      viewAllLink="/category/chatbots"
                    />
                  </div>
                )}
              </section>

              {/* Informational Sections */}
              <div className="space-y-12 pt-8 border-t border-border/40">
                <InfoSection 
                  mainIcon={BookOpen}
                  mainTitle="Soch AI: Your guide to discovering the best AI"
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

            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <aside className="w-full lg:w-1/4 relative">
              <div className="lg:sticky lg:top-24 space-y-8">
                <PromotionWidget />
                
                <div className="bg-card/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-lg mb-2">Support Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help us keep the servers running by submitting your tool.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/upload-model')}>
                    Submit Tool
                  </Button>
                </div>
              </div>
            </aside>

          </div>
        </div>

        {/* AdSense Ad */}
        <section className="container mx-auto px-4 my-12">
          <div className="max-w-4xl mx-auto">
            <AdSense 
              adSlot="1234567890"
              adFormat="horizontal"
              style={{ display: 'block', textAlign: 'center', minHeight: '100px' }}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 mb-20 mt-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <h2 className="text-3xl font-bold mb-4 relative z-10 text-white">Have an AI Tool?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 relative z-10 text-lg">
              Submit your AI tool to Soch AI Store and reach thousands of daily users.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" onClick={() => navigate('/upload-model')} className="bg-white text-black hover:bg-gray-200 font-bold px-8">
                Submit Your Tool
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-white/20 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;