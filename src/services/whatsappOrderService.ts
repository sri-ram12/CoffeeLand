export type DiningOption = 'Dine-In' | 'Delivery' | 'Takeaway';

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

        // 3. Draw ITEM: Exact Dish Name & Bill Total (NOT generic verified pass)
        ctx.font = `bold ${Math.round(15 * scale)}px Georgia, serif`;
        const itemText = `${payload.itemName} • ₹${payload.price}`;
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
 * 1. Synchronously opens direct chat with owner's number (no contact picker or popup blocker delay).
 * 2. On mobile, triggers whatsapp://send deep link to jump directly into the owner's chat.
 * 3. Short polite cold message with the live order pass card link for rich media preview.
 * 4. Asynchronously copies the personalized card to clipboard for 1-click Ctrl+V on desktop.
 */
export async function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): Promise<void> {
  const phone = '919542525665';
  const dining = payload.diningOption;
  const emoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;

  // Public card preview URL for WhatsApp OpenGraph preview (renders card banner in WhatsApp)
  const cardPreviewUrl = `${RENDER_BASE_URL}/order-pass?type=${encodeURIComponent(
    dining
  )}&item=${encodeURIComponent(payload.itemName)}&price=${payload.price}&name=${encodeURIComponent(
    payload.customerName || 'VIP Guest'
  )}&id=${orderId}`;

  // Short, polite cold message from customer to restaurant owner
  const shortColdMessage = `${cardPreviewUrl}

Hello Coffee Land! 👋
I would like to place a ${emoji} *${dining} Order*:
🍽️ *Item:* ${payload.itemName} (₹${payload.price})
👤 *Guest:* ${payload.customerName || 'Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
${payload.customNote ? `📝 *Details:* ${payload.customNote}\n` : ''}Please confirm my order pass! Thank you.`;

  const encodedText = encodeURIComponent(shortColdMessage);

  // Direct WhatsApp links targeting owner's exact phone number (+91 95425 25665)
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const nativeAppUrl = `whatsapp://send?phone=${phone}&text=${encodedText}`;
  const webApiUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

  // 1. DIRECT IMMEDIATE CHAT LAUNCH (synchronous, direct to owner)
  if (typeof window !== 'undefined') {
    if (isMobile) {
      // Mobile: whatsapp:// protocol directly jumps into WhatsApp app to the owner's chat
      window.location.href = nativeAppUrl;
      // Fallback to web link if app takes a moment
      setTimeout(() => {
        window.location.href = webApiUrl;
      }, 1500);
    } else {
      // Desktop: opens direct chat with owner in WhatsApp Web
      window.open(webApiUrl, '_blank');
    }
  }

  // 2. Desktop clipboard copy of personalized card image
  generatePersonalizedCardBlob(payload)
    .then((cardBlob) => {
      if (
        cardBlob &&
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof ClipboardItem !== 'undefined'
      ) {
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
      }
    })
    .catch(() => {});
}
