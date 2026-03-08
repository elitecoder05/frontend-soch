import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { modelsAPI, SearchSuggestion } from "@/api/api-methods";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search AI models, tools, agents…",
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced fetch for search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await modelsAPI.getSearchSuggestions(query, 8);
      setSuggestions(response.data.suggestions);
      setShowDropdown(response.data.suggestions.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, fetchSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange('');
    setShowDropdown(false);
    setSuggestions([]);
    navigate(`/model/${suggestion.slug}`);
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin z-10" />
      )}
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
        className="pl-10 bg-card border-border focus-visible:ring-primary h-11"
      />
      
      {/* Search Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border last:border-b-0 ${
                index === highlightedIndex 
                  ? 'bg-primary/10' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {/* Model Icon */}
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
                {suggestion.iconUrl ? (
                  <img
                    src={suggestion.iconUrl}
                    alt={suggestion.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {suggestion.name.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Model Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">
                    {suggestion.name}
                  </span>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {suggestion.category}
                  </Badge>
                  {suggestion.pricing === "free" && (
                    <Badge variant="outline" className="text-xs border-green-500/50 text-green-400 shrink-0">
                      Free
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {suggestion.shortDescription}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  by {suggestion.provider}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
