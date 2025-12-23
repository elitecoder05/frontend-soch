// import { Link } from "react-router-dom";
// import { ArrowRight, Star, TrendingUp } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface Tool {
//   _id: string;
//   name: string;
//   slug: string;
//   iconUrl: string;
//   bannerUrl?: string;
//   shortDescription: string;
// }

// interface FeaturedSectionProps {
//   tools: Tool[];
//   title?: string;
//   variant?: "home" | "search" | "minimal";
//   className?: string;
// }

// export const FeaturedToolsSection = ({ 
//   tools, 
//   title = "Get Featured Tools", 
//   variant = "home",
//   className = "" 
// }: FeaturedSectionProps) => {
//   if (!tools || tools.length === 0) return null;

//   // Limit to 5 tools as requested
//   const displayTools = tools.slice(0, 5);

//   return (
//     <div className={`w-full ${className}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6 px-1">
//         <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
//           {variant === "home" ? (
//             <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//           ) : (
//             <TrendingUp className="w-5 h-5 text-primary" />
//           )}
//           {title} <span className="text-primary hidden sm:inline">{'>>'}</span>
//         </h2>
        
//         {variant !== "minimal" && (
//           <Link to="/explorer?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
//             View all <ArrowRight className="w-4 h-4" />
//           </Link>
//         )}
//       </div>

//       {/* Grid - Fully Responsive */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
//         {displayTools.map((tool) => (
//           <Link key={tool._id} to={`/tool/${tool.slug}`} className="block h-full group">
//             <Card className="h-full border-primary/10 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden relative flex flex-col">
              
//               {/* Banner */}
//               <div className="h-28 w-full bg-muted relative overflow-hidden shrink-0">
//                 {tool.bannerUrl ? (
//                   <img src={tool.bannerUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
//                 )}
//                 <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm text-[10px] uppercase tracking-wider">
//                   Featured
//                 </Badge>
//               </div>

//               <CardContent className="p-4 pt-0 relative flex-1 flex flex-col">
//                 {/* Logo */}
//                 <div className="absolute -top-6 left-4 w-12 h-12 rounded-xl border-2 border-background bg-white shadow-sm overflow-hidden p-0.5">
//                   <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover rounded-lg" />
//                 </div>

//                 <div className="mt-8 flex-1">
//                   <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
//                     {tool.name}
//                   </h3>
//                   <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
//                     {tool.shortDescription}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };







import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tool {
  _id: string;
  name: string;
  slug: string;
  iconUrl: string;
  bannerUrl?: string;
  shortDescription: string;
}

interface FeaturedSectionProps {
  tools: Tool[];
  title?: string;
  variant?: "home" | "search" | "minimal";
  className?: string;
}

export const FeaturedToolsSection = ({ 
  tools, 
  title = "Get Featured Tools", 
  variant = "home",
  className = "" 
}: FeaturedSectionProps) => {
  if (!tools || tools.length === 0) return null;

  // Limit to 5 tools
  const displayTools = tools.slice(0, 5);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
          {variant === "home" ? (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ) : (
            <TrendingUp className="w-5 h-5 text-primary" />
          )}
          {title} <span className="text-primary hidden sm:inline">{'>>'}</span>
        </h2>
        
        {variant !== "minimal" && (
          <Link to="/explorer?featured=true" className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {displayTools.map((tool) => (
          <Link key={tool._id} to={`/tool/${tool.slug}`} className="block h-full group">
            <Card className="h-full border-primary/10 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden relative flex flex-col">
              
              {/* Banner */}
              <div className="h-24 md:h-28 w-full bg-muted relative overflow-hidden shrink-0">
                {tool.bannerUrl ? (
                  <img src={tool.bannerUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
                )}
                <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm text-[10px] uppercase tracking-wider">
                  Featured
                </Badge>
              </div>

              <CardContent className="p-3 md:p-4 pt-0 relative flex-1 flex flex-col">
                {/* Logo */}
                <div className="absolute -top-5 md:-top-6 left-4 w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-background bg-white shadow-sm overflow-hidden p-0.5">
                  <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover rounded-lg" />
                </div>

                <div className="mt-6 md:mt-8 flex-1">
                  <h3 className="font-bold text-sm md:text-base truncate group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};