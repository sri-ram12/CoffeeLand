import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Coffee,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  Upload,
  Check,
  AlertCircle,
  FileSpreadsheet,
  MessageCircle,
  Tag,
  Gift,
  Utensils,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Flame,
  Palette,
  ArrowLeft,
  LogOut,
  Star,
  Clock,
  Eye,
  Radio,
  Activity,
  Zap,
  Server,
  Copy,
  CheckCheck,
  PackageX,
  AlertTriangle,
  Printer,
  Receipt,
  TrendingUp,
  BarChart3,
  User,
  Phone,
  UtensilsCrossed,
  Truck,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { OfferBanner, BannerColorTheme, WhatsAppInquiry } from '../types/banner';
import { Product } from '../types/product';
import { Review } from '../types/review';
import { api, ServerHealthResponse } from '../services/api';
import {
  exportInquiriesToExcel,
  exportPosOrdersToExcel,
  exportMasterBusinessReportToExcel,
  exportBannersToExcel,
  exportMenuToExcel
} from '../services/excelExport';
import { AdminKotPos, KotOrder } from '../components/AdminKotPos';
import { AdminDailyConsumption } from '../components/AdminDailyConsumption';
import { AdminSalesAnalytics } from '../components/AdminSalesAnalytics';
import { AdminRawMaterials } from '../components/AdminRawMaterials';

const COLOR_THEMES: { id: BannerColorTheme; label: string; previewClass: string }[] = [
  { id: 'terracotta', label: 'Terracotta Rust', previewClass: 'bg-[#802B12]' },
  { id: 'amber', label: 'Golden Amber', previewClass: 'bg-[#B8823F]' },
  { id: 'emerald', label: 'Forest Emerald', previewClass: 'bg-[#0E5A3A]' },
  { id: 'espresso', label: 'Dark Espresso', previewClass: 'bg-[#2B1B16]' },
  { id: 'crimson', label: 'Crimson Berry', previewClass: 'bg-[#8C1D40]' },
  { id: 'violet', label: 'Royal Violet', previewClass: 'bg-[#502368]' },
  { id: 'ocean', label: 'Ocean Blue', previewClass: 'bg-[#0E4D64]' },
];

export const AdminPage: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('coffeeland_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'banners' | 'menu' | 'inquiries' | 'kot' | 'analytics' | 'raw-materials' | 'excel' | 'reviews' | 'keepalive'>('banners');
  const [externalPrintKot, setExternalPrintKot] = useState<KotOrder | null>(null);

  // Backend Health & Keep-Alive State
  const [serverStatus, setServerStatus] = useState<'connected' | 'checking' | 'local'>('checking');
  const [healthData, setHealthData] = useState<ServerHealthResponse | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; latencyMs?: number; message?: string; timestamp?: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Data states
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<WhatsAppInquiry[]>([]);
  const [posOrders, setPosOrders] = useState<KotOrder[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [inquiryDiningFilter, setInquiryDiningFilter] = useState<'all' | 'Dine-In' | 'Delivery' | 'Takeaway'>('all');

  // Banner Creation / Editing
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<OfferBanner, 'id'>>({
    title: '',
    subtitle: '',
    itemName: '',
    originalPrice: 199,
    offerPrice: 149,
    discountLabel: '20% OFF',
    promoCode: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    themeColor: 'terracotta',
    isActive: true,
    expiryNote: 'Limited Time Offer',
    category: 'Specialty Combos'
  });

  // Food Menu Management
  const [searchMenu, setSearchMenu] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedName, setEditedName] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [editedInStock, setEditedInStock] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test Ping trigger
  const handleTestPing = async () => {
    setIsTestingPing(true);
    const start = performance.now();
    const res = await api.pingKeepAlive();
    const latency = Math.round(performance.now() - start);
    if (res && res.status === 'online') {
      setHealthData(res);
      setServerStatus('connected');
      setPingResult({
        success: true,
        latencyMs: latency,
        message: `HTTP 200 OK • Latency: ${latency}ms • Uptime: ${res.uptimeFormatted || (res.uptimeSeconds ? res.uptimeSeconds + 's' : 'Active')}`,
        timestamp: new Date().toLocaleTimeString('en-IN')
      });
    } else {
      setPingResult({
        success: false,
        latencyMs: latency,
        message: `Ping timed out or received unexpected status (${latency}ms)`,
        timestamp: new Date().toLocaleTimeString('en-IN')
      });
    }
    setIsTestingPing(false);
  };

  const handleCopyHealthUrl = () => {
    navigator.clipboard.writeText('https://coffeeland-4yy7.onrender.com/api/health');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Initial load
  useEffect(() => {
    async function loadData() {
      // Check server health
      const health = await api.checkHealth();
      if (health) setHealthData(health);
      setServerStatus(health ? 'connected' : 'local');

      // Fetch banners
      const fetchedBanners = await api.getBanners(true);
      if (fetchedBanners && fetchedBanners.length > 0) {
        setBanners(fetchedBanners);
      } else {
        // Fallback from localStorage
        const saved = localStorage.getItem('coffeeland_offer_banners_v1');
        if (saved) setBanners(JSON.parse(saved));
      }

      // Fetch products
      const fetchedProducts = await api.getProducts();
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        const { PRODUCTS } = await import('../data/products');
        setProducts(PRODUCTS);
      }

      // Helper to clean out legacy mock dummy inquiries
      const cleanList = (list: WhatsAppInquiry[]) =>
        (list || []).filter(
          i =>
            !['inq-101', 'inq-102', 'inq-103'].includes(i.id) &&
            !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(i.customerName)
        );

      // Fetch inquiries
      const fetchedInquiries = await api.getInquiries();
      if (fetchedInquiries && fetchedInquiries.length > 0) {
        setInquiries(cleanList(fetchedInquiries));
      } else {
        const saved = localStorage.getItem('coffeeland_whatsapp_inquiries_v1');
        if (saved) setInquiries(cleanList(JSON.parse(saved)));
      }

      // Fetch offline counter POS orders
      const fetchedPos = await api.getPosOrders();
      if (fetchedPos && fetchedPos.length > 0) {
        setPosOrders(fetchedPos);
      } else {
        const savedPos = localStorage.getItem('coffeeland_kot_orders_v1');
        if (savedPos) setPosOrders(JSON.parse(savedPos));
      }

      // Fetch reviews
      const fetchedReviews = await api.getReviews();
      if (fetchedReviews && fetchedReviews.length > 0) {
        setReviews(fetchedReviews);
      }
    }
    loadData();
  }, []);

  // Quick refresh live orders from server
  const handleRefreshLiveOrders = async () => {
    setIsRefreshingOrders(true);
    try {
      const cleanList = (list: WhatsAppInquiry[]) =>
        (list || []).filter(
          i =>
            !['inq-101', 'inq-102', 'inq-103'].includes(i.id) &&
            !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(i.customerName)
        );
      const fetchedInquiries = await api.getInquiries();
      if (fetchedInquiries) {
        setInquiries(cleanList(fetchedInquiries));
      }
      const fetchedPos = await api.getPosOrders();
      if (fetchedPos && fetchedPos.length > 0) {
        setPosOrders(fetchedPos);
      } else {
        const savedPos = localStorage.getItem('coffeeland_kot_orders_v1');
        if (savedPos) setPosOrders(JSON.parse(savedPos));
      }
    } catch (e) {
      console.warn('Failed to refresh orders:', e);
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  // Handle Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const res = await api.loginAdmin({ password: passwordInput, pin: passwordInput });
    if (res.success) {
      setIsAuthenticated(true);
      localStorage.setItem('coffeeland_admin_auth', 'true');
    } else {
      setAuthError(res.message || 'Invalid credentials');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('coffeeland_admin_auth');
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Banner Actions
  const handleSaveBanner = async () => {
    if (!bannerForm.title || !bannerForm.itemName) {
      alert('Please provide banner title and item name.');
      return;
    }

    if (editingBannerId) {
      // Update
      const updated = await api.updateBanner(editingBannerId, bannerForm);
      setBanners(prev => prev.map(b => (b.id === editingBannerId ? { ...b, ...bannerForm } : b)));
      setEditingBannerId(null);
    } else {
      // Create
      const created = await api.addBanner(bannerForm);
      const newBanner: OfferBanner = created || {
        id: `banner-${Date.now()}`,
        ...bannerForm
      };
      setBanners(prev => [newBanner, ...prev]);
    }

    setIsCreatingBanner(false);
    // Persist to local storage as fallback
    localStorage.setItem('coffeeland_offer_banners_v1', JSON.stringify(banners));
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer banner?')) {
      await api.deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleBannerStatus = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (banner) {
      const updated = { isActive: !banner.isActive };
      await api.updateBanner(id, updated);
      setBanners(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
    }
  };

  // Menu Product Actions
  const handleStartEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditedName(p.name);
    setEditedPrice(p.price);
    setEditedInStock(p.inStock !== false);
  };

  const handleSaveProductEdit = async (id: string) => {
    await api.updateProduct(id, { name: editedName, price: editedPrice, inStock: editedInStock });
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, name: editedName, price: editedPrice, inStock: editedInStock } : p)));
    setEditingProductId(null);
  };

  const handleToggleProductStock = async (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const newStock = p.inStock === false ? true : false;
    await api.updateProduct(id, { inStock: newStock });
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, inStock: newStock } : prod));
  };

  const handleMarkAllInStock = async () => {
    if (!confirm('Mark all out-of-stock items back in stock?')) return;
    const outOfStockItems = products.filter(p => p.inStock === false);
    for (const item of outOfStockItems) {
      await api.updateProduct(item.id, { inStock: true });
    }
    setProducts(prev => prev.map(p => ({ ...p, inStock: true })));
  };

  // WhatsApp Inquiry Status Update
  const handleUpdateInquiryStatus = async (id: string, status: 'Inquired' | 'Confirmed' | 'Completed') => {
    await api.updateInquiryStatus(id, status);
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
  };

  const handleDeleteInquiry = async (id: string) => {
    await api.deleteInquiry(id);
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Stock counts
  const inStockCount = products.filter(p => p.inStock !== false).length;
  const outOfStockCount = products.filter(p => p.inStock === false).length;

  // Filtered menu items
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchMenu.toLowerCase()) ||
      p.category.toLowerCase().includes(searchMenu.toLowerCase());
    const matchesCategory = selectedMenuCategory === 'all' || p.category === selectedMenuCategory;
    const matchesStock =
      stockFilter === 'all' ? true :
      stockFilter === 'inStock' ? (p.inStock !== false) :
      (p.inStock === false);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  // If not logged in, render the luxury login screen
  const handlePrintKotFromInquiry = (inq: WhatsAppInquiry) => {
    const kotOrder: KotOrder = {
      id: `kot-inq-${inq.id}`,
      kotNumber: Math.floor(100 + Math.random() * 900),
      orderType: 'WhatsApp',
      tableNumber: 'WhatsApp Delivery',
      customerName: inq.customerName || 'WhatsApp Customer',
      customerPhone: inq.customerPhone || '',
      items: [
        {
          id: `item-${Date.now()}`,
          name: inq.itemName,
          price: inq.price,
          quantity: 1,
          category: inq.category || 'General',
          notes: inq.promoCode ? `Promo Code: ${inq.promoCode}` : ''
        }
      ],
      chefNotes: inq.message ? `Customer msg: ${inq.message}` : 'Online WhatsApp order',
      timestamp: inq.timestamp,
      totalAmount: inq.price,
      status: 'Preparing'
    };
    setExternalPrintKot(kotOrder);
    setActiveTab('kot');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EDE0CC] text-espresso-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient warm glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block group mb-4">
              <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-terracotta shadow-lg transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="Coffee Land Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Portal • Sangivalasa, Vizag</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-espresso-950">
              Coffee Land Admin
            </h1>
            <p className="text-xs text-coffee-700 mt-1">
              Manage offer banners, 250+ menu items, WhatsApp customer orders & Excel sheets.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-terracotta/20 shadow-xl backdrop-blur-md">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                  Owner Password or PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter Owner PIN (e.g. 954252)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-amber-50/50 border border-amber-900/20 text-espresso-950 text-sm focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 font-medium"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-terracotta absolute left-3.5 top-3.5" />
                </div>
                {authError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{authLoading ? 'Verifying...' : 'Access Admin Dashboard'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput('954252');
                    setTimeout(() => handleLogin(), 100);
                  }}
                  className="text-xs text-terracotta hover:underline font-bold"
                >
                  Quick Demo Access (PIN: 954252)
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-amber-900/10 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-coffee-700 hover:text-terracotta font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Customer Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Owner Admin Dashboard
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#EDE0CC] text-espresso-950 flex flex-col font-sans selection:bg-terracotta selection:text-white">
      {/* Top Owner Header */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-terracotta/20 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-terracotta shadow-xs" />
              <div>
                <span className="font-serif tracking-tight text-xl font-bold text-espresso-950 block leading-tight">
                  Coffee <span className="font-serif italic font-semibold text-terracotta">Land</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#802B12] block font-heading">
                  Owner Admin Command Center
                </span>
              </div>
            </Link>

            {/* Server Status Indicator */}
            <button
              onClick={() => setActiveTab('keepalive')}
              className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Click to view 24/7 Server Keep-Alive & Cloud Monitor"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{serverStatus === 'connected' ? '24/7 Server Live' : 'Checking Cloud...'}</span>
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>

          {/* Quick Actions: View Site & Logout */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-espresso-900 border border-terracotta/30 text-xs font-bold shadow-xs transition-colors"
              title="Open customer view in storefront"
            >
              <ExternalLink className="w-3.5 h-3.5 text-terracotta" />
              <span className="hidden sm:inline">View Customer Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold shadow-xs transition-colors"
              title="Sign out of owner portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* KPI Quick Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          <div className="p-4 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 block">Food Catalog</span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-950">{products.length}</span>
              <span className="text-[10px] text-terracotta font-semibold block">Across 17 Categories</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Utensils className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 block">Offer Deals</span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-950">{banners.length}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                {banners.filter(b => b.isActive).length} Live on Website
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 block">WhatsApp Inquiries</span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-950">{inquiries.length}</span>
              <span className="text-[10px] text-coffee-700 font-semibold block">Order Leads Tracked</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 block">Customer Rating</span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-950 flex items-center gap-1">
                4.7 <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
              </span>
              <span className="text-[10px] text-coffee-700 font-semibold block">260+ Google & Web Reviews</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-terracotta/15">
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'banners'
                ? 'bg-terracotta text-white shadow-md'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Offer Banners ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'menu'
                ? 'bg-terracotta text-white shadow-md'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food Menu Items ({products.length})</span>
            {outOfStockCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">
                {outOfStockCount} Out of Stock
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-terracotta text-white shadow-md'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kot')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'kot'
                ? 'bg-espresso-950 text-amber-300 shadow-md ring-2 ring-terracotta'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>POS & KOT Billing</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-espresso-950 text-emerald-400 shadow-md ring-2 ring-emerald-500'
                : 'bg-white hover:bg-emerald-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Sales Analytics & Graphs</span>
          </button>

          <button
            onClick={() => setActiveTab('raw-materials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'raw-materials'
                ? 'bg-espresso-950 text-amber-300 shadow-md ring-2 ring-amber-400'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <Layers className="w-4 h-4 text-terracotta" />
            <span>Raw Materials (Qty & Rs)</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'excel'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Download Excel Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'reviews'
                ? 'bg-terracotta text-white shadow-md'
                : 'bg-white hover:bg-amber-50 text-espresso-800 border border-terracotta/20'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Guest Photo Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('keepalive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 ${
              activeTab === 'keepalive'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>24/7 Server Keep-Alive</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OFFER BANNERS MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-terracotta/20">
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso-950">
                  Customizable Rectangular Offer Banners
                </h3>
                <p className="text-xs text-coffee-700">
                  Create new promo banners with custom photos, prices, discount badges, and color themes.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBannerId(null);
                  setBannerForm({
                    title: '',
                    subtitle: '',
                    itemName: '',
                    originalPrice: 199,
                    offerPrice: 149,
                    discountLabel: '20% OFF',
                    promoCode: '',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
                    themeColor: 'terracotta',
                    isActive: true,
                    expiryNote: 'Limited Time Offer',
                    category: 'Specialty Combos'
                  });
                  setIsCreatingBanner(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Offer Banner</span>
              </button>
            </div>

            {/* Banner Creation / Editing Card */}
            {isCreatingBanner && (
              <div className="p-6 rounded-3xl bg-white border-2 border-terracotta/30 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
                  <h4 className="font-serif font-bold text-base text-espresso-950 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-terracotta" />
                    <span>{editingBannerId ? 'Edit Offer Banner' : 'Create New Offer Banner'}</span>
                  </h4>
                  <button
                    onClick={() => setIsCreatingBanner(false)}
                    className="text-xs text-coffee-700 hover:text-red-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Banner Title *</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Sizzling Weekend Special"
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={bannerForm.itemName}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, itemName: e.target.value }))}
                      placeholder="e.g. Lotus Biscoff Kunafa"
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Subtitle / Delicious Note</label>
                    <input
                      type="text"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="e.g. Stretchy warm sweet cheese with crunchy golden kataifi"
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={bannerForm.originalPrice}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Offer Price (₹) *</label>
                    <input
                      type="number"
                      value={bannerForm.offerPrice}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, offerPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Discount Tag</label>
                    <input
                      type="text"
                      value={bannerForm.discountLabel}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, discountLabel: e.target.value }))}
                      placeholder="e.g. FLAT ₹50 OFF or 25% OFF"
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={bannerForm.promoCode || ''}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, promoCode: e.target.value }))}
                      placeholder="e.g. KUNAFA50"
                      className="w-full px-3 py-2 rounded-xl border border-amber-900/20 text-xs uppercase"
                    />
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1.5">Banner Color Palette</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setBannerForm(prev => ({ ...prev, themeColor: theme.id }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          bannerForm.themeColor === theme.id
                            ? 'border-terracotta ring-2 ring-terracotta/30 bg-amber-50'
                            : 'border-amber-900/20 bg-white'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${theme.previewClass}`} />
                        <span>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload & Preview */}
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1.5">Item Picture (Upload from phone/device or URL)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-900/20 bg-amber-50 shrink-0">
                      <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-terracotta/30 text-terracotta text-xs font-bold shadow-xs hover:bg-amber-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                      </button>
                      <input
                        type="text"
                        value={bannerForm.image}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="Or enter image URL"
                        className="w-full px-3 py-1.5 rounded-xl border border-amber-900/20 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreatingBanner(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-amber-900/20 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBanner}
                    className="px-5 py-2 rounded-xl bg-terracotta text-white text-xs font-bold shadow-md hover:bg-terracotta-600"
                  >
                    {editingBannerId ? 'Update Banner' : 'Publish Banner'}
                  </button>
                </div>
              </div>
            )}

            {/* Banners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      {b.themeColor}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleBannerStatus(b.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          b.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {b.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingBannerId(b.id);
                          setBannerForm({ ...b });
                          setIsCreatingBanner(true);
                        }}
                        className="p-1 hover:text-terracotta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="p-1 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center my-2">
                    <img src={b.image} alt={b.itemName} className="w-16 h-16 rounded-xl object-cover shrink-0 border" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-espresso-950 line-clamp-1">{b.title}</h4>
                      <p className="text-xs text-coffee-700 line-clamp-1">{b.itemName}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-sm text-terracotta">₹{b.offerPrice}</span>
                        <span className="text-xs text-coffee-600 line-through">₹{b.originalPrice}</span>
                        <span className="text-[10px] font-bold text-emerald-700">{b.discountLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FOOD MENU ITEMS (250 ITEMS) */}
        {/* ======================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-5">
            {/* Stock Overview KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Total Menu Catalog */}
              <div
                onClick={() => setStockFilter('all')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  stockFilter === 'all'
                    ? 'bg-amber-100/90 border-terracotta ring-2 ring-terracotta/30'
                    : 'bg-white border-terracotta/20 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between text-espresso-900">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Menu Catalog</span>
                  <Utensils className="w-4 h-4 text-terracotta" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-espresso-950">{products.length}</span>
                  <span className="text-xs font-semibold text-coffee-700">dishes & drinks</span>
                </div>
                <span className="text-[10px] text-coffee-600 font-bold mt-1 inline-block">
                  {stockFilter === 'all' ? '● Active View' : 'Click to View All'}
                </span>
              </div>

              {/* Card 2: In Stock / Available */}
              <div
                onClick={() => setStockFilter('inStock')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  stockFilter === 'inStock'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400/30'
                    : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-950">
                  <span className="text-xs font-bold uppercase tracking-wider">In Stock & Ordering</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-700">{inStockCount}</span>
                  <span className="text-xs font-semibold text-emerald-800">available now</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
                  {stockFilter === 'inStock' ? '● Active View' : 'Click to View Available'}
                </span>
              </div>

              {/* Card 3: Out of Stock (Special Highlighted View) */}
              <div
                onClick={() => setStockFilter('outOfStock')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  stockFilter === 'outOfStock'
                    ? 'bg-red-100 border-red-600 ring-2 ring-red-400/40'
                    : outOfStockCount > 0
                    ? 'bg-red-50/90 border-red-300 hover:border-red-500 shadow-xs'
                    : 'bg-white border-terracotta/20 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between text-red-950">
                  <span className="text-xs font-bold uppercase tracking-wider">Out of Stock Items</span>
                  <PackageX className={`w-4 h-4 ${outOfStockCount > 0 ? 'text-red-600' : 'text-coffee-400'}`} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${outOfStockCount > 0 ? 'text-red-600' : 'text-coffee-600'}`}>
                    {outOfStockCount}
                  </span>
                  <span className={`text-xs font-bold ${outOfStockCount > 0 ? 'text-red-800' : 'text-coffee-600'}`}>
                    {outOfStockCount > 0 ? 'items unavailable' : 'all items in stock'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold mt-1 inline-block ${outOfStockCount > 0 ? 'text-red-700 underline' : 'text-coffee-600'}`}>
                  {stockFilter === 'outOfStock' ? '● Currently in Out of Stock View' : 'Switch to Out of Stock View →'}
                </span>
              </div>
            </div>

            {/* Filter, Search & Stock View Tabs Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-terracotta/20 shadow-xs">
              {/* Left Controls: Search & Category */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchMenu}
                    onChange={(e) => setSearchMenu(e.target.value)}
                    placeholder="Search dishes, drinks..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-900/20 text-xs bg-amber-50/30 focus:outline-none focus:border-terracotta"
                  />
                  <Search className="w-3.5 h-3.5 text-coffee-600 absolute left-3 top-3" />
                </div>
                <select
                  value={selectedMenuCategory}
                  onChange={(e) => setSelectedMenuCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-amber-900/20 text-xs bg-white text-espresso-900 font-medium"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Right Controls: Stock View Mode Tabs & Excel Export */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Stock Tabs */}
                <div className="inline-flex p-1 rounded-xl bg-amber-100/60 border border-terracotta/20 text-xs font-bold">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      stockFilter === 'all'
                        ? 'bg-terracotta text-white shadow-xs'
                        : 'text-espresso-800 hover:text-terracotta'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setStockFilter('inStock')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      stockFilter === 'inStock'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-espresso-800 hover:text-emerald-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>In Stock ({inStockCount})</span>
                  </button>
                  <button
                    onClick={() => setStockFilter('outOfStock')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      stockFilter === 'outOfStock'
                        ? 'bg-red-600 text-white shadow-xs'
                        : outOfStockCount > 0
                        ? 'text-red-700 font-black'
                        : 'text-espresso-800 hover:text-red-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${outOfStockCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-zinc-400'}`} />
                    <span>Out of Stock ({outOfStockCount})</span>
                  </button>
                </div>

                <button
                  onClick={() => exportMenuToExcel(products)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Out-of-Stock View Management Banner (Visible when Out of Stock view is chosen) */}
            {stockFilter === 'outOfStock' && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-red-950">
                      Out of Stock Items View ({filteredProducts.length} items shown)
                    </h4>
                    <p className="text-xs text-red-800 mt-0.5">
                      These items are currently hidden or marked as unavailable to customers on the website. Tap the green switch on any dish to mark it back in stock instantly.
                    </p>
                  </div>
                </div>

                {outOfStockCount > 0 && (
                  <button
                    onClick={handleMarkAllInStock}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shrink-0 self-start sm:self-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark All In Stock</span>
                  </button>
                )}
              </div>
            )}

            {/* Empty State when in Out of Stock View and no items are out of stock */}
            {stockFilter === 'outOfStock' && filteredProducts.length === 0 && (
              <div className="p-10 rounded-3xl bg-white border border-emerald-300 text-center shadow-xs">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-lg text-espresso-950">
                  All Items are Fully In Stock!
                </h4>
                <p className="text-xs text-coffee-700 max-w-md mx-auto mt-1 mb-4">
                  There are currently no items marked as out of stock. Customers can order all 250 items on your menu.
                </p>
                <button
                  onClick={() => setStockFilter('all')}
                  className="px-4 py-2 rounded-full bg-terracotta text-white text-xs font-bold hover:bg-terracotta-600 transition-colors shadow-xs"
                >
                  View All Menu Items
                </button>
              </div>
            )}

            {/* Menu Items Table */}
            {filteredProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-terracotta/20 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[620px]">
                    <thead className="bg-amber-50/80 border-b border-amber-900/10 text-espresso-950 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Dietary</th>
                        <th className="py-3 px-4">Stock Status (1-Click Toggle)</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 font-medium">
                      {(stockFilter === 'outOfStock' ? filteredProducts : filteredProducts.slice(0, 50)).map((p) => {
                        const isEditing = editingProductId === p.id;
                        const isAvailable = p.inStock !== false;

                        return (
                          <tr
                            key={p.id}
                            className={`transition-colors ${
                              !isAvailable
                                ? 'bg-red-50/50 hover:bg-red-50/80'
                                : 'hover:bg-amber-50/40'
                            }`}
                          >
                            <td className="py-2.5 px-4 flex items-center gap-2.5">
                              <img
                                src={p.image}
                                alt={p.name}
                                className={`w-9 h-9 rounded-lg object-cover shrink-0 border ${
                                  !isAvailable ? 'opacity-60 grayscale-[30%]' : ''
                                }`}
                              />
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                  className="px-2 py-1 rounded border text-xs"
                                />
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-espresso-950">{p.name}</span>
                                    {!isAvailable && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                  {p.portion && (
                                    <span className="text-[10px] text-coffee-600">{p.portion}</span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-coffee-700 capitalize">
                              {p.category.replace('-', ' ')}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-terracotta">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editedPrice}
                                  onChange={(e) => setEditedPrice(Number(e.target.value))}
                                  className="w-20 px-2 py-1 rounded border text-xs"
                                />
                              ) : (
                                <span>₹{p.price}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {p.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </td>

                            {/* Stock Status Column with Interactive One-Click Toggle */}
                            <td className="py-2.5 px-4">
                              {isEditing ? (
                                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editedInStock}
                                    onChange={(e) => setEditedInStock(e.target.checked)}
                                    className="w-4 h-4 rounded text-terracotta focus:ring-terracotta"
                                  />
                                  <span className={`text-xs font-bold ${editedInStock ? 'text-emerald-700' : 'text-red-600'}`}>
                                    {editedInStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </label>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductStock(p.id)}
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 ${
                                    isAvailable
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                      : 'bg-red-100 text-red-800 border-red-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                                  }`}
                                  title={isAvailable ? 'Click to mark as Out of Stock' : 'Click to mark as In Stock'}
                                >
                                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'}`} />
                                  <span>{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                                </button>
                              )}
                            </td>

                            <td className="py-2.5 px-4 text-right">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveProductEdit(p.id)}
                                  className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-xs"
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEditProduct(p)}
                                  className="p-1.5 hover:text-terracotta"
                                  title="Edit item price or name"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {stockFilter !== 'outOfStock' && filteredProducts.length > 50 && (
                  <div className="p-3 text-center text-xs text-coffee-700 border-t border-amber-900/10">
                    Showing first 50 of {filteredProducts.length} items. Use search or the category selector to view specific items.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WHATSAPP INQUIRIES & ORDERS */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white border border-terracotta/20 gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso-950 flex items-center gap-2">
                  <span>Customer WhatsApp Orders & Inquiries Log</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {inquiries.length} Real Orders
                  </span>
                </h3>
                <p className="text-xs text-coffee-700">
                  Live orders captured when customers order dishes through WhatsApp with their real contact details.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRefreshLiveOrders}
                  disabled={isRefreshingOrders}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-espresso-950 text-xs font-bold shadow-xs transition-colors"
                  title="Pull latest orders from server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${isRefreshingOrders ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingOrders ? 'Syncing...' : 'Sync Orders'}</span>
                </button>
                <button
                  onClick={() => exportInquiriesToExcel(inquiries)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Dining Option Filter Tabs: Dine-In (Red), Delivery (Blue), Takeaway (Green) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <button
                type="button"
                onClick={() => setInquiryDiningFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  inquiryDiningFilter === 'all'
                    ? 'bg-espresso-950 text-white shadow-xs'
                    : 'bg-white border border-amber-900/15 text-coffee-800 hover:bg-amber-100/50'
                }`}
              >
                All Orders ({inquiries.length})
              </button>

              <button
                type="button"
                onClick={() => setInquiryDiningFilter('Dine-In')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inquiryDiningFilter === 'Dine-In'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-red-300 text-red-900 hover:bg-red-50'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>🔴 Dine-In ({inquiries.filter((i) => (i.diningOption || 'Dine-In') === 'Dine-In').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setInquiryDiningFilter('Delivery')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inquiryDiningFilter === 'Delivery'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-blue-300 text-blue-900 hover:bg-blue-50'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>🔵 Delivery ({inquiries.filter((i) => i.diningOption === 'Delivery').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setInquiryDiningFilter('Takeaway')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inquiryDiningFilter === 'Takeaway'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>🟢 Takeaway ({inquiries.filter((i) => i.diningOption === 'Takeaway').length})</span>
              </button>
            </div>

            {(() => {
              const displayedInquiries = inquiries.filter((inq) =>
                inquiryDiningFilter === 'all' ? true : (inq.diningOption || 'Dine-In') === inquiryDiningFilter
              );

              if (displayedInquiries.length === 0) {
                return (
                  <div className="p-10 rounded-3xl bg-white border border-terracotta/20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-terracotta flex items-center justify-center mx-auto">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-espresso-950">
                      No {inquiryDiningFilter !== 'all' ? inquiryDiningFilter : 'WhatsApp'} Orders Recorded Yet
                    </h4>
                    <p className="text-xs text-coffee-700 max-w-md mx-auto leading-relaxed">
                      Whenever customers select a dish and pick Dine-In (Red), Delivery (Blue), or Takeaway (Green), their order details will appear right here!
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedInquiries.map((inq) => {
                    const dining = inq.diningOption || 'Dine-In';
                    const passTheme =
                      dining === 'Delivery'
                        ? {
                            ribbonDark: '#1E3A8A',
                            ribbonMain: '#1D4ED8',
                            ribbonLight: '#2563EB',
                            borderColor: 'border-blue-300',
                            badgeBg: 'bg-blue-600 text-white',
                            badgeLightBg: 'bg-blue-50 text-blue-900 border-blue-200',
                            label: 'HOME DELIVERY PASS',
                            colorName: 'Blue Card',
                            emoji: '🔵',
                            icon: Truck,
                          }
                        : dining === 'Takeaway'
                        ? {
                            ribbonDark: '#064E3B',
                            ribbonMain: '#059669',
                            ribbonLight: '#10B981',
                            borderColor: 'border-emerald-300',
                            badgeBg: 'bg-emerald-600 text-white',
                            badgeLightBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
                            label: 'QUICK TAKEAWAY PASS',
                            colorName: 'Green Card',
                            emoji: '🟢',
                            icon: ShoppingBag,
                          }
                        : {
                            ribbonDark: '#7F1D1D',
                            ribbonMain: '#B91C1C',
                            ribbonLight: '#DC2626',
                            borderColor: 'border-red-300',
                            badgeBg: 'bg-red-600 text-white',
                            badgeLightBg: 'bg-red-50 text-red-900 border-red-200',
                            label: 'DINE-IN ORDER PASS',
                            colorName: 'Red Card',
                            emoji: '🔴',
                            icon: UtensilsCrossed,
                          };

                    return (
                      <div
                        key={inq.id}
                        className={`rounded-2xl bg-white border ${passTheme.borderColor} shadow-sm hover:shadow-md transition-all flex overflow-hidden min-h-[220px]`}
                      >
                        {/* Left Vertical Ribbon Bar with Velvet Bowknot */}
                        <div className="relative w-12 sm:w-14 shrink-0 bg-neutral-100 flex flex-col items-center justify-start overflow-hidden">
                          {/* Vertical Ribbon */}
                          <div
                            className="absolute inset-y-0 w-7 sm:w-8 shadow-inner"
                            style={{
                              background: `linear-gradient(90deg, ${passTheme.ribbonDark} 0%, ${passTheme.ribbonMain} 50%, ${passTheme.ribbonDark} 100%)`,
                            }}
                          />

                          {/* Velvet Bowknot SVG at Top */}
                          <div className="relative z-10 pt-2 w-10 sm:w-12">
                            <svg viewBox="0 0 100 110" fill="none" className="w-full h-auto drop-shadow-sm">
                              {/* Left Loop */}
                              <path
                                d="M 50 35 C 22 15, 2 25, 8 45 C 14 62, 38 52, 48 42 Z"
                                fill={passTheme.ribbonMain}
                              />
                              {/* Right Loop */}
                              <path
                                d="M 50 35 C 78 15, 98 25, 92 45 C 86 62, 62 52, 52 42 Z"
                                fill={passTheme.ribbonMain}
                              />
                              {/* Tails */}
                              <path
                                d="M 44 45 C 38 65, 24 88, 18 102 L 32 94 L 40 98 C 42 80, 44 60, 46 45 Z"
                                fill={passTheme.ribbonDark}
                              />
                              <path
                                d="M 56 45 C 62 65, 76 88, 82 102 L 68 94 L 60 98 C 58 80, 56 60, 54 45 Z"
                                fill={passTheme.ribbonDark}
                              />
                              {/* Knot */}
                              <ellipse cx="50" cy="38" rx="10" ry="8" fill={passTheme.ribbonLight} />
                            </svg>
                          </div>
                        </div>

                        {/* Right Content: Gift CARD + TO / FROM + Item + Actions */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            {/* Card Header matching Reference Image */}
                            <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-neutral-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="font-serif font-black text-xl tracking-wider uppercase"
                                    style={{ color: passTheme.ribbonDark }}
                                  >
                                    {dining.toUpperCase()}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${passTheme.badgeBg}`}>
                                    {passTheme.emoji} {passTheme.label}
                                  </span>
                                </div>
                                <span
                                  className="font-handwriting text-xs italic font-semibold block -mt-0.5"
                                  style={{ color: passTheme.ribbonMain }}
                                >
                                  {dining === 'Dine-In' ? 'Table Service' : dining === 'Delivery' ? 'Doorstep Delivery' : 'Express Pickup'}
                                </span>
                              </div>

                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                  inq.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : inq.status === 'Confirmed'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-blue-50 text-blue-800 border-blue-300'
                                }`}
                              >
                                <option value="Inquired">Inquired</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>

                            {/* Lined TO: and FROM: fields like reference image */}
                            <div className="space-y-1 text-xs mb-2.5">
                              <div className="flex items-center gap-1.5 border-b pb-0.5" style={{ borderColor: `${passTheme.ribbonMain}22` }}>
                                <span className="font-bold text-[10px] text-neutral-500 w-11 uppercase shrink-0">
                                  TO:
                                </span>
                                <span className="font-serif font-bold text-neutral-900 truncate">
                                  Coffee Land Resto & Cafe
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 border-b pb-0.5" style={{ borderColor: `${passTheme.ribbonMain}22` }}>
                                <span className="font-bold text-[10px] text-neutral-500 w-11 uppercase shrink-0">
                                  FROM:
                                </span>
                                <span className="font-bold text-neutral-950 truncate flex items-center gap-1.5">
                                  <span>{inq.customerName || 'Direct Guest'}</span>
                                  {inq.customerPhone && (
                                    <a
                                      href={`tel:${inq.customerPhone}`}
                                      className="font-mono text-xs text-emerald-700 hover:underline"
                                    >
                                      ({inq.customerPhone})
                                    </a>
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Item & Price summary */}
                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between mb-2">
                              <div>
                                <span className="font-bold text-xs text-neutral-900 block font-serif">
                                  {inq.itemName}
                                </span>
                                <span className="text-[11px] text-coffee-700">
                                  {inq.category || 'Specialty Dish'}
                                </span>
                                {inq.promoCode && (
                                  <span className="ml-2 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                                    Promo: {inq.promoCode}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="font-serif font-black text-base text-neutral-950">
                                  ₹{inq.price}
                                </span>
                              </div>
                            </div>

                            {/* Note / Message preview */}
                            {inq.message && (
                              <p className="text-[11px] bg-amber-50/70 p-2 rounded-lg border border-amber-200/40 text-coffee-800 font-mono line-clamp-2">
                                "{inq.message}"
                              </p>
                            )}
                          </div>

                          {/* Footer with Timestamp and Action Buttons */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs mt-2">
                            <span className="text-[10px] text-coffee-600">
                              {new Date(inq.timestamp).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handlePrintKotFromInquiry(inq)}
                                className="px-2.5 py-1 rounded-full bg-espresso-950 hover:bg-black text-amber-300 font-bold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                                title="Print Kitchen Order Ticket for this order"
                              >
                                <Printer className="w-3 h-3 text-amber-300" />
                                <span>KOT</span>
                              </button>

                              <a
                                href={`https://wa.me/919542525665?text=${encodeURIComponent(`Hello Coffee Land, regarding order: ${inq.itemName} (${dining})`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Chat</span>
                              </a>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1 hover:text-red-600 text-neutral-400"
                                title="Delete log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3.5: COUNTER POS & KOT THERMAL PRINTING */}
        {/* ======================================================== */}
        {activeTab === 'kot' && (
          <AdminKotPos
            products={products}
            externalPrintOrder={externalPrintKot}
            onClearExternalPrint={() => setExternalPrintKot(null)}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 3.6: VIRTUAL SALES ANALYTICS & GRAPHS (TODAY/WEEK/MONTH) */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <AdminSalesAnalytics inquiries={inquiries} posOrders={posOrders} />
        )}

        {/* ======================================================== */}
        {/* TAB 3.7: RAW MATERIALS REQUIREMENTS & INVENTORY (QTY & RS) */}
        {/* ======================================================== */}
        {activeTab === 'raw-materials' && (
          <AdminRawMaterials />
        )}

        {/* ======================================================== */}
        {/* TAB 4: EXCEL (.XLSX) DOWNLOAD CENTER */}
        {/* ======================================================== */}
        {activeTab === 'excel' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-emerald-800">
                <FileSpreadsheet className="w-6 h-6" />
                <h3 className="font-serif text-2xl font-bold">Excel (.xlsx) Spreadsheet Export Center</h3>
              </div>
              <p className="text-xs sm:text-sm text-coffee-700 max-w-2xl leading-relaxed">
                Download formatted Excel workbooks containing real customer orders, offline counter POS records, daily raw materials usage, and menu inventory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Master Business Report (Featured) */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-espresso-950 to-[#3D1E16] text-white shadow-md flex flex-col justify-between border-2 border-amber-400/40 md:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-espresso-950">
                      Master Report
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-amber-200 mb-1">
                    Master Sales & Raw Materials
                  </h4>
                  <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
                    4-in-1 multi-sheet workbook: Sales Summary, Real WhatsApp Orders, Offline POS tickets, and Kitchen Raw Materials usage.
                  </p>
                  <div className="text-[11px] font-bold text-amber-300 bg-white/10 px-3 py-1.5 rounded-xl inline-block mb-6">
                    {inquiries.length + posOrders.length} Total Combined Orders
                  </div>
                </div>
                <button
                  onClick={() => exportMasterBusinessReportToExcel(inquiries, posOrders)}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master Report (.xlsx)</span>
                </button>
              </div>

              {/* Card 2: Real WhatsApp Orders Export */}
              <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                    WhatsApp Orders Log
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed mb-4">
                    Full record of real online orders: customer names, contact numbers, dishes, prices, and timestamps.
                  </p>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full inline-block mb-6">
                    {inquiries.length} Real Customer Orders
                  </span>
                </div>
                <button
                  onClick={() => exportInquiriesToExcel(inquiries)}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WhatsApp Orders (.xlsx)</span>
                </button>
              </div>

              {/* Card 3: Counter POS & Offline Orders Export */}
              <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                    Counter POS & KOT Orders
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed mb-4">
                    All offline counter orders: Dine-In, Takeaway, Delivery tickets with items breakdown, table #, and total bills.
                  </p>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full inline-block mb-6">
                    {posOrders.length} Offline Tickets Saved
                  </span>
                </div>
                <button
                  onClick={() => exportPosOrdersToExcel(posOrders)}
                  className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download POS Orders (.xlsx)</span>
                </button>
              </div>

              {/* Card 4: Banners Export */}
              <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                    Offer Banners Catalog
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed mb-4">
                    All rectangular banners with offer prices, original prices, savings tags, and color themes.
                  </p>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full inline-block mb-6">
                    {banners.length} Banners Configured
                  </span>
                </div>
                <button
                  onClick={() => exportBannersToExcel(banners)}
                  className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Banners (.xlsx)</span>
                </button>
              </div>

              {/* Card 5: Complete Menu Catalog */}
              <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-4">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                    Complete Food Menu
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed mb-4">
                    Full official 250+ dishes catalog with prices, categories, veg/non-veg flags, and descriptions.
                  </p>
                  <span className="text-[11px] font-bold text-[#802B12] bg-amber-100 px-2.5 py-1 rounded-full inline-block mb-6">
                    {products.length} Menu Items
                  </span>
                </div>
                <button
                  onClick={() => exportMenuToExcel(products)}
                  className="w-full py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Menu (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: GUEST PHOTO REVIEWS */}
        {/* ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-terracotta/20">
              <h3 className="font-serif text-lg font-bold text-espresso-950">
                Customer Reviews & Device Photo Uploads
              </h3>
              <p className="text-xs text-coffee-700">
                Reviews submitted by diners directly from mobile devices and phones at tables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-espresso-950 block">{rev.author}</span>
                      <span className="text-xs text-coffee-600">{rev.dishName} • {rev.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-coffee-800 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {rev.photos.map((ph, idx) => (
                        <img key={idx} src={ph} alt="Review attachment" className="w-14 h-14 rounded-xl object-cover border" />
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-coffee-600 pt-2 border-t border-amber-900/10 flex justify-between">
                    <span>Uploaded from {rev.deviceType || 'Mobile Phone'}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: 24/7 SERVER KEEP-ALIVE & CLOUD UPTIME */}
        {/* ======================================================== */}
        {activeTab === 'keepalive' && (
          <div className="space-y-6">
            {/* Status Header Banner */}
            <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-900 via-emerald-800 to-espresso-950 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>24/7 Zero-Sleep Mode Active</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Render Cloud Anti-Sleep Command Center
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                    Prevent Render from sleeping after 15 minutes of inactivity. Keep your food menu, QR codes, and customer ordering instantly responsive with 0-second cold-start latency.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleTestPing}
                    disabled={isTestingPing}
                    className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-700 ${isTestingPing ? 'animate-spin' : ''}`} />
                    <span>{isTestingPing ? 'Sending Ping...' : 'Send Test Ping Now'}</span>
                  </button>

                  <button
                    onClick={handleCopyHealthUrl}
                    className="px-5 py-3 rounded-2xl bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-bold text-xs sm:text-sm border border-emerald-400/30 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {copiedUrl ? <CheckCheck className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl ? 'Copied Health URL!' : 'Copy Health URL'}</span>
                  </button>
                </div>
              </div>

              {pingResult && (
                <div className={`mt-5 p-3.5 rounded-xl text-xs font-mono border flex items-center justify-between ${
                  pingResult.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-red-950/60 border-red-500/40 text-red-200'
                }`}>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pingResult.message}</span>
                  </span>
                  <span className="text-[10px] opacity-75">{pingResult.timestamp}</span>
                </div>
              )}
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-coffee-600 uppercase">Server Status</span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Activity className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-serif text-xl font-bold text-espresso-950 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{serverStatus === 'connected' ? 'ONLINE 24/7' : 'Connecting...'}</span>
                </div>
                <span className="text-[10px] text-coffee-600 block mt-1">
                  Fullstack Node.js + Express API
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-coffee-600 uppercase">Current Uptime</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-serif text-xl font-bold text-espresso-950">
                  {healthData?.uptimeFormatted || (healthData?.uptimeSeconds ? `${Math.floor(healthData.uptimeSeconds / 60)} mins` : 'Live')}
                </div>
                <span className="text-[10px] text-coffee-600 block mt-1">
                  Continuous session time
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-coffee-600 uppercase">Internal Heartbeat</span>
                  <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
                    <Zap className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-serif text-xl font-bold text-espresso-950">
                  Every 8 Mins
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                  Auto self-ping prevents 15m idle limit
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-coffee-600 uppercase">Target Endpoint</span>
                  <span className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                    <Server className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-espresso-950 truncate" title="https://coffeeland-4yy7.onrender.com/api/health">
                  /api/health
                </div>
                <span className="text-[10px] text-coffee-600 block mt-1">
                  coffeeland-4yy7.onrender.com
                </span>
              </div>
            </div>

            {/* Permanent 24/7 Setup Guide (100% Free Forever) */}
            <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-700" />
                  <span>Permanent 24/7 Solution (Zero Downtime)</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-espresso-950">
                  Why Render Sleeps & How To Keep It Permanently On
                </h4>
                <p className="text-xs text-coffee-700 mt-1 leading-relaxed max-w-3xl">
                  Render's Free tier puts web services to sleep after <strong>15 minutes of zero inbound traffic</strong>. When someone visits, they see the black "Render Application Loading / Service Waking Up" screen for 45-60 seconds.
                  <br className="hidden sm:inline" />
                  Our backend code already pings itself every 8 minutes. To ensure the server <strong>instantly stays awake even across server restarts or redeploys</strong>, link a free external cloud pinger below (takes 1 minute, 100% free forever):
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Method 1: Cron-Job.org */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-900/15 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-espresso-950 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                        <span>Cron-Job.org (Recommended)</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        100% Free Forever
                      </span>
                    </div>

                    <ol className="text-xs text-coffee-800 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Go to <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-terracotta font-bold hover:underline">cron-job.org</a> (free signup).</li>
                      <li>Click <strong>"Create Cronjob"</strong>.</li>
                      <li>Title: <strong>CoffeeLand Keep-Alive</strong>.</li>
                      <li>URL: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 text-terracotta font-mono text-[11px]">https://coffeeland-4yy7.onrender.com/api/health</code></li>
                      <li>Schedule: <strong>Every 10 minutes</strong> (or Every 5 minutes).</li>
                      <li>Click <strong>Create</strong>. Done!</li>
                    </ol>
                  </div>

                  <a
                    href="https://cron-job.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Open Cron-Job.org</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Method 2: UptimeRobot */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-900/15 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-espresso-950 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                        <span>UptimeRobot</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        50 Free Monitors
                      </span>
                    </div>

                    <ol className="text-xs text-coffee-800 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Go to <a href="https://uptimerobot.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">uptimerobot.com</a> (free account).</li>
                      <li>Click <strong>"+ Add New Monitor"</strong>.</li>
                      <li>Monitor Type: <strong>HTTP(s)</strong>.</li>
                      <li>Friendly Name: <strong>CoffeeLand 24/7</strong>.</li>
                      <li>URL: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800 font-mono text-[11px]">https://coffeeland-4yy7.onrender.com/api/health</code></li>
                      <li>Monitoring Interval: <strong>5 minutes</strong>.</li>
                      <li>Click <strong>Create Monitor</strong>. Done!</li>
                    </ol>
                  </div>

                  <a
                    href="https://uptimerobot.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Open UptimeRobot.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Endpoint Health Verification Card */}
              <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-900/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-terracotta shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-espresso-950 block">Direct Public Ping Endpoint</span>
                    <span className="font-mono text-xs text-terracotta break-all">https://coffeeland-4yy7.onrender.com/api/health</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://coffeeland-4yy7.onrender.com/api/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-espresso-900 border border-terracotta/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View JSON</span>
                    <ExternalLink className="w-3.5 h-3.5 text-terracotta" />
                  </a>

                  <button
                    onClick={handleCopyHealthUrl}
                    className="px-3.5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedUrl ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
