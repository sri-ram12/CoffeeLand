import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  FileText,
  CheckCircle2,
  UtensilsCrossed,
  Truck,
  ShoppingBag,
  MapPin,
  Sparkles,
  ArrowRight,
  ShoppingBag as CartIcon,
  Download,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../hooks/useCart';
import {
  DiningOption,
  sendOrderToWhatsApp,
  generatePersonalizedCardBlob,
  sharePassCardImageWithCaption,
} from '../services/whatsappOrderService';

interface CartOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onAddMoreItems: () => void;
  onInquiryRecorded?: (data: any) => void;
}

const CUSTOMER_PROFILE_KEY = 'coffeeland_customer_profile';

export const CartOrderModal: React.FC<CartOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  totalCount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddMoreItems,
  onInquiryRecorded,
}) => {
  const [diningOption, setDiningOption] = useState<DiningOption>('Dine-In');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(null);

  // Auto-populate customer profile if previously entered
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
  }, [isOpen]);

  // Pre-generate pass card image so it is ready immediately for sharing/clipboard
  useEffect(() => {
    if (!isOpen || items.length === 0) return;
    let isCancelled = false;

    let note = customNote.trim();
    if (diningOption === 'Delivery' && deliveryAddress.trim()) {
      note = `Deliver To: ${deliveryAddress.trim()}${note ? ` | Note: ${note}` : ''}`;
    } else if (diningOption === 'Dine-In' && tableNumber.trim()) {
      note = `Table #${tableNumber.trim()}${note ? ` | Note: ${note}` : ''}`;
    }

    const itemSummary =
      items.length === 1
        ? `${items[0].quantity}x ${items[0].product.name}`
        : `${items.length} Items`;

    generatePersonalizedCardBlob({
      customerName: customerName.trim() || 'Direct Guest',
      customerPhone: customerPhone.trim(),
      itemName: itemSummary,
      price: totalPrice,
      diningOption,
      customNote: note || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
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
  }, [isOpen, items, totalPrice, diningOption, customerName, customerPhone, deliveryAddress, tableNumber, customNote]);

  if (!isOpen) return null;

  // Theming based on Dining Option (Red for Dine-In, Blue for Delivery, Green for Takeaway)
  const theme = {
    'Dine-In': {
      title: 'DINE-IN',
      subtitle: 'Fresh Table Service',
      passLabel: 'DINE-IN PASS',
      colorName: 'Red',
      badgeBg: 'bg-red-600',
      badgeLightBg: 'bg-red-50 text-red-900 border-red-200',
      accentText: 'text-red-700',
      btnBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      emoji: '🔴',
      icon: UtensilsCrossed,
    },
    Delivery: {
      title: 'DELIVERY',
      subtitle: 'Doorstep Delivery',
      passLabel: 'DELIVERY PASS',
      colorName: 'Blue',
      badgeBg: 'bg-blue-600',
      badgeLightBg: 'bg-blue-50 text-blue-900 border-blue-200',
      accentText: 'text-blue-700',
      btnBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      emoji: '🔵',
      icon: Truck,
    },
    Takeaway: {
      title: 'TAKEAWAY',
      subtitle: 'Express Pickup',
      passLabel: 'TAKEAWAY PASS',
      colorName: 'Green',
      badgeBg: 'bg-emerald-600',
      badgeLightBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accentText: 'text-emerald-700',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      emoji: '🟢',
      icon: ShoppingBag,
    },
  }[diningOption];

  const handleShareCard = async () => {
    const trimmedName = customerName.trim() || 'Direct Guest';
    const trimmedPhone = customerPhone.trim();
    let finalNote = customNote.trim();
    if (diningOption === 'Delivery' && deliveryAddress.trim()) {
      finalNote = `Deliver To: ${deliveryAddress.trim()}${finalNote ? ` | Note: ${finalNote}` : ''}`;
    } else if (diningOption === 'Dine-In' && tableNumber.trim()) {
      finalNote = `Table #${tableNumber.trim()}${finalNote ? ` | Note: ${finalNote}` : ''}`;
    }

    const itemSummary =
      items.length === 1
        ? `${items[0].quantity}x ${items[0].product.name}`
        : `${items.length} Items`;

    await sharePassCardImageWithCaption({
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      itemName: itemSummary,
      price: totalPrice,
      diningOption,
      customNote: finalNote || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      cardBlob,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const trimmedName = customerName.trim() || 'Direct Guest';
    const trimmedPhone = customerPhone.trim();

    // Persist profile
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

    // Multi-item payload
    const orderPayload = {
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      itemName:
        items.length === 1
          ? `${items[0].quantity}x ${items[0].product.name}`
          : `${items.length} Items (${items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')})`,
      price: totalPrice,
      category: items.length === 1 ? items[0].product.category : 'Multi-Item Order',
      inquiryType: 'Direct Order' as const,
      diningOption,
      customNote: finalNote || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      cardBlob,
    };

    // 1. Direct synchronous dispatch straight to owner's WhatsApp (+91 95425 25665)
    sendOrderToWhatsApp(orderPayload);

    // 2. Record inquiry in backend if callback provided
    if (onInquiryRecorded) {
      onInquiryRecorded(orderPayload);
    }

    // 3. Clear cart and close modal
    onClearCart();
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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#FAF6F0] rounded-3xl border border-amber-900/20 shadow-2xl p-4 sm:p-6 z-10 text-espresso-950 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-2xl ${theme.badgeBg} text-white flex items-center justify-center shadow-md transition-colors`}
              >
                <CartIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso-950 leading-tight">
                  Your Order Cart ({totalCount} {totalCount === 1 ? 'Item' : 'Items'})
                </h3>
                <p className="text-[11px] text-coffee-700">
                  Coffee Land Resto & Cafe • Order on WhatsApp (+91 95425 25665)
                </p>
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

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            {/* Empty State */}
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-parchment-200 text-terracotta mx-auto flex items-center justify-center mb-3">
                  <CartIcon className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                  Your Cart is Empty
                </h4>
                <p className="text-xs text-coffee-600 max-w-xs mx-auto mb-4">
                  Explore our handcrafted coffees, pizzas, burgers, and treats to place your order.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onAddMoreItems();
                  }}
                  className="px-5 py-2.5 rounded-full bg-terracotta text-white font-bold text-xs shadow-md hover:bg-terracotta-600 transition-all inline-flex items-center gap-1.5"
                >
                  <span>Select Items from Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* 1. Dining Options: Dine-In (Red), Delivery (Blue), Takeaway (Green) */}
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    <span>Select Order Type & Pass Color</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Dine-In */}
                    <button
                      type="button"
                      onClick={() => setDiningOption('Dine-In')}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 text-center ${
                        diningOption === 'Dine-In'
                          ? 'border-red-600 bg-red-50 text-red-950 shadow-md ring-2 ring-red-400/40 scale-[1.02]'
                          : 'border-amber-900/15 bg-white text-coffee-800 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          diningOption === 'Dine-In' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs">Dine-In</span>
                      <span className="text-[9px] font-bold text-red-600 uppercase">🔴 Red Pass</span>
                    </button>

                    {/* Delivery */}
                    <button
                      type="button"
                      onClick={() => setDiningOption('Delivery')}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 text-center ${
                        diningOption === 'Delivery'
                          ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-md ring-2 ring-blue-400/40 scale-[1.02]'
                          : 'border-amber-900/15 bg-white text-coffee-800 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          diningOption === 'Delivery' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs">Delivery</span>
                      <span className="text-[9px] font-bold text-blue-600 uppercase">🔵 Blue Pass</span>
                    </button>

                    {/* Takeaway */}
                    <button
                      type="button"
                      onClick={() => setDiningOption('Takeaway')}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 text-center ${
                        diningOption === 'Takeaway'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-400/40 scale-[1.02]'
                          : 'border-amber-900/15 bg-white text-coffee-800 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          diningOption === 'Takeaway' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs">Takeaway</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">🟢 Green Pass</span>
                    </button>
                  </div>
                </div>

                {/* 2. Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-espresso-900 uppercase tracking-wider">
                      Selected Dishes ({items.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onAddMoreItems();
                      }}
                      className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add more food items</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="p-2.5 rounded-2xl bg-white border border-amber-900/10 shadow-xs flex items-center justify-between gap-3"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-parchment-100 relative shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1">
                            <span
                              className={`w-2.5 h-2.5 rounded-xs border flex items-center justify-center bg-white/95 ${
                                product.isVeg ? 'border-emerald-600' : 'border-red-600'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  product.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                }`}
                              />
                            </span>
                          </div>
                        </div>

                        {/* Title & Unit Price */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif font-bold text-xs text-espresso-950 truncate">
                            {product.name}
                          </h5>
                          <span className="text-[11px] text-coffee-600">
                            ₹{product.price} each
                          </span>
                        </div>

                        {/* Stepper [-] Qty [+] */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-900/15 rounded-xl px-2 py-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="w-5 h-5 rounded-lg flex items-center justify-center text-espresso-800 hover:bg-amber-200/60 active:scale-95 transition-colors"
                            title="Decrease quantity"
                          >
                            {quantity === 1 ? (
                              <Trash2 className="w-3 h-3 text-red-600" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                          </button>
                          <span className="font-serif font-black text-xs px-1 min-w-[18px] text-center text-espresso-950">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="w-5 h-5 rounded-lg flex items-center justify-center text-espresso-800 hover:bg-amber-200/60 active:scale-95 transition-colors"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right shrink-0 min-w-[50px]">
                          <span className="font-serif font-bold text-xs text-espresso-950 block">
                            ₹{product.price * quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Summary Banner */}
                  <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-900/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-coffee-800">
                      Total Bill Amount ({totalCount} items):
                    </span>
                    <span className="font-serif font-black text-base text-espresso-950">
                      ₹{totalPrice}
                    </span>
                  </div>

                  {/* Official Pass Card Live Image Preview */}
                  <div className="pt-1 text-center">
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
                      <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
                        <a
                          href={cardPreviewUrl}
                          download={`CoffeeLand-${diningOption}-Order-Pass.jpg`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coffee-700 hover:text-espresso-950 transition-colors py-1 px-3 rounded-full bg-white border border-amber-900/15 shadow-2xs"
                          title="Download this Pass Card Image"
                        >
                          <Download className="w-3.5 h-3.5 text-terracotta" />
                          <span>Download Pass Image</span>
                        </a>

                        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                          <button
                            type="button"
                            onClick={handleShareCard}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coffee-700 hover:text-espresso-950 transition-colors py-1 px-3 rounded-full bg-white border border-amber-900/15 shadow-2xs"
                            title="Share Pass Card with Caption"
                          >
                            <Share2 className="w-3.5 h-3.5 text-terracotta" />
                            <span>Share Card Image</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Customer Info Form */}
                <form id="cart-order-form" onSubmit={handleSubmit} className="space-y-3 pt-1">
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

                  {/* Dynamic field based on order type */}
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
                        placeholder="Flat No, Building, Street, Landmark..."
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
                        placeholder="e.g. Table 4 / Corner Booth"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs text-espresso-950 shadow-xs"
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-terracotta" />
                      <span>Cooking Instructions / Notes (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. Less spicy, extra sauce, packing instructions..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-900/15 focus:outline-none focus:ring-2 focus:ring-terracotta text-xs text-espresso-950 resize-none shadow-xs"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-3.5 px-4 rounded-xl ${theme.btnBg} text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]`}
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Connect & Send Order to Cafe Owner (+91 95425 25665)</span>
                    </button>

                    <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-600/20 text-center">
                      <p className="text-[11px] font-medium text-amber-950 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>
                          <strong>Attach Card in WhatsApp:</strong> Press <strong>Ctrl+V</strong> (Paste) on PC, or tap <strong>📎</strong> on phone (card is saved to your gallery)!
                        </span>
                      </p>
                    </div>

                    <p className="text-[11px] text-coffee-600 text-center mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Direct chat with owner (+91 95425 25665) • Pass card auto-saved to device</span>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
