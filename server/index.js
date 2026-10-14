import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'coffeeland2024';
const ADMIN_PIN = process.env.ADMIN_PIN || '954252';

// Enable CORS and generous JSON body limit for mobile photo uploads
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helpers for reading and writing JSON files with automatic recovery
function readJson(filename, defaultValue = []) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeJson(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// ==========================================
// 1. SYSTEM HEALTH & ADMIN AUTHENTICATION
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Coffee Land Resto & Cafe Fullstack API',
    location: 'Temples Bypass Road, Sangivalasa, Visakhapatnam',
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/admin/login', (req, res) => {
  const { password, pin } = req.body;
  if (
    (password && password.trim() === ADMIN_PASSWORD) ||
    (pin && pin.trim() === ADMIN_PIN) ||
    (password && password.trim() === ADMIN_PIN)
  ) {
    return res.json({
      success: true,
      token: `auth_owner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      role: 'owner',
      ownerName: 'Coffee Land Admin',
      message: 'Authentication successful. Welcome to Coffee Land Admin Console.'
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please enter the correct owner password or PIN.'
  });
});

// ==========================================
// 2. FOOD MENU ITEMS (250 items catalog)
// ==========================================
app.get('/api/products', (req, res) => {
  let products = readJson('products.json', []);
  const { category, search, veg } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  if (veg === 'true') {
    products = products.filter(p => p.isVeg);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readJson('products.json', []);
  const newProduct = {
    id: `cl-custom-${Date.now()}`,
    name: req.body.name || 'New Specialty Item',
    category: req.body.category || 'hot-coffee',
    price: Number(req.body.price) || 99,
    description: req.body.description || 'Artisanal dish crafted with fresh ingredients.',
    longDescription: req.body.longDescription || req.body.description || 'Artisanal dish crafted with fresh ingredients.',
    image: req.body.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isVeg: Boolean(req.body.isVeg),
    badge: req.body.badge || null,
    prepTime: req.body.prepTime || '10-15 mins',
    portion: req.body.portion || '1 Serving',
    calories: req.body.calories || '220 kcal',
    menuPage: req.body.menuPage || 1,
    isFeatured: Boolean(req.body.isFeatured),
    featuredCategory: req.body.featuredCategory || null
  };

  products.unshift(newProduct);
  writeJson('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readJson('products.json', []);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price
  };

  writeJson('products.json', products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readJson('products.json', []);
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);

  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeJson('products.json', products);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ==========================================
// 3. RECTANGULAR OFFER BANNERS
// ==========================================
app.get('/api/banners', (req, res) => {
  const banners = readJson('banners.json', []);
  const showAll = req.query.all === 'true';
  const result = showAll ? banners : banners.filter(b => b.isActive);
  res.json(result);
});

app.post('/api/banners', (req, res) => {
  const banners = readJson('banners.json', []);
  const newBanner = {
    id: `banner-${Date.now()}`,
    title: req.body.title || 'Special Cafe Offer',
    subtitle: req.body.subtitle || '',
    itemName: req.body.itemName || 'Chef Signature Delicacy',
    originalPrice: Number(req.body.originalPrice) || 199,
    offerPrice: Number(req.body.offerPrice) || 149,
    discountLabel: req.body.discountLabel || 'SPECIAL OFFER',
    promoCode: req.body.promoCode ? req.body.promoCode.toUpperCase() : undefined,
    image: req.body.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    themeColor: req.body.themeColor || 'terracotta',
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    expiryNote: req.body.expiryNote || 'Limited Time Offer',
    category: req.body.category || 'Specialty Dish'
  };

  banners.unshift(newBanner);
  writeJson('banners.json', banners);
  res.status(201).json(newBanner);
});

app.put('/api/banners/:id', (req, res) => {
  const banners = readJson('banners.json', []);
  const index = banners.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Banner not found' });
  }

  banners[index] = {
    ...banners[index],
    ...req.body,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : banners[index].originalPrice,
    offerPrice: req.body.offerPrice !== undefined ? Number(req.body.offerPrice) : banners[index].offerPrice
  };

  writeJson('banners.json', banners);
  res.json(banners[index]);
});

app.delete('/api/banners/:id', (req, res) => {
  let banners = readJson('banners.json', []);
  banners = banners.filter(b => b.id !== req.params.id);
  writeJson('banners.json', banners);
  res.json({ success: true, message: 'Banner removed' });
});

// ==========================================
// 4. WHATSAPP INQUIRIES & ORDERS LOG
// ==========================================
app.get('/api/inquiries', (req, res) => {
  const inquiries = readJson('inquiries.json', []);
  res.json(inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const inquiries = readJson('inquiries.json', []);
  const defaultMsg = `Hello Coffee Land (Sangivalasa, Vizag)! I am interested in: *${req.body.itemName}* (Price: ₹${req.body.price}${req.body.promoCode ? ` | Promo: ${req.body.promoCode}` : ''}). Please confirm availability!`;

  const newInquiry = {
    id: `inq-${Date.now()}`,
    customerName: req.body.customerName || 'Website Diner',
    customerPhone: req.body.customerPhone || '',
    itemName: req.body.itemName,
    category: req.body.category || 'Specialty Dish',
    price: Number(req.body.price) || 0,
    inquiryType: req.body.inquiryType || 'Menu Item',
    promoCode: req.body.promoCode || undefined,
    message: req.body.customNote || defaultMsg,
    timestamp: new Date().toISOString(),
    status: 'Inquired'
  };

  inquiries.unshift(newInquiry);
  writeJson('inquiries.json', inquiries);
  res.status(201).json(newInquiry);
});

app.put('/api/inquiries/:id', (req, res) => {
  const inquiries = readJson('inquiries.json', []);
  const index = inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Inquiry not found' });
  }

  inquiries[index] = {
    ...inquiries[index],
    status: req.body.status || inquiries[index].status
  };

  writeJson('inquiries.json', inquiries);
  res.json(inquiries[index]);
});

app.delete('/api/inquiries/:id', (req, res) => {
  let inquiries = readJson('inquiries.json', []);
  inquiries = inquiries.filter(i => i.id !== req.params.id);
  writeJson('inquiries.json', inquiries);
  res.json({ success: true, message: 'Inquiry deleted' });
});

app.delete('/api/inquiries', (req, res) => {
  writeJson('inquiries.json', []);
  res.json({ success: true, message: 'All inquiries cleared' });
});

// ==========================================
// 5. CUSTOMER RATINGS & PHOTO REVIEWS
// ==========================================
app.get('/api/reviews', (req, res) => {
  const reviews = readJson('reviews.json', []);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const reviews = readJson('reviews.json', []);
  const newReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    author: req.body.author || 'Happy Guest',
    rating: Number(req.body.rating) || 5,
    date: new Date().toISOString().split('T')[0],
    relativeTime: 'Just now',
    comment: req.body.comment || '',
    dishName: req.body.dishName || 'Specialty Cafe Selection',
    photos: req.body.photos || [],
    isVerified: true,
    deviceType: req.body.deviceType || 'Mobile Phone',
    location: req.body.location || 'Coffee Land Resto & Cafe Guest',
    likes: 0,
    userLiked: false
  };

  reviews.unshift(newReview);
  writeJson('reviews.json', reviews);
  res.status(201).json(newReview);
});

app.post('/api/reviews/:id/like', (req, res) => {
  const reviews = readJson('reviews.json', []);
  const rev = reviews.find(r => r.id === req.params.id);
  if (rev) {
    rev.likes = (rev.likes || 0) + 1;
    writeJson('reviews.json', reviews);
    return res.json({ success: true, likes: rev.likes });
  }
  res.status(404).json({ message: 'Review not found' });
});

// ==========================================
// 6. EXCEL (.XLSX) REPORT GENERATION (SERVER-SIDE)
// ==========================================
app.get('/api/export/:type', (req, res) => {
  const type = req.params.type;
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().split('T')[0];

  if (type === 'inquiries') {
    const inquiries = readJson('inquiries.json', []);
    const rows = inquiries.map((inq, idx) => ({
      'S.No': idx + 1,
      'Inquiry ID': inq.id,
      'Date & Time': new Date(inq.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Customer Name': inq.customerName || 'Website Diner',
      'Phone Number': inq.customerPhone || 'Direct WhatsApp',
      'Item Name': inq.itemName,
      'Category': inq.category || 'Specialty',
      'Price (₹)': inq.price,
      'Inquiry Type': inq.inquiryType,
      'Promo Code': inq.promoCode || 'N/A',
      'Status': inq.status,
      'Order Message': inq.message
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 16 },
      { wch: 28 }, { wch: 22 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
      { wch: 14 }, { wch: 50 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'WhatsApp Inquiries');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="CoffeeLand_WhatsApp_Orders_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  if (type === 'banners') {
    const banners = readJson('banners.json', []);
    const rows = banners.map((b, idx) => ({
      'S.No': idx + 1,
      'Banner Title': b.title,
      'Item Name': b.itemName,
      'Category': b.category || 'Specialty Deal',
      'Original Price (₹)': b.originalPrice,
      'Offer Price (₹)': b.offerPrice,
      'Discount Tag': b.discountLabel,
      'Promo Code': b.promoCode || 'N/A',
      'Color Theme': b.themeColor,
      'Status': b.isActive ? 'Active' : 'Inactive',
      'Validity Note': b.expiryNote
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 6 }, { wch: 30 }, { wch: 26 }, { wch: 22 }, { wch: 18 },
      { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
      { wch: 25 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Offer Banners');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="CoffeeLand_Offer_Banners_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  if (type === 'menu') {
    const products = readJson('products.json', []);
    const rows = products.map((p, idx) => ({
      'Item Code': p.id,
      'Item Name': p.name,
      'Category': p.category,
      'Price (₹)': p.price,
      'Dietary Preference': p.isVeg ? 'Vegetarian' : 'Non-Vegetarian',
      'Badge': p.badge || 'Regular',
      'Prep Time': p.prepTime || '10-15 mins',
      'Portion Size': p.portion || '1 Serving',
      'Menu Page': p.menuPage || 1,
      'Description': p.description
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 24 }, { wch: 30 }, { wch: 22 }, { wch: 12 }, { wch: 20 },
      { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Menu Catalog');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="CoffeeLand_Menu_Catalog_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  res.status(400).json({ error: 'Invalid export type. Use inquiries, banners, or menu.' });
});

// ==========================================
// 7. PRODUCTION STATIC ASSETS (RENDER HOSTING)
// ==========================================
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`Serving static production build from ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for /admin and customer routes (compatible with all Express versions)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`☕ Coffee Land Fullstack Server Active on Port ${PORT}`);
  console.log(`➜ Local:   http://localhost:${PORT}`);
  console.log(`➜ Admin:   http://localhost:${PORT}/admin`);
  console.log(`➜ API:     http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
