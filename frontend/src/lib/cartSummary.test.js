import { describe, expect, it } from "vitest";
import { buildCartSummary } from "./cartSummary.js";

describe("buildCartSummary", () => {
  it("computes totals, shipping, and item count", () => {
    const summary = buildCartSummary([
      { id: 1, price: 500, quantity: 2 },
      { id: 2, price: 100, quantity: 1 },
    ]);

    expect(summary.subtotal).toBe(1100);
    expect(summary.shippingCost).toBe(4.99);
    expect(summary.total).toBe(1104.99);
    expect(summary.itemCount).toBe(3);
    expect(summary.freeShippingRemaining).toBe(400);
  });

  it("marks invalid and unavailable items", () => {
    const summary = buildCartSummary([
      { id: 1, price: 100, quantity: 1, isUnavailable: true },
      { id: 2, price: 200, quantity: 1, syncError: true },
    ]);

    expect(summary.invalidItems).toHaveLength(2);
    expect(summary.unavailableItems).toHaveLength(1);
  });
});
