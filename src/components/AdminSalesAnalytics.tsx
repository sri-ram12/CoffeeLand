import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  MessageCircle,
  Printer,
  DollarSign,
  ArrowUpRight,
  ShoppingBag,
  Award,
  Clock,
  Sparkles,
  PieChart as PieChartIcon,
  Download,
  Utensils,
  CheckCircle2,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { WhatsAppInquiry } from '../types/banner';
import { KotOrder } from '../types/product';
import { exportMasterBusinessReportToExcel } from '../services/excelExport';

interface AdminSalesAnalyticsProps {
  inquiries: WhatsAppInquiry[];
  posOrders: KotOrder[];
}

type TimeframeOption = 'today' | 'week' | 'month' | 'quarter';
type ChannelFilter = 'all' | 'whatsapp' | 'pos';
type DiningFilter = 'all' | 'Dine-In' | 'Takeaway' | 'Delivery';

export const AdminSalesAnalytics: React.FC<AdminSalesAnalyticsProps> = ({
  inquiries,
  posOrders
}) => {
  // Navigation & View State
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'sales' | 'channels' | 'categories' | 'raw-materials'>('sales');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('week');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [diningFilter, setDiningFilter] = useState<DiningFilter>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(true);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Clean out legacy test mock entries
  const cleanInquiries = useMemo(() => {
    return (inquiries || []).filter(
      (item) =>
        !['inq-101', 'inq-102', 'inq-103'].includes(item.id) &&
        !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(item.customerName)
    );
  }, [inquiries]);

  const now = new Date();
  const todayDateStr = now.toISOString().split('T')[0];

  // Helper: check if order falls within active timeframe
  const isWithinTimeframe = (timestamp: string, tf: TimeframeOption): boolean => {
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return false;

      if (tf === 'today') {
        return d.toISOString().split('T')[0] === todayDateStr;
      }
      if (tf === 'week') {
        const diffMs = now.getTime() - d.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (tf === 'month') {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }
      if (tf === 'quarter') {
        const diffMs = now.getTime() - d.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 90;
      }
      return true;
    } catch {
      return false;
    }
  };

  // Filtered orders and inquiries
  const filteredInquiries = useMemo(() => {
    return cleanInquiries.filter((inq) => {
      const inTime = isWithinTimeframe(inq.timestamp, timeframe);
      const matchesChannel = channelFilter === 'all' || channelFilter === 'whatsapp';
      const matchesDining =
        diningFilter === 'all' ||
        (diningFilter === 'Dine-In' && inq.diningOption === 'Dine-In') ||
        (diningFilter === 'Takeaway' && inq.diningOption === 'Takeaway') ||
        (diningFilter === 'Delivery' && inq.diningOption === 'Delivery');
      const matchesSearch =
        !searchFilter ||
        inq.itemName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (inq.customerName && inq.customerName.toLowerCase().includes(searchFilter.toLowerCase()));

      return inTime && matchesChannel && matchesDining && matchesSearch;
    });
  }, [cleanInquiries, timeframe, channelFilter, diningFilter, searchFilter]);

  const filteredPosOrders = useMemo(() => {
    return (posOrders || []).filter((ord) => {
      const inTime = isWithinTimeframe(ord.timestamp, timeframe);
      const matchesChannel = channelFilter === 'all' || channelFilter === 'pos';
      const matchesDining =
        diningFilter === 'all' ||
        (diningFilter === 'Dine-In' && ord.orderType === 'Dine-In') ||
        (diningFilter === 'Takeaway' && ord.orderType === 'Takeaway') ||
        (diningFilter === 'Delivery' && ord.orderType === 'Delivery');
      const matchesSearch =
        !searchFilter ||
        ord.items.some((i) => i.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (ord.customerName && ord.customerName.toLowerCase().includes(searchFilter.toLowerCase())) ||
        ord.tableNumber.toLowerCase().includes(searchFilter.toLowerCase());

      return inTime && matchesChannel && matchesDining && matchesSearch;
    });
  }, [posOrders, timeframe, channelFilter, diningFilter, searchFilter]);

  // Financial aggregates
  const whatsappSales = useMemo(() => {
    return filteredInquiries.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [filteredInquiries]);

  const posSales = useMemo(() => {
    return filteredPosOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
  }, [filteredPosOrders]);

  const totalGrossSales = whatsappSales + posSales;
  const totalOrdersCount = filteredInquiries.length + filteredPosOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalGrossSales / totalOrdersCount) : 0;

  // =========================================================================
  // 1. VERTICAL BAR CHART DATA ("Trend by Period")
  // =========================================================================
  const verticalTrendData = useMemo(() => {
    if (timeframe === 'today') {
      const slots = [
        { label: '8 AM - 11 AM', short: 'Morning', start: 8, end: 11 },
        { label: '11 AM - 2 PM', short: 'Lunch', start: 11, end: 14 },
        { label: '2 PM - 5 PM', short: 'Tea / Snack', start: 14, end: 17 },
        { label: '5 PM - 8 PM', short: 'Evening', start: 17, end: 20 },
        { label: '8 PM - 11 PM', short: 'Dinner', start: 20, end: 23 }
      ];

      return slots.map((s) => {
        let wa = 0, pos = 0, count = 0;
        filteredInquiries.forEach((inq) => {
          const h = new Date(inq.timestamp).getHours();
          if (h >= s.start && h < s.end) { wa += inq.price || 0; count++; }
        });
        filteredPosOrders.forEach((ord) => {
          const h = new Date(ord.timestamp).getHours();
          if (h >= s.start && h < s.end) { pos += ord.totalAmount || 0; count++; }
        });
        return { label: s.short, fullLabel: s.label, wa, pos, total: wa + pos, count };
      });
    }

    if (timeframe === 'week') {
      const days = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = `${dayNames[d.getDay()]}`;

        let wa = 0, pos = 0, count = 0;
        filteredInquiries.forEach((inq) => {
          if (new Date(inq.timestamp).toISOString().split('T')[0] === dateStr) {
            wa += inq.price || 0; count++;
          }
        });
        filteredPosOrders.forEach((ord) => {
          if (new Date(ord.timestamp).toISOString().split('T')[0] === dateStr) {
            pos += ord.totalAmount || 0; count++;
          }
        });
        days.push({
          label: dayLabel,
          fullLabel: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
          wa,
          pos,
          total: wa + pos,
          count
        });
      }
      return days;
    }

    // Month & Quarter: 4 Weeks
    const weeks = [
      { label: 'Week 1', fullLabel: 'Week 1 (Days 1 - 7)', s: 1, e: 7 },
      { label: 'Week 2', fullLabel: 'Week 2 (Days 8 - 14)', s: 8, e: 14 },
      { label: 'Week 3', fullLabel: 'Week 3 (Days 15 - 21)', s: 15, e: 21 },
      { label: 'Week 4+', fullLabel: 'Week 4+ (Days 22+)', s: 22, e: 31 }
    ];

    return weeks.map((w) => {
      let wa = 0, pos = 0, count = 0;
      filteredInquiries.forEach((inq) => {
        const day = new Date(inq.timestamp).getDate();
        if (day >= w.s && day <= w.e) { wa += inq.price || 0; count++; }
      });
      filteredPosOrders.forEach((ord) => {
        const day = new Date(ord.timestamp).getDate();
        if (day >= w.s && day <= w.e) { pos += ord.totalAmount || 0; count++; }
      });
      return { label: w.label, fullLabel: w.fullLabel, wa, pos, total: wa + pos, count };
    });
  }, [timeframe, filteredInquiries, filteredPosOrders, now, todayDateStr]);

  const maxVerticalBar = useMemo(() => {
    const highest = Math.max(...verticalTrendData.map((d) => d.total), 500);
    return Math.ceil(highest * 1.15);
  }, [verticalTrendData]);

  // =========================================================================
  // 2. PIE / DONUT CHART DATA ("Volume by Channel / Platform")
  // =========================================================================
  const pieChartSlices = useMemo(() => {
    // Slices by Ordering Channel & Dining Pass
    let whatsappDelivery = 0;
    let whatsappTakeaway = 0;
    let posDineIn = 0;
    let posTakeaway = 0;

    filteredInquiries.forEach((inq) => {
      if (inq.diningOption === 'Takeaway') whatsappTakeaway += inq.price || 0;
      else whatsappDelivery += inq.price || 0;
    });

    filteredPosOrders.forEach((ord) => {
      if (ord.orderType === 'Dine-In') posDineIn += ord.totalAmount || 0;
      else posTakeaway += ord.totalAmount || 0;
    });

    const total = whatsappDelivery + whatsappTakeaway + posDineIn + posTakeaway;

    const rawSlices = [
      {
        id: 'pos-dinein',
        label: 'Dine-In Counter',
        value: posDineIn,
        formatted: `₹${(posDineIn / 1000).toFixed(1)}K`,
        color: '#0284C7', // Oceanic Blue (matching reference LinkedIn blue)
        count: filteredPosOrders.filter((o) => o.orderType === 'Dine-In').length
      },
      {
        id: 'whatsapp-direct',
        label: 'WhatsApp Orders',
        value: whatsappDelivery + whatsappTakeaway,
        formatted: `₹${((whatsappDelivery + whatsappTakeaway) / 1000).toFixed(1)}K`,
        color: '#10B981', // Vibrant Emerald
        count: filteredInquiries.length
      },
      {
        id: 'pos-takeaway',
        label: 'Takeaway / Parcel',
        value: posTakeaway,
        formatted: `₹${(posTakeaway / 1000).toFixed(1)}K`,
        color: '#EF4444', // Red (matching reference YouTube red)
        count: filteredPosOrders.filter((o) => o.orderType !== 'Dine-In').length
      },
      {
        id: 'dinein-whatsapp',
        label: 'Delivery Pass',
        value: whatsappDelivery,
        formatted: `₹${(whatsappDelivery / 1000).toFixed(1)}K`,
        color: '#1F2937', // Dark Slate (matching reference X black)
        count: filteredInquiries.filter((i) => i.diningOption === 'Delivery').length
      }
    ].filter((s) => s.value > 0);

    // If completely empty, render a placeholder slice so the pie chart still looks complete
    if (rawSlices.length === 0) {
      return [
        { id: 'sample-1', label: 'Counter POS', value: 450, formatted: '₹450', color: '#0284C7', count: 1 },
        { id: 'sample-2', label: 'WhatsApp Order', value: 350, formatted: '₹350', color: '#10B981', count: 1 },
        { id: 'sample-3', label: 'Takeaway Pass', value: 200, formatted: '₹200', color: '#EF4444', count: 1 }
      ];
    }

    return rawSlices;
  }, [filteredInquiries, filteredPosOrders]);

  // Compute SVG SVG Pie / Donut Path Segments
  const pieSvgSegments = useMemo(() => {
    const totalVal = pieChartSlices.reduce((s, it) => s + it.value, 0);
    let cumulativeAngle = 0;
    const cx = 110;
    const cy = 110;
    const r = 85;
    const innerR = 40; // donut center hole

    return pieChartSlices.map((slice, i) => {
      const sliceFraction = slice.value / totalVal;
      const sliceAngle = sliceFraction * 2 * Math.PI;

      const startAngle = cumulativeAngle - Math.PI / 2;
      const endAngle = cumulativeAngle + sliceAngle - Math.PI / 2;
      const midAngle = startAngle + sliceAngle / 2;

      cumulativeAngle += sliceAngle;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(endAngle);
      const iy2 = cy + innerR * Math.sin(endAngle);

      const largeArc = sliceFraction > 0.5 ? 1 : 0;

      // Donut segment path
      const pathD = `
        M ${ix1} ${iy1}
        L ${x1} ${y1}
        A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}
        Z
      `;

      // Label coordinate in middle of slice
      const textR = r * 0.72;
      const textX = cx + textR * Math.cos(midAngle);
      const textY = cy + textR * Math.sin(midAngle);

      return {
        ...slice,
        pathD,
        textX,
        textY,
        sliceFraction,
        percentage: Math.round(sliceFraction * 100)
      };
    });
  }, [pieChartSlices]);

  // =========================================================================
  // 3. HORIZONTAL BAR CHART DATA ("Volume by Food Category")
  // =========================================================================
  const horizontalCategoryData = useMemo(() => {
    const catMap: { [cat: string]: { category: string; count: number; revenue: number; color: string } } = {
      'Coffee & Shakes': { category: 'Coffee & Shakes', count: 0, revenue: 0, color: '#3B82F6' },
      'Specialty Pizzas': { category: 'Specialty Pizzas', count: 0, revenue: 0, color: '#EC4899' },
      'Artisan Burgers': { category: 'Artisan Burgers', count: 0, revenue: 0, color: '#1F2937' },
      'Kunafa & Desserts': { category: 'Kunafa & Desserts', count: 0, revenue: 0, color: '#EF4444' },
      'Appetizers & Fries': { category: 'Appetizers & Fries', count: 0, revenue: 0, color: '#F59E0B' }
    };

    filteredPosOrders.forEach((ord) => {
      ord.items.forEach((item) => {
        const c = (item.category || '').toLowerCase();
        const n = (item.name || '').toLowerCase();
        let target = 'Coffee & Shakes';
        if (c.includes('pizza') || n.includes('pizza')) target = 'Specialty Pizzas';
        else if (c.includes('burger') || n.includes('burger')) target = 'Artisan Burgers';
        else if (c.includes('dessert') || n.includes('kunafa')) target = 'Kunafa & Desserts';
        else if (c.includes('fries') || c.includes('starter') || n.includes('chicken')) target = 'Appetizers & Fries';

        catMap[target].count += item.quantity;
        catMap[target].revenue += item.price * item.quantity;
      });
    });

    filteredInquiries.forEach((inq) => {
      const c = (inq.category || '').toLowerCase();
      const n = (inq.itemName || '').toLowerCase();
      let target = 'Coffee & Shakes';
      if (c.includes('pizza') || n.includes('pizza')) target = 'Specialty Pizzas';
      else if (c.includes('burger') || n.includes('burger')) target = 'Artisan Burgers';
      else if (c.includes('dessert') || n.includes('kunafa')) target = 'Kunafa & Desserts';
      else if (c.includes('fries') || c.includes('starter') || n.includes('chicken')) target = 'Appetizers & Fries';

      catMap[target].count += 1;
      catMap[target].revenue += inq.price || 0;
    });

    return Object.values(catMap);
  }, [filteredPosOrders, filteredInquiries]);

  const maxHorizontalCount = useMemo(() => {
    return Math.max(...horizontalCategoryData.map((d) => d.count), 14);
  }, [horizontalCategoryData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & SaaS Dashboard Header (Matching Reference Design) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-espresso-950 mb-1">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 font-bold">
              CL
            </span>
            <div className="flex items-center gap-1.5 text-xs text-coffee-600 font-bold">
              <span>Organisation:</span>
              <span className="text-espresso-950 font-extrabold flex items-center gap-1">
                Coffee Land Resto &amp; Cafe
                <ChevronDown className="w-3.5 h-3.5 text-coffee-500" />
              </span>
            </div>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-950">
            Monitoring &amp; Multi-Graph Analytics Console
          </h3>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed max-w-2xl">
            Live business dashboard with vertical trend graphs, pie charts, and category volume breakdowns.
          </p>
        </div>

        {/* Action Controls: Export & Report Generator */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportMasterBusinessReportToExcel(cleanInquiries, posOrders, todayDateStr)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 text-espresso-900 border border-neutral-300 font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Export full analytics report to Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Report</span>
          </button>

          <div className="px-3.5 py-2.5 rounded-2xl bg-espresso-950 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Live POS Sync</span>
          </div>
        </div>
      </div>

      {/* Main SaaS Dashboard Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter & Refine Sidebar (3 cols, matching reference) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="font-bold text-sm text-espresso-950 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-terracotta" />
                <span>Filters &amp; Refine</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchFilter('');
                  setChannelFilter('all');
                  setDiningFilter('all');
                  setTimeframe('week');
                }}
                className="text-[11px] font-bold text-coffee-600 hover:text-espresso-950 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-coffee-700 mb-1.5">
                Refine Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item, guest, table..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#EDE0CC]/50 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                />
              </div>
            </div>

            {/* Channel Filter Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-coffee-700 mb-1.5">
                Sales Channel
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Channels (WhatsApp & Counter)' },
                  { id: 'whatsapp', label: 'WhatsApp Online Orders Only' },
                  { id: 'pos', label: 'Counter POS / KOT Billing Only' }
                ].map((ch) => (
                  <label
                    key={ch.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer select-none font-medium text-espresso-900"
                  >
                    <input
                      type="radio"
                      name="channelFilter"
                      checked={channelFilter === ch.id}
                      onChange={() => setChannelFilter(ch.id as ChannelFilter)}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    <span>{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dining Mode Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-coffee-700 mb-1.5">
                Dining Pass / Mode
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Dining Passes' },
                  { id: 'Dine-In', label: '🔴 Dine-In Table Pass' },
                  { id: 'Takeaway', label: '🟢 Takeaway / Parcel Pass' },
                  { id: 'Delivery', label: '🔵 WhatsApp Home Delivery' }
                ].map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer select-none font-medium text-espresso-900"
                  >
                    <input
                      type="radio"
                      name="diningFilter"
                      checked={diningFilter === d.id}
                      onChange={() => setDiningFilter(d.id as DiningFilter)}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick KPI Stat Counter Box */}
            <div className="p-3.5 rounded-2xl bg-[#EDE0CC]/40 border border-amber-900/10 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 block">
                Filtered Volume
              </span>
              <div className="font-serif text-2xl font-extrabold text-espresso-950 mt-0.5">
                {totalOrdersCount} Orders
              </div>
              <div className="text-[11px] font-bold text-emerald-800 mt-0.5">
                Total ₹{totalGrossSales.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Workspace (9 cols): Controls Bar + 3-Chart Grid */}
        <div className="lg:col-span-9 space-y-5">
          {/* Dashboard Control Bar (Dropdowns & Tabs matching reference) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* View Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-bold text-espresso-950 flex items-center gap-1.5 cursor-pointer">
                <span>My Cafe Dashboard</span>
                <ChevronDown className="w-3.5 h-3.5 text-coffee-500" />
              </div>

              {/* Timeframe Dropdown */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-bold text-espresso-950">
                <Clock className="w-3.5 h-3.5 text-terracotta" />
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as TimeframeOption)}
                  className="bg-transparent outline-none cursor-pointer font-bold"
                >
                  <option value="today">Today (Hourly)</option>
                  <option value="week">Last 7 Days (Weekly)</option>
                  <option value="month">This Month (30 Days)</option>
                  <option value="quarter">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Top Analysis Sub-Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('sales')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeAnalysisTab === 'sales'
                    ? 'bg-espresso-950 text-amber-300 shadow-xs'
                    : 'text-coffee-800 hover:text-espresso-950'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('channels')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeAnalysisTab === 'channels'
                    ? 'bg-espresso-950 text-amber-300 shadow-xs'
                    : 'text-coffee-800 hover:text-espresso-950'
                }`}
              >
                Channels
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('categories')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeAnalysisTab === 'categories'
                    ? 'bg-espresso-950 text-amber-300 shadow-xs'
                    : 'text-coffee-800 hover:text-espresso-950'
                }`}
              >
                Categories
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* THE 3 SIDE-BY-SIDE ANALYTICS WIDGETS (EXACTLY LIKE REFERENCE!)    */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {/* ------------------------------------------------------------- */}
            {/* WIDGET 1: VERTICAL BAR GRAPH (Trend by Media/Period)          */}
            {/* ------------------------------------------------------------- */}
            <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-espresso-950">Trend by Period</h4>
                  <span className="text-[10px] font-bold text-coffee-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {timeframe.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-coffee-600 mb-4">
                  Sales revenue progression across {timeframe === 'today' ? 'hours' : 'days'}.
                </p>
              </div>

              {/* Vertical Bars Canvas with Y-Axis */}
              <div className="relative pt-4 pb-2 my-2">
                {/* Horizontal reference gridlines */}
                <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-25">
                  <div className="border-b border-dashed border-neutral-600 text-[9px] text-right pr-1">₹{maxVerticalBar}</div>
                  <div className="border-b border-dashed border-neutral-600 text-[9px] text-right pr-1">₹{Math.round(maxVerticalBar * 0.5)}</div>
                  <div className="border-b border-neutral-400 text-[9px] text-right pr-1">₹0</div>
                </div>

                {/* Bars */}
                <div className="grid grid-flow-col auto-cols-fr gap-2 h-44 items-end relative z-10 px-2">
                  {verticalTrendData.map((d, i) => {
                    const barHeightPct = Math.min(
                      Math.max(Math.round((d.total / maxVerticalBar) * 100), d.total > 0 ? 10 : 3),
                      96
                    );
                    const isHovered = hoveredBarIndex === i;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      >
                        {isHovered && (
                          <div className="absolute -top-16 z-30 p-2 rounded-xl bg-espresso-950 text-white text-[10px] pointer-events-none min-w-[110px] shadow-lg border border-amber-400/40 text-center">
                            <div className="font-bold text-amber-300">{d.fullLabel}</div>
                            <div>Total: ₹{d.total}</div>
                            <div className="text-emerald-400">WA: ₹{d.wa}</div>
                          </div>
                        )}

                        <span className="text-[9px] font-bold text-espresso-950 mb-1">
                          {d.total > 0 ? `₹${d.total}` : ''}
                        </span>

                        <div
                          className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 ${
                            i === 0
                              ? 'bg-blue-500'
                              : i === 1
                              ? 'bg-amber-400'
                              : i === 2
                              ? 'bg-purple-500'
                              : i === 3
                              ? 'bg-teal-400'
                              : i === 4
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />

                        <span className="text-[10px] font-bold text-coffee-800 mt-2 truncate max-w-[45px]">
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-neutral-100 text-[10px] font-bold text-coffee-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Morning
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Lunch
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Evening
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400" /> Dinner
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* WIDGET 2: VIBRANT PIE / DONUT CHART (Volume by Platform)      */}
            {/* ------------------------------------------------------------- */}
            <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-espresso-950">Volume by Channel &amp; Mode</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Pie Share
                  </span>
                </div>
                <p className="text-[11px] text-coffee-600 mb-2">
                  Segmented breakdown of order revenues by channel.
                </p>
              </div>

              {/* SVG Donut / Pie Visualization */}
              <div className="relative flex items-center justify-center py-2">
                <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
                  {pieSvgSegments.map((seg, i) => {
                    const isHovered = hoveredSliceIndex === i;
                    return (
                      <g
                        key={seg.id}
                        onMouseEnter={() => setHoveredSliceIndex(i)}
                        onMouseLeave={() => setHoveredSliceIndex(null)}
                        className="cursor-pointer transition-transform duration-200"
                        style={{
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '110px 110px'
                        }}
                      >
                        <path
                          d={seg.pathD}
                          fill={seg.color}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all"
                        />
                        {/* Slice value label directly on slice (matching reference 34K, 3M, 1K) */}
                        {seg.percentage >= 8 && (
                          <text
                            x={seg.textX}
                            y={seg.textY}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="800"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="pointer-events-none drop-shadow-xs"
                          >
                            {seg.formatted}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Donut Center Display */}
                  <circle cx="110" cy="110" r="38" fill="#ffffff" />
                  <text
                    x="110"
                    y="105"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#5C3825"
                  >
                    TOTAL
                  </text>
                  <text
                    x="110"
                    y="120"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="900"
                    fill="#2B1B16"
                  >
                    ₹{totalGrossSales >= 1000 ? `${(totalGrossSales / 1000).toFixed(1)}K` : totalGrossSales}
                  </text>
                </svg>
              </div>

              {/* Pie Legend (Matching Reference LinkedIn, YouTube, X, TikTok) */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-neutral-100 text-[10px] font-bold text-coffee-800">
                {pieChartSlices.map((slice) => (
                  <span key={slice.id} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span>{slice.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* WIDGET 3: HORIZONTAL BAR CHART (Engagement / Category Volume) */}
            {/* ------------------------------------------------------------- */}
            <div className="p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between md:col-span-2 xl:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-espresso-950">Volume by Food Category</h4>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    Dishes Sold
                  </span>
                </div>
                <p className="text-[11px] text-coffee-600 mb-4">
                  Order counts across your kitchen's core culinary categories.
                </p>
              </div>

              {/* Horizontal Bar Chart Rows */}
              <div className="space-y-4 my-2">
                {horizontalCategoryData.map((cat, i) => {
                  const widthPct = Math.min(
                    Math.max(Math.round((cat.count / maxHorizontalCount) * 100), cat.count > 0 ? 10 : 3),
                    100
                  );

                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-espresso-950 truncate max-w-[140px]">{cat.category}</span>
                        <span className="text-coffee-700 font-mono text-[11px]">
                          {cat.count} items (₹{cat.revenue})
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* X-Axis Scale Labels (0 2 4 6 8 10 12 14 Volume matching reference) */}
                <div className="flex justify-between items-center pt-2 text-[9px] font-mono text-coffee-500 border-t border-neutral-200">
                  <span>0</span>
                  <span>{Math.round(maxHorizontalCount * 0.25)}</span>
                  <span>{Math.round(maxHorizontalCount * 0.5)}</span>
                  <span>{Math.round(maxHorizontalCount * 0.75)}</span>
                  <span>{maxHorizontalCount} Items</span>
                </div>
                <div className="text-center text-[10px] font-bold uppercase tracking-wider text-coffee-500">
                  Dishes Sold Volume
                </div>
              </div>

              {/* Bottom Category Status */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-[10px] font-semibold text-coffee-700">
                <span>Top Category: <strong>{horizontalCategoryData[0]?.category}</strong></span>
                <span className="text-emerald-700 font-bold">Kitchen Active</span>
              </div>
            </div>
          </div>

          {/* Detailed Recent Transactions Audit Feed */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-terracotta" />
                <h4 className="font-bold text-sm sm:text-base text-espresso-950">
                  Recent Orders &amp; Audit Trail
                </h4>
              </div>
              <span className="text-xs font-bold text-coffee-700">
                {filteredInquiries.length + filteredPosOrders.length} Entries in {timeframe}
              </span>
            </div>

            {totalOrdersCount === 0 ? (
              <div className="text-center py-8 text-coffee-500">
                <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30 text-terracotta" />
                <p className="text-xs font-semibold">No order transactions match your active filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                        💬 WhatsApp
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-espresso-950 block truncate">
                          {inq.itemName}
                        </span>
                        <span className="text-[10px] text-coffee-600">
                          {inq.customerName || 'Customer'} • {inq.diningOption || 'Dine-In'} • {new Date(inq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700 shrink-0 font-display text-sm">
                      ₹{inq.price}
                    </span>
                  </div>
                ))}

                {filteredPosOrders.map((ord) => (
                  <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-espresso-100 text-espresso-950 font-bold text-[10px] shrink-0">
                        🖨️ POS #KOT-{ord.kotNumber}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-espresso-950 block truncate">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </span>
                        <span className="text-[10px] text-coffee-600">
                          {ord.tableNumber} • {ord.orderType} • {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-espresso-950 shrink-0 font-display text-sm">
                      ₹{ord.totalAmount}
                    </span>
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
