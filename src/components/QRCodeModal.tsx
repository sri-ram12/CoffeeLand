import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download, Copy, Check, Smartphone, ExternalLink, CheckCircle2, Coffee, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [targetType, setTargetType] = useState<'home' | 'menu' | 'reviews'>('home');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    targetType === 'menu'
      ? `${baseUrl}/#menu`
      : targetType === 'reviews'
      ? `${baseUrl}/#reviews`
      : `${baseUrl}/`;

  // Draw real scannable QR Code whenever modal opens or destination changes
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure canvas is in DOM
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
          const radius = canvasWidth * 0.12; // 12% radius for high safety within 30% error tolerance

          // White circular background cushion for the logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#802B12';
          ctx.stroke();

          // Try loading official cafe logo into the center
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
            // Fallback decorative center badge if logo image cannot be loaded
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2B1B16]/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#EDE0CC] border border-amber-900/15 rounded-3xl p-5 sm:p-7 shadow-2xl text-[#2B1B16] z-10 max-h-[94vh] overflow-y-auto"
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
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/60 text-[#802B12] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <QrCode className="w-3.5 h-3.5" />
                <span>Official Live QR Code</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1B16]">
                Scan & Dine
              </h3>
              <p className="text-xs sm:text-sm text-[#6A584D] mt-1 max-w-xs mx-auto">
                Scan with any smartphone camera or Google Lens to instantly open Coffee Land!
              </p>
            </div>

            {/* Destination Toggle Tabs */}
            <div className="flex items-center justify-center p-1 rounded-2xl bg-[#E5D5BD] border border-amber-900/15 mb-4 text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setTargetType('home')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all ${
                  targetType === 'home'
                    ? 'bg-white text-[#802B12] font-bold shadow-xs'
                    : 'text-[#6A584D] hover:text-[#2B1B16]'
                }`}
              >
                Website Home
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
                150+ Menu
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
            <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-[#802B12]/20">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-xl"
                width={400}
                height={400}
              />
            </div>

            {/* Verification Badge */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Scannable on iOS, Android & Google Lens</span>
            </div>

            {/* Target Link Preview */}
            <div className="mt-3 p-2.5 rounded-xl bg-white/70 border border-amber-900/15 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#6A584D] truncate font-mono text-[11px]">
                {currentUrl}
              </span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#802B12] hover:text-amber-900 font-bold shrink-0 flex items-center gap-1 hover:underline"
                title="Open link in new tab"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[#2B1B16] text-xs sm:text-sm font-semibold border border-amber-900/20 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 text-[#802B12]" />
                <span>Save High-Res PNG</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl terracotta-btn text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-[#6A584D]">
              <Smartphone className="w-4 h-4 text-[#802B12] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#2B1B16] font-semibold">Print & Table Use:</span>
                <p className="mt-0.5 leading-relaxed text-[11px]">
                  Download and print this QR code on table tents, cafe counters, takeaway boxes, or flyers. Guests point their phone camera to instantly browse the full menu and order!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
