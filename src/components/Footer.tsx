import React from 'react';
import { Coffee, ArrowUp, MapPin, Phone, Mail, QrCode, Camera, Download } from 'lucide-react';

interface FooterProps {
  onOpenQRCode?: () => void;
  onOpenReviewModal?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQRCode, onOpenReviewModal, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF6EE] border-t border-terracotta/20 pt-16 pb-16 text-espresso-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-terracotta/15">
          {/* Brand Info with Circular Logo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Coffee Land Resto & Cafe Official Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-terracotta shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-display tracking-wider text-2xl font-bold text-espresso-950">
                  COFFEE <span className="text-terracotta">LAND</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-terracotta-700 font-bold -mt-0.5">
                  RESTO & CAFE • VIZAG
                </span>
              </div>
            </div>
            <p className="font-heading font-bold text-xs uppercase tracking-widest text-terracotta">
              “GOOD FOOD • GREAT COFFEE • BETTER TOGETHER”
            </p>
            <p className="text-xs text-coffee-800 leading-relaxed max-w-sm">
              Discover our complete 150+ menu collection of artisan roasts, gourmet brioche burgers, fried chicken buckets, stone-baked pizzas, waffles, and authentic Lotus Biscoff Kunafa in Thagarapuvalasa, Visakhapatnam.
            </p>

            {/* Quick QR & Review Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onOpenQRCode && (
                <button
                  onClick={onOpenQRCode}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-terracotta/30 text-espresso-950 hover:bg-terracotta hover:text-white text-xs font-bold transition-all shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-terracotta" />
                  <span>Scan Mobile QR</span>
                </button>
              )}

              {onOpenReviewModal && (
                <button
                  onClick={onOpenReviewModal}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-terracotta text-white hover:bg-terracotta-600 text-xs font-bold transition-all shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Photos</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-terracotta">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-coffee-700 font-medium">
              <li>
                <button onClick={() => scrollTo('#home')} className="hover:text-terracotta transition-colors">
                  Home Spotlight
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#menu')} className="hover:text-terracotta transition-colors">
                  Interactive Catalog
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#full-menu-showcase')} className="hover:text-terracotta transition-colors">
                  Official Menu (PDF)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#reviews')} className="hover:text-terracotta transition-colors">
                  Ratings & Reviews (4.7 ★)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#about')} className="hover:text-terracotta transition-colors">
                  Our Story & Location
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#gallery')} className="hover:text-terracotta transition-colors">
                  Ambience & Photos
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#contact')} className="hover:text-terracotta transition-colors">
                  Location & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Menu Highlights */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-terracotta">
              Official Menu Sections
            </h4>
            <ul className="space-y-2 text-xs text-coffee-700 font-medium">
              <li>☕ Hot Specialty & Cold Coffee Blends</li>
              <li>🧋 Thickshakes & Refreshing Mocktails</li>
              <li>🍔 Gourmet Brioche Burgers & Club Toasts</li>
              <li>🍗 Crispy Fried Chicken Buckets & Lollipops</li>
              <li>🍕 Handcrafted Stone-Baked Thin Crust Pizza</li>
              <li>🧇 Belgian Waffles & Fluffy Pancakes</li>
              <li>🍰 Lotus Biscoff Kunafa & Sizzling Brownies</li>
            </ul>
          </div>

          {/* Visit Us & Location Box from Google Maps */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-terracotta">
              Visit & Dine In
            </h4>
            <div className="space-y-2 text-xs text-coffee-800 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                <span>Temples Bypass Road, Near Sangivalasa, Thagarapuvalasa, Vizag — 531162</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                <a href="tel:+919542525665" className="hover:text-terracotta font-bold">
                  +91 95425 25665 / +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                <span>info@coffeeland.in</span>
              </div>
              <div className="pt-1 text-[11px] text-coffee-600">
                Mon - Sun: 10:00 AM – 10:00 PM (Dine-in, Takeaway & Drive-through)
              </div>

              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href="/coffelandmenu.pdf"
                  download="CoffeeLand-Menu.pdf"
                  className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:underline font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official Menu PDF</span>
                </a>
                <a
                  href="https://maps.app.goo.gl/6JACSygk7XNrQ22x5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-coffee-700 hover:text-terracotta font-semibold"
                >
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Return to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-600 font-medium">
          <p className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} COFFEE LAND RESTO & CAFE (Sangivalasa, Visakhapatnam). All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <a
              href="/admin"
              className="text-terracotta hover:underline font-bold transition-colors inline-flex items-center gap-1"
              title="Separate Link for Cafe Owner"
            >
              <span>Owner Portal (/admin)</span>
              <span>↗</span>
            </a>
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta hover:bg-terracotta-600 text-white transition-all text-xs font-bold group shadow-sm"
          >
            <span>Return to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};
