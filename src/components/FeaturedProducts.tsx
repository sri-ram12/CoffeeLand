import React, { useState } from 'react';
import { Product } from '../types/product';
import { Sparkles, Coffee, Flame, Heart, ArrowRight, Eye, Star, Award, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { handleImageError } from '../utils/imageFallback';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: any) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

type TabKey = 'bestselling-coffee' | 'customer-favorites' | 'fresh-baked' | 'signature-drinks' | 'special-combos';

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onSelectCategory,
  onToggleFavorite,
  isFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('bestselling-coffee');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; subtitle: string }[] = [
    {
      key: 'bestselling-coffee',
      label: 'Bestselling Coffee',
      icon: <Coffee className="w-4 h-4" />,
      subtitle: 'Award-winning roasts pulled to perfection by our master baristas',
    },
    {
      key: 'customer-favorites',
      label: 'Customer Favorites',
      icon: <Star className="w-4 h-4" />,
      subtitle: 'Beloved cafe classics our guests return for time after time',
    },
    {
      key: 'fresh-baked',
      label: 'Freshly Baked Treats',
      icon: <Flame className="w-4 h-4" />,
      subtitle: 'Warm French viennoiserie and decadent cakes fresh from our ovens',
    },
    {
      key: 'signature-drinks',
      label: 'Signature Drinks',
      icon: <Sparkles className="w-4 h-4" />,
      subtitle: 'Artisanal cold brews, thickshakes, and botanical fruit infusions',
    },
    {
      key: 'special-combos',
      label: 'Special Combos',
      icon: <Layers className="w-4 h-4" />,
      subtitle: 'Curated meal pairings combining our finest brews and dishes with savings',
    },
  ];

  const currentTabInfo = tabs.find((t) => t.key === activeTab)!;
  const filteredFeatured = products.filter((p) => p.featuredCategory === activeTab);

  return (
    <section id="featured" className="py-10 sm:py-14 bg-[#F5ECE0] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-2.5">
            <Award className="w-3.5 h-3.5" />
            <span>Curated Selections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-2">
            Featured Highlights
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-coffee-800">
            Handcrafted beverages and delicacies celebrating our cafe heritage.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-terracotta/25 shadow-sm gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-terracotta text-white shadow-sm font-bold'
                      : 'text-espresso-800 hover:text-terracotta hover:bg-[#EDE0CC]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Subtitle */}
        <div className="text-center mb-10">
          <p className="text-sm font-serif italic text-coffee-700 max-w-xl mx-auto">
            {currentTabInfo.subtitle}
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatured.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-terracotta/20 hover:border-terracotta/50 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image & Badge Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE0CC]">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => handleImageError(e, item.category)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {item.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md bg-white/95 border flex items-center justify-center shadow-xs ${
                      item.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-terracotta/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-espresso-800 shadow-xs"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(item.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-espresso-700'
                      }`}
                    />
                  </button>
                </div>

                {/* Price tag in corner of image */}
                <div className="absolute bottom-3 right-4">
                  <span className="font-display text-2xl font-bold text-white drop-shadow">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-espresso-950 group-hover:text-terracotta transition-colors mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-coffee-700 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-terracotta/15 flex items-center justify-between">
                  <span className="text-xs text-coffee-600 font-medium">
                    {item.portion || 'Chef Curated'}
                  </span>
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Catalog Link */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-terracotta hover:bg-terracotta-600 text-white shadow-md text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
          >
            <span>Browse All 150+ Menu Specialties</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
