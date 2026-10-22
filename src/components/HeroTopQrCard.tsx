import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Smartphone,
  ArrowDownToLine,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Zap,
  Maximize2
} from 'lucide-react';
import QRCode from 'qrcode';

interface HeroTopQrCardProps {
  onOpenModal?: () => void;
}

export const HeroTopQrCard: React.FC<HeroTopQrCardProps> = ({ onOpenModal }) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine target PWA URL (using live URL when on localhost so phone scanning immediately opens the app)
  const getPwaUrl = () => {
    if (typeof window === 'undefined') return 'https://coffeeland-4yy7.onrender.com/?pwa=install';
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'https://coffeeland-4yy7.onrender.com/?pwa=install';
    }
    return `${window.location.origin}/?pwa=install`;
  };

  const pwaUrl = getPwaUrl();

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
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

  // Render QR Code onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = 220;

    QRCode.toCanvas(
      canvas,
      pwaUrl,
      {
        width: canvasWidth,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#2B1408', // Deep espresso roast
          light: '#FFFFFF', // Clean crisp white
        },
      },
      (error) => {
        if (error) {
          console.error('Error generating Hero QR code:', error);
          return;
        }

        // Composite brand center badge
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const center = canvasWidth / 2;
        const radius = canvasWidth * 0.13;

        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2.5;
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
          ctx.drawImage(logoImg, center - radius, center - radius, radius * 2, radius * 2);
          ctx.restore();
        };
        ctx.restore();
      }
    );
  }, [pwaUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pwaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuide((prev) => !prev);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-5 px-3">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF3EA] via-white to-[#F4E6D4] border-2 border-terracotta/30 shadow-xl p-4 sm:p-5 md:p-6 backdrop-blur-md">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-terracotta/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 md:gap-6">
          {/* Left: Interactive Scannable QR Code */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative p-2.5 bg-white rounded-2xl border-2 border-terracotta/40 shadow-md group">
              <canvas
                ref={canvasRef}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl block transition-transform group-hover:scale-[1.02]"
              />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-terracotta text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Scan PWA
              </span>
            </div>
            <span className="text-[10px] text-coffee-800 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-terracotta" /> Scan With Phone Camera
            </span>
          </div>

          {/* Right: Explanatory Content & Actions */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/15 border border-terracotta/30 text-terracotta-800 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2">
              <Zap className="w-3 h-3 text-terracotta fill-terracotta" />
              <span>Official CoffeeLand Web App (PWA)</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-espresso-950 leading-snug">
              Open & Download CoffeeLand On Your Phone
            </h3>

            <p className="text-xs sm:text-sm text-coffee-800 mt-1.5 leading-relaxed">
              Scan this QR code with any smartphone camera to open the website directly and save it as an app on your home screen. Fast food ordering without any app store download!
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2.5 text-[10px] sm:text-xs font-bold text-espresso-900">
              <span className="px-2 py-0.5 rounded-md bg-white border border-terracotta/20 shadow-xs flex items-center gap-1">
                ⚡ Instant Ordering
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-terracotta/20 shadow-xs flex items-center gap-1">
                📶 Offline Menu
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-terracotta/20 shadow-xs flex items-center gap-1">
                📱 Add to Home Screen
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>{isInstalled ? 'App Installed ✓' : 'Install App (PWA)'}</span>
              </button>

              {onOpenModal && (
                <button
                  onClick={onOpenModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-espresso-900 border border-terracotta/30 font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95"
                  title="Enlarge QR Code"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-terracotta" />
                  <span>Enlarge QR</span>
                </button>
              )}

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-coffee-800 border border-coffee-200 font-semibold text-xs shadow-xs transition-all"
                title="Copy Web App URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Step-by-Step Toggle Guide */}
            {showGuide && (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-espresso-900 text-left">
                <p className="font-bold mb-1 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-terracotta" /> How to install on your phone:
                </p>
                <ul className="space-y-1 text-coffee-900">
                  <li>
                    <strong>Android (Chrome):</strong> Scan the QR or open the link, tap <strong>Menu (⋮)</strong> at top-right ➔ tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </li>
                  <li>
                    <strong>iPhone (Safari):</strong> Scan the QR or open Safari, tap <strong>Share (⎋)</strong> at the bottom ➔ scroll & tap <strong>'Add to Home Screen' (⊞)</strong>.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
