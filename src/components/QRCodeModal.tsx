import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Coffee,
  Sparkles,
  Zap,
  Share2,
  PlusSquare,
  ArrowDownToLine
} from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [targetType, setTargetType] = useState<'pwa' | 'home' | 'menu' | 'reviews'>('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Listen for beforeinstallprompt event for PWA download
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction trigger
      alert("To install CoffeeLand on your phone:\n\n• Android Chrome: Tap Menu (⋮) > 'Install App' or 'Add to Home screen'\n• Apple iPhone (Safari): Tap Share (⎋) > 'Add to Home Screen (⊞)'");
    }
  };

  // Determine target base URL (falls back to live Render production URL so scanning localhost works on phones!)
  const getBaseUrl = () => {
    if (typeof window === 'undefined') return 'https://coffeeland-4yy7.onrender.com';
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'https://coffeeland-4yy7.onrender.com';
    }
    return window.location.origin;
  };

  const baseUrl = getBaseUrl();
  const currentUrl =
    targetType === 'pwa'
      ? `${baseUrl}/?pwa=install`
      : targetType === 'menu'
      ? `${baseUrl}/#menu`
      : targetType === 'reviews'
      ? `${baseUrl}/#reviews`
      : `${baseUrl}/`;

  // Draw real scannable QR Code whenever modal opens or destination changes
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasWidth = 400;

      QRCode.toCanvas(
        canvas,
        currentUrl,
        {
          width: canvasWidth,
          margin: 2,
          errorCorrectionLevel: 'H', // High error correction (30% redundancy) for instant scanning & center badge
          color: {
            dark: '#2B1B16', // Rich roasted espresso
            light: '#FFFFFF', // Crisp white background for maximum contrast & fast camera focus
          },
        },
        (error) => {
          if (error) {
            console.error('Error generating QR code:', error);
            return;
          }

          // Composite Coffee Land brand badge in the center
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const center = canvasWidth / 2;
          const radius = canvasWidth * 0.12;

          ctx.save();
          ctx.beginPath();
          ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#802B12';
          ctx.stroke();

          const logoImg = new Image();
          logoImg.src = '/logo.png';
          logoImg.crossOrigin = 'anonymous';
          logoImg.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(
              logoImg,
              center - radius,
              center - radius,
              radius * 2,
              radius * 2
            );
            ctx.restore();
          };

          logoImg.onerror = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#802B12';
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('☕', center, center);
            ctx.restore();
          };

          ctx.restore();
        }
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, currentUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `coffeeland-qr-${targetType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Could not download canvas QR code:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2B1B16]/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#EDE0CC] border border-amber-900/15 rounded-3xl p-4 sm:p-6 shadow-2xl text-[#2B1B16] z-10 max-h-[94vh] overflow-y-auto"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#802B12]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#6A584D] hover:text-[#2B1B16] hover:bg-amber-100 border border-amber-900/10 transition-colors shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>PWA Mobile Web App</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1B16]">
                Scan &amp; Download App
              </h3>
              <p className="text-xs text-[#6A584D] mt-1 max-w-xs mx-auto">
                Scan with any smartphone camera to open and install CoffeeLand directly onto your phone without app stores!
              </p>
            </div>

            {/* Destination Toggle Tabs */}
            <div className="flex items-center justify-center p-1 rounded-2xl bg-[#E5D5BD] border border-amber-900/15 mb-3.5 text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setTargetType('pwa')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  targetType === 'pwa'
                    ? 'bg-terracotta text-white font-bold shadow-xs'
                    : 'text-[#6A584D] hover:text-[#2B1B16]'
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Download App</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetType('home')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all ${
                  targetType === 'home'
                    ? 'bg-white text-[#802B12] font-bold shadow-xs'
                    : 'text-[#6A584D] hover:text-[#2B1B16]'
                }`}
              >
                Website
              </button>
              <button
                type="button"
                onClick={() => setTargetType('menu')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all ${
                  targetType === 'menu'
                    ? 'bg-white text-[#802B12] font-bold shadow-xs'
                    : 'text-[#6A584D] hover:text-[#2B1B16]'
                }`}
              >
                Menu (250+)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('reviews')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all ${
                  targetType === 'reviews'
                    ? 'bg-white text-[#802B12] font-bold shadow-xs'
                    : 'text-[#6A584D] hover:text-[#2B1B16]'
                }`}
              >
                Reviews
              </button>
            </div>

            {/* QR Code Container with High-Contrast White Background for Camera Optics */}
            <div className="relative mx-auto w-56 h-56 sm:w-60 sm:h-60 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-[#802B12]/20">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-xl"
                width={400}
                height={400}
              />
            </div>

            {/* Verification Badge */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Camera Scan on Android &amp; iPhone</span>
            </div>

            {/* 1-Click Install App on Current Device (PWA Native Prompt) */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleInstallApp}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-terracotta to-[#802B12] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <ArrowDownToLine className="w-4 h-4 animate-bounce" />
                <span>{isInstalled ? 'App Already Installed ✓' : 'Install App Directly on This Device'}</span>
              </button>
              {installSuccess && (
                <p className="text-[11px] text-emerald-700 text-center font-bold mt-1">
                  App installed to your device home screen!
                </p>
              )}
            </div>

            {/* Step-by-Step PWA Installation Guide for Scanners */}
            <div className="mt-3 p-3 rounded-2xl bg-white/85 border border-amber-900/15 space-y-2 text-xs">
              <span className="font-bold text-espresso-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5 text-terracotta" />
                <span>How Customers Download via QR:</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-900/10">
                  <div className="font-bold text-[#802B12] mb-1">🤖 Android Phone:</div>
                  <p className="text-coffee-800">
                    Scan QR &rarr; Tap banner <strong>&ldquo;Add to Home screen&rdquo;</strong> or Chrome menu (&vellip;) &gt; <strong>&ldquo;Install app&rdquo;</strong>.
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-900/10">
                  <div className="font-bold text-[#802B12] mb-1">🍎 Apple iPhone:</div>
                  <p className="text-coffee-800">
                    Scan in Safari &rarr; Tap Share (<strong>&boxbox;</strong>) &rarr; Tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Link Preview */}
            <div className="mt-3 p-2 rounded-xl bg-white/70 border border-amber-900/15 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#6A584D] truncate font-mono text-[11px]">
                {currentUrl}
              </span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#802B12] hover:text-amber-900 font-bold shrink-0 flex items-center gap-1 hover:underline text-[11px]"
                title="Open link in new tab"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Action Buttons: Save PNG / Copy Link */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#2B1B16] text-xs font-semibold border border-amber-900/20 shadow-xs transition-all hover:scale-[1.01]"
              >
                <Download className="w-3.5 h-3.5 text-[#802B12]" />
                <span>Save PNG Code</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl terracotta-btn text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.01]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Web Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
