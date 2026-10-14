import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download, Copy, Check, Smartphone, Sparkles, Coffee } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://coffeeland.cafe';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    const svg = document.getElementById('coffeeland-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coffeeland-menu-qr.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            className="relative w-full max-w-md bg-[#EDE0CC] border border-amber-900/15 rounded-3xl p-5 sm:p-8 shadow-2xl text-[#2B1B16] z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#802B12]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#6A584D] hover:text-[#2B1B16] hover:bg-amber-100 border border-amber-900/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-[#802B12] text-xs font-semibold uppercase tracking-wider mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant Mobile Access</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1B16]">
                Scan & Dine
              </h3>
              <p className="text-xs sm:text-sm text-[#6A584D] mt-1 max-w-xs mx-auto">
                Open full 150+ menu, view photo reviews, and order directly on any smartphone!
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-[#802B12]/20 group">
              <svg
                id="coffeeland-qr-svg"
                viewBox="0 0 200 200"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="200" height="200" fill="#EDE0CC" rx="8" />

                {/* Corner Positioning Markers */}
                {/* Top-Left */}
                <rect x="15" y="15" width="45" height="45" fill="#802B12" rx="4" />
                <rect x="23" y="23" width="29" height="29" fill="#EDE0CC" rx="2" />
                <rect x="29" y="29" width="17" height="17" fill="#802B12" rx="2" />

                {/* Top-Right */}
                <rect x="140" y="15" width="45" height="45" fill="#802B12" rx="4" />
                <rect x="148" y="23" width="29" height="29" fill="#EDE0CC" rx="2" />
                <rect x="154" y="29" width="17" height="17" fill="#802B12" rx="2" />

                {/* Bottom-Left */}
                <rect x="15" y="140" width="45" height="45" fill="#802B12" rx="4" />
                <rect x="23" y="148" width="29" height="29" fill="#EDE0CC" rx="2" />
                <rect x="29" y="154" width="17" height="17" fill="#802B12" rx="2" />

                {/* Detailed Data Matrix Pattern */}
                <g fill="#2B1B16">
                  {/* Top bands */}
                  <rect x="70" y="18" width="8" height="8" rx="1" />
                  <rect x="85" y="18" width="14" height="8" rx="1" />
                  <rect x="108" y="18" width="8" height="8" rx="1" />
                  <rect x="122" y="18" width="10" height="8" rx="1" />
                  <rect x="70" y="32" width="14" height="8" rx="1" />
                  <rect x="92" y="32" width="8" height="8" rx="1" />
                  <rect x="114" y="32" width="18" height="8" rx="1" />
                  <rect x="70" y="46" width="8" height="8" rx="1" />
                  <rect x="86" y="46" width="8" height="8" rx="1" />
                  <rect x="100" y="46" width="14" height="8" rx="1" />
                  <rect x="122" y="46" width="8" height="8" rx="1" />

                  {/* Left column data */}
                  <rect x="18" y="70" width="8" height="8" rx="1" />
                  <rect x="18" y="85" width="14" height="8" rx="1" />
                  <rect x="18" y="108" width="8" height="8" rx="1" />
                  <rect x="18" y="122" width="10" height="8" rx="1" />
                  <rect x="32" y="70" width="14" height="8" rx="1" />
                  <rect x="32" y="92" width="8" height="8" rx="1" />
                  <rect x="32" y="114" width="18" height="8" rx="1" />
                  <rect x="46" y="70" width="8" height="8" rx="1" />
                  <rect x="46" y="86" width="8" height="8" rx="1" />
                  <rect x="46" y="100" width="14" height="8" rx="1" />
                  <rect x="46" y="122" width="8" height="8" rx="1" />

                  {/* Right side data */}
                  <rect x="142" y="70" width="8" height="14" rx="1" />
                  <rect x="158" y="70" width="12" height="8" rx="1" />
                  <rect x="176" y="70" width="8" height="8" rx="1" />
                  <rect x="142" y="92" width="16" height="8" rx="1" />
                  <rect x="166" y="86" width="8" height="14" rx="1" />
                  <rect x="150" y="108" width="8" height="8" rx="1" />
                  <rect x="166" y="108" width="18" height="8" rx="1" />
                  <rect x="142" y="122" width="12" height="8" rx="1" />
                  <rect x="160" y="122" width="8" height="8" rx="1" />
                  <rect x="174" y="122" width="10" height="8" rx="1" />

                  {/* Bottom right data */}
                  <rect x="70" y="142" width="8" height="8" rx="1" />
                  <rect x="86" y="142" width="14" height="8" rx="1" />
                  <rect x="108" y="142" width="8" height="14" rx="1" />
                  <rect x="124" y="142" width="12" height="8" rx="1" />
                  <rect x="142" y="142" width="8" height="8" rx="1" />
                  <rect x="158" y="142" width="14" height="8" rx="1" />
                  <rect x="180" y="142" width="6" height="14" rx="1" />

                  <rect x="70" y="158" width="14" height="8" rx="1" />
                  <rect x="92" y="158" width="8" height="8" rx="1" />
                  <rect x="120" y="158" width="8" height="8" rx="1" />
                  <rect x="136" y="158" width="14" height="8" rx="1" />
                  <rect x="158" y="158" width="8" height="8" rx="1" />

                  <rect x="70" y="174" width="8" height="8" rx="1" />
                  <rect x="86" y="174" width="12" height="8" rx="1" />
                  <rect x="106" y="174" width="8" height="8" rx="1" />
                  <rect x="122" y="174" width="14" height="8" rx="1" />
                  <rect x="144" y="174" width="8" height="8" rx="1" />
                  <rect x="160" y="174" width="14" height="8" rx="1" />
                  <rect x="180" y="174" width="6" height="8" rx="1" />
                </g>

                {/* Center Brand Badge with Official Circular Logo */}
                <defs>
                  <clipPath id="qrLogoCircleClip">
                    <circle cx="100" cy="100" r="23" />
                  </clipPath>
                </defs>
                <circle cx="100" cy="100" r="26" fill="#EDE0CC" stroke="#802B12" strokeWidth="2.5" />
                <image
                  href="/logo.png"
                  x="75"
                  y="75"
                  width="50"
                  height="50"
                  clipPath="url(#qrLogoCircleClip)"
                />
              </svg>

              <div className="text-[10px] text-[#802B12] font-bold tracking-widest uppercase mt-1">
                COFFEE LAND • RESTO & CAFE
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[#2B1B16] text-xs sm:text-sm font-semibold border border-amber-900/20 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 text-[#802B12]" />
                <span>Save QR Code</span>
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
                    <span>Copy Web Link</span>
                  </>
                )}
              </button>
            </div>

            {/* How To Use Tips */}
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-xs text-[#6A584D]">
              <Smartphone className="w-4 h-4 text-[#802B12] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#2B1B16] font-semibold">Instant Mobile Experience:</span>
                <p className="mt-0.5 leading-relaxed">
                  Open your camera app, point at this QR code to access Coffee Land from your phone, upload experience photos, and explore our 150+ item menu!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
