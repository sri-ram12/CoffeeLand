import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FastAccessDock } from './components/FastAccessDock';
import { WholeMenuShowcase } from './components/WholeMenuShowcase';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { FeaturedProducts } from './components/FeaturedProducts';
import { LiveFoodReels } from './components/LiveFoodReels';
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewModal } from './components/ReviewModal';
import { QRCodeModal } from './components/QRCodeModal';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminPanelModal } from './components/AdminPanelModal';
import { useFavorites } from './hooks/useFavorites';
import { useMenu } from './hooks/useMenu';
import { useReviews } from './hooks/useReviews';
import { useBanners } from './hooks/useBanners';
import { OfferBanner } from './types/banner';
import { Product } from './types/product';
import { Utensils } from 'lucide-react';

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
    inquiries,
    sendWhatsAppInquiry,
    deleteInquiry,
    clearInquiries,
    updateInquiryStatus
  } = useBanners();

  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState<'cards' | 'compact' | 'dashed'>('cards');
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (allProducts.length > 0 && customProducts.length === 0) {
      setCustomProducts(allProducts);
    }
  }, [allProducts, customProducts.length]);

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

  const handleClaimOffer = (banner: OfferBanner) => {
    sendWhatsAppInquiry({
      itemName: banner.itemName,
      price: banner.offerPrice,
      category: banner.category,
      inquiryType: 'Offer Banner',
      promoCode: banner.promoCode
    });
  };

  const handleHeroOrderWhatsApp = (name: string, price: number, category?: string) => {
    sendWhatsAppInquiry({
      itemName: name,
      price: price,
      category: category,
      inquiryType: 'Direct Order'
    });
  };

  const handleProductWhatsAppOrder = (product: Product) => {
    sendWhatsAppInquiry({
      itemName: product.name,
      price: product.price,
      category: product.category,
      inquiryType: 'Menu Item'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-espresso-950 flex flex-col font-sans selection:bg-terracotta selection:text-white pb-16 md:pb-0">
      {/* Navigation Header with Fast Options & Admin Console */}
      <Navbar
        favoriteCount={favoriteCount}
        onOpenFavorites={handleOpenFavorites}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
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

      {/* Cinematic Hero Section with Animated Spotlight & Rectangular Offer Banners */}
      <HeroSection
        banners={activeBanners}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onClaimOffer={handleClaimOffer}
        onOrderWhatsApp={handleHeroOrderWhatsApp}
      />

      {/* Official Whole Menu Showcase (from coffelandmenu.pdf) */}
      <WholeMenuShowcase
        products={allProducts}
        onSelectProduct={setSelectedProduct}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* Interactive Catalog & Filter Section */}
      <section
        id="menu"
        ref={menuSectionRef}
        className="py-24 bg-[#FAF6EE] relative scroll-mt-12"
      >
        {/* Soft background ambient radial gradient */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Menu Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-4">
              <Utensils className="w-3.5 h-3.5" />
              <span>Interactive Food & Beverage Catalog</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-4">
              Explore By Category
            </h2>
            <p className="text-sm sm:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
              Filter by dietary preference, price, or flavor profile across all 150+ authentic items from Coffee Land Resto & Cafe.
            </p>
          </div>

          {/* Interactive Filtering and Category Controls */}
          <div className="mb-12">
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

          {/* Products Grid */}
          <ProductGrid
            products={filteredProducts}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectProduct={setSelectedProduct}
            onResetFilters={resetFilters}
            viewMode={catalogViewMode}
          />
        </div>
      </section>

      {/* Customer Ratings & Photo Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        stats={stats}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onToggleLike={toggleLikeReview}
      />

      {/* Live Food Video Reels (Pinterest Showcase for Pizza, Coffee, Burger, Mocktails, Fried Chicken, Kunafa) */}
      <LiveFoodReels
        onOrderOnWhatsApp={(dish, price, cat) =>
          sendWhatsAppInquiry({
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

      {/* Footer with Admin Console Link */}
      <Footer
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Product Details Modal with WhatsApp Chat Button */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onOrderWhatsApp={handleProductWhatsAppOrder}
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

      {/* Admin Panel Modal for Owner (Offer Banners, Excel Reports, WhatsApp Logs, Food Items) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        banners={banners}
        onAddBanner={addBanner}
        onUpdateBanner={updateBanner}
        onDeleteBanner={deleteBanner}
        onToggleBannerStatus={toggleBannerStatus}
        onResetBanners={resetBanners}
        products={customProducts.length > 0 ? customProducts : allProducts}
        onUpdateProduct={handleUpdateProduct}
        inquiries={inquiries}
        onUpdateInquiryStatus={updateInquiryStatus}
        onDeleteInquiry={deleteInquiry}
        onClearInquiries={clearInquiries}
      />

      {/* Floating Return to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default App;
