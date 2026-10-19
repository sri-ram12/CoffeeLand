import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Utensils
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

  // Auto-scroll effect: advances every 4 seconds reliably when not hovered/paused
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
    <div
      className="w-full max-w-6xl mx-auto px-2 sm:px-6 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ============================================================ */}
      {/* BILLBOARD BANNER SLIDE FRAME (BORDERLESS & RECTANGULAR ON ALL SCREENS) */}
      {/* ============================================================ */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-0 border-none ring-0 outline-none shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
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

            {/* THEME 3: MIDNIGHT NAVY & TORN PAPER PIZZA */}
            {theme === 'navy-torn' && (
              <NavyTornPizzaBanner
                banner={currentBanner}
                onOrderWhatsApp={onOrderWhatsApp}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrow Overlays (Desktop Only so Mobile is completely uncluttered) */}
        {displayBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border-0 border-none items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border-0 border-none items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Carousel Pagination Dots */}
      {displayBanners.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {displayBanners.map((b, idx) => (
            <button
              key={b.id || idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 sm:w-8 bg-terracotta shadow-xs'
                  : 'w-2 sm:w-2.5 bg-neutral-400/50 hover:bg-neutral-600'
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
/* 1. THEME: WHITE BRICK WALL PIZZA BANNER                              */
/* Preserves wide rectangular proportion across mobile & desktop        */
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
      <div className="absolute top-2 right-2.5 sm:top-5 sm:right-7 z-20 flex items-center gap-1 sm:gap-1.5 text-red-600 pointer-events-none">
        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs">
          <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[8px] sm:text-xs tracking-widest text-red-600 uppercase">
            COFFEE LAND
          </span>
          <span className="text-[6px] sm:text-[9px] font-bold text-neutral-600 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid: 12-Column horizontal rectangular layout (Side-by-side on ALL screens) */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-2 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[210px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column (7 cols): Copy, Titles, CTA */}
        <div className="col-span-7 flex flex-col items-start text-left space-y-1 sm:space-y-2 md:space-y-3 z-10 pt-1 sm:pt-0">
          {/* SUPER + Delicious */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-sans font-black text-[8px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-[0.25em] uppercase text-neutral-900 bg-neutral-100/90 px-1.5 py-0.5 rounded shadow-2xs">
              {banner.highlightText || 'SUPER'}
            </span>
            <span
              className="text-sm sm:text-2xl md:text-3xl lg:text-4xl text-red-600 font-bold italic -rotate-3 select-none"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || 'Delicious'}
            </span>
          </div>

          {/* Giant Brush Title */}
          <div className="relative leading-none py-0.5 sm:py-1">
            <h2
              className="text-2xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-[#1A1A1A] tracking-tight filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] leading-[0.88]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {banner.foodName || 'Pizza'}
            </h2>
          </div>

          {/* MENU + LIMITED OFFER */}
          <div className="flex items-baseline gap-1.5 sm:gap-2.5 pt-0.5">
            <span className="font-sans font-black text-sm sm:text-2xl md:text-3xl lg:text-4xl text-red-600 tracking-wider">
              {banner.menuTag || 'MENU'}
            </span>
            <span className="font-sans font-black text-[8px] sm:text-xs md:text-sm lg:text-base text-neutral-900 tracking-wider sm:tracking-[0.25em] uppercase truncate">
              {banner.limitedOfferTag || 'LIMITED OFFER'}
            </span>
          </div>

          {/* CTA Button, Phone & Website */}
          <div className="pt-1 sm:pt-4 flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
            <button
              type="button"
              onClick={() =>
                onOrderWhatsApp(banner.foodName || 'Pizza', banner.offerPrice || 199, 'White Brick Billboard')
              }
              className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3.5 rounded-full bg-[#E52525] hover:bg-[#C91E1E] text-white font-sans font-black text-[9px] sm:text-xs md:text-sm tracking-wider uppercase shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>{banner.buttonText || 'ORDER NOW'}</span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <div className="flex flex-col">
              <a
                href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
                className="font-sans font-black text-[10px] sm:text-base md:text-xl text-neutral-950 tracking-wider hover:text-red-600 transition-colors flex items-center gap-0.5 sm:gap-1"
              >
                <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-600 shrink-0" />
                <span>{banner.phone || '323-517-4946'}</span>
              </a>
              <span className="text-[6px] sm:text-[10px] md:text-xs text-red-600 font-bold tracking-widest uppercase hidden xs:inline">
                {banner.websiteUrl || 'WWW.COFFEELAND.IN'}
              </span>
            </div>
          </div>

          {/* Free Home Delivery note */}
          <div className="relative pt-0.5 sm:pt-2 flex items-center gap-1.5 select-none">
            <span
              className="text-xs sm:text-lg md:text-2xl text-neutral-800 font-bold -rotate-3"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {banner.deliveryNote || 'Free Home Delivery'}
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Overhead Pizza & Discount Badge */}
        <div className="col-span-5 relative flex items-center justify-center">
          <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'white-brick')}
              alt={banner.foodName || 'Pizza'}
              className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/pizza_board.png';
              }}
            />

            {/* Hand-Drawn Sketch Circle "Get Up To 50% OFF" Badge */}
            <div className="absolute -top-1 -left-2 sm:-top-3 sm:-left-4 z-20">
              <div className="relative w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex flex-col items-center justify-center text-center p-1 sm:p-2 bg-white/70 sm:bg-transparent rounded-full backdrop-blur-2xs sm:backdrop-blur-none">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs hidden sm:block"
                >
                  <circle cx="60" cy="60" r="54" strokeDasharray="140 10 100 8" transform="rotate(-15 60 60)" />
                  <circle cx="60" cy="60" r="48" strokeWidth="1.2" strokeDasharray="120 8 80 12" transform="rotate(25 60 60)" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <span
                    className="text-[7px] sm:text-xs md:text-sm font-bold text-neutral-800 -rotate-2 leading-none"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {banner.discountBadgeSub || 'Get Up To'}
                  </span>
                  <span className="font-sans font-black text-xs sm:text-xl md:text-3xl lg:text-4xl text-red-600 leading-tight tracking-tight">
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
/* 2. THEME: BURGUNDY & YELLOW WAVE BURGER BANNER                       */
/* Preserves wide rectangular proportion across mobile & desktop        */
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

      {/* Top Left Logo Seal */}
      <div className="absolute top-2 left-2.5 sm:top-5 sm:left-10 z-20 flex items-center gap-1 sm:gap-2 pointer-events-none">
        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-amber-400 flex items-center justify-center text-espresso-950 font-black shadow-sm">
          <Utensils className="w-3 h-3 sm:w-4 sm:h-4 text-[#2E070F]" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[8px] sm:text-xs tracking-widest text-white uppercase">
            COFFEE LAND
          </span>
          <span className="text-[6px] sm:text-[9px] font-bold text-amber-300 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid: 12-Column horizontal rectangular layout (Side-by-side on ALL screens) */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-2 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[210px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column (7 cols): Copy, Brush Title, Price Circle, CTA */}
        <div className="col-span-7 flex flex-col items-start text-left space-y-1 sm:space-y-2 md:space-y-3 pt-3 sm:pt-4 z-10">
          {/* Cursive "Special fresh" */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="text-sm sm:text-2xl md:text-4xl lg:text-5xl text-[#FBBF24] font-bold italic -rotate-3 select-none filter drop-shadow-xs"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || 'Special fresh'}
            </span>
          </div>

          {/* Big White Brush "Burger" Title */}
          <div className="relative leading-none py-0.5 sm:py-1">
            <h2
              className="text-2xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tight filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] leading-[0.88]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {banner.foodName || 'Burger'}
            </h2>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 pl-1">
              <span className="w-2.5 sm:w-4 h-1 sm:h-2 rounded-full bg-[#FBBF24] rotate-45 inline-block" />
              <span className="w-4 sm:w-6 h-1 sm:h-2 rounded-full bg-[#FBBF24] -rotate-12 inline-block" />
            </div>
          </div>

          {/* Contact Line */}
          <div className="pt-0.5">
            <a
              href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
              className="font-sans font-bold text-[9px] sm:text-sm md:text-base text-white tracking-wider hover:text-amber-300 transition-colors flex items-center gap-1 sm:gap-2"
            >
              <span className="font-black text-amber-400">P :</span>
              <span>{banner.phone || '0123 456 7890'}</span>
            </a>
          </div>

          {/* Center Chalk Circle & ORDER NOW button */}
          <div className="pt-1 sm:pt-3 flex flex-wrap items-center gap-2 sm:gap-6">
            {/* White chalk sketched circle */}
            <div className="relative w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 flex flex-col items-center justify-center text-center">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs"
              >
                <circle cx="60" cy="60" r="52" strokeDasharray="140 10 90 12" transform="rotate(-20 60 60)" />
                <circle cx="60" cy="60" r="46" strokeWidth="1.2" strokeDasharray="110 12 70 10" transform="rotate(30 60 60)" />
              </svg>
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className="text-[7px] sm:text-xs md:text-sm font-bold text-white -rotate-2 leading-none"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {banner.discountBadgeSub || 'Only'}
                </span>
                <span className="font-sans font-black text-xs sm:text-xl md:text-3xl text-white leading-tight">
                  {banner.discountBadgeText || '10 $'}
                </span>
              </div>
            </div>

            {/* ORDER NOW Pill Button */}
            <div className="flex flex-col items-start gap-0.5">
              <button
                type="button"
                onClick={() =>
                  onOrderWhatsApp(banner.foodName || 'Burger', banner.offerPrice || 149, 'Burgundy Burger Billboard')
                }
                className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-sans font-black text-[9px] sm:text-xs md:text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{banner.buttonText || 'ORDER NOW'}</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Towering Double Cheeseburger */}
        <div className="col-span-5 relative flex items-center justify-center">
          <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'burgundy-wave')}
              alt={banner.foodName || 'Burger'}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
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
/* 3. THEME: MIDNIGHT NAVY & TORN PAPER PIZZA                           */
/* Preserves wide rectangular proportion across mobile & desktop        */
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
        <path
          d="M 520 450 
             L 540 420 L 530 390 L 550 360 L 540 330 L 570 300 L 560 270 
             L 590 240 L 580 200 L 610 170 L 600 130 L 630 100 L 620 60 
             L 650 30 L 640 0 L 1000 0 L 1000 450 Z"
          fill="#FFFFFF"
          className="drop-shadow-lg"
        />
        <path
          d="M 535 450 
             L 555 420 L 545 390 L 565 360 L 555 330 L 585 300 L 575 270 
             L 605 240 L 595 200 L 625 170 L 615 130 L 645 100 L 635 60 
             L 665 30 L 655 0 L 1000 0 L 1000 450 Z"
          fill="#F59E0B"
        />
      </svg>

      {/* Top Left Logo Seal */}
      <div className="absolute top-2 left-2.5 sm:top-5 sm:left-10 z-20 flex items-center gap-1 sm:gap-2 pointer-events-none">
        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-amber-400 flex items-center justify-center text-espresso-950 font-black shadow-sm">
          <Utensils className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B1A30]" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-sans font-black text-[8px] sm:text-xs tracking-widest text-white uppercase">
            COFFEE LAND
          </span>
          <span className="text-[6px] sm:text-[9px] font-bold text-amber-300 tracking-wider uppercase">
            RESTO & CAFE
          </span>
        </div>
      </div>

      {/* Grid: 12-Column horizontal rectangular layout (Side-by-side on ALL screens) */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-2 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[210px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[460px]">
        {/* Left Column (7 cols): Copy, Varsity Title, Oval Badge, Delivery */}
        <div className="col-span-7 flex flex-col items-start text-left space-y-1 sm:space-y-2 md:space-y-3 pt-3 sm:pt-4 z-10">
          {/* Script: Today's Special */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="text-sm sm:text-2xl md:text-4xl lg:text-5xl text-white font-bold italic -rotate-2 select-none filter drop-shadow-xs"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              {banner.scriptText || "Today's Special"}
            </span>
            <span className="w-6 sm:w-10 h-0.5 bg-amber-400 inline-block self-center ml-1 sm:ml-2 hidden sm:inline-block" />
          </div>

          {/* Giant Yellow Varsity Title: PIZZA */}
          <div className="relative leading-none py-0.5 sm:py-1">
            <h2
              className="text-2xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-[#FBBF24] tracking-wider filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-[0.85]"
              style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif" }}
            >
              {banner.foodName || 'PIZZA'}
            </h2>
            <div className="w-full max-w-[140px] sm:max-w-[280px] md:max-w-[360px] h-1 sm:h-2 bg-[#FBBF24] mt-0.5 sm:mt-1 rounded-full shadow-xs" />
          </div>

          {/* Black Pill: LIMITED TIME OFFER */}
          <div className="pt-0.5">
            <span className="inline-block px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-full bg-black/80 text-white font-sans font-black text-[7px] sm:text-[10px] md:text-xs tracking-widest uppercase shadow-xs">
              {banner.limitedOfferTag || 'LIMITED TIME OFFER'}
            </span>
          </div>

          {/* Free Delivery & Phone Number */}
          <div className="pt-1 sm:pt-3 flex flex-col">
            <span className="text-[7px] sm:text-[10px] md:text-xs font-bold text-amber-300 uppercase tracking-widest">
              {banner.deliveryNote || 'FREE DELIVERY'}
            </span>
            <a
              href={`tel:${banner.phone?.replace(/[^0-9+]/g, '') || '+919542525665'}`}
              className="font-sans font-black text-[10px] sm:text-base md:text-2xl text-white tracking-wider hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{banner.phone || '8568 0269 5476'}</span>
            </a>
          </div>

          {/* Chalk Oval Badge: Price */}
          <div className="pt-0.5 sm:pt-2">
            <div className="relative w-16 h-8 sm:w-24 sm:h-12 md:w-32 md:h-20 flex flex-col items-center justify-center text-center">
              <svg
                viewBox="0 0 140 80"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs"
              >
                <ellipse cx="70" cy="40" rx="64" ry="34" strokeDasharray="180 12 120 10" transform="rotate(-6 70 40)" />
                <ellipse cx="70" cy="40" rx="58" ry="28" strokeWidth="1.2" strokeDasharray="140 10 90 8" transform="rotate(8 70 40)" />
              </svg>
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span
                  className="text-[7px] sm:text-xs font-bold text-white leading-none -rotate-2"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {banner.discountBadgeSub || 'Price'}
                </span>
                <span className="font-sans font-black text-xs sm:text-lg md:text-2xl text-[#FBBF24] tracking-tight mt-0.5">
                  {banner.discountBadgeText || '15 $'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Pizza in Dark Metallic Pan + ORDER NOW */}
        <div className="col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <img
              src={getCleanBannerImage(banner.image, 'navy-torn')}
              alt={banner.foodName || 'Pizza Pan'}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/banners/pizza_pan.png';
              }}
            />

            {/* ORDER NOW button located on bottom-right of banner */}
            <div className="absolute bottom-1 right-1 sm:bottom-4 sm:right-4 z-20">
              <button
                type="button"
                onClick={() =>
                  onOrderWhatsApp(banner.foodName || 'Pizza', banner.offerPrice || 199, 'Navy Torn Pizza Billboard')
                }
                className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full bg-[#111111] hover:bg-black text-white font-sans font-black text-[9px] sm:text-xs md:text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{banner.buttonText || 'ORDER NOW'}</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
