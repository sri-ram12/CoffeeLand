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
 * 1. Synchronously opens direct chat with owner's number (zero popup blocker delay, no contact picker).
 * 2. On mobile, directly launches the owner's conversation.
 * 3. Short polite cold message with the live order pass card link for rich media preview.
 * 4. Asynchronously copies the personalized card to clipboard for 1-click Ctrl+V on desktop.
 */
export function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): void {
  const phone = '919542525665';
  const dining = payload.diningOption;
  const emoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;

  // Public card preview URL for WhatsApp OpenGraph preview (renders card banner in WhatsApp)
  const itemSummary =
    payload.items && payload.items.length > 1
      ? `${payload.items.length} Items Order`
      : payload.itemName;

  const cardPreviewUrl = `${RENDER_BASE_URL}/order-pass?type=${encodeURIComponent(
    dining
  )}&item=${encodeURIComponent(itemSummary)}&price=${payload.price}&name=${encodeURIComponent(
    payload.customerName || 'VIP Guest'
  )}&id=${orderId}`;

  // Build clean message: single item or itemized multi-item list
  let orderDetailsBlock = `🍽️ *Item:* ${payload.itemName} (₹${payload.price})`;
  if (payload.items && payload.items.length > 1) {
    const totalQty = payload.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemListLines = payload.items
      .map((i) => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`)
      .join('\n');
    orderDetailsBlock = `🍽️ *Items (${totalQty} Total):*\n${itemListLines}\n💰 *Total Bill:* ₹${payload.price}`;
  }

  // Short, polite cold message directly from customer to restaurant owner
  const shortColdMessage = `${cardPreviewUrl}

Hello Coffee Land! 👋
I would like to place a ${emoji} *${dining} Order*:
${orderDetailsBlock}
👤 *Guest:* ${payload.customerName || 'Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
${payload.customNote ? `📝 *Details:* ${payload.customNote}\n` : ''}Please confirm my order pass! Thank you.`;

  const encodedText = encodeURIComponent(shortColdMessage);

  // Direct WhatsApp links targeting owner's exact phone number (+91 95425 25665)
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const directOwnerAppUrl = `whatsapp://send?phone=${phone}&text=${encodedText}`;
  const directOwnerApiUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

  // 1. SYNCHRONOUS IMMEDIATE DISPATCH DIRECTLY TO OWNER (+91 95425 25665)
  if (typeof window !== 'undefined') {
    if (isMobile) {
      // Mobile: directly jump to WhatsApp app chat with owner
      window.location.href = directOwnerApiUrl;
    } else {
      // Desktop: open chat with owner in WhatsApp Web
      const opened = window.open(directOwnerApiUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = directOwnerApiUrl;
      }
    }
  }

  // 2. Background non-blocking task: generate personalized card & copy to clipboard
  generatePersonalizedCardBlob(payload)
    .then((cardBlob) => {
      if (cardBlob && typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = URL.createObjectURL(cardBlob);
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                  navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]).catch(() => {});
                }
              }, 'image/png');
            }
          };
        } catch {
          // Non-blocking clipboard copy
        }
      }
    })
    .catch(() => {});
}
