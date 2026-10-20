import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';

interface PreparationReelItem {
  id: string;
  dishName: string;
  category: string;
  videoSrc: string;
  posterUrl: string;
  price: number;
  prepTag: string;
  prepTime: string;
  badge: string;
  description: string;
  pinterestUrl: string;
}

interface LiveFoodReelsProps {
  onOrderOnWhatsApp: (dishName: string, price: number, category?: string) => void;
}

const PREPARATION_REELS: PreparationReelItem[] = [
  {
    id: 'prep-pizza',
    dishName: 'Neapolitan Margherita & Tandoori Pizza',
    category: 'Pizza',
    videoSrc: '/videos/pizza-prep.mp4?v=hd2',
    posterUrl: '/videos/pizza-thumb.jpg',
    price: 229,
    prepTag: '48-Hr Fermented Dough',
    prepTime: '8 Mins',
    badge: 'Stone-Baked Live',
    description: 'Hand-stretched fermented dough, crushed San Marzano tomatoes, and fresh buffalo mozzarella fired at 450°C in our stone oven.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-coffee',
    dishName: 'Artisanal Cappuccino & Swan Latte Art',
    category: 'Coffee',
    videoSrc: '/videos/coffee-prep.mp4?v=hd2',
    posterUrl: '/videos/coffee-thumb.jpg',
    price: 99,
    prepTag: 'Single-Origin Arabica',
    prepTime: '4 Mins',
    badge: 'Barista Handcrafted',
    description: 'Precision double espresso extracted under 9 bars of pressure, combined with silky microfoam poured into signature swan latte art.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-burger',
    dishName: "Chef's Spl Gourmet Brioche Burger",
    category: 'Burger',
    videoSrc: '/videos/burger-prep.mp4?v=hd2',
    posterUrl: '/videos/burger-thumb.jpg',
    price: 199,
    prepTag: 'Toasted Butter Brioche',
    prepTime: '10 Mins',
    badge: 'Sizzling Grill',
    description: 'Flame-seared gourmet patty, melted gouda cheese, smokey house relish, and caramelized onions served on toasted brioche.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-mocktail',
    dishName: 'Blue Lagoon & Mint Mojito Coolers',
    category: 'Mocktails',
    videoSrc: '/videos/mocktail-prep.mp4?v=hd2',
    posterUrl: '/videos/mocktail-thumb.jpg',
    price: 99,
    prepTag: 'Sparkling Citrus Fizz',
    prepTime: '3 Mins',
    badge: 'Chilled Shaker',
    description: 'Fresh garden mint sprigs crushed with lime wedges, vibrant blue curacao syrup, and effervescent sparkling soda shaken over ice.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-chicken',
    dishName: '12-Spice Crispy Golden Fried Chicken',
    category: 'Fried Chicken',
    videoSrc: '/videos/chicken-prep.mp4?v=hd2',
    posterUrl: '/videos/chicken-thumb.jpg',
    price: 219,
    prepTag: 'Ultra Crunch Coating',
    prepTime: '12 Mins',
    badge: 'Secret Recipe',
    description: 'Overnight herb marinade, double-dusted in authentic seasoned spices, and golden fried for an ultra-crunchy, juicy bite.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-kunafa',
    dishName: 'Royal Lotus Biscoff Cheesy Kunafa',
    category: 'Kunafa',
    videoSrc: '/videos/kunafa-prep.mp4?v=hd2',
    posterUrl: '/videos/kunafa-thumb.jpg',
    price: 249,
    prepTag: 'Stretchy Sweet Cheese',
    prepTime: '10 Mins',
    badge: 'Signature Dessert',
    description: 'Golden shredded kataifi vermicelli pan-baked with gooey stretchy sweet cheese, drenched in warm Belgian Lotus Biscoff butter.',
    pinterestUrl: 'https://pin.it/3KnMhR8IF'
  }
];

export const LiveFoodReels: React.FC<LiveFoodReelsProps> = () => {
  const [modalReel, setModalReel] = useState<PreparationReelItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Ensure all videos play continuously on loop
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Autoplay handled by browser muted policy
        });
      }
    });
  }, []);

  return (
    <section id="live-reels" className="py-8 sm:py-12 bg-[#EDE0CC] relative overflow-hidden scroll-mt-16">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-2.5">
            <Flame className="w-3.5 h-3.5 fill-terracotta" />
            <span>Live Kitchen Preparation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-2 leading-tight">
            Live Culinary Reels
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-coffee-800 leading-relaxed max-w-2xl mx-auto font-normal">
            Watch our chefs handcraft stone-baked pizzas, barista latte art, brioche burgers & signature desserts live.
          </p>
        </div>

        {/* Seamless Horizontal Video Reels Track - Only Videos Playing & Borderless */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-2 sm:px-4"
        >
          {PREPARATION_REELS.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => setModalReel(reel)}
              className="snap-center shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group"
            >
              {/* Video Element - Borderless & Autoplaying */}
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={reel.videoSrc}
                poster={reel.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Minimal Clean Gradient Overlay with Dish Name */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none flex flex-col justify-end p-4 sm:p-5">
                <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  {reel.category}
                </span>
                <h3 className="font-serif font-bold text-white text-base sm:text-lg leading-snug drop-shadow-md">
                  {reel.dishName}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Fullscreen Video Modal on click */}
      <AnimatePresence>
        {modalReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setModalReel(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-black text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalReel(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-terracotta text-white backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player */}
              <div className="relative aspect-[9/16] w-full max-h-[80vh] bg-black">
                <video
                  src={modalReel.videoSrc}
                  poster={modalReel.posterUrl}
                  autoPlay
                  controls
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Minimal Footer */}
              <div className="p-4 bg-espresso-950 flex items-center justify-between">
                <div>
                  <span className="text-amber-300 text-xs font-bold uppercase">{modalReel.category}</span>
                  <h4 className="font-serif font-bold text-white text-base">{modalReel.dishName}</h4>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
