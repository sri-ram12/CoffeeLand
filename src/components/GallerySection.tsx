import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  id: string;
  title: string;
  category: 'coffee' | 'bakery-food' | 'ambience';
  image: string;
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Coffeeland Exterior & Iconic Van',
    category: 'ambience',
    image: '/shop-photos/shop_exterior_van.jpg',
    caption: 'Our signature yellow Volkswagen van cafe facade, welcoming entrance, and official brand billboard on Temples Bypass Rd.',
  },
  {
    id: 'g-2',
    title: 'Good Vibes Lounge & Wall Art',
    category: 'ambience',
    image: '/shop-photos/shop_interior_counter.jpg',
    caption: 'Modern indoor dining room featuring "Eat like you love yourself" wall mural, "Good Vibes Only" neon hedge, and cozy book library.',
  },
  {
    id: 'g-3',
    title: 'Brioche Burger & Garlic Bread Platter',
    category: 'bakery-food',
    image: '/shop-photos/shop_food_dining.jpg',
    caption: 'Freshly toasted gourmet brioche burger served with crispy seasoned french fries, house dips, and melted cheese garlic toasts.',
  },
  {
    id: 'g-4',
    title: 'Evening Purple Neon Ambient Glow',
    category: 'ambience',
    image: '/shop-photos/shop_ambience_neon.jpg',
    caption: 'Relaxing evening atmosphere with air-conditioned seating, contemporary pendant lights, and vibrant neon decor.',
  },
  {
    id: 'g-5',
    title: 'Full Cafe Facade & Entrance Path',
    category: 'ambience',
    image: '/shop-photos/shop_seating_vibe.jpg',
    caption: 'Complete front elevation of the two-storey Coffeeland building in Thagarapuvalasa with traditional floral kolam walkway.',
  },
  {
    id: 'g-6',
    title: 'Stone-Baked Handcrafted Pizza',
    category: 'bakery-food',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crispy thin crust stone-baked pizza loaded with fresh mozzarella, herbs, and gourmet toppings.',
  },
  {
    id: 'g-7',
    title: 'Belgian Waffle & Fluffy Pancakes',
    category: 'bakery-food',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    caption: 'Freshly baked golden Belgian waffles and fluffy buttermilk pancakes drizzled with warm chocolate and syrup.',
  },
  {
    id: 'g-8',
    title: 'Artisanal Hot & Cold Specialty Coffee',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1200&q=80',
    caption: 'Single-origin Arabica roasts extracted with dense crema and silky handcrafted microfoam latte art.',
  },
];

export const GallerySection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'coffee' | 'bakery-food' | 'ambience'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedFilter);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % filteredItems.length));
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  return (
    <section id="gallery" className="py-24 bg-[#EDE0CC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Journey & Video Highlights</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-3">
            Ambience, Food & Cafe Reels
          </h2>
          <p className="text-sm sm:text-base text-coffee-800">
            A glimpse into the aromas, handcrafted tastes, relaxing outdoor dining, and cozy moments that await you at Coffee Land Resto & Cafe (Vizag).
          </p>

          {/* Gallery Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Photos & Reels' },
              { id: 'coffee', label: 'Coffee Craft' },
              { id: 'bakery-food', label: 'Food & Bakery' },
              { id: 'ambience', label: 'Cafe Ambience' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                  selectedFilter === tab.id
                    ? 'bg-terracotta text-white shadow-xs font-bold'
                    : 'bg-white border-terracotta/20 text-espresso-800 hover:border-terracotta/40 hover:bg-[#EDE0CC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Ambience Spotlight Banner */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-terracotta/20 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-wider inline-block">
                📹 Cafe Tour & Experience Reel
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950">
                Experience The Coffee Land Vibe
              </h3>
              <p className="text-sm text-coffee-700 leading-relaxed">
                Step inside our warm timber dining room, listen to the gentle hum of espresso grinding, and take in the aroma of freshly baked kunafa and stone-baked pizza on Temples Bypass Rd.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-coffee-800 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  <span>Outdoor Seating</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  <span>Air-Conditioned Indoor</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  <span>Free High-Speed Wi-Fi</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-terracotta/20 shadow-lg group">
                <img
                  src="/shop-photos/shop_interior_counter.jpg"
                  alt="Coffee Land Cafe Ambience & Interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                  <a
                    href="https://maps.app.goo.gl/Xkpi9H6ueRbUqH4UA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-terracotta hover:bg-terracotta-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                    title="View Coffeeland Photos on Google Maps"
                  >
                    <span className="text-2xl ml-1">▶</span>
                  </a>
                </div>
                <div className="absolute bottom-3 left-4 text-white text-xs font-semibold drop-shadow">
                  Coffee Land Resto & Cafe • Thagarapuvalasa, Vizag
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid (Editorial Staggered Arrangement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square bg-white border border-terracotta/20 hover:border-terracotta/60 shadow-sm hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h4>
                <p className="text-xs text-parchment-200 line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/95 backdrop-blur-lg">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-espresso-900 border border-caramel/40 text-cream-100 hover:text-caramel flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-8 z-20 w-12 h-12 rounded-full bg-espresso-900/80 border border-caramel/30 text-cream-100 hover:text-caramel flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-8 z-20 w-12 h-12 rounded-full bg-espresso-900/80 border border-caramel/30 text-cream-100 hover:text-caramel flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden border border-caramel/30 shadow-2xl bg-espresso-950 max-h-[70vh]">
                <img
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              {/* Lightbox Caption */}
              <div className="mt-4 text-center">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-beige-400 mt-1 max-w-md">
                  {filteredItems[lightboxIndex].caption}
                </p>
                <span className="text-[11px] text-caramel/70 mt-2 block font-light">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
