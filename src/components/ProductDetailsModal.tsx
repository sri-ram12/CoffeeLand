import React, { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { X, Heart, Clock, Flame, Sparkles, ChefHat, Info, CheckCircle2, MessageCircle, AlertCircle, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotFoodVapourEffect, isHotFoodItem } from './HotFoodVapourEffect';
import { handleImageError } from '../utils/imageFallback';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOrderWhatsApp?: (product: Product, quantity?: number) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOrderWhatsApp,
  onAddToCart,
}) => {
  const [modalQty, setModalQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    setModalQty(1);
    setAddedToast(false);
  }, [product]);
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2B1B16]/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#EDE0CC] border border-amber-900/15 shadow-2xl z-10 text-[#2B1B16] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-amber-900/15 text-[#2B1B16] hover:text-[#802B12] hover:bg-amber-100 hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image */}
          <div className="w-full md:w-1/2 relative min-h-[260px] md:min-h-full bg-neutral-100 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => handleImageError(e, product.category)}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#EDE0CC]/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#EDE0CC]/70 pointer-events-none" />

            {/* Badges on Modal Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider terracotta-btn text-white shadow-md">
                  {product.badge}
                </span>
              )}
              <div
                className={`w-6 h-6 rounded-md bg-white/95 border flex items-center justify-center shadow ${
                  product.isVeg ? 'border-emerald-600' : 'border-red-600'
                }`}
                title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details & Ingredients */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Name */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#802B12] font-bold">
                  {product.category.replace('-', ' ')}
                </span>
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-900/15 text-xs text-[#2B1B16] hover:text-[#802B12] shadow-sm transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#802B12]'
                    }`}
                  />
                  <span className="font-medium">{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1B16] mb-3">
                {product.name}
              </h2>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-3xl font-bold text-[#802B12]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-[#6A584D] font-light">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#6A584D] leading-relaxed mb-6 font-normal">
                {product.longDescription || product.description}
              </p>

              {/* Highlights Matrix: Prep Time, Calories, Portion */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 p-3 rounded-2xl bg-white border border-amber-900/15 shadow-sm text-center">
                {product.prepTime && (
                  <div className="flex flex-col items-center justify-center p-1">
                    <Clock className="w-4 h-4 text-[#802B12] mb-1" />
                    <span className="text-[10px] uppercase text-[#6A584D] font-semibold">Prep Time</span>
                    <span className="text-xs font-bold text-[#2B1B16]">{product.prepTime}</span>
                  </div>
                )}
                {product.calories && (
                  <div className="flex flex-col items-center justify-center p-1 border-x border-amber-900/10">
                    <Flame className="w-4 h-4 text-[#802B12] mb-1" />
                    <span className="text-[10px] uppercase text-[#6A584D] font-semibold">Energy</span>
                    <span className="text-xs font-bold text-[#2B1B16]">{product.calories}</span>
                  </div>
                )}
                {product.portion && (
                  <div className="flex flex-col items-center justify-center p-1">
                    <ChefHat className="w-4 h-4 text-[#802B12] mb-1" />
                    <span className="text-[10px] uppercase text-[#6A584D] font-semibold">Portion</span>
                    <span className="text-xs font-bold text-[#2B1B16] truncate max-w-full">
                      {product.portion}
                    </span>
                  </div>
                )}
              </div>

              {/* Ingredients & Tasting Notes */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2B1B16] mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#802B12]" />
                    Ingredients & Flavors
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-900/15 text-[#2B1B16] text-xs font-medium shadow-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note on In-Store Ordering & WhatsApp Chat */}
            <div className="pt-4 border-t border-amber-900/10 space-y-3">
              {product.inStock === false ? (
                <div className="text-xs text-red-900 flex items-center gap-2 bg-red-100 border border-red-300 p-3 rounded-xl font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>This item is currently Out of Stock. Please try another delicious specialty!</span>
                </div>
              ) : (
                <div className="text-xs text-[#6A584D] flex items-start gap-2 bg-amber-50/80 border border-amber-200/60 p-3 rounded-xl">
                  <Info className="w-4 h-4 text-[#802B12] flex-shrink-0 mt-0.5" />
                  <p>
                    Available for dine-in & takeaway at our cafe on Temples Bypass Road, Thagarapuvalasa Vizag.
                  </p>
                </div>
              )}

              {product.inStock === false ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-300 text-zinc-500 font-bold text-sm cursor-not-allowed shadow-none"
                >
                  <span>Currently Unavailable (Out of Stock)</span>
                </button>
              ) : (
                <div className="space-y-2.5">
                  {/* Quantity Stepper & Add to Cart */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-amber-100/70 border border-amber-900/20 rounded-xl px-2 py-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-espresso-900 hover:bg-amber-200 active:scale-95 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-serif font-black text-sm px-2.5 min-w-[24px] text-center text-espresso-950">
                        {modalQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalQty((q) => q + 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-espresso-900 hover:bg-amber-200 active:scale-95 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(product, modalQty);
                          setAddedToast(true);
                          setTimeout(() => setAddedToast(false), 2000);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all shadow-xs active:scale-[0.98] ${
                          addedToast
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white hover:bg-amber-50 text-emerald-800 border-emerald-600/40'
                        }`}
                      >
                        {addedToast ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-emerald-700" />
                            <span>Add to Cart (₹{product.price * modalQty})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {onOrderWhatsApp && (
                    <button
                      onClick={() => onOrderWhatsApp(product, modalQty)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Direct WhatsApp Pass • {product.name} (₹{product.price * modalQty})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
