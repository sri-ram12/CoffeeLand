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

export type BillboardDesignTheme = 'white-brick' | 'burgundy-wave' | 'navy-torn';

export interface BillboardBanner {
  id: string;
  designTheme?: BillboardDesignTheme; // 'white-brick' | 'burgundy-wave' | 'navy-torn'
  highlightText: string;     // e.g. "SUPER" | "FRESH" | "TODAY'S"
  scriptText: string;        // e.g. "Delicious" | "Special fresh" | "Today's Special"
  foodName: string;          // e.g. "Pizza" | "Burger" | "PIZZA"
  menuTag: string;           // e.g. "MENU" | "SPECIAL"
  limitedOfferTag: string;   // e.g. "LIMITED OFFER" | "LIMITED TIME OFFER"
  discountBadgeText: string; // e.g. "50% OFF" | "10 $" | "15 $" | "₹149"
  discountBadgeSub: string;  // e.g. "Get Up To" | "Only" | "Price"
  deliveryNote: string;      // e.g. "Free Home Delivery" | "FREE DELIVERY"
  phone: string;             // e.g. "+91 90329 92524" | "+91 95425 25665"
  websiteUrl: string;        // e.g. "WWW.COFFEELAND.IN"
  buttonText: string;        // e.g. "ORDER NOW"
  image: string;             // e.g. "/banners/pizza_board.png" | "/banners/burger_double.png" | "/banners/pizza_pan.png"
  accentColor?: string;      // e.g. "#E52525" | "#F59E0B" | "#0A1931"
  isActive: boolean;
  originalPrice?: number;
  offerPrice?: number;
}

export interface WhatsAppInquiry {
  id: string;
  customerName: string;
  customerPhone?: string;
  itemName: string;
  category?: string;
  price: number;
  inquiryType: 'Offer Banner' | 'Menu Item' | 'Table Query' | 'Direct Order';
  diningOption?: 'Dine-In' | 'Delivery' | 'Takeaway';
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
