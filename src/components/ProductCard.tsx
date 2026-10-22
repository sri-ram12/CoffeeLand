import React from 'react';
import { Product } from '../types/product';
import { Heart, Sparkles, Eye, Clock, Flame, MessageCircle, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { HotFoodVapourEffect, isHotFoodItem } from './HotFoodVapourEffect';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOrderProduct?: (product: Product) => void;
  cartQuantity?: number;
  onAddToCart?: (product: Product) => void;
  onUpdateCartQuantity?: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onOrderProduct,
  cartQuantity = 0,
  onAddToCart,
  onUpdateCartQuantity,
}) => {
  const isHot = isHotFoodItem(product.category, product.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onClick={() => onSelectProduct(product)}
      className="group relative rounded-2xl bg-white overflow-hidden flex flex-col justify-between border border-terracotta/20 hover:border-terracotta/50 shadow-sm hover:shadow-md transition-all duration-300 h-full cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDE0CC]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            product.inStock === false ? 'opacity-65 grayscale-[25%]' : ''
          }`}
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {product.inStock === false ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-red-600 text-white shadow-md border border-red-400/30 animate-pulse">
              Out of Stock
            </span>
          ) : product.badge ? (
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-xs ${
                product.badge === 'Bestseller'
                  ? 'bg-amber-600 text-white'
                  : product.badge === "Chef's Special"
                  ? 'bg-terracotta text-white'
                  : product.badge === 'New'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-coffee-700 text-white'
              }`}
            >
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Dietary Indicator (Veg / Non-veg) & Favorite on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {/* Veg / Non-Veg Indicator */}
          <div
            className={`w-5 h-5 rounded-md bg-white/95 backdrop-blur-sm border flex items-center justify-center shadow-xs ${
              product.isVeg ? 'border-emerald-600' : 'border-red-600'
            }`}
            title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-terracotta/20 flex items-center justify-center text-espresso-800 hover:text-red-500 hover:scale-110 active:scale-90 transition-all shadow-xs group/fav"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-espresso-700 group-hover/fav:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Quick prep info floating at bottom of image */}
        {product.prepTime && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{product.prepTime}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header & Price */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso-950 group-hover:text-terracotta transition-colors line-clamp-1 min-h-[1.75rem]">
              {product.name}
            </h3>
            <span className="font-serif text-lg sm:text-xl font-bold text-espresso-950 tracking-tight flex-shrink-0">
              ₹{product.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-coffee-700 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        {/* Card Footer: Portion Info & View Details Button */}
        <div className="pt-3 border-t border-terracotta/15 flex items-center justify-between gap-3 mt-auto">
          <span className="text-[11px] text-coffee-600 truncate font-medium">
            {product.portion || 'Artisanal Preparation'}
          </span>

          {product.inStock === false ? (
            <button
              onClick={() => onSelectProduct(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-200 text-zinc-600 text-xs font-bold tracking-wide transition-all duration-200 shadow-xs hover:bg-zinc-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Out of Stock</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {cartQuantity > 0 ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-emerald-50 border border-emerald-600/40 rounded-full px-1.5 py-0.5 shadow-2xs"
                >
                  <button
                    onClick={() => onUpdateCartQuantity && onUpdateCartQuantity(product.id, cartQuantity - 1)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 active:scale-95 transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-serif font-black text-xs px-1.5 text-emerald-950 min-w-[16px] text-center">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => onAddToCart && onAddToCart(product)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200/60 active:scale-95 transition-colors"
                    title="Add one more"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) onAddToCart(product);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-600/30 text-xs font-bold transition-all active:scale-95"
                  title="Add dish to cart"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Add</span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOrderProduct) {
                    onOrderProduct(product);
                  } else {
                    onSelectProduct(product);
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide transition-all duration-200 shadow-xs active:scale-95"
                title="Order this dish immediately via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Order</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
