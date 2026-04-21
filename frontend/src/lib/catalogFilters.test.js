import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  buildFilterParams,
  parseFilters,
  sortPlanets,
} from "./catalogFilters.js";

describe("catalog filters", () => {
  it("parses URL params into typed filters", () => {
    const params = new URLSearchParams({
      search: "mars",
      price: "1200",
      temperatureMin: "-20",
      sort: "name-asc",
    });

    expect(parseFilters(params)).toEqual({
      ...DEFAULT_FILTERS,
      search: "mars",
      price: 1200,
      temperatureMin: -20,
      sort: "name-asc",
    });
  });

  it("builds clean URL params and sorts by name", () => {
    const params = buildFilterParams({
      ...DEFAULT_FILTERS,
      galaxy_slug: "andromeda",
      sort: "name-desc",
    });

    expect(params.toString()).toBe("galaxy_slug=andromeda&sort=name-desc");

    const sorted = sortPlanets(
      [{ name: "Mars" }, { name: "Earth" }, { name: "Venus" }],
      "name-asc",
    );

    expect(sorted.map((planet) => planet.name)).toEqual(["Earth", "Mars", "Venus"]);
  });
});
