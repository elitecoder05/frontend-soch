// // import { useState, useMemo, useEffect } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { ModelCard } from "@/components/ModelCard";
// // // ✅ Swap SearchBar for AnimatedSearchBar
// // import { AnimatedSearchBar } from "@/components/AnimatedSearchBar"; 
// // import { Footer } from "@/components/Footer";
// // import { Navbar } from "@/components/Navbar";
// // import AdSense from "@/components/AdSense";
// // import { Model } from "@/api/api-methods";
// // import { useAllModels } from "@/hooks/useModels";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { TrendingUp, Home, Image, Video, Megaphone, Palette, Code2, ChevronRight, Sparkles } from "lucide-react";

// // const Explorer = () => {
// //   const navigate = useNavigate();
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [showAllModels, setShowAllModels] = useState(false);
// //   const [selectedCategory, setSelectedCategory] = useState<string>("home");

// //   // Sync URL search param with state
// //   useEffect(() => {
// //     const query = searchParams.get("search");
// //     if (query) {
// //       setSearchQuery(query);
// //     }
// //   }, [searchParams]);

// //   // Use React Query for fetching and caching models
// //   const { data: modelsData, isLoading: loading, error: queryError } = useAllModels({ limit: 200 });
  
// //   const models = modelsData?.data?.models || [];
// //   const error = queryError?.message || null;

// //   // Transform Model to match AiModel structure
// //   const transformModel = (model: Model) => ({
// //     id: model._id,
// //     slug: model.slug,
// //     name: model.name,
// //     shortDescription: model.shortDescription,
// //     longDescription: model.longDescription || '',
// //     category: model.category,
// //     tags: model.tags || [],
// //     provider: model.provider,
// //     pricing: model.pricing,
// //     rating: model.rating,
// //     reviewsCount: model.reviewsCount,
// //     installsCount: model.installsCount,
// //     capabilities: model.capabilities,
// //     isApiAvailable: model.isApiAvailable,
// //     isOpenSource: model.isOpenSource,
// //     lastUpdated: model.updatedAt,
// //     modelType: model.modelType || '',
// //     externalUrl: model.externalUrl || '',
// //     iconUrl: model.iconUrl,
// //     screenshots: model.screenshots,
// //     featured: model.featured,
// //     trendingScore: model.trendingScore,
// //     categoryTrendingScore: (model as any).categoryTrendingScore,
// //     bestFor: model.bestFor,
// //     features: model.features,
// //     examplePrompts: model.examplePrompts
// //   });

// //   // Category-wise models logic
// //   const categoryGroups = useMemo(() => {
// //     const categories = [
// //       { slug: 'video', name: 'Video Generation Tools', icon: '🎥', description: 'Create stunning videos' },
// //       { slug: 'image', name: 'Image Generation Tools', icon: '🎨', description: 'AI-powered image creation' },
// //       { slug: 'research', name: 'Research Tools', icon: '🔬', description: 'Advanced research assistants' },
// //       { slug: 'marketing', name: 'Marketing Tools', icon: '📈', description: 'Boost your marketing' },
// //       { slug: 'code', name: 'Code Generation Tools', icon: '💻', description: 'AI coding assistants' },
// //       { slug: 'writing', name: 'Writing Tools', icon: '✍️', description: 'Content creation made easy' },
// //       { slug: 'chatbots', name: 'Chatbots & Assistants', icon: '💬', description: 'Conversational AI' },
// //       { slug: 'agents', name: 'AI Agents', icon: '🤖', description: 'Autonomous AI agents' },
// //       { slug: 'audio', name: 'Audio Tools', icon: '🎵', description: 'Audio generation & processing' },
// //       { slug: 'productivity', name: 'Productivity Tools', icon: '⚡', description: 'Get more done faster' },
// //     ];

// //     return categories.map(cat => ({
// //       ...cat,
// //       models: models
// //         .filter(m => m.category === cat.slug)
// //         .slice(0, 10)
// //         .map(transformModel)
// //     })).filter(cat => cat.models.length > 0);
// //   }, [models]);

// //   // Trending models logic
// //   const trendingModels = useMemo(
// //     () =>
// //       [...models]
// //         .filter((m) => m.trendingScore && m.trendingScore > 0)
// //         .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
// //         .slice(0, 10)
// //         .map(transformModel),
// //     [models]
// //   );

// //   // Category filter chips
// //   const categoryFilters = [
// //     { id: 'home', label: 'Home', icon: Home },
// //     { id: 'trending', label: 'Trending', icon: TrendingUp },
// //     { id: 'image', label: 'Image', icon: Image },
// //     { id: 'video', label: 'Video', icon: Video },
// //     { id: 'marketing', label: 'Marketing', icon: Megaphone },
// //     { id: 'design', label: 'Design', icon: Palette },
// //     { id: 'code', label: 'Code', icon: Code2 },
// //   ];

// //   // Filtered models based on selected category
// //   const filteredModelsByCategory = useMemo(() => {
// //     if (selectedCategory === 'home') {
// //       return models.map(transformModel);
// //     }
// //     if (selectedCategory === 'trending') {
// //       return trendingModels;
// //     }
// //     return models
// //       .filter((m) => m.category === selectedCategory)
// //       .map(transformModel);
// //   }, [models, selectedCategory, trendingModels]);

// //   // Search filtered models - THIS LOGIC IS PRESERVED
// //   const searchResults = useMemo(() => {
// //     if (!searchQuery.trim()) return [];
    
// //     return models.filter((model) => {
// //       const query = searchQuery.toLowerCase();
// //       return (
// //         model.name.toLowerCase().includes(query) ||
// //         model.shortDescription.toLowerCase().includes(query) ||
// //         model.tags.some((tag) => tag.toLowerCase().includes(query)) ||
// //         model.category.toLowerCase().includes(query)
// //       );
// //     }).map(transformModel);
// //   }, [models, searchQuery]);

// //   // Handle updates from AnimatedSearchBar
// //   const handleSearchUpdate = (value: string) => {
// //     setSearchQuery(value);
// //     // Optional: update URL without reloading
// //     setSearchParams(value ? { search: value } : {});
// //   };

// //   return (
// //     <div className="min-h-screen bg-background pt-24">
// //       {/* Note: If Navbar has its own search, you might want to hide it or sync it.
// //          For now keeping it as is. 
// //       */}
// //       <Navbar />

// //       <main className="container mx-auto px-4 py-8">
        
// //         {/* --- ✅ NEW ANIMATED SEARCH BAR --- */}
// //         <div className="mb-12 relative z-20">
// //           <div className="max-w-2xl mx-auto">
// //             {/* We pass a callback to update this page's state. 
// //                You might need to adjust AnimatedSearchBar slightly to accept an onChange prop 
// //                if it doesn't already have one. 
// //             */}
// //             <AnimatedSearchBar 
// //                initialValue={searchQuery}
// //                onSearch={handleSearchUpdate} 
// //             />
// //           </div>
// //         </div>

// //         {/* Category Filter Chips - Only show when not searching */}
// //         {!searchQuery && (
// //           <div className="mb-8">
// //             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
// //               {categoryFilters.map((filter) => {
// //                 const IconComponent = filter.icon;
// //                 const isActive = selectedCategory === filter.id;
// //                 return (
// //                   <Badge
// //                     key={filter.id}
// //                     variant={isActive ? "default" : "outline"}
// //                     className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
// //                       isActive
// //                         ? "bg-primary text-primary-foreground shadow-md"
// //                         : "border-border hover:border-primary/50 hover:bg-primary/10"
// //                     }`}
// //                     onClick={() => setSelectedCategory(filter.id)}
// //                   >
// //                     <IconComponent className="w-4 h-4" />
// //                     {filter.label}
// //                   </Badge>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}

// //         {error && (
// //           <Alert className="mb-6 border-red-200 bg-red-50">
// //             <AlertDescription className="text-red-800">
// //               {error}
// //             </AlertDescription>
// //           </Alert>
// //         )}

// //         {/* Search Results Display */}
// //         {searchQuery ? (
// //           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-2xl font-bold">
// //                 Search Results ({searchResults.length})
// //               </h2>
// //             </div>
// //             {searchResults.length > 0 ? (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //                 {searchResults.map((model) => (
// //                   <ModelCard key={model.id} model={model} />
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/50">
// //                 <p className="text-muted-foreground text-lg mb-2">
// //                   No models found for "{searchQuery}"
// //                 </p>
// //                 <p className="text-sm text-muted-foreground">
// //                   Try different keywords or browse categories below
// //                 </p>
// //                 <Button 
// //                   variant="link" 
// //                   onClick={() => setSearchQuery("")}
// //                   className="mt-4"
// //                 >
// //                   Clear Search
// //                 </Button>
// //               </div>
// //             )}
// //           </div>
// //         ) : (
// //           /* Main Store - Category Sections (Only show when not searching) */
// //           <div className="space-y-12">
// //             {loading ? (
// //               // Loading skeletons
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //                 {[...Array(8)].map((_, i) => (
// //                   <div key={i}>
// //                     <Skeleton className="h-[280px] rounded-xl" />
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <>
// //                 {/* Show filtered models by category */}
// //                 {selectedCategory === 'home' ? (
// //                   <>
// //                     {/* Trending Section */}
// //                     {trendingModels.length > 0 && (
// //                       <section>
// //                         <div className="flex items-center justify-between mb-6">
// //                           <div>
// //                             <div className="flex items-center gap-2 mb-1">
// //                               <TrendingUp className="w-6 h-6 text-orange-500" />
// //                               <h2 className="text-2xl font-bold">Trending AI Tools</h2>
// //                             </div>
// //                             <p className="text-muted-foreground">Most popular tools this week</p>
// //                           </div>
// //                           <Button
// //                             variant="ghost"
// //                             className="gap-2"
// //                             onClick={() => setSelectedCategory('trending')}
// //                           >
// //                             View All
// //                             <ChevronRight className="w-4 h-4" />
// //                           </Button>
// //                         </div>
// //                         <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
// //                           {trendingModels.map((model) => (
// //                             <div key={model.id} className="w-80 flex-shrink-0 snap-start">
// //                               <ModelCard model={model} />
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </section>
// //                     )}

// //                     {/* Category-wise Sections */}
// //                     {categoryGroups.map((category) => (
// //                       <section key={category.slug}>
// //                         <div className="flex items-center justify-between mb-6">
// //                           <div>
// //                             <div className="flex items-center gap-2 mb-1">
// //                               <span className="text-2xl">{category.icon}</span>
// //                               <h2 className="text-2xl font-bold">{category.name}</h2>
// //                             </div>
// //                             <p className="text-muted-foreground">{category.description}</p>
// //                           </div>
// //                           <Button
// //                             variant="ghost"
// //                             className="gap-2"
// //                             onClick={() => navigate(`/category/${category.slug}`)}
// //                           >
// //                             View All
// //                             <ChevronRight className="w-4 h-4" />
// //                           </Button>
// //                         </div>
// //                         <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
// //                           {category.models.map((model) => (
// //                             <div key={model.id} className="w-80 flex-shrink-0 snap-start">
// //                               <ModelCard model={model} />
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </section>
// //                     ))}

// //                     {/* All Models Section */}
// //                     {!showAllModels && models.length > 0 && (
// //                       <div className="text-center py-8">
// //                         <Button
// //                           size="lg"
// //                           variant="outline"
// //                           className="gap-2"
// //                           onClick={() => setShowAllModels(true)}
// //                         >
// //                           <Sparkles className="w-4 h-4" />
// //                           Explore All {models.length} AI Tools
// //                         </Button>
// //                       </div>
// //                     )}

// //                     {showAllModels && (
// //                       <section>
// //                         <div className="mb-6">
// //                           <h2 className="text-2xl font-bold mb-1">All AI Tools</h2>
// //                           <p className="text-muted-foreground">Browse our complete collection</p>
// //                         </div>
// //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //                           {models.map((model) => (
// //                             <ModelCard key={model._id} model={transformModel(model)} />
// //                           ))}
// //                         </div>
// //                       </section>
// //                     )}
// //                   </>
// //                 ) : (
// //                   // Show filtered models in grid view for specific categories
// //                   <section>
// //                     <div className="mb-6">
// //                       <h2 className="text-2xl font-bold mb-1 capitalize">
// //                         {selectedCategory === 'trending' ? 'Trending AI Tools' : `${selectedCategory} Models`}
// //                       </h2>
// //                       <p className="text-muted-foreground">
// //                         {filteredModelsByCategory.length} models available
// //                       </p>
// //                     </div>
// //                     {filteredModelsByCategory.length > 0 ? (
// //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //                         {filteredModelsByCategory.map((model) => (
// //                           <ModelCard key={model.id} model={model} />
// //                         ))}
// //                       </div>
// //                     ) : (
// //                       <div className="text-center py-16">
// //                         <p className="text-muted-foreground text-lg mb-2">
// //                           No models found in this category
// //                         </p>
// //                         <p className="text-sm text-muted-foreground">
// //                           Check back soon for new tools!
// //                         </p>
// //                       </div>
// //                     )}
// //                   </section>
// //                 )}

// //                 {/* Empty State */}
// //                 {!loading && models.length === 0 && (
// //                   <div className="text-center py-16">
// //                     <p className="text-muted-foreground text-lg mb-2">
// //                       No AI tools available yet
// //                     </p>
// //                     <p className="text-sm text-muted-foreground">
// //                       Check back soon for new tools!
// //                     </p>
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         )}

// //         {/* AdSense Ad */}
// //         <div className="container mx-auto px-4 py-12">
// //           <div className="max-w-4xl mx-auto">
// //             <AdSense 
// //               adSlot="1234567890"
// //               adFormat="horizontal"
// //               style={{ display: 'block', textAlign: 'center', minHeight: '100px' }}
// //             />
// //           </div>
// //         </div>
// //       </main>
      
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Explorer;
// import { useState, useMemo, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { ModelCard } from "@/components/ModelCard";
// import { AnimatedSearchBar } from "@/components/AnimatedSearchBar"; 
// import { Footer } from "@/components/Footer";
// import { Navbar } from "@/components/Navbar";
// import AdSense from "@/components/AdSense";
// import { Model } from "@/api/api-methods";
// import { useAllModels } from "@/hooks/useModels";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { TrendingUp, Home, Image, Video, Megaphone, Palette, Code2, ChevronRight, Sparkles } from "lucide-react";
// import { AiModel } from "@/types/model"; 
// import { useAuth } from "@/contexts/AuthContext"; 

// const Explorer = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth(); 
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAllModels, setShowAllModels] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string>("home");

//   useEffect(() => {
//     const query = searchParams.get("search");
//     if (query) setSearchQuery(query);
//   }, [searchParams]);

//   const { data: modelsData, isLoading: loading, error: queryError } = useAllModels({ limit: 200 });
  
//   const models = modelsData?.data?.models || [];
//   const error = queryError?.message || null;

//   const isVisible = (m: Model) => m.status === 'approved' || currentUser?.role === 'admin';

//   const transformModel = (model: Model): AiModel => ({
//     id: model._id,
//     slug: model.slug,
//     name: model.name,
//     shortDescription: model.shortDescription,
//     longDescription: model.longDescription || '',
//     category: model.category,
//     tags: model.tags || [],
//     provider: model.provider,
//     pricing: model.pricing,
//     rating: model.rating,
//     reviewsCount: model.reviewsCount,
//     installsCount: model.installsCount,
//     capabilities: model.capabilities,
//     isApiAvailable: model.isApiAvailable,
//     isOpenSource: model.isOpenSource,
//     lastUpdated: model.updatedAt,
//     modelType: model.modelType || '',
//     externalUrl: model.externalUrl || '',
//     iconUrl: model.iconUrl,
//     screenshots: model.screenshots,
//     featured: model.featured,
//     trendingScore: model.trendingScore,
//     // @ts-ignore
//     categoryTrendingScore: model.categoryTrendingScore,
//     bestFor: model.bestFor,
//     features: model.features,
//     examplePrompts: model.examplePrompts
//   });

//   const categoryGroups = useMemo(() => {
//     const categories = [
//       { slug: 'video', name: 'Video Generation', icon: '🎥', description: 'Create stunning videos' },
//       { slug: 'image', name: 'Image Generation', icon: '🎨', description: 'AI-powered image creation' },
//       { slug: 'research', name: 'Research Tools', icon: '🔬', description: 'Advanced research assistants' },
//       { slug: 'marketing', name: 'Marketing', icon: '📈', description: 'Boost your marketing' },
//       { slug: 'code', name: 'Code Generation', icon: '💻', description: 'AI coding assistants' },
//       { slug: 'writing', name: 'Writing', icon: '✍️', description: 'Content creation made easy' },
//       { slug: 'chatbots', name: 'Chatbots', icon: '💬', description: 'Conversational AI' },
//       { slug: 'agents', name: 'AI Agents', icon: '🤖', description: 'Autonomous AI agents' },
//       { slug: 'audio', name: 'Audio Tools', icon: '🎵', description: 'Audio generation & processing' },
//       { slug: 'productivity', name: 'Productivity', icon: '⚡', description: 'Get more done faster' },
//     ];

//     return categories.map(cat => ({
//       ...cat,
//       // ✅ Added visibility filter
//       models: models.filter(m => m.category === cat.slug && isVisible(m)).slice(0, 10).map(transformModel)
//     })).filter(cat => cat.models.length > 0);
//   }, [models, currentUser]);

//   const trendingModels = useMemo(() =>
//     [...models]
//       .filter((m) => isVisible(m)) // ✅ Added visibility filter
//       .filter((m) => m.trendingScore && m.trendingScore > 0)
//       .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
//       .slice(0, 10)
//       .map(transformModel),
//     [models, currentUser]
//   );

//   const categoryFilters = [
//     { id: 'home', label: 'Home', icon: Home },
//     { id: 'trending', label: 'Trending', icon: TrendingUp },
//     { id: 'image', label: 'Image', icon: Image },
//     { id: 'video', label: 'Video', icon: Video },
//     { id: 'marketing', label: 'Marketing', icon: Megaphone },
//     { id: 'design', label: 'Design', icon: Palette },
//     { id: 'code', label: 'Code', icon: Code2 },
//   ];

//   const filteredModelsByCategory = useMemo(() => {
//     const visibleModels = models.filter(m => isVisible(m)); // ✅ Filter first
//     if (selectedCategory === 'home') return visibleModels.map(transformModel);
//     if (selectedCategory === 'trending') return trendingModels;
//     return visibleModels.filter((m) => m.category === selectedCategory).map(transformModel);
//   }, [models, selectedCategory, trendingModels, currentUser]);

//   const searchResults = useMemo(() => {
//     if (!searchQuery.trim()) return [];
//     return models.filter((model) => {
//       if (!isVisible(model)) return false; // ✅ Filter first
//       const query = searchQuery.toLowerCase();
//       return (
//         model.name.toLowerCase().includes(query) ||
//         model.shortDescription.toLowerCase().includes(query) ||
//         model.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
//         model.category.toLowerCase().includes(query)
//       );
//     }).map(transformModel);
//   }, [models, searchQuery, currentUser]);

//   const handleSearchUpdate = (value: string) => {
//     setSearchQuery(value);
//     setSearchParams(value ? { search: value } : {});
//   };

//   return (
//     <div className="min-h-screen bg-background pt-20 md:pt-24 flex flex-col overflow-x-hidden">
//       <Navbar searchQuery={searchQuery} onSearchChange={handleSearchUpdate} />

//       <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        
//         <div className="mb-8 md:mb-12 relative z-20">
//           <div className="max-w-2xl mx-auto">
//             <AnimatedSearchBar 
//                initialValue={searchQuery}
//                onSearch={handleSearchUpdate} 
//             />
//           </div>
//         </div>

//         {!searchQuery && (
//           <div className="mb-8 md:mb-10">
//             <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide justify-start md:justify-center px-1">
//               {categoryFilters.map((filter) => {
//                 const IconComponent = filter.icon;
//                 const isActive = selectedCategory === filter.id;
//                 return (
//                   <Badge
//                     key={filter.id}
//                     variant={isActive ? "default" : "outline"}
//                     className={`
//                       cursor-pointer px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium 
//                       transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap flex-shrink-0
//                       ${isActive ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5 bg-background"}
//                     `}
//                     onClick={() => setSelectedCategory(filter.id)}
//                   >
//                     <IconComponent className="w-4 h-4" />
//                     {filter.label}
//                   </Badge>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {error && (
//           <Alert className="mb-6 border-red-200 bg-red-50">
//             <AlertDescription className="text-red-800">{error}</AlertDescription>
//           </Alert>
//         )}

//         {searchQuery ? (
//           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl md:text-2xl font-bold">Search Results ({searchResults.length})</h2>
//             </div>
//             {searchResults.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//                 {searchResults.map((model) => (
//                   <ModelCard key={model.id} model={model} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/50">
//                 <p className="text-muted-foreground text-lg mb-2">No models found for "{searchQuery}"</p>
//                 <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear Search</Button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-12 md:space-y-16">
//             {loading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {[...Array(8)].map((_, i) => (
//                   <div key={i}><Skeleton className="h-[280px] rounded-xl w-full" /></div>
//                 ))}
//               </div>
//             ) : (
//               <>
//                 {selectedCategory === 'home' ? (
//                   <>
//                     {trendingModels.length > 0 && (
//                       <section>
//                         <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
//                           <div>
//                             <div className="flex items-center gap-2 mb-1">
//                               <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
//                               <h2 className="text-xl md:text-2xl font-bold">Trending AI Tools</h2>
//                             </div>
//                             <p className="text-xs md:text-sm text-muted-foreground">Most popular tools this week</p>
//                           </div>
//                           <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => setSelectedCategory('trending')}>
//                             View All <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </div>
                        
//                         <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
//                           {trendingModels.map((model) => (
//                             <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
//                               <ModelCard model={model} />
//                             </div>
//                           ))}
//                         </div>
//                       </section>
//                     )}

//                     {categoryGroups.map((category) => (
//                       <section key={category.slug}>
//                         <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
//                           <div>
//                             <div className="flex items-center gap-2 mb-1">
//                               <span className="text-xl md:text-2xl">{category.icon}</span>
//                               <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
//                             </div>
//                             <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
//                           </div>
//                           <Button variant="ghost" className="gap-1 text-sm h-8 md:h-10" onClick={() => navigate(`/category/${category.slug}`)}>
//                             View All <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </div>
                        
//                         <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
//                           {category.models.map((model) => (
//                             <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
//                               <ModelCard model={model} />
//                             </div>
//                           ))}
//                         </div>
//                       </section>
//                     ))}

//                     {!showAllModels && models.filter(isVisible).length > 0 && (
//                       <div className="text-center py-8">
//                         <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto h-12 text-base shadow-sm" onClick={() => setShowAllModels(true)}>
//                           <Sparkles className="w-4 h-4" /> Explore All AI Tools
//                         </Button>
//                       </div>
//                     )}

//                     {showAllModels && (
//                       <section className="animate-in fade-in duration-500">
//                         <div className="mb-6 px-1">
//                           <h2 className="text-2xl font-bold mb-1">All AI Tools</h2>
//                           <p className="text-muted-foreground">Browse our complete collection</p>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//                           {models.filter(isVisible).map((model) => (
//                             <ModelCard key={model._id} model={transformModel(model)} />
//                           ))}
//                         </div>
//                       </section>
//                     )}
//                   </>
//                 ) : (
//                   <section>
//                     <div className="mb-6 px-1">
//                       <h2 className="text-2xl font-bold mb-1 capitalize">
//                         {selectedCategory === 'trending' ? 'Trending AI Tools' : `${selectedCategory} Models`}
//                       </h2>
//                       <p className="text-muted-foreground">{filteredModelsByCategory.length} models available</p>
//                     </div>
//                     {filteredModelsByCategory.length > 0 ? (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//                         {filteredModelsByCategory.map((model) => (
//                           <ModelCard key={model.id} model={model} />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-16 bg-muted/20 rounded-xl">
//                         <p className="text-muted-foreground text-lg">No models found in this category</p>
//                       </div>
//                     )}
//                   </section>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         <div className="mt-16 mb-8">
//           <div className="max-w-4xl mx-auto bg-muted/10 p-4 rounded-xl">
//             <AdSense adSlot="1234567890" adFormat="horizontal" style={{ display: 'block', textAlign: 'center', minHeight: '100px' }} />
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default Explorer;









import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModelCard } from "@/components/ModelCard";
import { AnimatedSearchBar } from "@/components/AnimatedSearchBar"; 
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
// import AdSense from "@/components/AdSense"; // Commented out to prevent errors
import { Model } from "@/api/api-methods";
import { useAllModels } from "@/hooks/useModels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Home, Image, Video, Megaphone, Palette, Code2, ChevronRight, Sparkles } from "lucide-react";
import { AiModel } from "@/types/model"; 
import { useAuth } from "@/contexts/AuthContext"; 

const Explorer = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllModels, setShowAllModels] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchQuery(query);
  }, [searchParams]);

  // ✅ Pass search query to backend for server-side search
  const { data: modelsData, isLoading: loading, error: queryError } = useAllModels({ 
    limit: searchQuery ? 100 : 200,  // Fetch fewer when searching
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

  const categoryGroups = useMemo(() => {
    // Get unique categories from actual models data
    const uniqueCategories = Array.from(new Set(models.map(m => m.category)));
    
    const categoryMap: Record<string, { name: string; icon: string; description: string }> = {
      'chatbots': { name: 'Chatbots', icon: '💬', description: 'Conversational AI' },
      'image': { name: 'Image', icon: '🎨', description: 'AI-powered image creation' },
      'code': { name: 'Code', icon: '💻', description: 'AI coding assistants' },
      'productivity': { name: 'Productivity', icon: '⚡', description: 'Boost productivity' },
      'voice': { name: 'Voice', icon: '🎤', description: 'Speech and voice AI' },
      'writing': { name: 'Writing', icon: '✍️', description: 'Content creation' },
      'research': { name: 'Research', icon: '🔬', description: 'Research assistants' },
      'agents': { name: 'AI Agents', icon: '🤖', description: 'Autonomous agents' },
      'video': { name: 'Video', icon: '🎥', description: 'Video generation' },
      'audio': { name: 'Audio', icon: '🎵', description: 'Audio processing' },
      'data-analysis': { name: 'Data Analysis', icon: '📊', description: 'Data analytics' },
      'language': { name: 'Language', icon: '🌐', description: 'Translation & language' },
      'design': { name: 'Design', icon: '🎨', description: 'Design tools' },
      'automation': { name: 'Automation', icon: '⚙️', description: 'Workflow automation' },
      'healthcare': { name: 'Healthcare', icon: '🏥', description: 'Medical AI' },
      'education': { name: 'Education', icon: '📚', description: 'Learning tools' },
      'marketing': { name: 'Marketing', icon: '📈', description: 'Marketing & ads' },
      'finance': { name: 'Finance', icon: '💰', description: 'Financial tools' },
    };

    return uniqueCategories
      .map(slug => {
        const catInfo = categoryMap[slug] || { 
          name: slug.charAt(0).toUpperCase() + slug.slice(1), 
          icon: '🔧', 
          description: `${slug} tools` 
        };
        return {
          slug,
          ...catInfo,
          models: models.filter(m => m.category === slug && isVisible(m)).slice(0, 10).map(transformModel)
        };
      })
      .filter(cat => cat.models.length > 0);
  }, [models, currentUser]);

  const trendingModels = useMemo(() =>
    [...models]
      .filter((m) => isVisible(m)) // ✅ Added visibility filter
      .filter((m) => m.trendingScore && m.trendingScore > 0)
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 10)
      .map(transformModel),
    [models, currentUser]
  );

  // ✅ Dynamic category filters based on actual categories with models
  const categoryFilters = useMemo(() => {
    const base = [
      { id: 'home', label: 'All', icon: Home },
      { id: 'trending', label: 'Trending', icon: TrendingUp },
    ];
    
    const dynamicCategories = categoryGroups.slice(0, 8).map(cat => ({
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
    if (selectedCategory === 'home') return visibleModels.map(transformModel);
    if (selectedCategory === 'trending') return trendingModels;
    return visibleModels.filter((m) => m.category === selectedCategory).map(transformModel);
  }, [models, selectedCategory, trendingModels, currentUser]);

  // ✅ When search query exists, backend already filtered results - just transform them
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    // Backend has already filtered by search, just apply visibility and transform
    return models.filter((model) => isVisible(model)).map(transformModel);
  }, [models, searchQuery, currentUser]);

  const handleSearchUpdate = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {});
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 flex flex-col overflow-x-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchUpdate} />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        
        <div className="mb-8 md:mb-12 relative z-20">
          <div className="max-w-2xl mx-auto">
            <AnimatedSearchBar 
               initialValue={searchQuery}
               onSearch={handleSearchUpdate} 
            />
          </div>
        </div>

        {!searchQuery && (
          <div className="mb-8 md:mb-10">
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide justify-start md:justify-center px-1">
              {categoryFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = selectedCategory === filter.id;
                return (
                  <Badge
                    key={filter.id}
                    variant={isActive ? "default" : "outline"}
                    className={`
                      cursor-pointer px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium 
                      transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap flex-shrink-0
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
              <h2 className="text-xl md:text-2xl font-bold">Search Results ({searchResults.length})</h2>
            </div>
            {searchResults.length > 0 ? (
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
                {selectedCategory === 'home' ? (
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
                        
                        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                          {category.models.map((model) => (
                            <div key={model.id} className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center">
                              <ModelCard model={model} />
                            </div>
                          ))}
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
                          {models.filter(isVisible).map((model) => (
                            <ModelCard key={model._id} model={transformModel(model)} />
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