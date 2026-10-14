# ☕ COFFEE LAND — Premium Animated Restaurant Website

> **“Your Perfect Cup. Your Happy Place.”**  
> A client-ready, luxury cafe and restaurant static web application built with React, TypeScript, Tailwind CSS, and Framer Motion. Architected for effortless migration to a full-stack restaurant ordering platform.

---

## 🌟 Executive Summary

**COFFEE LAND** is a modern static website engineered for high visual impact, smooth motion design, and intuitive browsing. It showcases a complete catalog of **67 handcrafted food and beverage items** across 12 culinary categories, featuring dynamic search, multi-criteria filtering, favorite bookmarking with persistent storage, a detailed product modal, interactive featured sections, an editorial image gallery with lightbox, and a client-validated contact form.

The codebase strictly decouples UI components from data access through a dedicated `menuService` abstraction and strong TypeScript models, guaranteeing a seamless transition when connecting a database, backend API, authentication, and payment gateways.

---

## 🎨 Brand Identity & Design System

### Color Palette
- **Espresso Brown (`#2B1B16`)**: Deep, grounded foundation representing dark roast coffee and warmth.
- **Coffee Brown (`#5C3825`)**: Mid-tone roast providing richness in typography and borders.
- **Caramel Gold (`#C99552`)**: Radiant gold accenting buttons, badges, highlights, and icons.
- **Warm Cream (`#F7F0E6`)**: Crisp yet soft foreground text and elevated contrast elements.
- **Soft Beige (`#E8D8C3`)**: Subdued secondary typography and muted card accents.
- **Muted Olive (`#7A8060`)**: Earthy botanical highlights.
- **Pure White (`#FFFFFF`)**: High-contrast focal points.

### Typography
- **Headings**: *Playfair Display* & *DM Serif Display* — Classic editorial luxury and elegance.
- **Body & Controls**: *Plus Jakarta Sans* & *Inter* — Modern, ultra-readable typography.

---

## 🚀 Features & Interactions

1. **Cinematic Hero Experience**
   - Slow ambient background zoom with warm vignette overlays.
   - Large animated brand title and editorial headline: *“Good Coffee. Great Food. Beautiful Moments.”*
   - Floating coffee bean and steam particle micro-animations.
   - Smooth scroll anchor links and ambient badge indicators.

2. **Artisanal Food & Beverage Catalog (67 Items Across 12 Categories)**
   - **Categories**:
     1. All Items
     2. Hot Coffee (Espresso, Cappuccino, Cafe Latte, Americano, Mocha, Caramel Macchiato, Filter Coffee)
     3. Cold Coffee (Classic Iced Coffee, Cold Coffee with Ice Cream, Iced Americano, Iced Caramel Latte, Cold Brew, Chocolate Frappé)
     4. Tea & Beverages (Masala Tea, Green Tea, Hot Chocolate, Lemon Tea, Kashmiri Saffron Kahwa, Peach Hibiscus Iced Tea)
     5. Fresh Juices & Shakes (Fresh Lime Soda, Mango Shake, Chocolate Shake, Strawberry Shake, Cold-Pressed Juices, Belgian Hazelnut Thickshake)
     6. Breakfast (Classic Buttermilk Pancakes, Belgian Chocolate Waffles, Veg Cheese Sandwich, Cheese Omelette, Avocado Sourdough Toast, Truffle Scrambled Eggs)
     7. Burgers & Sandwiches (Classic Veg Burger, Crispy Buttermilk Chicken Burger, Grilled Paneer Sandwich, Club Sandwich, Truffle Mushroom Brioche Burger, Roasted Veggie Focaccia Panini)
     8. Pizza & Fast Food (Margherita Pizza, Farmhouse Pizza, Loaded Fries, Garlic Bread, Truffle Parmesan Fries, BBQ Chicken Pizza)
     9. Pasta & Snacks (White Sauce Alfredo Penne, Red Sauce Arrabiata, Veg Momos, Crispy Potato Wedges, Pink Sauce Penne, Cheesy Jalapeño Poppers)
     10. Cakes & Desserts (Belgian Chocolate Brownie, Molten Lava Cake, New York Baked Cheesecake, Chocolate Pastry, Sizzling Brownie with Gelato, Classic Tiramisu Cup)
     11. Bakery & Croissants (Normandy Butter Croissant, Pain au Chocolat, Garlic Bread Roll, Blueberry Streusel Muffin, Almond Frangipane Croissant, Cinnamon Swirl Roll)
     12. Combos & Special Offers (Coffee + Croissant, Cappuccino + Brownie, Burger + Fries + Drink, Breakfast Special, Cold Brew & Dessert Duet, Pizza & Beverage Fiesta)
   - Real-time instant search by name, category, and flavor profile.
   - Vegetarian / Non-vegetarian standard indicator badges.
   - Multi-option sorting (Featured & Specials, Price: Low to High, Price: High to Low, Name: A-Z, Name: Z-A).
   - "Veg Only" toggle switch.
   - "Favorites Only" toggle switch with persistent `localStorage` synchronization.

3. **Product Details Modal**
   - Triggered via the "View Details" button on any product card.
   - High-definition photography, full culinary narrative, portion size, preparation time, and calorie counts.
   - Ingredients list with dietary tags.
   - Keyboard accessibility (Esc to close), smooth exit transitions, and body scroll lock.

4. **Curated Featured Sections & Offers**
   - Interactive category tabs: *Bestselling Coffee*, *Customer Favorites*, *Freshly Baked Treats*, *Signature Drinks*, and *Special Combos*.
   - Asymmetrical editorial cards highlighting savings and signature flavor notes.

5. **About Us — “More Than Coffee. A Place to Connect.”**
   - Brand storytelling detailing the single-origin sourcing philosophy from Chikmagalur hills.
   - Four pillars: Single-Origin Coffee, Artisanal Bakery & Kitchen, Cozy Sanctuary, and Community & Connection.
   - Multi-image composition with subtle floating badge accents.

6. **Ambience & Culinary Lightbox Gallery**
   - 8 high-resolution photos highlighting latte art, espresso extraction, baked goods, breakfast dishes, and warm evening cafe ambience.
   - Filter tabs: *All Photos*, *Coffee Craft*, *Food & Bakery*, *Cafe Ambience*.
   - Interactive Lightbox with keyboard support (`Escape`, `ArrowLeft`, `ArrowRight`), image counters, and next/prev controls.

7. **Contact & Location**
   - Clear editable placeholders for address, phone, email, and opening hours.
   - Interactive location map card.
   - Direct WhatsApp inquiry action button with friendly pre-filled text.
   - Client-validated contact form with feedback alerts and honest disclaimer noting frontend demo status.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v3 + Custom Design Tokens |
| **Animation** | Framer Motion |
| **Iconography** | Lucide React + Tailored SVG Icons |
| **Fonts** | Playfair Display, DM Serif Display, Plus Jakarta Sans |
| **State Management** | React Hooks (`useMenu`, `useFavorites`) with `localStorage` |

---

## 📁 Project Structure

```
CoffeeLand/
├── public/
├── src/
│   ├── assets/              # Static assets & brand media
│   ├── components/          # Reusable UI components
│   │   ├── AboutSection.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── ContactSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailsModal.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ScrollToTop.tsx
│   ├── data/                # Sample menu & category databases
│   │   ├── categories.ts    # 12 official culinary categories
│   │   └── products.ts      # 67 catalog items with full specifications
│   ├── hooks/               # Custom hooks for state encapsulation
│   │   ├── useFavorites.ts  # LocalStorage-backed favorites management
│   │   └── useMenu.ts       # Querying, filtering, sorting, and modal state
│   ├── services/            # Abstracted data access layer
│   │   └── menuService.ts   # Async Promise-based API for future backend migration
│   ├── types/               # TypeScript interfaces & domain models
│   │   ├── category.ts
│   │   ├── order.ts         # Future cart, checkout, and order interfaces
│   │   └── product.ts       # Product, category, and filter interfaces
│   ├── App.tsx              # Root application layout orchestrator
│   ├── index.css            # Tailwind directives, custom glassmorphism, scrollbars
│   ├── main.tsx             # React DOM entry point
│   └── vite-env.d.ts        # Vite environment type declarations
├── index.html               # Semantic HTML5 template with SEO & Google Fonts
├── package.json             # NPM dependencies & scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Brand theme extensions, colors, fonts, shadows
├── tsconfig.json            # Strict TypeScript configuration
└── vite.config.ts           # Vite bundler plugins
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher; tested on v22.14)
- npm (version 9 or higher; tested on 10.9)

### 1. Installation
Clone or navigate to the project directory:
```bash
cd CoffeeLand
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Build for Production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory, optimized for rapid delivery via Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔮 Future Full-Stack Roadmap

The current version was intentionally engineered so that upgrading to a full-stack platform requires **zero UI rewrites**:

1. **Service Layer Swap**:
   - `src/services/menuService.ts` already returns Promises matching future API signatures.
   - Simply change `Promise.resolve(this.products)` to `fetch('/api/products')` or GraphQL queries.

2. **Domain Models Ready**:
   - `src/types/order.ts` includes complete TypeScript definitions for:
     * `CartItem` (product reference, quantity, customized variants, notes)
     * `Order` (order number, customer details, tax, delivery fee, order status)
     * `CustomerProfile` and `DeliveryAddress`
     * Payment status (`razorpay`, `upi`, `card`, `cash_on_delivery`)

3. **Upcoming Capabilities**:
   - **Cart & Checkout Drawer**: Slide-out cart with promo code validation and table QR integration.
   - **Razorpay Payment Gateway**: Integration with Indian UPI, cards, and netbanking.
   - **Restaurant Admin Dashboard**: Menu management (toggle out-of-stock items, adjust prices in real time), live kitchen order queue, and daily revenue metrics.
   - **Customer Portal**: Phone OTP login, past orders, live order tracking, and table reservations.

---

## 📄 License
This project is licensed for the exclusive use of **COFFEE LAND**. All rights reserved.
