




import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModelCard } from "@/components/ModelCard";
import { AnimatedSearchBar } from "@/components/AnimatedSearchBar"; 
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
// import AdSense from "@/components/AdSense"; // Commented out to prevent errors
import { Model, modelsAPI } from "@/api/api-methods";
import { useAllModels } from "@/hooks/useModels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Home, Image, Video, Megaphone, Palette, Code2, ChevronRight, Sparkles, Loader2, Filter } from "lucide-react";
import { AiModel } from "@/types/model"; 
import { useAuth } from "@/contexts/AuthContext"; 

const Explorer = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllModels, setShowAllModels] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const PAGE_SIZE = 8;
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});
  const [categoryLoaded, setCategoryLoaded] = useState<Record<string, AiModel[]>>({});
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await modelsAPI.getCategories();
        if (response.success) {
          setAllCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchQuery(query);
  }, [searchParams]);

  // ✅ Pass search query to backend for server-side search
  const { data: modelsData, isLoading: loading, error: queryError } = useAllModels({ 
    limit: searchQuery ? 100 : 500,  // Fetch more models to cover all categories
    search: searchQuery || undefined // Pass search to backend
  });
  
  const models = modelsData?.data?.models || [];
  const error = queryError?.message || null;

  const isVisible = (m: Model) => m.status === 'approved' || currentUser?.role === 'admin';

  const transformModel = (model: Model): AiModel => ({
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
    // @ts-ignore
    categoryTrendingScore: model.categoryTrendingScore,
    bestFor: model.bestFor,
    features: model.features,
    examplePrompts: model.examplePrompts
  });

  // Initialize per-category loaded models from the already-fetched `models` (first page)
  useEffect(() => {
    if (!allCategories || allCategories.length === 0) return;

    const initial: Record<string, AiModel[]> = {};
    const pages: Record<string, number> = {};

    allCategories.forEach((cat) => {
      const items = models
        .filter((m) => m.category?.toLowerCase() === cat.slug?.toLowerCase() && isVisible(m))
        .slice(0, PAGE_SIZE)
        .map(transformModel);

      if (items.length) {
        initial[cat.slug] = items;
        pages[cat.slug] = 1;
      }
    });

    setCategoryLoaded(initial);
    setCategoryPages(pages);
  }, [allCategories, models, currentUser]);

  // Load more models for a specific category (appends to existing list)
  const loadMore = async (slug: string) => {
    try {
      const nextPage = (categoryPages[slug] || 1) + 1;
      // optimistically set page
      setCategoryPages((prev) => ({ ...prev, [slug]: nextPage }));

      const resp = await modelsAPI.getAllModels({ category: slug, page: nextPage, limit: PAGE_SIZE });
      const newModels: AiModel[] = (resp.data?.models || [])
        .filter((m: Model) => isVisible(m))
        .map(transformModel);

      setCategoryLoaded((prev) => ({ ...prev, [slug]: [...(prev[slug] || []), ...newModels] }));

      // Scroll the container to reveal appended items
      setTimeout(() => {
        const el = categoryRefs.current[slug];
        if (el) {
          el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
        }
      }, 50);
    } catch (err) {
      console.error('Failed to load more models for', slug, err);
    }
  };

  // Define applyPricingFilter function BEFORE using it in useMemo hooks
  const applyPricingFilter = useCallback((models: AiModel[]) => {
    if (selectedPricing === "all") return models;
    return models.filter(model => model.pricing === selectedPricing);
  }, [selectedPricing]);

  const categoryGroups = useMemo(() => {
    // Use ALL categories from backend, not just ones with models in current fetch
    if (!allCategories || allCategories.length === 0) return [];
    
    const iconMap: Record<string, string> = {
      'chatbots': '💬', 'image': '🎨', 'code': '💻', 'productivity': '⚡',
      'voice': '🎤', 'writing': '✍️', 'research': '🔬', 'agents': '🤖',
      'video': '🎥', 'audio': '🎵', 'data-analysis': '📊', 'language': '🌐',
      'design': '🎨', 'automation': '⚙️', 'healthcare': '🏥', 'education': '📚',
      'marketing': '📈', 'finance': '💰'
    };

    return allCategories.map(cat => {
      const categoryModels = models
        .filter(m => m.category?.toLowerCase() === cat.slug?.toLowerCase() && isVisible(m))
        .slice(0, 10)
        .map(transformModel);
      
      // Apply pricing filter
      const filteredModels = applyPricingFilter(categoryModels);
      
      return {
        slug: cat.slug,
        name: cat.name,
        icon: iconMap[cat.slug] || '🔧',
        description: cat.description,
        modelCount: cat.modelCount || 0,
        models: filteredModels
      };
    }).filter(cat => cat.models.length > 0); // Only show if we actually have models loaded
  }, [allCategories, models, selectedPricing, currentUser, applyPricingFilter]);

  const trendingModels = useMemo(() => {
    const trending = [...models]
      .filter((m) => isVisible(m)) // ✅ Added visibility filter
      .filter((m) => m.trendingScore && m.trendingScore > 0)
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 10)
      .map(transformModel);
      
    return applyPricingFilter(trending);
  }, [models, selectedPricing, currentUser, applyPricingFilter]);

  // ✅ Dynamic category filters based on actual categories with models
  const categoryFilters = useMemo(() => {
    const base = [
      { id: 'home', label: 'All', icon: Home },
      { id: 'trending', label: 'Trending', icon: TrendingUp },
    ];
    
    // Show ALL categories, not just first 8
    const dynamicCategories = categoryGroups.map(cat => ({
      id: cat.slug,
      label: cat.name,
      icon: cat.slug === 'image' ? Image : 
            cat.slug === 'video' ? Video :
            cat.slug === 'marketing' ? Megaphone :
            cat.slug === 'design' ? Palette :
            cat.slug === 'code' ? Code2 : Home
    }));
    
    return [...base, ...dynamicCategories];
  }, [categoryGroups]);

  const filteredModelsByCategory = useMemo(() => {
    const visibleModels = models.filter(m => isVisible(m)); // ✅ Filter first
    let categoryModels;
    if (selectedCategory === 'home') categoryModels = visibleModels.map(transformModel);
    else if (selectedCategory === 'trending') categoryModels = trendingModels;
    else categoryModels = visibleModels.filter((m) => m.category?.toLowerCase() === selectedCategory?.toLowerCase()).map(transformModel);
    
    return applyPricingFilter(categoryModels);
  }, [models, selectedCategory, selectedPricing, trendingModels, currentUser, applyPricingFilter]);

  // ✅ When search query exists, backend already filtered results - just transform them
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    // Backend has already filtered by search, just apply visibility and transform
    const results = models.filter((model) => isVisible(model)).map(transformModel);
    return applyPricingFilter(results);
  }, [models, searchQuery, selectedPricing, currentUser, applyPricingFilter]);

  // Debug logging in useEffect to prevent excessive console output
  useEffect(() => {
    console.log('Explorer Debug:', {
      loading,
      error,
      modelsCount: models?.length || 0,
      categoriesCount: allCategories?.length || 0,
      searchQuery,
      selectedCategory
    });
  }, [loading, error, models?.length, allCategories?.length, searchQuery, selectedCategory]);

  const handleSearchUpdate = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {});
  };

  // Add loading state for when component is initializing
  if (loading && models.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading AI Tools...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && models.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load AI Tools</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 flex flex-col overflow-x-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchUpdate} />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        
        <div className="mb-8 md:mb-12 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <AnimatedSearchBar 
                   initialValue={searchQuery}
                   onSearch={handleSearchUpdate} 
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {!searchQuery && (
          <div className="mb-8 md:mb-10">
            <div className="flex gap-2 md:gap-3 overflow-x-auto overflow-y-hidden pb-4 justify-start md:justify-center -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-proximity" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent' }}>
              {categoryFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = selectedCategory === filter.id;
                return (
                  <Badge
                    key={filter.id}
                    variant={isActive ? "default" : "outline"}
                    className={`
                      cursor-pointer px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium 
                      transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap flex-shrink-0 snap-start
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5 bg-background"}
                    `}
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
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {searchQuery ? (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                Search Results {loading ? <span className="text-sm text-muted-foreground ml-3">Searching...</span> : <span className="text-sm text-muted-foreground">({searchResults.length})</span>}
              </h2>
            </div>

            {/* Show loader while backend is fetching results to avoid premature "No results" message */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {searchResults.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                <p className="text-muted-foreground text-lg mb-2">No models found for "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear Search</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}><Skeleton className="h-[280px] rounded-xl w-full" /></div>
                ))}
              </div>
            ) : (
              <>
                {/* Fallback when no data is available */}
                {!loading && models.length === 0 && (
                  <div className="text-center py-16 bg-muted/20 rounded-xl">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl font-semibold mb-2">No AI Tools Found</h3>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find any AI tools at the moment. Please try again later.
                      </p>
                      <Button onClick={() => window.location.reload()}>
                        Reload Page
                      </Button>
                    </div>
                  </div>
                )}

                {models.length > 0 && selectedCategory === 'home' ? (
                  <>
                    {trendingModels.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                              <h2 className="text-xl md:text-2xl font-bold">Trending AI Tools</h2>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">Most popular tools this week</p>
                          </div>
                          <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => setSelectedCategory('trending')}>
                            View All <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                          {trendingModels.map((model) => (
                            <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
                              <ModelCard model={model} />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Display ALL category sections with models */}
                    {categoryGroups.map((category) => (
                      <section key={category.slug}>
                        <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl md:text-2xl">{category.icon}</span>
                              <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => navigate(`/category/${category.slug}`)}>
                            View All <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div
                          ref={(el) => (categoryRefs.current[category.slug] = el)}
                          className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                        >
                          {(categoryLoaded[category.slug] || category.models).map((model) => (
                            <div key={(model as any).id || (model as any)._id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
                              <ModelCard model={model} />
                            </div>
                          ))}

                          {/* Load more button appears as the last card in the scroller */}
                          <div className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center flex items-center justify-center">
                            <Button variant="outline" onClick={() => loadMore(category.slug)} className="px-6 py-3">
                              Load more
                            </Button>
                          </div>
                        </div>
                      </section>
                    ))}

                    {!showAllModels && models.filter(isVisible).length > 0 && (
                      <div className="text-center py-8">
                        <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto h-12 text-base shadow-sm" onClick={() => setShowAllModels(true)}>
                          <Sparkles className="w-4 h-4" /> Explore All AI Tools
                        </Button>
                      </div>
                    )}

                    {showAllModels && (
                      <section className="animate-in fade-in duration-500">
                        <div className="mb-6 px-1">
                          <h2 className="text-2xl font-bold mb-1">All AI Tools</h2>
                          <p className="text-muted-foreground">Browse our complete collection</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                          {applyPricingFilter(models.filter(isVisible).map(transformModel)).map((model) => (
                            <ModelCard key={model.id} model={model} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <section>
                    <div className="mb-6 px-1">
                      <h2 className="text-2xl font-bold mb-1 capitalize">
                        {selectedCategory === 'trending' ? 'Trending AI Tools' : `${selectedCategory} Models`}
                      </h2>
                      <p className="text-muted-foreground">{filteredModelsByCategory.length} models available</p>
                    </div>
                    {filteredModelsByCategory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredModelsByCategory.map((model) => (
                          <ModelCard key={model.id} model={model} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground text-lg">No models found in this category</p>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-16 mb-8">
          <div className="max-w-4xl mx-auto bg-muted/10 p-4 rounded-xl">
            {/* ADSENSE COMMENTED OUT TO PREVENT 400 ERRORS.
                Uncomment and add your real Ad Slot ID when ready.
                <AdSense adSlot="1234567890" adFormat="horizontal" style={{ display: 'block', textAlign: 'center', minHeight: '100px' }} />
            */}
            <p className="text-center text-xs text-muted-foreground">Advertisement Area</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explorer;