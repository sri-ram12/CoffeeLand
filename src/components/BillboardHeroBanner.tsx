import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Phone,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Pause,
  Play
} from 'lucide-react';
import { BillboardBanner, BillboardDesignTheme } from '../types/banner';

interface BillboardHeroBannerProps {
  banner?: BillboardBanner;
  bannersList?: BillboardBanner[];
  onOpenAdmin?: () => void;
  onOrderWhatsApp?: (dishName: string, price: number, category?: string) => void;
  onSelectBanner?: (banner: BillboardBanner) => void;
}

const getCleanBannerImage = (imgUrl?: string, theme?: BillboardDesignTheme): string => {
  if (!imgUrl) {
    if (theme === 'burgundy-wave') return '/banners/burger_double.png';
    if (theme === 'navy-torn') return '/banners/pizza_pan.png';
    return '/banners/pizza_board.png';
  }
  if (imgUrl.includes('pizza_board.jpg')) return '/banners/pizza_board.png';
  if (imgUrl.includes('burger_double.jpg')) return '/banners/burger_double.png';
  if (imgUrl.includes('pizza_pan.jpg')) return '/banners/pizza_pan.png';
  return imgUrl;
};

export const BillboardHeroBanner: React.FC<BillboardHeroBannerProps> = ({
  banner,
  bannersList = [],
  onOpenAdmin = () => {},
  onOrderWhatsApp = () => {},
  onSelectBanner = () => {}
}) => {
  // Determine banners to display: if active banners count is > 1, use active banners.
  // If only 1 banner or none is explicitly marked active, fallback to all available banners in bannersList
  // so autoscroll always works seamlessly across all 3 banner themes.
  const displayBanners = React.useMemo(() => {
    const active = bannersList?.filter((b) => b.isActive) || [];
    if (active.length > 1) return active;
    if (bannersList && bannersList.length > 1) return bannersList;
    if (banner) return [banner];
    return [];
  }, [bannersList, banner]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Safe current banner
  const currentBanner = displayBanners[currentIndex] || displayBanners[0] || banner;

  // Auto-scroll effect: advances every 4 seconds reliably when not paused
  useEffect(() => {
    if (displayBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [displayBanners.length, isPaused]);

  // Keep currentIndex in bounds
  useEffect(() => {
    if (currentIndex >= displayBanners.length && displayBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [displayBanners.length, currentIndex]);

  if (!currentBanner) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (displayBanners.length <= 1) return;
    const nextIdx = (currentIndex - 1 + displayBanners.length) % displayBanners.length;
    setCurrentIndex(nextIdx);
    onSelectBanner(displayBanners[nextIdx]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (displayBanners.length <= 1) return;
    const nextIdx = (currentIndex + 1) % displayBanners.length;
    setCurrentIndex(nextIdx);
    onSelectBanner(displayBanners[nextIdx]);
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
    onSelectBanner(displayBanners[idx]);
  };

  // Determine current theme
  const theme: BillboardDesignTheme = currentBanner.designTheme || 'white-brick';

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 relative select-none">
      {/* Top Controls Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Featured Promo Banner ({currentIndex + 1}/{displayBanners.length})</span>
          </span>

          {displayBanners.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-neutral-700 hover:text-neutral-950 text-[11px] font-bold shadow-2xs transition-colors"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3 text-amber-600" />}
              <span>{isPaused ? 'Paused' : 'Auto-Playing'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {displayBanners.length > 1 && (
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-full shadow-xs">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
                title="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
                title="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Admin Edit Shortcut Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-red-50 text-neutral-900 text-xs font-bold shadow-xs transition-all group"
            title="Edit banners, images, names & offers"
          >
            <Settings className="w-3.5 h-3.5 text-red-600 group-hover:rotate-45 transition-transform" />
            <span>Admin: Edit Banners</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BILLBOARD BANNER SLIDE FRAME (COMPLETELY BORDERLESS & SEAMLESS) */}
      {/* ============================================================ */}
      <div className="relative w-full rounded-3xl overflow-hidden border-0 border-none ring-0 outline-none shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full relative border-0 border-none outline-none"
          >
            {/* THEME 1: WHITE BRICK WALL PIZZA BANNER */}
            {theme === 'white-brick' && (
              <WhiteBrickPizzaBanner
                banner={currentBanner}
                onOrderWhatsApp={onOrderWhatsApp}
              />
            )}

            {/* THEME 2: BURGUNDY & YELLOW WAVE BURGER BANNER */}
            {theme === 'burgundy-wave' && (
              <BurgundyWaveBurgerBanner
                banner={currentBanner}
                onOrderWhatsApp={onOrderWhatsApp}
              />
            )}

            {/* THEME 3: MIDNIGHT NAVY & TORN PAPER PIZZA BANNER */}
            {theme === 'navy-torn' && (
              <NavyTornPizzaBanner
                banner={currentBanner}
                onOrderWhatsApp={onOrderWhatsApp}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrow Overlays (Borderless) */}
        {displayBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border-0 border-none flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border-0 border-none flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Carousel Pagination Dots */}
      {displayBanners.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {displayBanners.map((b, idx) => (
            <button
              key={b.id || idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-terracotta shadow-xs'
                  : 'w-2.5 bg-neutral-400/60 hover:bg-neutral-600'
              }`}
              title={`Slide ${idx + 1}: ${b.foodName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ==================================================================== */
/* 1. THEME: WHITE BRICK WALL PIZZA BANNER (Match Reference 1)          */
/* ==================================================================== */
const WhiteBrickPizzaBanner: React.FC<{
  banner: BillboardBanner;
  onOrderWhatsApp: (dishName: string, price: number, category?: string) => void;
}> = ({ banner, onOrderWhatsApp }) => {
  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundImage: `url('/banners/white_brick_wall.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* High-key soft overlay */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />

      {/* Top-Right Logo Seal */}
      <div className="absolute top-4 right-5 sm:top-6 sm:right-8 z-20 flex items-center gap-1.5 text-red-600 pointer-events-none">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs">
          <Utensils className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[10px] sm:text-xs tracking-widest text-red-600 uppercase">
            COFFEE LAND
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-neutral-600 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid: Left Copy & Right Overhead Pizza */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-4 sm:p-8 lg:p-12 min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-2 sm:space-y-3 z-10">
          {/* SUPER + Delicious */}
          <div className="flex items-center gap-2 -mb-2">
            <span className="font-sans font-black text-[11px] sm:text-sm tracking-[0.25em] uppercase text-neutral-900 bg-neutral-100/80 px-2 py-0.5 rounded shadow-2xs">
              {banner.highlightText || 'SUPER'}
            </span>
            <span
              className="text-2xl sm:text-3xl md:text-4xl text-red-600 font-bold italic -rotate-3 select-none"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || 'Delicious'}
            </span>
          </div>

          {/* Giant Brush Title */}
          <div className="relative leading-none py-1">
            <h2
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#1A1A1A] tracking-tight filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] leading-[0.88]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {banner.foodName || 'Pizza'}
            </h2>
          </div>

          {/* MENU + LIMITED OFFER */}
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-red-600 tracking-wider">
              {banner.menuTag || 'MENU'}
            </span>
            <span className="font-sans font-black text-xs sm:text-sm lg:text-base text-neutral-900 tracking-[0.25em] uppercase">
              {banner.limitedOfferTag || 'LIMITED OFFER'}
            </span>
          </div>

          {/* CTA Button, Phone & Website */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() =>
                onOrderWhatsApp(banner.foodName || 'Pizza', banner.offerPrice || 199, 'White Brick Billboard')
              }
              className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-[#E52525] hover:bg-[#C91E1E] text-white font-sans font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{banner.buttonText || 'ORDER NOW'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col">
              <a
                href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
                className="font-sans font-black text-base sm:text-xl text-neutral-950 tracking-wider hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{banner.phone || '323-517-4946'}</span>
              </a>
              <span className="text-[10px] sm:text-xs text-red-600 font-bold tracking-widest uppercase">
                {banner.websiteUrl || 'WWW.COFFEELAND.IN'}
              </span>
            </div>
          </div>

          {/* Free Home Delivery with Arrow */}
          <div className="relative pt-2 pl-2 sm:pl-4 flex items-center gap-2 select-none">
            <span
              className="text-xl sm:text-2xl text-neutral-800 font-bold -rotate-3"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {banner.deliveryNote || 'Free Home Delivery'}
            </span>
            <svg
              viewBox="0 0 60 40"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-8 sm:w-16 sm:h-10 text-neutral-800 -rotate-6 transform translate-y-1"
            >
              <path d="M 10 32 Q 35 30 46 12" />
              <path d="M 36 12 L 46 12 L 44 24" />
            </svg>
          </div>
        </div>

        {/* Right Column: Pizza on Board + 50% OFF Badge */}
        <div className="md:col-span-5 relative flex items-center justify-center">
          <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'white-brick')}
              alt={banner.foodName || 'Pizza'}
              className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105 hover:rotate-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/pizza_board.png';
              }}
            />

            {/* Sketched 50% OFF Badge */}
            <div className="absolute top-2 right-0 sm:top-4 sm:-right-2 lg:top-6 lg:-right-4 z-20">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex flex-col items-center justify-center text-center p-2">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs"
                >
                  <circle cx="60" cy="60" r="54" strokeDasharray="140 10 100 8" transform="rotate(-15 60 60)" />
                  <circle cx="60" cy="60" r="48" strokeWidth="1.2" strokeDasharray="120 8 80 12" transform="rotate(25 60 60)" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <span
                    className="text-xs sm:text-sm font-bold text-neutral-800 -rotate-2 leading-none"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {banner.discountBadgeSub || 'Get Up To'}
                  </span>
                  <span className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-red-600 leading-tight tracking-tight">
                    {banner.discountBadgeText || '50% OFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================== */
/* 2. THEME: BURGUNDY & YELLOW WAVE BURGER BANNER (Match Reference 2)   */
/* ==================================================================== */
const BurgundyWaveBurgerBanner: React.FC<{
  banner: BillboardBanner;
  onOrderWhatsApp: (dishName: string, price: number, category?: string) => void;
}> = ({ banner, onOrderWhatsApp }) => {
  return (
    <div className="relative w-full overflow-hidden select-none bg-gradient-to-br from-[#2E070F] via-[#3E0A14] to-[#4F0D1B]">
      {/* Dynamic Fluid Yellow Amber Wave in Bottom-Right */}
      <svg
        viewBox="0 0 1000 450"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path
          d="M 260 450 C 400 390 440 270 590 240 C 760 210 880 230 1000 130 L 1000 450 Z"
          fill="#F59E0B"
        />
        <path
          d="M 320 450 C 450 410 490 300 640 260 C 800 230 900 240 1000 160 L 1000 450 Z"
          fill="#FBBF24"
          fillOpacity="0.3"
        />
      </svg>

      {/* Far Left Decorative Dot Matrix (6 cols x 3 rows) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 grid grid-cols-3 gap-2 opacity-60 pointer-events-none hidden sm:grid">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
        ))}
      </div>

      {/* Floating Basil Leaf Accent near Top Left */}
      <div className="absolute top-5 left-1/3 z-20 pointer-events-none opacity-90 hidden sm:block">
        <svg viewBox="0 0 60 60" className="w-10 h-10 rotate-12 drop-shadow-md">
          <path
            d="M 30 10 C 15 20 10 40 30 50 C 50 40 45 20 30 10 Z"
            fill="#4ADE80"
          />
          <path d="M 30 10 Q 30 35 30 50" stroke="#16A34A" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Top Left Logo Seal ("LOGO HERE / COFFEE LAND") */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-12 z-20 flex items-center gap-2 pointer-events-none">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 flex items-center justify-center text-espresso-950 font-black shadow-sm">
          <Utensils className="w-4 h-4 text-[#2E070F]" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[10px] sm:text-xs tracking-widest text-white uppercase">
            COFFEE LAND
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-amber-300 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid: Left Copy & Right Towering Burger */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-4 sm:p-8 lg:p-12 min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-2 sm:space-y-3 pt-6 sm:pt-4 z-10">
          {/* Cursive "Special fresh" */}
          <div className="flex items-center gap-2 -mb-2">
            <span
              className="text-2xl sm:text-4xl md:text-5xl text-[#FBBF24] font-bold italic -rotate-3 select-none filter drop-shadow-sm"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || 'Special fresh'}
            </span>
          </div>

          {/* Big White Brush "Burger" Title */}
          <div className="relative leading-none py-1">
            <h2
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] leading-[0.88]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {banner.foodName || 'Burger'}
            </h2>
            {/* Little yellow swash accent underneath */}
            <div className="flex items-center gap-1 mt-1 pl-1">
              <span className="w-4 h-2 rounded-full bg-[#FBBF24] rotate-45 inline-block" />
              <span className="w-6 h-2 rounded-full bg-[#FBBF24] -rotate-12 inline-block" />
            </div>
          </div>

          {/* Contact Line: P : 0123 456 7890 */}
          <div className="pt-1">
            <a
              href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
              className="font-sans font-bold text-sm sm:text-base text-white tracking-wider hover:text-amber-300 transition-colors flex items-center gap-2"
            >
              <span className="font-black text-amber-400">P :</span>
              <span>{banner.phone || '0123 456 7890'}</span>
            </a>
          </div>

          {/* Center Chalk Circle & ORDER NOW button with Curved Arrow */}
          <div className="pt-4 flex flex-wrap items-center gap-6">
            {/* White chalk sketched circle "Only 10 $" */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center text-center">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm"
              >
                <circle cx="60" cy="60" r="52" strokeDasharray="140 10 90 12" transform="rotate(-20 60 60)" />
                <circle cx="60" cy="60" r="46" strokeWidth="1.2" strokeDasharray="110 12 70 10" transform="rotate(30 60 60)" />
              </svg>
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className="text-sm font-bold text-white -rotate-2 leading-none"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {banner.discountBadgeSub || 'Only'}
                </span>
                <span className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight">
                  {banner.discountBadgeText || '10 $'}
                </span>
              </div>
            </div>

            {/* Arrow & ORDER NOW Pill Button */}
            <div className="flex flex-col items-start gap-1">
              {/* Hand-drawn arrow pointing down-left */}
              <svg
                viewBox="0 0 60 40"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="w-10 h-6 text-white ml-6 transform -rotate-12"
              >
                <path d="M 45 10 Q 30 25 18 28" />
                <path d="M 18 28 L 22 18" />
                <path d="M 18 28 L 30 30" />
              </svg>

              <button
                type="button"
                onClick={() =>
                  onOrderWhatsApp(banner.foodName || 'Burger', banner.offerPrice || 149, 'Burgundy Burger Billboard')
                }
                className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-sans font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{banner.buttonText || 'ORDER NOW'}</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Massive Towering Double Cheeseburger */}
        <div className="md:col-span-5 relative flex items-center justify-center">
          <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'burgundy-wave')}
              alt={banner.foodName || 'Burger'}
              className="w-full h-full object-contain filter drop-shadow-[0_30px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/burger_double.png';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================== */
/* 3. THEME: MIDNIGHT NAVY & TORN PAPER PIZZA (Match Reference 3)       */
/* ==================================================================== */
const NavyTornPizzaBanner: React.FC<{
  banner: BillboardBanner;
  onOrderWhatsApp: (dishName: string, price: number, category?: string) => void;
}> = ({ banner, onOrderWhatsApp }) => {
  return (
    <div className="relative w-full overflow-hidden select-none bg-[#0B1A30]">
      {/* Torn Paper White Edge & Golden Orange Corner */}
      <svg
        viewBox="0 0 1000 450"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Ragged White Torn Paper Border */}
        <path
          d="M 520 450 
             L 540 420 L 530 390 L 550 360 L 540 330 L 570 300 L 560 270 
             L 590 240 L 580 200 L 610 170 L 600 130 L 630 100 L 620 60 
             L 650 30 L 640 0 L 1000 0 L 1000 450 Z"
          fill="#FFFFFF"
          className="drop-shadow-lg"
        />
        {/* Inside Golden Yellow/Orange Fill */}
        <path
          d="M 535 450 
             L 555 420 L 545 390 L 565 360 L 555 330 L 585 300 L 575 270 
             L 605 240 L 595 200 L 625 170 L 615 130 L 645 100 L 635 60 
             L 665 30 L 655 0 L 1000 0 L 1000 450 Z"
          fill="#F59E0B"
        />
      </svg>

      {/* Decorative Star Crosses (+) in Yellow */}
      <span className="absolute top-12 left-1/3 text-amber-300 font-bold text-sm pointer-events-none opacity-70">+</span>
      <span className="absolute bottom-14 left-1/4 text-amber-300 font-bold text-base pointer-events-none opacity-70">+</span>
      <span className="absolute top-1/2 left-1/2 text-amber-300 font-bold text-xs pointer-events-none opacity-60">+</span>

      {/* Floating Basil Leaf (Top Right) & Cherry Tomato (Bottom Edge) */}
      <div className="absolute top-4 right-12 z-20 pointer-events-none hidden sm:block">
        <svg viewBox="0 0 40 40" className="w-8 h-8 rotate-45 drop-shadow-md">
          <path d="M 20 5 C 10 15 8 30 20 35 C 32 30 30 15 20 5 Z" fill="#22C55E" />
          <path d="M 20 5 Q 20 20 20 35" stroke="#15803D" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-[48%] z-20 pointer-events-none hidden md:block">
        <div className="w-7 h-7 rounded-full bg-red-600 shadow-lg border border-red-400 relative">
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-green-500 rounded-full" />
        </div>
      </div>

      {/* Top Left Logo Seal */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-10 z-20 flex items-center gap-2 pointer-events-none">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 flex items-center justify-center text-espresso-950 font-black shadow-sm">
          <Utensils className="w-4 h-4 text-[#0B1A30]" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[10px] sm:text-xs tracking-widest text-white uppercase">
            COFFEE LAND
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-amber-300 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-4 sm:p-8 lg:p-12 min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-2 sm:space-y-3 pt-6 sm:pt-4 z-10">
          {/* Script: Today's Special */}
          <div className="flex items-center gap-2 -mb-2">
            <span
              className="text-2xl sm:text-4xl md:text-5xl text-white font-bold italic -rotate-2 select-none filter drop-shadow-sm"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || "Today's Special"}
            </span>
            <span className="w-10 h-0.5 bg-amber-400 inline-block self-center ml-2 hidden sm:inline-block" />
          </div>

          {/* Giant Yellow Varsity Title: PIZZA */}
          <div className="relative leading-none py-1">
            <h2
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#FBBF24] tracking-wider filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-[0.85]"
              style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif" }}
            >
              {banner.foodName || 'PIZZA'}
            </h2>
            {/* Bold Yellow Underline Bar */}
            <div className="w-full max-w-[280px] sm:max-w-[360px] h-2 bg-[#FBBF24] mt-1 rounded-full shadow-xs" />
          </div>

          {/* Black Pill: LIMITED TIME OFFER (Borderless) */}
          <div className="pt-1">
            <span className="inline-block px-4 py-1 rounded-full bg-black/80 text-white font-sans font-black text-[11px] sm:text-xs tracking-widest uppercase shadow-xs">
              {banner.limitedOfferTag || 'LIMITED TIME OFFER'}
            </span>
          </div>

          {/* Free Delivery & Phone Number */}
          <div className="pt-4 flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest">
              {banner.deliveryNote || 'FREE DELIVERY'}
            </span>
            <a
              href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
              className="font-sans font-black text-lg sm:text-2xl text-white tracking-wider hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{banner.phone || '8568 0269 5476'}</span>
            </a>
          </div>

          {/* Chalk Oval Badge in Center: Price 15 $ */}
          <div className="pt-2">
            <div className="relative w-28 h-16 sm:w-32 sm:h-20 flex flex-col items-center justify-center text-center">
              <svg
                viewBox="0 0 140 80"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm"
              >
                <ellipse cx="70" cy="40" rx="64" ry="34" strokeDasharray="180 12 120 10" transform="rotate(-6 70 40)" />
                <ellipse cx="70" cy="40" rx="58" ry="28" strokeWidth="1.2" strokeDasharray="140 10 90 8" transform="rotate(8 70 40)" />
              </svg>
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span
                  className="text-xs sm:text-sm font-bold text-white leading-none -rotate-2"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {banner.discountBadgeSub || 'Price'}
                </span>
                <span className="font-sans font-black text-xl sm:text-2xl text-[#FBBF24] tracking-tight mt-0.5">
                  {banner.discountBadgeText || '15 $'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pizza in Dark Metallic Pan + ORDER NOW */}
        <div className="md:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'navy-torn')}
              alt={banner.foodName || 'Pizza Pan'}
              className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/pizza_pan.png';
              }}
            />

            {/* ORDER NOW button located on bottom-right of banner (Borderless) */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20">
              <button
                type="button"
                onClick={() =>
                  onOrderWhatsApp(banner.foodName || 'Pizza', banner.offerPrice || 199, 'Navy Torn Pizza Billboard')
                }
                className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-[#111111] hover:bg-black text-white font-sans font-black text-xs sm:text-sm tracking-wider uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{banner.buttonText || 'ORDER NOW'}</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
