import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Settings,
  MessageCircle,
  Percent,
  CheckCircle2,
  Gift,
  Play,
  Pause
} from 'lucide-react';
import { OfferBanner, BannerColorTheme } from '../types/banner';

interface OfferBannersSectionProps {
  banners: OfferBanner[];
  onOpenAdmin: () => void;
  onClaimOffer: (banner: OfferBanner) => void;
}

export const OfferBannersSection: React.FC<OfferBannersSectionProps> = ({
  banners,
  onOpenAdmin,
  onClaimOffer,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!banners || banners.length === 0) return null;

  // Auto-scroll loop every 3.8 seconds if not paused
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const cardWidth = container.firstElementChild?.clientWidth || 380;
      const gap = 20; // 1.25rem gap
      const step = cardWidth + gap;

      if (container.scrollLeft + step >= maxScrollLeft - 10) {
        // Smoothly loop back to start
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentIndex(0);
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  // Listen to user scroll to update active dot
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 380;
    const newIdx = Math.round(container.scrollLeft / (cardWidth + 20));
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < banners.length) {
      setCurrentIndex(newIdx);
    }
  };

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 380;
    container.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 380;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 380;
    container.scrollTo({ left: index * (cardWidth + 20), behavior: 'smooth' });
    setCurrentIndex(index);
  };

  const handleCopyPromo = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  // Helper function for banner theme colors
  const getBannerThemeClasses = (theme: BannerColorTheme) => {
    switch (theme) {
      case 'terracotta':
        return {
          gradient: 'from-[#802B12] via-[#943216] to-[#5C1D0B]',
          border: 'border-[#A94324]/50',
          badgeBg: 'bg-white/20 text-white',
          accentText: 'text-amber-200',
          btnBg: 'bg-white text-[#802B12] hover:bg-amber-50',
          glow: 'rgba(128, 43, 18, 0.45)',
        };
      case 'emerald':
        return {
          gradient: 'from-[#0E5A3A] via-[#147A4E] to-[#0A3D27]',
          border: 'border-emerald-400/40',
          badgeBg: 'bg-white/20 text-white',
          accentText: 'text-emerald-200',
          btnBg: 'bg-white text-[#0E5A3A] hover:bg-emerald-50',
          glow: 'rgba(14, 90, 58, 0.45)',
        };
      case 'amber':
        return {
          gradient: 'from-[#9E6F34] via-[#B8823F] to-[#784F1E]',
          border: 'border-amber-300/40',
          badgeBg: 'bg-white/25 text-white',
          accentText: 'text-amber-100',
          btnBg: 'bg-[#2B1B16] text-[#FAF6EE] hover:bg-espresso-950',
          glow: 'rgba(184, 130, 63, 0.45)',
        };
      case 'espresso':
        return {
          gradient: 'from-[#2B1B16] via-[#3D2720] to-[#150C08]',
          border: 'border-amber-700/40',
          badgeBg: 'bg-amber-500/20 text-amber-200',
          accentText: 'text-amber-300',
          btnBg: 'bg-terracotta text-white hover:bg-terracotta-600',
          glow: 'rgba(43, 27, 22, 0.5)',
        };
      case 'crimson':
        return {
          gradient: 'from-[#8C1D40] via-[#A8264E] to-[#610E29]',
          border: 'border-rose-400/40',
          badgeBg: 'bg-white/20 text-white',
          accentText: 'text-rose-200',
          btnBg: 'bg-white text-[#8C1D40] hover:bg-rose-50',
          glow: 'rgba(140, 29, 64, 0.45)',
        };
      case 'violet':
        return {
          gradient: 'from-[#502368] via-[#6D328C] to-[#361347]',
          border: 'border-purple-300/40',
          badgeBg: 'bg-white/20 text-white',
          accentText: 'text-purple-200',
          btnBg: 'bg-white text-[#502368] hover:bg-purple-50',
          glow: 'rgba(80, 35, 104, 0.45)',
        };
      case 'ocean':
      default:
        return {
          gradient: 'from-[#0E4D64] via-[#166E8F] to-[#083545]',
          border: 'border-cyan-400/40',
          badgeBg: 'bg-white/20 text-white',
          accentText: 'text-cyan-200',
          btnBg: 'bg-white text-[#0E4D64] hover:bg-cyan-50',
          glow: 'rgba(14, 77, 100, 0.45)',
        };
    }
  };

  return (
    <section className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8 overflow-hidden">
      {/* Header Bar: Offers Heading & Scroll Controls & Admin Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-terracotta/15 flex items-center justify-center text-terracotta shrink-0 shadow-xs">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-black text-lg sm:text-xl text-espresso-950">
                Today's Exclusive Offers & Combos
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
                {banners.length} Live Deals
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-coffee-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300/60">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Auto-Scrolling • Hover to Pause</span>
              </span>
            </div>
            <p className="text-xs text-coffee-700 font-medium">
              Order directly on WhatsApp to claim exclusive discounts at Coffee Land
            </p>
          </div>
        </div>

        {/* Action Controls: Scroll Left/Right, Pause Toggle, Admin Console */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-full border border-terracotta/20 shadow-xs">
            <button
              onClick={scrollLeft}
              className="p-1.5 rounded-full hover:bg-terracotta hover:text-white text-espresso-800 transition-colors"
              title="Scroll previous offer banner"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full hover:bg-amber-100 text-espresso-800 transition-colors text-xs font-semibold px-2"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-terracotta" /> : <Pause className="w-3.5 h-3.5 text-coffee-700" />}
            </button>
            <button
              onClick={scrollRight}
              className="p-1.5 rounded-full hover:bg-terracotta hover:text-white text-espresso-800 transition-colors"
              title="Scroll next offer banner"
              aria-label="Next Offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Customize Banners Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-espresso-900 border border-terracotta/30 text-xs font-bold transition-all shadow-xs hover:border-terracotta group shrink-0"
            title="Open Admin Panel to manage banners & food items"
          >
            <Settings className="w-3.5 h-3.5 text-terracotta group-hover:rotate-45 transition-transform" />
            <span className="hidden md:inline">Admin: Customize</span>
            <span className="md:hidden">Admin</span>
          </button>
        </div>
      </div>

      {/* RECTANGULAR SHAPE OFFER BANNERS SCROLLING TRACK */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2.5 px-1 scroll-smooth select-none cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {banners.map((banner, index) => {
          const theme = getBannerThemeClasses(banner.themeColor);
          const savings = banner.originalPrice - banner.offerPrice;

          return (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`w-[85vw] max-w-[340px] sm:w-[380px] md:w-[420px] shrink-0 snap-start relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.gradient} ${theme.border} border-2 shadow-lg p-4 sm:p-6 text-white flex flex-col justify-between min-h-[215px] transition-all hover:-translate-y-1 hover:shadow-2xl group`}
              style={{
                boxShadow: `0 14px 28px -10px ${theme.glow}`,
              }}
            >
              {/* Ambient Background Graphic Accent */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

              {/* Top Row: Promo Badge & Discount Pill */}
              <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Special Deal</span>
                  </span>
                  {banner.discountLabel && (
                    <span className={`px-2.5 py-1 rounded-full ${theme.badgeBg} backdrop-blur-md text-xs font-black tracking-wider uppercase`}>
                      {banner.discountLabel}
                    </span>
                  )}
                </div>

                {/* Promo Code Copy Pill */}
                {banner.promoCode && (
                  <button
                    type="button"
                    onClick={() => handleCopyPromo(banner.promoCode)}
                    className="px-2.5 py-0.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors shrink-0"
                    title="Click to copy promo code"
                  >
                    {copiedCode === banner.promoCode ? 'COPIED!' : banner.promoCode}
                  </button>
                )}
              </div>

              {/* Middle Section: Item Name, Description & Image */}
              <div className="relative z-10 grid grid-cols-12 gap-3 items-center my-1">
                {/* Text Side (8 cols) */}
                <div className="col-span-8 flex flex-col justify-center">
                  <h4 className="font-serif font-black text-lg sm:text-xl text-white leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                    {banner.title || banner.itemName}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1 font-light leading-relaxed">
                    {banner.subtitle || banner.itemName}
                  </p>

                  {/* Price Comparison */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black text-2xl sm:text-3xl text-white leading-none">
                      ₹{banner.offerPrice}
                    </span>
                    {banner.originalPrice > banner.offerPrice && (
                      <span className="text-xs sm:text-sm text-white/60 line-through font-semibold">
                        ₹{banner.originalPrice}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className={`text-[10px] font-extrabold ${theme.accentText}`}>
                        Save ₹{savings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rectangular / Circular Food Picture (4 cols) */}
                <div className="col-span-4 relative flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/40 shadow-md bg-black/20 shrink-0 transform group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
                    <img
                      src={banner.image}
                      alt={banner.itemName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Row: Validity Note & WhatsApp Button */}
              <div className="relative z-10 flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/15">
                <span className="text-[10px] text-white/75 flex items-center gap-1 font-medium truncate">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{banner.expiryNote || 'Limited Cafe Offer'}</span>
                </span>

                {/* Direct WhatsApp Claim Button */}
                <button
                  type="button"
                  onClick={() => onClaimOffer(banner)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${theme.btnBg} text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 shrink-0`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Claim on WhatsApp</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Dots Pagination */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-6 h-2 bg-terracotta shadow-xs'
                : 'w-2 h-2 bg-terracotta/25 hover:bg-terracotta/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
