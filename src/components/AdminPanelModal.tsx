import React, { useState, useRef, useEffect } from 'react';
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
  Palette,
  Sparkles,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { OfferBanner, BillboardBanner, BillboardDesignTheme, BannerColorTheme, WhatsAppInquiry } from '../types/banner';
import { Product } from '../types/product';
import {
  exportInquiriesToExcel,
  exportBannersToExcel,
  exportMenuToExcel
} from '../services/excelExport';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  billboardBanners?: BillboardBanner[];
  onAddBillboardBanner?: (banner: Omit<BillboardBanner, 'id'>) => void;
  onUpdateBillboardBanner?: (id: string, updatedFields: Partial<BillboardBanner>) => void;
  onDeleteBillboardBanner?: (id: string) => void;
  onToggleBillboardBannerStatus?: (id: string) => void;
  onResetBillboardBanners?: () => void;
  banners?: OfferBanner[];
  onAddBanner?: (banner: Omit<OfferBanner, 'id'>) => void;
  onUpdateBanner?: (id: string, updatedFields: Partial<OfferBanner>) => void;
  onDeleteBanner?: (id: string) => void;
  onToggleBannerStatus?: (id: string) => void;
  onResetBanners?: () => void;
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
  billboardBanners = [],
  onAddBillboardBanner,
  onUpdateBillboardBanner,
  onDeleteBillboardBanner,
  onToggleBillboardBannerStatus,
  onResetBillboardBanners,
  banners = [],
  onAddBanner = () => {},
  onUpdateBanner = () => {},
  onDeleteBanner = () => {},
  onToggleBannerStatus = () => {},
  onResetBanners = () => {},
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

  // Billboard Banner State
  const activeBillboard = billboardBanners.find((b) => b.isActive) || billboardBanners[0];
  const [editingBillboardId, setEditingBillboardId] = useState<string | null>(null);
  const [isCreatingBillboard, setIsCreatingBillboard] = useState(false);

  const [bbDesignTheme, setBbDesignTheme] = useState<BillboardDesignTheme>('white-brick');
  const [bbFoodName, setBbFoodName] = useState('Pizza');
  const [bbHighlightText, setBbHighlightText] = useState('SUPER');
  const [bbScriptText, setBbScriptText] = useState('Delicious');
  const [bbMenuTag, setBbMenuTag] = useState('MENU');
  const [bbLimitedOfferTag, setBbLimitedOfferTag] = useState('LIMITED OFFER');
  const [bbDiscountBadgeText, setBbDiscountBadgeText] = useState('50% OFF');
  const [bbDiscountBadgeSub, setBbDiscountBadgeSub] = useState('Get Up To');
  const [bbDeliveryNote, setBbDeliveryNote] = useState('Free Home Delivery');
  const [bbPhone, setBbPhone] = useState('323-517-4946');
  const [bbWebsiteUrl, setBbWebsiteUrl] = useState('WWW.COFFEELAND.IN');
  const [bbButtonText, setBbButtonText] = useState('ORDER NOW');
  const [bbImage, setBbImage] = useState('/banners/pizza_board.jpg');
  const [bbOriginalPrice, setBbOriginalPrice] = useState<number>(399);
  const [bbOfferPrice, setBbOfferPrice] = useState<number>(199);
  const billboardFileInputRef = useRef<HTMLInputElement>(null);

  // Sync form state when active billboard loads
  useEffect(() => {
    if (activeBillboard && !editingBillboardId) {
      setBbDesignTheme(activeBillboard.designTheme || 'white-brick');
      setBbFoodName(activeBillboard.foodName || 'Pizza');
      setBbHighlightText(activeBillboard.highlightText || 'SUPER');
      setBbScriptText(activeBillboard.scriptText || 'Delicious');
      setBbMenuTag(activeBillboard.menuTag || 'MENU');
      setBbLimitedOfferTag(activeBillboard.limitedOfferTag || 'LIMITED OFFER');
      setBbDiscountBadgeText(activeBillboard.discountBadgeText || '50% OFF');
      setBbDiscountBadgeSub(activeBillboard.discountBadgeSub || 'Get Up To');
      setBbDeliveryNote(activeBillboard.deliveryNote || 'Free Home Delivery');
      setBbPhone(activeBillboard.phone || '323-517-4946');
      setBbWebsiteUrl(activeBillboard.websiteUrl || 'WWW.COFFEELAND.IN');
      setBbButtonText(activeBillboard.buttonText || 'ORDER NOW');
      setBbImage(activeBillboard.image || '/banners/pizza_board.jpg');
      setBbOriginalPrice(activeBillboard.originalPrice || 399);
      setBbOfferPrice(activeBillboard.offerPrice || 199);
    }
  }, [activeBillboard, editingBillboardId]);

  const handleBillboardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (typeof uploadEvent.target?.result === 'string') {
        setBbImage(uploadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditBillboardClick = (b: BillboardBanner) => {
    setEditingBillboardId(b.id);
    setBbDesignTheme(b.designTheme || 'white-brick');
    setBbFoodName(b.foodName);
    setBbHighlightText(b.highlightText);
    setBbScriptText(b.scriptText);
    setBbMenuTag(b.menuTag);
    setBbLimitedOfferTag(b.limitedOfferTag);
    setBbDiscountBadgeText(b.discountBadgeText);
    setBbDiscountBadgeSub(b.discountBadgeSub);
    setBbDeliveryNote(b.deliveryNote);
    setBbPhone(b.phone);
    setBbWebsiteUrl(b.websiteUrl);
    setBbButtonText(b.buttonText);
    setBbImage(b.image);
    setBbOriginalPrice(b.originalPrice || 399);
    setBbOfferPrice(b.offerPrice || 199);
    setIsCreatingBillboard(true);
  };

  const resetBillboardForm = () => {
    setBbDesignTheme('white-brick');
    setBbFoodName('Pizza');
    setBbHighlightText('SUPER');
    setBbScriptText('Delicious');
    setBbMenuTag('MENU');
    setBbLimitedOfferTag('LIMITED OFFER');
    setBbDiscountBadgeText('50% OFF');
    setBbDiscountBadgeSub('Get Up To');
    setBbDeliveryNote('Free Home Delivery');
    setBbPhone('323-517-4946');
    setBbWebsiteUrl('WWW.COFFEELAND.IN');
    setBbButtonText('ORDER NOW');
    setBbImage('/banners/pizza_board.jpg');
    setBbOriginalPrice(399);
    setBbOfferPrice(199);
    setEditingBillboardId(null);
    setIsCreatingBillboard(false);
  };

  const handleSubmitBillboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bbFoodName.trim()) {
      alert('Please specify a food item name.');
      return;
    }

    const targetId = editingBillboardId || activeBillboard?.id || 'billboard-1';

    if (editingBillboardId || activeBillboard) {
      onUpdateBillboardBanner?.(targetId, {
        designTheme: bbDesignTheme,
        foodName: bbFoodName.trim(),
        highlightText: bbHighlightText.trim() || 'SUPER',
        scriptText: bbScriptText.trim() || 'Delicious',
        menuTag: bbMenuTag.trim() || 'MENU',
        limitedOfferTag: bbLimitedOfferTag.trim() || 'LIMITED OFFER',
        discountBadgeText: bbDiscountBadgeText.trim() || '50% OFF',
        discountBadgeSub: bbDiscountBadgeSub.trim() || 'Get Up To',
        deliveryNote: bbDeliveryNote.trim() || 'Free Home Delivery',
        phone: bbPhone.trim() || '+91 95425 25665',
        websiteUrl: bbWebsiteUrl.trim() || 'WWW.COFFEELAND.IN',
        buttonText: bbButtonText.trim() || 'ORDER NOW',
        image: bbImage || '/banners/pizza_board.jpg',
        originalPrice: Number(bbOriginalPrice),
        offerPrice: Number(bbOfferPrice),
        isActive: true
      });
      alert('Billboard Banner updated successfully!');
    } else {
      onAddBillboardBanner?.({
        designTheme: bbDesignTheme,
        foodName: bbFoodName.trim(),
        highlightText: bbHighlightText.trim() || 'SUPER',
        scriptText: bbScriptText.trim() || 'Delicious',
        menuTag: bbMenuTag.trim() || 'MENU',
        limitedOfferTag: bbLimitedOfferTag.trim() || 'LIMITED OFFER',
        discountBadgeText: bbDiscountBadgeText.trim() || '50% OFF',
        discountBadgeSub: bbDiscountBadgeSub.trim() || 'Get Up To',
        deliveryNote: bbDeliveryNote.trim() || 'Free Home Delivery',
        phone: bbPhone.trim() || '+91 95425 25665',
        websiteUrl: bbWebsiteUrl.trim() || 'WWW.COFFEELAND.IN',
        buttonText: bbButtonText.trim() || 'ORDER NOW',
        image: bbImage || '/banners/pizza_board.jpg',
        isActive: true,
        originalPrice: Number(bbOriginalPrice),
        offerPrice: Number(bbOfferPrice)
      });
      alert('New Billboard Banner published successfully!');
    }

    setIsCreatingBillboard(false);
  };

  // Legacy Banner Form State
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
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-espresso-800 hover:bg-amber-100/60'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Featured Billboard Banner ({billboardBanners.length})</span>
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
            {/* TAB 1: FEATURED BILLBOARD PROMO BANNER STUDIO (3 THEMES) */}
            {/* ======================================================== */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                {/* Actions & Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="font-serif font-bold text-base text-espresso-950">
                        Featured Billboard Promo Banner Studio
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        {billboardBanners.filter((b) => b.isActive).length} of {billboardBanners.length} Active in Autoscroll
                      </span>
                    </div>
                    <p className="text-xs text-coffee-700">
                      Manage all 3 reference designs (White Brick Pizza, Burgundy Wave Burger, Midnight Navy Torn Pizza) with auto-scroll on the homepage. Change food pictures, offers, names, and contact details with real-time live preview.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetBillboardBanners?.();
                        resetBillboardForm();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-espresso-900 text-xs font-semibold border border-amber-300 transition-colors flex items-center gap-1.5"
                      title="Reset all 3 banners to reference mockups"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-terracotta" />
                      <span>Reset All 3 Reference Banners</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resetBillboardForm();
                        setIsCreatingBillboard(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add New Banner</span>
                    </button>
                  </div>
                </div>

                {/* QUICK SELECTOR: CHOOSE WHICH BANNER TO EDIT */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-amber-900/15 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-coffee-700">
                    Select Banner to Edit:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {billboardBanners.map((bb, idx) => (
                      <button
                        key={bb.id}
                        type="button"
                        onClick={() => handleEditBillboardClick(bb)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          editingBillboardId === bb.id || (!editingBillboardId && idx === 0)
                            ? 'bg-red-600 text-white border-red-600 shadow-xs scale-102'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${bb.isActive ? 'bg-emerald-400' : 'bg-neutral-400'}`} />
                        <span>Banner {idx + 1}: {bb.foodName}</span>
                        <span className="opacity-75 text-[10px] font-normal">
                          ({bb.designTheme === 'burgundy-wave' ? 'Burgundy Wave' : bb.designTheme === 'navy-torn' ? 'Navy Torn' : 'White Brick'})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* INTERACTIVE REAL-TIME LIVE BILLBOARD PREVIEW */}
                {/* ======================================================== */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-red-500/20 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-xs uppercase tracking-wider text-espresso-950">
                        Live Preview ({bbDesignTheme === 'burgundy-wave' ? 'Burgundy Wave Burger' : bbDesignTheme === 'navy-torn' ? 'Navy Torn Paper Pizza' : 'White Brick Pizza'})
                      </span>
                    </div>
                    <span className="text-[11px] text-coffee-600 font-medium">
                      Changes below update this preview in real time
                    </span>
                  </div>

                  {/* DYNAMIC THEME PREVIEW CONTAINER (BORDERLESS) */}
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-lg select-none">
                    {/* THEME 1 PREVIEW: WHITE BRICK */}
                    {bbDesignTheme === 'white-brick' && (
                      <div
                        className="relative w-full p-5 sm:p-7 overflow-hidden"
                        style={{
                          backgroundImage: `url('/banners/white_brick_wall.jpg')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/40 pointer-events-none" />

                        {/* Top-Right Logo */}
                        <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 text-red-600 pointer-events-none">
                          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <Utensils className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-sans font-black text-[9px] tracking-widest text-red-600 uppercase">
                            COFFEE LAND
                          </span>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                          <div className="md:col-span-7 flex flex-col items-start space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-black text-[10px] tracking-widest uppercase text-neutral-900 bg-neutral-100/90 px-1.5 py-0.5 rounded">
                                {bbHighlightText || 'SUPER'}
                              </span>
                              <span
                                className="text-xl sm:text-2xl text-red-600 font-bold italic -rotate-2"
                                style={{ fontFamily: "'Kaushan Script', cursive" }}
                              >
                                {bbScriptText || 'Delicious'}
                              </span>
                            </div>

                            <h2
                              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1A1A1A] tracking-tight leading-none"
                              style={{ fontFamily: "'Permanent Marker', cursive" }}
                            >
                              {bbFoodName || 'Pizza'}
                            </h2>

                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="font-sans font-black text-xl sm:text-2xl text-red-600 tracking-wider">
                                {bbMenuTag || 'MENU'}
                              </span>
                              <span className="font-sans font-black text-[10px] sm:text-xs text-neutral-900 tracking-widest uppercase">
                                {bbLimitedOfferTag || 'LIMITED OFFER'}
                              </span>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-3">
                              <span className="px-4 py-1.5 rounded-full bg-[#E52525] text-white font-black text-[11px] tracking-wider uppercase shadow-xs">
                                {bbButtonText || 'ORDER NOW'}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-sans font-black text-xs sm:text-sm text-neutral-950 tracking-wider">
                                  ☎ {bbPhone || '323-517-4946'}
                                </span>
                                <span className="text-[9px] text-red-600 font-bold tracking-widest uppercase">
                                  {bbWebsiteUrl || 'WWW.COFFEELAND.IN'}
                                </span>
                              </div>
                            </div>

                            <div className="pt-1 flex items-center gap-1.5">
                              <span
                                className="text-base text-neutral-800 font-bold -rotate-2"
                                style={{ fontFamily: "'Caveat', cursive" }}
                              >
                                {bbDeliveryNote || 'Free Home Delivery'}
                              </span>
                              <svg viewBox="0 0 60 40" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" className="w-8 h-5 text-neutral-800 -rotate-6">
                                <path d="M 10 30 Q 32 28 44 12" />
                                <path d="M 34 12 L 44 12 L 42 22" />
                              </svg>
                            </div>
                          </div>

                          <div className="md:col-span-5 relative flex items-center justify-center">
                            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                              <img
                                src={bbImage || '/banners/pizza_board.png'}
                                alt={bbFoodName}
                                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/banners/pizza_board.png';
                                }}
                              />
                              <div className="absolute top-0 right-0 z-20">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center text-center p-1">
                                  <svg viewBox="0 0 120 120" fill="none" stroke="#1A1A1A" strokeWidth="2" className="absolute inset-0 w-full h-full pointer-events-none">
                                    <circle cx="60" cy="60" r="52" strokeDasharray="140 10 100 8" transform="rotate(-15 60 60)" />
                                    <circle cx="60" cy="60" r="46" strokeWidth="1.2" strokeDasharray="120 8 80 12" transform="rotate(25 60 60)" />
                                  </svg>
                                  <span className="relative z-10 text-[10px] font-bold text-neutral-800 -rotate-2 leading-none" style={{ fontFamily: "'Caveat', cursive" }}>
                                    {bbDiscountBadgeSub || 'Get Up To'}
                                  </span>
                                  <span className="relative z-10 font-sans font-black text-lg sm:text-2xl text-red-600 leading-tight">
                                    {bbDiscountBadgeText || '50% OFF'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* THEME 2 PREVIEW: BURGUNDY & YELLOW WAVE */}
                    {bbDesignTheme === 'burgundy-wave' && (
                      <div className="relative w-full p-5 sm:p-7 overflow-hidden bg-gradient-to-br from-[#2E070F] via-[#3E0A14] to-[#4F0D1B]">
                        <svg viewBox="0 0 1000 450" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                          <path d="M 260 450 C 400 390 440 270 590 240 C 760 210 880 230 1000 130 L 1000 450 Z" fill="#F59E0B" />
                        </svg>

                        {/* Top Left Logo */}
                        <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 pointer-events-none">
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[#2E070F]">
                            <Utensils className="w-3 h-3" />
                          </div>
                          <span className="font-sans font-black text-[9px] tracking-widest text-white uppercase">
                            COFFEE LAND
                          </span>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                          <div className="md:col-span-7 flex flex-col items-start space-y-1.5 pt-4">
                            <span
                              className="text-2xl sm:text-3xl text-[#FBBF24] font-bold italic -rotate-2 select-none"
                              style={{ fontFamily: "'Kaushan Script', cursive" }}
                            >
                              {bbScriptText || 'Special fresh'}
                            </span>

                            <h2
                              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none filter drop-shadow-md"
                              style={{ fontFamily: "'Permanent Marker', cursive" }}
                            >
                              {bbFoodName || 'Burger'}
                            </h2>

                            <span className="font-sans font-bold text-xs text-white tracking-wider">
                              <span className="text-amber-400 font-black">P :</span> {bbPhone || '0123 456 7890'}
                            </span>

                            <div className="pt-2 flex items-center gap-4">
                              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex flex-col items-center justify-center text-center">
                                <svg viewBox="0 0 120 120" fill="none" stroke="#FFFFFF" strokeWidth="2" className="absolute inset-0 w-full h-full pointer-events-none">
                                  <circle cx="60" cy="60" r="50" strokeDasharray="140 10 90 12" />
                                </svg>
                                <span className="text-[10px] text-white font-bold leading-none" style={{ fontFamily: "'Caveat', cursive" }}>
                                  {bbDiscountBadgeSub || 'Only'}
                                </span>
                                <span className="font-sans font-black text-base sm:text-xl text-white">
                                  {bbDiscountBadgeText || '10 $'}
                                </span>
                              </div>

                              <span className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white font-black text-[11px] uppercase border border-white/20">
                                {bbButtonText || 'ORDER NOW'}
                              </span>
                            </div>
                          </div>

                          <div className="md:col-span-5 relative flex items-center justify-center">
                            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                              <img
                                src={bbImage || '/banners/burger_double.png'}
                                alt={bbFoodName}
                                className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/banners/burger_double.png';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* THEME 3 PREVIEW: MIDNIGHT NAVY & TORN PAPER */}
                    {bbDesignTheme === 'navy-torn' && (
                      <div className="relative w-full p-5 sm:p-7 overflow-hidden bg-[#0B1A30]">
                        <svg viewBox="0 0 1000 450" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                          <path
                            d="M 520 450 L 540 420 L 530 390 L 550 360 L 540 330 L 570 300 L 560 270 L 590 240 L 580 200 L 610 170 L 600 130 L 630 100 L 620 60 L 650 30 L 640 0 L 1000 0 L 1000 450 Z"
                            fill="#FFFFFF"
                          />
                          <path
                            d="M 535 450 L 555 420 L 545 390 L 565 360 L 555 330 L 585 300 L 575 270 L 605 240 L 595 200 L 625 170 L 615 130 L 645 100 L 635 60 L 665 30 L 655 0 L 1000 0 L 1000 450 Z"
                            fill="#F59E0B"
                          />
                        </svg>

                        {/* Top Left Logo */}
                        <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 pointer-events-none">
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[#0B1A30]">
                            <Utensils className="w-3 h-3" />
                          </div>
                          <span className="font-sans font-black text-[9px] tracking-widest text-white uppercase">
                            COFFEE LAND
                          </span>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                          <div className="md:col-span-7 flex flex-col items-start space-y-1.5 pt-4">
                            <span
                              className="text-2xl sm:text-3xl text-white font-bold italic -rotate-2 select-none"
                              style={{ fontFamily: "'Kaushan Script', cursive" }}
                            >
                              {bbScriptText || "Today's Special"}
                            </span>

                            <h2
                              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#FBBF24] tracking-wider leading-none"
                              style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif" }}
                            >
                              {bbFoodName || 'PIZZA'}
                            </h2>
                            <div className="w-36 h-1.5 bg-[#FBBF24] rounded-full" />

                            <span className="inline-block px-3 py-0.5 rounded-full bg-black/80 text-white font-sans font-black text-[10px] tracking-widest uppercase border border-white/20 mt-1">
                              {bbLimitedOfferTag || 'LIMITED TIME OFFER'}
                            </span>

                            <div className="pt-2 flex flex-col">
                              <span className="text-[9px] font-bold text-amber-300 uppercase">
                                {bbDeliveryNote || 'FREE DELIVERY'}
                              </span>
                              <span className="font-sans font-black text-sm text-white">
                                {bbPhone || '8568 0269 5476'}
                              </span>
                            </div>

                            <div className="pt-1">
                              <div className="relative w-24 h-12 flex flex-col items-center justify-center text-center">
                                <svg viewBox="0 0 140 80" fill="none" stroke="#FFFFFF" strokeWidth="2" className="absolute inset-0 w-full h-full pointer-events-none">
                                  <ellipse cx="70" cy="40" rx="60" ry="32" strokeDasharray="180 12 120 10" />
                                </svg>
                                <span className="text-[10px] text-white font-bold leading-none" style={{ fontFamily: "'Caveat', cursive" }}>
                                  {bbDiscountBadgeSub || 'Price'}
                                </span>
                                <span className="font-sans font-black text-base text-[#FBBF24]">
                                  {bbDiscountBadgeText || '15 $'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-5 relative flex items-center justify-center">
                            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                              <img
                                src={bbImage || '/banners/pizza_pan.png'}
                                alt={bbFoodName}
                                className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/banners/pizza_pan.png';
                                }}
                              />
                              <div className="absolute bottom-1 right-1 z-20">
                                <span className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white font-black text-[10px] uppercase border border-white/30">
                                  {bbButtonText || 'ORDER NOW'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* BILLBOARD BANNER CONTROLS FORM */}
                {/* ======================================================== */}
                <form
                  onSubmit={handleSubmitBillboard}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-900/15 shadow-md space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-600" />
                      <h4 className="font-serif font-bold text-lg text-espresso-950">
                        {editingBillboardId ? `Edit Banner Variant (${bbFoodName})` : 'Configure Banner Variant'}
                      </h4>
                    </div>
                    {editingBillboardId && (
                      <button
                        type="button"
                        onClick={resetBillboardForm}
                        className="text-xs text-coffee-600 hover:text-espresso-950 underline"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {/* DESIGN THEME PICKER */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-red-600 mb-2">
                      Select Design Layout (Matches Exact Reference Pictures) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBbDesignTheme('white-brick');
                          if (!editingBillboardId) {
                            setBbFoodName('Pizza');
                            setBbImage('/banners/pizza_board.png');
                            setBbScriptText('Delicious');
                            setBbHighlightText('SUPER');
                            setBbDiscountBadgeText('50% OFF');
                            setBbDiscountBadgeSub('Get Up To');
                            setBbPhone('323-517-4946');
                            setBbDeliveryNote('Free Home Delivery');
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          bbDesignTheme === 'white-brick'
                            ? 'border-red-600 bg-red-50/60 ring-2 ring-red-100'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <span className="font-bold text-xs text-neutral-900 block">🧱 White Brick Wall</span>
                        <span className="text-[11px] text-coffee-600 block mt-0.5">
                          Super Delicious Pizza, Wood Paddle Board & 50% OFF
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBbDesignTheme('burgundy-wave');
                          if (!editingBillboardId) {
                            setBbFoodName('Burger');
                            setBbImage('/banners/burger_double.png');
                            setBbScriptText('Special fresh');
                            setBbHighlightText('FRESH');
                            setBbDiscountBadgeText('10 $');
                            setBbDiscountBadgeSub('Only');
                            setBbPhone('0123 456 7890');
                            setBbDeliveryNote('Hot & Juicy Double Patty');
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          bbDesignTheme === 'burgundy-wave'
                            ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-100'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <span className="font-bold text-xs text-neutral-900 block">🍔 Burgundy Wave</span>
                        <span className="text-[11px] text-coffee-600 block mt-0.5">
                          Special Fresh Burger, Yellow Curve & Only 10 $
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBbDesignTheme('navy-torn');
                          if (!editingBillboardId) {
                            setBbFoodName('PIZZA');
                            setBbImage('/banners/pizza_pan.png');
                            setBbScriptText("Today's Special");
                            setBbHighlightText("TODAY'S");
                            setBbDiscountBadgeText('15 $');
                            setBbDiscountBadgeSub('Price');
                            setBbPhone('8568 0269 5476');
                            setBbDeliveryNote('FREE DELIVERY');
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          bbDesignTheme === 'navy-torn'
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <span className="font-bold text-xs text-neutral-900 block">🍕 Midnight Navy Torn Paper</span>
                        <span className="text-[11px] text-coffee-600 block mt-0.5">
                          Today's Special PIZZA, Round Pan & Price 15 $
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION 1: FOOD ITEM & NAME */}
                  <div className="pt-2 border-t border-amber-900/10">
                    <h5 className="text-xs font-black uppercase tracking-wider text-red-600 mb-2.5 flex items-center gap-1.5">
                      <span>1. Food Item Name & Typography</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Food Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Food Item Name (Large Brush Title) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bbFoodName}
                          onChange={(e) => setBbFoodName(e.target.value)}
                          placeholder="e.g. Pizza, Burger, PIZZA, Kunafa"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-sm font-bold text-espresso-950 focus:border-red-600 outline-none"
                        />

                        {/* Quick food name presets */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          <span className="text-[11px] text-coffee-600 font-semibold">Load Exact Reference:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setBbDesignTheme('white-brick');
                              setBbFoodName('Pizza');
                              setBbImage('/banners/pizza_board.png');
                              setBbScriptText('Delicious');
                              setBbHighlightText('SUPER');
                              setBbDiscountBadgeText('50% OFF');
                              setBbDiscountBadgeSub('Get Up To');
                              setBbPhone('323-517-4946');
                              setBbDeliveryNote('Free Home Delivery');
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-espresso-900 border border-neutral-300 hover:bg-neutral-100"
                          >
                            Ref 1: Pizza 50% OFF
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBbDesignTheme('burgundy-wave');
                              setBbFoodName('Burger');
                              setBbImage('/banners/burger_double.png');
                              setBbScriptText('Special fresh');
                              setBbHighlightText('FRESH');
                              setBbDiscountBadgeText('10 $');
                              setBbDiscountBadgeSub('Only');
                              setBbPhone('0123 456 7890');
                              setBbDeliveryNote('Hot & Juicy Double Patty');
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-espresso-900 border border-neutral-300 hover:bg-neutral-100"
                          >
                            Ref 2: Fresh Burger 10$
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBbDesignTheme('navy-torn');
                              setBbFoodName('PIZZA');
                              setBbImage('/banners/pizza_pan.png');
                              setBbScriptText("Today's Special");
                              setBbHighlightText("TODAY'S");
                              setBbDiscountBadgeText('15 $');
                              setBbDiscountBadgeSub('Price');
                              setBbPhone('8568 0269 5476');
                              setBbDeliveryNote('FREE DELIVERY');
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-espresso-900 border border-neutral-300 hover:bg-neutral-100"
                          >
                            Ref 3: Today's Pizza 15$
                          </button>
                        </div>
                      </div>

                      {/* Script cursive word */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Cursive Script Word
                        </label>
                        <input
                          type="text"
                          value={bbScriptText}
                          onChange={(e) => setBbScriptText(e.target.value)}
                          placeholder="e.g. Delicious, Special fresh, Today's Special"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-semibold text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      {/* Highlight Prefix Tag */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Highlight Tag (Top Box)
                        </label>
                        <input
                          type="text"
                          value={bbHighlightText}
                          onChange={(e) => setBbHighlightText(e.target.value)}
                          placeholder="e.g. SUPER, FRESH, TODAY'S"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-espresso-950 focus:border-red-600 outline-none uppercase"
                        />
                      </div>

                      {/* Menu Tag */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Sub-Tag 1
                        </label>
                        <input
                          type="text"
                          value={bbMenuTag}
                          onChange={(e) => setBbMenuTag(e.target.value)}
                          placeholder="e.g. MENU, SPECIAL"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-espresso-950 focus:border-red-600 outline-none uppercase"
                        />
                      </div>

                      {/* Limited Offer Tag */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Sub-Tag 2
                        </label>
                        <input
                          type="text"
                          value={bbLimitedOfferTag}
                          onChange={(e) => setBbLimitedOfferTag(e.target.value)}
                          placeholder="e.g. LIMITED OFFER, LIMITED TIME OFFER"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-espresso-950 focus:border-red-600 outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: OFFER & DISCOUNT BADGE */}
                  <div className="pt-2 border-t border-amber-900/10">
                    <h5 className="text-xs font-black uppercase tracking-wider text-red-600 mb-2.5 flex items-center gap-1.5">
                      <span>2. Offer & Discount Badge</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* Main Discount Text */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Badge Offer Text *
                        </label>
                        <input
                          type="text"
                          required
                          value={bbDiscountBadgeText}
                          onChange={(e) => setBbDiscountBadgeText(e.target.value)}
                          placeholder="e.g. 50% OFF, 10 $, 15 $, BUY 1 GET 1"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-black text-red-600 focus:border-red-600 outline-none uppercase"
                        />
                      </div>

                      {/* Badge Subtitle */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Badge Subtitle (Script)
                        </label>
                        <input
                          type="text"
                          value={bbDiscountBadgeSub}
                          onChange={(e) => setBbDiscountBadgeSub(e.target.value)}
                          placeholder="e.g. Get Up To, Only, Price"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-semibold text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      {/* Original Price */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          value={bbOriginalPrice}
                          onChange={(e) => setBbOriginalPrice(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      {/* Offer Price */}
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Offer Price (₹)
                        </label>
                        <input
                          type="number"
                          value={bbOfferPrice}
                          onChange={(e) => setBbOfferPrice(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-terracotta focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: FOOD ITEM PICTURE UPLOADER */}
                  <div className="pt-2 border-t border-amber-900/10">
                    <h5 className="text-xs font-black uppercase tracking-wider text-red-600 mb-2.5 flex items-center gap-1.5">
                      <span>3. Food Item Picture</span>
                    </h5>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={billboardFileInputRef}
                        onChange={handleBillboardImageUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => billboardFileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 border-2 border-dashed border-red-500/50 text-espresso-900 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <Upload className="w-4 h-4 text-red-600" />
                        <span>Upload Custom Photo</span>
                      </button>

                      {/* Image URL input */}
                      <div className="flex-1 min-w-[220px]">
                        <input
                          type="text"
                          value={bbImage}
                          onChange={(e) => setBbImage(e.target.value)}
                          placeholder="Paste image URL..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      {bbImage && (
                        <img
                          src={bbImage}
                          alt="Selected Food"
                          className="w-12 h-12 rounded-xl object-contain bg-neutral-100 border border-neutral-300 shadow-xs"
                        />
                      )}
                    </div>

                    {/* Presets Gallery */}
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                      <span className="text-[11px] text-coffee-600 font-bold shrink-0">Exact Presets:</span>
                      {[
                        { name: 'Ref 1: Pizza Board', url: '/banners/pizza_board.png' },
                        { name: 'Ref 2: Double Burger', url: '/banners/burger_double.png' },
                        { name: 'Ref 3: Pizza in Pan', url: '/banners/pizza_pan.png' },
                        { name: 'Lotus Kunafa', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9588?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Crispy Chicken', url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Chocolate Brownie', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => setBbImage(item.url)}
                          className={`relative cursor-pointer rounded-xl p-1 border-2 transition-all shrink-0 flex items-center gap-1.5 ${
                            bbImage === item.url ? 'border-red-600 bg-red-50' : 'border-neutral-200 bg-white hover:border-neutral-400'
                          }`}
                          title={item.name}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-contain bg-neutral-100"
                          />
                          <span className="text-[10px] font-bold text-neutral-800 pr-1 max-w-[100px] truncate">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: CONTACT & DELIVERY NOTE */}
                  <div className="pt-2 border-t border-amber-900/10">
                    <h5 className="text-xs font-black uppercase tracking-wider text-red-600 mb-2.5 flex items-center gap-1.5">
                      <span>4. Contact, Delivery Note & Button Text</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Delivery Note / Subtitle
                        </label>
                        <input
                          type="text"
                          value={bbDeliveryNote}
                          onChange={(e) => setBbDeliveryNote(e.target.value)}
                          placeholder="e.g. Free Home Delivery, FREE DELIVERY"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-semibold text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={bbPhone}
                          onChange={(e) => setBbPhone(e.target.value)}
                          placeholder="e.g. 323-517-4946, 0123 456 7890, 8568 0269 5476"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-espresso-950 focus:border-red-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          Website URL Tag
                        </label>
                        <input
                          type="text"
                          value={bbWebsiteUrl}
                          onChange={(e) => setBbWebsiteUrl(e.target.value)}
                          placeholder="e.g. WWW.COFFEELAND.IN"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-bold text-red-600 focus:border-red-600 outline-none uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-espresso-900 mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={bbButtonText}
                          onChange={(e) => setBbButtonText(e.target.value)}
                          placeholder="e.g. ORDER NOW"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC] border border-amber-900/20 text-xs font-black text-espresso-950 focus:border-red-600 outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM SUBMISSION ROW */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/10">
                    <button
                      type="button"
                      onClick={resetBillboardForm}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-espresso-900 text-xs font-semibold border border-amber-900/15 transition-colors"
                    >
                      Reset Form
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingBillboardId ? 'Update Banner Variant' : 'Save & Add To Homepage Autoscroll'}</span>
                    </button>
                  </div>
                </form>

                {/* ======================================================== */}
                {/* SAVED BILLBOARD BANNERS CATALOG & AUTOSCROLL MANAGER */}
                {/* ======================================================== */}
                {billboardBanners.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-700">
                        Saved Billboard Banners for Autoscroll ({billboardBanners.length})
                      </h4>
                      <span className="text-[11px] text-coffee-600">
                        Toggle banners ON to include them in the homepage autoscroll rotation!
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {billboardBanners.map((bb, idx) => (
                        <div
                          key={bb.id}
                          className={`p-3.5 rounded-2xl bg-white border shadow-xs transition-all flex flex-col justify-between gap-3 ${
                            bb.isActive ? 'border-2 border-emerald-600 ring-2 ring-emerald-50' : 'border-amber-900/15 opacity-75'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={bb.image}
                              alt={bb.foodName}
                              className="w-14 h-14 rounded-xl object-contain bg-neutral-100 border border-neutral-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/banners/pizza_board.jpg';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${bb.isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                                <h5 className="font-serif font-black text-sm text-espresso-950 truncate">
                                  {idx + 1}. {bb.foodName}
                                </h5>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                                  {bb.discountBadgeText}
                                </span>
                                <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[9px] font-bold uppercase">
                                  {bb.designTheme === 'burgundy-wave' ? 'Burgundy Wave' : bb.designTheme === 'navy-torn' ? 'Navy Torn' : 'White Brick'}
                                </span>
                              </div>
                              <p className="text-[10px] text-coffee-600 truncate mt-0.5">
                                {bb.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            {/* Toggle Active status for autoscroll */}
                            <button
                              type="button"
                              onClick={() => onToggleBillboardBannerStatus?.(bb.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 ${
                                bb.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                              title={bb.isActive ? 'Active in autoscroll - click to pause' : 'Paused - click to enable in autoscroll'}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${bb.isActive ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                              <span>{bb.isActive ? 'Active in Autoscroll' : 'Paused'}</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditBillboardClick(bb)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-espresso-900 transition-colors"
                                title="Edit banner in studio"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {billboardBanners.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete banner for "${bb.foodName}"?`)) {
                                      onDeleteBillboardBanner?.(bb.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                  title="Delete banner"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
