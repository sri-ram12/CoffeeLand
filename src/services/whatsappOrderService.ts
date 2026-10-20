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
 * 1. ZERO URL LINKS in the text message - clean order details text only.
 * 2. On Mobile (Android & iOS): uses Web Share API with the real pass card image file,
 *    placing the order details text down in the message caption under the image.
 * 3. On Desktop: opens direct chat with owner and copies pass card to clipboard for 1-click Ctrl+V.
 */
export function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): void {
  const phone = '919542525665';
  const dining = payload.diningOption;
  const emoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;

  // Build clean message: single item or itemized multi-item list (NO LINK!)
  let orderDetailsBlock = `🍽️ *Item:* ${payload.itemName} (₹${payload.price})`;
  if (payload.items && payload.items.length > 1) {
    const totalQty = payload.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemListLines = payload.items
      .map((i) => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`)
      .join('\n');
    orderDetailsBlock = `🍽️ *Items (${totalQty} Total):*\n${itemListLines}\n💰 *Total Bill:* ₹${payload.price}`;
  }

  // Pure clean text directly from customer to restaurant owner - NO URL LINK!
  const cleanOrderMessage = `Hello Coffee Land! 👋
I would like to place a ${emoji} *${dining} Order*:
${orderDetailsBlock}
👤 *Guest:* ${payload.customerName || 'Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
${payload.customNote ? `📝 *Details:* ${payload.customNote}\n` : ''}Please confirm my order pass! Thank you.`;

  // 1. Try Native Web Share API with Image File (Mobile Chrome/Safari)
  // Attaches the real card image file with the clean order details down in the message caption
  if (payload.cardBlob) {
    try {
      const cardFile = new File([payload.cardBlob], `CoffeeLand-${dining}-Pass-${orderId}.jpg`, {
        type: 'image/jpeg',
      });
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [cardFile] })
      ) {
        navigator
          .share({
            files: [cardFile],
            text: cleanOrderMessage,
            title: `Coffee Land ${dining} Order Pass`,
          })
          .catch((err) => {
            if ((err as Error).name !== 'AbortError') {
              console.warn('Web Share failed, using direct WhatsApp fallback', err);
            }
          });
        return;
      }
    } catch (e) {
      console.warn('File share check failed', e);
    }
  }

  // 2. Direct WhatsApp links targeting owner's exact phone number (+91 95425 25665)
  const encodedText = encodeURIComponent(cleanOrderMessage);
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const directOwnerApiUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

  if (typeof window !== 'undefined') {
    if (isMobile) {
      window.location.href = directOwnerApiUrl;
    } else {
      const opened = window.open(directOwnerApiUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = directOwnerApiUrl;
      }
    }
  }

  // 3. Background copy to clipboard for Desktop (Ctrl+V into chat)
  const cardBlobPromise = payload.cardBlob
    ? Promise.resolve(payload.cardBlob)
    : generatePersonalizedCardBlob(payload);

  cardBlobPromise
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

