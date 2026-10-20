import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  QrCode,
  Star,
  Camera,
  Coffee,
  Utensils,
  BookOpen,
  Home,
  Menu as MenuIcon,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CategoryId } from '../types/product';

interface FastAccessDockProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenQRCode: () => void;
  onOpenReviewModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FastAccessDock: React.FC<FastAccessDockProps> = ({
  selectedCategory,
  onSelectCategory,
  favoriteCount,
  onOpenFavorites,
  onOpenQRCode,
  onOpenReviewModal,
  searchQuery,
  onSearchChange,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fastOptions: { id: CategoryId; label: string; icon: string }[] = [
    { id: 'all', label: 'ALL ITEMS', icon: '🍽️' },
    { id: 'hot-coffee', label: 'HOT COFFEE', icon: '☕' },
    { id: 'cold-coffee', label: 'COLD BREWS', icon: '🥤' },
    { id: 'burgers', label: 'BURGER', icon: '🍔' },
    { id: 'sandwiches', label: 'SANDWICHES', icon: '🥪' },
    { id: 'wraps', label: 'ROLL & WRAPS', icon: '🌯' },
    { id: 'non-veg-appetizers', label: 'FRIED CHICKEN', icon: '🍗' },
    { id: 'pizza', label: 'PIZZA', icon: '🍕' },
    { id: 'pasta', label: 'PASTA', icon: '🍝' },
    { id: 'waffles-pancakes', label: 'WAFFLES', icon: '🧇' },
    { id: 'kunafa-desserts', label: 'KUNAFA & DESSERTS', icon: '🍰' },
    { id: 'thickshakes', label: 'THICKSHAKES', icon: '🧋' },
  ];

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* DESKTOP & TABLET STICKY FAST ACCESS BAR (Visible on scroll) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden md:block fixed top-20 left-0 right-0 z-40 px-4 pointer-events-none"
          >
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-xl border border-terracotta/25 rounded-full px-4 py-2.5 shadow-xl flex items-center justify-between gap-3">
                {/* Brand mini title with circular logo */}
                <div
                  onClick={scrollToTop}
                  className="flex items-center gap-2 cursor-pointer pr-3 border-r border-terracotta/20 shrink-0"
                >
                  <img
                    src="/logo.png"
                    alt="Coffee Land"
                    className="w-7 h-7 rounded-full object-cover border border-terracotta shadow-xs"
                  />
                  <span className="font-display tracking-wider text-base text-espresso-950 hidden lg:inline font-bold">
                    COFFEE LAND
                  </span>
                </div>

                {/* Fast Access Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5">
                  {fastOptions.slice(0, 7).map((opt) => {
                    const isActive = selectedCategory === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onSelectCategory(opt.id);
                          scrollToMenu();
                        }}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-terracotta text-white shadow-md scale-105'
                            : 'bg-[#EDE0CC] text-espresso-900 hover:text-terracotta hover:bg-[#E5D5BD] border border-terracotta/20'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Fast Action Tools: Search, Reviews, QR, Favorites */}
                <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-terracotta/20">
                  {/* Inline quick search */}
                  {showSearchInput ? (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search menu..."
                        className="w-36 lg:w-48 px-3 py-1 text-xs rounded-full bg-white border border-terracotta text-espresso-950 placeholder-espresso-400 focus:outline-none"
                      />
                      <button
                        onClick={() => setShowSearchInput(false)}
                        className="ml-1 text-xs text-espresso-700 hover:text-espresso-950"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowSearchInput(true);
                        scrollToMenu();
                      }}
                      className="p-2 rounded-full bg-[#EDE0CC] hover:bg-[#E5D5BD] text-espresso-800 hover:text-terracotta border border-terracotta/20 transition-colors shadow-xs"
                      title="Quick Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}

                  {/* Reviews CTA */}
                  <button
                    onClick={scrollToReviews}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/10 hover:bg-terracotta/20 text-terracotta border border-terracotta/30 text-xs font-bold transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Reviews</span>
                  </button>

                  {/* Favorites badge */}
                  <button
                    onClick={onOpenFavorites}
                    className="relative p-2 rounded-full bg-[#EDE0CC] hover:bg-[#E5D5BD] text-espresso-800 hover:text-red-500 border border-terracotta/20 transition-colors shadow-xs"
                    title="Saved Favorites"
                  >
                    <Heart className="w-4 h-4" />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE END-TO-END BOTTOM ACCESS BAR (Always visible on mobile devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#EDE0CC]/98 backdrop-blur-xl border-t border-terracotta/25 px-4 py-2 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 items-center justify-around gap-2 text-center">
          {/* 1. Home */}
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center justify-center py-1 text-espresso-800 hover:text-terracotta transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </button>

          {/* 2. Menu Catalog */}
          <button
            onClick={() => {
              scrollToMenu();
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              selectedCategory !== 'all' ? 'text-terracotta font-bold' : 'text-espresso-800 hover:text-terracotta'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Menu</span>
          </button>

          {/* 3. Center Upload & Review Button */}
          <button
            onClick={onOpenReviewModal}
            className="flex flex-col items-center justify-center -mt-4"
          >
            <div className="w-11 h-11 rounded-full bg-terracotta hover:bg-terracotta-600 text-white flex items-center justify-center shadow-lg border-2 border-[#EDE0CC] hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-terracotta mt-0.5">Review</span>
          </button>

          {/* 4. Favorites */}
          <button
            onClick={onOpenFavorites}
            className="relative flex flex-col items-center justify-center py-1 text-espresso-800 hover:text-red-500 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {favoriteCount > 0 && (
              <span className="absolute 0 top-0.5 right-6 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
            <span className="text-[10px] font-bold mt-0.5">Saved</span>
          </button>
        </div>
      </div>
    </>
  );
};
