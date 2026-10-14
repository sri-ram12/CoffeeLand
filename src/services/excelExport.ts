import * as XLSX from 'xlsx';
import { WhatsAppInquiry, OfferBanner } from '../types/banner';
import { Product } from '../types/product';

/**
 * Export Customer WhatsApp Inquiries to Excel (.xlsx)
 */
export const exportInquiriesToExcel = (inquiries: WhatsAppInquiry[]) => {
  const data = inquiries.map((item, index) => ({
    'Sl. No': index + 1,
    'Date & Time': new Date(item.timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    'Customer / Guest': item.customerName || 'Guest User',
    'Phone / Contact': item.customerPhone || 'Via WhatsApp Direct',
    'Item / Offer Inquired': item.itemName,
    'Category': item.category || 'Specialty Dish',
    'Price (₹)': item.price,
    'Inquiry Type': item.inquiryType,
    'Promo Code': item.promoCode || 'N/A',
    'WhatsApp Message': item.message,
    'Order Status': item.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },  // Sl No
    { wch: 22 }, // Date
    { wch: 20 }, // Customer
    { wch: 22 }, // Phone
    { wch: 28 }, // Item
    { wch: 18 }, // Category
    { wch: 12 }, // Price
    { wch: 16 }, // Type
    { wch: 14 }, // Promo
    { wch: 45 }, // Message
    { wch: 14 }  // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'WhatsApp Inquiries');

  const filename = `CoffeeLand_WhatsApp_Inquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * Export Active Offer Banners to Excel (.xlsx)
 */
export const exportBannersToExcel = (banners: OfferBanner[]) => {
  const data = banners.map((b, index) => ({
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
  const data = products.map((p, index) => ({
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
