import { KotOrder } from '../types/product';

export type ThermalPaperWidth = '80mm' | '58mm';

/**
 * Generate clean HTML content for Kitchen Order Ticket (KOT)
 */
export function generateKotHtml(order: KotOrder, paperWidth: ThermalPaperWidth = '80mm'): string {
  const is58 = paperWidth === '58mm';
  const widthMm = is58 ? '48mm' : '72mm';
  const fontSize = is58 ? '11px' : '13px';
  const titleSize = is58 ? '14px' : '16px';
  const tokenSize = is58 ? '18px' : '22px';

  const formattedDate = new Date(order.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>KOT #${order.kotNumber}</title>
        <style>
          @page {
            size: ${is58 ? '58mm 200mm' : '80mm 200mm'};
            margin: 0mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            margin: 0;
            padding: ${is58 ? '2mm' : '3mm'};
            width: ${widthMm};
            max-width: 100%;
            background: #ffffff;
            color: #000000;
            font-family: 'Courier New', Courier, monospace;
            font-size: ${fontSize};
            line-height: 1.25;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .font-black { font-weight: 900; }
          .divider-solid { border-bottom: 2px solid #000; margin: 4px 0; }
          .divider-dashed { border-bottom: 1px dashed #000; margin: 4px 0; }
          .divider-dotted { border-bottom: 1px dotted #000; margin: 3px 0; }
          .token-box {
            border: 2px solid #000;
            padding: 4px;
            margin: 4px 0;
            text-align: center;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin: 4px 0;
          }
          .item-qty {
            font-size: ${titleSize};
            font-weight: 900;
            min-width: 28px;
          }
          .item-name {
            flex: 1;
            padding: 0 4px;
            font-weight: bold;
          }
          .item-notes {
            font-size: ${is58 ? '9px' : '10px'};
            font-style: italic;
            padding-left: 28px;
            color: #111;
          }
          .badge {
            display: inline-block;
            border: 1px solid #000;
            padding: 1px 4px;
            font-weight: bold;
            font-size: ${is58 ? '9px' : '10px'};
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="text-center font-black" style="font-size: ${titleSize}; letter-spacing: 1px;">
          COFFEE LAND
        </div>
        <div class="text-center font-bold" style="font-size: ${is58 ? '10px' : '11px'};">
          * KITCHEN ORDER TICKET (KOT) *
        </div>

        <div class="divider-solid"></div>

        <div class="token-box">
          <div style="font-size: ${is58 ? '11px' : '12px'}; font-weight: bold;">TOKEN NUMBER</div>
          <div class="font-black" style="font-size: ${tokenSize};">#KOT-${order.kotNumber}</div>
        </div>

        <div style="font-size: ${is58 ? '10px' : '11px'};">
          <div><strong>TYPE:</strong> [ ${order.orderType.toUpperCase()} ]</div>
          <div><strong>TABLE/REF:</strong> ${order.tableNumber.toUpperCase()}</div>
          <div><strong>DATE:</strong> ${formattedDate} ${formattedTime}</div>
          ${order.customerName && order.customerName !== 'Guest Customer' ? `<div><strong>GUEST:</strong> ${order.customerName}</div>` : ''}
          ${order.customerPhone ? `<div><strong>PHONE:</strong> ${order.customerPhone}</div>` : ''}
        </div>

        <div class="divider-dashed"></div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: ${is58 ? '9px' : '10px'};">
          <span>QTY & ITEM NAME</span>
          <span>STATUS</span>
        </div>

        <div class="divider-solid"></div>

        <!-- ITEMS LIST -->
        <div>
          ${order.items
            .map(
              (item) => `
            <div style="margin-bottom: 5px;">
              <div class="item-row">
                <span class="item-qty">${item.quantity}x</span>
                <span class="item-name">${item.name}</span>
                <span class="badge">COOK</span>
              </div>
              ${item.notes ? `<div class="item-notes">&#8627; NOTES: ${item.notes}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>

        <div class="divider-dashed"></div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: ${is58 ? '10px' : '11px'};">
          <span>TOTAL ITEMS: ${order.items.length}</span>
          <span>TOTAL QTY: ${totalQty}</span>
        </div>

        ${order.chefNotes ? `
          <div class="divider-dotted"></div>
          <div style="background: #f0f0f0; border: 1px solid #000; padding: 3px; font-weight: bold; font-size: ${is58 ? '9px' : '11px'};">
            CHEF NOTE: ${order.chefNotes}
          </div>
        ` : ''}

        <div class="divider-solid"></div>

        <div class="text-center font-bold" style="font-size: ${is58 ? '9px' : '10px'}; margin-top: 4px;">
          --- KITCHEN COPY • PUNCHED AT CAFE ---
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate clean HTML content for Customer Bill / Receipt
 */
export function generateBillHtml(order: KotOrder, paperWidth: ThermalPaperWidth = '80mm'): string {
  const is58 = paperWidth === '58mm';
  const widthMm = is58 ? '48mm' : '72mm';
  const fontSize = is58 ? '10px' : '12px';
  const titleSize = is58 ? '15px' : '17px';

  const formattedDate = new Date(order.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Bill #${order.kotNumber}</title>
        <style>
          @page {
            size: ${is58 ? '58mm 200mm' : '80mm 200mm'};
            margin: 0mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            margin: 0;
            padding: ${is58 ? '2mm' : '3mm'};
            width: ${widthMm};
            max-width: 100%;
            background: #ffffff;
            color: #000000;
            font-family: 'Courier New', Courier, monospace;
            font-size: ${fontSize};
            line-height: 1.25;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .font-black { font-weight: 900; }
          .divider-solid { border-bottom: 2px solid #000; margin: 4px 0; }
          .divider-dashed { border-bottom: 1px dashed #000; margin: 4px 0; }
          .table-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: ${is58 ? '9px' : '10px'};
          }
          .bill-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          .grand-total-box {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 4px 0;
            margin: 6px 0;
            display: flex;
            justify-content: space-between;
            font-weight: 900;
            font-size: ${is58 ? '13px' : '15px'};
          }
        </style>
      </head>
      <body>
        <div class="text-center font-black" style="font-size: ${titleSize};">
          COFFEE LAND
        </div>
        <div class="text-center" style="font-size: ${is58 ? '8px' : '10px'};">
          Specialty Coffee, Shakes & Artisan Cafe<br />
          Sangivalasa, Visakhapatnam, AP<br />
          WhatsApp: +91 98765 43210
        </div>

        <div class="divider-solid"></div>

        <div style="font-size: ${is58 ? '9px' : '10px'};">
          <div style="display: flex; justify-content: space-between;">
            <span><strong>RECEIPT #:</strong> #${order.kotNumber}</span>
            <span><strong>${order.orderType.toUpperCase()}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span><strong>TABLE:</strong> ${order.tableNumber}</span>
            <span><strong>TIME:</strong> ${formattedTime}</span>
          </div>
          <div><strong>DATE:</strong> ${formattedDate}</div>
          ${order.customerName && order.customerName !== 'Guest Customer' ? `<div><strong>CUSTOMER:</strong> ${order.customerName}</div>` : ''}
          ${order.customerPhone ? `<div><strong>PHONE:</strong> ${order.customerPhone}</div>` : ''}
        </div>

        <div class="divider-dashed"></div>

        <div class="table-header">
          <span style="flex: 2;">ITEM</span>
          <span style="flex: 1; text-align: center;">QTY</span>
          <span style="flex: 1; text-align: right;">PRICE</span>
          <span style="flex: 1; text-align: right;">TOTAL</span>
        </div>

        <div class="divider-dashed"></div>

        <div>
          ${order.items
            .map(
              (item) => `
            <div class="bill-row">
              <span style="flex: 2; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</span>
              <span style="flex: 1; text-align: center;">${item.quantity}</span>
              <span style="flex: 1; text-align: right;">₹${item.price}</span>
              <span style="flex: 1; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</span>
            </div>
            ${item.notes ? `<div style="font-size: 8px; font-style: italic; padding-left: 8px;">* ${item.notes}</div>` : ''}
          `
            )
            .join('')}
        </div>

        <div class="grand-total-box">
          <span>NET PAYABLE:</span>
          <span>₹${order.totalAmount}</span>
        </div>

        <div class="text-center font-bold" style="font-size: ${is58 ? '9px' : '10px'}; margin-top: 6px;">
          THANK YOU FOR VISITING!
        </div>
        <div class="text-center" style="font-size: ${is58 ? '8px' : '9px'};">
          Please Visit Coffee Land Again • Have a Great Day!
        </div>
        <div class="divider-dashed"></div>
      </body>
    </html>
  `;
}

/**
 * Generate plain text slip representation (for WhatsApp or text-based Bluetooth terminals)
 */
export function generatePlainTextTicket(mode: 'kot' | 'bill', order: KotOrder): string {
  const line = '--------------------------------';
  const dline = '================================';
  const formattedTime = new Date(order.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  if (mode === 'kot') {
    return [
      dline,
      '       COFFEE LAND CAFE',
      '   KITCHEN ORDER TICKET (KOT)',
      dline,
      `TOKEN: #KOT-${order.kotNumber}`,
      `TYPE : ${order.orderType.toUpperCase()} | ${order.tableNumber.toUpperCase()}`,
      `TIME : ${formattedTime}`,
      order.customerName && order.customerName !== 'Guest Customer' ? `GUEST: ${order.customerName}` : '',
      line,
      'QTY   ITEM',
      line,
      ...order.items.map((i) => ` ${i.quantity}x  ${i.name}${i.notes ? `\n      * Note: ${i.notes}` : ''}`),
      line,
      `TOTAL ITEMS: ${order.items.length}`,
      order.chefNotes ? `CHEF NOTE: ${order.chefNotes}` : '',
      dline
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    dline,
    '       COFFEE LAND CAFE',
    '       CUSTOMER RECEIPT',
    dline,
    `BILL : #${order.kotNumber}`,
    `TABLE: ${order.tableNumber} (${order.orderType})`,
    `TIME : ${formattedTime}`,
    line,
    'ITEM                    QTY  AMT',
    line,
    ...order.items.map((i) => {
      const name = i.name.slice(0, 20).padEnd(20, ' ');
      const qty = `${i.quantity}`.padStart(3, ' ');
      const amt = `₹${i.price * i.quantity}`.padStart(5, ' ');
      return `${name} ${qty} ${amt}`;
    }),
    line,
    `TOTAL PAYABLE:            ₹${order.totalAmount}`,
    dline,
    '  THANK YOU! VISIT AGAIN!',
    dline
  ].join('\n');
}

/**
 * Print thermal slip using a sandboxed hidden iframe.
 * This completely prevents parent CSS (@media print, hidden main, modals)
 * from suppressing the print output and guarantees NO BLANK PAGES!
 */
export function printThermalSlip(
  mode: 'kot' | 'bill',
  order: KotOrder,
  paperWidth: ThermalPaperWidth = '80mm'
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const html = mode === 'kot' ? generateKotHtml(order, paperWidth) : generateBillHtml(order, paperWidth);

      // Remove any existing print iframes to avoid leaks
      const existingFrame = document.getElementById('coffeeland-thermal-print-frame');
      if (existingFrame && existingFrame.parentNode) {
        existingFrame.parentNode.removeChild(existingFrame);
      }

      // Create isolated invisible iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'coffeeland-thermal-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';

      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!frameDoc) {
        console.error('Cannot access iframe document for printing');
        resolve(false);
        return;
      }

      frameDoc.open();
      frameDoc.write(html);
      frameDoc.close();

      // Allow fonts and DOM to settle before invoking browser print dialog
      setTimeout(() => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (printErr) {
          console.warn('Iframe print error, falling back to window.print():', printErr);
          window.print();
          resolve(true);
        } finally {
          // Clean up the iframe after print dialog completes
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 3000);
        }
      }, 250);
    } catch (e) {
      console.error('Failed to trigger thermal receipt print:', e);
      resolve(false);
    }
  });
}
