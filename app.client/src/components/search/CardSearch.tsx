import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// Types
interface Card {
  id: number;
  name: string;
  manaCost: string;
  convertedManaCost: number;
  type: string;
  text?: string;
  power?: number;
  toughness?: number;
  set: string;
  setName: string;
  rarity: string;
  imageUrl?: string;
  colors?: string[];
  colorIdentity?: string[];
  keywords?: string[];
  artist?: string;
  price?: number;
}

interface SearchResponse {
  cards: Card[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTimeMs: number;
}

interface SearchFilters {
  query: string;
  colors: string[];
  type: string;
  set: string;
  rarity: string;
  cmcMin: number | null;
  cmcMax: number | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

// Main Search Component
export const CardSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    colors: [],
    type: '',
    set: '',
    rarity: '',
    cmcMin: null,
    cmcMax: null,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters, page: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchFilters.query) params.append('query', searchFilters.query);
        if (searchFilters.type) params.append('type', searchFilters.type);
        if (searchFilters.set) params.append('set', searchFilters.set);
        if (searchFilters.rarity) params.append('rarity', searchFilters.rarity);
        if (searchFilters.cmcMin !== null) params.append('convertedManaCostMin', searchFilters.cmcMin.toString());
        if (searchFilters.cmcMax !== null) params.append('convertedManaCostMax', searchFilters.cmcMax.toString());
        if (searchFilters.colors.length > 0) {
          searchFilters.colors.forEach(color => params.append('colors', color));
        }
        params.append('page', page.toString());
        params.append('pageSize', '20');
        params.append('sortBy', searchFilters.sortBy);
        params.append('sortDirection', searchFilters.sortDirection);

        const response = await fetch(`/api/cards/search?${params}`);
        if (response.ok) {
          const data: SearchResponse = await response.json();
          setResults(data);
        } else {
          console.error('Search failed:', response.statusText);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Trigger search when filters or page change
  useEffect(() => {
    debouncedSearch(filters, currentPage);
  }, [filters, currentPage, debouncedSearch]);

  // Update filter
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Toggle color filter
  const toggleColor = useCallback((color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
    setCurrentPage(1);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Card Search</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search through thousands of Magic: The Gathering cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
              "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
              showFilters && "bg-blue-100 dark:bg-blue-900"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for cards..."
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700",
            "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200 text-lg"
          )}
        />
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4"
          >
            <AdvancedFilters
              filters={filters}
              updateFilter={updateFilter}
              toggleColor={toggleColor}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="space-y-4">
        {/* Results Header */}
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
          >
            <span>
              {results.totalCount.toLocaleString()} cards found in {results.searchTimeMs}ms
            </span>
            <SortControls filters={filters} updateFilter={updateFilter} />
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </motion.div>
        )}

        {/* Cards Grid/List */}
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardResults cards={results.cards} viewMode={viewMode} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={results.totalPages}
              onPageChange={setCurrentPage}
              hasNextPage={results.hasNextPage}
              hasPreviousPage={results.hasPreviousPage}
            />
          </motion.div>
        )}

        {/* Empty State */}
        {results && results.cards.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No cards found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Advanced Filters Component
const AdvancedFilters: React.FC<{
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  toggleColor: (color: string) => void;
}> = ({ filters, updateFilter, toggleColor }) => {
  const colors = [
    { symbol: 'W', name: 'White', color: 'bg-yellow-50 border-yellow-300' },
    { symbol: 'U', name: 'Blue', color: 'bg-blue-50 border-blue-300' },
    { symbol: 'B', name: 'Black', color: 'bg-gray-50 border-gray-900' },
    { symbol: 'R', name: 'Red', color: 'bg-red-50 border-red-300' },
    { symbol: 'G', name: 'Green', color: 'bg-green-50 border-green-300' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Color Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Colors
        </label>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.symbol}
              onClick={() => toggleColor(color.symbol)}
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm",
                "transition-all duration-200 hover:scale-110",
                color.color,
                filters.colors.includes(color.symbol)
                  ? "ring-2 ring-blue-500 scale-110"
                  : "hover:ring-1 hover:ring-gray-300"
              )}
              title={color.name}
            >
              {color.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type
        </label>
        <input
          type="text"
          placeholder="e.g., Creature, Instant"
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
      </div>

      {/* CMC Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mana Cost
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.cmcMin || ''}
            onChange={(e) => updateFilter('cmcMin', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.cmcMax || ''}
            onChange={(e) => updateFilter('cmcMax', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

// Sort Controls Component
const SortControls: React.FC<{
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
}> = ({ filters, updateFilter }) => {
  return (
    <div className="flex items-center gap-2">
      <span>Sort by:</span>
      <select
        value={filters.sortBy}
        onChange={(e) => updateFilter('sortBy', e.target.value)}
        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
      >
        <option value="name">Name</option>
        <option value="cmc">Mana Cost</option>
        <option value="set">Set</option>
        <option value="rarity">Rarity</option>
        <option value="price">Price</option>
      </select>
      <button
        onClick={() => updateFilter('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')}
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {filters.sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

// Card Results Component
const CardResults: React.FC<{ cards: Card[]; viewMode: 'grid' | 'list' }> = ({ cards, viewMode }) => {
  return (
    <div className={cn(
      "gap-4",
      viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-2"
    )}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CardItem card={card} viewMode={viewMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Card Item Component
const CardItem: React.FC<{ card: Card; viewMode: 'grid' | 'list' }> = ({ card, viewMode }) => {
  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden",
        "hover:shadow-lg dark:hover:shadow-xl transition-all duration-200",
        "hover:-translate-y-1"
      )}
      whileHover={{ scale: isGrid ? 1.02 : 1.01 }}
    >
      {isGrid ? (
        // Grid View
        <div className="p-4 space-y-3">
          <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{card.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.type}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{card.set}</p>
            {card.price && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ${card.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ) : (
        // List View
        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-24 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            ) : (
              <span className="text-gray-400 text-xs">No Image</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{card.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.type}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {card.set} • {card.rarity}
            </p>
            {card.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {card.text}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.manaCost}</p>
            {card.price && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ${card.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> = ({ currentPage, totalPages, onPageChange, hasNextPage, hasPreviousPage }) => {
  const getVisiblePages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={cn(
          "px-3 py-2 rounded-lg transition-all",
          hasPreviousPage
            ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-gray-50 text-gray-400 dark:bg-gray-900 cursor-not-allowed"
        )}
      >
        Previous
      </button>

      {getVisiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
          disabled={page === '...'}
          className={cn(
            "w-10 h-10 rounded-lg transition-all",
            page === currentPage
              ? "bg-blue-500 text-white"
              : page === '...'
              ? "cursor-default"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={cn(
          "px-3 py-2 rounded-lg transition-all",
          hasNextPage
            ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-gray-50 text-gray-400 dark:bg-gray-900 cursor-not-allowed"
        )}
      >
        Next
      </button>
    </div>
  );
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

export default CardSearch;