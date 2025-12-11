import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AixploriaHero } from "@/components/home/AixploriaHero";
import { CategoryBoxes } from "@/components/home/CategoryBoxes";
import { ToolColumnList } from "@/components/home/ToolColumnList";
import { InfoSection } from "@/components/home/InfoSection";
import { useAllModels } from "@/hooks/useModels";
import { 
  Sparkles, Trophy, Zap, MessageCircle, 
  BookOpen, Globe, Heart, Search, CheckCircle2, 
  ListOrdered, Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  // Fetch all models
  const { data: modelsData, isLoading } = useAllModels({ limit: 50 });
  const allModels = modelsData?.data?.models || [];

  // Data processing for columns
  const latestModels = [...allModels].sort((a, b) => 
    new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  ).slice(0, 10);

  const selectedModels = allModels.filter(m => m.featured).slice(0, 10);

  const superTools = [...allModels].sort((a, b) => 
    (b.trendingScore || 0) - (a.trendingScore || 0)
  ).slice(0, 10);

  const chatModels = allModels.filter(m => 
    m.category === 'chatbots' || m.category === 'assistants' || m.category === 'agents'
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-1">
        {/* 1. Hero Section */}
        <AixploriaHero />

        {/* 2. Trending Categories */}
        <CategoryBoxes />

        {/* 3. The "4-Column" Tool Lists */}
        <section className="container mx-auto px-4 mb-24">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Loading AI Tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ToolColumnList 
                title="Latest AI" 
                icon={<Sparkles className="w-4 h-4" />}
                tools={latestModels}
                viewAllLink="/explorer?sort=newest"
              />
              <ToolColumnList 
                title="Soch AI Selection" 
                icon={<Trophy className="w-4 h-4" />}
                tools={selectedModels}
                viewAllLink="/explorer?featured=true"
              />
              <ToolColumnList 
                title="SuperTools" 
                icon={<Zap className="w-4 h-4" />}
                tools={superTools}
                viewAllLink="/explorer?sort=trending"
              />
              <ToolColumnList 
                title="AI Chat & Assistant" 
                icon={<MessageCircle className="w-4 h-4" />}
                tools={chatModels}
                viewAllLink="/category/chatbots"
              />
            </div>
          )}
        </section>

        {/* 4. INFORMATIONAL SECTIONS (Matches Aixploria Style) */}
        
        {/* Section 1: Guide */}
        <InfoSection 
          mainIcon={BookOpen}
          mainTitle="Soch AI: Your guide to discovering the best AI"
          cards={[
            {
              icon: <CheckCircle2 className="w-5 h-5" />,
              title: "Ergonomics & Design",
              description: "The site is neat and clear, with good ergonomics to ensure you get quick results. It is accessible for free, without registration, and fully compatible with all devices."
            },
            {
              icon: <Search className="w-5 h-5" />,
              title: "Smart Discovery",
              description: "Whether you're looking for a machine translation tool, an image generator, or any other AI app, Soch AI offers a variety of high-quality choices via our intuitive search engine."
            }
          ]}
        />

        {/* Section 2: Top 10 */}
        <InfoSection 
          mainIcon={Trophy}
          mainTitle="Top 10 Best AI"
          cards={[
            {
              icon: <ListOrdered className="w-5 h-5" />,
              title: "Curated Rankings",
              description: "We created a special section called 'Top 10 AI'. This updates in real-time and allows you to see the top 10 AI in each category at a glance. Very useful for finding your way around."
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "Hand-Picked Quality",
              description: "With so many new tools coming out daily, directories become unreadable. We carefully select the most innovative and useful AIs to offer you the best options available."
            }
          ]}
        />

        {/* Section 3: Directory */}
        <InfoSection 
          mainIcon={Globe}
          mainTitle="The World's Best AI Tools Directory"
          cards={[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Daily Updates",
              description: "Soch AI is dedicated to artificial intelligence, allowing you to discover the best tools available online. Our listings are updated daily, so bookmark us to not miss out!"
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              title: "Community Submissions",
              description: "Found an AI tool that doesn't appear in the list? You can submit new AIs so that they can be added to the ranking. We are building the largest database together."
            }
          ]}
        />

        {/* Section 4: Enthusiasts */}
        <InfoSection 
          mainIcon={Heart}
          mainTitle="A website for all AI enthusiasts"
          cards={[
            {
              icon: <Users className="w-5 h-5" />,
              title: "For Everyone",
              description: "Our platform is easy to use due to its intentionally simplified design. This makes it ideal for curious beginners as well as experts who want to discover the latest advances."
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Tools of the Future",
              description: "AI is now clearly part of our daily lives. Keeping up to date with the latest trends is essential. Soch AI helps you stay one step ahead of your competitors."
            }
          ]}
        />

        {/* 5. Bottom CTA Section */}
        <section className="container mx-auto px-4 mb-20 mt-16">
          <div className="bg-gradient-to-r from-card to-card/50 border border-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            
            <h2 className="text-3xl font-bold mb-4 relative z-10">Have an AI Tool?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 relative z-10 text-lg">
              Submit your AI tool to Soch AI Store and reach thousands of daily users. 
              Join the largest AI directory in India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" onClick={() => navigate('/upload-model')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-lg shadow-primary/20">
                Submit Your Tool
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-border/50 hover:bg-muted/50">
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