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
  Coffee,
  Copy,
  Check,
  Compass,
  Monitor
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
  const [copied, setCopied] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // 1. Precise device & browser detection
    const ua = (window.navigator.userAgent || '').toLowerCase();
    const isIos =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    const isAndroid = /android/.test(ua);

    // Detect In-App browser (Instagram, WhatsApp, Facebook, LinkedIn, TikTok)
    const inApp =
      /fban|fbav|instagram|whatsapp|line|micromessenger|snapchat|bytedance/i.test(ua);
    setIsInAppBrowser(inApp);

    if (isIos) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 2. Check if already running in standalone / installed PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Capture beforeinstallprompt event (Chrome, Edge, Samsung Internet, Android WebViews)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If prompt event fired and we are not in standalone, show the install modal
      setIsOpen(true);
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

    // 4. Trigger logic for ALL devices
    const search = window.location.search.toLowerCase();
    const isQrVisit =
      search.includes('pwa') ||
      search.includes('install') ||
      search.includes('source=qr') ||
      search.includes('qr');

    const dismissed = sessionStorage.getItem('coffeeland_pwa_dismissed');

    // If opened via QR scan, ALWAYS pop up (even if dismissed earlier)
    // If regular visit on any device and not dismissed this session, pop up after 800ms
    if (isQrVisit) {
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    } else if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 900);
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

  const handleCopy = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
        }, 2200);
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
        <>
          {/* Subtle non-blocking backdrop that dismisses on tap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
          />

          {/* Compact Rectangular Floating Popup (Does NOT occupy whole screen) */}
          <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="pointer-events-auto relative w-full max-w-md bg-gradient-to-b from-[#FAF4EC] via-white to-[#F5EAD9] rounded-2xl border-2 border-terracotta/40 shadow-2xl p-3.5 sm:p-4 text-espresso-950"
            >
              {/* Top Row: App Brand & Close */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src="/logo.png"
                      alt="CoffeeLand Resto & Cafe"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-terracotta/30 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-terracotta text-white shadow-xs">
                      <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-espresso-950 truncate leading-tight">
                        Install CoffeeLand App
                      </h3>
                      <span className="shrink-0 px-2 py-0.2 rounded-full bg-terracotta/15 text-terracotta-800 text-[9px] font-black uppercase tracking-wider">
                        {deviceType === 'ios' ? 'iOS' : deviceType === 'android' ? 'Android' : 'PWA'}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-coffee-700 truncate mt-0.5 leading-snug">
                      1-tap home screen ordering & offline food menu
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full bg-white/80 hover:bg-white text-espresso-700 hover:text-terracotta border border-terracotta/20 shadow-xs transition-colors shrink-0"
                  aria-label="Close install popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success Notification */}
              {installSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center flex items-center justify-center gap-1.5 font-bold text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CoffeeLand App Installed Successfully! 🎉</span>
                </motion.div>
              )}

              {/* iOS Safari Compact Instructions */}
              {deviceType === 'ios' && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-terracotta/25 text-[11px] text-espresso-950 space-y-1">
                  {isInAppBrowser && (
                    <p className="text-orange-800 font-semibold flex items-center gap-1 text-[10px] pb-1 border-b border-orange-200">
                      <Compass className="w-3 h-3 text-orange-700 shrink-0" />
                      <span>Tap (⋯) top-right and select <strong>'Open in Safari'</strong></span>
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 font-medium leading-tight">
                    <Share2 className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>
                      Tap <strong>Share</strong> (bottom toolbar) ➔ Tap <strong>'Add to Home Screen' (⊞)</strong>
                    </span>
                  </p>
                </div>
              )}

              {/* Android Guide when prompt is not immediate */}
              {deviceType === 'android' && !deferredPrompt && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-terracotta/20 text-[11px] text-espresso-900 leading-tight">
                  <span>
                    Tap Chrome menu (<strong>⋮</strong> top right) ➔ tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </span>
                </div>
              )}

              {/* Desktop prompt */}
              {deviceType === 'desktop' && !deferredPrompt && (
                <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-terracotta/20 text-[11px] text-espresso-900 leading-tight">
                  <span>
                    Click the <strong>Install App icon (⊕)</strong> on the right of your address bar.
                  </span>
                </div>
              )}

              {/* Compact Action Bar */}
              <div className="mt-2.5 flex items-center gap-2">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-terracotta via-terracotta-600 to-[#5C1F0E] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Install App (1-Click)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-amber-50 border border-terracotta/30 text-espresso-900 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-terracotta" />}
                    <span>{copied ? 'Copied Link!' : 'Copy App Link'}</span>
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="py-1.5 px-3 rounded-xl bg-white/80 hover:bg-white text-coffee-800 hover:text-espresso-950 border border-coffee-200 font-semibold text-xs transition-colors shrink-0"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
