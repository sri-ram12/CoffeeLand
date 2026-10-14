import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  Eye,
  Coffee,
  Sparkles,
  Utensils,
  ChevronRight,
  ExternalLink,
  BookOpen,
  LayoutGrid,
  List,
  Flame,
  Leaf,
  Heart
} from 'lucide-react';
import { Product } from '../types/product';

interface WholeMenuShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  onToggleFavorite: (productId: string) => void;
}

export const WholeMenuShowcase: React.FC<WholeMenuShowcaseProps> = ({
  products,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activePageTab, setActivePageTab] = useState<number>(0); // 0 = all, 2, 3, 4, 5, 6
  const [viewMode, setViewMode] = useState<'cards' | 'board' | 'scans'>('cards');
  const [menuSearch, setMenuSearch] = useState('');

  const pageTabs = [
    { page: 0, title: 'All Pages (Full Directory)', subtitle: 'Complete 150+ Menu Catalog' },
    { page: 2, title: 'Page 2: Coffees & Beverages', subtitle: 'Hot/Cold Coffee, Thickshakes & Mocktails' },
    { page: 3, title: 'Page 3: Burgers & Sandwiches', subtitle: 'Gourmet Brioche Burgers, Club Sandwiches & Wraps' },
    { page: 4, title: 'Page 4: Starters, Chicken & Pasta', subtitle: 'Fried Chicken Buckets, Paneer Starters & Pastas' },
    { page: 5, title: 'Page 5: Pizzas, Rice & Soups', subtitle: 'Handcrafted Pizzas, Schezwan Rice & Fresh Salads' },
    { page: 6, title: 'Page 6: Waffles, Kunafa & Desserts', subtitle: 'Lotus Biscoff Kunafa, Sizzling Brownie & Add-Ons' },
  ];

  const scannedPages = [
    { page: 1, title: 'Cover & Signature Dishes', file: '/menu-pages/page_1.jpg' },
    { page: 2, title: 'Page 2: Beverages & Shakes', file: '/menu-pages/page_2.jpg' },
    { page: 3, title: 'Page 3: Burgers, Sandwiches & Wraps', file: '/menu-pages/page_3.jpg' },
    { page: 4, title: 'Page 4: Appetizers, Fried Chicken & Pastas', file: '/menu-pages/page_4.jpg' },
    { page: 5, title: 'Page 5: Pizzas, Rice Bowls & Soups', file: '/menu-pages/page_5.jpg' },
    { page: 6, title: 'Page 6: Waffles, Kunafa, Desserts & Add-Ons', file: '/menu-pages/page_6.jpg' },
  ];

  // Filter products by selected page tab and search query
  const filteredProducts = products.filter((p) => {
    const matchesPage = activePageTab === 0 || p.menuPage === activePageTab;
    const matchesQuery =
      menuSearch.trim() === '' ||
      p.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(menuSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesPage && matchesQuery;
  });

  // Group by category for classic board view
  const categoryGroups = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  const formatCategoryTitle = (cat: string) => {
    return cat
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <section id="full-menu-showcase" className="py-24 bg-[#EDE0CC] relative overflow-hidden scroll-mt-12">
      {/* Background radial effects */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner from coffelandmenu.pdf with Circular Logo */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Circular Logo & Ribbon */}
          <div className="flex flex-col items-center mb-3">
            <img
              src="/logo.png"
              alt="Coffee Land Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-terracotta shadow-lg mb-3"
            />
            <div className="inline-block bg-terracotta border-2 border-terracotta-600 px-6 py-2 rounded-xl shadow-md">
              <span className="font-heading font-bold text-white tracking-widest text-xs sm:text-sm uppercase">
                GOOD FOOD • GREAT COFFEE • BETTER TOGETHER
              </span>
            </div>
          </div>

          <h2 className="font-display tracking-wider text-4xl sm:text-5xl lg:text-6xl text-espresso-950 uppercase mb-2">
            COFFEE LAND RESTO & CAFE
          </h2>
          <p className="font-handwriting text-2xl sm:text-3xl text-terracotta font-bold mb-3">
            Official Menu & Culinary Collection • Vizag
          </p>
          <p className="text-sm sm:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
            Every handcrafted specialty from our official printed menu — explore all 6 pages with authentic pricing, chef recipes, and download options.
          </p>

          {/* 5 Brand Pillars from PDF Page 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-terracotta/20">
            {[
              { label: 'DELICIOUS FOOD', icon: '🍲' },
              { label: 'PREMIUM COFFEE', icon: '☕' },
              { label: 'COZY AMBIENCE', icon: '🛋️' },
              { label: 'GREAT SERVICE', icon: '🛎️' },
              { label: 'TAKE AWAY AVAILABLE', icon: '🛍️' },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-terracotta/20 shadow-xs"
              >
                <span className="text-xl mb-1">{pillar.icon}</span>
                <span className="text-[11px] font-bold text-espresso-950 tracking-wider">
                  {pillar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* View Controls & Action Bar */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 border border-terracotta/20 shadow-md">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EDE0CC] border border-terracotta/20 w-full sm:w-auto overflow-x-auto scrollbar-none justify-start sm:justify-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                viewMode === 'cards'
                  ? 'bg-terracotta text-white font-bold shadow-md'
                  : 'text-espresso-800 hover:text-terracotta'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Interactive Cards</span>
            </button>

            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                viewMode === 'board'
                  ? 'bg-terracotta text-white font-bold shadow-md'
                  : 'text-espresso-800 hover:text-terracotta'
              }`}
            >
              <span className="font-mono font-black text-base leading-none tracking-tighter">≡</span>
              <span>3-Dashed Board</span>
            </button>

            <button
              onClick={() => setViewMode('scans')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                viewMode === 'scans'
                  ? 'bg-terracotta text-white font-bold shadow-md'
                  : 'text-espresso-800 hover:text-terracotta'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Scans</span>
            </button>
          </div>

          {/* Quick Search in Full Menu */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search across 150+ items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-terracotta/30 text-espresso-950 placeholder-espresso-400 text-xs sm:text-sm focus:outline-none focus:border-terracotta shadow-xs"
            />
            {menuSearch && (
              <button
                onClick={() => setMenuSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-espresso-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Download Official PDF Button */}
          <a
            href="/coffelandmenu.pdf"
            download="CoffeeLand-Official-Menu.pdf"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 shrink-0"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Original PDF</span>
          </a>
        </div>

        {/* Page Filter Tabs */}
        {viewMode !== 'scans' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-4 mb-8">
            {pageTabs.map((tab) => {
              const isActive = activePageTab === tab.page;
              return (
                <button
                  key={tab.page}
                  onClick={() => setActivePageTab(tab.page)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 text-left ${
                    isActive
                      ? 'bg-terracotta text-white border-terracotta shadow-md font-bold scale-[1.02]'
                      : 'bg-white text-espresso-900 border-terracotta/20 hover:border-terracotta/40 hover:bg-[#EDE0CC]'
                  }`}
                >
                  <div className="font-bold">{tab.title}</div>
                  <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-coffee-600'}`}>
                    {tab.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* MODE 1: CLASSIC MENU BOARD (Dotted Leader Printed Cafe Style) */}
        {viewMode === 'board' && (
          <div className="space-y-10">
            {Object.keys(categoryGroups).length === 0 ? (
              <div className="p-12 text-center text-espresso-700 glass-card rounded-3xl">
                No menu items found matching "{menuSearch}". Try searching for coffee, burger, pasta, or waffles.
              </div>
            ) : (
              Object.entries(categoryGroups).map(([catKey, items]) => (
                <div
                  key={catKey}
                  className="parchment-card rounded-3xl p-6 sm:p-8 border border-amber-900/20 shadow-xl"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-amber-950/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center text-amber-900 font-bold">
                        <Coffee className="w-5 h-5 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="font-display tracking-wider text-2xl sm:text-3xl font-bold text-amber-950 uppercase">
                          {formatCategoryTitle(catKey)}
                        </h3>
                        <span className="font-handwriting text-lg text-amber-800">
                          Freshly prepared to order
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-900/10 px-3 py-1 rounded-full">
                      {items.length} items
                    </span>
                  </div>

                  {/* Two-Column Dotted Leader Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectProduct(item)}
                        className="group flex flex-col cursor-pointer p-2 rounded-xl hover:bg-amber-100/60 transition-colors"
                      >
                        <div className="flex items-baseline justify-between w-full">
                          {/* Veg/Non-Veg marker + Name */}
                          <div className="flex items-center gap-2 max-w-[70%]">
                            <span
                              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                                item.isVeg
                                  ? 'border-green-600 bg-white text-green-600'
                                  : 'border-red-600 bg-white text-red-600'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isVeg ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              />
                            </span>
                            <span className="font-heading font-bold text-sm sm:text-base text-amber-950 group-hover:text-amber-800 transition-colors">
                              {item.name}
                            </span>
                          </div>

                          {/* Dotted Leader */}
                          <div className="dotted-leader" />

                          {/* Price */}
                          <div className="font-display text-base sm:text-lg font-bold text-amber-950 shrink-0">
                            ₹{item.price}
                          </div>
                        </div>

                        {/* Description & Badge */}
                        <div className="flex items-center justify-between text-xs text-amber-900/80 mt-1 pl-5">
                          <p className="line-clamp-1 italic">{item.description}</p>
                          {item.badge && (
                            <span className="ml-2 text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MODE 2: INTERACTIVE CARDS VIEW */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const favorited = isFavorite(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-terracotta/20 shadow-sm hover:shadow-md flex flex-col justify-between group transition-all"
                >
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="cursor-pointer"
                  >
                    {/* Image with Tag & Favorite */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE0CC]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Veg / Non-Veg Indicator */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-terracotta/20 flex items-center gap-1.5 shadow-xs">
                        <span
                          className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                            product.isVeg ? 'border-green-600 bg-white' : 'border-red-600 bg-white'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`}
                          />
                        </span>
                        <span className="text-[10px] font-bold text-espresso-950">
                          {product.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>

                      {/* Badge if present */}
                      {product.badge && (
                        <div className="absolute top-3 right-12 bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          {product.badge}
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md border border-terracotta/20 text-espresso-800 hover:text-red-500 transition-colors shadow-xs"
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorited ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>

                      {/* Menu Page indicator */}
                      <div className="absolute bottom-2 left-3 text-[10px] text-white font-bold drop-shadow">
                        Page {product.menuPage} from Menu
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-heading font-bold text-base text-espresso-950 group-hover:text-terracotta transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-coffee-700 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-terracotta/15 mt-2">
                    <div>
                      <span className="text-[10px] uppercase text-coffee-600 font-bold block">Price</span>
                      <span className="font-display text-xl font-bold text-espresso-950">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3.5 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MODE 3: ORIGINAL SCANNED PDF PAGES */}
        {viewMode === 'scans' && (
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-sm text-coffee-800 font-medium">
                High-definition direct digital scans of the official Coffee Land printed cafe menu booklet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scannedPages.map((scan) => (
                <div
                  key={scan.page}
                  className="bg-white rounded-3xl overflow-hidden border border-terracotta/25 shadow-xl flex flex-col group"
                >
                  <div className="p-4 bg-[#EDE0CC] border-b border-terracotta/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-terracotta uppercase tracking-wider block">
                        Page {scan.page} of 6
                      </span>
                      <h4 className="font-heading text-sm font-bold text-espresso-950 line-clamp-1">
                        {scan.title}
                      </h4>
                    </div>
                    <a
                      href={scan.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white hover:bg-terracotta text-espresso-950 hover:text-white border border-terracotta/20 transition-colors shadow-xs"
                      title="Open full page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE0CC]">
                    <img
                      src={scan.file}
                      alt={scan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
