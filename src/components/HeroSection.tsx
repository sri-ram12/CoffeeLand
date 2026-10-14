import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  QrCode,
  Camera,
  Utensils,
  Star,
  MessageCircle
} from 'lucide-react';
import { OfferBannersSection } from './OfferBannersSection';
import { OfferBanner } from '../types/banner';
import { HeroBackgroundDecor } from './HeroBackgroundDecor';

interface HeroSpecial {
  bgWord: string;
  name: string;
  category: string;
  price: number;
  badge: string;
  image: string;
  description: string;
  flavorNote: string;
}

const HERO_SPECIALS: HeroSpecial[] = [
  {
    bgWord: 'BURGER',
    name: "Chef's Spl Non-Veg Burger",
    category: 'Gourmet Brioche Burgers',
    price: 199,
    badge: "Chef's Special",
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    description: 'Double grilled chicken fillet, golden fried egg, crispy chicken bacon, melted gouda cheese, and secret BBQ smokey glaze on a toasted artisan brioche bun.',
    flavorNote: 'Smoky, Juicy, Crispy, Savory'
  },
  {
    bgWord: 'COFFEE',
    name: 'Artisanal Cappuccino',
    category: 'Hot Specialty Coffee',
    price: 99,
    badge: 'Bestseller',
    image: '/menu-assets/img_p1_25.png',
    description: 'Freshly extracted double arabica espresso from Chikmagalur hills folded with silky steamed milk and velvety microfoam latte art.',
    flavorNote: 'Rich Cocoa, Roasted Nuts, Smooth Foam'
  },
  {
    bgWord: 'PIZZA',
    name: 'Neapolitan Margarita Pizza',
    category: 'Handcrafted Stone-Baked Pizza',
    price: 229,
    badge: 'Artisanal Crust',
    image: '/menu-assets/img_p1_23.png',
    description: '48-hour fermented thin crust dough baked at high heat with crushed Italian plum tomatoes, fresh mozzarella pearls, and fragrant sweet basil leaves.',
    flavorNote: 'Charred Crust, Melted Mozzarella, Herb Basil'
  },
  {
    bgWord: 'KUNAFA',
    name: 'Lotus Biscoff Kunafa',
    category: 'Signature Middle-Eastern Dessert',
    price: 249,
    badge: 'Must Try',
    image: '/menu-assets/img_p1_0.png',
    description: 'Crisp golden-baked kataifi vermicelli pastry stuffed with warm stretchy sweet cheese, drenched in Lotus Biscoff butter and caramelized biscuit crumb.',
    flavorNote: 'Stretchy Cheese, Caramel Speculoos, Warm Kataifi'
  },
  {
    bgWord: 'BROWNIE',
    name: 'Sizzling Chocolate Brownie',
    category: 'Decadent Hot Skillet Dessert',
    price: 149,
    badge: 'Guest Favorite',
    image: '/menu-assets/img_p1_31.png',
    description: 'Rich Belgian fudge brownie served on a smoking wooden skillet with a giant scoop of pure Madagascar vanilla bean gelato and dark chocolate ganache.',
    flavorNote: 'Sizzling Hot Fudge, Cold Gelato, Molten Cocoa'
  },
  {
    bgWord: 'WAFFLES',
    name: 'Belgian Chocolate Waffle',
    category: 'Crisp Gourmet Waffles',
    price: 139,
    badge: 'Freshly Baked',
    image: '/menu-assets/img_p1_27.png',
    description: 'Golden honeycomb Belgian waffle with airy crisp pockets, drowned in melted Dutch chocolate, chocolate curls, and creamy vanilla ice cream.',
    flavorNote: 'Honeycomb Crunch, Deep Ganache, Fluffy Center'
  }
];

interface HeroSectionProps {
  banners?: OfferBanner[];
  onOpenAdmin?: () => void;
  onClaimOffer?: (banner: OfferBanner) => void;
  onOrderWhatsApp?: (dishName: string, price: number, category?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  banners = [],
  onOpenAdmin = () => { },
  onClaimOffer = () => { },
  onOrderWhatsApp = () => { }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);

  const TAGLINES = [
    { text: "Your Perfect Cup. Your Happy Place.", sub: "Handcrafted Specialty Coffee & Comfort Food", icon: "☕" },
    { text: "Over 150+ Authentic Menu Delights", sub: "Rated 4.7 ★ on Google Maps with 260+ Reviews", icon: "⭐" },
    { text: "Artisan Brews, Brioche Burgers & Kunafa", sub: "Freshly Made-to-Order in Thagarapuvalasa, Vizag", icon: "✨" },
    { text: "Temples Bypass Road, Near Sangivalasa", sub: "Dine-In, Outdoor Seating, Takeaway & Free Wi-Fi", icon: "📍" },
  ];

  // Auto-rotate dynamic taglines every 3.4s
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const currentItem = HERO_SPECIALS[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SPECIALS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SPECIALS.length) % HERO_SPECIALS.length);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[96vh] flex flex-col justify-center pt-24 pb-14 overflow-hidden bg-[#EDE0CC]"
    >
      {/* Rich Animated Cafe Background Decor (Floating Coffee Beans, Rising Steam, Botanical Watermarks, Golden Motes) */}
      <HeroBackgroundDecor />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* ============================================================ */}
        {/* DYNAMICALLY ANIMATED HERO HEADER & ENLARGED OFFICIAL LOGO */}
        {/* ============================================================ */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Top Sparkling Ribbon Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-terracotta border-2 border-terracotta-600 shadow-md mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-heading text-xs sm:text-sm font-black uppercase tracking-widest text-white">
              GOOD FOOD • GREAT COFFEE • BETTER TOGETHER
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          </motion.div>

          {/* ENLARGED DYNAMICALLY ANIMATED CIRCULAR LOGO */}
          <div className="relative mb-5 flex items-center justify-center">
            {/* Outer Rotating Dashed Orbital Aura Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-5 sm:-inset-6 md:-inset-7 rounded-full border-2 border-dashed border-terracotta/40 pointer-events-none"
            />

            {/* Counter-Rotating Inner Dotted Ring with Warm Golden Sparks */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2.5 sm:-inset-3.5 rounded-full border border-dotted border-caramel/60 pointer-events-none"
            />

            {/* Glowing Golden Warmth Aura Behind Logo */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-terracotta via-caramel to-amber-400 blur-2xl pointer-events-none"
            />

            {/* Main Interactive Floating Logo Emblem */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1.5, -1.5, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{
                scale: 1.12,
                rotate: 6,
                boxShadow: '0 25px 40px -10px rgba(128, 43, 18, 0.45)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('full-menu-showcase')}
              className="relative cursor-pointer group"
              title="Click to explore 150+ menu items"
            >
              <img
                src="/logo.png"
                alt="Coffee Land Resto & Cafe Official Seal"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-terracotta shadow-2xl transition-all duration-300 group-hover:brightness-105"
              />

              {/* Floating Coffee Aroma Steam Micro-Badge */}
              <div className="absolute -bottom-2 right-1 sm:right-2 px-3 py-1 rounded-full bg-white border border-terracotta/30 text-terracotta text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1">
                <Coffee className="w-3 h-3 text-terracotta animate-bounce" />
                <span>Specialty Cafe</span>
              </div>
            </motion.div>
          </div>

          {/* DYNAMIC ANIMATED CAFE NAME & LUXURY ARTISANAL TYPOGRAPHY */}
          <div className="space-y-3 max-w-4xl mx-auto px-2">
            {/* Heritage Ribbon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#802B12]"
            >
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#802B12]/60" />
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300/70 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-heading font-black tracking-wider text-[#802B12] text-[11px] sm:text-xs">
                  ESTD. 2024 • ARTISANAL ROASTERY & GOURMET KITCHEN
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#802B12]/60" />
            </motion.div>

            {/* Grand Majestic Cafe Title with Luxury Editorial Serif & Depth */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 select-none py-1"
            >
              {/* Golden Ambient Backlight Behind Text */}
              <div className="absolute inset-0 max-w-2xl mx-auto bg-gradient-to-r from-amber-400/25 via-terracotta/30 to-amber-500/25 blur-3xl -z-10 pointer-events-none" />

              <h1 className="font-serif text-5xl min-[380px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.96] filter drop-shadow-[0_4px_18px_rgba(128,43,18,0.22)]">
                <span className="bg-gradient-to-br from-[#1E110C] via-[#5C1F0E] to-[#802B12] bg-clip-text text-transparent hover:brightness-110 transition-all font-serif">
                  Coffee
                </span>
                {' '}
                <span className="relative bg-gradient-to-br from-[#802B12] via-[#B84E29] to-[#D96B43] bg-clip-text text-transparent font-serif italic font-normal sm:font-semibold">
                  Land
                  {/* Subtle Golden Star Accent */}
                  <span className="not-italic absolute -top-3 -right-4 sm:-right-8 text-lg sm:text-3xl text-amber-500 animate-pulse pointer-events-none">
                    ✦
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Luxurious Calligraphy Subtitle & City Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center flex-wrap gap-3 text-espresso-800"
            >
              <span className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#802B12] via-[#A33B1C] to-[#5C1F0E] bg-clip-text text-transparent drop-shadow-xs">
                Resto & Cafe
              </span>
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-terracotta/25 text-espresso-900 shadow-xs">
                <span className="text-terracotta text-xs">📍</span>
                <span className="font-display tracking-[0.2em] text-[11px] sm:text-xs md:text-sm uppercase font-extrabold text-espresso-900">
                  Visakhapatnam (Vizag)
                </span>
              </div>
            </motion.div>

            {/* DYNAMIC TAGLINE ROTATOR (Cycles every 3.4s) */}
            <div className="h-14 sm:h-12 flex items-center justify-center overflow-hidden my-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/90 border border-terracotta/20 shadow-sm"
                >
                  <span className="text-lg">{TAGLINES[taglineIndex].icon}</span>
                  <div className="text-left sm:text-center">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-espresso-950 block sm:inline">
                      {TAGLINES[taglineIndex].text}
                    </span>
                    <span className="hidden sm:inline mx-1.5 text-terracotta/60">•</span>
                    <span className="text-[11px] sm:text-xs text-coffee-700 font-medium block sm:inline">
                      {TAGLINES[taglineIndex].sub}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Credentials Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 text-xs text-coffee-800"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300/80 font-bold text-[#802B12] shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>4.7 ★ Google Rating (260+ Reviews)</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-terracotta/20 font-semibold shadow-xs">
                <span>📍 Temples Bypass Road, Sangivalasa</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-terracotta/20 font-semibold shadow-xs">
                <span>⏰ 10:00 AM – 10:00 PM</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RECTANGULAR OFFER BANNERS (At top of website right after logos and name) */}
        {banners && banners.length > 0 && (
          <OfferBannersSection
            banners={banners}
            onOpenAdmin={onOpenAdmin}
            onClaimOffer={onClaimOffer}
          />
        )}

        {/* HERO SHOWCASE CARD in Warm Biscuit Theme */}
        <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-white via-[#EDE0CC] to-[#E5D5BD] border-2 border-terracotta/20 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl backdrop-blur-xl overflow-hidden min-h-[460px] flex items-center">
          {/* HUGE OUTLINE BACKGROUND WORD (e.g. BURGER, COFFEE, PIZZA) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <span className="font-display text-[18vw] sm:text-[140px] lg:text-[180px] font-black tracking-tighter text-stroke-amber opacity-35 uppercase whitespace-nowrap">
              {currentItem.bgWord}
            </span>
          </div>

          {/* Grid Layout: Left Content, Center/Right Dish Presentation */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
            {/* LEFT COLUMN: Story, Title, Price & Order Action */}
            <div className="md:col-span-6 lg:col-span-5 text-center md:text-left flex flex-col items-center md:items-start">
              {/* Badge & Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-terracotta text-white text-xs font-bold shadow-sm">
                  {currentItem.badge}
                </span>
                <span className="text-xs font-bold text-coffee-700">
                  {currentItem.category}
                </span>
              </div>

              {/* Dish Name */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-espresso-950 leading-tight mb-2">
                {currentItem.name}
              </h1>

              {/* Flavor Profile Note */}
              <div className="font-handwriting text-xl text-terracotta mb-3 font-bold">
                Notes: {currentItem.flavorNote}
              </div>

              {/* Narrative description */}
              <p className="text-xs sm:text-sm text-coffee-800 leading-relaxed mb-6 max-w-md">
                {currentItem.description}
              </p>

              {/* Price & CTA Button (Reversed theme: Terracotta Button!) */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-coffee-600 uppercase tracking-widest font-bold">Price</span>
                  <span className="font-display text-3xl font-bold text-espresso-950">
                    ₹{currentItem.price}
                  </span>
                </div>

                <button
                  onClick={() => scrollTo('full-menu-showcase')}
                  className="px-5 py-3 rounded-full bg-terracotta hover:bg-terracotta-600 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  Order / View Menu
                </button>

                <button
                  onClick={() => onOrderWhatsApp(currentItem.name, currentItem.price, currentItem.category)}
                  className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
                  title="Inquire or order on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => scrollTo('reviews')}
                  className="px-3.5 py-3 rounded-full bg-white hover:bg-parchment-200 text-espresso-900 border border-terracotta/30 font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-terracotta" />
                  <span>Photos</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Floating Dish Image with Particles */}
            <div className="md:col-span-6 lg:col-span-7 flex flex-col items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.name}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                  className="relative w-64 sm:w-80 lg:w-96 aspect-square flex items-center justify-center"
                >
                  {/* Subtle radial golden glow behind dish */}
                  <div className="absolute inset-0 bg-terracotta/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Main Product Image */}
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(43,27,22,0.25)] animate-float"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrows & Counter (Right bottom control) */}
              <div className="flex items-center gap-3 mt-4 z-20">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full border border-terracotta/30 bg-white hover:bg-terracotta text-espresso-950 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="Previous special"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-xs font-mono font-bold text-espresso-900">
                  <span className="text-terracotta font-bold">{currentIndex + 1}</span> / {HERO_SPECIALS.length}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full border border-terracotta/30 bg-white hover:bg-terracotta text-espresso-950 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                  aria-label="Next special"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Bottom Feature Badges from PDF Page 1 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-coffee-800 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Delicious Food</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Premium Coffee</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Cozy Ambience</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Great Service</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Take Away Available</span>
          </span>
        </div>
      </div>
    </section>
  );
};
