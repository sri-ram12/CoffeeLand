import React from 'react';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartBarProps {
  totalCount: number;
  totalPrice: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalCount,
  totalPrice,
  onOpenCart,
}) => {
  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-16 sm:bottom-6 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-lg pointer-events-auto"
        >
          <div
            onClick={onOpenCart}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenCart();
            }}
            className="cursor-pointer bg-gradient-to-r from-[#21120B] via-[#2D180F] to-[#21120B] text-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-terracotta/40 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-xl hover:border-terracotta transition-all group"
          >
            {/* Left: Cart Icon with Pulse & Count */}
            <div className="flex items-center gap-2.5 sm:gap-3 pl-1.5 sm:pl-2 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 leading-tight truncate">
                  <span>{totalCount} {totalCount === 1 ? 'item' : 'items'} selected</span>
                </span>
                <span className="text-[11px] text-terracotta-200 font-medium truncate">
                  Total: <strong className="text-white font-serif font-black text-sm sm:text-base">₹{totalPrice}</strong>
                </span>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="flex items-center gap-1.5 bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full shadow-md transition-all active:scale-95 shrink-0">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span className="hidden xs:inline">View Order Pass</span>
              <span className="xs:hidden">Order Pass</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
