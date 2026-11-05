import React, { useRef } from 'react';
import { Category, CategoryId, SortOption } from '../types/product';
import { Search, Heart, SlidersHorizontal, Check, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { CatalogViewMode } from './ProductGrid';
import { handleImageError, getCategoryFallbackImage } from '../utils/imageFallback';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 240;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Top Controls: Search, Sort, and Quick Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
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
            className="w-full pl-10 pr-10 py-2 rounded-full bg-white border border-terracotta/25 text-espresso-950 placeholder-espresso-400 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-xs"
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
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Veg Only Toggle */}
          <button
            onClick={onToggleVegOnly}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
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
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
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
              className="appearance-none pl-9 pr-8 py-1.5 rounded-full bg-white border border-terracotta/25 text-espresso-950 text-xs font-medium focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta cursor-pointer transition-all shadow-xs"
            >
              <option value="featured" className="bg-white text-espresso-950">
                Sort: Featured
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
        </div>
      </div>

      {/* CIRCULAR FOOD CATEGORIES (Matching Reference Image) */}
      <div className="relative w-full max-w-full group">
        {/* Left Scroll Chevron */}
        <button
          type="button"
          onClick={() => scrollCategories('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-20 w-8 h-8 rounded-full bg-white text-espresso-900 border border-terracotta/30 shadow-md items-center justify-center hover:bg-terracotta hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Scroll Chevron */}
        <button
          type="button"
          onClick={() => scrollCategories('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-20 w-8 h-8 rounded-full bg-white text-espresso-900 border border-terracotta/30 shadow-md items-center justify-center hover:bg-terracotta hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Circular Category Items Scrollable Container */}
        <div
          ref={scrollContainerRef}
          style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-2 pt-2 scrollbar-none no-scrollbar select-none px-2"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const categoryImage = cat.image || getCategoryFallbackImage(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="flex-shrink-0 flex flex-col items-center group/cat focus:outline-none transition-transform duration-200 cursor-pointer"
                style={{ width: '74px' }}
              >
                {/* 1. Circular Food Dish Image */}
                <div
                  className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'ring-2 ring-terracotta ring-offset-2 ring-offset-[#FDF8F3] shadow-md scale-105'
                      : 'border border-terracotta/25 hover:border-terracotta/60 group-hover/cat:scale-105 shadow-xs'
                  }`}
                >
                  <img
                    src={categoryImage}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => handleImageError(e, cat.id)}
                    className="w-full h-full rounded-full object-cover transition-transform duration-300"
                  />
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-terracotta/10 pointer-events-none" />
                  )}
                </div>

                {/* 2. Category Name Below */}
                <span
                  className={`text-[11px] sm:text-xs text-center mt-1.5 leading-tight truncate w-full block transition-colors ${
                    isActive
                      ? 'font-bold text-terracotta'
                      : 'font-semibold text-espresso-900 group-hover/cat:text-terracotta'
                  }`}
                  title={cat.name}
                >
                  {cat.shortName || cat.name}
                </span>

                {/* 3. Red/Terracotta Active Indicator Line (Matching reference pic under All) */}
                <div
                  className={`h-0.5 sm:h-1 w-6 sm:w-8 rounded-full mt-1 transition-all duration-200 ${
                    isActive ? 'bg-terracotta' : 'bg-transparent'
                  }`}
                />
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
