import { FREE_SHIPPING_THRESHOLD } from "./commerceConfig.js";

export function buildCartSummary(cartLines) {
  const subtotal = cartLines.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shippingCost;
  const itemCount = cartLines.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const invalidItems = cartLines.filter((item) => item.isUnavailable || item.syncError);
  const unavailableItems = cartLines.filter((item) => item.isUnavailable);
  const freeShippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return {
    subtotal,
    shippingCost,
    total,
    itemCount,
    invalidItems,
    unavailableItems,
    freeShippingRemaining,
    freeShippingProgress:
      subtotal <= 0 ? 0 : Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
  };
}

