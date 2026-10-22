import { KotOrder } from '../types/product';

export type ThermalPaperWidth = '80mm' | '58mm';

/**
 * Helper to format date and time in DD/MM/YY HH:mm (24-hour)
 */
export function formatReceiptDateTime(timestamp: string | Date): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Helper to format table display cleanly (e.g. Table No: 4)
 */
export function formatTableDisplay(tableNumber?: string, orderType?: string): string {
  const table = (tableNumber || '').trim();
  if (!table) {
    return orderType === 'Dine-In' ? 'Table No: 1' : (orderType || 'Dine In');
  }
  const lower = table.toLowerCase();
  if (lower.startsWith('table')) {
    return table.replace(/table\s*:?\s*/i, 'Table No: ');
  }
  if (orderType === 'Dine-In' && !isNaN(Number(table))) {
    return `Table No: ${table}`;
  }
  return table;
}

/**
 * Generate clean, lightweight HTML content for Kitchen Order Ticket (KOT)
 * Matches the reference format:
 *   Running Table
 *   DD/MM/YY HH:mm
 *   KOT - XX
 *   Dine In
 *   Table No: X
 *   -----------------------
 *   Item    Special Note    Qty.
 */
export function generateKotHtml(order: KotOrder, paperWidth: ThermalPaperWidth = '80mm'): string {
  const is58 = paperWidth === '58mm';
  const widthMm = is58 ? '48mm' : '72mm';
  const formattedDateTime = formatReceiptDateTime(order.timestamp);
  const tableDisplay = formatTableDisplay(order.tableNumber, order.orderType);
  const orderTypeDisplay = order.orderType === 'Dine-In' ? 'Dine In' : order.orderType;
  const statusHeader = order.orderType === 'Dine-In' ? 'Running Table' : orderTypeDisplay;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>KOT #${order.kotNumber}</title>
        <style>
          @page {
            size: ${is58 ? '58mm auto' : '80mm auto'};
            margin: 0mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: auto !important;
            min-height: 0 !important;
            background: #ffffff;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .kot-container {
            width: ${widthMm};
            max-width: 100%;
            margin: 0 auto;
            padding: 1.5mm 1mm;
            text-align: center;
          }
          .header-status {
            font-size: ${is58 ? '13px' : '15px'};
            font-weight: 600;
            margin-bottom: 1px;
          }
          .header-time {
            font-size: ${is58 ? '11px' : '13px'};
            margin-bottom: 1px;
            color: #111;
          }
          .header-kot {
            font-size: ${is58 ? '15px' : '17px'};
            font-weight: 700;
            margin-bottom: 1px;
          }
          .header-type {
            font-size: ${is58 ? '13px' : '15px'};
            font-weight: 700;
            margin-bottom: 1px;
          }
          .header-table {
            font-size: ${is58 ? '14px' : '16px'};
            font-weight: 800;
            margin-bottom: 3px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 2px 0;
          }
          th {
            font-size: ${is58 ? '10px' : '12px'};
            font-weight: 700;
            padding: 3px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }
          td {
            font-size: ${is58 ? '11px' : '13px'};
            padding: 3px 0;
            vertical-align: top;
          }
          .col-item {
            text-align: left;
            width: 54%;
            font-weight: 700;
            word-break: break-word;
          }
          .col-note {
            text-align: center;
            width: 28%;
            font-weight: normal;
            font-size: ${is58 ? '10px' : '11px'};
            word-break: break-word;
          }
          .col-qty {
            text-align: right;
            width: 18%;
            font-weight: 700;
          }
          .notes-box {
            border-top: 1px dashed #000;
            margin-top: 4px;
            padding-top: 3px;
            font-size: ${is58 ? '10px' : '12px'};
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="kot-container">
          <div class="header-status">${statusHeader}</div>
          <div class="header-time">${formattedDateTime}</div>
          <div class="header-kot">KOT - ${order.kotNumber}</div>
          <div class="header-type">${orderTypeDisplay}</div>
          <div class="header-table">${tableDisplay}</div>

          <table>
            <thead>
              <tr>
                <th class="col-item">Item</th>
                <th class="col-note" style="line-height: 1.1;">Special<br/>Note</th>
                <th class="col-qty">Qty.</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td class="col-item">${item.name}</td>
                  <td class="col-note">${item.notes && item.notes.trim() ? item.notes : '--'}</td>
                  <td class="col-qty">${item.quantity}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          ${order.chefNotes ? `
            <div class="notes-box">
              <strong>Special Note:</strong> ${order.chefNotes}
            </div>
          ` : ''}

          ${order.customerName && order.customerName !== 'Guest Customer' ? `
            <div class="notes-box" style="font-size: ${is58 ? '9px' : '11px'}; text-align: center;">
              Guest: ${order.customerName}${order.customerPhone ? ` • ${order.customerPhone}` : ''}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate clean, compact HTML content for Customer Bill / Receipt
 */
export function generateBillHtml(order: KotOrder, paperWidth: ThermalPaperWidth = '80mm'): string {
  const is58 = paperWidth === '58mm';
  const widthMm = is58 ? '48mm' : '72mm';
  const formattedDateTime = formatReceiptDateTime(order.timestamp);
  const tableDisplay = formatTableDisplay(order.tableNumber, order.orderType);
  const orderTypeDisplay = order.orderType === 'Dine-In' ? 'Dine In' : order.orderType;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Bill #${order.kotNumber}</title>
        <style>
          @page {
            size: ${is58 ? '58mm auto' : '80mm auto'};
            margin: 0mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: auto !important;
            min-height: 0 !important;
            background: #ffffff;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .bill-container {
            width: ${widthMm};
            max-width: 100%;
            margin: 0 auto;
            padding: 2mm 1mm;
          }
          .text-center { text-align: center; }
          .dashed-divider {
            border-bottom: 1px dashed #000;
            margin: 4px 0;
            width: 100%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 3px 0;
          }
          th {
            font-size: ${is58 ? '9px' : '11px'};
            font-weight: 700;
            padding: 3px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }
          td {
            font-size: ${is58 ? '10px' : '12px'};
            padding: 3px 0;
            vertical-align: top;
          }
          .grand-total {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 4px 0;
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
            font-weight: 800;
            font-size: ${is58 ? '13px' : '15px'};
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="text-center" style="font-size: ${is58 ? '15px' : '17px'}; font-weight: 800; letter-spacing: 0.5px;">
            COFFEE LAND
          </div>
          <div class="text-center" style="font-size: ${is58 ? '9px' : '11px'}; margin-bottom: 3px; color: #333;">
            Specialty Coffee & Cafe • Sangivalasa
          </div>

          <div class="dashed-divider"></div>

          <div style="font-size: ${is58 ? '10px' : '11px'}; line-height: 1.35;">
            <div style="display: flex; justify-content: space-between;">
              <span><strong>Bill #:</strong> #${order.kotNumber}</span>
              <span><strong>${orderTypeDisplay.toUpperCase()}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>${tableDisplay}</strong></span>
              <span>${formattedDateTime}</span>
            </div>
            ${order.customerName && order.customerName !== 'Guest Customer' ? `<div><strong>Customer:</strong> ${order.customerName}</div>` : ''}
            ${order.customerPhone ? `<div><strong>Phone:</strong> ${order.customerPhone}</div>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left; width: 50%;">Item</th>
                <th style="text-align: center; width: 14%;">Qty</th>
                <th style="text-align: right; width: 18%;">Price</th>
                <th style="text-align: right; width: 18%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="text-align: left; font-weight: bold; word-break: break-word;">${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price}</td>
                  <td style="text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
                </tr>
                ${item.notes ? `
                  <tr>
                    <td colspan="4" style="font-size: 9px; font-style: italic; padding-left: 6px; padding-bottom: 2px;">
                      * ${item.notes}
                    </td>
                  </tr>
                ` : ''}
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="grand-total">
            <span>NET PAYABLE:</span>
            <span>₹${order.totalAmount}</span>
          </div>

          <div class="text-center" style="font-weight: 700; font-size: ${is58 ? '10px' : '11px'}; margin-top: 5px;">
            THANK YOU FOR VISITING!
          </div>
          <div class="text-center" style="font-size: ${is58 ? '8px' : '9px'}; color: #444;">
            Please Visit Coffee Land Again
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate plain text slip representation (for WhatsApp or text-based Bluetooth terminals)
 */
export function generatePlainTextTicket(mode: 'kot' | 'bill', order: KotOrder): string {
  const line = '--------------------------------';
  const formattedDateTime = formatReceiptDateTime(order.timestamp);
  const tableDisplay = formatTableDisplay(order.tableNumber, order.orderType);
  const orderTypeDisplay = order.orderType === 'Dine-In' ? 'Dine In' : order.orderType;

  if (mode === 'kot') {
    return [
      '        Running Table',
      `       ${formattedDateTime}`,
      `          KOT - ${order.kotNumber}`,
      `           ${orderTypeDisplay}`,
      `         ${tableDisplay}`,
      line,
      'Item            Special     Qty.',
      '                Note',
      line,
      ...order.items.map((i) => {
        const name = i.name.slice(0, 15).padEnd(15, ' ');
        const note = (i.notes && i.notes.trim() ? i.notes.slice(0, 11) : '--').padEnd(11, ' ');
        const qty = `${i.quantity}`.padStart(4, ' ');
        return `${name} ${note} ${qty}`;
      }),
      order.chefNotes ? `${line}\nSpecial Note: ${order.chefNotes}` : '',
      order.customerName && order.customerName !== 'Guest Customer' ? `${line}\nGuest: ${order.customerName} ${order.customerPhone || ''}` : '',
      line
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    '        COFFEE LAND CAFE',
    '        CUSTOMER RECEIPT',
    line,
    `BILL #: #${order.kotNumber}`,
    `${tableDisplay} (${orderTypeDisplay})`,
    `DATE  : ${formattedDateTime}`,
    order.customerName && order.customerName !== 'Guest Customer' ? `GUEST : ${order.customerName}` : '',
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
    line,
    '  THANK YOU! VISIT AGAIN!',
    line
  ]
    .filter(Boolean)
    .join('\n');
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
