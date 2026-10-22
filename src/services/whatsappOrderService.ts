export type DiningOption = 'Dine-In' | 'Delivery' | 'Takeaway';

export interface WhatsAppOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface WhatsAppOrderPayload {
  customerName: string;
  customerPhone?: string;
  itemName: string;
  price: number;
  category?: string;
  diningOption: DiningOption;
  customNote?: string;
  promoCode?: string;
  orderId?: string;
  items?: WhatsAppOrderItem[];
  cardBlob?: Blob | null;
}

const RENDER_BASE_URL = 'https://coffeeland-4yy7.onrender.com';

/**
 * Dynamically draws the customer details and actual item name onto the
 * official reference card template (with real velvet ribbon & bow).
 */
export async function generatePersonalizedCardBlob(payload: WhatsAppOrderPayload): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const dining = payload.diningOption;
  const passSlug = dining === 'Delivery' ? 'delivery' : dining === 'Takeaway' ? 'takeaway' : 'dine-in';
  const baseImgUrl = `/passes/${passSlug}-base.jpg`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 1472;
        canvas.height = img.height || 1044;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        // 1. Draw the reference card base (velvet ribbon, bow, branding, TO: line)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const scale = canvas.width / 736; // scale factor (2x)
        const contentX = 305 * scale;
        const lineStartX = contentX + 70 * scale;
        const maxTextWidth = 680 * scale - lineStartX;

        // 2. Draw FROM: Customer Name and Mobile
        ctx.fillStyle = '#2c1810';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.round(14 * scale)}px Georgia, serif`;
        const customerText = `${payload.customerName || 'Direct Guest'}${
          payload.customerPhone ? ` (${payload.customerPhone})` : ''
        }`;
        ctx.fillText(customerText, lineStartX, 335 * scale + 11 * scale, maxTextWidth);

        // 3. Draw ITEM: Exact Dish Name(s) & Bill Total (NOT generic verified pass)
        ctx.font = `bold ${Math.round(15 * scale)}px Georgia, serif`;
        let itemText = `${payload.itemName} • ₹${payload.price}`;
        if (payload.items && payload.items.length > 1) {
          const names = payload.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');
          const shortNames = names.length > 34 ? names.slice(0, 31) + '...' : names;
          itemText = `${payload.items.length} Items (${shortNames}) • ₹${payload.price}`;
        }
        ctx.fillText(itemText, lineStartX, 385 * scale + 11 * scale, maxTextWidth);

        // 4. Optional Special Note (Table Number / Delivery Address)
        if (payload.customNote) {
          ctx.font = `italic ${Math.round(12 * scale)}px Georgia, serif`;
          ctx.fillStyle = dining === 'Delivery' ? '#0f378c' : dining === 'Takeaway' ? '#0c5a30' : '#780a14';
          ctx.fillText(`Note: ${payload.customNote}`, contentX, 425 * scale + 11 * scale, 680 * scale - contentX);
        }

        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
      } catch (err) {
        console.warn('Canvas card generation failed:', err);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load card base image:', baseImgUrl);
      resolve(null);
    };

    img.src = baseImgUrl;
  });
}

/**
 * Dispatches the order DIRECTLY into the Coffee Land restaurant owner's WhatsApp account:
 * Phone: +91 95425 25665
 * 1. Direct text interaction with the owner (NO image cards in chat).
 * 2. Formatted clearly LINE-BY-LINE instead of continuous text.
 * 3. Uses official emojis: 📝 for order, 🍽️ for dine in, 📦 for take away.
 * 4. Explicitly mentions the selected option color (🔴 Red for Dine-In, 🟢 Green for Takeaway, 🔵 Blue for Delivery).
 */
export function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): void {
  const phone = '919542525665';
  const dining = payload.diningOption;

  // Selected Option Emojis and Color designations
  const optionInfo =
    dining === 'Dine-In'
      ? { emoji: '🍽️', label: 'Dine In', colorTag: '🔴 Red' }
      : dining === 'Takeaway'
      ? { emoji: '📦', label: 'Take Away', colorTag: '🟢 Green' }
      : { emoji: '🚚', label: 'Home Delivery', colorTag: '🔵 Blue' };

  // Current formatted time for owner's reference
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Build line-by-line item list
  let itemsListText = '';
  if (payload.items && payload.items.length > 0) {
    itemsListText = payload.items
      .map((item) => `• ${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`)
      .join('\n');
  } else {
    itemsListText = `• 1x ${payload.itemName} - ₹${payload.price}`;
  }

  // Construct structured line-by-line WhatsApp message
  const lines: string[] = [
    '📝 *NEW ORDER - COFFEE LAND*',
    '',
    `${optionInfo.emoji} *Order Type:* ${optionInfo.label} (${optionInfo.colorTag})`,
    `👤 *Customer Name:* ${payload.customerName || 'Direct Guest'}`,
  ];

  if (payload.customerPhone && payload.customerPhone.trim()) {
    lines.push(`📞 *Phone Number:* ${payload.customerPhone.trim()}`);
  }

  if (payload.customNote && payload.customNote.trim()) {
    const noteIcon = dining === 'Dine-In' ? '🪑' : dining === 'Takeaway' ? '📦' : '🏠';
    lines.push(`${noteIcon} *Order Details:* ${payload.customNote.trim()}`);
  }

  if (payload.promoCode && payload.promoCode.trim()) {
    lines.push(`🏷️ *Promo Code:* ${payload.promoCode.trim()}`);
  }

  lines.push('');
  lines.push('📝 *ITEMS ORDERED:*');
  lines.push(itemsListText);
  lines.push('');
  lines.push(`💰 *Total Bill:* ₹${payload.price}`);
  lines.push(`⏰ *Time:* ${timeString}`);
  lines.push('');
  lines.push('Please confirm this order. Thank you! 🙏');

  const fullOrderMessage = lines.join('\n');

  // Direct WhatsApp dispatch targeting owner (+91 95425 25665)
  const encodedText = encodeURIComponent(fullOrderMessage);
  const directOwnerUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

  if (typeof window !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      window.location.href = directOwnerUrl;
    } else {
      const opened = window.open(directOwnerUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = directOwnerUrl;
      }
    }
  }
}

