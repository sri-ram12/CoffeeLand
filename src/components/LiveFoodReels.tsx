import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ExternalLink,
  MessageCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  X,
  Flame,
  Clock,
  Heart
} from 'lucide-react';
import { LiveFoodReel } from '../types/banner';

interface LiveFoodReelsProps {
  onOrderOnWhatsApp: (dishName: string, price: number, category: string) => void;
}

const FOOD_REELS: LiveFoodReel[] = [
  {
    id: 'reel-pizza',
    dishName: 'Neapolitan Margarita & Tandoori Pizza',
    category: 'Pizza',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU',
    thumbnailUrl: '/menu-assets/img_p1_23.png',
    price: 229,
    tag: '48-Hr Fermented Crust',
    description: 'Crisp hand-stretched dough topped with crushed plum Italian tomatoes, fresh mozzarella pearls, and charred to perfection.'
  },
  {
    id: 'reel-coffee',
    dishName: 'Artisanal Cappuccino & Latte Art',
    category: 'Coffee',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU',
    thumbnailUrl: '/menu-assets/img_p1_25.png',
    price: 99,
    tag: 'Single-Origin Arabica',
    description: 'Freshly extracted double espresso folded into velvety microfoam with signature swan & tulip latte art.'
  },
  {
    id: 'reel-burger',
    dishName: "Chef's Spl Gourmet Brioche Burger",
    category: 'Burger',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    price: 199,
    tag: 'Double Grilled Chicken',
    description: 'Sizzling hot patties stacked with crispy chicken bacon, melted gouda cheese, and smokey artisan BBQ glaze.'
  },
  {
    id: 'reel-mocktails',
    dishName: 'Blue Lagoon & Mojito Coolers',
    category: 'Mocktails',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU',
    thumbnailUrl: '/menu-assets/img_p1_10.png',
    price: 99,
    tag: 'Fizzy Citrus & Mint Zest',
    description: 'Chilled sparkling blue curacao cooler infused with crushed mint, lime wedges, and bubbly effervescence.'
  },
  {
    id: 'reel-fried-chicken',
    dishName: 'Crispy Golden Spiced Fried Chicken',
    category: 'Fried Chicken',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU',
    thumbnailUrl: '/menu-assets/img_p1_1.png',
    price: 219,
    tag: '12-Herb Secret Crunch',
    description: 'Crunchy golden coating with tender, juicy marinated chicken seasoned in authentic southern spices.'
  },
  {
    id: 'reel-kunafa',
    dishName: 'Royal Lotus Biscoff Cheesy Kunafa',
    category: 'Kunafa',
    pinterestUrl: 'https://pin.it/3KnMhR8IF',
    thumbnailUrl: '/menu-assets/img_p1_0.png',
    price: 249,
    tag: 'Stretchy Cheese & Speculoos',
    description: 'Crisp golden vermicelli pastry with warm stretchy sweet cheese, drenched in rich Lotus Biscoff butter.'
  }
];

export const LiveFoodReels: React.FC<LiveFoodReelsProps> = ({ onOrderOnWhatsApp }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedReel, setSelectedReel] = useState<LiveFoodReel | null>(null);

  const categories = ['All', 'Pizza', 'Coffee', 'Burger', 'Mocktails', 'Fried Chicken', 'Kunafa'];

  const filteredReels = activeFilter === 'All'
    ? FOOD_REELS
    : FOOD_REELS.filter((r) => r.category === activeFilter);

  return (
    <section id="live-reels" className="py-20 bg-[#FAF6EE] relative scroll-mt-12">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Pinterest Reel Showcase</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-3">
            Live Food Reels & Fresh Preparation
          </h2>

          <p className="text-sm sm:text-base text-coffee-800 leading-relaxed max-w-2xl mx-auto">
            Critically curated from our live kitchen and Pinterest showcases. Tap any reel to watch preparation, view the original pin, or order directly via WhatsApp!
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeFilter === cat
                    ? 'bg-terracotta text-white border-terracotta shadow-md scale-105'
                    : 'bg-white text-espresso-800 border-terracotta/20 hover:border-terracotta/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 FOOD REELS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReels.map((reel) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-terracotta/20 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Media Reel Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-espresso-950">
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.dishName}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/85 via-black/25 to-transparent pointer-events-none" />

                {/* Pinterest Reel Tag Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <a
                    href={reel.pinterestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-md transition-colors"
                    title="Watch original Pinterest video pin"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Pinterest Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Price Tag Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-terracotta text-white font-display font-bold text-sm shadow-md">
                    ₹{reel.price}
                  </span>
                </div>

                {/* Central Play Reel Trigger */}
                <button
                  type="button"
                  onClick={() => setSelectedReel(reel)}
                  className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                  aria-label={`Play ${reel.dishName} reel`}
                >
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover/play:bg-terracotta group-hover/play:text-white text-espresso-950 flex items-center justify-center shadow-2xl transform group-hover/play:scale-115 transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </button>

                {/* Bottom Media Title on image */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                    {reel.tag}
                  </span>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg mt-1 line-clamp-1">
                    {reel.dishName}
                  </h3>
                </div>
              </div>

              {/* Text Body & Actions */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-coffee-700 line-clamp-2 font-normal leading-relaxed mb-4">
                  {reel.description}
                </p>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-espresso-100">
                  <a
                    href={reel.pinterestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-parchment-200 text-espresso-900 border border-terracotta/30 text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>View Pin</span>
                    <ExternalLink className="w-3 h-3 text-red-600" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onOrderOnWhatsApp(reel.dishName, reel.price, reel.category)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-sm hover:scale-102"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
                    <span>Order (WA)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* POPUP FULLSCREEN REEL MODAL */}
      <AnimatePresence>
        {selectedReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReel(null)}
              className="fixed inset-0 bg-[#2B1B16]/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#FAF6EE] border border-amber-900/15 rounded-3xl p-5 sm:p-6 shadow-2xl text-espresso-950 z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReel(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-espresso-900 hover:bg-amber-100 border border-amber-900/10 shadow transition-colors z-20"
                aria-label="Close reel modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  {selectedReel.category} • Live Reel
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-950 mt-0.5">
                  {selectedReel.dishName}
                </h3>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-4 shadow-inner">
                <img
                  src={selectedReel.thumbnailUrl}
                  alt={selectedReel.dishName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <p className="text-white text-xs sm:text-sm font-semibold max-w-xs">
                    Watch the full HD preparation video on Pinterest
                  </p>
                  <a
                    href={selectedReel.pinterestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-4 py-2 rounded-full bg-white text-red-600 font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:bg-amber-50"
                  >
                    <span>Open in Pinterest</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Description & Price */}
              <p className="text-xs sm:text-sm text-coffee-800 leading-relaxed mb-4">
                {selectedReel.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-900/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-coffee-600 uppercase font-semibold">Specialty Price</span>
                  <span className="font-display font-bold text-2xl text-terracotta">
                    ₹{selectedReel.price}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReel(null)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-espresso-900 text-xs font-semibold border border-amber-900/15"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      onOrderOnWhatsApp(selectedReel.dishName, selectedReel.price, selectedReel.category);
                      setSelectedReel(null);
                    }}
                    className="px-5 py-2 rounded-xl terracotta-btn text-white text-xs font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
