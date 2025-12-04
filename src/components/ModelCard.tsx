import { Link, useLocation } from "react-router-dom";
import { ExternalLink, Share2 } from "lucide-react";
import { modelsAPI } from '@/api/api-methods';
import { AiModel } from "@/types/model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShareDialog } from "@/components/ui/share-dialog";
import { getModelUrl } from "@/lib/utils";

interface ModelCardProps {
  model: AiModel;
}

export const ModelCard = ({ model }: ModelCardProps) => {
  const location = useLocation();
  // If the user navigated here from another page that set a `from` in state, preserve it.
  const fromState = (location.state && (location.state as any).from) ? (location.state as any).from : `${location.pathname}${location.search}`;

  const recordClickIfNeeded = async () => {
    try {
      if (typeof window === 'undefined') return;
      const key = `model_clicked_${model.id}`;
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
      await modelsAPI.recordClick(model.id);
    } catch (err) {
      console.error('Error recording model click', err);
    }
  };

  return (
    <Card className="group overflow-hidden border-card-border bg-card hover:bg-card-hover hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardContent className="p-4">
        <Link to={`/model/${model.id}`} state={{ from: fromState }} className="block text-inherit" onClick={recordClickIfNeeded}>
          <div className="flex gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
              {model.iconUrl ? (
                // show logo image when available
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={model.iconUrl}
                  alt={model.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {model.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {model.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                by {model.provider}
              </p>
            </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {model.shortDescription}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary" className="text-xs">
              {model.category}
            </Badge>
            {model.pricing === "free" && (
              <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                Free
              </Badge>
            )}
            {model.pricing === "freemium" && (
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                Freemium
              </Badge>
            )}
            {model.isApiAvailable && (
              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                API
              </Badge>
            )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div />
            </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 items-center">
        <Link to={`/model/${model.id}`} state={{ from: fromState }} className="flex-1" onClick={recordClickIfNeeded}>
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
          >
            View Details
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </Link>

        <div>
          <ShareDialog url={getModelUrl(model.id)} title={model.name}>
            <Button variant="ghost" size="sm" aria-label={`Share ${model.name}`}>
              <Share2 className="w-4 h-4" />
            </Button>
          </ShareDialog>
        </div>
      </CardFooter>
    </Card>
  );
};
