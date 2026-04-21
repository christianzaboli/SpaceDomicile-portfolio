import { getJson, postJson } from "./http.js";

function asCurrencyNumber(value) {
  return Number(value || 0);
}

export async function fetchGalaxies() {
  return getJson("/api/galaxies");
}

export async function fetchGalaxy(slug) {
  return getJson(`/api/galaxies/${slug}`);
}

export async function fetchAllPlanets() {
  return getJson("/api/planets");
}

export async function fetchPlanet(slug) {
  return getJson(`/api/planets/${slug}`);
}

export async function fetchPlanetsByGalaxy(galaxySlug) {
  return getJson(`/api/planets/from/${galaxySlug}`);
}

export async function fetchFilteredPlanets(filters) {
  return getJson("/api/planets/filter", { params: filters });
}

export async function fetchPlanetStacks(planetSlug) {
  return getJson(`/api/stacks/planet/${planetSlug}`);
}

export async function fetchStackBySlug(stackSlug) {
  return getJson(`/api/stacks/${stackSlug}`);
}

export async function fetchPaymentConfig() {
  return getJson("/api/payment/config");
}

export async function fetchPaymentToken() {
  return getJson("/api/payment/token");
}

export async function createOrder(payload) {
  const data = await postJson("/api/create_order", payload);
  return {
    invoiceId: data?.invoice?.id,
    certificates: data?.certificates ?? [],
    raw: data,
  };
}

export async function submitPayment(payload) {
  return postJson("/api/payment/checkout", payload);
}

export async function purchaseStackQuantity(stackId, quantity) {
  return postJson(`/api/stacks/${stackId}/purchase`, { quantity });
}

export async function reconcileCartLines(lines) {
  const settled = await Promise.allSettled(
    lines.map(async (line) => {
      if (!line.slug) {
        return {
          ...line,
          isUnavailable: false,
          hasPriceChanged: false,
          hasStockChanged: false,
        };
      }

      const fresh = await fetchStackBySlug(line.slug);
      const nextPrice = asCurrencyNumber(fresh.price);
      const nextStock = Number(fresh.stock ?? 0);
      const safeQuantity = Math.max(0, Math.min(Number(line.quantity || 0), nextStock));

      return {
        ...line,
        ...fresh,
        quantity: safeQuantity,
        isUnavailable: nextStock <= 0,
        hasPriceChanged: nextPrice !== asCurrencyNumber(line.price),
        hasStockChanged: safeQuantity !== Number(line.quantity || 0),
      };
    }),
  );

  return settled
    .map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      return {
        ...lines[index],
        isUnavailable: false,
        hasPriceChanged: false,
        hasStockChanged: false,
        syncError: true,
      };
    })
    .filter((line) => Number(line.quantity || 0) > 0);
}
