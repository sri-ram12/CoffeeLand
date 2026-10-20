import React from 'react';

interface HotFoodVapourEffectProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'high';
}

/**
 * HotFoodVapourEffect renders an authentic rising vapour and steam fog animation
 * directly over hot food and beverage images, creating the visual impression of piping hot dishes.
 */
export const HotFoodVapourEffect: React.FC<HotFoodVapourEffectProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const opacityMultiplier = intensity === 'high' ? 1 : intensity === 'subtle' ? 0.6 : 0.85;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}
      style={{ opacity: opacityMultiplier }}
      aria-hidden="true"
    >
      {/* 1. Ambient Heat Fog / Warm Mist Layer pulsing right above the food surface */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-full bg-gradient-to-t from-white/30 via-amber-100/20 to-transparent blur-xl animate-heat-fog" />

      {/* 2. Realistic Rising Steam Plumes / Vapour Wisps */}
      <svg
        viewBox="0 0 200 240"
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle semi-transparent gradient for steam streams */}
          <linearGradient id="steamGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="steamGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0" />
            <stop offset="25%" stopColor="#FFF7ED" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#FFF7ED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF7ED" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="steamGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Soft Blur Filter for realistic gaseous diffusion */}
          <filter id="steamBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <filter id="softMistBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
        </defs>

        {/* Stream 1 - Left Curling Steam Plume */}
        <path
          d="M 65 190 Q 52 140, 70 100 T 58 30"
          stroke="url(#steamGrad1)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-rise-1 origin-bottom"
        />

        {/* Stream 2 - Center-Left Dense Vapour Column */}
        <path
          d="M 95 200 Q 112 145, 90 95 T 105 25"
          stroke="url(#steamGrad2)"
          strokeWidth="9"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-rise-2 origin-bottom"
        />

        {/* Stream 3 - Center-Right Rising Steam Ribbon */}
        <path
          d="M 125 195 Q 110 140, 132 90 T 120 20"
          stroke="url(#steamGrad1)"
          strokeWidth="7.5"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-rise-3 origin-bottom"
        />

        {/* Stream 4 - Right Floating Steam Trail */}
        <path
          d="M 148 185 Q 162 135, 144 85 T 156 15"
          stroke="url(#steamGrad3)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-rise-4 origin-bottom"
        />

        {/* Ambient Fog Cloud 1 - Drifting Warm Haze */}
        <ellipse
          cx="100"
          cy="150"
          rx="55"
          ry="25"
          fill="url(#steamGrad2)"
          filter="url(#softMistBlur)"
          className="animate-fog-drift origin-center"
        />

        {/* Ambient Fog Cloud 2 - Upper Dispersing Mist */}
        <ellipse
          cx="115"
          cy="95"
          rx="45"
          ry="20"
          fill="url(#steamGrad1)"
          filter="url(#softMistBlur)"
          className="animate-fog-drift-2 origin-center"
        />
      </svg>

      {/* 3. Subtle Animated "Fresh & Steaming" Indicator Badge on Top-Right */}
      <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 shadow-sm border border-amber-400/25">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="tracking-wide uppercase text-[9px]">Piping Hot</span>
      </div>
    </div>
  );
};

/**
 * Helper to determine if a dish or category qualifies as a hot food item
 */
export const isHotFoodItem = (category?: string, name?: string): boolean => {
  if (!category && !name) return false;
  const cat = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Exclude explicit cold drink categories
  if (
    cat.includes('cold-coffee') ||
    cat.includes('juices') ||
    cat.includes('mocktails') ||
    cat.includes('thickshake') ||
    n.includes('frappe') ||
    n.includes('iced') ||
    n.includes('cold brew') ||
    n.includes('chilled')
  ) {
    return false;
  }

  // Hot food / hot beverage categories
  const hotCategories = [
    'hot-coffee',
    'hot-chocolate-tea',
    'pizza',
    'pasta',
    'burgers',
    'sandwiches',
    'wraps',
    'veg-appetizers',
    'non-veg-appetizers',
    'fried-rice-bowls',
    'soup-salads',
    'waffles-pancakes',
    'kunafa-desserts',
  ];

  if (hotCategories.some((c) => cat.includes(c))) return true;

  // Food keywords
  const hotKeywords = [
    'hot', 'espresso', 'cappuccino', 'latte', 'americano', 'mocha', 'tea', 'chai',
    'pizza', 'burger', 'pasta', 'rice', 'soup', 'sizzler', 'brownie', 'crispy',
    'grilled', 'paneer', 'chicken', 'roast', 'fried', 'waffle', 'panini', 'wrap', 'cheese'
  ];

  return hotKeywords.some((k) => n.includes(k));
};
