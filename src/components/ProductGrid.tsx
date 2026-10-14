import React from 'react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { Coffee, RotateCcw, Heart, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CatalogViewMode = 'cards' | 'compact' | 'dashed';

interface ProductGridProps {
  products: Product[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onResetFilters: () => void;
  viewMode?: CatalogViewMode;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onResetFilters,
  viewMode = 'cards',
}) => {
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
          We couldn’t find any items matching your active search or filter selection. Try adjusting your search query or clear filters.
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

  // OPTION 3: 3-DASHED MENU BOARD VIEW (Traditional Restaurant Style with Dashed Leaders)
  if (viewMode === 'dashed') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {products.map((product) => {
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
                    {/* Veg / Non-Veg Indicator */}
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

                    {product.badge && (
                      <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-bold shrink-0">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* 3-DASHED LEADER LINE */}
                  <div className="flex-1 mx-2 sm:mx-3 border-b-2 border-dashed border-terracotta/35 relative -top-1" />

                  {/* Price */}
                  <span className="font-display font-bold text-terracotta text-lg sm:text-xl whitespace-nowrap shrink-0">
                    ₹{product.price}
                  </span>
                </div>

                {/* Description & Action Buttons */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-900/10 text-xs text-coffee-700">
                  <p className="line-clamp-1 max-w-[220px] sm:max-w-xs text-coffee-600 font-light text-[11px] sm:text-xs">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => onToggleFavorite(product.id)}
                      className="p-1.5 rounded-full text-espresso-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-espresso-400'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] hover:bg-terracotta hover:text-white border border-terracotta/25 font-bold text-[10px] text-espresso-900 transition-colors flex items-center gap-1"
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
  }

  // OPTION 2: COMPACT 3-COLUMN QUICK GRID
  if (viewMode === 'compact') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {products.map((product) => {
            const isFav = isFavorite(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 rounded-2xl bg-white border border-terracotta/15 hover:border-terracotta/40 hover:shadow-md transition-all group flex items-center gap-3"
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
                  <div className="absolute top-1 left-1">
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
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider block">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h4
                    onClick={() => onSelectProduct(product)}
                    className="font-serif font-bold text-espresso-950 text-sm group-hover:text-terracotta transition-colors truncate cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-coffee-600 line-clamp-1 mb-1.5">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-terracotta text-lg">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(product.id)}
                        className="p-1 rounded-full text-espresso-400 hover:text-red-500"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-red-500 text-red-500' : 'text-espresso-400'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="px-2.5 py-1 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white font-bold text-[10px] shadow-xs"
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
  }

  // OPTION 1: INTERACTIVE CARDS VIEW (DEFAULT)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={onToggleFavorite}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
