import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Heart,
  Menu as MenuIcon,
  X,
  QrCode,
  Camera,
  Utensils,
  BookOpen,
  Phone,
  Sparkles,
  Search,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NavbarProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenQRCode: () => void;
  onOpenReviewModal: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoriteCount,
  onOpenFavorites,
  onOpenQRCode,
  onOpenReviewModal,
  onOpenAdmin = () => {},
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ALL ITEMS', href: '#menu' },
    { label: 'FULL MENU (PDF)', href: '#full-menu-showcase' },
    { label: 'FEATURED', href: '#featured' },
    { label: 'REVIEWS & PHOTOS', href: '#reviews' },
    { label: 'OUR STORY', href: '#about' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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
            ? 'bg-[#FAF6EE]/95 backdrop-blur-md border-b border-terracotta/20 py-2.5 shadow-md'
            : 'bg-gradient-to-b from-[#FAF6EE]/95 via-[#FAF6EE]/80 to-transparent py-3.5'
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
              <div className="flex flex-col">
                <span className="font-display tracking-wider text-xl sm:text-2xl font-bold text-espresso-950 group-hover:text-terracotta transition-colors leading-none">
                  COFFEE <span className="text-terracotta">LAND</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-terracotta-700 font-bold mt-0.5">
                  RESTO & CAFE • VIZAG
                </span>
              </div>
            </a>

            {/* Desktop Navigation - Pill Options */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-white/90 border border-terracotta/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-3 py-1 rounded-full text-xs font-heading font-bold text-espresso-800 hover:text-white hover:bg-terracotta transition-all tracking-wider uppercase"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Fast Action Tools: QR, Review, Favorites */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Scan QR Modal Trigger */}
              <button
                onClick={onOpenQRCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-parchment-200 text-espresso-900 border border-terracotta/30 hover:border-terracotta text-xs font-bold transition-all shadow-sm"
                title="Scan Website QR Code"
              >
                <QrCode className="w-4 h-4 text-terracotta" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>

              {/* Upload Photo & Review Button */}
              <button
                onClick={onOpenReviewModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                title="Share your review and photos"
              >
                <Camera className="w-4 h-4" />
                <span>Write Review</span>
              </button>

              {/* Separate Owner Admin Portal Link */}
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-espresso-950 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                title="Dedicated Owner Admin Portal (/admin)"
              >
                <Settings className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden xl:inline">Admin</span>
              </Link>

              {/* Favorites Button with Counter Badge */}
              <button
                onClick={onOpenFavorites}
                className="relative p-2.5 rounded-full bg-white border border-terracotta/30 text-espresso-800 hover:text-terracotta hover:border-terracotta transition-all duration-200 shadow-sm"
                title="View Bookmarked Favorites"
                aria-label="Favorites"
              >
                <Heart className="w-4 h-4 text-terracotta" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                    {favoriteCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full bg-white text-espresso-900 hover:text-terracotta border border-terracotta/30 focus:outline-none shadow-sm"
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
            className="fixed inset-x-0 top-16 z-40 bg-[#FAF6EE]/98 border-b border-terracotta/25 backdrop-blur-xl px-6 py-6 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-4 py-3 rounded-2xl bg-white border border-terracotta/15 text-sm font-bold text-espresso-950 hover:text-white hover:bg-terracotta transition-colors flex items-center justify-between shadow-sm"
                >
                  <span>{link.label}</span>
                  <span className="text-terracotta text-xs">➔</span>
                </a>
              ))}

              <div className="pt-3 border-t border-terracotta/20 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQRCode();
                  }}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-terracotta/30 text-espresso-950 text-xs font-bold shadow-sm"
                >
                  <QrCode className="w-4 h-4 text-terracotta" />
                  <span>QR</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReviewModal();
                  }}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-terracotta text-white text-xs font-bold shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Review</span>
                </button>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-espresso-950 text-xs font-bold shadow-sm"
                >
                  <Settings className="w-4 h-4 text-terracotta" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
