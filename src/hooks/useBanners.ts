import { useState, useEffect } from 'react';
import { OfferBanner, BillboardBanner, WhatsAppInquiry } from '../types/banner';
import { api } from '../services/api';

const BANNERS_STORAGE_KEY = 'coffeeland_offer_banners_v1';
const BILLBOARD_BANNERS_STORAGE_KEY = 'coffeeland_billboard_banners_v6';
const INQUIRIES_STORAGE_KEY = 'coffeeland_whatsapp_inquiries_v1';

export const DEFAULT_BILLBOARD_BANNERS: BillboardBanner[] = [
  {
    id: 'billboard-1',
    designTheme: 'white-brick',
    highlightText: 'SUPER',
    scriptText: 'Delicious',
    foodName: 'Pizza',
    menuTag: 'MENU',
    limitedOfferTag: 'LIMITED OFFER',
    discountBadgeText: '50% OFF',
    discountBadgeSub: 'Get Up To',
    deliveryNote: 'Free Home Delivery',
    phone: '+91 90329 92524',
    websiteUrl: 'WWW.COFFEELAND.IN',
    buttonText: 'ORDER NOW',
    image: '/banners/pizza_board.png',
    accentColor: '#DC2626',
    isActive: true,
    originalPrice: 399,
    offerPrice: 199
  },
  {
    id: 'billboard-2',
    designTheme: 'burgundy-wave',
    highlightText: 'FRESH',
    scriptText: 'Special fresh',
    foodName: 'Burger',
    menuTag: 'SPECIAL',
    limitedOfferTag: 'LIMITED TIME',
    discountBadgeText: '₹149',
    discountBadgeSub: 'Only',
    deliveryNote: 'Hot & Juicy Double Patty',
    phone: '+91 95425 25665',
    websiteUrl: 'WWW.COFFEELAND.IN',
    buttonText: 'ORDER NOW',
    image: '/banners/burger_double.png',
    accentColor: '#F59E0B',
    isActive: true,
    originalPrice: 249,
    offerPrice: 149
  },
  {
    id: 'billboard-3',
    designTheme: 'navy-torn',
    highlightText: "TODAY'S",
    scriptText: "Today's Special",
    foodName: 'PIZZA',
    menuTag: 'SPECIAL',
    limitedOfferTag: 'LIMITED TIME OFFER',
    discountBadgeText: '₹199',
    discountBadgeSub: 'Price',
    deliveryNote: 'FREE DELIVERY',
    phone: '+91 90329 92524',
    websiteUrl: 'WWW.COFFEELAND.IN',
    buttonText: 'ORDER NOW',
    image: '/banners/pizza_pan.png',
    accentColor: '#FBBF24',
    isActive: true,
    originalPrice: 299,
    offerPrice: 199
  }
];

export const DEFAULT_OFFER_BANNERS: OfferBanner[] = [
  {
    id: 'banner-1',
    title: 'Weekend Burger Crave Fest',
    subtitle: 'Double Grilled Fillet with Gouda & Crispy Bacon',
    itemName: "Chef's Spl Non-Veg Burger",
    originalPrice: 199,
    offerPrice: 159,
    discountLabel: '20% OFF',
    promoCode: 'BURGER20',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    themeColor: 'terracotta',
    isActive: true,
    expiryNote: 'Valid Saturday & Sunday Only',
    category: 'Gourmet Brioche Burgers'
  },
  {
    id: 'banner-2',
    title: 'Middle-Eastern Royal Special',
    subtitle: 'Golden Kataifi Crust with Stretchy Sweet Cheese & Biscoff',
    itemName: 'Lotus Biscoff Kunafa',
    originalPrice: 249,
    offerPrice: 199,
    discountLabel: 'FLAT ₹50 OFF',
    promoCode: 'KUNAFA50',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9588?auto=format&fit=crop&w=800&q=80',
    themeColor: 'amber',
    isActive: true,
    expiryNote: 'Limited Daily Servings',
    category: 'Signature Desserts'
  },
  {
    id: 'banner-3',
    title: 'Stone-Baked Pizza Feast',
    subtitle: '48-Hr Fermented Crust with Plum Italian Tomatoes & Basil',
    itemName: 'Neapolitan Margarita Pizza',
    originalPrice: 229,
    offerPrice: 169,
    discountLabel: 'SAVE ₹60',
    promoCode: 'PIZZAFEST',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    themeColor: 'emerald',
    isActive: true,
    expiryNote: 'Dine-in & Takeaway Only',
    category: 'Artisanal Pizzas'
  },
  {
    id: 'banner-4',
    title: 'Signature Coffee & Dessert Pair',
    subtitle: 'Double Arabica Cappuccino + Sizzling Chocolate Brownie',
    itemName: 'Artisan Brew & Brownie Pair',
    originalPrice: 248,
    offerPrice: 179,
    discountLabel: 'COMBO 28% OFF',
    promoCode: 'PAIR179',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    themeColor: 'espresso',
    isActive: true,
    expiryNote: 'Daily 2 PM to 7 PM Happy Hours',
    category: 'Specialty Combos'
  },
  {
    id: 'banner-5',
    title: 'Golden Fried Chicken Bucket',
    subtitle: 'Crunchy Secret Herb Coating with Cheesy Garlic Dip',
    itemName: 'Crispy Fried Chicken Combo',
    originalPrice: 279,
    offerPrice: 219,
    discountLabel: 'FLAT ₹60 OFF',
    promoCode: 'CRISP60',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    themeColor: 'crimson',
    isActive: true,
    expiryNote: 'Student ID Special Discount',
    category: 'Fried Chicken'
  },
  {
    id: 'banner-6',
    title: 'Chilled Blue Mocktail & Roll',
    subtitle: 'Sparkling Curacao Cooler with Peri-Peri Paneer Roll',
    itemName: 'Blue Lagoon & Paneer Roll Duo',
    originalPrice: 208,
    offerPrice: 149,
    discountLabel: 'COMBO ₹149',
    promoCode: 'DUO149',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
    themeColor: 'ocean',
    isActive: true,
    expiryNote: 'All Day Refreshment Special',
    category: 'Beverage & Bites'
  }
];

export const INITIAL_WHATSAPP_INQUIRIES: WhatsAppInquiry[] = [];

export const useBanners = () => {
  const [banners, setBanners] = useState<OfferBanner[]>(() => {
    try {
      const saved = localStorage.getItem(BANNERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved banners', e);
    }
    return DEFAULT_OFFER_BANNERS;
  });

  const [inquiries, setInquiries] = useState<WhatsAppInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (saved) {
        const parsed: WhatsAppInquiry[] = JSON.parse(saved);
        // Clean out legacy mock test orders so only real customer orders remain
        const realOnly = parsed.filter(i => 
          !['inq-101', 'inq-102', 'inq-103'].includes(i.id) &&
          !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(i.customerName)
        );
        return realOnly;
      }
    } catch (e) {
      console.error('Failed to parse saved inquiries', e);
    }
    return [];
  });

  // Synchronize inquiries with server
  useEffect(() => {
    let isMounted = true;
    async function syncInquiries() {
      try {
        const serverInquiries = await api.getInquiries();
        if (isMounted && Array.isArray(serverInquiries) && serverInquiries.length > 0) {
          setInquiries(serverInquiries);
        }
      } catch (err) {
        console.warn('Could not sync inquiries from server:', err);
      }
    }
    syncInquiries();
    return () => { isMounted = false; };
  }, []);

  // Persist banners
  useEffect(() => {
    try {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
    } catch (e) {
      console.error('Failed to save banners to localStorage', e);
    }
  }, [banners]);

  // Persist inquiries
  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries to localStorage', e);
    }
  }, [inquiries]);

  // Add new banner
  const addBanner = (newBanner: Omit<OfferBanner, 'id'>) => {
    const bannerWithId: OfferBanner = {
      ...newBanner,
      id: `banner-${Date.now()}`
    };
    setBanners((prev) => [bannerWithId, ...prev]);
    return bannerWithId;
  };

  // Update existing banner
  const updateBanner = (id: string, updatedFields: Partial<OfferBanner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  // Delete banner
  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Toggle active status
  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Reset to default banners
  const resetBanners = () => {
    setBanners(DEFAULT_OFFER_BANNERS);
  };

  const sendWhatsAppInquiry = (data: {
    customerName?: string;
    customerPhone?: string;
    itemName: string;
    category?: string;
    price: number;
    inquiryType: 'Offer Banner' | 'Menu Item' | 'Table Query' | 'Direct Order';
    diningOption?: 'Dine-In' | 'Delivery' | 'Takeaway';
    promoCode?: string;
    customNote?: string;
  }) => {
    let finalCustomerName = data.customerName?.trim();
    let finalCustomerPhone = data.customerPhone?.trim();

    if (!finalCustomerName || !finalCustomerPhone) {
      try {
        const storedProfile = localStorage.getItem('coffeeland_customer_profile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          if (!finalCustomerName && profile.name) finalCustomerName = profile.name;
          if (!finalCustomerPhone && profile.phone) finalCustomerPhone = profile.phone;
        }
      } catch (e) {
        console.warn('Error reading customer profile', e);
      }
    }

    const dining = data.diningOption || 'Dine-In';
    const tagEmoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
    const tagColor = dining === 'Dine-In' ? 'RED' : dining === 'Delivery' ? 'BLUE' : 'GREEN';
    const typeLabel = dining === 'Dine-In' ? 'DINE-IN ORDER' : dining === 'Delivery' ? 'HOME DELIVERY ORDER' : 'TAKEAWAY PARCEL ORDER';
    const subLabel = dining === 'Dine-In' ? 'Fresh Table Service' : dining === 'Delivery' ? 'Doorstep Express Delivery' : 'Express Counter Pickup';

    const orderWhatsAppText = `🎀${tagEmoji}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${tagEmoji}🎀
           *${typeLabel}*
        _${subLabel}_
  ${tagEmoji} *COFFEE LAND RESTO & CAFE* (${tagColor} PASS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📌 *TO:* Coffee Land Resto & Cafe
         Temples Bypass Rd, Sangivalasa
 👤 *FROM:* ${finalCustomerName || 'Direct Guest'}${finalCustomerPhone ? ` (${finalCustomerPhone})` : ''}
────────────────────────────────────
 🍽️ *ITEM:* ${data.itemName}
 🏷️ *CATEGORY:* ${data.category || 'Specialty Dish'}
 💰 *TOTAL:* ₹${data.price}${data.promoCode ? ` (Promo: ${data.promoCode})` : ''}
${data.customNote ? ` 📝 *NOTE / ADDRESS:* ${data.customNote}\n` : ''} ⏰ *ORDER TIME:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨ Please prepare & confirm this ${typeLabel}! ✨`;

    const message = orderWhatsAppText;

    const newInquiry: WhatsAppInquiry = {
      id: `inq-${Date.now()}`,
      customerName: finalCustomerName || 'Direct Guest',
      customerPhone: finalCustomerPhone || '',
      itemName: data.itemName,
      category: data.category || 'Specialty Dish',
      price: data.price,
      inquiryType: data.inquiryType,
      diningOption: dining,
      promoCode: data.promoCode,
      message,
      timestamp: new Date().toISOString(),
      status: 'Inquired'
    };

    // Update local state and storage
    setInquiries((prev) => [newInquiry, ...prev]);

    // Send to backend server database so owner admin panel and Excel reports get it live
    api.addInquiry({
      customerName: newInquiry.customerName,
      customerPhone: newInquiry.customerPhone,
      itemName: newInquiry.itemName,
      category: newInquiry.category,
      price: newInquiry.price,
      inquiryType: newInquiry.inquiryType,
      diningOption: dining,
      promoCode: newInquiry.promoCode,
      customNote: message
    }).catch((err) => console.warn('Could not post inquiry to server database:', err));

    // Open WhatsApp with owner's number (+91 95425 25665)
    const phone = '919542525665';
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }

    return newInquiry;
  };

  const [billboardBanners, setBillboardBanners] = useState<BillboardBanner[]>(() => {
    try {
      const saved = localStorage.getItem(BILLBOARD_BANNERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          const sanitized = parsed.map((b: BillboardBanner, idx: number) => {
            const hasDummyPhone = !b.phone || b.phone.includes('323') || b.phone.includes('0123') || b.phone.includes('8568');
            const cleanPhone = hasDummyPhone ? (idx === 1 ? '+91 95425 25665' : '+91 90329 92524') : b.phone;
            return {
              ...b,
              phone: cleanPhone,
              discountBadgeText: b.discountBadgeText === '10 $' ? '₹149' : b.discountBadgeText === '15 $' ? '₹199' : b.discountBadgeText,
              image: b.image
                ?.replace('/banners/pizza_board.jpg', '/banners/pizza_board.png')
                ?.replace('/banners/burger_double.jpg', '/banners/burger_double.png')
                ?.replace('/banners/pizza_pan.jpg', '/banners/pizza_pan.png') || b.image,
              isActive: true // Guarantee autoscroll works across all 3 banners
            };
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved billboard banners', e);
    }
    return DEFAULT_BILLBOARD_BANNERS;
  });

  // Persist billboard banners
  useEffect(() => {
    try {
      localStorage.setItem(BILLBOARD_BANNERS_STORAGE_KEY, JSON.stringify(billboardBanners));
    } catch (e) {
      console.error('Failed to save billboard banners to localStorage', e);
    }
  }, [billboardBanners]);

  const addBillboardBanner = (newBanner: Omit<BillboardBanner, 'id'>) => {
    const bannerWithId: BillboardBanner = {
      ...newBanner,
      id: `billboard-${Date.now()}`
    };
    setBillboardBanners((prev) => [bannerWithId, ...prev]);
    return bannerWithId;
  };

  const updateBillboardBanner = (id: string, updatedFields: Partial<BillboardBanner>) => {
    setBillboardBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deleteBillboardBanner = (id: string) => {
    setBillboardBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBillboardBannerStatus = (id: string) => {
    setBillboardBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const resetBillboardBanners = () => {
    setBillboardBanners(DEFAULT_BILLBOARD_BANNERS);
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const clearInquiries = () => {
    setInquiries([]);
  };

  const updateInquiryStatus = (id: string, status: 'Inquired' | 'Confirmed' | 'Completed') => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  return {
    banners,
    activeBanners: banners.filter((b) => b.isActive),
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    resetBanners,
    billboardBanners,
    activeBillboardBanner:
      billboardBanners.find((b) => b.isActive) || billboardBanners[0] || DEFAULT_BILLBOARD_BANNERS[0],
    addBillboardBanner,
    updateBillboardBanner,
    deleteBillboardBanner,
    toggleBillboardBannerStatus,
    resetBillboardBanners,
    inquiries,
    sendWhatsAppInquiry,
    deleteInquiry,
    clearInquiries,
    updateInquiryStatus
  };
};
