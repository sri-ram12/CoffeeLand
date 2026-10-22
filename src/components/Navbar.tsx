import React, { useState, useEffect } from 'react';
import {
  Home,
  Coffee,
  Heart,
  Menu as MenuIcon,
  X,
  QrCode,
  Camera,
  Utensils,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Image as ImageIcon,
  Flame,
  Settings,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NavbarProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenQRCode?: () => void;
  onOpenReviewModal: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoriteCount,
  onOpenFavorites,
  onOpenQRCode,
  onOpenReviewModal,
  cartCount = 0,
  onOpenCart,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  const navLinks = [
    { label: 'HOME', href: '#home', icon: Home, hint: 'Home Page' },
    { label: 'ALL ITEMS', href: '#menu', icon: Utensils, hint: 'Explore Menu by Category' },
    { label: 'LIVE PREPARATION', href: '#live-reels', icon: Flame, hint: 'Live Food Preparation Reels' },
    { label: 'FEATURED', href: '#featured', icon: Sparkles, hint: 'Featured Specials' },
    { label: 'OUR STORY', href: '#about', icon: Coffee, hint: 'Our Story & Cafe Heritage' },
    { label: 'GALLERY', href: '#gallery', icon: ImageIcon, hint: 'Cafe Photo Gallery' },
    { label: 'LOCATION', href: '#contact', icon: MapPin, hint: 'Location & Google Maps' },
    { label: 'REVIEWS & RATINGS', href: '#reviews', icon: Star, hint: 'Customer Reviews & Ratings (4.7 ★)' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Detect current section on scroll (Reviews is at bottom!)
      const sections = ['#reviews', '#contact', '#gallery', '#about', '#featured', '#live-reels', '#menu', '#home'];
      const scrollPosition = window.scrollY + 140;

      for (const sectionId of sections) {
        const el = document.querySelector(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(href);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#EDE0CC]/95 backdrop-blur-md border-b border-terracotta/20 py-2.5 shadow-md'
            : 'bg-gradient-to-b from-[#EDE0CC]/95 via-[#EDE0CC]/80 to-transparent py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo with Official Circular Logo */}
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, '#home')}
              className="flex items-center gap-3 group focus:outline-none shrink-0"
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.12, rotate: 8 }}
              >
                {/* Dynamic breathing glowing ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-terracotta to-caramel opacity-70 blur-[3px] animate-pulse pointer-events-none" />
                <img
                  src="/logo.png"
                  alt="Coffee Land Resto & Cafe Official Logo"
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-terracotta shadow-md transition-transform"
                />
              </motion.div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif tracking-tight text-xl sm:text-2xl font-bold text-espresso-950 group-hover:text-terracotta transition-colors leading-none">
                  Coffee <span className="font-serif italic font-semibold text-terracotta">Land</span>
                </span>
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] tracking-wider sm:tracking-[0.22em] uppercase text-terracotta-700 font-bold mt-0.5 sm:mt-1 font-heading truncate max-w-[170px] xs:max-w-none">
                  RESTO & CAFE • THAGARAPUVALASA
                </span>
              </div>
            </a>

            {/* Desktop Navigation - Iconic Options Instead of Names with High-End Tooltips */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-white/95 border border-terracotta/25 px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              {navLinks.map((link) => {
                const IconComp = link.icon;
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`relative group p-2.5 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95 ${
                      isActive
                        ? 'bg-terracotta text-white shadow-sm ring-2 ring-terracotta/30'
                        : 'text-espresso-800 hover:text-white hover:bg-terracotta/90 bg-transparent'
                    }`}
                    title={link.label}
                    aria-label={link.label}
                  >
                    <IconComp className="w-[18px] h-[18px] transition-transform group-hover:scale-110" />

                    {/* Elegant Tooltip Bubble on Hover */}
                    <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 z-50 flex flex-col items-center">
                      <div className="w-2 h-2 bg-espresso-950 rotate-45 -mb-1 shadow-xs" />
                      <span className="bg-espresso-950 text-white text-[11px] font-heading font-semibold py-1 px-2.5 rounded-md shadow-xl whitespace-nowrap tracking-wide border border-terracotta/30">
                        {link.label}
                      </span>
                    </div>
                  </a>
                );
              })}
            </nav>

            {/* Fast Action Tools: App QR/PWA, Write Review, Favorites & Mobile Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* App QR & PWA Install Button at the very TOP */}
              {onOpenQRCode && (
                <button
                  onClick={onOpenQRCode}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-terracotta/20 hover:from-amber-500/30 hover:to-terracotta/30 text-espresso-950 border border-terracotta/40 text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Scan QR to open website & install PWA app on mobile"
                  aria-label="Scan QR & Download App"
                >
                  <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terracotta" />
                  <span className="hidden sm:inline font-bold">App QR</span>
                </button>
              )}

              {/* Upload Photo & Review Button */}
              <button
                onClick={onOpenReviewModal}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                title="Share your review and photos"
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Write Review</span>
                <span className="xs:hidden">Review</span>
              </button>

              {/* Favorites Button with Counter Badge */}
              <button
                onClick={onOpenFavorites}
                className="relative p-2 sm:p-2.5 rounded-full bg-white border border-terracotta/30 text-espresso-800 hover:text-terracotta hover:border-terracotta transition-all duration-200 shadow-sm shrink-0"
                title="View Bookmarked Favorites"
                aria-label="Favorites"
              >
                <Heart className="w-4 h-4 text-terracotta" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white font-bold text-[9px] sm:text-[10px] flex items-center justify-center shadow-md animate-pulse">
                    {favoriteCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-full bg-white text-espresso-900 hover:text-terracotta border border-terracotta/30 focus:outline-none shadow-sm shrink-0"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-[#EDE0CC]/98 border-b border-terracotta/25 backdrop-blur-xl px-6 py-6 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              {/* Scan QR & Download PWA App for Mobile */}
              {onOpenQRCode && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQRCode();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-terracotta/20 border-2 border-terracotta/40 text-espresso-950 font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-terracotta" />
                  <span>SCAN QR & INSTALL APP (PWA) 📱</span>
                </button>
              )}
              {/* Prominent Mobile Orders on WhatsApp Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  if (cartCount > 0 && onOpenCart) {
                    onOpenCart();
                  } else {
                    const el = document.querySelector('#menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 ring-2 ring-emerald-400/40"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>ORDERS ON WHATSAPP (SELECT FOOD ITEMS)</span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 bg-white text-emerald-800 rounded-full text-xs font-black">
                    {cartCount}
                  </span>
                )}
              </button>

              {navLinks.map((link) => {
                const IconComp = link.icon;
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between shadow-xs group ${
                      isActive
                        ? 'bg-terracotta text-white border-terracotta shadow-sm'
                        : 'bg-white border-terracotta/15 text-espresso-950 hover:text-white hover:bg-terracotta'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-parchment-200 text-terracotta group-hover:bg-white/20 group-hover:text-white'
                        }`}
                      >
                        <IconComp className="w-4 h-4 transition-colors" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <span
                      className={`text-xs transition-colors ${
                        isActive ? 'text-white' : 'text-terracotta group-hover:text-white'
                      }`}
                    >
                      ➔
                    </span>
                  </a>
                );
              })}

              <div className="pt-3 border-t border-terracotta/20 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReviewModal();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-terracotta text-white text-xs font-bold shadow-md hover:bg-terracotta-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Write Review</span>
                </button>

                <a
                  href="https://maps.app.goo.gl/Xkpi9H6ueRbUqH4UA"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-emerald-500/40 text-espresso-950 text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors"
                  title="Open in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
