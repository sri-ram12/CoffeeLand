import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FastAccessDock } from './components/FastAccessDock';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { FeaturedProducts } from './components/FeaturedProducts';
import { LiveFoodReels } from './components/LiveFoodReels';
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewModal } from './components/ReviewModal';
import { QRCodeModal } from './components/QRCodeModal';
import { WhatsAppOrderModal, WhatsAppOrderTarget } from './components/WhatsAppOrderModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartOrderModal } from './components/CartOrderModal';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { useFavorites } from './hooks/useFavorites';
import { useMenu } from './hooks/useMenu';
import { useReviews } from './hooks/useReviews';
import { useBanners } from './hooks/useBanners';
import { useCart } from './hooks/useCart';
import { OfferBanner } from './types/banner';
import { Product } from './types/product';
import { api } from './services/api';
import { Utensils, Download, ShieldAlert, Lock, RefreshCw, Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const App: React.FC = () => {
  const { favorites, toggleFavorite, isFavorite, favoriteCount } = useFavorites();
  const {
    categories,
    allProducts,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    vegOnly,
    setVegOnly,
    favoritesOnly,
    setFavoritesOnly,
    selectedProduct,
    setSelectedProduct,
    resetFilters,
  } = useMenu(favorites);

  const { reviews, addReview, toggleLikeReview, stats } = useReviews();
  const {
    banners,
    activeBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    resetBanners,
    billboardBanners,
    activeBillboardBanner,
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
  } = useBanners();

  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState<'cards' | 'compact' | 'dashed'>('cards');
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  // Cart state for multi-item WhatsApp ordering
  const {
    items: cartItems,
    addToCart,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    totalCount: cartTotalCount,
    totalPrice: cartTotalPrice,
  } = useCart();

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem('coffeeland_maintenance_mode') === 'true';
  });
  const [maintenanceReason, setMaintenanceReason] = useState<string>(() => {
    return localStorage.getItem('coffeeland_maintenance_reason') || 'Scheduled maintenance & security updates in progress.';
  });
  const [checkingMaintenance, setCheckingMaintenance] = useState(false);

  useEffect(() => {
    if (allProducts.length > 0 && customProducts.length === 0) {
      setCustomProducts(allProducts);
    }
  }, [allProducts, customProducts.length]);

  // Check Maintenance / Emergency Stop status from server
  useEffect(() => {
    const checkMaintenance = async () => {
      const data = await api.getMaintenanceSettings();
      setIsMaintenanceMode(data.maintenanceMode);
      if (data.maintenanceReason) setMaintenanceReason(data.maintenanceReason);
    };
    checkMaintenance();
    const interval = setInterval(checkMaintenance, 15000); // Check every 15s for instant sync
    return () => clearInterval(interval);
  }, []);

  // Automated 24/7 Keep-Alive heartbeat while storefront is active
  useEffect(() => {
    const ping = () => {
      fetch('/api/health', { cache: 'no-store' }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProduct = (id: string, updatedFields: Partial<Product>) => {
    setCustomProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const menuSectionRef = useRef<HTMLDivElement>(null);

  // When clicking favorites in header, scroll to menu and enable favoritesOnly
  const handleOpenFavorites = () => {
    setFavoritesOnly(true);
    setSelectedCategory('all');
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [activeOrderTarget, setActiveOrderTarget] = useState<WhatsAppOrderTarget | null>(null);

  const handleClaimOffer = (banner: OfferBanner) => {
    setActiveOrderTarget({
      itemName: banner.itemName,
      price: banner.offerPrice,
      category: banner.category,
      inquiryType: 'Offer Banner',
      promoCode: banner.promoCode
    });
  };

  const handleHeroOrderWhatsApp = (name: string, price: number, category?: string) => {
    setActiveOrderTarget({
      itemName: name,
      price: price,
      category: category,
      inquiryType: 'Direct Order'
    });
  };

  const handleProductWhatsAppOrder = (product: Product, quantity: number = 1) => {
    const qtyText = quantity > 1 ? ` (${quantity}x)` : '';
    setActiveOrderTarget({
      itemName: `${product.name}${qtyText}`,
      price: product.price * quantity,
      category: product.category,
      inquiryType: 'Menu Item'
    });
  };

  // ========================================================
  // EMERGENCY STOP / WEBSITE UNDER MAINTENANCE VIEW
  // ========================================================
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen w-full bg-[#EDE0CC] text-espresso-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-terracotta selection:text-white">
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full relative z-10 text-center">
          {/* Logo Emblem */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-terracotta shadow-2xl mb-6">
            <img src="/logo.png" alt="Coffee Land Resto & Cafe" className="w-full h-full object-cover" />
          </div>

          {/* Emergency Alert Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Emergency Stop Active • Under Maintenance</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-espresso-950 tracking-tight mb-2">
            Website is Under Maintenance
          </h1>
          <p className="font-handwriting text-2xl sm:text-3xl text-[#800000] font-bold mb-4">
            Coffee Land Resto &amp; Cafe
          </p>

          {/* Notice Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-terracotta/20 shadow-xl mb-6 text-left">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-[#802B12] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-espresso-950">
                  Notice to Guests &amp; Customers
                </h3>
                <p className="text-xs sm:text-sm text-coffee-800 mt-1 leading-relaxed">
                  {maintenanceReason}
                </p>
              </div>
            </div>

            <p className="text-xs text-coffee-700 leading-relaxed pt-3 border-t border-amber-900/10">
              Our online menu and web ordering system are temporarily paused for routine server maintenance, security upgrades, or inventory calibration. We will be back online shortly!
            </p>

            {/* Direct Contact Options with Owner */}
            <div className="mt-5 pt-4 border-t border-amber-900/10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/919542525665?text=Hello%20Coffee%20Land!%20I%20saw%20the%20website%20is%20under%20maintenance.%20I%20would%20like%20to%20place%20an%20order%20directly."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Owner Direct</span>
              </a>

              <a
                href="tel:+919542525665"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-amber-50 text-espresso-950 border border-terracotta/30 font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Phone className="w-4 h-4 text-terracotta" />
                <span>Call +91 95425 25665</span>
              </a>
            </div>
          </div>

          {/* Refresh & Admin Portal Access */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
            <button
              onClick={async () => {
                setCheckingMaintenance(true);
                const data = await api.getMaintenanceSettings();
                setIsMaintenanceMode(data.maintenanceMode);
                setCheckingMaintenance(false);
              }}
              disabled={checkingMaintenance}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-espresso-900 border border-amber-900/20 font-bold transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${checkingMaintenance ? 'animate-spin' : ''}`} />
              <span>{checkingMaintenance ? 'Checking...' : 'Check If Back Online'}</span>
            </button>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-coffee-700 hover:text-terracotta font-semibold transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#EDE0CC] text-espresso-950 flex flex-col font-sans selection:bg-terracotta selection:text-white pb-24 md:pb-0">
      {/* Navigation Header with Fast Options */}
      <Navbar
        favoriteCount={favoriteCount}
        onOpenFavorites={handleOpenFavorites}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      {/* Floating / Sticky Fast Access Dock (Desktop scroll + Mobile Bottom Bar) */}
      <FastAccessDock
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        favoriteCount={favoriteCount}
        onOpenFavorites={handleOpenFavorites}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Cinematic Hero Section with Animated Spotlight & Billboard Banner */}
      <HeroSection
        billboardBanner={activeBillboardBanner}
        billboardBanners={billboardBanners}
        onOrderWhatsApp={handleHeroOrderWhatsApp}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
      />

      {/* Interactive Catalog & Filter Section (Main Menu Explorer) */}
      <section
        id="menu"
        ref={menuSectionRef}
        className="py-10 sm:py-14 bg-[#EDE0CC] relative overflow-hidden scroll-mt-12"
      >
        {/* Soft background ambient radial gradient */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Menu Section Header - Clean & Focused */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-2">
              Explore Our Menu
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
              Handcrafted coffees, stone-baked pizzas, gourmet burgers & authentic desserts prepared fresh upon order.
            </p>
            {/* Quick Action: Download Official Menu PDF */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <a
                href="/coffelandmenu.pdf"
                download="CoffeeLand-Menu.pdf"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-terracotta hover:text-white border border-terracotta/30 text-xs font-bold text-espresso-900 transition-all shadow-2xs group"
                title="Download original printed menu PDF"
              >
                <Download className="w-3.5 h-3.5 text-terracotta group-hover:text-white transition-colors" />
                <span>Download Original Menu PDF</span>
              </a>
            </div>
          </div>

          {/* Interactive Filtering and Category Controls */}
          <div className="mb-6 sm:mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              vegOnly={vegOnly}
              onToggleVegOnly={() => setVegOnly(!vegOnly)}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
              favoriteCount={favoriteCount}
              totalFilteredCount={filteredProducts.length}
              viewMode={catalogViewMode}
              onViewModeChange={setCatalogViewMode}
            />
          </div>

          {/* Products Grid Aligned by Category */}
          <ProductGrid
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectProduct={setSelectedProduct}
            onOrderProduct={handleProductWhatsAppOrder}
            onResetFilters={resetFilters}
            viewMode={catalogViewMode}
            getItemQuantity={getItemQuantity}
            onAddToCart={addToCart}
            onUpdateCartQuantity={updateCartQuantity}
          />
        </div>
      </section>

      {/* Live Food Video Reels (Autoplay one by one through autoscrolling) */}
      <LiveFoodReels
        onOrderOnWhatsApp={(dish, price, cat) =>
          setActiveOrderTarget({
            itemName: dish,
            price,
            category: cat,
            inquiryType: 'Menu Item'
          })
        }
      />

      {/* Featured Products & Special Combos */}
      <FeaturedProducts
        products={allProducts}
        onSelectProduct={setSelectedProduct}
        onSelectCategory={setSelectedCategory}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      {/* About Us Section */}
      <AboutSection />

      {/* Ambience & Culinary Gallery with Lightbox */}
      <GallerySection />

      {/* Contact & Hours Section */}
      <ContactSection />

      {/* Customer Ratings & Photo Reviews Section (Placed at End of Website) */}
      <ReviewsSection
        reviews={reviews}
        stats={stats}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onToggleLike={toggleLikeReview}
      />

      {/* Footer */}
      <Footer
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
      />

      {/* Product Details Modal with WhatsApp Chat Button */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onOrderWhatsApp={handleProductWhatsAppOrder}
        onAddToCart={addToCart}
      />

      {/* WhatsApp Order & Inquiry Capture Modal (Single Dish Fast Dispatch) */}
      <WhatsAppOrderModal
        orderTarget={activeOrderTarget}
        onClose={() => setActiveOrderTarget(null)}
        onConfirmOrder={(orderData) => {
          sendWhatsAppInquiry(orderData);
        }}
      />

      {/* Floating Cart Bar (Appears when items are selected in cart) */}
      <FloatingCartBar
        totalCount={cartTotalCount}
        totalPrice={cartTotalPrice}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      {/* Multi-Item Cart Order Modal (Order 2 or more dishes via WhatsApp with Pass Card) */}
      <CartOrderModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        items={cartItems}
        totalPrice={cartTotalPrice}
        totalCount={cartTotalCount}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onAddMoreItems={() => {
          if (menuSectionRef.current) {
            menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onInquiryRecorded={(orderData) => {
          sendWhatsAppInquiry(orderData);
        }}
      />

      {/* Website QR Code Modal */}
      <QRCodeModal
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      />

      {/* Review & Mobile Photo Uploader Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitReview={addReview}
        products={allProducts}
      />

      {/* Floating Return to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default App;
