import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { ModelCard } from "@/components/ModelCard";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { modelsAPI, Model } from "@/api/api-methods";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, Sparkles, Zap, Home, Image, Video, Megaphone, Palette, Code2 } from "lucide-react";

const Explorer = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllModels, setShowAllModels] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await modelsAPI.getAllModels({ 
          limit: 200
        });
        setModels(response.data.models);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Transform Model to match AiModel structure
  const transformModel = (model: Model) => ({
    id: model._id,
    slug: model.slug,
    name: model.name,
    shortDescription: model.shortDescription,
    longDescription: model.longDescription || '',
    category: model.category,
    tags: model.tags || [],
    provider: model.provider,
    pricing: model.pricing,
    rating: model.rating,
    reviewsCount: model.reviewsCount,
    installsCount: model.installsCount,
    capabilities: model.capabilities,
    isApiAvailable: model.isApiAvailable,
    isOpenSource: model.isOpenSource,
    lastUpdated: model.updatedAt,
    modelType: model.modelType || '',
    externalUrl: model.externalUrl || '',
    iconUrl: model.iconUrl,
    screenshots: model.screenshots,
    featured: model.featured,
    trendingScore: model.trendingScore,
    categoryTrendingScore: (model as any).categoryTrendingScore,
    bestFor: model.bestFor,
    features: model.features,
    examplePrompts: model.examplePrompts
  });

  // Category-wise models
  const categoryGroups = useMemo(() => {
    const categories = [
      { slug: 'video', name: 'Video Generation Tools', icon: '🎥', description: 'Create stunning videos' },
      { slug: 'image', name: 'Image Generation Tools', icon: '🎨', description: 'AI-powered image creation' },
      { slug: 'research', name: 'Research Tools', icon: '🔬', description: 'Advanced research assistants' },
      { slug: 'marketing', name: 'Marketing Tools', icon: '📈', description: 'Boost your marketing' },
      { slug: 'code', name: 'Code Generation Tools', icon: '💻', description: 'AI coding assistants' },
      { slug: 'writing', name: 'Writing Tools', icon: '✍️', description: 'Content creation made easy' },
      { slug: 'chatbots', name: 'Chatbots & Assistants', icon: '💬', description: 'Conversational AI' },
      { slug: 'agents', name: 'AI Agents', icon: '🤖', description: 'Autonomous AI agents' },
      { slug: 'audio', name: 'Audio Tools', icon: '🎵', description: 'Audio generation & processing' },
      { slug: 'productivity', name: 'Productivity Tools', icon: '⚡', description: 'Get more done faster' },
    ];

    return categories.map(cat => ({
      ...cat,
      models: models
        .filter(m => m.category === cat.slug)
        .slice(0, 10)
        .map(transformModel)
    })).filter(cat => cat.models.length > 0);
  }, [models]);

  // Trending models
  const trendingModels = useMemo(
    () =>
      [...models]
        .filter((m) => m.trendingScore && m.trendingScore > 0)
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
        .slice(0, 10)
        .map(transformModel),
    [models]
  );

  // Category filter chips
  const categoryFilters = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'code', label: 'Code', icon: Code2 },
  ];

  // Filtered models based on selected category
  const filteredModelsByCategory = useMemo(() => {
    if (selectedCategory === 'home') {
      return models.map(transformModel);
    }
    if (selectedCategory === 'trending') {
      return trendingModels;
    }
    return models
      .filter((m) => m.category === selectedCategory)
      .map(transformModel);
  }, [models, selectedCategory, trendingModels]);

  // Search filtered models
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return models.filter((model) => {
      const query = searchQuery.toLowerCase();
      return (
        model.name.toLowerCase().includes(query) ||
        model.shortDescription.toLowerCase().includes(query) ||
        model.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        model.category.toLowerCase().includes(query)
      );
    }).map(transformModel);
  }, [models, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search AI models, tools, agents…"
            />
          </div>
        </div>

        {/* Category Filter Chips - Only show when not searching */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categoryFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = selectedCategory === filter.id;
                return (
                  <Badge
                    key={filter.id}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-primary/10"
                    }`}
                    onClick={() => setSelectedCategory(filter.id)}
                  >
                    <IconComponent className="w-4 h-4" />
                    {filter.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Search Results ({searchResults.length})
              </h2>
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  No models found for "{searchQuery}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse categories below
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Store - Category Sections (Only show when not searching) */}
        {!searchQuery && (
          <div className="space-y-12">
            {loading ? (
              // Loading skeletons
              <div className="space-y-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="flex gap-4 overflow-x-hidden">
                      {[...Array(6)].map((_, j) => (
                        <div key={j} className="w-80 flex-shrink-0">
                          <Skeleton className="h-48 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Show filtered models by category */}
                {selectedCategory === 'home' ? (
                  <>
                    {/* Trending Section */}
                    {trendingModels.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-6 h-6 text-orange-500" />
                              <h2 className="text-2xl font-bold">Trending AI Tools</h2>
                            </div>
                            <p className="text-muted-foreground">Most popular tools this week</p>
                          </div>
                          <Button
                            variant="ghost"
                            className="gap-2"
                            onClick={() => setSelectedCategory('trending')}
                          >
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                          {trendingModels.map((model) => (
                            <div key={model.id} className="w-80 flex-shrink-0 snap-start">
                              <ModelCard model={model} />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Category-wise Sections */}
                    {categoryGroups.map((category) => (
                      <section key={category.slug}>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{category.icon}</span>
                              <h2 className="text-2xl font-bold">{category.name}</h2>
                            </div>
                            <p className="text-muted-foreground">{category.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            className="gap-2"
                            onClick={() => navigate(`/category/${category.slug}`)}
                          >
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                          {category.models.map((model) => (
                            <div key={model.id} className="w-80 flex-shrink-0 snap-start">
                              <ModelCard model={model} />
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}

                    {/* All Models Section */}
                    {!showAllModels && models.length > 0 && (
                      <div className="text-center py-8">
                        <Button
                          size="lg"
                          variant="outline"
                          className="gap-2"
                          onClick={() => setShowAllModels(true)}
                        >
                          <Sparkles className="w-4 h-4" />
                          Explore All {models.length} AI Tools
                        </Button>
                      </div>
                    )}

                    {showAllModels && (
                      <section>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-1">All AI Tools</h2>
                          <p className="text-muted-foreground">Browse our complete collection</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {models.map((model) => (
                            <ModelCard key={model._id} model={transformModel(model)} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  // Show filtered models in grid view for specific categories
                  <section>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-1 capitalize">
                        {selectedCategory === 'trending' ? 'Trending AI Tools' : `${selectedCategory} Models`}
                      </h2>
                      <p className="text-muted-foreground">
                        {filteredModelsByCategory.length} models available
                      </p>
                    </div>
                    {filteredModelsByCategory.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredModelsByCategory.map((model) => (
                          <ModelCard key={model.id} model={model} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg mb-2">
                          No models found in this category
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Check back soon for new tools!
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {/* Empty State */}
                {!loading && models.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-2">
                      No AI tools available yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Check back soon for new tools!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Explorer;