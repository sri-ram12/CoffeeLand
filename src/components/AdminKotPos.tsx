import React, { useState, useEffect } from 'react';
import {
  Printer,
  Receipt,
  Plus,
  Minus,
  Trash2,
  Search,
  RotateCcw,
  UtensilsCrossed,
  Clock,
  Phone,
  User,
  Coffee,
  CheckCircle2,
  Copy,
  Check,
  X,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { Product } from '../types/product';
import { api } from '../services/api';
import { printThermalSlip, generatePlainTextTicket, ThermalPaperWidth } from '../services/thermalPrinter';

export interface KotItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
}

export interface KotOrder {
  id: string;
  kotNumber: number;
  orderType: 'Dine-In' | 'Takeaway' | 'Delivery' | 'WhatsApp';
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  items: KotItem[];
  chefNotes: string;
  timestamp: string;
  totalAmount: number;
  status: 'Preparing' | 'Served' | 'Completed';
}

interface AdminKotPosProps {
  products: Product[];
  externalPrintOrder?: KotOrder | null;
  onClearExternalPrint?: () => void;
}

const STORAGE_KEY_KOT_ORDERS = 'coffeeland_kot_orders_v1';
const STORAGE_KEY_KOT_COUNTER = 'coffeeland_kot_counter_v1';

export const AdminKotPos: React.FC<AdminKotPosProps> = ({ products, externalPrintOrder, onClearExternalPrint }) => {
  // Current active ticket state
  const [orderType, setOrderType] = useState<'Dine-In' | 'Takeaway' | 'Delivery' | 'WhatsApp'>('Dine-In');
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [chefNotes, setChefNotes] = useState<string>('');
  const [ticketItems, setTicketItems] = useState<KotItem[]>([]);

  // Menu Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Print slip payload & thermal printer options
  const [activePrint, setActivePrint] = useState<{ mode: 'kot' | 'bill'; order: KotOrder } | null>(null);
  const [paperWidth, setPaperWidth] = useState<ThermalPaperWidth>('80mm');
  const [autoClearAfterPrint, setAutoClearAfterPrint] = useState<boolean>(true);
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // KOT Token number counter
  const [kotCounter, setKotCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KOT_COUNTER);
      return saved ? parseInt(saved, 10) : 101;
    } catch {
      return 101;
    }
  });

  // Recent order history
  const [orderHistory, setOrderHistory] = useState<KotOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KOT_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KOT_ORDERS, JSON.stringify(orderHistory));
    } catch (e) {
      console.error('Failed to save KOT orders', e);
    }
  }, [orderHistory]);

  // Persist KOT token counter
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KOT_COUNTER, kotCounter.toString());
    } catch (e) {
      console.error('Failed to save KOT counter', e);
    }
  }, [kotCounter]);

  // Synchronize orders with backend server database on mount
  useEffect(() => {
    let isMounted = true;
    async function syncPosOrders() {
      try {
        const serverOrders = await api.getPosOrders();
        if (isMounted && Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrderHistory((prev) => {
            const mergedMap = new Map<string, KotOrder>();
            serverOrders.forEach((o) => mergedMap.set(o.id, o));
            prev.forEach((o) => {
              if (!mergedMap.has(o.id)) {
                mergedMap.set(o.id, o);
                api.addPosOrder(o).catch(() => {});
              }
            });
            return Array.from(mergedMap.values());
          });
        }
      } catch (err) {
        console.warn('Could not sync POS orders from server', err);
      }
    }
    syncPosOrders();
    return () => { isMounted = false; };
  }, []);

  // Handle external print requests (e.g. from WhatsApp inquiries tab)
  useEffect(() => {
    if (externalPrintOrder) {
      handleTriggerPrint('kot', externalPrintOrder);
      if (onClearExternalPrint) onClearExternalPrint();
    }
  }, [externalPrintOrder]);

  // Extract unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Add item to ticket
  const handleAddItem = (product: Product) => {
    setTicketItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          notes: ''
        }
      ];
    });
  };

  // Adjust item quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setTicketItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is KotItem => item !== null)
    );
  };

  // Update kitchen notes for specific item
  const handleUpdateItemNotes = (id: string, notes: string) => {
    setTicketItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  // Clear current ticket
  const handleClearTicket = () => {
    setTicketItems([]);
    setChefNotes('');
    setCustomerName('');
    setCustomerPhone('');
  };

  // Calculate ticket total
  const ticketTotal = ticketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Trigger print action for KOT or Bill
  const handleTriggerPrint = async (mode: 'kot' | 'bill', specificOrder?: KotOrder) => {
    let orderToPrint: KotOrder;

    if (specificOrder) {
      orderToPrint = specificOrder;
    } else {
      if (ticketItems.length === 0) {
        alert('Please add at least one item to print KOT!');
        return;
      }

      orderToPrint = {
        id: `kot-${Date.now()}`,
        kotNumber: kotCounter,
        orderType,
        tableNumber: orderType === 'Dine-In' ? tableNumber : orderType,
        customerName: customerName.trim() || 'Guest Customer',
        customerPhone: customerPhone.trim(),
        items: [...ticketItems],
        chefNotes: chefNotes.trim(),
        timestamp: new Date().toISOString(),
        totalAmount: ticketTotal,
        status: 'Preparing'
      };

      // Save to order history and increment token counter
      setOrderHistory((prev) => [orderToPrint, ...prev]);
      setKotCounter((prev) => prev + 1);

      // Persist to backend server database
      api.addPosOrder(orderToPrint).catch((err) => {
        console.warn('Could not post POS order to server:', err);
      });

      // Clear ticket inputs if auto-clear is enabled
      if (autoClearAfterPrint) {
        handleClearTicket();
      }
    }

    // Set active print modal for visual preview and options
    setActivePrint({ mode, order: orderToPrint });
    setCopiedSlip(false);
    setIsPrinting(true);

    try {
      // Trigger reliable isolated thermal print (NO blank pages!)
      await printThermalSlip(mode, orderToPrint, paperWidth);
    } catch (e) {
      console.warn('Direct print error:', e);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description & Printer Settings */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-espresso-950 mb-1">
            <Printer className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Counter POS & Thermal KOT Printing</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              {paperWidth} Thermal Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed max-w-2xl">
            Punch orders at the counter and print Kitchen Order Tickets (KOT) for chefs and itemized bills for customers. Compatible with all 80mm & 58mm USB, Bluetooth & Wi-Fi thermal printers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Thermal Paper Width Selector */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#EDE0CC]/60 border border-terracotta/20 text-xs">
            <span className="text-[10px] font-bold uppercase text-coffee-700 px-1.5">Roll:</span>
            <button
              type="button"
              onClick={() => setPaperWidth('80mm')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                paperWidth === '80mm'
                  ? 'bg-espresso-950 text-amber-300 shadow-xs'
                  : 'text-espresso-800 hover:bg-white/60'
              }`}
              title="Standard 80mm (3-inch) Thermal Receipt Roll"
            >
              80mm Wide
            </button>
            <button
              type="button"
              onClick={() => setPaperWidth('58mm')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                paperWidth === '58mm'
                  ? 'bg-espresso-950 text-amber-300 shadow-xs'
                  : 'text-espresso-800 hover:bg-white/60'
              }`}
              title="Compact 58mm (2-inch) Portable Bluetooth POS Roll"
            >
              58mm Mini
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-coffee-800">Token Counter:</span>
            <span className="px-3 py-1 rounded-xl bg-espresso-900 text-amber-300 font-mono font-bold text-sm">
              #KOT-{kotCounter}
            </span>
          </div>
        </div>
      </div>

      {/* POS Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Menu Search & Item Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="relative w-full flex-1">
                <Search className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item by name (e.g. Pizza, Cappuccino, Burger)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:border-terracotta focus:bg-white outline-none"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-coffee-600 hover:text-espresso-950 font-bold px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
              {categories.slice(0, 12).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-terracotta text-white shadow-xs'
                      : 'bg-[#EDE0CC]/50 text-coffee-800 hover:bg-[#EDE0CC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredProducts.map((product) => {
                const inTicket = ticketItems.find((i) => i.id === product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleAddItem(product)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left select-none relative group ${
                      inTicket
                        ? 'border-terracotta bg-amber-50/70 ring-1 ring-terracotta'
                        : 'border-amber-900/10 bg-white hover:border-terracotta/40 hover:bg-amber-50/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-terracotta uppercase truncate">
                          {product.category}
                        </span>
                        {inTicket && (
                          <span className="w-5 h-5 rounded-full bg-terracotta text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {inTicket.quantity}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-espresso-950 line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-amber-900/10">
                      <span className="font-display font-bold text-sm text-espresso-900">
                        ₹{product.price}
                      </span>
                      <button
                        type="button"
                        className="p-1 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white transition-colors"
                        title="Add to Ticket"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live KOT Ticket / Bill Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-md">
            {/* Header: Table & Order Type */}
            <div className="border-b border-dashed border-amber-900/20 pb-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-lg text-espresso-950 flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-terracotta" />
                  <span>Current Ticket</span>
                </span>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  #KOT-{kotCounter}
                </span>
              </div>

              {/* Order Type Selector */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {(['Dine-In', 'Takeaway', 'Delivery', 'WhatsApp'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                      orderType === type
                        ? 'bg-espresso-950 text-white shadow-xs'
                        : 'bg-[#EDE0CC]/60 text-coffee-800 hover:bg-[#EDE0CC]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Table Selector (If Dine-In) */}
              {orderType === 'Dine-In' && (
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs font-bold text-coffee-700 shrink-0">Table:</label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-950 focus:border-terracotta outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={`Table ${num}`}>
                        Table {num}
                      </option>
                    ))}
                    <option value="Outdoor Patio 1">Outdoor Patio 1</option>
                    <option value="Outdoor Patio 2">Outdoor Patio 2</option>
                    <option value="Family Lounge">Family Lounge</option>
                  </select>
                </div>
              )}

              {/* Customer Info (Optional) */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Customer Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#EDE0CC]/50 border border-amber-900/15 text-xs text-espresso-950 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone / WhatsApp"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#EDE0CC]/50 border border-amber-900/15 text-xs text-espresso-950 outline-none"
                />
              </div>
            </div>

            {/* Items List in Current Ticket */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
              {ticketItems.length === 0 ? (
                <div className="text-center py-8 text-coffee-500">
                  <Coffee className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No items added to ticket yet.</p>
                  <p className="text-[11px] text-coffee-400">Click any menu item on the left to add.</p>
                </div>
              ) : (
                ticketItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#EDE0CC]/40 border border-amber-900/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-espresso-950 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-coffee-600">
                          ₹{item.price} each • Total: ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-amber-900/20 text-espresso-900 flex items-center justify-center hover:bg-red-50 text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-amber-900/20 text-espresso-900 flex items-center justify-center hover:bg-emerald-50 text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, -item.quantity)}
                          className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 ml-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Kitchen Note for this item */}
                    <input
                      type="text"
                      placeholder="Special note: e.g. Less spicy, No sugar, Extra cheese..."
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateItemNotes(item.id, e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-amber-900/10 text-[11px] text-coffee-800 placeholder:text-coffee-400 outline-none"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Chef / Kitchen Overall Notes */}
            {ticketItems.length > 0 && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Ticket Instruction for Chef (e.g. Rush Order, Pack separately)..."
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-coffee-900 outline-none placeholder:text-coffee-400"
                />
              </div>
            )}

            {/* Ticket Summary & Total */}
            <div className="pt-3 border-t border-dashed border-amber-900/20 mb-4">
              <div className="flex items-center justify-between text-xs text-coffee-700 mb-1">
                <span>Items: {ticketItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                <span>Subtotal: ₹{ticketTotal}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-espresso-950">
                <span>Total Amount:</span>
                <span className="font-display text-xl text-terracotta">₹{ticketTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Print KOT Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerPrint('kot')}
                  disabled={ticketItems.length === 0}
                  className="px-4 py-2.5 rounded-2xl bg-espresso-950 hover:bg-black text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print KOT</span>
                </button>

                {/* Print Bill Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerPrint('bill')}
                  disabled={ticketItems.length === 0}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Print Bill</span>
                </button>
              </div>

              {ticketItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearTicket}
                  className="w-full py-1.5 rounded-xl text-xs font-semibold text-coffee-600 hover:text-red-600 flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Reprint Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-terracotta" />
            <h4 className="font-serif font-bold text-lg text-espresso-950">Recent KOT Orders & Reprints</h4>
            <span className="text-xs text-coffee-600 font-semibold">({orderHistory.length} orders saved)</span>
          </div>

          {orderHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all recent KOT order history?')) {
                  setOrderHistory([]);
                }
              }}
              className="text-xs text-coffee-500 hover:text-red-600 font-medium"
            >
              Clear History
            </button>
          )}
        </div>

        {orderHistory.length === 0 ? (
          <p className="text-xs text-coffee-500 py-4 text-center">No KOT orders punched yet today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EDE0CC]/60 text-coffee-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-xl">KOT #</th>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Table / Type</th>
                  <th className="p-2.5">Items</th>
                  <th className="p-2.5">Total</th>
                  <th className="p-2.5 rounded-r-xl text-right">Reprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {orderHistory.slice(0, 10).map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/40">
                    <td className="p-2.5 font-mono font-bold text-espresso-950">
                      #KOT-{ord.kotNumber}
                    </td>
                    <td className="p-2.5 text-coffee-700 whitespace-nowrap">
                      {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-espresso-900 font-bold text-[10px]">
                        {ord.tableNumber}
                      </span>
                    </td>
                    <td className="p-2.5 text-coffee-900 font-medium">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-2.5 font-bold text-terracotta">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap space-x-1">
                      <button
                        type="button"
                        onClick={() => handleTriggerPrint('kot', ord)}
                        className="px-2.5 py-1 rounded-lg bg-espresso-950 text-amber-300 font-bold text-[10px] hover:bg-black transition-colors"
                        title="Reprint Kitchen Slip"
                      >
                        KOT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerPrint('bill', ord)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 transition-colors"
                        title="Reprint Customer Bill"
                      >
                        Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* THERMAL SLIP ON-SCREEN PREVIEW & PRINT CONTROLLER MODAL           */}
      {/* ================================================================ */}
      {activePrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF6F0] rounded-3xl shadow-2xl border border-terracotta/30 max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-espresso-950 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                  {activePrint.mode === 'kot' ? <Printer className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-amber-300">
                    {activePrint.mode === 'kot' ? 'Kitchen Order Ticket (KOT)' : 'Customer Bill Receipt'}
                  </h4>
                  <p className="text-[11px] text-white/70">
                    Token #KOT-{activePrint.order.kotNumber} • {activePrint.order.tableNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Paper Width Quick Selector in Modal */}
                <div className="flex items-center p-0.5 rounded-lg bg-white/10 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPaperWidth('80mm')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      paperWidth === '80mm' ? 'bg-amber-400 text-espresso-950' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    80mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperWidth('58mm')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      paperWidth === '58mm' ? 'bg-amber-400 text-espresso-950' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    58mm
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePrint(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realistic Thermal Receipt Paper Preview Card */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-[#2B1B16]/5">
              <div
                className={`bg-white shadow-lg p-5 text-black border border-neutral-300 rounded-sm font-mono leading-relaxed transition-all ${
                  paperWidth === '58mm' ? 'w-[230px] text-[11px]' : 'w-[290px] text-xs'
                }`}
                style={{
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                {/* Cafe Header */}
                <div className="text-center font-black tracking-widest text-sm uppercase">COFFEE LAND</div>
                <div className="text-center text-[10px] text-neutral-600 font-sans">
                  {activePrint.mode === 'kot' ? '★ KITCHEN ORDER TICKET (KOT) ★' : 'Specialty Coffee & Cafe • Sangivalasa'}
                </div>

                <div className="border-b-2 border-black my-2" />

                {/* Big Token Indicator Box */}
                <div className="border-2 border-black p-1.5 text-center my-2 bg-neutral-50">
                  <div className="text-[10px] font-bold tracking-wider text-neutral-600">TOKEN NUMBER</div>
                  <div className="text-xl sm:text-2xl font-black">#KOT-{activePrint.order.kotNumber}</div>
                </div>

                {/* Metadata Details */}
                <div className="text-[10px] sm:text-[11px] space-y-0.5 font-bold">
                  <div><strong>TYPE:</strong> [ {activePrint.order.orderType.toUpperCase()} ]</div>
                  <div><strong>TABLE:</strong> {activePrint.order.tableNumber.toUpperCase()}</div>
                  <div><strong>TIME:</strong> {new Date(activePrint.order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                  {activePrint.order.customerName && activePrint.order.customerName !== 'Guest Customer' && (
                    <div><strong>GUEST:</strong> {activePrint.order.customerName}</div>
                  )}
                  {activePrint.order.customerPhone && (
                    <div><strong>PHONE:</strong> {activePrint.order.customerPhone}</div>
                  )}
                </div>

                <div className="border-b border-dashed border-black my-2" />

                {/* Item List Header */}
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-1">
                  <span>QTY & ITEM NAME</span>
                  <span>{activePrint.mode === 'kot' ? 'STATUS' : 'AMOUNT'}</span>
                </div>

                <div className="border-b-2 border-black my-1" />

                {/* Items */}
                <div className="space-y-1.5">
                  {activePrint.order.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-sm font-black mr-1 text-black">{item.quantity}x</span>
                        <span className="flex-1 text-left">{item.name}</span>
                        {activePrint.mode === 'bill' && (
                          <span className="text-right ml-2 font-bold whitespace-nowrap">₹{item.price * item.quantity}</span>
                        )}
                        {activePrint.mode === 'kot' && (
                          <span className="text-[9px] px-1 border border-black font-bold">COOK</span>
                        )}
                      </div>
                      {item.notes && (
                        <div className="text-[10px] italic pl-4 text-neutral-700">&#8627; {item.notes}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-black my-2" />

                {activePrint.mode === 'kot' ? (
                  <div className="flex justify-between font-bold text-[11px]">
                    <span>TOTAL ITEMS: {activePrint.order.items.length}</span>
                    <span>TOTAL QTY: {activePrint.order.items.reduce((s, it) => s + it.quantity, 0)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between font-black text-sm border-t-2 border-b-2 border-black py-1 my-2">
                    <span>NET PAYABLE:</span>
                    <span>₹{activePrint.order.totalAmount}</span>
                  </div>
                )}

                {activePrint.order.chefNotes && (
                  <div className="mt-2 p-1.5 bg-neutral-100 border border-black text-[10px] font-bold">
                    NOTE: {activePrint.order.chefNotes}
                  </div>
                )}

                <div className="border-b-2 border-black my-2" />
                <div className="text-center text-[9px] font-bold">
                  {activePrint.mode === 'kot'
                    ? '--- KITCHEN COPY • PUNCHED AT CAFE ---'
                    : 'THANK YOU FOR VISITING! PLEASE VISIT AGAIN.'}
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-4 bg-white border-t border-terracotta/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="text-xs text-coffee-700 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoClearAfterPrint}
                  onChange={(e) => setAutoClearAfterPrint(e.target.checked)}
                  className="rounded text-terracotta focus:ring-terracotta"
                />
                <span>Auto-clear ticket on punch</span>
              </label>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={async () => {
                    const text = generatePlainTextTicket(activePrint.mode, activePrint.order);
                    await navigator.clipboard.writeText(text);
                    setCopiedSlip(true);
                    setTimeout(() => setCopiedSlip(false), 2000);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-terracotta/30 text-xs font-bold text-espresso-950 hover:bg-amber-50 flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy formatted text to paste into WhatsApp or Bluetooth app"
                >
                  {copiedSlip ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-coffee-600" />}
                  <span>{copiedSlip ? 'Copied Slip!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => printThermalSlip(activePrint.mode, activePrint.order, paperWidth)}
                  disabled={isPrinting}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-espresso-950 hover:bg-black text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>{isPrinting ? 'Printing...' : 'Print Slip Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Thermal Slip Container for Native Browser Ctrl+P / Direct Print */}
      {activePrint && (
        <div id="thermal-print-slip" className="hidden print:block">
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.25', color: '#000', padding: '2mm', margin: '0' }}>
            <div style={{ fontWeight: '900', fontSize: '16px', textAlign: 'center' }}>
              COFFEE LAND
            </div>
            <div style={{ fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>
              {activePrint.mode === 'kot' ? '* KITCHEN ORDER TICKET (KOT) *' : '* CUSTOMER RECEIPT *'}
            </div>
            <div style={{ borderBottom: '2px solid #000', margin: '4px 0' }} />
            <div style={{ border: '2px solid #000', padding: '4px', textAlign: 'center', margin: '4px 0' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>TOKEN NUMBER</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>#KOT-{activePrint.order.kotNumber}</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
              <div>TYPE: [ {activePrint.order.orderType.toUpperCase()} ] | {activePrint.order.tableNumber.toUpperCase()}</div>
              <div>TIME: {new Date(activePrint.order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
              {activePrint.order.customerName && activePrint.order.customerName !== 'Guest Customer' && (
                <div>GUEST: {activePrint.order.customerName}</div>
              )}
            </div>
            <div style={{ borderBottom: '1px dashed #000', margin: '4px 0' }} />
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {activePrint.order.items.map((item, i) => (
                <div key={i} style={{ margin: '3px 0' }}>
                  <span style={{ fontSize: '14px', fontWeight: '900' }}>{item.quantity}x </span>
                  <span>{item.name}</span>
                  {activePrint.mode === 'bill' && (
                    <span style={{ float: 'right' }}>₹{item.price * item.quantity}</span>
                  )}
                  {item.notes && (
                    <div style={{ fontSize: '10px', fontStyle: 'italic', paddingLeft: '20px' }}>
                      * {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ borderBottom: '1px dashed #000', margin: '4px 0' }} />
            {activePrint.mode === 'kot' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px' }}>
                <span>ITEMS: {activePrint.order.items.length}</span>
                <span>QTY: {activePrint.order.items.reduce((s, it) => s + it.quantity, 0)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '14px', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '3px 0' }}>
                <span>TOTAL:</span>
                <span>₹{activePrint.order.totalAmount}</span>
              </div>
            )}
            {activePrint.order.chefNotes && (
              <div style={{ borderTop: '1px dotted #000', marginTop: '4px', paddingTop: '3px', fontSize: '11px', fontWeight: 'bold' }}>
                NOTE: {activePrint.order.chefNotes}
              </div>
            )}
            <div style={{ borderBottom: '2px solid #000', margin: '4px 0' }} />
          </div>
        </div>
      )}
    </div>
  );
};

