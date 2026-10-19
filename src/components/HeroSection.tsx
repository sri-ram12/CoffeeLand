import React from 'react';
import {
  MessageCircle
} from 'lucide-react';
import { BillboardBanner } from '../types/banner';
import { HeroBackgroundDecor } from './HeroBackgroundDecor';
import { BillboardHeroBanner } from './BillboardHeroBanner';

interface HeroSectionProps {
  billboardBanner?: BillboardBanner;
  billboardBanners?: BillboardBanner[];
  onOpenAdmin?: () => void;
  onOrderWhatsApp?: (dishName: string, price: number, category?: string) => void;
  onSelectBillboardBanner?: (banner: BillboardBanner) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  billboardBanner,
  billboardBanners = [],
  onOpenAdmin = () => {},
  onOrderWhatsApp = () => {},
  onSelectBillboardBanner = () => {}
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback billboard banner if not passed
  const currentBillboard: BillboardBanner =
    billboardBanner ||
    (billboardBanners.length > 0 ? billboardBanners[0] : {
      id: 'billboard-default',
      highlightText: 'SUPER',
      scriptText: 'Delicious',
      foodName: 'Pizza',
      menuTag: 'MENU',
      limitedOfferTag: 'LIMITED OFFER',
      discountBadgeText: '50% OFF',
      discountBadgeSub: 'Get Up To',
      deliveryNote: 'Free Home Delivery',
      phone: '323-517-4946',
      websiteUrl: 'www.coffeeland.in',
      buttonText: 'ORDER NOW',
      image: '/banners/pizza_board.png',
      accentColor: '#DC2626',
      isActive: true,
      originalPrice: 399,
      offerPrice: 199
    });

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col justify-start pt-24 sm:pt-28 pb-16 overflow-hidden bg-[#EDE0CC]"
    >
      {/* Lightweight & Subtle Cafe Ambient Decor */}
      <HeroBackgroundDecor />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">
        {/* ============================================================ */}
        {/* OFFICIAL BRANDING HERO */}
        {/* ============================================================ */}
        <div className="text-center flex flex-col items-center max-w-4xl mx-auto mb-10 sm:mb-14">
          {/* Refined Brand Logo Emblem */}
          <div className="relative mb-4 group cursor-pointer" onClick={() => scrollTo('featured-banner')}>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-terracotta via-amber-400 to-[#5C1F0E] shadow-xl">
              <img
                src="/logo.png"
                alt="Coffee Land Resto & Cafe"
                className="w-full h-full rounded-full object-cover border-2 border-white/80 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Official Ribbon Tag */}
          <div className="inline-block bg-terracotta border-2 border-terracotta-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl shadow-md mb-3 max-w-[95vw]">
            <span className="font-heading font-bold text-white tracking-wider sm:tracking-widest text-[10px] sm:text-xs md:text-sm uppercase block text-center">
              GOOD FOOD • GREAT COFFEE • BETTER TOGETHER
            </span>
          </div>

          {/* Main Title: COFFEE LAND RESTO & CAFE */}
          <h1 className="font-display tracking-wider text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-espresso-950 uppercase mb-2 px-2">
            COFFEE LAND RESTO & CAFE
          </h1>

          {/* Cursive Subtitle: Official Menu & Culinary Collection • Vizag */}
          <p className="font-handwriting text-xl sm:text-3xl md:text-4xl text-terracotta font-bold mb-3 px-2">
            Official Menu & Culinary Collection • Vizag
          </p>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
            Every handcrafted specialty from our official printed menu — explore all 6 pages with authentic pricing, chef recipes, and download options.
          </p>

          {/* Direct Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => scrollTo('menu')}
              className="px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Explore 150+ Menu
            </button>

            <button
              onClick={() => scrollTo('featured-banner')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-amber-50 text-espresso-950 border border-terracotta/30 font-bold text-xs sm:text-sm shadow-xs transition-all hover:border-terracotta"
            >
              Featured Promo Banner
            </button>

            <button
              onClick={() => onOrderWhatsApp('Specialty Coffee & Food Inquiry', 0, 'General')}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BILLBOARD HERO BANNER (MATCHING REFERENCE USER IMAGE) */}
        {/* Replaces the old today exclusive offers deals */}
        {/* ============================================================ */}
        <div id="featured-banner" className="w-full scroll-mt-20">
          <BillboardHeroBanner
            banner={currentBillboard}
            bannersList={billboardBanners}
            onOpenAdmin={onOpenAdmin}
            onOrderWhatsApp={onOrderWhatsApp}
            onSelectBanner={onSelectBillboardBanner}
          />

          {/* 5 Bottom Feature Badges (Borderless) */}
          <div className="mt-12 pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-coffee-800 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Artisanal Coffee</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Brioche Burgers</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Stone-Baked Pizza</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Lotus Biscoff Kunafa</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Dine-In & Takeaway</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
