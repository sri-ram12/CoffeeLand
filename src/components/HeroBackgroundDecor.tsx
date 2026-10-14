import React from 'react';
import { motion } from 'framer-motion';

export const HeroBackgroundDecor: React.FC = () => {
  // Staggered floating coffee bean seeds
  const coffeeBeans = [
    { id: 1, top: '12%', left: '8%', size: 34, rotate: 25, duration: 7, delay: 0 },
    { id: 2, top: '22%', right: '10%', size: 28, rotate: -40, duration: 8.5, delay: 1.2 },
    { id: 3, top: '48%', left: '5%', size: 40, rotate: 60, duration: 9, delay: 0.5 },
    { id: 4, top: '65%', right: '7%', size: 32, rotate: -15, duration: 7.8, delay: 2 },
    { id: 5, top: '80%', left: '14%', size: 26, rotate: 45, duration: 6.5, delay: 1.8 },
    { id: 6, top: '38%', right: '18%', size: 24, rotate: -70, duration: 8.2, delay: 3.1 },
    { id: 7, top: '15%', left: '42%', size: 22, rotate: 15, duration: 7.4, delay: 2.5 },
  ];

  // Golden dust particles
  const sparkles = [
    { id: 1, top: '18%', left: '22%', size: 6, duration: 4.5, delay: 0.2 },
    { id: 2, top: '32%', right: '28%', size: 5, duration: 5.2, delay: 1.4 },
    { id: 3, top: '55%', left: '30%', size: 7, duration: 6.0, delay: 0.8 },
    { id: 4, top: '72%', right: '22%', size: 4, duration: 4.8, delay: 2.1 },
    { id: 5, top: '28%', left: '75%', size: 6, duration: 5.5, delay: 1.9 },
    { id: 6, top: '82%', left: '60%', size: 5, duration: 4.2, delay: 0.6 },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Large Luminous Ambient Color Blurs (Breathing Mesh Gradients) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] sm:w-[900px] h-[550px] bg-gradient-to-b from-[#802B12]/20 via-[#B8823F]/15 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
          y: [-15, 25, -15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/4 -left-28 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.15, 0.25, 0.15],
          x: [15, -25, 15],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -right-24 w-[550px] h-[550px] bg-terracotta/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* 2. Slow-Rotating Artisanal Latte Art Rosette Watermark (Center-Right) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute top-16 right-[-80px] sm:right-[-40px] md:right-[5%] w-[420px] h-[420px] opacity-[0.07] text-[#802B12] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
          {/* Concentric ornate coffee rings and rosetta leaves */}
          <circle cx="100" cy="100" r="90" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="35" />
          {/* Symmetrical latte art petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={deg}
              d="M 100 100 C 120 70, 140 70, 100 20 C 60 70, 80 70, 100 100 Z"
              transform={`rotate(${deg} 100 100)`}
              stroke="currentColor"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </motion.div>

      {/* 3. Vintage Botanical Coffee Branch Sketch Watermark (Bottom-Left) */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-[-60px] sm:left-[-20px] md:left-[3%] w-[380px] h-[380px] opacity-[0.08] text-[#802B12] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
          {/* Branch stem */}
          <path d="M 20 180 Q 70 120, 140 60 Q 170 35, 190 20" strokeWidth="2" />
          {/* Leaves */}
          <path d="M 70 120 C 50 100, 40 70, 75 60 C 100 70, 90 100, 70 120 Z" />
          <path d="M 110 85 C 130 65, 160 60, 165 85 C 150 110, 120 105, 110 85 Z" />
          <path d="M 140 60 C 130 35, 145 15, 170 20 C 180 40, 160 55, 140 60 Z" />
          {/* Coffee berries */}
          <circle cx="85" cy="105" r="7" fill="currentColor" opacity="0.3" />
          <circle cx="98" cy="98" r="6" fill="currentColor" opacity="0.4" />
          <circle cx="125" cy="72" r="7" fill="currentColor" opacity="0.3" />
          <circle cx="138" cy="65" r="6" fill="currentColor" opacity="0.4" />
        </svg>
      </motion.div>

      {/* 4. Floating 3D Animated Coffee Beans */}
      {coffeeBeans.map((bean) => (
        <motion.div
          key={bean.id}
          animate={{
            y: [-16, 18, -16],
            rotate: [bean.rotate - 10, bean.rotate + 15, bean.rotate - 10],
            scale: [0.96, 1.05, 0.96],
          }}
          transition={{
            duration: bean.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bean.delay,
          }}
          style={{
            top: bean.top,
            left: bean.left,
            right: bean.right,
            width: bean.size,
            height: bean.size * 1.35,
          }}
          className="absolute opacity-25 hover:opacity-50 transition-opacity filter drop-shadow-md pointer-events-none"
        >
          {/* Stylized Realistic Coffee Bean SVG */}
          <svg viewBox="0 0 100 135" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id={`beanGrad-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#802B12" />
                <stop offset="50%" stopColor="#4A1E11" />
                <stop offset="100%" stopColor="#2B1008" />
              </linearGradient>
            </defs>
            {/* Bean Outer Hull */}
            <path
              d="M 50 5 C 80 5, 95 35, 95 67.5 C 95 100, 80 130, 50 130 C 20 130, 5 100, 5 67.5 C 5 35, 20 5, 50 5 Z"
              fill={`url(#beanGrad-${bean.id})`}
            />
            {/* Center Characteristic S-Curve Crease */}
            <path
              d="M 50 10 Q 62 45, 46 67.5 Q 32 90, 50 125"
              stroke="#DDA15E"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.65"
            />
            {/* Highlights */}
            <path
              d="M 28 25 C 20 40, 20 60, 24 75"
              stroke="#EDE0CC"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.25"
            />
          </svg>
        </motion.div>
      ))}

      {/* 5. Delicate Rising Steam Wisps */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[220px] pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [20, -50],
              x: [i % 2 === 0 ? -12 : 12, i % 2 === 0 ? 12 : -12],
              opacity: [0, 0.35, 0],
              scale: [0.9, 1.25],
            }}
            transition={{
              duration: 5.5 + i * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.8,
            }}
            className="absolute bottom-0 text-[#802B12]"
            style={{ left: `${30 + i * 22}%` }}
          >
            <svg width="45" height="110" viewBox="0 0 45 110" fill="none">
              <path
                d="M 22 105 Q 10 75, 25 50 Q 38 25, 22 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 6. Golden Shimmering Warm Dust Motes */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.2, 0.75, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: sp.delay,
          }}
          style={{
            top: sp.top,
            left: sp.left,
            right: sp.right,
            width: sp.size,
            height: sp.size,
          }}
          className="absolute rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] pointer-events-none"
        />
      ))}

      {/* 7. Organic Kraft Grain Texture Overlay */}
      <div className="absolute inset-0 bg-grain opacity-35 pointer-events-none" />
    </div>
  );
};
