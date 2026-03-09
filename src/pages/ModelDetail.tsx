// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import { 
//   ExternalLink, Clock, ChevronLeft, Share2, 
//   Layers, CheckCircle2, Eye, Flag, ArrowRight // ✅ Added ArrowRight here
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ModelCard } from "@/components/ModelCard";
// import { HorizontalCarousel } from "@/components/HorizontalCarousel";
// import { ShareDialog } from "@/components/ui/share-dialog";
// import { getModelUrl } from "@/lib/utils";

// // Hooks & Types
// import { useModelById, useSimilarModels } from "@/hooks/useModels";
// import { modelsAPI, Model } from "@/api/api-methods";
// import { useToast } from "@/hooks/use-toast";
// import { AiModel } from "@/types/model";

// const ModelDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location: any = useLocation();
//   const { toast } = useToast();
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [screenshotOrientations, setScreenshotOrientations] = useState<Record<number, 'landscape' | 'portrait' | 'square'>>({});

//   // 1. Fetch Data
//   const { data: modelData, isLoading, error: modelError } = useModelById(id);
//   const model = modelData?.data?.model || null;
  
//   const { data: similarData } = useSimilarModels(model?.category, model?._id);
//   const similarModels = similarData?.data?.models || [];

//   // 2. Handle Errors & Scroll
//   useEffect(() => {
//     if (modelError) {
//       toast({ title: 'Error', description: modelError.message, variant: 'destructive' });
//     }
//     window.scrollTo(0, 0);
//   }, [id, modelError, toast]);

//   // 3. Helper: Transform for ModelCard
//   const transformModelForCard = (m: Model): AiModel => ({
//     id: m._id,
//     slug: m.slug,
//     name: m.name,
//     shortDescription: m.shortDescription,
//     longDescription: m.longDescription || '',
//     category: m.category,
//     tags: m.tags,
//     provider: m.provider,
//     pricing: m.pricing,
//     rating: m.rating,
//     reviewsCount: m.reviewsCount,
//     installsCount: m.installsCount,
//     capabilities: m.capabilities,
//     isApiAvailable: m.isApiAvailable,
//     isOpenSource: m.isOpenSource,
//     lastUpdated: m.updatedAt,
//     modelType: m.modelType || '',
//     externalUrl: m.externalUrl || '',
//     iconUrl: m.iconUrl,
//     screenshots: m.screenshots,
//     featured: m.featured,
//     trendingScore: m.trendingScore,
//     bestFor: m.bestFor,
//     features: m.features,
//     examplePrompts: m.examplePrompts,
//   });

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
//   };

//   // 4. Loading State
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
//         <main className="container mx-auto px-4 py-24">
//           <Skeleton className="h-8 w-32 mb-8" />
//           <div className="flex gap-6 mb-12">
//             <Skeleton className="w-32 h-32 rounded-3xl" />
//             <div className="flex-1 space-y-4">
//               <Skeleton className="h-10 w-1/2" />
//               <Skeleton className="h-6 w-1/3" />
//               <Skeleton className="h-12 w-40" />
//             </div>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8">
//             <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
//             <Skeleton className="h-96 rounded-xl" />
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // 5. Not Found State
//   if (!model) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col">
//         <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
//         <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
//           <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
//           <p className="text-muted-foreground mb-8">The tool you are looking for does not exist or has been removed.</p>
//           <Button onClick={() => navigate('/explorer')}>Browse Tools</Button>
//         </div>
//       </div>
//     );
//   }

//   // 6. Main Render
//   return (
//     <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
//       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

//       <main className="container mx-auto px-4 py-8 pt-24">
        
//         {/* Back Button */}
//         <Link to={location?.state?.from || "/explorer"} className="inline-block mb-8">
//           <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all text-muted-foreground">
//             <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
//           </Button>
//         </Link>

//         {/* --- HEADER SECTION (Full Width) --- */}
//         <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
//           {/* Icon */}
//           <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-xl overflow-hidden">
//             {model.iconUrl ? (
//               <img src={model.iconUrl} alt={model.name} className="w-full h-full object-cover" />
//             ) : (
//               <span className="text-4xl font-bold text-primary">{model.name.charAt(0)}</span>
//             )}
//           </div>

//           {/* Details */}
//           <div className="flex-1 w-full">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//               <div>
//                 <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{model.name}</h1>
//                 <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
//                   <Badge variant="secondary" className="px-3 py-1 text-sm">{model.category}</Badge>
//                   <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {model.clicks || 0} views</span>
//                   <span>•</span>
//                   <span>by {model.provider}</span>
//                   <span>•</span>
//                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(model.updatedAt)}</span>
//                 </div>
//               </div>
              
//               <div className="flex gap-3">
//                 <ShareDialog url={getModelUrl(model._id)} title={model.name}>
//                   <Button variant="outline" size="icon" className="rounded-full">
//                     <Share2 className="w-5 h-5" />
//                   </Button>
//                 </ShareDialog>
//                 {model.externalUrl && (
//                   <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={() => window.open(model.externalUrl, '_blank')}>
//                     Visit Website <ExternalLink className="w-4 h-4 ml-2" />
//                   </Button>
//                 )}
//               </div>
//             </div>
            
//             <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
//               {model.shortDescription}
//             </p>
//           </div>
//         </div>

//         <Separator className="mb-12 opacity-50" />

//         {/* --- GRID LAYOUT --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
//           {/* LEFT COLUMN: Main Content (2/3) */}
//           <div className="lg:col-span-2 space-y-12">
            
//             {/* Screenshots */}
//             {model.screenshots && model.screenshots.length > 0 && (
//               <section>
//                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
//                   <Layers className="w-5 h-5 text-primary" /> Gallery
//                 </h3>
//                 <HorizontalCarousel>
//                   {model.screenshots.map((src, idx) => (
//                     <div key={idx} className="min-w-[280px] h-[200px] rounded-xl overflow-hidden border border-border/50 shadow-sm">
//                       <img 
//                         src={src} 
//                         alt="Screenshot" 
//                         className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
//                         onClick={() => window.open(src, '_blank')}
//                       />
//                     </div>
//                   ))}
//                 </HorizontalCarousel>
//               </section>
//             )}

//             {/* About / Description */}
//             <section>
//               <h3 className="text-xl font-bold mb-4">Overview</h3>
//               <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-7 text-lg">
//                 {model.longDescription || model.shortDescription}
//               </div>
//             </section>

//             {/* Features */}
//             {model.features && model.features.length > 0 && (
//               <section>
//                 <h3 className="text-xl font-bold mb-6">Key Features</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {model.features.map((feature, i) => (
//                     <div key={i} className="flex items-start gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
//                       <div className="bg-primary/20 p-1 rounded-full mt-0.5">
//                         <CheckCircle2 className="w-4 h-4 text-primary" />
//                       </div>
//                       <span className="text-sm font-medium">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Tags */}
//             <section>
//               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Tags</h3>
//               <div className="flex flex-wrap gap-2">
//                 {model.tags.map((tag, i) => (
//                   <Badge key={i} variant="outline" className="px-3 py-1">{tag}</Badge>
//                 ))}
//               </div>
//             </section>

//           </div>

//           {/* RIGHT COLUMN: Sidebar (1/3) */}
//           <aside className="space-y-8">
            
//             {/* Info Card */}
//             <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle>Tool Info</CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-5">
//                 <div className="flex justify-between items-center pb-4 border-b border-border/50">
//                   <span className="text-muted-foreground">Pricing</span>
//                   <Badge variant={model.pricing === 'free' ? 'secondary' : 'default'} className="capitalize px-3">
//                     {model.pricing}
//                   </Badge>
//                 </div>
                
//                 <div className="flex justify-between items-center pb-4 border-b border-border/50">
//                   <span className="text-muted-foreground">Category</span>
//                   <Link to={`/explorer?category=${model.category}`} className="text-primary hover:underline font-medium capitalize">
//                     {model.category}
//                   </Link>
//                 </div>

//                 {model.isApiAvailable && (
//                   <div className="flex justify-between items-center pb-4 border-b border-border/50">
//                     <span className="text-muted-foreground">API Access</span>
//                     <Badge variant="outline" className="text-green-500 border-green-500/30">Available</Badge>
//                   </div>
//                 )}

//                 {model.isOpenSource && (
//                   <div className="flex justify-between items-center pb-4 border-b border-border/50">
//                     <span className="text-muted-foreground">License</span>
//                     <Badge variant="outline" className="text-blue-400 border-blue-500/30">Open Source</Badge>
//                   </div>
//                 )}

//                 <div className="pt-2">
//                   <Button className="w-full h-12 text-base" onClick={() => window.open(model.externalUrl, '_blank')}>
//                     Get Started <ArrowRight className="ml-2 w-4 h-4" />
//                   </Button>
//                 </div>
                
//                 <div className="flex justify-center pt-2">
//                     <button onClick={() => navigate('/contact')} className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-2 transition-colors">
//                         <Flag className="w-3 h-3" /> Report Issue
//                     </button>
//                 </div>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>

//         <Separator className="my-16 opacity-50" />

//         {/* --- BOTTOM SECTION: CENTERED PROMOTION & SIMILAR --- */}
//         <div className="flex flex-col items-center space-y-16">
            
//             {/* 1. Promotion Widget (Centered) */}
//             {/* 2. Similar Models (Neat Grid) */}
//             {similarModels.length > 0 && (
//                 <section className="w-full">
//                     <div className="flex items-center justify-between mb-8">
//                         <h3 className="text-2xl font-bold">Similar Tools You Might Like</h3>
//                         <Link to="/explorer" className="text-primary hover:underline text-sm font-medium">Explore All</Link>
//                     </div>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {similarModels.map((similar) => (
//                             <ModelCard key={similar._id} model={transformModelForCard(similar)} />
//                         ))}
//                     </div>
//                 </section>
//             )}
//         </div>

//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ModelDetail;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// ✅ ADDED ShieldAlert, Home, and Search to the imports below
import { 
  ExternalLink, Clock, ChevronLeft, Share2, 
  Layers, CheckCircle2, Eye, Flag, ArrowRight,
  ShieldAlert, Home, Search, CreditCard, HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelCard } from "@/components/ModelCard";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { ShareDialog } from "@/components/ui/share-dialog";
import { getModelUrl } from "@/lib/utils";
import { useModelById, useSimilarModels } from "@/hooks/useModels";
import { modelsAPI, Model } from "@/api/api-methods";
import { useToast } from "@/hooks/use-toast";
import { AiModel } from "@/types/model";
import { useAuth } from "@/contexts/AuthContext";

const ModelDetail = () => {
  // --- 1. CALL ALL HOOKS FIRST (Top Level) ---
  const { id } = useParams();
  const navigate = useNavigate();
  const location: any = useLocation();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [screenshotOrientations, setScreenshotOrientations] = useState<Record<number, 'landscape' | 'portrait' | 'square'>>({});
  const [creatorTools, setCreatorTools] = useState<Model[]>([]);
  const [peopleAlsoViewed, setPeopleAlsoViewed] = useState<Model[]>([]);

  // Fetching Hooks
  const { data: modelData, isLoading, error: modelError } = useModelById(id);
  const model = modelData?.data?.model || null;
  const { data: similarData } = useSimilarModels(model?.category, model?._id);
  const similarModels = similarData?.data?.models || [];

  // Effects
  useEffect(() => {
    const fetchCreatorTools = async () => {
        if (model?.uploadedBy?._id) {
            try {
                const res = await modelsAPI.getAllModels({ limit: 50 });
                const others = res.data.models.filter(
                    (m) => m.uploadedBy._id === model.uploadedBy._id && m._id !== model._id
                );
                setCreatorTools(others.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch creator tools", err);
            }
        }
    };
    if (model) fetchCreatorTools();
  }, [model]);

  useEffect(() => {
    const fetchPeopleAlsoViewed = async () => {
      if (!model) return;
      try {
        const res = await modelsAPI.getPeopleAlsoViewed(model._id, 6);
        const recs = res.data.models || [];

        // Ensure we don't include the current model and keep uniqueness
        let filtered = recs.filter((m: Model) => m._id !== model._id);

        // If fewer than 4 recommendations, fetch random models from same category to fill
        if (filtered.length < 4) {
          try {
            const randRes = await modelsAPI.getAllModels({ category: model.category, limit: 6, randomize: true });
            const rand = randRes.data.models || [];
            const randFiltered = rand.filter((r: Model) => r._id !== model._id && !filtered.find((f: Model) => f._id === r._id));
            filtered = [...filtered, ...randFiltered].slice(0, 6);
          } catch (err) {
            // ignore filler errors, use whatever we have
            console.error('Failed to fetch random same-category fillers', err);
          }
        } else {
          filtered = filtered.slice(0, 6);
        }

        // Final set (may be <4) — we will show the section whenever we have at least 1
        setPeopleAlsoViewed(filtered);
      } catch (err) {
        console.error('Failed to fetch people also viewed', err);
      }
    };

    fetchPeopleAlsoViewed();
  }, [model, similarModels]);

  useEffect(() => {
    if (modelError) {
      toast({ title: 'Error', description: modelError.message, variant: 'destructive' });
    }
    window.scrollTo(0, 0);
  }, [id, modelError, toast]);

  // --- 2. HELPERS ---
  const transformModelForCard = (m: Model): AiModel => ({
    id: m._id,
    slug: m.slug,
    name: m.name,
    shortDescription: m.shortDescription,
    longDescription: m.longDescription || '',
    category: m.category,
    tags: m.tags,
    provider: m.provider,
    pricing: m.pricing,
    rating: m.rating,
    reviewsCount: m.reviewsCount,
    installsCount: m.installsCount,
    capabilities: m.capabilities,
    isApiAvailable: m.isApiAvailable,
    isOpenSource: m.isOpenSource,
    lastUpdated: m.updatedAt,
    modelType: m.modelType || '',
    externalUrl: m.externalUrl || '',
    iconUrl: m.iconUrl,
    screenshots: m.screenshots,
    featured: m.featured,
    trendingScore: m.trendingScore,
    bestFor: m.bestFor,
    features: m.features,
    examplePrompts: m.examplePrompts,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // --- 3. CONDITIONAL RENDERS (Must be AFTER all hooks) ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    );
  }

  // 🛡️ Access Control Logic
  if (!model || (model.status !== 'approved' && currentUser?.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-md">
            <div className="inline-flex p-4 rounded-2xl bg-card border border-border mb-6 shadow-xl">
              <ShieldAlert className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Tool Not Available</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The AI tool you are looking for might have been removed, rejected, or is currently under review by our team.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')} className="rounded-xl px-6 h-11">
                <Home className="mr-2 w-4 h-4" /> Back Home
              </Button>
              <Button variant="outline" onClick={() => navigate('/explorer')} className="rounded-xl px-6 h-11">
                <Search className="mr-2 w-4 h-4" /> Explore AI
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- 4. MAIN PAGE RENDER ---
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 pt-24">
        
        {/* Admin Warning Banner */}
        {model.status !== 'approved' && (
          <div className="bg-orange-500/10 border border-orange-500/50 p-4 rounded-xl mb-8 flex items-center gap-3 text-orange-200">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <p className="text-sm">
              <strong>Admin Preview:</strong> This tool is currently <strong>{model.status}</strong>. Regular users cannot see this page.
            </p>
          </div>
        )}

        <Link to={location?.state?.from || "/explorer"} className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
          </Button>
        </Link>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-xl overflow-hidden">
            {model.iconUrl ? <img src={model.iconUrl} alt={model.name} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-primary">{model.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{model.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">{model.category}</Badge>
                  {/* <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {model.clicks || 0} views</span>
                  <span>•</span> */}
                  <span>by {model.provider}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(model.updatedAt)}</span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <ShareDialog url={getModelUrl(model.slug)} title={model.name}>
                  <Button variant="outline" size="lg" className="rounded-full w-12 h-12 p-0"><Share2 className="w-5 h-5" /></Button>
                </ShareDialog>
                {model.externalUrl && (
                  <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-12" onClick={() => window.open(model.externalUrl, '_blank')}>
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{model.shortDescription}</p>
          </div>
        </div>

        <Separator className="mb-12 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {model.screenshots && model.screenshots.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> Gallery</h3>
                <HorizontalCarousel>
                  {model.screenshots.map((src, idx) => (
                    <div key={idx} className="min-w-[280px] h-[200px] rounded-xl overflow-hidden border border-border/50 shadow-sm">
                      <img src={src} alt="Screenshot" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(src, '_blank')} />
                    </div>
                  ))}
                </HorizontalCarousel>
              </section>
            )}

            <section>
              <h3 className="text-xl font-bold mb-4">Overview</h3>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-7 text-lg">
                {model.longDescription || model.shortDescription}
              </div>
            </section>

            {model.features && model.features.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {model.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
                      <div className="bg-primary/20 p-1 rounded-full mt-0.5"><CheckCircle2 className="w-4 h-4 text-primary" /></div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pricing Plans */}
            {model.pricingPlans && model.pricingPlans.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Pricing Plans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {model.pricingPlans.map((plan, i) => (
                    <Card key={i} className="border-border/50 bg-card/30 overflow-hidden shadow-sm">
                      <CardHeader className="pb-2">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <p className="text-2xl font-bold mt-2">{plan.price}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{plan.billingCycle}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Separator className="my-4 opacity-50" />
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {model.faqs && model.faqs.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" /> FAQs
                </h3>
                <div className="space-y-4">
                  {model.faqs.map((faq, i) => (
                    <Card key={i} className="border-border/50 bg-card/30 shadow-sm">
                      <CardHeader className="py-4">
                        <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader><CardTitle>Tool Info</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Pricing</span>
                  <Badge variant={model.pricing === 'free' ? 'secondary' : 'default'} className="capitalize px-3">{model.pricing}</Badge>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Category</span>
                  <Link to={`/explorer?category=${model.category}`} className="text-primary hover:underline font-medium capitalize">{model.category}</Link>
                </div>
                <div className="pt-2">
                  <Button className="w-full h-12 text-base" onClick={() => window.open(model.externalUrl, '_blank')}>Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Separator className="my-16 opacity-50" />

        <div className="flex flex-col items-center space-y-16">
            
            {/* Promotion widget removed */}

            {creatorTools.length > 0 && (
                <section className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {model.uploadedBy?.firstName?.[0] || "U"}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">More by {model.uploadedBy?.firstName}</h3>
                              <p className="text-sm text-muted-foreground">Other tools from this creator</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {creatorTools.map((tool) => (
                            <ModelCard key={tool._id} model={transformModelForCard(tool)} />
                        ))}
                    </div>
                </section>
            )}

            {similarModels.length > 0 && (
                <section className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">Similar Tools</h3>
                        <Link to="/explorer" className="text-primary hover:underline text-sm font-medium">Explore All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarModels.map((similar) => (
                            <ModelCard key={similar._id} model={transformModelForCard(similar)} />
                        ))}
                    </div>
                </section>
            )}

            {peopleAlsoViewed.length >= 4 && (
              <section className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">People Also Viewed</h3>
                  <Link to="/explorer" className="text-primary hover:underline text-sm font-medium">Explore All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {peopleAlsoViewed.map((p) => (
                    <ModelCard key={p._id} model={transformModelForCard(p)} />
                  ))}
                </div>
              </section>
            )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ModelDetail;