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
 * Dispatches the order to WhatsApp with the official reference pass card.
 * 1. Puts the live order-pass OpenGraph URL at the top of the message so WhatsApp
 *    renders the high-resolution reference card banner in the chat bubble.
 * 2. On mobile browsers supporting navigator.share, shares the actual card image file
 *    directly into WhatsApp with the message caption.
 * 3. On desktop browsers, copies the card image to the system clipboard for easy Ctrl+V pasting.
 */
export async function sendOrderToWhatsApp(payload: WhatsAppOrderPayload): Promise<void> {
  const phone = '919542525665';
  const dining = payload.diningOption;
  const tagEmoji = dining === 'Dine-In' ? '🔴' : dining === 'Delivery' ? '🔵' : '🟢';
  const tagColor = dining === 'Dine-In' ? 'RED' : dining === 'Delivery' ? 'BLUE' : 'GREEN';
  const typeLabel =
    dining === 'Dine-In'
      ? 'DINE-IN ORDER'
      : dining === 'Delivery'
      ? 'HOME DELIVERY ORDER'
      : 'TAKEAWAY PARCEL ORDER';
  const subLabel =
    dining === 'Dine-In'
      ? 'Table Service Pass'
      : dining === 'Delivery'
      ? 'Doorstep Express Pass'
      : 'Express Counter Parcel';

  const orderId = payload.orderId || `CL-${Date.now().toString().slice(-6)}`;
  const passSlug = dining === 'Delivery' ? 'delivery' : dining === 'Takeaway' ? 'takeaway' : 'dine-in';

  // The public preview link for WhatsApp OpenGraph card preview
  const cardPreviewUrl = `${RENDER_BASE_URL}/order-pass?type=${encodeURIComponent(
    dining
  )}&item=${encodeURIComponent(payload.itemName)}&price=${payload.price}&name=${encodeURIComponent(
    payload.customerName || 'VIP Guest'
  )}&id=${orderId}`;

  // Formatted order message with the card URL at the very top for WhatsApp Rich Link Preview
  const orderWhatsAppText = `${cardPreviewUrl}

${tagEmoji}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${tagEmoji}
   *${typeLabel} (${tagColor} PASS)*
   _${subLabel}_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *TO:* Coffee Land Resto & Cafe
        Temples Bypass Rd, Sangivalasa, Vizag
👤 *FROM:* ${payload.customerName || 'Direct Guest'}${payload.customerPhone ? ` (${payload.customerPhone})` : ''}
────────────────────────────
🍽️ *ITEM:* ${payload.itemName}
🏷️ *CATEGORY:* ${payload.category || 'Specialty Dish'}
💰 *TOTAL BILL:* ₹${payload.price}${payload.promoCode ? ` (Promo: ${payload.promoCode})` : ''}
${payload.customNote ? `📝 *DETAILS:* ${payload.customNote}\n` : ''}⏰ *TIME:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Please prepare & confirm this ${typeLabel}! ✨`;

  // Try to fetch the local/hosted pass image
  let imageFile: File | null = null;
  try {
    const imgUrl = `/passes/${passSlug}.jpg`;
    const res = await fetch(imgUrl);
    if (res.ok) {
      const blob = await res.blob();
      imageFile = new File([blob], `${passSlug}-order-pass.jpg`, { type: 'image/jpeg' });

      // If on desktop, try copying the image to clipboard so the user can easily paste (Ctrl+V) into WhatsApp Web
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          // Convert to PNG blob if needed since some browsers require image/png for clipboard
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = URL.createObjectURL(blob);
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          canvas.width = img.width || 736;
          canvas.height = img.height || 522;
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
          // Non-blocking
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch pass card image for sharing:', err);
  }

  // 1. If mobile device supports Web Share API with files, share directly to WhatsApp
  if (
    typeof navigator !== 'undefined' &&
    imageFile &&
    navigator.canShare &&
    navigator.canShare({ files: [imageFile] })
  ) {
    try {
      await navigator.share({
        files: [imageFile],
        text: orderWhatsAppText,
        title: `Coffee Land ${dining} Order Pass`,
      });
      return;
    } catch (shareErr: unknown) {
      // If user cancelled share sheet, return silently; otherwise fall back to wa.me
      if (shareErr instanceof Error && shareErr.name === 'AbortError') {
        return;
      }
      console.warn('Web Share failed, falling back to wa.me URL:', shareErr);
    }
  }

  // 2. Standard WhatsApp deep-link with the card preview URL included
  const encodedText = encodeURIComponent(orderWhatsAppText);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
}
