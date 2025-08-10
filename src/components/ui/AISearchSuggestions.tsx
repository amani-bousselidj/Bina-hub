// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Clock, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'trending' | 'recent' | 'popular' | 'ai';
  category?: string;
  searchCount?: number;
}

interface AISearchSuggestionsProps {
  onSuggestionSelect: (suggestion: string) => void;
  searchQuery: string;
  className?: string;
}

export default function AISearchSuggestions({ 
  onSuggestionSelect, 
  searchQuery, 
  className = '' 
}: AISearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Simulated AI suggestions (in production, this would call an AI API)
  const generateAISuggestions = useCallback(async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const aiSuggestions: SearchSuggestion[] = [];

    // Generate contextual suggestions based on query
    if (query.includes('طوب') || query.includes('brick')) {
      aiSuggestions.push(
        { id: '1', text: 'طوب أحمر عالي الجودة', type: 'ai', category: 'مواد البناء' },
        { id: '2', text: 'طوب أبيض للواجهات', type: 'ai', category: 'مواد البناء' },
        { id: '3', text: 'طوب عازل للحرارة', type: 'ai', category: 'مواد البناء' }
      );
    }

    if (query.includes('أسمنت') || query.includes('cement')) {
      aiSuggestions.push(
        { id: '4', text: 'أسمنت بورتلاند عادي', type: 'ai', category: 'أسمنت' },
        { id: '5', text: 'أسمنت مقاوم للكبريتات', type: 'ai', category: 'أسمنت' },
        { id: '6', text: 'أسمنت سريع التجمد', type: 'ai', category: 'أسمنت' }
      );
    }

    if (query.includes('حديد') || query.includes('steel') || query.includes('iron')) {
      aiSuggestions.push(
        { id: '7', text: 'حديد تسليح قطر 12 مم', type: 'ai', category: 'حديد' },
        { id: '8', text: 'حديد تسليح قطر 16 مم', type: 'ai', category: 'حديد' },
        { id: '9', text: 'سلك حديد ربط', type: 'ai', category: 'حديد' }
      );
    }

    // Add general suggestions for any query
    if (query.length >= 2) {
      aiSuggestions.push(
        { id: '10', text: `${query} - عروض خاصة`, type: 'ai', category: 'عروض' },
        { id: '11', text: `${query} - أفضل الأسعار`, type: 'ai', category: 'أسعار' }
      );
    }

    return aiSuggestions;
  }, []);

  // Get trending searches from database
  const getTrendingSearches = useCallback(async (): Promise<SearchSuggestion[]> => {
    try {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('search_term, search_count')
        .order('search_count', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map((item, index) => ({
        id: `trending-${index}`,
        text: item.search_term,
        type: 'trending' as const,
        searchCount: item.search_count
      })) || [];
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      return [
        { id: 't1', text: 'مواد البناء', type: 'trending', searchCount: 1250 },
        { id: 't2', text: 'أدوات كهربائية', type: 'trending', searchCount: 890 },
        { id: 't3', text: 'دهانات', type: 'trending', searchCount: 675 },
        { id: 't4', text: 'سباكة', type: 'trending', searchCount: 445 },
        { id: 't5', text: 'إضاءة', type: 'trending', searchCount: 320 }
      ];
    }
  }, []);

  // Get recent searches from localStorage
  const getRecentSearches = useCallback((): SearchSuggestion[] => {
    try {
      const recent = localStorage.getItem('recentSearches');
      if (!recent) return [];

      const searches = JSON.parse(recent);
      return searches.slice(0, 3).map((search: string, index: number) => ({
        id: `recent-${index}`,
        text: search,
        type: 'recent' as const
      }));
    } catch (error) {
      return [];
    }
  }, []);

  // Load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      
      let allSuggestions: SearchSuggestion[] = [];

      if (searchQuery.trim()) {
        // Get AI suggestions for the current query
        const aiSuggestions = await generateAISuggestions(searchQuery);
        allSuggestions = [...aiSuggestions];
        setIsVisible(true);
      } else {
        // Show trending and recent when no query
        const [trending, recent] = await Promise.all([
          getTrendingSearches(),
          Promise.resolve(getRecentSearches())
        ]);
        
        allSuggestions = [...recent, ...trending];
        setIsVisible(false);
      }

      setSuggestions(allSuggestions);
      setLoading(false);
    };

    const debounceTimer = setTimeout(loadSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, generateAISuggestions, getTrendingSearches, getRecentSearches]);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchTerm: string) => {
    try {
      const recent = localStorage.getItem('recentSearches');
      let searches = recent ? JSON.parse(recent) : [];
      
      // Remove if already exists and add to beginning
      searches = searches.filter((s: string) => s !== searchTerm);
      searches.unshift(searchTerm);
      searches = searches.slice(0, 10); // Keep only 10 recent searches

      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }, []);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.text);
    onSuggestionSelect(suggestion.text);
    setIsVisible(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'popular':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'ai':
        return <Search className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  if (!suggestions.length) return null;

  return (
    <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${className}`}>
      {loading && (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          جاري البحث...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="py-2">
          {/* AI Suggestions */}
          {suggestions.filter(s => s.type === 'ai').length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                🤖 اقتراحات ذكية
              </div>
              {suggestions
                .filter(s => s.type === 'ai')
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-gray-900">{suggestion.text}</span>
                      {suggestion.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {suggestion.category}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
            </div>
          )}

          {/* Recent Searches */}
          {suggestions.filter(s => s.type === 'recent').length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                🕒 عمليات البحث الأخيرة
              </div>
              {suggestions
                .filter(s => s.type === 'recent')
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-gray-900">{suggestion.text}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
            </div>
          )}

          {/* Trending Searches */}
          {suggestions.filter(s => s.type === 'trending').length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                🔥 الأكثر بحثاً
              </div>
              {suggestions
                .filter(s => s.type === 'trending')
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-gray-900">{suggestion.text}</span>
                      {suggestion.searchCount && (
                        <span className="text-xs text-gray-500">
                          ({suggestion.searchCount.toLocaleString('en-US')} بحث)
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}




