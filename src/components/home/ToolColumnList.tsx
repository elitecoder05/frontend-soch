import { Link } from "react-router-dom";
import { ExternalLink, ArrowUpRight } from "lucide-react"; 
import { Model } from "@/api/api-methods"; 

interface ToolListProps {
  title: string;
  icon: React.ReactNode;
  tools: Model[];
  viewAllLink?: string;
  isScrollable?: boolean;
}

export const ToolColumnList = ({ title, icon, tools, viewAllLink, isScrollable = true }: ToolListProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <h3 className="font-bold text-foreground">{title}</h3>
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-xs text-muted-foreground hover:text-primary transition-colors">
            View All
          </Link>
        )}
      </div>

      {/* List */}
      <div className={`flex-1 ${isScrollable ? "overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-border" : ""}`}>
        {tools.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No tools found</div>
        ) : (
          <div className="divide-y divide-border/50">
            {tools.map((tool, index) => {
              // Check if this specific tool is sponsored
              const isSponsored = tool.isSponsored;

              return (
                <div 
                  key={tool._id || index} 
                  className={`group p-3 transition-all flex items-center gap-3 relative 
                    ${isSponsored 
                      ? "bg-yellow-500/15 hover:bg-yellow-500/25 border-l-4 border-l-yellow-500" // 🔥 Increased Visibility
                      : "hover:bg-muted/30"
                    }`}
                >
                  
                  {/* Rank/Index */}
                  <span className={`text-xs w-4 font-mono ${isSponsored ? "text-yellow-500 font-bold" : "text-muted-foreground/50"}`}>
                    {index + 1}.
                  </span>
                  
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {tool.iconUrl ? (
                      <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-primary">{tool.name?.charAt(0) || "?"}</span>
                    )}
                  </div>

                  {/* Content */}
                  <Link to={`/model/${tool._id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {tool.name}
                      </h4>
                      {/* Premium Badge */}
                      {isSponsored && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-extrabold uppercase tracking-wide">
                          Ad
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                  </Link>

                  {/* Action */}
                  {tool.externalUrl && (
                    <a 
                      href={tool.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/10 text-center">
        <Link to="/explorer" className="text-xs font-medium text-primary flex items-center justify-center gap-1 hover:underline">
          See full directory <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};