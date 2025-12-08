import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/ModelCard";
import { CategoryChip } from "@/components/CategoryChip";
import { categories as defaultCategories } from "@/data/models";
import { modelsAPI } from "@/api/api-methods";
import type { AiModel, Category } from "@/types/model";
import { Navbar } from "@/components/Navbar";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [modelsList, setModelsList] = useState<AiModel[]>([]);
  const category = categoriesList.find((c) => c.slug === slug);

  const normalizeModel = (model: any): AiModel => ({
    id: model._id || model.id,
    slug: model.slug,
    name: model.name,
    shortDescription: model.shortDescription,
    longDescription: model.longDescription || '',
    category: model.category,
    tags: model.tags || [],
    provider: model.provider,
    pricing: model.pricing,
    rating: model.rating || 0,
    reviewsCount: model.reviewsCount || 0,
    installsCount: model.installsCount || 0,
    capabilities: model.capabilities || [],
    isApiAvailable: model.isApiAvailable,
    isOpenSource: model.isOpenSource,
    lastUpdated: model.updatedAt || model.lastUpdated || model.createdAt,
    modelType: model.modelType || '',
    externalUrl: model.externalUrl || '',
    iconUrl: model.iconUrl,
    screenshots: model.screenshots,
    featured: model.featured,
    trendingScore: model.trendingScore,
    categoryTrendingScore: model.categoryTrendingScore,
    bestFor: model.bestFor,
    features: model.features,
    examplePrompts: model.examplePrompts,
  });

  const filteredModels = useMemo(() => {
    if (!category) return [];

    let models = modelsList.filter((m) => m.category === category.slug);

    switch (sortBy) {
      case "popular":
        models = models.sort((a, b) => (b.installsCount || 0) - (a.installsCount || 0));
        break;
      case "newest":
        models = models.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case "rating":
        models = models.sort((a, b) => b.rating - a.rating);
        break;
    }

    return models;
  }, [category, sortBy, modelsList]);

  const trendingInCategory = useMemo(() => {
    if (!category) return [];

    return modelsList
      .filter((m) => m.category === category.slug)
      .filter((m) => (m.categoryTrendingScore ?? m.trendingScore ?? 0) > 0)
      .sort(
        (a, b) =>
          (b.categoryTrendingScore ?? b.trendingScore ?? 0) -
          (a.categoryTrendingScore ?? a.trendingScore ?? 0)
      )
      .slice(0, 8);
  }, [category, modelsList]);

  useEffect(() => {
    const fetchCategoryAndModels = async () => {
      try {
        const res = await modelsAPI.getCategories();
        if (res?.data?.categories) {
          setCategoriesList(res.data.categories);
        }
        // fetch models for this category (approved only)
        if (slug) {
          const modelsRes = await modelsAPI.getAllModels({ category: slug, limit: 100 });
          if (modelsRes?.data?.models) {
            setModelsList(modelsRes.data.models.map(normalizeModel));
          }
        }
      } catch (err) {
        console.error('Failed to fetch category/models:', err);
      }
    };
    fetchCategoryAndModels();
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category not found</h1>
          <Link to="/categories">
            <Button variant="outline">Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <Link to="/categories">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Categories
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3 capitalize">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredModels.length} models available
          </p>
        </div>

        {trendingInCategory.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Trending in this category</h2>
              <p className="text-sm text-muted-foreground">
                Curated by admins using category trending score
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingInCategory.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
          {sortOptions.map((option) => (
            <CategoryChip
              key={option.value}
              label={option.label}
              isActive={sortBy === option.value}
              onClick={() => setSortBy(option.value)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No models found in this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryDetail;
