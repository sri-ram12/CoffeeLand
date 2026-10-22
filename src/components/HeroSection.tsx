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
  onOrderWhatsApp?: (dishName: string, price: number, category?: string) => void;
  onSelectBillboardBanner?: (banner: BillboardBanner) => void;
  onOpenQRCode?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  billboardBanner,
  billboardBanners = [],
  onOrderWhatsApp = () => {},
  onSelectBillboardBanner = () => {},
  onOpenQRCode
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
      phone: '+91 90329 92524',
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
      className="relative flex flex-col justify-start pt-20 sm:pt-24 pb-8 sm:pb-10 overflow-hidden bg-[#EDE0CC]"
    >
      {/* Lightweight & Subtle Cafe Ambient Decor */}
      <HeroBackgroundDecor />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">
        {/* ============================================================ */}
        {/* OFFICIAL BRANDING HERO */}
        {/* ============================================================ */}
        <div className="text-center flex flex-col items-center max-w-4xl mx-auto mb-6 sm:mb-8">
          {/* Refined Brand Logo Emblem */}
          <div className="relative mb-3 group cursor-pointer" onClick={() => scrollTo('menu')}>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-terracotta via-amber-400 to-[#5C1F0E] shadow-xl">
              <img
                src="/logo.png"
                alt="Coffee Land Resto & Cafe"
                className="w-full h-full rounded-full object-cover border-2 border-white/80 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Official Ribbon Tag */}
          <div className="inline-block bg-terracotta border-2 border-terracotta-600 px-3 xs:px-4 sm:px-5 py-1 rounded-xl shadow-md mb-2.5 max-w-[95vw]">
            <span className="font-heading font-bold text-white tracking-wider sm:tracking-widest text-[9px] xs:text-[10px] sm:text-xs uppercase block text-center">
              GOOD FOOD • GREAT COFFEE • BETTER TOGETHER
            </span>
          </div>

          {/* Main Brand Title: COFFEE LAND */}
          <h1 className="font-display tracking-wider text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-espresso-950 uppercase mb-0.5 px-2">
            COFFEE LAND
          </h1>

          {/* Cursive Subtitle: Resto & Cafe in Maroon */}
          <p className="font-handwriting text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#800000] font-bold mb-2 px-2 tracking-wide">
            Resto & Cafe
          </p>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-sm md:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
            Artisanal coffee, handcrafted wood-fired pizzas, gourmet brioche burgers & authentic desserts made fresh daily in Sangivalasa, Vizag.
          </p>

          {/* Direct Action Buttons - Clean & Essential */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              onClick={() => scrollTo('menu')}
              className="px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Explore Menu (150+ Items)
            </button>

            <button
              onClick={() => scrollTo('menu')}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              title="Explore Menu & Order Online via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BILLBOARD HERO BANNER (MATCHING REFERENCE USER IMAGE) */}
        {/* ============================================================ */}
        <div id="featured-banner" className="w-full scroll-mt-20">
          <BillboardHeroBanner
            banner={currentBillboard}
            bannersList={billboardBanners}
            onOrderWhatsApp={onOrderWhatsApp}
            onSelectBanner={onSelectBillboardBanner}
          />

          {/* 5 Bottom Feature Badges (Borderless & Clean) */}
          <div className="mt-6 pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-[10px] xs:text-xs font-bold text-coffee-800 uppercase tracking-wider">
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
