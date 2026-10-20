import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  MessageCircle,
  Calendar,
  Download,
  Utensils,
  Layers,
  ArrowUpRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { WhatsAppInquiry } from '../types/banner';
import { KotOrder } from '../types/product';
import { api } from '../services/api';
import { exportMasterBusinessReportToExcel } from '../services/excelExport';

interface AdminDailyConsumptionProps {
  inquiries: WhatsAppInquiry[];
  posOrders?: KotOrder[];
}

interface RawMaterialItem {
  id: string;
  name: string;
  category: 'Dairy' | 'Bakery' | 'Poultry & Meat' | 'Coffee & Beverages' | 'Pantry & Cheese' | 'Packaging';
  unit: string;
  consumedQty: number;
  estimatedCostPerUnit: number;
}

export const AdminDailyConsumption: React.FC<AdminDailyConsumptionProps> = ({ inquiries, posOrders: externalPosOrders }) => {
  // Selected date filter (default: today YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Clean out legacy mock test inquiries
  const cleanInquiriesList = useMemo(() => {
    return (inquiries || []).filter(
      (item) =>
        !['inq-101', 'inq-102', 'inq-103'].includes(item.id) &&
        !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(item.customerName)
    );
  }, [inquiries]);

  // Load KOT orders from local storage or server
  const [kotOrders, setKotOrders] = useState<KotOrder[]>(() => {
    if (externalPosOrders && externalPosOrders.length > 0) return externalPosOrders;
    try {
      const saved = localStorage.getItem('coffeeland_kot_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync KOT orders on mount
  useEffect(() => {
    let isMounted = true;
    async function loadPos() {
      try {
        const serverOrders = await api.getPosOrders();
        if (isMounted && Array.isArray(serverOrders) && serverOrders.length > 0) {
          setKotOrders((prev) => {
            const mergedMap = new Map<string, KotOrder>();
            serverOrders.forEach((o) => mergedMap.set(o.id, o));
            prev.forEach((o) => {
              if (!mergedMap.has(o.id)) mergedMap.set(o.id, o);
            });
            return Array.from(mergedMap.values());
          });
        }
      } catch (e) {
        console.warn('Could not sync POS orders', e);
      }
    }
    loadPos();
    return () => { isMounted = false; };
  }, []);

  // Filter KOT orders for the selected date
  const todaysKotOrders = useMemo(() => {
    return kotOrders.filter((ord) => {
      const orderDate = new Date(ord.timestamp).toISOString().split('T')[0];
      return orderDate === selectedDate;
    });
  }, [kotOrders, selectedDate]);

  // Filter WhatsApp inquiries for the selected date
  const todaysWhatsAppOrders = useMemo(() => {
    return cleanInquiriesList.filter((inq) => {
      const inqDate = new Date(inq.timestamp).toISOString().split('T')[0];
      return inqDate === selectedDate;
    });
  }, [cleanInquiriesList, selectedDate]);

  // Sales Calculations
  const kotSalesAmount = todaysKotOrders.reduce((acc, ord) => acc + ord.totalAmount, 0);
  const whatsappSalesAmount = todaysWhatsAppOrders.reduce((acc, inq) => acc + inq.price, 0);
  const totalCombinedSales = kotSalesAmount + whatsappSalesAmount;
  const totalOrdersCount = todaysKotOrders.length + todaysWhatsAppOrders.length;

  // Aggregate all items sold today (from KOT orders + WhatsApp inquiries)
  const itemsSoldToday = useMemo(() => {
    const itemMap: { [name: string]: { name: string; quantity: number; category: string } } = {};

    // From KOT tickets
    todaysKotOrders.forEach((ord) => {
      ord.items.forEach((item) => {
        const key = item.name.toLowerCase();
        if (!itemMap[key]) {
          itemMap[key] = { name: item.name, quantity: 0, category: item.category };
        }
        itemMap[key].quantity += item.quantity;
      });
    });

    // From WhatsApp orders
    todaysWhatsAppOrders.forEach((inq) => {
      const key = inq.itemName.toLowerCase();
      if (!itemMap[key]) {
        itemMap[key] = { name: inq.itemName, quantity: 0, category: inq.category || 'General' };
      }
      itemMap[key].quantity += 1;
    });

    return Object.values(itemMap);
  }, [todaysKotOrders, todaysWhatsAppOrders]);

  // Compute Raw Materials Consumed Today based on standard cafe kitchen recipes
  const rawMaterialsCalculated: RawMaterialItem[] = useMemo(() => {
    let coffeeCups = 0;
    let milkDrinks = 0;
    let pizzas = 0;
    let burgers = 0;
    let sandwichesWraps = 0;
    let chickenDishes = 0;
    let kunafaDesserts = 0;
    let mocktails = 0;
    let takeawayCount = 0;

    // Count item categories
    itemsSoldToday.forEach((item) => {
      const name = item.name.toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const qty = item.quantity;

      if (cat.includes('coffee') || name.includes('coffee') || name.includes('espresso') || name.includes('cappuccino') || name.includes('latte') || name.includes('americano')) {
        coffeeCups += qty;
        if (!name.includes('americano') && !name.includes('espresso')) {
          milkDrinks += qty;
        }
      } else if (cat.includes('pizza') || name.includes('pizza')) {
        pizzas += qty;
      } else if (cat.includes('burger') || name.includes('burger')) {
        burgers += qty;
      } else if (cat.includes('sandwich') || cat.includes('wrap') || name.includes('sandwich') || name.includes('wrap')) {
        sandwichesWraps += qty;
      } else if (cat.includes('chicken') || name.includes('chicken')) {
        chickenDishes += qty;
      } else if (cat.includes('kunafa') || name.includes('kunafa')) {
        kunafaDesserts += qty;
      } else if (cat.includes('mocktail') || cat.includes('juice') || name.includes('mojito') || name.includes('lagoon')) {
        mocktails += qty;
      }
    });

    // Count takeaways
    todaysKotOrders.forEach((ord) => {
      if (ord.orderType === 'Takeaway' || ord.orderType === 'Delivery' || ord.orderType === 'WhatsApp') {
        takeawayCount += ord.items.reduce((acc, i) => acc + i.quantity, 0);
      }
    });
    takeawayCount += todaysWhatsAppOrders.length;

    // Recipe consumption mapping
    const materials: RawMaterialItem[] = [
      {
        id: 'mat-beans',
        name: 'Single-Origin Arabica Coffee Beans',
        category: 'Coffee & Beverages',
        unit: 'kg',
        consumedQty: parseFloat(((coffeeCups * 18) / 1000).toFixed(2)), // 18g per cup
        estimatedCostPerUnit: 1100
      },
      {
        id: 'mat-milk',
        name: 'Fresh Full Cream Milk',
        category: 'Dairy',
        unit: 'Liters',
        consumedQty: parseFloat(((milkDrinks * 0.20)).toFixed(2)), // 200ml per milk coffee
        estimatedCostPerUnit: 64
      },
      {
        id: 'mat-dough',
        name: 'Fermented Pizza Dough Balls (220g)',
        category: 'Bakery',
        unit: 'Portions',
        consumedQty: pizzas,
        estimatedCostPerUnit: 25
      },
      {
        id: 'mat-mozzarella',
        name: 'Fresh Mozzarella Cheese Blend',
        category: 'Pantry & Cheese',
        unit: 'kg',
        consumedQty: parseFloat(((pizzas * 0.13)).toFixed(2)), // 130g per pizza
        estimatedCostPerUnit: 480
      },
      {
        id: 'mat-buns',
        name: 'Gourmet Golden Brioche Buns',
        category: 'Bakery',
        unit: 'Pieces',
        consumedQty: burgers,
        estimatedCostPerUnit: 22
      },
      {
        id: 'mat-chicken',
        name: 'Fresh Farm Chicken Fillet',
        category: 'Poultry & Meat',
        unit: 'kg',
        consumedQty: parseFloat(((chickenDishes * 0.22)).toFixed(2)), // 220g per dish
        estimatedCostPerUnit: 260
      },
      {
        id: 'mat-kataifi',
        name: 'Kataifi Shredded Vermicelli (Kunafa)',
        category: 'Pantry & Cheese',
        unit: 'kg',
        consumedQty: parseFloat(((kunafaDesserts * 0.12)).toFixed(2)), // 120g per serving
        estimatedCostPerUnit: 350
      },
      {
        id: 'mat-biscoff',
        name: 'Lotus Biscoff Cream & Spread',
        category: 'Pantry & Cheese',
        unit: 'kg',
        consumedQty: parseFloat(((kunafaDesserts * 0.05)).toFixed(2)), // 50g per serving
        estimatedCostPerUnit: 850
      },
      {
        id: 'mat-bread',
        name: 'Artisan Sourdough / Sandwich Bread',
        category: 'Bakery',
        unit: 'Slices',
        consumedQty: sandwichesWraps * 2,
        estimatedCostPerUnit: 6
      },
      {
        id: 'mat-boxes',
        name: 'Eco-Friendly Takeaway Food Boxes & Cups',
        category: 'Packaging',
        unit: 'Units',
        consumedQty: takeawayCount,
        estimatedCostPerUnit: 12
      }
    ];

    return materials;
  }, [itemsSoldToday, todaysKotOrders, todaysWhatsAppOrders]);

  // Export Daily Summary to Excel
  const handleExportExcel = () => {
    exportMasterBusinessReportToExcel(cleanInquiriesList, kotOrders, selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Date Selector & Export */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-espresso-950 mb-1">
            <TrendingUp className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Daily Sales & Raw Materials Analytics</h3>
          </div>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed max-w-2xl">
            Live overview of today's total revenue, counter sales, WhatsApp direct orders, and kitchen raw material consumption.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-900">
            <Calendar className="w-4 h-4 text-terracotta" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-xs text-espresso-950 outline-none cursor-pointer"
            />
          </div>

          {/* Export Daily Report to Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            title="Download today's sales and raw material log in Excel"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Today's Sales, WhatsApp Orders, Items Prepared) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Today's Sales */}
        <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">Total Today's Sales</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
              ₹
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-espresso-950">₹{totalCombinedSales}</span>
            <span className="text-[10px] text-terracotta font-semibold block mt-0.5">
              Across {totalOrdersCount} Total Orders Today
            </span>
          </div>
        </div>

        {/* WhatsApp Orders Today */}
        <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">Today WhatsApp Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-emerald-700">{todaysWhatsAppOrders.length}</span>
            <span className="text-[10px] text-coffee-700 font-semibold block mt-0.5">
              Revenue: ₹{whatsappSalesAmount} on WhatsApp
            </span>
          </div>
        </div>

        {/* Counter POS / KOT Sales */}
        <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">Counter KOT Sales</span>
            <div className="w-9 h-9 rounded-xl bg-espresso-100 flex items-center justify-center text-espresso-900">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-espresso-950">₹{kotSalesAmount}</span>
            <span className="text-[10px] text-coffee-700 font-semibold block mt-0.5">
              {todaysKotOrders.length} Tickets Punched at Cafe
            </span>
          </div>
        </div>

        {/* Total Dishes Prepared */}
        <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">Dishes Prepared</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-espresso-950">
              {itemsSoldToday.reduce((a, b) => a + b.quantity, 0)}
            </span>
            <span className="text-[10px] text-terracotta font-semibold block mt-0.5">
              {itemsSoldToday.length} Unique Menu Recipes Sold
            </span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Raw Materials Used Today + Today's WhatsApp Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Raw Materials Consumed Today */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta" />
                <h4 className="font-serif font-bold text-lg text-espresso-950">Raw Materials Consumed Today</h4>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                Recipe Estimates
              </span>
            </div>

            <p className="text-xs text-coffee-700 mb-4 leading-relaxed">
              Calculated based on standard portion recipes for dishes ordered today (both counter tickets & WhatsApp orders).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EDE0CC]/60 text-coffee-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2.5 rounded-l-xl">Raw Material</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Quantity Used</th>
                    <th className="p-2.5 rounded-r-xl text-right">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {rawMaterialsCalculated.map((mat) => {
                    const estCost = Math.round(mat.consumedQty * mat.estimatedCostPerUnit);
                    return (
                      <tr key={mat.id} className="hover:bg-amber-50/40">
                        <td className="p-2.5 font-bold text-espresso-950">
                          {mat.name}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#EDE0CC]/70 text-coffee-900 text-[10px] font-semibold">
                            {mat.category}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-espresso-900">
                          {mat.consumedQty > 0 ? (
                            <span className="text-terracotta font-extrabold">
                              {mat.consumedQty} {mat.unit}
                            </span>
                          ) : (
                            <span className="text-coffee-400">0 {mat.unit}</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-bold text-espresso-950">
                          ₹{estCost}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Today's WhatsApp Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h4 className="font-serif font-bold text-lg text-espresso-950">Today's WhatsApp Orders</h4>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {todaysWhatsAppOrders.length} Leads
              </span>
            </div>

            {todaysWhatsAppOrders.length === 0 ? (
              <div className="text-center py-10 text-coffee-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-600" />
                <p className="text-xs font-semibold">No WhatsApp orders recorded on {selectedDate}.</p>
                <p className="text-[11px] text-coffee-400 mt-1">
                  When customers tap "Order on WhatsApp", leads will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {todaysWhatsAppOrders.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-2xl bg-[#EDE0CC]/40 border border-amber-900/10 space-y-2 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-xs text-espresso-950 leading-snug">
                          {inq.itemName}
                        </h5>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] text-coffee-700 font-bold">
                            {inq.customerName || 'Customer'} • ₹{inq.price}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            inq.diningOption === 'Delivery'
                              ? 'bg-blue-100 text-blue-800'
                              : inq.diningOption === 'Takeaway'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {inq.diningOption === 'Delivery' ? '🔵 Delivery Pass' : inq.diningOption === 'Takeaway' ? '🟢 Takeaway Pass' : '🔴 Dine-In Pass'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        {inq.status}
                      </span>
                    </div>

                    {inq.message && (
                      <p className="text-[11px] bg-white p-2 rounded-xl text-coffee-800 italic line-clamp-2">
                        "{inq.message}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] text-coffee-500">
                      <span>{new Date(inq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <a
                        href={`https://wa.me/919542525665?text=${encodeURIComponent(`Hello Coffee Land, regarding order: ${inq.itemName}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>Open WhatsApp</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
