// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ChevronRight, MessageSquare, Image, Code, Zap, Mic, BookOpen, Bot, Palette, Video, Heart } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { categories as defaultCategories } from "@/data/models";
// import type { Category } from "@/types/model";
// import { modelsAPI } from "@/api/api-methods";
// import { Navbar } from "@/components/Navbar";

// const iconMap: { [key: string]: any } = {
//   MessageSquare, Image, Code, Zap, Mic, BookOpen, Bot, Palette, Video, Heart,
// };

// const Categories = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await modelsAPI.getCategories();
//         if (res?.data?.categories) {
//           setCategoriesList(res.data.categories);
//         }
//       } catch (err) {
//         console.error('Failed to fetch categories:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   return (
//     // FIX: Added pt-28
//     <div className="min-h-screen bg-background pt-28">
//       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-12 text-center">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Browse by Category
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Explore AI models organized by their primary use case
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {categoriesList.map((category) => {
//             const IconComponent = iconMap[category.icon];
//             return (
//               <Link key={category.id} to={`/category/${category.slug}`}>
//                 <Card className="group h-full border-card-border bg-card hover:bg-card-hover hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
//                         {IconComponent && (
//                           <IconComponent className="w-6 h-6 text-primary" />
//                         )}
//                       </div>
//                       <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
//                     </div>

//                     <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
//                       {category.name}
//                     </h3>
//                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                       {category.description}
//                     </p>

//                     <div className="flex items-center gap-2">
//                       <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
//                         <span className="text-xs font-medium text-primary">
//                           {category.modelCount} models
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Categories;

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MessageSquare, Image, Code, Zap, Mic, BookOpen, Bot, Palette, Video, Heart, Github, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { categories as defaultCategories } from "@/data/models";
import type { Category } from "@/types/model";
import { modelsAPI } from "@/api/api-methods";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: { [key: string]: any } = {
  // Core icons
  MessageSquare, Image, Code, Zap, Mic, BookOpen, Bot, Palette, Video, Heart,
  // Additional icons for new categories
  Github,
  Lightbulb,
  // Fallback for any unmapped icons (will use the icon name from backend)
};

// ✅ OPTIMIZATION 1: Module-Level Cache
// This variable lives outside the component lifecycle.
// It persists as long as the app session is active (browser tab is open/refreshed).
let categoriesCache: Category[] | null = null;

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize state with cache if available, otherwise use default
  const [categoriesList, setCategoriesList] = useState<Category[]>(
    categoriesCache || defaultCategories
  );
  
  // ✅ OPTIMIZATION 2: Smart Loading State
  // If we have data in cache, we don't need to show the loading skeleton.
  const [isLoading, setIsLoading] = useState(!categoriesCache);

  useEffect(() => {
    // If we already have cached data, do nothing!
    if (categoriesCache) {
      setIsLoading(false);
      return;
    }

    // ✅ OPTIMIZATION 3: Abort Controller
    // Prevents memory leaks if user navigates away while fetching
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await modelsAPI.getCategories();
        
        if (!controller.signal.aborted && res?.data?.categories) {
          // Update State
          setCategoriesList(res.data.categories);
          // Update Cache
          categoriesCache = res.data.categories;
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to fetch categories:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    // Cleanup function
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 flex flex-col overflow-x-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore AI models organized by their primary use case
          </p>
        </div>

        {/* Conditional Rendering */}
        {isLoading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <Card className="h-full border-border bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <Skeleton className="w-5 h-5 rounded" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-20 rounded-full mt-2" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          // Real Data Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {categoriesList.map((category) => {
              const IconComponent = iconMap[category.icon];
              return (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <Card className="group h-full border-card-border bg-card hover:bg-card-hover hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                          {IconComponent && (
                            <IconComponent className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-medium text-primary">
                            {category.modelCount} models
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categoriesList.length === 0 && (
          <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground text-lg">No categories found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Categories;
