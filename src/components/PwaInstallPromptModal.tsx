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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 120, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full sm:max-w-md bg-gradient-to-b from-[#FAF3EA] via-white to-[#F5E8D7] rounded-t-[2rem] sm:rounded-3xl border-t-2 sm:border-2 border-terracotta/40 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-espresso-800 hover:text-terracotta border border-terracotta/20 shadow-xs transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Brand Icon */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-terracotta via-amber-400 to-[#5C1F0E] opacity-75 blur-sm animate-pulse" />
                <img
                  src="/logo.png"
                  alt="CoffeeLand Resto & Cafe"
                  className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-white shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-terracotta text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-terracotta/15 border border-terracotta/30 text-terracotta-800 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
                {deviceType === 'ios' ? (
                  <Smartphone className="w-3.5 h-3.5 text-terracotta" />
                ) : deviceType === 'android' ? (
                  <Smartphone className="w-3.5 h-3.5 text-terracotta" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-terracotta" />
                )}
                <span>
                  {deviceType === 'ios'
                    ? 'Apple iPhone / iPad App'
                    : deviceType === 'android'
                    ? 'Android App Available'
                    : 'Download Web App (PWA)'}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 leading-tight">
                Install CoffeeLand App
              </h2>

              <p className="text-xs sm:text-sm text-coffee-800 mt-1.5 max-w-xs leading-relaxed">
                Add CoffeeLand to your phone’s home screen for fast 1-tap food ordering, instant offline menu, and special deals.
              </p>
            </div>

            {/* Benefits Banner */}
            <div className="mt-3.5 p-3 rounded-2xl bg-white/90 border border-terracotta/20 shadow-xs space-y-2 text-xs text-espresso-900">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-terracotta flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </span>
                <span className="font-medium">Instant 1-Tap Launch from your Home Screen</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  📶
                </span>
                <span className="font-medium">Works Offline with full menu & price browsing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  📲
                </span>
                <span className="font-medium">No App Store or Play Store download required</span>
              </div>
            </div>

            {/* Success Banner */}
            {installSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center flex items-center justify-center gap-2 font-bold text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>CoffeeLand App Installed Successfully! 🎉</span>
              </motion.div>
            )}

            {/* Action Sections */}
            <div className="mt-4 space-y-2.5">
              {/* 1. Direct 1-Click Install Button (When browser supports beforeinstallprompt) */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-terracotta via-terracotta-600 to-[#5C1F0E] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>Install CoffeeLand App (1-Click)</span>
                </button>
              )}

              {/* 2. Apple iPhone & iPad Safari Instructions */}
              {deviceType === 'ios' && (
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-600/35 text-left text-xs text-espresso-950 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-terracotta-800 flex items-center gap-1.5 text-xs sm:text-sm">
                      <Share2 className="w-4 h-4 text-terracotta" />
                      <span>Install on Apple iPhone (Safari):</span>
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-terracotta text-white font-bold text-[10px]">
                      iOS Guide
                    </span>
                  </div>

                  {/* Warning if opened inside WhatsApp or Instagram in-app browser */}
                  {isInAppBrowser && (
                    <div className="p-2 rounded-xl bg-orange-100 border border-orange-300 text-orange-950 text-[11px] font-semibold flex items-start gap-1.5">
                      <Compass className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
                      <span>
                        You are in WhatsApp/Instagram browser. Tap <strong>(⋯)</strong> at the top right and choose <strong>'Open in Safari'</strong> to enable installation!
                      </span>
                    </div>
                  )}

                  <ol className="space-y-2 pl-1 text-[11px] sm:text-xs text-coffee-950">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-terracotta text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Tap the <strong>Share</strong> icon (<strong>⎋</strong> or <Share2 className="inline w-3.5 h-3.5 text-terracotta" />) at the bottom toolbar of Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-terracotta text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Scroll down and tap <strong>'Add to Home Screen'</strong> (<strong>⊞</strong>).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-terracotta text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Tap <strong>'Add'</strong> at top-right. CoffeeLand will appear on your home screen!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* 3. Android Guide when beforeinstallprompt is not immediate */}
              {deviceType === 'android' && !deferredPrompt && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs text-espresso-950 space-y-1.5">
                  <p className="font-bold text-terracotta-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-terracotta" />
                    <span>Install on Android:</span>
                  </p>
                  <p className="text-[11px] text-coffee-900 leading-relaxed">
                    Tap the browser menu (<strong>⋮</strong> at the top right in Chrome) and tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </p>
                </div>
              )}

              {/* 4. Desktop (PC / Laptop / Mac) */}
              {deviceType === 'desktop' && !deferredPrompt && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs text-espresso-950 space-y-1.5">
                  <p className="font-bold text-terracotta-800 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-terracotta" />
                    <span>Install on Computer / Laptop:</span>
                  </p>
                  <p className="text-[11px] text-coffee-900 leading-relaxed">
                    Look for the <strong>Install App icon (⊕)</strong> on the right side of your Chrome/Edge address bar, or click browser menu (<strong>⋮</strong>) ➔ <strong>'Install CoffeeLand...'</strong>.
                  </p>
                </div>
              )}

              {/* Quick Actions: Copy Link & Dismiss */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-terracotta/30 text-espresso-900 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Link!' : 'Copy App Link'}</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/70 hover:bg-white text-coffee-800 hover:text-espresso-950 border border-coffee-200 font-semibold text-xs transition-colors"
                >
                  Browse Website
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
