import { useQuery } from "@tanstack/react-query";
import {
  fetchAllPlanets,
  fetchFilteredPlanets,
  fetchGalaxies,
  fetchGalaxy,
  fetchPaymentConfig,
  fetchPlanet,
  fetchPlanetStacks,
  fetchPlanetsByGalaxy,
} from "../../api/commerce.js";

export function useGalaxiesQuery() {
  return useQuery({
    queryKey: ["galaxies"],
    queryFn: fetchGalaxies,
  });
}

export function useGalaxyQuery(galaxySlug) {
  return useQuery({
    queryKey: ["galaxy", galaxySlug],
    queryFn: () => fetchGalaxy(galaxySlug),
    enabled: Boolean(galaxySlug),
  });
}

export function usePlanetsByGalaxyQuery(galaxySlug) {
  return useQuery({
    queryKey: ["planets", "galaxy", galaxySlug],
    queryFn: () => fetchPlanetsByGalaxy(galaxySlug),
    enabled: Boolean(galaxySlug),
  });
}

export function useFilteredPlanetsQuery(filters) {
  return useQuery({
    queryKey: ["planets", "filtered", filters],
    queryFn: () => fetchFilteredPlanets(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function usePlanetDetailQuery(planetSlug) {
  return useQuery({
    queryKey: ["planet", planetSlug],
    queryFn: () => fetchPlanet(planetSlug),
    enabled: Boolean(planetSlug),
  });
}

export function usePlanetStacksQuery(planetSlug) {
  return useQuery({
    queryKey: ["planet", planetSlug, "stacks"],
    queryFn: () => fetchPlanetStacks(planetSlug),
    enabled: Boolean(planetSlug),
  });
}

export function usePaymentConfigQuery() {
  return useQuery({
    queryKey: ["payment-config"],
    queryFn: fetchPaymentConfig,
  });
}

export function useAllPlanetsQuery() {
  return useQuery({
    queryKey: ["planets", "all"],
    queryFn: fetchAllPlanets,
  });
}
