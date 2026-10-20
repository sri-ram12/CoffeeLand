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
 * Dispatches the order to WhatsApp with the personalized reference pass card:
 * 1. Shares the actual personalized card image with customer name and item name.
 * 2. Sends a short, polite cold message from customer to restaurant owner.
 * 3. Includes the live order-pass URL so WhatsApp generates the card preview banner.
 * 4. On desktop, copies the personalized card to clipboard for 1-click Ctrl+V pasting.
 */
export async function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): Promise<void> {
  const phone = '919542525665';
  const dining = payload.diningOption;
  const emoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const passSlug = dining === 'Delivery' ? 'delivery' : dining === 'Takeaway' ? 'takeaway' : 'dine-in';
  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;

  // Public card preview URL for WhatsApp OpenGraph preview
  const cardPreviewUrl = `${RENDER_BASE_URL}/order-pass?type=${encodeURIComponent(
    dining
  )}&item=${encodeURIComponent(payload.itemName)}&price=${payload.price}&name=${encodeURIComponent(
    payload.customerName || 'VIP Guest'
  )}&id=${orderId}`;

  // Short, polite cold message from customer to restaurant owner (details are already on the card!)
  let shortColdMessage = `${cardPreviewUrl}

Hello Coffee Land! 👋
I would like to place a ${emoji} *${dining} Order*:
🍽️ *Item:* ${payload.itemName} (₹${payload.price})
👤 *Guest:* ${payload.customerName || 'Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
${payload.customNote ? `📝 *Details:* ${payload.customNote}\n` : ''}Please confirm my order pass! Thank you.`;

  // Generate personalized card image with customer name and item name
  let cardFile: File | null = null;
  let cardBlob: Blob | null = null;

  try {
    cardBlob = await generatePersonalizedCardBlob(payload);
    if (!cardBlob) {
      // Fallback to pre-rendered default pass
      const res = await fetch(`/passes/${passSlug}.jpg`);
      if (res.ok) cardBlob = await res.blob();
    }

    if (cardBlob) {
      const fileName = `${dining}_Pass_${payload.itemName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      cardFile = new File([cardBlob], fileName, { type: 'image/jpeg' });

      // On desktop browsers: copy card image directly to clipboard so user can press Ctrl+V into WhatsApp Web
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = URL.createObjectURL(cardBlob);
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(async (pngBlob) => {
              if (pngBlob) {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]).catch(() => {});
              }
            }, 'image/png');
          }
        } catch {
          // Non-blocking clipboard copy
        }
      }
    }
  } catch (err) {
    console.warn('Card image preparation error:', err);
  }

  // 1. Mobile Web Share API: Directly attaches the personalized card image into WhatsApp with the cold message caption
  if (
    typeof navigator !== 'undefined' &&
    cardFile &&
    navigator.canShare &&
    navigator.canShare({ files: [cardFile] })
  ) {
    try {
      await navigator.share({
        files: [cardFile],
        text: shortColdMessage,
        title: `Coffee Land ${dining} Order Pass`,
      });
      return;
    } catch (shareErr: unknown) {
      if (shareErr instanceof Error && shareErr.name === 'AbortError') {
        return; // User cancelled share dialog
      }
      console.warn('Web Share fallback:', shareErr);
    }
  }

  // 2. Standard WhatsApp deep-link with the card preview URL and short cold message
  const encodedText = encodeURIComponent(shortColdMessage);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
}
