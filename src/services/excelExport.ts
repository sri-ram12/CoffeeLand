import * as XLSX from 'xlsx';
import { WhatsAppInquiry, OfferBanner } from '../types/banner';
import { Product, KotOrder } from '../types/product';

/**
 * Filter out any mock dummy test inquiries so user only sees real orders
 */
const cleanInquiries = (inquiries: WhatsAppInquiry[]): WhatsAppInquiry[] => {
  return (inquiries || []).filter(
    (item) =>
      !['inq-101', 'inq-102', 'inq-103'].includes(item.id) &&
      !['Kavita Rao', 'Aditya Varma', 'Suresh Naidu'].includes(item.customerName)
  );
};

/**
 * Export Customer WhatsApp Inquiries to Excel (.xlsx)
 */
export const exportInquiriesToExcel = (inquiries: WhatsAppInquiry[]) => {
  const realInquiries = cleanInquiries(inquiries);

  const data = realInquiries.length > 0
    ? realInquiries.map((item, index) => ({
        'Sl. No': index + 1,
        'Date & Time': new Date(item.timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        'Customer Name': item.customerName || 'Direct Guest',
        'Phone Number': item.customerPhone || 'Direct WhatsApp',
        'Item Ordered / Inquired': item.itemName,
        'Category': item.category || 'Specialty Dish',
        'Dining Option': item.diningOption || 'Dine-In',
        'Pass Card Color': (item.diningOption === 'Delivery' ? 'Blue Card' : item.diningOption === 'Takeaway' ? 'Green Card' : 'Red Card'),
        'Price (₹)': item.price,
        'Inquiry Type': item.inquiryType,
        'Promo Code': item.promoCode || 'N/A',
        'Order Status': item.status,
        'WhatsApp Message': item.message
      }))
    : [{
        'Sl. No': 1,
        'Date & Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        'Customer Name': 'No WhatsApp orders recorded yet today',
        'Phone Number': '-',
        'Item Ordered / Inquired': '-',
        'Category': '-',
        'Price (₹)': 0,
        'Inquiry Type': '-',
        'Promo Code': '-',
        'Order Status': 'Active',
        'WhatsApp Message': 'New customer orders from WhatsApp will appear here automatically.'
      }];

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 8 },  // Sl No
    { wch: 22 }, // Date
    { wch: 22 }, // Customer
    { wch: 18 }, // Phone
    { wch: 28 }, // Item
    { wch: 18 }, // Category
    { wch: 12 }, // Price
    { wch: 16 }, // Type
    { wch: 14 }, // Promo
    { wch: 14 }, // Status
    { wch: 50 }  // Message
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'WhatsApp Orders');

  const filename = `CoffeeLand_WhatsApp_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * Export Counter POS & KOT Offline Orders to Excel (.xlsx)
 */
export const exportPosOrdersToExcel = (orders: KotOrder[]) => {
  const safeOrders = orders || [];

  const data = safeOrders.length > 0
    ? safeOrders.map((ord, index) => ({
        'Sl. No': index + 1,
        'KOT Token': `#KOT-${ord.kotNumber}`,
        'Date & Time': new Date(ord.timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        'Order Type': ord.orderType,
        'Table / Counter': ord.tableNumber || 'N/A',
        'Customer Name': ord.customerName || 'Counter Guest',
        'Phone': ord.customerPhone || 'N/A',
        'Items Breakdown': (ord.items || []).map((i) => `${i.quantity}x ${i.name} (₹${i.price * i.quantity})`).join(' | '),
        'Total Items': (ord.items || []).reduce((sum, i) => sum + i.quantity, 0),
        'Chef Instructions': ord.chefNotes || 'Standard preparation',
        'Total Bill (₹)': ord.totalAmount,
        'Order Status': ord.status
      }))
    : [{
        'Sl. No': 1,
        'KOT Token': 'No offline orders yet',
        'Date & Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        'Order Type': 'Dine-In',
        'Table / Counter': '-',
        'Customer Name': '-',
        'Phone': '-',
        'Items Breakdown': 'No orders punched at POS counter yet',
        'Total Items': 0,
        'Chef Instructions': '-',
        'Total Bill (₹)': 0,
        'Order Status': 'Active'
      }];

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 8 },  // Sl No
    { wch: 14 }, // KOT Token
    { wch: 22 }, // Date
    { wch: 14 }, // Type
    { wch: 16 }, // Table
    { wch: 20 }, // Customer
    { wch: 16 }, // Phone
    { wch: 45 }, // Items Breakdown
    { wch: 12 }, // Total items
    { wch: 25 }, // Chef Instructions
    { wch: 14 }, // Total Bill
    { wch: 14 }  // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Counter POS Orders');

  const filename = `CoffeeLand_Counter_POS_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * Export Master Daily Business & Raw Materials Report to Excel (.xlsx)
 * Multi-sheet workbook: Summary, Offline POS, WhatsApp Orders, Raw Materials
 */
export const exportMasterBusinessReportToExcel = (
  inquiries: WhatsAppInquiry[],
  orders: KotOrder[],
  selectedDate?: string
) => {
  const dateStr = selectedDate || new Date().toISOString().slice(0, 10);
  const realInquiries = cleanInquiries(inquiries);
  const safeOrders = orders || [];

  // Filter by selected date if provided
  const dayInquiries = realInquiries.filter((inq) => inq.timestamp.slice(0, 10) === dateStr);
  const dayOrders = safeOrders.filter((ord) => ord.timestamp.slice(0, 10) === dateStr);

  const targetInquiries = dayInquiries.length > 0 ? dayInquiries : realInquiries;
  const targetOrders = dayOrders.length > 0 ? dayOrders : safeOrders;

  const kotSales = targetOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const waSales = targetInquiries.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
  const totalSales = kotSales + waSales;

  // Aggregate items sold
  const itemsMap: { [key: string]: { name: string; qty: number; category: string } } = {};
  targetOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const key = item.name.toLowerCase();
      if (!itemsMap[key]) itemsMap[key] = { name: item.name, qty: 0, category: item.category };
      itemsMap[key].qty += item.quantity;
    });
  });
  targetInquiries.forEach((inq) => {
    const key = inq.itemName.toLowerCase();
    if (!itemsMap[key]) itemsMap[key] = { name: inq.itemName, qty: 0, category: inq.category || 'Specialty' };
    itemsMap[key].qty += 1;
  });

  const totalDishesSold = Object.values(itemsMap).reduce((sum, item) => sum + item.qty, 0);

  // Compute Raw Materials
  let coffeeCups = 0;
  let milkDrinks = 0;
  let pizzas = 0;
  let burgers = 0;
  let chickenDishes = 0;
  let kunafaCount = 0;
  let sandwichesWraps = 0;

  Object.values(itemsMap).forEach(({ name, qty, category }) => {
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    if (n.includes('espresso') || n.includes('americano')) {
      coffeeCups += qty;
    } else if (n.includes('latte') || n.includes('cappuccino') || n.includes('mocha') || n.includes('shake') || c.includes('cold-coffee') || c.includes('hot-coffee')) {
      coffeeCups += qty;
      milkDrinks += qty;
    }
    if (n.includes('pizza') || c.includes('pizza')) pizzas += qty;
    if (n.includes('burger') || c.includes('burger')) burgers += qty;
    if (n.includes('chicken') || n.includes('non-veg') || c.includes('non-veg')) chickenDishes += qty;
    if (n.includes('kunafa')) kunafaCount += qty;
    if (n.includes('sandwich') || n.includes('wrap') || c.includes('sandwich') || c.includes('wrap')) sandwichesWraps += qty;
  });

  const rawMaterials = [
    {
      'Material Name': 'Single-Origin Arabica Coffee Beans',
      'Category': 'Coffee & Beverages',
      'Quantity Used': parseFloat(((coffeeCups * 18) / 1000).toFixed(2)),
      'Unit': 'kg',
      'Unit Cost (₹)': 1100,
      'Total Cost (₹)': Math.round(((coffeeCups * 18) / 1000) * 1100)
    },
    {
      'Material Name': 'Fresh Full Cream Milk',
      'Category': 'Dairy',
      'Quantity Used': parseFloat((milkDrinks * 0.20).toFixed(2)),
      'Unit': 'Liters',
      'Unit Cost (₹)': 64,
      'Total Cost (₹)': Math.round((milkDrinks * 0.20) * 64)
    },
    {
      'Material Name': 'Fermented Pizza Dough Balls (220g)',
      'Category': 'Bakery',
      'Quantity Used': pizzas,
      'Unit': 'Portions',
      'Unit Cost (₹)': 25,
      'Total Cost (₹)': pizzas * 25
    },
    {
      'Material Name': 'Fresh Mozzarella Cheese Blend',
      'Category': 'Pantry & Cheese',
      'Quantity Used': parseFloat((pizzas * 0.13).toFixed(2)),
      'Unit': 'kg',
      'Unit Cost (₹)': 480,
      'Total Cost (₹)': Math.round((pizzas * 0.13) * 480)
    },
    {
      'Material Name': 'Gourmet Golden Brioche Buns',
      'Category': 'Bakery',
      'Quantity Used': burgers,
      'Unit': 'Pieces',
      'Unit Cost (₹)': 22,
      'Total Cost (₹)': burgers * 22
    },
    {
      'Material Name': 'Fresh Farm Chicken Fillet',
      'Category': 'Poultry & Meat',
      'Quantity Used': parseFloat((chickenDishes * 0.22).toFixed(2)),
      'Unit': 'kg',
      'Unit Cost (₹)': 260,
      'Total Cost (₹)': Math.round((chickenDishes * 0.22) * 260)
    },
    {
      'Material Name': 'Lotus Biscoff Cream & Spread',
      'Category': 'Dessert Pantry',
      'Quantity Used': parseFloat((kunafaCount * 0.05).toFixed(2)),
      'Unit': 'kg',
      'Unit Cost (₹)': 850,
      'Total Cost (₹)': Math.round((kunafaCount * 0.05) * 850)
    },
    {
      'Material Name': 'Artisan Sourdough / Bread',
      'Category': 'Bakery',
      'Quantity Used': sandwichesWraps * 2,
      'Unit': 'Slices',
      'Unit Cost (₹)': 6,
      'Total Cost (₹)': (sandwichesWraps * 2) * 6
    },
    {
      'Material Name': 'Eco Takeaway Boxes & Beverage Cups',
      'Category': 'Packaging',
      'Quantity Used': targetOrders.filter(o => o.orderType !== 'Dine-In').length + targetInquiries.length,
      'Unit': 'Units',
      'Unit Cost (₹)': 12,
      'Total Cost (₹)': (targetOrders.filter(o => o.orderType !== 'Dine-In').length + targetInquiries.length) * 12
    }
  ];

  const wb = XLSX.utils.book_new();

  // Tab 1: Sales Summary
  const summaryRows = [
    { 'Performance Metric': 'Business Report Date', 'Figures / Details': dateStr },
    { 'Performance Metric': 'Total Combined Sales Revenue', 'Figures / Details': `₹${totalSales}` },
    { 'Performance Metric': 'Counter POS & KOT Revenue', 'Figures / Details': `₹${kotSales}` },
    { 'Performance Metric': 'WhatsApp Online Orders Revenue', 'Figures / Details': `₹${waSales}` },
    { 'Performance Metric': 'Total Offline KOT Orders Punched', 'Figures / Details': targetOrders.length },
    { 'Performance Metric': 'Total WhatsApp Customer Orders', 'Figures / Details': targetInquiries.length },
    { 'Performance Metric': 'Total Orders Recorded', 'Figures / Details': targetOrders.length + targetInquiries.length },
    { 'Performance Metric': 'Total Dishes Prepared & Sold', 'Figures / Details': totalDishesSold }
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 36 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Daily Sales Summary');

  // Tab 2: WhatsApp Orders
  const waRows = targetInquiries.map((inq, idx) => ({
    'Sl. No': idx + 1,
    'Time': new Date(inq.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
    'Customer Name': inq.customerName || 'Direct Guest',
    'Phone': inq.customerPhone || 'Via WhatsApp',
    'Item Ordered': inq.itemName,
    'Category': inq.category,
    'Dining Option': inq.diningOption || 'Dine-In',
    'Pass Color': (inq.diningOption === 'Delivery' ? 'Blue Card' : inq.diningOption === 'Takeaway' ? 'Green Card' : 'Red Card'),
    'Price (₹)': inq.price,
    'Promo Code': inq.promoCode || 'N/A',
    'Status': inq.status,
    'Order Note': inq.message
  }));
  const wsWa = XLSX.utils.json_to_sheet(waRows.length > 0 ? waRows : [{ 'Message': 'No WhatsApp orders recorded for this date' }]);
  wsWa['!cols'] = [{ wch: 8 }, { wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsWa, 'WhatsApp Orders');

  // Tab 3: Offline POS Orders
  const kotRows = targetOrders.map((ord, idx) => ({
    'Sl. No': idx + 1,
    'Token #': `#KOT-${ord.kotNumber}`,
    'Time': new Date(ord.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
    'Type': ord.orderType,
    'Table': ord.tableNumber,
    'Customer': ord.customerName || 'Counter Guest',
    'Phone': ord.customerPhone || 'N/A',
    'Items': (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(' | '),
    'Total (₹)': ord.totalAmount,
    'Chef Notes': ord.chefNotes || 'Standard',
    'Status': ord.status
  }));
  const wsKot = XLSX.utils.json_to_sheet(kotRows.length > 0 ? kotRows : [{ 'Message': 'No offline POS orders recorded for this date' }]);
  wsKot['!cols'] = [{ wch: 8 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 45 }, { wch: 12 }, { wch: 25 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsKot, 'Counter POS Orders');

  // Tab 4: Raw Materials Consumption
  const wsRaw = XLSX.utils.json_to_sheet(rawMaterials);
  wsRaw['!cols'] = [{ wch: 36 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsRaw, 'Recipe Raw Materials Usage');

  // Tab 5: User Entered Raw Materials & Expenses
  try {
    const savedMaterialsStr = localStorage.getItem('coffeeland_raw_materials_v1');
    if (savedMaterialsStr) {
      const savedMaterials = JSON.parse(savedMaterialsStr);
      if (Array.isArray(savedMaterials) && savedMaterials.length > 0) {
        const enteredRows = savedMaterials.map((m: any, idx: number) => ({
          'S.No': idx + 1,
          'Material Name': m.name,
          'Category': m.category,
          'Quantity': m.quantity,
          'Unit': m.unit,
          'Cost in Rs (₹)': m.costRs,
          'Requirement Status': m.status,
          'Supplier / Store': m.supplier || '',
          'Date': m.date || dateStr,
          'Kitchen Notes': m.notes || ''
        }));
        const wsEntered = XLSX.utils.json_to_sheet(enteredRows);
        wsEntered['!cols'] = [
          { wch: 6 },
          { wch: 32 },
          { wch: 20 },
          { wch: 10 },
          { wch: 10 },
          { wch: 16 },
          { wch: 20 },
          { wch: 24 },
          { wch: 14 },
          { wch: 28 }
        ];
        XLSX.utils.book_append_sheet(wb, wsEntered, 'Entered Raw Materials Log');
      }
    }
  } catch {}

  const filename = `CoffeeLand_Master_Sales_Report_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
};

/**
 * Export Active Offer Banners to Excel (.xlsx)
 */
export const exportBannersToExcel = (banners: OfferBanner[]) => {
  const data = (banners || []).map((b, index) => ({
    'Sl. No': index + 1,
    'Offer Banner Title': b.title,
    'Subtitle / Tagline': b.subtitle,
    'Item Name': b.itemName,
    'Original Price (₹)': b.originalPrice,
    'Offer Price (₹)': b.offerPrice,
    'Discount / Savings': b.discountLabel,
    'Promo Code': b.promoCode || 'DIRECT_WA',
    'Theme Color': b.themeColor,
    'Active Status': b.isActive ? 'Active' : 'Inactive',
    'Validity Note': b.expiryNote || 'Ongoing'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 26 },
    { wch: 32 },
    { wch: 24 },
    { wch: 18 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Offer Banners');

  const filename = `CoffeeLand_Offer_Banners_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * Export Complete Food Menu Items to Excel (.xlsx)
 */
export const exportMenuToExcel = (products: Product[]) => {
  const data = (products || []).map((p) => ({
    'Item ID': p.id,
    'Dish Name': p.name,
    'Category': p.category,
    'Price (₹)': p.price,
    'Dietary Type': p.isVeg ? 'Vegetarian (Veg)' : 'Non-Vegetarian (Non-Veg)',
    'Badge / Special': p.badge || 'Standard Menu',
    'Prep Time': p.prepTime || '10-15 mins',
    'Calories': p.calories || 'N/A',
    'Portion': p.portion || 'Standard Serving',
    'Menu PDF Page': p.menuPage ? `Page ${p.menuPage}` : 'N/A',
    'Description': p.description
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 30 },
    { wch: 22 },
    { wch: 12 },
    { wch: 24 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
    { wch: 50 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Food Menu Catalog');

  const filename = `CoffeeLand_Complete_Menu_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
