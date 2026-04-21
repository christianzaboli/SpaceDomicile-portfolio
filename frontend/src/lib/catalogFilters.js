export const DEFAULT_FILTERS = {
  search: "",
  temperatureMin: -273,
  temperatureMax: 550,
  sizeMin: 0,
  sizeMax: 70000000000,
  price: 5000,
  galaxy_slug: "",
  sort: "featured",
};

export function parseFilters(searchParams) {
  const next = { ...DEFAULT_FILTERS };

  for (const [key, value] of searchParams.entries()) {
    if (!(key in next)) {
      continue;
    }

    next[key] = [
      "temperatureMin",
      "temperatureMax",
      "sizeMin",
      "sizeMax",
      "price",
    ].includes(key)
      ? Number(value)
      : value;
  }

  return next;
}

export function buildFilterParams(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== DEFAULT_FILTERS[key] && value !== "") {
      params.set(key, String(value));
    }
  });

  return params;
}

export function sortPlanets(planets, sort) {
  const collection = [...planets];

  switch (sort) {
    case "name-asc":
      return collection.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return collection.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return collection;
  }
}
