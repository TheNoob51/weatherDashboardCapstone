import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Globe } from 'lucide-react';
import { locationService, type SearchLocation } from '../services/locationService';
import { toast } from 'sonner';

interface LocationSearchProps {
  onLocationSelect: (location: SearchLocation) => void;
  currentLocation?: SearchLocation | null;
  placeholder?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation,
  placeholder = "Search for cities, towns, or places...",
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopular, setShowPopular] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowPopular(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await locationService.searchLocations(query, 8);
          setSuggestions(results);
          setShowPopular(false);
        } catch (error) {
          console.error('Search failed:', error);
          toast.error('Failed to search locations. Please try again.');
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else if (query.trim().length === 0) {
      setSuggestions([]);
      setLoading(false);
      setShowPopular(true);
    } else {
      setSuggestions([]);
      setLoading(false);
      setShowPopular(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleLocationSelect = (location: SearchLocation) => {
    setQuery('');
    setIsOpen(false);
    setShowPopular(false);
    setSuggestions([]);
    onLocationSelect(location);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (query.trim().length === 0) {
      setShowPopular(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setShowPopular(false);
    inputRef.current?.focus();
  };

  const popularCities = locationService.getPopularCities();
  const displaySuggestions = showPopular ? popularCities : suggestions;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          <Search className="w-4 h-4" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 text-white/60 animate-spin" />}
          {query && !loading && (
            <button
              onClick={clearSearch}
              className="text-white/60 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Current Location Display */}
      {currentLocation && !isOpen && (
        <div className="mt-2 text-sm text-white/70 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>Current: {currentLocation.displayName}</span>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && (displaySuggestions.length > 0 || showPopular) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50">
          {showPopular && (
            <div className="px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Globe className="w-3 h-3" />
                <span>Popular Cities</span>
              </div>
            </div>
          )}
          
          <div className="max-h-64 overflow-y-auto">
            {displaySuggestions.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-start gap-3 group"
              >
                <MapPin className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-white group-hover:text-blue-100 transition-colors">
                    {location.name}
                  </div>
                  <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {location.state && `${location.state}, `}{location.country}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!showPopular && displaySuggestions.length === 0 && !loading && query.length >= 2 && (
            <div className="px-4 py-6 text-center text-white/60">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>No locations found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for a city, town, or landmark</p>
            </div>
          )}

          {loading && (
            <div className="px-4 py-6 text-center text-white/60">
              <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
              <p>Searching locations...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;