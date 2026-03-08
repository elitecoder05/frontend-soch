// // import React from 'react';
// // import { Navbar } from '@/components/Navbar';
// // import { AnimatedSearchBar } from '@/components/AnimatedSearchBar';
// // import { TrendingUp, Sparkles, Code, MessageSquare, Zap } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';
// // import { Card } from '@/components/ui/card';

// // export const SearchPage = () => {
// //   const navigate = useNavigate();

// //   // Mock data for Popular Tools (Replace with API call in future)
// //   const popularTools = [
// //     { name: 'ChatGPT', provider: 'OpenAI', icon: '⚡', color: 'bg-green-500/10 text-green-500' },
// //     { name: 'Midjourney', provider: 'Midjourney Inc', icon: '🎨', color: 'bg-purple-500/10 text-purple-500' },
// //     { name: 'Claude', provider: 'Anthropic', icon: '🤖', color: 'bg-orange-500/10 text-orange-500' },
// //     { name: 'GitHub Copilot', provider: 'GitHub', icon: '💻', color: 'bg-blue-500/10 text-blue-500' },
// //   ];

// //   const suggestedSearches = [
// //     'Video Generator', 'Logo Maker', 'Coding Assistant', 'Voice Clone', 'Deepfake'
// //   ];

// //   return (
// //     <div className="min-h-screen bg-background pb-24">
// //       {/* Mobile Navbar is handled globally in App.tsx via MobileNav component */}
// //       <div className="md:hidden pt-4 px-4 pb-2">
// //          <h1 className="text-2xl font-bold mb-4">Search</h1>
// //       </div>

// //       <div className="container mx-auto px-4 pt-4 md:pt-24 max-w-3xl">
        
// //         {/* 1. Animated Search Bar */}
// //         <div className="mb-8">
// //             <AnimatedSearchBar autoFocus={true} />
// //         </div>

// //         {/* 2. Suggested Tags */}
// //         <div className="mb-10">
// //             <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
// //                 Suggested Searches
// //             </h3>
// //             <div className="flex flex-wrap gap-2">
// //                 {suggestedSearches.map((tag) => (
// //                     <button
// //                         key={tag}
// //                         onClick={() => navigate(`/explorer?search=${encodeURIComponent(tag)}`)}
// //                         className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-full text-sm font-medium transition-colors"
// //                     >
// //                         {tag}
// //                     </button>
// //                 ))}
// //             </div>
// //         </div>

// //         {/* 3. Popular AI Tools List (Play Store Style) */}
// //         <div>
// //             <div className="flex items-center gap-2 mb-4">
// //                 <TrendingUp className="w-5 h-5 text-primary" />
// //                 <h3 className="text-lg font-semibold">Popular AI Tools</h3>
// //             </div>
            
// //             <div className="space-y-3">
// //                 {popularTools.map((tool) => (
// //                     <Card 
// //                         key={tool.name}
// //                         onClick={() => navigate(`/explorer?search=${encodeURIComponent(tool.name)}`)}
// //                         className="flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors border-border/40 shadow-sm"
// //                     >
// //                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tool.color} mr-4`}>
// //                             {tool.icon}
// //                         </div>
// //                         <div className="flex-1">
// //                             <h4 className="font-semibold text-foreground">{tool.name}</h4>
// //                             <p className="text-xs text-muted-foreground">{tool.provider}</p>
// //                         </div>
// //                         <div className="text-muted-foreground">
// //                             <Zap className="w-4 h-4" />
// //                         </div>
// //                     </Card>
// //                 ))}
// //             </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default SearchPage;
// import React from 'react';
// import { Navbar } from '@/components/Navbar';
// import { AnimatedSearchBar } from '@/components/AnimatedSearchBar'; // Ensure you have this component
// import { TrendingUp, Zap } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Card } from '@/components/ui/card';

// export const SearchPage = () => {
//   const navigate = useNavigate();

//   const suggestedSearches = ['Video Generator', 'Logo Maker', 'Coding Assistant', 'Voice Clone', 'Deepfake'];
//   const popularTools = [
//     { name: 'ChatGPT', provider: 'OpenAI', icon: '⚡', color: 'bg-green-500/10 text-green-500' },
//     { name: 'Midjourney', provider: 'Midjourney Inc', icon: '🎨', color: 'bg-purple-500/10 text-purple-500' },
//     { name: 'Claude', provider: 'Anthropic', icon: '🤖', color: 'bg-orange-500/10 text-orange-500' },
//   ];

//   return (
//     <div className="min-h-screen bg-background pb-24 font-sans">
//       <div className="md:hidden pt-4 px-4 pb-2">
//          <h1 className="text-2xl font-bold mb-4">Search</h1>
//       </div>

//       <div className="container mx-auto px-4 pt-4 md:pt-24 max-w-3xl">
//         <div className="mb-8">
//             {/* If AnimatedSearchBar isn't created yet, use a standard Input here temporarily */}
//             <AnimatedSearchBar autoFocus={true} />
//         </div>

//         <div className="mb-10">
//             <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Suggested</h3>
//             <div className="flex flex-wrap gap-2">
//                 {suggestedSearches.map((tag) => (
//                     <button
//                         key={tag}
//                         onClick={() => navigate(`/explorer?search=${encodeURIComponent(tag)}`)}
//                         className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-full text-sm font-medium transition-colors"
//                     >
//                         {tag}
//                     </button>
//                 ))}
//             </div>
//         </div>

//         <div>
//             <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp className="w-5 h-5 text-primary" />
//                 <h3 className="text-lg font-semibold">Popular AI Tools</h3>
//             </div>
//             <div className="space-y-3">
//                 {popularTools.map((tool) => (
//                     <Card 
//                         key={tool.name}
//                         onClick={() => navigate(`/explorer?search=${encodeURIComponent(tool.name)}`)}
//                         className="flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors border-border/40 shadow-sm"
//                     >
//                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tool.color} mr-4`}>
//                             {tool.icon}
//                         </div>
//                         <div className="flex-1">
//                             <h4 className="font-semibold text-foreground">{tool.name}</h4>
//                             <p className="text-xs text-muted-foreground">{tool.provider}</p>
//                         </div>
//                         <Zap className="w-4 h-4 text-muted-foreground" />
//                     </Card>
//                 ))}
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };








import React, { useState } from 'react';
import { AnimatedSearchBar } from '@/components/AnimatedSearchBar';
import { TrendingUp, Zap, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { modelsAPI, Model } from '@/api/api-methods'; // Ensure you have this import
import { Navbar } from '@/components/Navbar';

export const SearchPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<Model[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // -- Data for Default View (Play Store Style) --
  const popularTools = [
    { name: 'ChatGPT', provider: 'OpenAI', icon: '⚡', color: 'bg-green-500/10 text-green-500' },
    { name: 'Midjourney', provider: 'Midjourney Inc', icon: '🎨', color: 'bg-purple-500/10 text-purple-500' },
    { name: 'Claude', provider: 'Anthropic', icon: '🤖', color: 'bg-orange-500/10 text-orange-500' },
    { name: 'GitHub Copilot', provider: 'GitHub', icon: '💻', color: 'bg-blue-500/10 text-blue-500' },
  ];

  const suggestedSearches = [
    'Video Generator', 'Logo Maker', 'Coding Assistant', 'Voice Clone', 'Deepfake'
  ];

  // -- Search Handler --
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
        setHasSearched(false);
        setResults([]);
        return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
        // Fetch results dynamically
// 👇 Use 'getAllModels' instead of 'getModels'
const response = await modelsAPI.getAllModels({ search: query, limit: 10 });        setResults(response.data.models);
    } catch (error) {
        console.error("Search failed", error);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
        <Navbar />
      {/* Mobile Title */}
      {/* <div className="md:hidden pt-4 px-4 pb-2">
         <h1 className="text-2xl font-bold mb-4">Search</h1>
      </div> */}

      <div className="container mx-auto px-4 pt-4 md:pt-24 max-w-3xl">
        
        {/* 1. Animated Search Bar (With Local Handler) */}
        <div className="mb-8">
            <AnimatedSearchBar autoFocus={true} onSearch={handleSearch} />
        </div>

        {/* 2. CONDITIONAL RENDERING: Search Results OR Default View */}
        
        {hasSearched ? (
            /* --- SEARCH RESULTS VIEW --- */
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Results
                    </h3>
                    {isSearching && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>

                {!isSearching && results.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No tools found matching your search.</p>
                        <button onClick={() => setHasSearched(false)} className="text-primary mt-2 hover:underline">
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {results.map((tool) => (
                            <Card 
                                key={tool._id}
                                onClick={() => navigate(`/model/${tool.slug}`)}
                                className="flex items-start p-4 hover:bg-muted/50 cursor-pointer transition-colors border-border/40 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                            >
                                {/* Tool Icon / First Letter */}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mr-4 shrink-0">
                                    {tool.iconUrl ? <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover rounded-xl"/> : tool.name.charAt(0)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-foreground truncate pr-2">{tool.name}</h4>
                                        <Badge variant="secondary" className="text-[10px] h-5">{tool.category}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.shortDescription}</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">by {tool.provider}</p>
                                </div>
                                <div className="ml-2 self-center">
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            /* --- DEFAULT PLAY STORE VIEW --- */
            <>
                {/* Suggested Tags */}
                <div className="mb-10 animate-in fade-in duration-500">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Suggested Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestedSearches.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleSearch(tag)} // Click tag to search locally
                                className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-full text-sm font-medium transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular AI Tools List */}
                <div className="animate-in fade-in duration-700 delay-100">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Popular AI Tools</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {popularTools.map((tool) => (
                            <Card 
                                key={tool.name}
                                onClick={() => handleSearch(tool.name)}
                                className="flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors border-border/40 shadow-sm"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tool.color} mr-4`}>
                                    {tool.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">{tool.name}</h4>
                                    <p className="text-xs text-muted-foreground">{tool.provider}</p>
                                </div>
                                <div className="text-muted-foreground">
                                    <Zap className="w-4 h-4" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default SearchPage;