import React, { useState, useEffect } from 'react';
import { X, MessageCircle, User, Phone, FileText, CheckCircle2, UtensilsCrossed, Truck, ShoppingBag, MapPin, Sparkles, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePersonalizedCardBlob } from '../services/whatsappOrderService';

export interface WhatsAppOrderTarget {
  itemName: string;
  price: number;
  category?: string;
  inquiryType: 'Offer Banner' | 'Menu Item' | 'Table Query' | 'Direct Order';
  promoCode?: string;
}

export type DiningOption = 'Dine-In' | 'Delivery' | 'Takeaway';

interface WhatsAppOrderModalProps {
  orderTarget: WhatsAppOrderTarget | null;
  onClose: () => void;
  onConfirmOrder: (data: {
    customerName: string;
    customerPhone: string;
    itemName: string;
    price: number;
    category?: string;
    inquiryType: 'Offer Banner' | 'Menu Item' | 'Table Query' | 'Direct Order';
    diningOption: DiningOption;
    promoCode?: string;
    customNote?: string;
    cardBlob?: Blob | null;
  }) => void;
}

const CUSTOMER_PROFILE_KEY = 'coffeeland_customer_profile';

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  orderTarget,
  onClose,
  onConfirmOrder,
}) => {
  const [diningOption, setDiningOption] = useState<DiningOption>('Dine-In');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(null);

  // Load saved customer profile if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.phone) setCustomerPhone(parsed.phone);
        if (parsed.address) setDeliveryAddress(parsed.address);
      }
    } catch (e) {
      console.warn('Could not read customer profile', e);
    }
  }, [orderTarget]);

  // Pre-generate pass card image so it is ready immediately for sharing/clipboard
  useEffect(() => {
    if (!orderTarget) return;
    let isCancelled = false;

    let note = customNote.trim();
    if (diningOption === 'Delivery' && deliveryAddress.trim()) {
      note = `Deliver To: ${deliveryAddress.trim()}${note ? ` | Note: ${note}` : ''}`;
    } else if (diningOption === 'Dine-In' && tableNumber.trim()) {
      note = `Table #${tableNumber.trim()}${note ? ` | Note: ${note}` : ''}`;
    }

    generatePersonalizedCardBlob({
      customerName: customerName.trim() || 'Direct Guest',
      customerPhone: customerPhone.trim(),
      itemName: orderTarget.itemName,
      price: orderTarget.price,
      diningOption,
      customNote: note || undefined,
    }).then((blob) => {
      if (!isCancelled && blob) {
        setCardBlob(blob);
        const url = URL.createObjectURL(blob);
        setCardPreviewUrl(url);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [orderTarget, diningOption, customerName, customerPhone, deliveryAddress, tableNumber, customNote]);

  if (!orderTarget) return null;

  // Theming based on Dining Option (Red for Dine-In, Blue for Delivery, Green for Takeaway)
  const theme = {
    'Dine-In': {
      title: 'DINE-IN',
      subtitle: 'Fresh Table Service',
      passLabel: 'DINE-IN PASS',
      colorName: 'Red',
      badgeBg: 'bg-red-600',
      badgeLightBg: 'bg-red-50 text-red-900 border-red-200',
      ribbonDark: '#7F1D1D',
      ribbonMain: '#B91C1C',
      ribbonLight: '#DC2626',
      accentText: 'text-red-700',
      activeRing: 'ring-red-600 border-red-600',
      btnBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      emoji: '🔴',
      icon: UtensilsCrossed,
      tagline: 'Fresh Table Service at Resto & Cafe',
    },
    Delivery: {
      title: 'DELIVERY',
      subtitle: 'Doorstep Delivery',
      passLabel: 'DELIVERY PASS',
      colorName: 'Blue',
      badgeBg: 'bg-blue-600',
      badgeLightBg: 'bg-blue-50 text-blue-900 border-blue-200',
      ribbonDark: '#1E3A8A',
      ribbonMain: '#1D4ED8',
      ribbonLight: '#2563EB',
      accentText: 'text-blue-700',
      activeRing: 'ring-blue-600 border-blue-600',
      btnBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      emoji: '🔵',
      icon: Truck,
      tagline: 'Hot & Fresh at Your Doorstep',
    },
    Takeaway: {
      title: 'TAKEAWAY',
      subtitle: 'Express Pickup',
      passLabel: 'TAKEAWAY PASS',
      colorName: 'Green',
      badgeBg: 'bg-emerald-600',
      badgeLightBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      ribbonDark: '#064E3B',
      ribbonMain: '#059669',
      ribbonLight: '#10B981',
      accentText: 'text-emerald-700',
      activeRing: 'ring-emerald-600 border-emerald-600',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      emoji: '🟢',
      icon: ShoppingBag,
      tagline: 'Express Counter Pickup Parcel',
    },
  }[diningOption];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = customerName.trim() || 'Direct Guest';
    const trimmedPhone = customerPhone.trim();

    // Remember customer profile for future visits
    try {
      localStorage.setItem(
        CUSTOMER_PROFILE_KEY,
        JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          address: deliveryAddress.trim(),
        })
      );
    } catch (err) {
      console.warn('Failed to save profile', err);
    }

    let finalNote = customNote.trim();
    if (diningOption === 'Delivery' && deliveryAddress.trim()) {
      finalNote = `Deliver To: ${deliveryAddress.trim()}${finalNote ? ` | Note: ${finalNote}` : ''}`;
    } else if (diningOption === 'Dine-In' && tableNumber.trim()) {
      finalNote = `Table #${tableNumber.trim()}${finalNote ? ` | Note: ${finalNote}` : ''}`;
    }

    let activeBlob = cardBlob;
    if (!activeBlob) {
      activeBlob = await generatePersonalizedCardBlob({
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        itemName: orderTarget.itemName,
        price: orderTarget.price,
        diningOption,
        customNote: finalNote || undefined,
      });
    }

    onConfirmOrder({
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      itemName: orderTarget.itemName,
      price: orderTarget.price,
      category: orderTarget.category,
      inquiryType: orderTarget.inquiryType,
      diningOption,
      promoCode: orderTarget.promoCode,
      customNote: finalNote || undefined,
      cardBlob: activeBlob,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2B1B16]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl border border-amber-900/20 shadow-2xl p-4 sm:p-6 z-10 text-espresso-950 overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Title & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl ${theme.badgeBg} text-white flex items-center justify-center shadow-md transition-colors duration-300`}>
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso-950 leading-tight">
                  Order via WhatsApp ({theme.title})
                </h3>
                <p className="text-[11px] text-coffee-700">Coffee Land Resto & Cafe • +91 95425 25665</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-amber-900/10 text-coffee-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* 1. THREE COLOR OPTIONS: DINE-IN (RED), DELIVERY (BLUE), TAKEAWAY (GREEN) */}
          {/* ============================================================ */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Select Order Type (Dine-In, Delivery, Takeaway)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Dine-In (Red) */}
              <button
                type="button"
                onClick={() => setDiningOption('Dine-In')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${
                  diningOption === 'Dine-In'
                    ? 'border-red-600 bg-red-50 text-red-950 shadow-md ring-2 ring-red-400/40 scale-[1.02]'
                    : 'border-amber-900/15 bg-white text-coffee-800 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${diningOption === 'Dine-In' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs">Dine-In</span>
                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">🔴 Red Pass</span>
              </button>

              {/* Delivery (Blue) */}
              <button
                type="button"
                onClick={() => setDiningOption('Delivery')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${
                  diningOption === 'Delivery'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-md ring-2 ring-blue-400/40 scale-[1.02]'
                    : 'border-amber-900/15 bg-white text-coffee-800 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${diningOption === 'Delivery' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs">Delivery</span>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">🔵 Blue Pass</span>
              </button>

              {/* Takeaway (Green) */}
              <button
                type="button"
                onClick={() => setDiningOption('Takeaway')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${
                  diningOption === 'Takeaway'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-400/40 scale-[1.02]'
                    : 'border-amber-900/15 bg-white text-coffee-800 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${diningOption === 'Takeaway' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs">Takeaway</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">🟢 Green Pass</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. ORDER SUMMARY BAR (CLEAN & SLEEK IN WEBSITE) */}
          {/* ============================================================ */}
          <div className="mb-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-900/10 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${theme.badgeBg}`}>
                <theme.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-espresso-950 font-serif line-clamp-1">
                  {orderTarget.itemName}
                </div>
                <div className="text-[11px] text-coffee-700">
                  {orderTarget.category || 'Specialty'} • <span className={`font-bold ${theme.accentText}`}>{theme.title} ({theme.colorName} Pass)</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Bill Total</div>
              <div className="text-base font-black font-serif text-espresso-950">₹{orderTarget.price}</div>
            </div>
          </div>

          {/* Official Pass Card Live Image Preview */}
          <div className="mb-3 text-center">
            <div className="relative rounded-2xl overflow-hidden border border-amber-900/20 shadow-md aspect-[736/522] w-full max-w-[340px] mx-auto bg-parchment-200">
              {cardPreviewUrl ? (
                <img
                  src={cardPreviewUrl}
                  alt={`${theme.title} Order Pass Card`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-coffee-700 animate-pulse">
                  Preparing your {theme.title} Pass Card...
                </div>
              )}
            </div>
            {cardPreviewUrl && (
              <div className="mt-1 flex items-center justify-center gap-2">
                <a
                  href={cardPreviewUrl}
                  download={`CoffeeLand-${diningOption}-Pass.jpg`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coffee-700 hover:text-espresso-950 transition-colors py-1 px-3 rounded-full bg-white border border-amber-900/15 shadow-2xs"
                  title="Download this Pass Card Image"
                >
                  <Download className="w-3.5 h-3.5 text-terracotta" />
                  <span>Download Pass Image</span>
                </a>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 3. ORDER INPUT FORM */}
          {/* ============================================================ */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-terracotta" />
                  <span>Your Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sri Ram / Rajesh"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 focus:outline-none focus:ring-2 focus:ring-terracotta text-xs text-espresso-950 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-terracotta" />
                  <span>Mobile (WhatsApp) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 98480 12345"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 focus:outline-none focus:ring-2 focus:ring-terracotta text-xs text-espresso-950 shadow-xs"
                />
              </div>
            </div>

            {/* Conditional Field: Delivery Address or Table Number */}
            {diningOption === 'Delivery' ? (
              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Delivery Address & Landmark *</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House/Flat No., Street, Colony, Landmark..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-espresso-950 shadow-xs"
                />
              </div>
            ) : diningOption === 'Dine-In' ? (
              <div>
                <label className="block text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-red-600" />
                  <span>Table Number (Optional if already seated)</span>
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 4 / Corner Booth (or leave blank)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs text-espresso-950 shadow-xs"
                />
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold text-espresso-900 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-terracotta" />
                <span>Special Cooking Instructions / Note (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Less spicy, extra sauce, packing for later..."
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-900/15 focus:outline-none focus:ring-2 focus:ring-terracotta text-xs text-espresso-950 resize-none shadow-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3.5 px-4 rounded-xl ${theme.btnBg} text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]`}
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm & Send {theme.title} Order via WhatsApp</span>
              </button>

              <p className="text-[11px] text-coffee-600 text-center mt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Connects directly to Coffee Land WhatsApp (+91 95425 25665)</span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
