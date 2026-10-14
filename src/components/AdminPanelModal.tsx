import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
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
  Palette
} from 'lucide-react';
import { OfferBanner, BannerColorTheme, WhatsAppInquiry } from '../types/banner';
import { Product } from '../types/product';
import {
  exportInquiriesToExcel,
  exportBannersToExcel,
  exportMenuToExcel
} from '../services/excelExport';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: OfferBanner[];
  onAddBanner: (banner: Omit<OfferBanner, 'id'>) => void;
  onUpdateBanner: (id: string, updatedFields: Partial<OfferBanner>) => void;
  onDeleteBanner: (id: string) => void;
  onToggleBannerStatus: (id: string) => void;
  onResetBanners: () => void;
  products: Product[];
  onUpdateProduct?: (id: string, updatedProduct: Partial<Product>) => void;
  onAddProduct?: (newProduct: Product) => void;
  onDeleteProduct?: (id: string) => void;
  inquiries: WhatsAppInquiry[];
  onUpdateInquiryStatus: (id: string, status: 'Inquired' | 'Confirmed' | 'Completed') => void;
  onDeleteInquiry: (id: string) => void;
  onClearInquiries: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onToggleBannerStatus,
  onResetBanners,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onClearInquiries
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'menu' | 'inquiries' | 'export'>('banners');

  // New Banner Form State
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(199);
  const [formOfferPrice, setFormOfferPrice] = useState<number>(149);
  const [formDiscountLabel, setFormDiscountLabel] = useState('25% OFF');
  const [formPromoCode, setFormPromoCode] = useState('');
  const [formImage, setFormImage] = useState('/menu-assets/img_p1_25.png');
  const [formThemeColor, setFormThemeColor] = useState<BannerColorTheme>('terracotta');
  const [formExpiryNote, setFormExpiryNote] = useState('Valid This Weekend');
  const [formCategory, setFormCategory] = useState('Specialty Dish');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');

  if (!isOpen) return null;

  // Handle Image File Upload for Banner
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (typeof uploadEvent.target?.result === 'string') {
        setFormImage(uploadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Banner Form
  const resetBannerForm = () => {
    setFormTitle('');
    setFormSubtitle('');
    setFormItemName('');
    setFormOriginalPrice(199);
    setFormOfferPrice(149);
    setFormDiscountLabel('25% OFF');
    setFormPromoCode('');
    setFormImage('/menu-assets/img_p1_25.png');
    setFormThemeColor('terracotta');
    setFormExpiryNote('Valid This Weekend');
    setFormCategory('Specialty Dish');
    setEditingBannerId(null);
    setIsCreatingBanner(false);
  };

  // Auto-calculate discount label
  const handlePriceChange = (orig: number, offer: number) => {
    setFormOriginalPrice(orig);
    setFormOfferPrice(offer);
    if (orig > offer && orig > 0) {
      const pct = Math.round(((orig - offer) / orig) * 100);
      setFormDiscountLabel(`${pct}% OFF`);
    }
  };

  // Submit Banner Creation or Edit
  const handleSubmitBanner = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formItemName.trim()) {
      alert('Please provide an item name.');
      return;
    }

    if (editingBannerId) {
      onUpdateBanner(editingBannerId, {
        title: formTitle.trim() || formItemName.trim(),
        subtitle: formSubtitle.trim() || 'Specialty Cafe Offer',
        itemName: formItemName.trim(),
        originalPrice: Number(formOriginalPrice),
        offerPrice: Number(formOfferPrice),
        discountLabel: formDiscountLabel.trim() || 'SPECIAL OFFER',
        promoCode: formPromoCode.trim().toUpperCase() || undefined,
        image: formImage,
        themeColor: formThemeColor,
        expiryNote: formExpiryNote.trim() || 'Limited Cafe Offer',
        category: formCategory
      });
    } else {
      onAddBanner({
        title: formTitle.trim() || formItemName.trim(),
        subtitle: formSubtitle.trim() || 'Specialty Cafe Offer',
        itemName: formItemName.trim(),
        originalPrice: Number(formOriginalPrice),
        offerPrice: Number(formOfferPrice),
        discountLabel: formDiscountLabel.trim() || 'SPECIAL OFFER',
        promoCode: formPromoCode.trim().toUpperCase() || undefined,
        image: formImage,
        themeColor: formThemeColor,
        isActive: true,
        expiryNote: formExpiryNote.trim() || 'Limited Cafe Offer',
        category: formCategory
      });
    }

    resetBannerForm();
  };

  const handleEditBannerClick = (b: OfferBanner) => {
    setEditingBannerId(b.id);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormItemName(b.itemName);
    setFormOriginalPrice(b.originalPrice);
    setFormOfferPrice(b.offerPrice);
    setFormDiscountLabel(b.discountLabel);
    setFormPromoCode(b.promoCode || '');
    setFormImage(b.image);
    setFormThemeColor(b.themeColor);
    setFormExpiryNote(b.expiryNote || 'Valid This Weekend');
    setFormCategory(b.category || 'Specialty Dish');
    setIsCreatingBanner(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedMenuCategory === 'all' || p.category === selectedMenuCategory;
    const matchesSearch =
      menuSearch.trim() === '' ||
      p.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2B1B16]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl my-6 bg-[#EDE0CC] border-2 border-amber-900/15 rounded-3xl p-5 sm:p-8 shadow-2xl text-espresso-950 z-10 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-900/15 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-terracotta text-xs font-bold uppercase tracking-wider mb-1">
                <span>Owner Portal</span>
                <span>•</span>
                <span>Sangivalasa, Vizag</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-950">
                Coffee Land Admin Console
              </h2>
              <p className="text-xs sm:text-sm text-coffee-700 mt-0.5">
                Customize rectangular offer banners, edit 150+ menu items, track WhatsApp inquiries & download Excel (.xlsx) reports.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-amber-100 text-espresso-900 border border-amber-900/15 transition-colors shadow-xs"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 shrink-0 border-b border-amber-900/10 scrollbar-none">
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'banners'
                  ? 'bg-terracotta text-white shadow-md'
                  : 'bg-white text-espresso-800 hover:bg-amber-100/60'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Offer Banners ({banners.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'menu'
                  ? 'bg-terracotta text-white shadow-md'
                  : 'bg-white text-espresso-800 hover:bg-amber-100/60'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Food Menu Items ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'inquiries'
                  ? 'bg-terracotta text-white shadow-md'
                  : 'bg-white text-espresso-800 hover:bg-amber-100/60'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'export'
                  ? 'bg-terracotta text-white shadow-md'
                  : 'bg-white text-espresso-800 hover:bg-amber-100/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel Sheets</span>
            </button>
          </div>

          {/* TAB CONTENT (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto py-4 pr-1">
            {/* ======================================================== */}
            {/* TAB 1: OFFER BANNERS MANAGER */}
            {/* ======================================================== */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                {/* Banner Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs">
                  <div>
                    <h3 className="font-serif font-bold text-base text-espresso-950">
                      Customize Rectangular Offer Banners
                    </h3>
                    <p className="text-xs text-coffee-700">
                      Create, edit, or increase the banner count with custom colors, pictures, and discount tags.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onResetBanners}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-espresso-900 text-xs font-semibold border border-amber-300 transition-colors"
                      title="Reset to default banners"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      onClick={() => {
                        resetBannerForm();
                        setIsCreatingBanner(!isCreatingBanner);
                      }}
                      className="px-4 py-2 rounded-xl terracotta-btn text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingBanner ? 'Cancel' : '+ Add New Banner'}</span>
                    </button>
                  </div>
                </div>

                {/* CREATE / EDIT BANNER FORM */}
                {isCreatingBanner && (
                  <form
                    onSubmit={handleSubmitBanner}
                    className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-terracotta/30 shadow-md space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                      <h4 className="font-serif font-bold text-lg text-espresso-950 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-terracotta" />
                        <span>{editingBannerId ? 'Edit Offer Banner' : 'Create New Offer Banner'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={resetBannerForm}
                        className="text-xs text-coffee-600 hover:text-espresso-950"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Banner Title */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Banner Heading / Promo Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Weekend Burger Crave Fest"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Subtitle / Flavor description */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Subtitle / Description
                        </label>
                        <input
                          type="text"
                          value={formSubtitle}
                          onChange={(e) => setFormSubtitle(e.target.value)}
                          placeholder="e.g. Double Grilled Fillet with Gouda Cheese"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Item Name */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formItemName}
                          onChange={(e) => setFormItemName(e.target.value)}
                          placeholder="e.g. Chef's Spl Non-Veg Burger"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Original Price */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={formOriginalPrice}
                          onChange={(e) => handlePriceChange(Number(e.target.value), formOfferPrice)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Offer Price */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Offer Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formOfferPrice}
                          onChange={(e) => handlePriceChange(formOriginalPrice, Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none font-bold text-terracotta"
                        />
                      </div>

                      {/* Discount Tag */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Discount Tag / Pill
                        </label>
                        <input
                          type="text"
                          value={formDiscountLabel}
                          onChange={(e) => setFormDiscountLabel(e.target.value)}
                          placeholder="e.g. 25% OFF, BUY 1 GET 1"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Promo Code */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Promo Code (Optional)
                        </label>
                        <input
                          type="text"
                          value={formPromoCode}
                          onChange={(e) => setFormPromoCode(e.target.value.toUpperCase())}
                          placeholder="e.g. BURGER20"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none uppercase font-mono"
                        />
                      </div>

                      {/* Validity Note */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Validity Note
                        </label>
                        <input
                          type="text"
                          value={formExpiryNote}
                          onChange={(e) => setFormExpiryNote(e.target.value)}
                          placeholder="e.g. Valid Saturday & Sunday"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                        />
                      </div>

                      {/* Banner Color Theme */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Banner Color Theme *
                        </label>
                        <select
                          value={formThemeColor}
                          onChange={(e) => setFormThemeColor(e.target.value as BannerColorTheme)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none capitalize font-semibold"
                        >
                          <option value="terracotta">Terracotta Red (Warm Artisan)</option>
                          <option value="emerald">Emerald Green (Fresh)</option>
                          <option value="amber">Caramel Amber (Golden)</option>
                          <option value="espresso">Royal Espresso (Dark Roast)</option>
                          <option value="crimson">Berry Crimson (Vibrant)</option>
                          <option value="violet">Royal Violet (Luxury)</option>
                          <option value="ocean">Ocean Teal (Cooler)</option>
                        </select>
                      </div>
                    </div>

                    {/* Picture Upload Area */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-espresso-900 mb-1.5">
                        Item Picture (Upload from phone/device or select image)
                      </label>
                      <div className="flex flex-wrap items-center gap-4">
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
                          className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 border-2 border-dashed border-terracotta/40 text-espresso-900 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <Upload className="w-4 h-4 text-terracotta" />
                          <span>Upload Image from Device</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-coffee-600">Preset:</span>
                          {[
                            '/menu-assets/img_p1_25.png',
                            '/menu-assets/img_p1_0.png',
                            '/menu-assets/img_p1_23.png',
                            '/menu-assets/img_p1_31.png',
                            '/menu-assets/img_p1_1.png',
                          ].map((p, idx) => (
                            <img
                              key={idx}
                              src={p}
                              alt="preset"
                              onClick={() => setFormImage(p)}
                              className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                                formImage === p ? 'border-terracotta scale-105' : 'border-transparent'
                              }`}
                            />
                          ))}
                        </div>

                        {formImage && (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-coffee-600">Selected:</span>
                            <img
                              src={formImage}
                              alt="preview"
                              className="w-10 h-10 rounded-xl object-cover border border-terracotta shadow-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Submit Row */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-900/10">
                      <button
                        type="button"
                        onClick={resetBannerForm}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-espresso-900 text-xs font-semibold border border-amber-900/15"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl terracotta-btn text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                      >
                        {editingBannerId ? 'Update Offer Banner' : 'Publish Offer Banner'}
                      </button>
                    </div>
                  </form>
                )}

                {/* LIST OF CURRENT BANNERS */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-700">
                    Active Banners Catalog ({banners.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="p-4 rounded-2xl bg-white border border-amber-900/15 shadow-xs flex items-center justify-between gap-3 hover:border-terracotta/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={banner.image}
                            alt={banner.itemName}
                            className="w-14 h-14 rounded-xl object-cover border border-amber-900/15 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  banner.isActive ? 'bg-emerald-500' : 'bg-neutral-300'
                                }`}
                              />
                              <h5 className="font-serif font-bold text-sm text-espresso-950 truncate">
                                {banner.title}
                              </h5>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-terracotta text-[10px] font-bold shrink-0">
                                {banner.discountLabel}
                              </span>
                            </div>
                            <p className="text-xs text-coffee-700 truncate">
                              {banner.itemName} • <strong className="text-terracotta">₹{banner.offerPrice}</strong> (was ₹{banner.originalPrice})
                            </p>
                            <span className="text-[10px] text-coffee-500 uppercase font-bold tracking-wider">
                              Theme: {banner.themeColor} • {banner.promoCode || 'No Code'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onToggleBannerStatus(banner.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              banner.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {banner.isActive ? 'Active' : 'Hidden'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditBannerClick(banner)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-espresso-800 transition-colors"
                            title="Edit banner"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteBanner(banner.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: FOOD MENU ITEMS MANAGER */}
            {/* ======================================================== */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-900/15">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta" />
                    <input
                      type="text"
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Search menu items..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-terracotta outline-none"
                    />
                  </div>

                  <select
                    value={selectedMenuCategory}
                    onChange={(e) => setSelectedMenuCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 font-medium capitalize"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {uniqueCategories.map((c) => (
                      <option key={c} value={c}>
                        {c.replace('-', ' ')}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => exportMenuToExcel(products)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Menu (.xlsx)</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {filteredProducts.slice(0, 50).map((prod) => {
                    const isEditing = editingProductId === prod.id;

                    return (
                      <div
                        key={prod.id}
                        className="p-3 rounded-xl bg-white border border-amber-900/10 flex items-center justify-between gap-3 hover:border-terracotta/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-amber-900/10 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-1 rounded bg-[#EDE0CC] border border-terracotta text-xs font-bold text-espresso-950 w-full"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    prod.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                  }`}
                                />
                                <h5 className="font-serif font-bold text-xs sm:text-sm text-espresso-950 truncate">
                                  {prod.name}
                                </h5>
                                {prod.badge && (
                                  <span className="px-2 py-0.2 rounded-full bg-amber-100 text-terracotta text-[9px] font-bold">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-[11px] text-coffee-600 truncate mt-0.5">
                              {prod.category} • {prod.description}
                            </p>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold">₹</span>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-16 px-1.5 py-1 rounded bg-[#EDE0CC] border border-terracotta text-xs font-bold"
                              />
                              <button
                                onClick={() => {
                                  if (onUpdateProduct) {
                                    onUpdateProduct(prod.id, {
                                      name: editName,
                                      price: editPrice
                                    });
                                  }
                                  setEditingProductId(null);
                                }}
                                className="p-1 rounded bg-emerald-600 text-white"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-display font-bold text-base text-terracotta">
                              ₹{prod.price}
                            </span>
                          )}

                          {!isEditing && (
                            <button
                              onClick={() => {
                                setEditingProductId(prod.id);
                                setEditName(prod.name);
                                setEditPrice(prod.price);
                              }}
                              className="p-1 rounded text-espresso-600 hover:text-terracotta"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: WHATSAPP CUSTOMER INQUIRIES & ORDERS LOG */}
            {/* ======================================================== */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-900/15">
                  <div>
                    <h3 className="font-serif font-bold text-base text-espresso-950">
                      Customer WhatsApp Interactions ({inquiries.length})
                    </h3>
                    <p className="text-xs text-coffee-700">
                      Logged whenever guests click "Order / Inquire on WhatsApp" about offer banners or dishes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportInquiriesToExcel(inquiries)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Excel (.xlsx)</span>
                    </button>

                    {inquiries.length > 0 && (
                      <button
                        onClick={onClearInquiries}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold"
                      >
                        Clear Log
                      </button>
                    )}
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-amber-900/10">
                    <MessageCircle className="w-10 h-10 text-coffee-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-espresso-950">No customer WhatsApp inquiries logged yet</p>
                    <p className="text-xs text-coffee-600">Whenever visitors click "Claim on WhatsApp", inquiries will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-white border border-amber-900/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-sm text-espresso-950">
                              {inq.customerName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-terracotta text-[10px] font-bold">
                              {inq.inquiryType}
                            </span>
                            <span className="text-[11px] text-coffee-500">
                              {new Date(inq.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-terracotta mt-1">
                            {inq.itemName} • ₹{inq.price} {inq.promoCode && `(Code: ${inq.promoCode})`}
                          </p>

                          <p className="text-xs text-coffee-800 bg-[#EDE0CC] p-2 rounded-xl mt-1.5 border border-amber-900/10">
                            "{inq.message}"
                          </p>
                        </div>

                        {/* Status Toggle & WhatsApp Direct */}
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={inq.status}
                            onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold"
                          >
                            <option value="Inquired">Inquired</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <a
                            href={`https://wa.me/919542525665?text=${encodeURIComponent(`Hi ${inq.customerName}, following up regarding your Coffee Land inquiry for ${inq.itemName}!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-white" />
                          </a>

                          <button
                            onClick={() => onDeleteInquiry(inq.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: EXPORT DATA TO EXCEL (.XLSX) */}
            {/* ======================================================== */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-amber-900/15 shadow-xs mb-4">
                  <h3 className="font-serif font-bold text-lg text-espresso-950 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span>Download Cafe Data in Excel (.xlsx) Format</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-coffee-700 mt-1">
                    Export your live records directly into Microsoft Excel spreadsheets with full columns, prices, dates, and order notes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Inquiries Sheet */}
                  <div className="p-5 rounded-3xl bg-white border border-amber-900/15 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                        <MessageCircle className="w-5 h-5 fill-emerald-700" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-espresso-950">
                        WhatsApp Inquiries & Orders
                      </h4>
                      <p className="text-xs text-coffee-700 mt-1">
                        Includes customer name, phone, item inquired, price, promo code, and full chat timestamp.
                      </p>
                      <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {inquiries.length} Records Ready
                      </span>
                    </div>

                    <button
                      onClick={() => exportInquiriesToExcel(inquiries)}
                      className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-102"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Inquiries (.xlsx)</span>
                    </button>
                  </div>

                  {/* Card 2: Banners Sheet */}
                  <div className="p-5 rounded-3xl bg-white border border-amber-900/15 shadow-sm flex flex-col justify-between hover:border-terracotta transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-terracotta flex items-center justify-center mb-3">
                        <Gift className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-espresso-950">
                        Offer Banners & Deals
                      </h4>
                      <p className="text-xs text-coffee-700 mt-1">
                        Exports all active rectangular offer banners, prices, discounts, promo codes, and validity.
                      </p>
                      <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-amber-50 text-terracotta font-bold text-[10px]">
                        {banners.length} Banners Configured
                      </span>
                    </div>

                    <button
                      onClick={() => exportBannersToExcel(banners)}
                      className="mt-5 w-full py-2.5 rounded-xl terracotta-btn text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-102"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Banners (.xlsx)</span>
                    </button>
                  </div>

                  {/* Card 3: Food Menu Catalog */}
                  <div className="p-5 rounded-3xl bg-white border border-amber-900/15 shadow-sm flex flex-col justify-between hover:border-coffee-600 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-coffee-100 text-coffee-800 flex items-center justify-center mb-3">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-espresso-950">
                        Complete Food Menu Catalog
                      </h4>
                      <p className="text-xs text-coffee-700 mt-1">
                        Full 150+ item database from coffelandmenu.pdf including categories, veg/non-veg tags, and prices.
                      </p>
                      <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-coffee-50 text-coffee-800 font-bold text-[10px]">
                        {products.length} Handcrafted Items
                      </span>
                    </div>

                    <button
                      onClick={() => exportMenuToExcel(products)}
                      className="mt-5 w-full py-2.5 rounded-xl bg-espresso-900 hover:bg-espresso-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-102"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Menu (.xlsx)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
