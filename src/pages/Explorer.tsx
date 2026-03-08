import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModelCard } from "@/components/ModelCard";
import { AnimatedSearchBar } from "@/components/AnimatedSearchBar"; 
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Model, modelsAPI } from "@/api/api-methods";
import { useAllModels } from "@/hooks/useModels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Home, Image, Video, Megaphone, Palette, Code2, ChevronRight, Sparkles, Loader2, Filter, Plus } from "lucide-react";
import { AiModel } from "@/types/model"; 
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES_PER_PAGE = 4;

// ────────────────────────────────────────────────
// Helper types
// ────────────────────────────────────────────────
type CategoryMeta = {
  slug: string;
  name: string;
  icon: string;
  description?: string;
};

type CommonProps = {
  isVisibleAdmin: (m: Model) => boolean;
  transformModel: (m: Model) => AiModel;
  selectedPricing: string;
};

// ────────────────────────────────────────────────
// Trending Row
// ────────────────────────────────────────────────
const TrendingRow = ({ isVisibleAdmin, transformModel, selectedPricing, navigate }: CommonProps & { navigate: any }) => {
  const { data, isLoading } = useAllModels({ limit: 40 });

  const filteredTrending = useMemo(() => {
    if (!data?.data?.models) return [];
    let trending = [...data.data.models]
      .filter(isVisibleAdmin)
      .filter((m) => m.trendingScore && m.trendingScore > 0)
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 10)
      .map(transformModel);
    if (selectedPricing !== "all") trending = trending.filter(m => m.pricing === selectedPricing);
    return trending;
  }, [data, isVisibleAdmin, transformModel, selectedPricing]);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6 px-1">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl md:text-2xl font-bold">Trending AI Tools</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-[85vw] sm:w-[320px] h-[280px] flex-shrink-0 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (filteredTrending.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold">Trending AI Tools</h2>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Most popular tools this week</p>
        </div>
        <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => navigate(`/category/trending`)}>
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {filteredTrending.map((model) => (
          <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
            <ModelCard model={model} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Single Category Row (fetches its own models)
// ────────────────────────────────────────────────
const CategoryRow = ({ category, isVisibleAdmin, transformModel, selectedPricing, navigate }: CommonProps & { category: CategoryMeta; navigate: any }) => {
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const [allModels, setAllModels] = useState<AiModel[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useAllModels(
    { category: category.slug, limit: PAGE_SIZE, page },
    { enabled: true }
  );

  useEffect(() => {
    if (data?.data?.models) {
      const newModels = data.data.models.filter(isVisibleAdmin).map(transformModel);
      setAllModels(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        return [...prev, ...newModels.filter(m => !existingIds.has(m.id))];
      });
    }
  }, [data]);

  const displayed = useMemo(() => {
    if (selectedPricing === "all") return allModels;
    return allModels.filter(m => m.pricing === selectedPricing);
  }, [allModels, selectedPricing]);

  const hasMore = data?.data?.models?.length === PAGE_SIZE;

  const loadMore = () => {
    setPage(p => p + 1);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
      }
    }, 300);
  };

  if (isLoading && allModels.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6 px-1">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-[85vw] sm:w-[320px] h-[280px] flex-shrink-0 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (displayed.length === 0 && !isLoading) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl">{category.icon}</span>
            <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
          </div>
          {category.description && (
            <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => navigate(`/category/${category.slug}`)}>
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
      >
        {displayed.map((model) => (
          <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
            <ModelCard model={model} />
          </div>
        ))}

        {hasMore && (
          <div className="w-[85vw] sm:w-[200px] flex-shrink-0 snap-center flex items-center justify-center">
            <Button variant="outline" onClick={loadMore} disabled={isFetching} className="gap-2 px-5 py-3">
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Load more</>}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Search Results
// ────────────────────────────────────────────────
const SearchResults = ({ query, selectedPricing, isVisibleAdmin, transformModel, onClear }: CommonProps & { query: string; onClear: () => void }) => {
  const { data, isLoading } = useAllModels({ search: query, limit: 100 }, { enabled: !!query });

  const results = useMemo(() => {
    if (!data?.data?.models) return [];
    let items = data.data.models.filter(isVisibleAdmin).map(transformModel);
    if (selectedPricing !== "all") items = items.filter(m => m.pricing === selectedPricing);
    return items;
  }, [data, isVisibleAdmin, transformModel, selectedPricing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Search Results <span className="text-sm font-normal text-muted-foreground">({results.length})</span>
        </h2>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {results.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/50">
          <p className="text-muted-foreground text-lg mb-2">No models found for "{query}"</p>
          <Button variant="link" onClick={onClear} className="mt-2">Clear Search</Button>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────
// Category Grid (for filtered category pill view)
// ────────────────────────────────────────────────
const CategoryGrid = ({ categorySlug, selectedPricing, isVisibleAdmin, transformModel }: CommonProps & { categorySlug: string }) => {
  const { data, isLoading } = useAllModels(
    categorySlug === "trending" ? { limit: 100 } : { category: categorySlug, limit: 100 },
    { enabled: !!categorySlug }
  );

  const gridModels = useMemo(() => {
    if (!data?.data?.models) return [];
    let list = data.data.models.filter(isVisibleAdmin);
    if (categorySlug === "trending") {
      list = list.filter(m => m.trendingScore && m.trendingScore > 0)
                 .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    }
    let transformed = list.map(transformModel);
    if (selectedPricing !== "all") transformed = transformed.filter(m => m.pricing === selectedPricing);
    return transformed;
  }, [data, isVisibleAdmin, transformModel, categorySlug, selectedPricing]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-xl w-full" />)}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-bold mb-1 capitalize">
          {categorySlug === "trending" ? "Trending AI Tools" : `${categorySlug} Models`}
        </h2>
        <p className="text-muted-foreground">{gridModels.length} models available</p>
      </div>
      {gridModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {gridModels.map((model) => <ModelCard key={model.id} model={model} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-xl">
          <p className="text-muted-foreground text-lg">No models found in this category</p>
        </div>
      )}
    </section>
  );
};

// ────────────────────────────────────────────────
// Main Explorer
// ────────────────────────────────────────────────
const Explorer = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(CATEGORIES_PER_PAGE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories list (lightweight, just slugs/names)
  useEffect(() => {
    let mounted = true;
    modelsAPI.getCategories().then(res => {
      if (res.success && mounted) setAllCategories(res.data.categories);
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  // Sync search from URL
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) { setSearchQuery(q); setDebouncedSearchQuery(q); }
    else    { setSearchQuery(""); setDebouncedSearchQuery(""); }
  }, [searchParams]);

  const isVisibleAdmin = useCallback((m: Model) =>
    m.status === "approved" || currentUser?.role === "admin", [currentUser]);

  const transformModel = useCallback((model: Model): AiModel => ({
    id: model._id,
    slug: model.slug,
    name: model.name,
    shortDescription: model.shortDescription,
    longDescription: model.longDescription || "",
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
    modelType: model.modelType || "",
    externalUrl: model.externalUrl || "",
    iconUrl: model.iconUrl,
    screenshots: model.screenshots,
    featured: model.featured,
    trendingScore: model.trendingScore,
    // @ts-ignore
    categoryTrendingScore: model.categoryTrendingScore,
    bestFor: model.bestFor,
    features: model.features,
    examplePrompts: model.examplePrompts,
  }), []);

  const categoryGroups = useMemo(() => {
    const iconMap: Record<string, string> = {
      chatbots: "💬", image: "🎨", code: "💻", productivity: "⚡",
      voice: "🎤", writing: "✍️", research: "🔬", agents: "🤖",
      video: "🎥", audio: "🎵", "data-analysis": "📊", language: "🌐",
      design: "🎨", automation: "⚙️", healthcare: "🏥", education: "📚",
      marketing: "📈", finance: "💰",
    };
    return allCategories.map(cat => ({ ...cat, icon: iconMap[cat.slug] || "🔧" }));
  }, [allCategories]);

  const visibleCategories = useMemo(() => categoryGroups.slice(0, visibleCount), [categoryGroups, visibleCount]);
  const hasMoreCategories = visibleCount < categoryGroups.length;

  const categoryFilters = useMemo(() => {
    const base = [
      { id: "home", label: "All", icon: Home },
      { id: "trending", label: "Trending", icon: TrendingUp },
    ];
    const dynamic = categoryGroups.map(cat => ({
      id: cat.slug,
      label: cat.name,
      icon: cat.slug === "image"      ? Image   :
            cat.slug === "video"      ? Video   :
            cat.slug === "marketing"  ? Megaphone :
            cat.slug === "design"     ? Palette :
            cat.slug === "code"       ? Code2   : Home,
    }));
    return [...base, ...dynamic];
  }, [categoryGroups]);

  const handleSearchUpdate = (value: string) => {
    setSearchQuery(value);
    if (!value) { searchParams.delete("search"); setSearchParams(searchParams); }
    else setSearchParams({ search: value });
  };

  const commonProps: CommonProps = { isVisibleAdmin, transformModel, selectedPricing };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 flex flex-col overflow-x-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchUpdate} />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">

        {/* Search Bar + Pricing Filter */}
        <div className="mb-8 md:mb-12 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <AnimatedSearchBar initialValue={searchQuery} onSearch={handleSearchUpdate} />
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

        {/* Category Pills */}
        {!searchQuery && (
          <div className="mb-8 md:mb-10">
            <div
              className="flex gap-2 md:gap-3 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-proximity"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(155,155,155,0.5) transparent" }}
            >
              {/* Left spacer — prevents first pill from being clipped on mobile */}
              <div className="flex-shrink-0 w-4 md:w-0" />

              {categoryFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = selectedCategory === filter.id;
                return (
                  <Badge
                    key={filter.id}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap flex-shrink-0 snap-start
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5 bg-background"}`}
                    onClick={() => setSelectedCategory(filter.id)}
                  >
                    <IconComponent className="w-4 h-4" />
                    {filter.label}
                  </Badge>
                );
              })}

              {/* Right spacer — prevents last pill from being clipped on mobile */}
              <div className="flex-shrink-0 w-4 md:w-0" />
            </div>
          </div>
        )}

        {/* Main Content */}
        {debouncedSearchQuery ? (
          <SearchResults {...commonProps} query={debouncedSearchQuery} onClear={() => handleSearchUpdate("")} />
        ) : selectedCategory === "home" ? (
          <div>
            <TrendingRow {...commonProps} navigate={navigate} />

            {visibleCategories.map((category) => (
              <CategoryRow
                key={category.slug}
                {...commonProps}
                category={category}
                navigate={navigate}
              />
            ))}

            {hasMoreCategories && (
              <div className="text-center py-10">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 px-8 text-base border-2"
                  onClick={() => setVisibleCount(v => v + CATEGORIES_PER_PAGE)}
                >
                  <Sparkles className="w-4 h-4" />
                  Load More Categories ({categoryGroups.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <CategoryGrid {...commonProps} categorySlug={selectedCategory} />
        )}

        {/* Ad Area */}
        <div className="mt-16 mb-8">
          <div className="max-w-4xl mx-auto bg-muted/10 p-4 rounded-xl">
            <p className="text-center text-xs text-muted-foreground">Advertisement Area</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explorer;