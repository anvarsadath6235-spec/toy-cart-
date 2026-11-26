import { Order } from '@/types';
import { STORE_SETTINGS } from '@/data/products';

export function formatWhatsAppOrderMessage(order: Order): string {
  const dateFormatted = new Date(order.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const itemsList = order.items
    .map((item, idx) => {
      const itemTotal = (item.quantity * item.product.price).toFixed(2);
      return `${idx + 1}. *${item.product.name}*\n   • Qty: ${item.quantity} × ${STORE_SETTINGS.currency}${item.product.price.toFixed(2)} = *${STORE_SETTINGS.currency}${itemTotal}*`;
    })
    .join('\n');

  const giftSection = order.customer.isGift
    ? `\n🎁 *GIFT OPTION:* YES (Free ribbon & card)\n💬 *Personal Note:* "${order.customer.giftMessage || 'Warm wishes!'}"\n`
    : '';

  const paymentLabel =
    order.customer.paymentPreference === 'whatsapp_cod'
      ? 'Cash on Delivery (Pay upon arrival)'
      : order.customer.paymentPreference === 'whatsapp_upi'
      ? 'Instant UPI / Direct Transfer'
      : 'Card / Online Payment Link';

  const shippingText =
    order.shipping === 0
      ? 'FREE (Express Toy Delivery)'
      : `${STORE_SETTINGS.currency}${order.shipping.toFixed(2)}`;

  return `🛍️ *NEW GUEST ORDER — ${STORE_SETTINGS.storeName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.id}
📅 *Date:* ${dateFormatted}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer.fullName}
• *WhatsApp / Phone:* ${order.customer.phone}
${order.customer.email ? `• *Email:* ${order.customer.email}\n` : ''}• *Delivery Address:*
  ${order.customer.address}
  ${order.customer.city}, ${order.customer.postalCode}

━━━━━━━━━━━━━━━━━━━━
🛒 *ORDERED ITEMS (${order.items.reduce((s, i) => s + i.quantity, 0)} total):*
${itemsList}
${giftSection}
━━━━━━━━━━━━━━━━━━━━
💰 *PRICE BREAKDOWN:*
• Subtotal: ${STORE_SETTINGS.currency}${order.subtotal.toFixed(2)}
• Shipping: ${shippingText}
⭐ *GRAND TOTAL:* *${STORE_SETTINGS.currency}${order.total.toFixed(2)}*
• Payment Mode: ${paymentLabel}

━━━━━━━━━━━━━━━━━━━━
🧸 _Thank you for shopping at ${STORE_SETTINGS.storeName}!_
_Please reply to this message to confirm your order & receive live dispatch updates._`;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // Strip any non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WT-${timestamp}${random}`;
}
