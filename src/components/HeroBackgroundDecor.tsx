import React from 'react';
import { motion } from 'framer-motion';

export const HeroBackgroundDecor: React.FC = () => {
  // Coffee bean particles with positions, sizes, and animation parameters
  const coffeeBeans = [
    { id: 1, top: '15%', left: '8%', size: 36, rotate: 25, duration: 6.5, delay: 0 },
    { id: 2, top: '22%', right: '12%', size: 42, rotate: -35, duration: 7.2, delay: 1.2 },
    { id: 3, top: '65%', left: '10%', size: 38, rotate: 45, duration: 6.8, delay: 0.5 },
    { id: 4, top: '75%', right: '15%', size: 44, rotate: -20, duration: 7.8, delay: 2.0 },
    { id: 5, top: '40%', right: '6%', size: 34, rotate: 60, duration: 6.0, delay: 1.6 },
    { id: 6, top: '85%', left: '42%', size: 32, rotate: -40, duration: 6.2, delay: 0.9 },
    { id: 7, top: '12%', left: '48%', size: 28, rotate: 15, duration: 7.0, delay: 2.5 },
  ];

  // Golden warm sparkles
  const sparkles = [
    { id: 1, top: '18%', left: '22%', size: 4, duration: 4.5, delay: 0.2 },
    { id: 2, top: '35%', right: '28%', size: 5, duration: 5.2, delay: 1.4 },
    { id: 3, top: '55%', left: '30%', size: 6, duration: 6.0, delay: 0.8 },
    { id: 4, top: '72%', right: '22%', size: 4, duration: 4.8, delay: 2.1 },
    { id: 5, top: '28%', left: '75%', size: 5, duration: 5.5, delay: 1.9 },
    { id: 6, top: '82%', left: '60%', size: 4, duration: 4.2, delay: 0.6 },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Luminous Ambient Color Blurs (Soft, light, non-dominating) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.14, 0.08],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] sm:w-[900px] h-[550px] bg-gradient-to-b from-[#802B12]/8 via-[#B8823F]/5 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.12, 0.06],
          y: [-15, 25, -15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/4 -left-28 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.06, 0.12, 0.06],
          x: [15, -25, 15],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -right-24 w-[550px] h-[550px] bg-terracotta/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* 3. Floating Ethereal Coffee Beans (Light Golden Caramel & Honey Roast Tones - Crisp, Visible & NOT Faded Out) */}
      {coffeeBeans.map((bean, index) => {
        // Alternating warm light-roast profiles: Golden Caramel and Honey Amber
        const isProfileA = index % 2 === 0;

        return (
          <motion.div
            key={bean.id}
            animate={{
              y: [-18, 18, -18],
              x: [bean.id % 2 === 0 ? -10 : 10, bean.id % 2 === 0 ? 10 : -10, bean.id % 2 === 0 ? -10 : 10],
              rotate: [bean.rotate - 14, bean.rotate + 16, bean.rotate - 14],
              scale: [0.95, 1.06, 0.95],
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
            className="absolute opacity-80 hover:opacity-100 transition-opacity filter drop-shadow-[0_6px_14px_rgba(127,68,25,0.28)] pointer-events-none"
          >
            {/* Stylized Realistic Coffee Bean SVG in Lighter Warm Golden Roast */}
            <svg viewBox="0 0 100 135" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id={`beanGrad-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  {isProfileA ? (
                    <>
                      <stop offset="0%" stopColor="#E2A66C" />
                      <stop offset="32%" stopColor="#C88448" />
                      <stop offset="68%" stopColor="#A8612B" />
                      <stop offset="100%" stopColor="#824217" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#EAB77E" />
                      <stop offset="32%" stopColor="#D29557" />
                      <stop offset="68%" stopColor="#B47235" />
                      <stop offset="100%" stopColor="#8E4E1E" />
                    </>
                  )}
                </linearGradient>
                <linearGradient id={`beanHighlight-${bean.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="55%" stopColor="#FFE5C8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#E2A66C" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Bean Outer Hull */}
              <path
                d="M 50 6 C 82 6, 96 36, 96 67.5 C 96 99, 82 129, 50 129 C 18 129, 4 99, 4 67.5 C 4 36, 18 6, 50 6 Z"
                fill={`url(#beanGrad-${bean.id})`}
                stroke="#9E5B25"
                strokeWidth="1.5"
              />

              {/* 3D Roasted Bean Sheen Highlight */}
              <ellipse
                cx="38"
                cy="34"
                rx="22"
                ry="15"
                fill={`url(#beanHighlight-${bean.id})`}
                transform="rotate(-20 38 34)"
              />

              {/* Center Characteristic S-Curve Crease Groove (Warm Deep Roast Definition) */}
              <path
                d="M 50 10 Q 64 45, 48 67.5 Q 32 90, 50 125"
                stroke="#54250C"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Crease Warm Golden Edge Highlight */}
              <path
                d="M 52 12 Q 66 47, 50 68.5 Q 34 91, 52 123"
                stroke="#F8DCB8"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Outer Rim Contour Accent for Sharp Clarity against Beige */}
              <path
                d="M 26 24 C 16 42, 16 65, 22 82"
                stroke="#FFF0DC"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>
          </motion.div>
        );
      })}

      {/* 4. Delicate Rising Steam Wisps */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[300px] h-[220px] pointer-events-none">
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

      {/* 5. Golden Shimmering Warm Dust Motes */}
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
    </div>
  );
};
