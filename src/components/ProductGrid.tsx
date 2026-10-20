import React, { useMemo } from 'react';
import { Product, Category, CategoryId } from '../types/product';
import { ProductCard } from './ProductCard';
import { Coffee, RotateCcw, Heart, Eye, Sparkles, Filter, ChevronRight, ArrowRight, Utensils, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotFoodVapourEffect, isHotFoodItem } from './HotFoodVapourEffect';

export type CatalogViewMode = 'cards' | 'compact' | 'dashed';

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  selectedCategory?: CategoryId;
  onSelectCategory?: (category: CategoryId) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOrderProduct?: (product: Product) => void;
  onResetFilters: () => void;
  viewMode?: CatalogViewMode;
  getItemQuantity?: (productId: string) => number;
  onAddToCart?: (product: Product) => void;
  onUpdateCartQuantity?: (productId: string, quantity: number) => void;
}

const CATEGORY_META: Record<string, { emoji: string; badge: string }> = {
  'hot-coffee': { emoji: '☕', badge: 'Artisanal Roasts' },
  'cold-coffee': { emoji: '🥤', badge: 'Chilled Brews' },
  'hot-chocolate-tea': { emoji: '🫖', badge: 'Warm Comforts' },
  'juices-mocktails': { emoji: '🍹', badge: 'Fresh & Fizzy' },
  'thickshakes': { emoji: '🧋', badge: 'Rich Blends' },
  'burgers': { emoji: '🍔', badge: 'Brioche Gourmet' },
  'sandwiches': { emoji: '🥪', badge: 'Triple Decker' },
  'wraps': { emoji: '🌯', badge: 'Tandoori Rolls' },
  'veg-appetizers': { emoji: '🍟', badge: 'Crispy Veg' },
  'non-veg-appetizers': { emoji: '🍗', badge: 'Crispy Chicken' },
  'pizza': { emoji: '🍕', badge: 'Stone Baked' },
  'pasta': { emoji: '🍝', badge: 'Italian Bowls' },
  'fried-rice-bowls': { emoji: '🍚', badge: 'Wok Bowls' },
  'soup-salads': { emoji: '🥣', badge: 'Fresh & Light' },
  'waffles-pancakes': { emoji: '🧇', badge: 'Belgian Golden' },
  'kunafa-desserts': { emoji: '🍰', badge: 'Signature Treats' },
  'add-ons': { emoji: '➕', badge: 'Custom Extras' },
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onOrderProduct,
  onResetFilters,
  viewMode = 'cards',
  getItemQuantity,
  onAddToCart,
  onUpdateCartQuantity,
}) => {
  // Group products by category when viewing all categories or multi-category searches
  const categoryGroups = useMemo(() => {
    const groups: { category: Category; items: Product[] }[] = [];

    if (categories && categories.length > 0) {
      for (const cat of categories) {
        if (cat.id === 'all') continue;
        const matching = products.filter((p) => p.category === cat.id);
        if (matching.length > 0) {
          groups.push({ category: cat, items: matching });
        }
      }
    } else {
      // Fallback: group dynamically from products if categories list is empty
      const catMap = new Map<string, Product[]>();
      for (const p of products) {
        if (!catMap.has(p.category)) catMap.set(p.category, []);
        catMap.get(p.category)!.push(p);
      }
      for (const [catId, items] of catMap.entries()) {
        groups.push({
          category: {
            id: catId as CategoryId,
            name: catId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            shortName: catId,
            iconName: 'Utensils',
            description: 'Freshly prepared specialty cafe dishes and beverages.',
          },
          items,
        });
      }
    }

    return groups;
  }, [categories, products]);

  // Current single active category when filtered
  const activeCategory = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => c.id === selectedCategory) || {
      id: selectedCategory,
      name: selectedCategory.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      shortName: selectedCategory,
      iconName: 'Utensils',
      description: 'Artisanal dishes freshly prepared upon order.',
    };
  }, [categories, selectedCategory]);

  // Empty state when no items match filters or search
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4 rounded-3xl bg-white/90 border border-amber-900/15 shadow-md max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300/60 mx-auto flex items-center justify-center text-[#802B12] mb-4">
          <Coffee className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#2B1B16] mb-2">
          No Menu Items Found
        </h3>
        <p className="text-sm text-[#6A584D] mb-6 max-w-sm mx-auto">
          We couldn’t find any items matching your active filter. Try selecting another category or clear your search.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full terracotta-btn text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </motion.div>
    );
  }

  // Sub-renderer for Interactive Cards view
  const renderCards = (items: Product[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
      <AnimatePresence mode="popLayout">
        {items.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard
              product={product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectProduct={onSelectProduct}
              onOrderProduct={onOrderProduct}
              cartQuantity={getItemQuantity ? getItemQuantity(product.id) : 0}
              onAddToCart={onAddToCart}
              onUpdateCartQuantity={onUpdateCartQuantity}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );

  // Sub-renderer for Compact 3-Column Quick Grid
  const renderCompact = (items: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      <AnimatePresence mode="popLayout">
        {items.map((product) => {
          const isFav = isFavorite(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 rounded-2xl bg-white border border-terracotta/15 hover:border-terracotta/40 hover:shadow-md transition-all group flex items-center gap-3 h-full"
            >
              {/* Thumbnail */}
              <div
                onClick={() => onSelectProduct(product)}
                className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-parchment-100 relative cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Hot Food Vapour and Fog Animation */}
                {product.inStock !== false && isHotFoodItem(product.category, product.name) && (
                  <HotFoodVapourEffect intensity="subtle" />
                )}

                <div className="absolute top-1 left-1 z-20">
                  <span
                    className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center bg-white/95 shadow-xs ${
                      product.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    />
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider block">
                    {product.category.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <h4
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-espresso-950 text-sm group-hover:text-terracotta transition-colors truncate cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    {product.inStock === false && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-red-600 text-white shrink-0">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-coffee-600 line-clamp-1 mb-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="font-display font-bold text-terracotta text-lg leading-none">
                    ₹{product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(product.id)}
                      className="p-1 rounded-full text-espresso-400 hover:text-red-500 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-espresso-400'
                        }`}
                      />
                    </button>

                    {product.inStock !== false && (
                      (() => {
                        const qty = getItemQuantity ? getItemQuantity(product.id) : 0;
                        return qty > 0 ? (
                          <div className="flex items-center bg-emerald-50 border border-emerald-600/30 rounded-lg px-1 py-0.5">
                            <button
                              onClick={() => onUpdateCartQuantity && onUpdateCartQuantity(product.id, qty - 1)}
                              className="w-4 h-4 flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 rounded"
                              title="Decrease"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[10px] font-bold text-emerald-950 px-1">{qty}</span>
                            <button
                              onClick={() => onAddToCart && onAddToCart(product)}
                              className="w-4 h-4 flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 rounded"
                              title="Increase"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart && onAddToCart(product)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-600/30 font-bold text-[10px] transition-all"
                            title="Add dish to cart"
                          >
                            + Add
                          </button>
                        );
                      })()
                    )}

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-2.5 py-1 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white font-bold text-[10px] shadow-xs transition-all active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  // Sub-renderer for 3-Dashed Menu Board View
  const renderDashed = (items: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
      <AnimatePresence mode="popLayout">
        {items.map((product) => {
          const isFav = isFavorite(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-terracotta/15 hover:border-terracotta/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              {/* Dish Name, Dashed Leader Line & Price */}
              <div className="flex items-baseline justify-between w-full gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                      product.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}
                    title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    />
                  </span>

                  <span
                    onClick={() => onSelectProduct(product)}
                    className="font-serif font-bold text-espresso-950 text-sm sm:text-base group-hover:text-terracotta transition-colors truncate cursor-pointer"
                  >
                    {product.name}
                  </span>

                  {product.inStock === false ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white shrink-0">
                      Out of Stock
                    </span>
                  ) : product.badge ? (
                    <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-bold shrink-0">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <div className="flex-1 mx-2 sm:mx-3 border-b-2 border-dashed border-terracotta/35 relative -top-1" />

                <div className="font-display font-bold text-terracotta text-lg shrink-0">
                  ₹{product.price}
                </div>
              </div>

              {/* Subtitle / Description & Quick Actions */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-terracotta/10 text-xs text-coffee-600">
                <p className="line-clamp-1 flex-1 pr-2 text-[11px]">
                  {product.description}
                </p>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="p-1 rounded-full text-espresso-400 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-espresso-400'
                      }`}
                    />
                  </button>

                  {product.inStock !== false && (
                    (() => {
                      const qty = getItemQuantity ? getItemQuantity(product.id) : 0;
                      return qty > 0 ? (
                        <div className="flex items-center bg-emerald-50 border border-emerald-600/30 rounded-lg px-1 py-0.5">
                          <button
                            onClick={() => onUpdateCartQuantity && onUpdateCartQuantity(product.id, qty - 1)}
                            className="w-4 h-4 flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 rounded"
                            title="Decrease"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[10px] font-bold text-emerald-950 px-1">{qty}</span>
                          <button
                            onClick={() => onAddToCart && onAddToCart(product)}
                            className="w-4 h-4 flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 rounded"
                            title="Increase"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart && onAddToCart(product)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-600/30 font-bold text-[10px] transition-all"
                          title="Add dish to cart"
                        >
                          + Add
                        </button>
                      );
                    })()
                  )}

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-2.5 py-1 rounded-lg bg-[#EDE0CC] hover:bg-terracotta hover:text-white border border-terracotta/25 font-bold text-[10px] text-espresso-900 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  // Helper to render items in the currently chosen viewMode
  const renderItemGrid = (items: Product[]) => {
    if (viewMode === 'dashed') return renderDashed(items);
    if (viewMode === 'compact') return renderCompact(items);
    return renderCards(items);
  };

  // =========================================================================
  // SCENARIO 1: A SPECIFIC CATEGORY IS FILTERED
  // Renders the single category aligned with a grand Category Spotlight Banner
  // =========================================================================
  if (selectedCategory !== 'all' && activeCategory) {
    const meta = CATEGORY_META[activeCategory.id] || { emoji: '🍽️', badge: 'Specialty Dish' };

    return (
      <div className="space-y-8">
        {/* Category Spotlight Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-terracotta/25 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-terracotta/10 via-amber-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start sm:items-center gap-4 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EDE0CC] border-2 border-terracotta/25 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
              {meta.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-0.5 rounded-full bg-terracotta text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  {meta.badge}
                </span>
                <span className="text-xs font-bold text-coffee-600">
                  • Filtered Category View
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso-950">
                {activeCategory.name}
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 mt-1 max-w-xl leading-relaxed">
                {activeCategory.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0 self-start md:self-center">
            <span className="px-3.5 py-2 rounded-xl bg-amber-100/90 text-terracotta text-xs font-bold border border-amber-300/50 shadow-xs">
              {products.length} {products.length === 1 ? 'Handcrafted Item' : 'Handcrafted Items'}
            </span>
            {onSelectCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="px-4 py-2 rounded-xl bg-[#EDE0CC] hover:bg-terracotta hover:text-white text-espresso-950 text-xs font-bold border border-terracotta/25 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>View All Categories</span>
                <span>✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Aligned Food Items Grid for this Category */}
        <div>{renderItemGrid(products)}</div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 2: ALL CATEGORIES VIEW (DEFAULT)
  // Aligns all food items strictly CATEGORY BY CATEGORY in clean, separate blocks
  // =========================================================================
  return (
    <div className="space-y-16">
      {categoryGroups.map((group) => {
        const meta = CATEGORY_META[group.category.id] || { emoji: '🍽️', badge: 'Specialty Dish' };

        return (
          <div
            key={group.category.id}
            id={`category-${group.category.id}`}
            className="space-y-6 scroll-mt-28"
          >
            {/* Category Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b-2 border-terracotta/25">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-terracotta/25 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  {meta.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950">
                      {group.category.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-terracotta text-white text-[11px] font-bold shadow-xs">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-coffee-700 mt-0.5">
                    {group.category.description}
                  </p>
                </div>
              </div>

              {onSelectCategory && (
                <button
                  type="button"
                  onClick={() => onSelectCategory(group.category.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-terracotta hover:text-white text-terracotta border border-terracotta/25 text-xs font-bold transition-all shadow-xs self-start sm:self-auto shrink-0"
                >
                  <span>Filter only {group.category.shortName || group.category.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Food Items Aligned Grid for this Category */}
            <div>{renderItemGrid(group.items)}</div>
          </div>
        );
      })}
    </div>
  );
};
