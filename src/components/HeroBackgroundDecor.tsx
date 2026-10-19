import React from 'react';

export const HeroBackgroundDecor: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Soft warm ambient mesh blurs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-terracotta/12 via-caramel/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Botanical Leaf Watermark Accent (Static & Non-distracting) */}
      <div className="absolute top-12 right-6 md:right-16 w-64 h-64 opacity-[0.04] text-[#802B12] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
          <circle cx="100" cy="100" r="85" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="65" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <path
              key={deg}
              d="M 100 100 C 115 75, 130 75, 100 35 C 70 75, 85 75, 100 100 Z"
              transform={`rotate(${deg} 100 100)`}
              stroke="currentColor"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
