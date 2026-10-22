import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  ArrowDownToLine,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Zap,
  Coffee
} from 'lucide-react';

interface PwaInstallPromptModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const PwaInstallPromptModal: React.FC<PwaInstallPromptModalProps> = ({
  forceOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if already in standalone/installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Detect if opened via QR code or direct install link
    const searchParams = new URLSearchParams(window.location.search);
    const isQrVisit =
      searchParams.get('pwa') === 'install' ||
      searchParams.get('source') === 'qr' ||
      searchParams.get('source') === 'pwa_qr' ||
      window.location.search.includes('install') ||
      window.location.search.includes('pwa');

    const dismissed = sessionStorage.getItem('coffeeland_pwa_dismissed');

    // Auto-popup if:
    // 1. Explicitly requested via QR scan (?pwa=install)
    // 2. Or on mobile device if not already dismissed in this session
    if (isQrVisit || (!dismissed && /android|iphone|ipad|ipod/i.test(userAgent))) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Update when forceOpen changes
  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('coffeeland_pwa_dismissed', 'true');
    if (onClose) onClose();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          if (onClose) onClose();
        }, 2000);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled && !forceOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full sm:max-w-md bg-gradient-to-b from-[#FAF3EA] via-white to-[#F4E6D4] rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-terracotta/40 shadow-2xl p-6 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-espresso-800 hover:text-terracotta border border-terracotta/20 shadow-xs transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with App Logo & Glowing Ring */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-terracotta via-amber-400 to-[#5C1F0E] opacity-70 blur-sm animate-pulse" />
                <img
                  src="/logo.png"
                  alt="CoffeeLand"
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-terracotta text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-terracotta/15 border border-terracotta/30 text-terracotta-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
                <Smartphone className="w-3 h-3 text-terracotta" />
                <span>QR Scan Detected • Install App</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-espresso-950 leading-tight">
                Add CoffeeLand to Your Home Screen
              </h2>

              <p className="text-xs sm:text-sm text-coffee-800 mt-1.5 max-w-xs leading-relaxed">
                Enjoy fast 1-tap food ordering, offline menu browsing, and exclusive specials right from your phone.
              </p>
            </div>

            {/* Key Advantages */}
            <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-terracotta/20 shadow-xs space-y-2 text-xs text-espresso-900">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-terracotta flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </span>
                <span className="font-medium">Instant 1-Tap Launch without typing web address</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  📶
                </span>
                <span className="font-medium">Works Offline with cached menu & pricing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  📱
                </span>
                <span className="font-medium">No App Store or Play Store account required</span>
              </div>
            </div>

            {/* Install Success State */}
            {installSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center flex items-center justify-center gap-2 font-bold text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>CoffeeLand App Installed Successfully! 🎉</span>
              </motion.div>
            )}

            {/* Actions according to device type */}
            <div className="mt-5 space-y-2.5">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-terracotta via-terracotta-600 to-[#5C1F0E] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>Install CoffeeLand App (1-Click)</span>
                </button>
              )}

              {/* iOS Step-by-Step Instructions */}
              {isIos && !deferredPrompt && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs text-espresso-950 space-y-2">
                  <p className="font-bold text-terracotta-800 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-terracotta" />
                    How to install on Apple iPhone (Safari):
                  </p>
                  <ol className="space-y-1.5 pl-2 text-[11px] text-coffee-900">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                        1
                      </span>
                      <span>
                        Tap the <strong>Share</strong> button (<strong>⎋</strong>) at the bottom of Safari.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                        2
                      </span>
                      <span>
                        Scroll down and tap <strong>'Add to Home Screen'</strong> (<strong>⊞</strong>).
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                        3
                      </span>
                      <span>
                        Tap <strong>'Add'</strong> at the top right. CoffeeLand is now an app!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Fallback Guide (If deferredPrompt wasn't immediately ready) */}
              {!deferredPrompt && !isIos && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs text-espresso-950 space-y-1.5">
                  <p className="font-bold text-terracotta-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-terracotta" />
                    To install on Android:
                  </p>
                  <p className="text-[11px] text-coffee-900">
                    Tap your browser menu (<strong>⋮</strong> at top right) and select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </p>
                </div>
              )}

              {/* Dismiss / Browse Button */}
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 px-4 rounded-xl text-coffee-800 hover:text-espresso-950 font-semibold text-xs transition-colors text-center"
              >
                Continue Browsing Website
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
