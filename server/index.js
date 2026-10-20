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
  const uptimeSec = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSec / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = uptimeSec % 60;
  res.json({
    status: 'online',
    service: 'Coffee Land Resto & Cafe Fullstack API',
    location: 'Temples Bypass Road, Sangivalasa, Visakhapatnam',
    serverTime: new Date().toISOString(),
    uptimeSeconds: uptimeSec,
    uptimeFormatted: `${hours}h ${minutes}m ${seconds}s`,
    keepAlive: 'active_24_7',
    preventSleep: true,
    pingIntervalMinutes: 8,
    renderUrl: 'https://coffeeland-4yy7.onrender.com'
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
    diningOption: req.body.diningOption || 'Dine-In',
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
// 4.5. COUNTER POS & KOT ORDERS (Dine-In, Takeaway, Delivery, WhatsApp)
// ==========================================
app.get('/api/pos-orders', (req, res) => {
  const orders = readJson('kot_orders.json', []);
  res.json(orders);
});

app.post('/api/pos-orders', (req, res) => {
  const orders = readJson('kot_orders.json', []);
  const newOrder = {
    id: req.body.id || `kot-ord-${Date.now()}`,
    kotNumber: Number(req.body.kotNumber) || (orders.length > 0 ? (orders[0].kotNumber || 100) + 1 : 101),
    orderType: req.body.orderType || 'Dine-In',
    tableNumber: req.body.tableNumber || 'Table 1',
    customerName: req.body.customerName || 'Counter Guest',
    customerPhone: req.body.customerPhone || '',
    items: Array.isArray(req.body.items) ? req.body.items : [],
    chefNotes: req.body.chefNotes || '',
    timestamp: req.body.timestamp || new Date().toISOString(),
    totalAmount: Number(req.body.totalAmount) || 0,
    status: req.body.status || 'Preparing'
  };

  const existingIdx = orders.findIndex(o => o.id === newOrder.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = newOrder;
  } else {
    orders.unshift(newOrder);
  }

  writeJson('kot_orders.json', orders);
  res.status(201).json(newOrder);
});

app.put('/api/pos-orders/:id', (req, res) => {
  const orders = readJson('kot_orders.json', []);
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'POS order not found' });
  }

  orders[index] = {
    ...orders[index],
    ...req.body
  };

  writeJson('kot_orders.json', orders);
  res.json(orders[index]);
});

app.delete('/api/pos-orders/:id', (req, res) => {
  let orders = readJson('kot_orders.json', []);
  orders = orders.filter(o => o.id !== req.params.id);
  writeJson('kot_orders.json', orders);
  res.json({ success: true, message: 'POS order deleted' });
});

app.delete('/api/pos-orders', (req, res) => {
  writeJson('kot_orders.json', []);
  res.json({ success: true, message: 'All POS orders cleared' });
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
      'Dining Option': inq.diningOption || 'Dine-In',
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
      { wch: 28 }, { wch: 16 }, { wch: 22 }, { wch: 12 }, { wch: 16 },
      { wch: 14 }, { wch: 14 }, { wch: 50 }
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

  if (type === 'pos-orders') {
    const orders = readJson('kot_orders.json', []);
    const rows = orders.map((ord, idx) => ({
      'S.No': idx + 1,
      'KOT Token': `#KOT-${ord.kotNumber}`,
      'Date & Time': new Date(ord.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Order Type': ord.orderType,
      'Table No': ord.tableNumber || 'N/A',
      'Customer Name': ord.customerName || 'Counter Guest',
      'Phone': ord.customerPhone || 'N/A',
      'Items Ordered': (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(' | '),
      'Chef Instructions': ord.chefNotes || 'Standard preparation',
      'Total Bill (₹)': ord.totalAmount,
      'Order Status': ord.status
    }));

    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{
      'S.No': 1,
      'KOT Token': 'No offline orders yet',
      'Date & Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Order Type': 'Dine-In',
      'Table No': '-',
      'Customer Name': '-',
      'Phone': '-',
      'Items Ordered': '-',
      'Chef Instructions': '-',
      'Total Bill (₹)': 0,
      'Order Status': 'Active'
    }]);

    ws['!cols'] = [
      { wch: 6 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 12 },
      { wch: 20 }, { wch: 16 }, { wch: 45 }, { wch: 25 }, { wch: 14 },
      { wch: 14 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Counter POS & KOT Orders');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="CoffeeLand_Counter_POS_Orders_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  if (type === 'daily-sales') {
    const inquiries = readJson('inquiries.json', []);
    const orders = readJson('kot_orders.json', []);

    // Tab 1: Combined Master Summary
    const kotTotal = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const waTotal = inquiries.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
    const combinedTotal = kotTotal + waTotal;

    const summaryRows = [
      { 'Metric': 'Report Date', 'Value': dateStr },
      { 'Metric': 'Total Revenue (Combined)', 'Value': `₹${combinedTotal}` },
      { 'Metric': 'Counter POS & KOT Revenue', 'Value': `₹${kotTotal}` },
      { 'Metric': 'WhatsApp Orders Revenue', 'Value': `₹${waTotal}` },
      { 'Metric': 'Total Offline KOT Orders', 'Value': orders.length },
      { 'Metric': 'Total WhatsApp Customer Orders', 'Value': inquiries.length },
      { 'Metric': 'Total All Orders Count', 'Value': orders.length + inquiries.length }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 35 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Daily Sales Summary');

    // Tab 2: WhatsApp Orders
    const waRows = inquiries.map((inq, idx) => ({
      'S.No': idx + 1,
      'Inquiry ID': inq.id,
      'Date & Time': new Date(inq.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Customer Name': inq.customerName || 'Website Diner',
      'Phone Number': inq.customerPhone || 'Direct WhatsApp',
      'Item Name': inq.itemName,
      'Category': inq.category || 'Specialty',
      'Price (₹)': inq.price,
      'Promo Code': inq.promoCode || 'N/A',
      'Status': inq.status,
      'Customer Note': inq.message
    }));
    const wsWa = XLSX.utils.json_to_sheet(waRows.length > 0 ? waRows : [{ 'Message': 'No WhatsApp orders recorded yet.' }]);
    XLSX.utils.book_append_sheet(wb, wsWa, 'WhatsApp Orders');

    // Tab 3: Offline KOT Orders
    const kotRows = orders.map((ord, idx) => ({
      'S.No': idx + 1,
      'KOT Token': `#KOT-${ord.kotNumber}`,
      'Date & Time': new Date(ord.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Order Type': ord.orderType,
      'Table No': ord.tableNumber || 'N/A',
      'Customer Name': ord.customerName || 'Counter Guest',
      'Phone': ord.customerPhone || 'N/A',
      'Items Ordered': (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(' | '),
      'Chef Instructions': ord.chefNotes || 'Standard preparation',
      'Total Bill (₹)': ord.totalAmount,
      'Status': ord.status
    }));
    const wsKot = XLSX.utils.json_to_sheet(kotRows.length > 0 ? kotRows : [{ 'Message': 'No offline counter orders recorded yet.' }]);
    XLSX.utils.book_append_sheet(wb, wsKot, 'Counter POS Orders');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="CoffeeLand_Master_Daily_Sales_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  res.status(400).json({ error: 'Invalid export type. Use inquiries, pos-orders, daily-sales, banners, or menu.' });
});

// ==========================================
// 6.5 DYNAMIC WHATSAPP ORDER PASS CARD ROUTE (OPENGRAPH PREVIEW)
// ==========================================
const passesDir = path.join(__dirname, '../public/passes');
if (fs.existsSync(passesDir)) {
  app.use('/passes', express.static(passesDir));
}

app.get('/order-pass', (req, res) => {
  const dining = req.query.type || 'Dine-In';
  const item = req.query.item || 'Coffee Land Specialty';
  const price = req.query.price || '0';
  const customer = req.query.name || 'VIP Guest';
  const id = req.query.id || `CL-${Date.now().toString().slice(-6)}`;

  let passSlug = 'dine-in';
  let emoji = '🔴';
  let passColorName = 'Red Card';
  let passTitle = 'DINE-IN PASS';
  let passSubtitle = 'Table Service Pass';

  const dLower = dining.toLowerCase();
  if (dLower.includes('deliv')) {
    passSlug = 'delivery';
    emoji = '🔵';
    passColorName = 'Blue Card';
    passTitle = 'DELIVERY PASS';
    passSubtitle = 'Doorstep Express Pass';
  } else if (dLower.includes('take') || dLower.includes('parcel')) {
    passSlug = 'takeaway';
    emoji = '🟢';
    passColorName = 'Green Card';
    passTitle = 'TAKEAWAY PASS';
    passSubtitle = 'Express Counter Parcel';
  }

  const host = process.env.RENDER_EXTERNAL_URL || 'https://coffeeland-4yy7.onrender.com';
  const imageUrl = `${host}/passes/${passSlug}.jpg`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${emoji} ${passTitle} (${passColorName}) | Coffee Land Resto & Cafe</title>
  
  <!-- WhatsApp & Social OpenGraph Card Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Coffee Land Resto & Cafe" />
  <meta property="og:title" content="${emoji} ${passTitle} (${passColorName}) • ${item} (₹${price})" />
  <meta property="og:description" content="Official ${passSubtitle} for ${customer} • Total ₹${price} • Coffee Land Resto & Cafe, Temples Bypass Rd, Sangivalasa, Vizag." />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1472" />
  <meta property="og:image:height" content="1044" />
  <meta property="og:url" content="${host}/order-pass?type=${encodeURIComponent(dining)}&item=${encodeURIComponent(item)}&price=${price}&name=${encodeURIComponent(customer)}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${emoji} ${passTitle} (${passColorName}) • ${item}" />
  <meta name="twitter:description" content="Official Pass for ${customer} • Total ₹${price}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1a0f0d;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card-wrap {
      max-width: 600px;
      width: 100%;
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .card-wrap img {
      width: 100%;
      height: auto;
      display: block;
    }
    .info-bar {
      background: #231411;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-bar a {
      background: #c85a32;
      color: #fff;
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card-wrap">
    <img src="${imageUrl}" alt="${passTitle}" />
    <div class="info-bar">
      <div>
        <div style="font-weight: bold; font-size: 15px;">${emoji} ${passTitle} • ${item}</div>
        <div style="font-size: 12px; color: #d5b895;">Guest: ${customer} | Bill: ₹${price}</div>
      </div>
      <a href="https://wa.me/919542525665?text=${encodeURIComponent(`Hello Coffee Land, confirming my ${passTitle} for ${item} (₹${price})`)}">Open WhatsApp</a>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
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

  // ==========================================
  // 8. 24/7 ANTI-SLEEP KEEP-ALIVE HEARTBEAT
  // ==========================================
  // Render Free tier spins down web services after 15 minutes of inactivity.
  // This automated loop pings the public HTTPS endpoint every 8 minutes
  // so the service stays active, warm, and responsive 24/7 with 0s latency!
  const targetHost = process.env.RENDER_EXTERNAL_URL || 'https://coffeeland-4yy7.onrender.com';
  const PING_INTERVAL = 8 * 60 * 1000; // 8 minutes (well before Render's 15-minute idle limit)

  console.log(`[Keep-Alive] 24/7 Anti-Sleep Heartbeat monitoring: ${targetHost}`);

  // Initial warmup ping 15 seconds after launch
  setTimeout(() => {
    pingService(targetHost);
  }, 15000);

  // Recurring ping every 8 minutes
  setInterval(() => {
    pingService(targetHost);
  }, PING_INTERVAL);
});

async function pingService(host) {
  try {
    const pingUrl = `${host.replace(/\/$/, '')}/api/health`;
    const res = await fetch(pingUrl, {
      headers: { 
        'User-Agent': 'CoffeeLand-24-7-KeepAlive-Bot/2.0',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(15000) // 15s timeout
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log(`[Keep-Alive] ✓ 24/7 Heartbeat Ping SUCCESS at ${new Date().toLocaleTimeString('en-IN')} (Uptime: ${data.uptimeSeconds || 0}s) - Server kept awake & hot.`);
    } else {
      console.warn(`[Keep-Alive] Ping received HTTP ${res.status}`);
    }
  } catch (err) {
    // Normal during initial boot or local dev without internet
    console.log(`[Keep-Alive] Heartbeat check (${err.message})`);
  }
}
