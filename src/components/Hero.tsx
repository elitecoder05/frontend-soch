import { Search, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { aiModels } from "@/data/models";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get latest 4 tools for the banner
  const latestTools = aiModels.slice(0, 4);

  const handleSubmitModelClick = () => {
    navigate('/upload-model');
  };

  const handleStartExploring = () => {
    // Scroll to the main store section
    const storeSection = document.getElementById('main-store');
    if (storeSection) {
      storeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hero-gradient-start to-hero-gradient-end border border-border mb-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,217,255,0.1),transparent_50%)]" />
      
      <div className="relative px-8 py-16 lg:px-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">120+ AI Models Available</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Discover the world's smartest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                AI models
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Soch AI Store brings together chatbots, agents, copilots and generative models in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleStartExploring}
                  >
                    Start Exploring
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={handleSubmitModelClick}
                  >
                    Submit Your Model
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {isAuthenticated && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Latest AI Tools</h3>
                  <Link to="/categories" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {latestTools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={`/model/${tool.slug}`}
                      className="group p-4 rounded-xl bg-card/50 border border-border hover:bg-card transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span className="text-lg">{tool.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {tool.name}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{tool.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-foreground">120+</div>
                <div className="text-muted-foreground">AI Models</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-card border border-card-border p-4 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
