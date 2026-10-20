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

        canvas.toBlob((blob) => resolve(blob), 'image/png');
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
 * 1. ZERO URL LINKS in the text message - clean, professional order details only.
 * 2. Instant direct launch into chat with owner (+91 95425 25665) via native whatsapp:// protocol and wa.me.
 * 3. Auto-downloads personalized pass card image to customer's device.
 * 4. Copies pass card image to clipboard on desktop for 1-click Ctrl+V paste.
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

  const encodedText = encodeURIComponent(cleanOrderMessage);

  // 1. Auto-save pass card image to device gallery / downloads
  const handleBlobSave = (blob: Blob) => {
    if (typeof document === 'undefined') return;
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `CoffeeLand-${dining}-Pass-${orderId}.jpg`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          URL.revokeObjectURL(a.href);
          a.remove();
        } catch {}
      }, 3000);
    } catch (e) {
      console.warn('Auto download card failed', e);
    }

    // 2. Direct clipboard copy of pass card image (for instant Ctrl+V into WhatsApp Web)
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).catch(() => {});
      } catch {}
    }
  };

  if (payload.cardBlob) {
    handleBlobSave(payload.cardBlob);
  } else {
    generatePersonalizedCardBlob(payload)
      .then((blob) => {
        if (blob) handleBlobSave(blob);
      })
      .catch(() => {});
  }

  // 3. SYNCHRONOUS, GUARANTEED DIRECT CONNECTION TO CAFE OWNER (+91 95425 25665)
  if (typeof window !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ''
    );

    const waMeUrl = `https://wa.me/${phone}?text=${encodedText}`;
    const nativeAppUrl = `whatsapp://send?phone=${phone}&text=${encodedText}`;

    if (isMobile) {
      // Mobile: direct jump into WhatsApp app chat with owner
      window.location.href = nativeAppUrl;
      setTimeout(() => {
        window.location.href = waMeUrl;
      }, 1000);
    } else {
      // Desktop: open chat with owner directly in new tab or current tab
      const win = window.open(waMeUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waMeUrl;
      }
    }
  }
}

/**
 * Optional Web Share API helper to share the actual pass card image file
 * with the order caption directly through the device's share sheet.
 */
export async function sharePassCardImageWithCaption(payload: WhatsAppOrderPayload): Promise<boolean> {
  const dining = payload.diningOption;
  const emoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;

  let orderDetailsBlock = `🍽️ *Item:* ${payload.itemName} (₹${payload.price})`;
  if (payload.items && payload.items.length > 1) {
    const totalQty = payload.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemListLines = payload.items
      .map((i) => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`)
      .join('\n');
    orderDetailsBlock = `🍽️ *Items (${totalQty} Total):*\n${itemListLines}\n💰 *Total Bill:* ₹${payload.price}`;
  }

  const cleanOrderMessage = `Hello Coffee Land! 👋
I would like to place a ${emoji} *${dining} Order*:
${orderDetailsBlock}
👤 *Guest:* ${payload.customerName || 'Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
${payload.customNote ? `📝 *Details:* ${payload.customNote}\n` : ''}Please confirm my order pass! Thank you.`;

  const blob = payload.cardBlob || (await generatePersonalizedCardBlob(payload));
  if (!blob) return false;

  try {
    const cardFile = new File([blob], `CoffeeLand-${dining}-Pass-${orderId}.jpg`, {
      type: 'image/jpeg',
    });
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [cardFile] })
    ) {
      await navigator.share({
        files: [cardFile],
        text: cleanOrderMessage,
        title: `Coffee Land ${dining} Order Pass`,
      });
      return true;
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.warn('Native file share failed', err);
    }
  }
  return false;
}

