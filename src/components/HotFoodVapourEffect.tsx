import React from 'react';

interface HotFoodVapourEffectProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'high';
}

/**
 * Fog animation removed as requested by user to keep food items clean and clear.
 */
export const HotFoodVapourEffect: React.FC<HotFoodVapourEffectProps> = () => {
  return null;
};

export function isHotFoodItem(_category?: string, _name?: string): boolean {
  return false;
}
