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
  CheckCheck
} from 'lucide-react';
import { OfferBanner, BannerColorTheme, WhatsAppInquiry } from '../types/banner';
import { Product } from '../types/product';
import { Review } from '../types/review';
import { api, ServerHealthResponse } from '../services/api';
import { exportInquiriesToExcel, exportBannersToExcel, exportMenuToExcel } from '../services/excelExport';

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
  const [activeTab, setActiveTab] = useState<'banners' | 'menu' | 'inquiries' | 'excel' | 'reviews' | 'keepalive'>('banners');

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
  const [reviews, setReviews] = useState<Review[]>([]);

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

      // Fetch inquiries
      const fetchedInquiries = await api.getInquiries();
      if (fetchedInquiries && fetchedInquiries.length > 0) {
        setInquiries(fetchedInquiries);
      } else {
        const saved = localStorage.getItem('coffeeland_whatsapp_inquiries_v1');
        if (saved) setInquiries(JSON.parse(saved));
      }

      // Fetch reviews
      const fetchedReviews = await api.getReviews();
      if (fetchedReviews && fetchedReviews.length > 0) {
        setReviews(fetchedReviews);
      }
    }
    loadData();
  }, []);

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
  };

  const handleSaveProductEdit = async (id: string) => {
    await api.updateProduct(id, { name: editedName, price: editedPrice });
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, name: editedName, price: editedPrice } : p)));
    setEditingProductId(null);
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

  // Filtered menu items
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchMenu.toLowerCase()) ||
      p.category.toLowerCase().includes(searchMenu.toLowerCase());
    const matchesCategory = selectedMenuCategory === 'all' || p.category === selectedMenuCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  // If not logged in, render the luxury login screen
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-terracotta/20">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchMenu}
                    onChange={(e) => setSearchMenu(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-900/20 text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-coffee-600 absolute left-3 top-3" />
                </div>
                <select
                  value={selectedMenuCategory}
                  onChange={(e) => setSelectedMenuCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-amber-900/20 text-xs bg-white"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => exportMenuToExcel(products)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Menu (.xlsx)</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-2xl border border-terracotta/20 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead className="bg-amber-50/80 border-b border-amber-900/10 text-espresso-950 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Dietary</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10 font-medium">
                    {filteredProducts.slice(0, 50).map((p) => {
                      const isEditing = editingProductId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-amber-50/40">
                          <td className="py-2.5 px-4 flex items-center gap-2.5">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 rounded border text-xs"
                              />
                            ) : (
                              <span className="font-bold text-espresso-950">{p.name}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-coffee-700">{p.category}</td>
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
              {filteredProducts.length > 50 && (
                <div className="p-3 text-center text-xs text-coffee-700 border-t border-amber-900/10">
                  Showing first 50 of {filteredProducts.length} items. Use search to filter specific dishes.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WHATSAPP INQUIRIES & ORDERS */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-terracotta/20">
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso-950">
                  Customer WhatsApp Orders & Inquiries Log
                </h3>
                <p className="text-xs text-coffee-700">
                  Real-time leads generated when visitors click "Claim on WhatsApp" or "Order on WhatsApp".
                </p>
              </div>
              <button
                onClick={() => exportInquiriesToExcel(inquiries)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to Excel (.xlsx)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-bold text-sm text-espresso-950 block">{inq.itemName}</span>
                      <span className="text-xs text-coffee-700">₹{inq.price} • {inq.category}</span>
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

                  <p className="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200/50 text-coffee-800 my-2 font-mono">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-900/10 text-xs">
                    <span className="text-[10px] text-coffee-600">
                      {new Date(inq.timestamp).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/919542525665?text=${encodeURIComponent(`Hello Coffee Land, regarding order: ${inq.itemName}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat</span>
                      </a>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1 hover:text-red-600"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                Download formatted Excel workbooks containing live inquiries, active offer deals, and the complete 250+ food menu catalog for offline inventory management and sales records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Inquiries Export */}
              <div className="p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-espresso-950 mb-1">
                    WhatsApp Orders Log
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed mb-4">
                    Complete list of customer leads, item names, prices, promo codes, dates, and order status.
                  </p>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full inline-block mb-6">
                    {inquiries.length} Records Available
                  </span>
                </div>
                <button
                  onClick={() => exportInquiriesToExcel(inquiries)}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Inquiries (.xlsx)</span>
                </button>
              </div>

              {/* Card 2: Banners Export */}
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

              {/* Card 3: Complete Menu Catalog */}
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
