import React from 'react';
import { Category, CategoryId, SortOption } from '../types/product';
import { Search, Heart, Sparkles, SlidersHorizontal, Check, X, Filter, LayoutGrid, Grid3x3 } from 'lucide-react';
import { CatalogViewMode } from './ProductGrid';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoriteCount: number;
  totalFilteredCount: number;
  viewMode?: CatalogViewMode;
  onViewModeChange?: (mode: CatalogViewMode) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  vegOnly,
  onToggleVegOnly,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoriteCount,
  totalFilteredCount,
  viewMode = 'cards',
  onViewModeChange,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Top Controls: Search, Sort, and Quick Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-terracotta">
            <Search className="w-4 h-4 text-terracotta" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cappuccino, waffles, pizza..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-terracotta/25 text-espresso-950 placeholder-espresso-400 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-espresso-600 hover:text-espresso-950"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Veg Only Toggle */}
          <button
            onClick={onToggleVegOnly}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                : 'bg-white border-terracotta/20 text-espresso-800 hover:border-terracotta/40 shadow-xs'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center bg-white">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </span>
            <span>Veg Only</span>
            {vegOnly && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
          </button>

          {/* Favorites Only Toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
              favoritesOnly
                ? 'bg-terracotta text-white border-terracotta shadow-xs'
                : 'bg-white border-terracotta/20 text-espresso-800 hover:border-terracotta/40 shadow-xs'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                favoritesOnly ? 'fill-white text-white' : 'text-terracotta'
              }`}
            />
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                favoritesOnly ? 'bg-white text-terracotta' : 'bg-red-600 text-white'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terracotta">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-9 pr-8 py-2 rounded-full bg-white border border-terracotta/25 text-espresso-950 text-xs font-medium focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta cursor-pointer transition-all shadow-xs"
            >
              <option value="featured" className="bg-white text-espresso-950">
                Sort: Featured & Specials
              </option>
              <option value="price-asc" className="bg-white text-espresso-950">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-white text-espresso-950">
                Price: High to Low
              </option>
              <option value="name-asc" className="bg-white text-espresso-950">
                Name: A to Z
              </option>
              <option value="name-desc" className="bg-white text-espresso-950">
                Name: Z to A
              </option>
            </select>
          </div>

          {/* View Mode Toggle: Interactive Cards (Default) | Compact | 3-Dashed Option */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-terracotta/25 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange?.('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-terracotta text-white shadow-xs'
                  : 'text-espresso-700 hover:text-terracotta'
              }`}
              title="Interactive Cards View (Default)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards (Default)</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange?.('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'compact'
                  ? 'bg-terracotta text-white shadow-xs'
                  : 'text-espresso-700 hover:text-terracotta'
              }`}
              title="Compact 3-Column Grid"
            >
              <Grid3x3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compact</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange?.('dashed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'dashed'
                  ? 'bg-terracotta text-white shadow-xs'
                  : 'text-espresso-700 hover:text-terracotta'
              }`}
              title="3-Dashed Menu Board View"
            >
              <span className="font-mono font-black text-sm leading-none">≡</span>
              <span className="hidden sm:inline">3-Dashed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Horizontal Scrollable with Smooth Scroll) */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 border ${
                  isActive
                    ? 'bg-terracotta text-white font-bold border-transparent shadow-md scale-[1.03]'
                    : 'bg-white border-terracotta/20 text-espresso-800 hover:border-terracotta/50 hover:bg-[#FAF6EE] shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-coffee-800 px-1 pt-1 font-medium">
        <span>
          Showing <strong className="text-terracotta font-bold">{totalFilteredCount}</strong> handcrafted items
        </span>
        {(searchQuery || vegOnly || favoritesOnly || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              if (vegOnly) onToggleVegOnly();
              if (favoritesOnly) onToggleFavoritesOnly();
            }}
            className="text-terracotta hover:underline text-xs flex items-center gap-1 font-bold"
          >
            <Filter className="w-3 h-3" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
