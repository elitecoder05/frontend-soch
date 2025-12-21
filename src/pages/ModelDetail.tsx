// // import { useParams, Link, useLocation } from "react-router-dom";
// // import { ExternalLink, Clock, ChevronLeft, Loader2, Share2 } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import { Navbar } from "@/components/Navbar";
// // import { ModelCard } from "@/components/ModelCard";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { useState, useEffect } from "react";
// // import React from "react";
// // import { Model } from "@/api/api-methods";
// // import { useModelById, useSimilarModels } from "@/hooks/useModels";
// // import { useToast } from "@/hooks/use-toast";
// // import { AiModel } from "@/types/model";
// // import { HorizontalCarousel } from "@/components/HorizontalCarousel";
// // import { ShareDialog } from "@/components/ui/share-dialog";
// // import { getModelUrl } from "@/lib/utils";

// // const ModelDetail = () => {
// //   const { id } = useParams();
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const { toast } = useToast();
// //   const location: any = useLocation();

// //   // Use React Query for caching model data
// //   const { data: modelData, isLoading, error: modelError } = useModelById(id);
// //   const model = modelData?.data?.model || null;
  
// //   // Use React Query for similar models with caching
// //   const { data: similarData } = useSimilarModels(model?.category, model?._id);
// //   const similarModels = similarData?.data?.models || [];
  
// //   const [screenshotOrientations, setScreenshotOrientations] = useState<Record<number, 'landscape' | 'portrait' | 'square'>>({});

// //   const error = modelError?.message || null;

// //   // Show toast on error
// //   useEffect(() => {
// //     if (error) {
// //       toast({
// //         title: 'Error',
// //         description: error,
// //         variant: 'destructive',
// //       });
// //     }
// //   }, [error, toast]);

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-background">
// //         <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
// //         <main className="container mx-auto px-4 py-8">
// //           <Skeleton className="h-10 w-32 mb-6" />
// //           <div className="grid lg:grid-cols-3 gap-8">
// //             <div className="lg:col-span-2 space-y-6">
// //               <div className="flex gap-6">
// //                 <Skeleton className="w-24 h-24 rounded-2xl" />
// //                 <div className="flex-1 space-y-3">
// //                   <div className="flex gap-2">
// //                     <Skeleton className="h-6 w-20" />
// //                     <Skeleton className="h-6 w-16" />
// //                   </div>
// //                   <Skeleton className="h-8 w-3/4" />
// //                   <Skeleton className="h-5 w-32" />
// //                   <Skeleton className="h-5 w-48" />
// //                 </div>
// //               </div>
// //               <div className="space-y-4">
// //                 <Skeleton className="h-6 w-24" />
// //                 <Skeleton className="h-20 w-full" />
// //               </div>
// //             </div>
// //             <div className="space-y-6">
// //               <Card>
// //                 <CardHeader>
// //                   <Skeleton className="h-6 w-32" />
// //                 </CardHeader>
// //                 <CardContent className="space-y-4">
// //                   <Skeleton className="h-16 w-full" />
// //                   <Skeleton className="h-16 w-full" />
// //                 </CardContent>
// //               </Card>
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     );
// //   }

// //   if (error || !model) {
// //     return (
// //       <div className="min-h-screen bg-background flex items-center justify-center">
// //         <div className="text-center">
// //           <h1 className="text-2xl font-bold mb-2">Model not found</h1>
// //           <p className="text-muted-foreground mb-4">
// //             {error || "The requested model could not be found."}
// //           </p>
// //           <Link to="/">
// //             <Button variant="outline">Back to Home</Button>
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Transform Model to AiModel for ModelCard compatibility
// //   const transformModelForCard = (m: Model): AiModel => ({
// //     id: m._id,
// //     slug: m.slug,
// //     name: m.name,
// //     shortDescription: m.shortDescription,
// //     longDescription: m.longDescription || '',
// //     category: m.category,
// //     tags: m.tags,
// //     provider: m.provider,
// //     pricing: m.pricing,
// //     rating: m.rating,
// //     reviewsCount: m.reviewsCount,
// //     installsCount: m.installsCount,
// //     capabilities: m.capabilities,
// //     isApiAvailable: m.isApiAvailable,
// //     isOpenSource: m.isOpenSource,
// //     lastUpdated: m.updatedAt,
// //     modelType: m.modelType || '',
// //     externalUrl: m.externalUrl || '',
// //     iconUrl: m.iconUrl,
// //     screenshots: m.screenshots,
// //     featured: m.featured,
// //     trendingScore: m.trendingScore,
// //     bestFor: m.bestFor,
// //     features: m.features,
// //     examplePrompts: m.examplePrompts,
// //   });

// //   const formatDate = (date: string) => {
// //     return new Date(date).toLocaleDateString("en-US", {
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     });
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

// //       <main className="container mx-auto px-4 py-8">
// //         {/* Use the `from` state (if present) to navigate back to the correct page (e.g., /explorer) */}
// //         <Link to={location?.state?.from || "/explorer"}>
// //           <Button variant="ghost" size="sm" className="mb-6 -ml-2">
// //             <ChevronLeft className="w-4 h-4 mr-1" />
// //             Back to Store
// //           </Button>
// //         </Link>

// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           <div className="lg:col-span-2 space-y-6">
// //             <div className="flex flex-col sm:flex-row gap-6">
// //               <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
// //                 {model.iconUrl ? (
// //                   <img src={model.iconUrl} alt={model.name} className="w-full h-full rounded-xl object-cover" />
// //                 ) : (
// //                   <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
// //                     {model.name.charAt(0)}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex-1 min-w-0">
// //                 <div className="flex flex-wrap gap-2 mb-2">
// //                   <Badge variant="secondary">{model.category}</Badge>
// //                   {model.pricing === "free" && (
// //                     <Badge variant="outline" className="border-green-500/50 text-green-400">
// //                       Free
// //                     </Badge>
// //                   )}
// //                   {model.pricing === "freemium" && (
// //                     <Badge variant="outline" className="border-blue-500/50 text-blue-400">
// //                       Freemium
// //                     </Badge>
// //                   )}
// //                   {model.pricing === "paid" && (
// //                     <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
// //                       Paid
// //                     </Badge>
// //                   )}
// //                   {model.isApiAvailable && (
// //                     <Badge variant="outline" className="border-primary/50 text-primary">
// //                       API Available
// //                     </Badge>
// //                   )}
// //                   {model.featured && (
// //                     <Badge variant="outline" className="border-purple-500/50 text-purple-400">
// //                       Featured
// //                     </Badge>
// //                   )}
// //                 </div>

// //                 <div className="flex items-start gap-4 mb-2">
// //                   <h1 className="text-3xl font-bold text-foreground truncate">
// //                     {model.name}
// //                   </h1>

// //                   <div className="ml-auto">
// //                     <ShareDialog url={getModelUrl(model._id)} title={model.name}>
// //                       <Button variant="ghost" size="sm" aria-label={`Share ${model.name}`}>
// //                         <Share2 className="w-5 h-5" />
// //                       </Button>
// //                     </ShareDialog>
// //                   </div>
// //                 </div>
// //                 <p className="text-muted-foreground mb-3">
// //                   by {model.provider}
// //                   {model.uploadedBy && (
// //                     <span className="ml-2 text-xs">
// //                       (uploaded by {model.uploadedBy.firstName} {model.uploadedBy.lastName})
// //                     </span>
// //                   )}
// //                 </p>

// //                 <div className="flex items-center gap-4 text-sm">
// //                   <div className="flex items-center gap-1 text-muted-foreground">
// //                     <Clock className="w-4 h-4" />
// //                     <span>Updated {formatDate(model.updatedAt)}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {model.screenshots && model.screenshots.length > 0 && (
// //               <HorizontalCarousel title="Screenshots" description="Preview screenshots and examples">
// //                 {model.screenshots.map((src, idx) => {
// //                   const orientation = screenshotOrientations[idx] || 'landscape';

// //                   const containerClass = orientation === 'portrait'
// //                     ? 'min-w-[140px] sm:min-w-[180px] md:min-w-[220px] h-52 sm:h-64 md:h-80 rounded-md overflow-hidden shadow-sm bg-card/50 flex items-center justify-center'
// //                     : 'min-w-[180px] sm:min-w-[240px] md:min-w-[320px] h-36 sm:h-44 md:h-48 rounded-md overflow-hidden shadow-sm bg-card/50 flex items-center justify-center';

// //                   const imgClass = orientation === 'portrait' || orientation === 'square'
// //                     ? 'max-w-full max-h-full object-contain cursor-pointer'
// //                     : 'w-full h-full object-cover cursor-pointer';

// //                   return (
// //                     <div key={idx} className={containerClass}>
// //                       <img
// //                         src={src}
// //                         alt={`${model.name} screenshot ${idx + 1}`}
// //                         className={imgClass}
// //                         onClick={() => window.open(src, '_blank')}
// //                         onLoad={(e) => {
// //                           const img = e.currentTarget as HTMLImageElement;
// //                           const o = img.naturalWidth > img.naturalHeight ? 'landscape' : (img.naturalWidth < img.naturalHeight ? 'portrait' : 'square');
// //                           setScreenshotOrientations(prev => ({ ...prev, [idx]: o }));
// //                         }}
// //                       />
// //                     </div>
// //                   );
// //                 })}
// //               </HorizontalCarousel>
// //             )}

// //             <div className="flex flex-wrap gap-3">
// //               {model.externalUrl && (
// //                 <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
// //                   <a href={model.externalUrl} target="_blank" rel="noopener noreferrer">
// //                     Open Model
// //                     <ExternalLink className="w-4 h-4 ml-2" />
// //                   </a>
// //                 </Button>
// //               )}
// //             </div>

// //             <Separator />

// //             <div>
// //               <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
// //               <p className="text-muted-foreground leading-relaxed">
// //                 {model.longDescription || model.shortDescription}
// //               </p>
// //             </div>

// //             {model.bestFor && model.bestFor.length > 0 && (
// //               <div>
// //                 <h2 className="text-xl font-bold text-foreground mb-3">Best For</h2>
// //                 <div className="flex flex-wrap gap-2">
// //                   {model.bestFor.map((item, index) => (
// //                     <Badge key={index} variant="secondary">
// //                       {item}
// //                     </Badge>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {model.features && model.features.length > 0 && (
// //               <div>
// //                 <h2 className="text-xl font-bold text-foreground mb-3">
// //                   Key Features
// //                 </h2>
// //                 <div className="grid gap-3">
// //                   {model.features.map((feature, index) => (
// //                     <div
// //                       key={index}
// //                       className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
// //                     >
// //                       <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
// //                       <p className="text-muted-foreground">{feature}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {model.examplePrompts && model.examplePrompts.length > 0 && (
// //               <div>
// //                 <h2 className="text-xl font-bold text-foreground mb-3">
// //                   Example Prompts
// //                 </h2>
// //                 <div className="space-y-2">
// //                   {model.examplePrompts.map((prompt, index) => (
// //                     <div
// //                       key={index}
// //                       className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm text-muted-foreground"
// //                     >
// //                       {prompt}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             <div>
// //               <h2 className="text-xl font-bold text-foreground mb-3">Tags</h2>
// //               <div className="flex flex-wrap gap-2">
// //                 {model.tags.map((tag, index) => (
// //                   <Badge key={index} variant="outline">
// //                     {tag}
// //                   </Badge>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="space-y-6 lg:col-span-1">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Model Details</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="text-sm text-muted-foreground mb-1">Model Type</div>
// //                   <div className="text-foreground font-medium">{model.modelType}</div>
// //                 </div>
// //                 <Separator />
// //                 <div>
// //                   <div className="text-sm text-muted-foreground mb-1">Provider</div>
// //                   <div className="text-foreground font-medium">{model.provider}</div>
// //                 </div>
// //                 <Separator />
// //                 {model.externalUrl && (
// //                   <>
// //                     <div>
// //                       <div className="text-sm text-muted-foreground mb-1">Website</div>
// //                       <div className="text-foreground font-medium break-words">
// //                         <a href={model.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
// //                           Visit Website
// //                           <ExternalLink className="w-4 h-4" />
// //                         </a>
// //                       </div>
// //                     </div>
// //                     <Separator />
// //                   </>
// //                 )}
// //                 <div>
// //                   <div className="text-sm text-muted-foreground mb-1">Pricing</div>
// //                   <div className="text-foreground font-medium capitalize">
// //                     {model.pricing}
// //                   </div>
// //                 </div>
// //                 <Separator />
// //                 <div>
// //                   <div className="text-sm text-muted-foreground mb-1">Capabilities</div>
// //                   <div className="flex flex-wrap gap-1 mt-2">
// //                     {model.capabilities.map((cap, index) => (
// //                       <Badge key={index} variant="secondary" className="text-xs">
// //                         {cap}
// //                       </Badge>
// //                     ))}
// //                   </div>
// //                 </div>
// //                 {model.isOpenSource && (
// //                   <>
// //                     <Separator />
// //                     <div>
// //                       <Badge variant="outline" className="border-green-500/50 text-green-400">
// //                         Open Source
// //                       </Badge>
// //                     </div>
// //                   </>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             {similarModels.length > 0 && (
// //               <Card>
// //                 <CardHeader>
// //                   <CardTitle>Similar Models</CardTitle>
// //                 </CardHeader>
// //                 <CardContent className="space-y-3">
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                     {similarModels.map((similar) => (
// //                       <div key={similar._id}>
// //                         <ModelCard model={transformModelForCard(similar)} />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default ModelDetail;

// import { useParams, Link, useLocation } from "react-router-dom";
// import { ExternalLink, Clock, ChevronLeft, Share2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Navbar } from "@/components/Navbar";
// import { ModelCard } from "@/components/ModelCard";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useState, useEffect } from "react";
// import React from "react";
// import { Model } from "@/api/api-methods";
// import { useModelById, useSimilarModels } from "@/hooks/useModels";
// import { useToast } from "@/hooks/use-toast";
// import { AiModel } from "@/types/model";
// import { HorizontalCarousel } from "@/components/HorizontalCarousel";
// import { ShareDialog } from "@/components/ui/share-dialog";
// import { getModelUrl } from "@/lib/utils";
// // ✅ Import the Promotion Widget
// import { PromotionWidget } from "@/components/home/PromotionWidget"; 

// const ModelDetail = () => {
//   const { id } = useParams();
//   const [searchQuery, setSearchQuery] = useState("");
//   const { toast } = useToast();
//   const location: any = useLocation();

//   // Use React Query for caching model data
//   const { data: modelData, isLoading, error: modelError } = useModelById(id);
//   const model = modelData?.data?.model || null;
  
//   // Use React Query for similar models with caching
//   const { data: similarData } = useSimilarModels(model?.category, model?._id);
//   const similarModels = similarData?.data?.models || [];
  
//   const [screenshotOrientations, setScreenshotOrientations] = useState<Record<number, 'landscape' | 'portrait' | 'square'>>({});

//   const error = modelError?.message || null;

//   // Show toast on error
//   useEffect(() => {
//     if (error) {
//       toast({
//         title: 'Error',
//         description: error,
//         variant: 'destructive',
//       });
//     }
//   }, [error, toast]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
//         <main className="container mx-auto px-4 py-8">
//           <Skeleton className="h-10 w-32 mb-6" />
//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="flex gap-6">
//                 <Skeleton className="w-24 h-24 rounded-2xl" />
//                 <div className="flex-1 space-y-3">
//                   <div className="flex gap-2">
//                     <Skeleton className="h-6 w-20" />
//                     <Skeleton className="h-6 w-16" />
//                   </div>
//                   <Skeleton className="h-8 w-3/4" />
//                   <Skeleton className="h-5 w-32" />
//                   <Skeleton className="h-5 w-48" />
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <Skeleton className="h-6 w-24" />
//                 <Skeleton className="h-20 w-full" />
//               </div>
//             </div>
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <Skeleton className="h-6 w-32" />
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Skeleton className="h-16 w-full" />
//                   <Skeleton className="h-16 w-full" />
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error || !model) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-2">Model not found</h1>
//           <p className="text-muted-foreground mb-4">
//             {error || "The requested model could not be found."}
//           </p>
//           <Link to="/">
//             <Button variant="outline">Back to Home</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Transform Model to AiModel for ModelCard compatibility
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
//     return new Date(date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

//       <main className="container mx-auto px-4 py-8">
//         {/* Use the `from` state (if present) to navigate back to the correct page (e.g., /explorer) */}
//         <Link to={location?.state?.from || "/explorer"}>
//           <Button variant="ghost" size="sm" className="mb-6 -ml-2">
//             <ChevronLeft className="w-4 h-4 mr-1" />
//             Back to Store
//           </Button>
//         </Link>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* --- LEFT COLUMN (Model Info) --- */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="flex flex-col sm:flex-row gap-6">
//               <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
//                 {model.iconUrl ? (
//                   <img src={model.iconUrl} alt={model.name} className="w-full h-full rounded-xl object-cover" />
//                 ) : (
//                   <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
//                     {model.name.charAt(0)}
//                   </span>
//                 )}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   <Badge variant="secondary">{model.category}</Badge>
//                   {model.pricing === "free" && (
//                     <Badge variant="outline" className="border-green-500/50 text-green-400">
//                       Free
//                     </Badge>
//                   )}
//                   {model.pricing === "freemium" && (
//                     <Badge variant="outline" className="border-blue-500/50 text-blue-400">
//                       Freemium
//                     </Badge>
//                   )}
//                   {model.pricing === "paid" && (
//                     <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
//                       Paid
//                     </Badge>
//                   )}
//                   {model.isApiAvailable && (
//                     <Badge variant="outline" className="border-primary/50 text-primary">
//                       API Available
//                     </Badge>
//                   )}
//                   {model.featured && (
//                     <Badge variant="outline" className="border-purple-500/50 text-purple-400">
//                       Featured
//                     </Badge>
//                   )}
//                 </div>

//                 <div className="flex items-start gap-4 mb-2">
//                   <h1 className="text-3xl font-bold text-foreground truncate">
//                     {model.name}
//                   </h1>

//                   <div className="ml-auto">
//                     <ShareDialog url={getModelUrl(model._id)} title={model.name}>
//                       <Button variant="ghost" size="sm" aria-label={`Share ${model.name}`}>
//                         <Share2 className="w-5 h-5" />
//                       </Button>
//                     </ShareDialog>
//                   </div>
//                 </div>
//                 <p className="text-muted-foreground mb-3">
//                   by {model.provider}
//                   {model.uploadedBy && (
//                     <span className="ml-2 text-xs">
//                       (uploaded by {model.uploadedBy.firstName} {model.uploadedBy.lastName})
//                     </span>
//                   )}
//                 </p>

//                 <div className="flex items-center gap-4 text-sm">
//                   <div className="flex items-center gap-1 text-muted-foreground">
//                     <Clock className="w-4 h-4" />
//                     <span>Updated {formatDate(model.updatedAt)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {model.screenshots && model.screenshots.length > 0 && (
//               <HorizontalCarousel title="Screenshots" description="Preview screenshots and examples">
//                 {model.screenshots.map((src, idx) => {
//                   const orientation = screenshotOrientations[idx] || 'landscape';

//                   const containerClass = orientation === 'portrait'
//                     ? 'min-w-[140px] sm:min-w-[180px] md:min-w-[220px] h-52 sm:h-64 md:h-80 rounded-md overflow-hidden shadow-sm bg-card/50 flex items-center justify-center'
//                     : 'min-w-[180px] sm:min-w-[240px] md:min-w-[320px] h-36 sm:h-44 md:h-48 rounded-md overflow-hidden shadow-sm bg-card/50 flex items-center justify-center';

//                   const imgClass = orientation === 'portrait' || orientation === 'square'
//                     ? 'max-w-full max-h-full object-contain cursor-pointer'
//                     : 'w-full h-full object-cover cursor-pointer';

//                   return (
//                     <div key={idx} className={containerClass}>
//                       <img
//                         src={src}
//                         alt={`${model.name} screenshot ${idx + 1}`}
//                         className={imgClass}
//                         onClick={() => window.open(src, '_blank')}
//                         onLoad={(e) => {
//                           const img = e.currentTarget as HTMLImageElement;
//                           const o = img.naturalWidth > img.naturalHeight ? 'landscape' : (img.naturalWidth < img.naturalHeight ? 'portrait' : 'square');
//                           setScreenshotOrientations(prev => ({ ...prev, [idx]: o }));
//                         }}
//                       />
//                     </div>
//                   );
//                 })}
//               </HorizontalCarousel>
//             )}

//             <div className="flex flex-wrap gap-3">
//               {model.externalUrl && (
//                 <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
//                   <a href={model.externalUrl} target="_blank" rel="noopener noreferrer">
//                     Open Model
//                     <ExternalLink className="w-4 h-4 ml-2" />
//                   </a>
//                 </Button>
//               )}
//             </div>

//             <Separator />

//             <div>
//               <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
//               <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
//                 {model.longDescription || model.shortDescription}
//               </p>
//             </div>

//             {model.bestFor && model.bestFor.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-bold text-foreground mb-3">Best For</h2>
//                 <div className="flex flex-wrap gap-2">
//                   {model.bestFor.map((item, index) => (
//                     <Badge key={index} variant="secondary">
//                       {item}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {model.features && model.features.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-bold text-foreground mb-3">
//                   Key Features
//                 </h2>
//                 <div className="grid gap-3">
//                   {model.features.map((feature, index) => (
//                     <div
//                       key={index}
//                       className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
//                     >
//                       <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
//                       <p className="text-muted-foreground">{feature}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {model.examplePrompts && model.examplePrompts.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-bold text-foreground mb-3">
//                   Example Prompts
//                 </h2>
//                 <div className="space-y-2">
//                   {model.examplePrompts.map((prompt, index) => (
//                     <div
//                       key={index}
//                       className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm text-muted-foreground"
//                     >
//                       {prompt}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div>
//               <h2 className="text-xl font-bold text-foreground mb-3">Tags</h2>
//               <div className="flex flex-wrap gap-2">
//                 {model.tags.map((tag, index) => (
//                   <Badge key={index} variant="outline">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT COLUMN (Sidebar) --- */}
//           <div className="space-y-6 lg:col-span-1">
//             {/* Model Metadata Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Model Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-1">Model Type</div>
//                   <div className="text-foreground font-medium">{model.modelType}</div>
//                 </div>
//                 <Separator />
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-1">Provider</div>
//                   <div className="text-foreground font-medium">{model.provider}</div>
//                 </div>
//                 <Separator />
//                 {model.externalUrl && (
//                   <>
//                     <div>
//                       <div className="text-sm text-muted-foreground mb-1">Website</div>
//                       <div className="text-foreground font-medium break-words">
//                         <a href={model.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
//                           Visit Website
//                           <ExternalLink className="w-4 h-4" />
//                         </a>
//                       </div>
//                     </div>
//                     <Separator />
//                   </>
//                 )}
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-1">Pricing</div>
//                   <div className="text-foreground font-medium capitalize">
//                     {model.pricing}
//                   </div>
//                 </div>
//                 <Separator />
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-1">Capabilities</div>
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {model.capabilities.map((cap, index) => (
//                       <Badge key={index} variant="secondary" className="text-xs">
//                         {cap}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//                 {model.isOpenSource && (
//                   <>
//                     <Separator />
//                     <div>
//                       <Badge variant="outline" className="border-green-500/50 text-green-400">
//                         Open Source
//                       </Badge>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* ✅ PROMOTION WIDGET PLACEMENT */}
//             <div className="py-2">
//               <PromotionWidget />
//             </div>

//             {/* Similar Models Section */}
//             {similarModels.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Similar Models</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
//                     {similarModels.map((similar) => (
//                       <div key={similar._id}>
//                         <ModelCard model={transformModelForCard(similar)} />
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ModelDetail;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ExternalLink, Clock, ChevronLeft, Share2, 
  Layers, CheckCircle2, Eye, Flag, ArrowRight // ✅ Added ArrowRight here
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
import { PromotionWidget } from "@/components/home/PromotionWidget"; 

// Hooks & Types
import { useModelById, useSimilarModels } from "@/hooks/useModels";
import { modelsAPI, Model } from "@/api/api-methods";
import { useToast } from "@/hooks/use-toast";
import { AiModel } from "@/types/model";

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location: any = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [screenshotOrientations, setScreenshotOrientations] = useState<Record<number, 'landscape' | 'portrait' | 'square'>>({});

  // 1. Fetch Data
  const { data: modelData, isLoading, error: modelError } = useModelById(id);
  const model = modelData?.data?.model || null;
  
  const { data: similarData } = useSimilarModels(model?.category, model?._id);
  const similarModels = similarData?.data?.models || [];

  // 2. Handle Errors & Scroll
  useEffect(() => {
    if (modelError) {
      toast({ title: 'Error', description: modelError.message, variant: 'destructive' });
    }
    window.scrollTo(0, 0);
  }, [id, modelError, toast]);

  // 3. Helper: Transform for ModelCard
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

  // 4. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="container mx-auto px-4 py-24">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="flex gap-6 mb-12">
            <Skeleton className="w-32 h-32 rounded-3xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  // 5. Not Found State
  if (!model) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
          <p className="text-muted-foreground mb-8">The tool you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/explorer')}>Browse Tools</Button>
        </div>
      </div>
    );
  }

  // 6. Main Render
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 pt-24">
        
        {/* Back Button */}
        <Link to={location?.state?.from || "/explorer"} className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
          </Button>
        </Link>

        {/* --- HEADER SECTION (Full Width) --- */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Icon */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-xl overflow-hidden">
            {model.iconUrl ? (
              <img src={model.iconUrl} alt={model.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-primary">{model.name.charAt(0)}</span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{model.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">{model.category}</Badge>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {model.clicks || 0} views</span>
                  <span>•</span>
                  <span>by {model.provider}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(model.updatedAt)}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <ShareDialog url={getModelUrl(model._id)} title={model.name}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </ShareDialog>
                {model.externalUrl && (
                  <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={() => window.open(model.externalUrl, '_blank')}>
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {model.shortDescription}
            </p>
          </div>
        </div>

        <Separator className="mb-12 opacity-50" />

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Screenshots */}
            {model.screenshots && model.screenshots.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Gallery
                </h3>
                <HorizontalCarousel>
                  {model.screenshots.map((src, idx) => (
                    <div key={idx} className="min-w-[280px] h-[200px] rounded-xl overflow-hidden border border-border/50 shadow-sm">
                      <img 
                        src={src} 
                        alt="Screenshot" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(src, '_blank')}
                      />
                    </div>
                  ))}
                </HorizontalCarousel>
              </section>
            )}

            {/* About / Description */}
            <section>
              <h3 className="text-xl font-bold mb-4">Overview</h3>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-7 text-lg">
                {model.longDescription || model.shortDescription}
              </div>
            </section>

            {/* Features */}
            {model.features && model.features.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {model.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
                      <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1">{tag}</Badge>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sidebar (1/3) */}
          <aside className="space-y-8">
            
            {/* Info Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tool Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Pricing</span>
                  <Badge variant={model.pricing === 'free' ? 'secondary' : 'default'} className="capitalize px-3">
                    {model.pricing}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Category</span>
                  <Link to={`/explorer?category=${model.category}`} className="text-primary hover:underline font-medium capitalize">
                    {model.category}
                  </Link>
                </div>

                {model.isApiAvailable && (
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-muted-foreground">API Access</span>
                    <Badge variant="outline" className="text-green-500 border-green-500/30">Available</Badge>
                  </div>
                )}

                {model.isOpenSource && (
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-muted-foreground">License</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-500/30">Open Source</Badge>
                  </div>
                )}

                <div className="pt-2">
                  <Button className="w-full h-12 text-base" onClick={() => window.open(model.externalUrl, '_blank')}>
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center pt-2">
                    <button onClick={() => navigate('/contact')} className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-2 transition-colors">
                        <Flag className="w-3 h-3" /> Report Issue
                    </button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Separator className="my-16 opacity-50" />

        {/* --- BOTTOM SECTION: CENTERED PROMOTION & SIMILAR --- */}
        <div className="flex flex-col items-center space-y-16">
            
            {/* 1. Promotion Widget (Centered) */}
            <div className="w-full flex justify-center">
                <PromotionWidget />
            </div>

            {/* 2. Similar Models (Neat Grid) */}
            {similarModels.length > 0 && (
                <section className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">Similar Tools You Might Like</h3>
                        <Link to="/explorer" className="text-primary hover:underline text-sm font-medium">Explore All</Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {similarModels.map((similar) => (
                            <ModelCard key={similar._id} model={transformModelForCard(similar)} />
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
