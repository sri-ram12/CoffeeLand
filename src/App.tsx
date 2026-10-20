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
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { useFavorites } from './hooks/useFavorites';
import { useMenu } from './hooks/useMenu';
import { useReviews } from './hooks/useReviews';
import { useBanners } from './hooks/useBanners';
import { OfferBanner } from './types/banner';
import { Product } from './types/product';
import { Utensils, Download } from 'lucide-react';

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

  useEffect(() => {
    if (allProducts.length > 0 && customProducts.length === 0) {
      setCustomProducts(allProducts);
    }
  }, [allProducts, customProducts.length]);

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

  const handleProductWhatsAppOrder = (product: Product) => {
    setActiveOrderTarget({
      itemName: product.name,
      price: product.price,
      category: product.category,
      inquiryType: 'Menu Item'
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#EDE0CC] text-espresso-950 flex flex-col font-sans selection:bg-terracotta selection:text-white pb-24 md:pb-0">
      {/* Navigation Header with Fast Options */}
      <Navbar
        favoriteCount={favoriteCount}
        onOpenFavorites={handleOpenFavorites}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
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
      />

      {/* WhatsApp Order & Inquiry Capture Modal */}
      <WhatsAppOrderModal
        orderTarget={activeOrderTarget}
        onClose={() => setActiveOrderTarget(null)}
        onConfirmOrder={(orderData) => {
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
