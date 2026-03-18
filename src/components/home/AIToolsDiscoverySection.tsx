import { useState, useMemo } from 'react';
import { useAllModels } from '@/hooks/useModels';
import { HorizontalCarousel } from '@/components/HorizontalCarousel';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCategory {
  title: string;
  filters: string[]; // Category keywords to match
}

const CATEGORIES: ToolCategory[] = [
  {
    title: 'Best AI tools for Image Generation',
    filters: ['image']
  },
  {
    title: 'Best AI tools for Video Generation',
    filters: ['video']
  },
  {
    title: 'Best AI tools for Voice Cloning',
    filters: ['voice']
  },
  {
    title: 'Best AI tools for Productivity',
    filters: ['productivity', 'writing']
  }
];

// Simple tool card component
const ToolCard = ({ tool }: { tool: any }) => {
  return (
    <Link
      to={`/model/${tool.slug}`}
      className="flex-shrink-0 w-32 group cursor-pointer snap-start"
    >
      <div className="h-28 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col items-center justify-center bg-card/30 hover:bg-card/50 p-3 relative">
        {/* Tool Logo/Icon */}
        {tool.logo ? (
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-12 h-12 object-contain mb-2 group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-12 h-12 mb-2 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-xs font-bold text-primary">
              {tool.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Tool Name */}
        <p className="text-xs font-semibold text-center text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {tool.name}
        </p>
      </div>
    </Link>
  );
};

export const AIToolsDiscoverySection = () => {
  const { data: modelsData, isLoading } = useAllModels({ limit: 100, randomize: false });

  const allModels = useMemo(() => modelsData?.data?.models || [], [modelsData]);

  // Filter tools for each category
  const categorizedTools = useMemo(() => {
    return CATEGORIES.map(category => {
      const tools = allModels.filter(tool =>
        category.filters.some(filter =>
          tool.category?.toLowerCase().includes(filter.toLowerCase())
        )
      ).slice(0, 5);

      return {
        ...category,
        tools
      };
    });
  }, [allModels]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 mb-24">
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 mb-24">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-2">Know more AI tools</h2>
        <p className="text-muted-foreground text-sm">Explore AI tools by category and find exactly what you need</p>
      </div>

      <div className="space-y-12">
        {categorizedTools.map((category) => (
          <div key={category.title}>
            {category.tools.length > 0 ? (
              <HorizontalCarousel
                title={category.title}
              >
                {category.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </HorizontalCarousel>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};
