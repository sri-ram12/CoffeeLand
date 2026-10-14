export type BannerColorTheme =
  | 'terracotta'
  | 'emerald'
  | 'amber'
  | 'espresso'
  | 'crimson'
  | 'violet'
  | 'ocean';

export interface OfferBanner {
  id: string;
  title: string;
  subtitle: string;
  itemName: string;
  originalPrice: number;
  offerPrice: number;
  discountLabel: string; // e.g. "30% OFF", "BUY 1 GET 1", "FLAT ₹50 OFF"
  promoCode?: string;
  image: string;
  themeColor: BannerColorTheme;
  isActive: boolean;
  expiryNote?: string;
  category?: string;
}

export interface WhatsAppInquiry {
  id: string;
  customerName: string;
  customerPhone?: string;
  itemName: string;
  category?: string;
  price: number;
  inquiryType: 'Offer Banner' | 'Menu Item' | 'Table Query' | 'Direct Order';
  promoCode?: string;
  message: string;
  timestamp: string;
  status: 'Inquired' | 'Confirmed' | 'Completed';
}

export interface LiveFoodReel {
  id: string;
  dishName: string;
  category: 'Pizza' | 'Coffee' | 'Burger' | 'Mocktails' | 'Fried Chicken' | 'Kunafa';
  pinterestUrl: string;
  videoSrc?: string;
  thumbnailUrl: string;
  price: number;
  tag: string;
  description: string;
}
