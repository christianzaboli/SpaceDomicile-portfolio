import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../libs/utils.jsx";

export default function usePlanetPageData(planetSlug, onNotFound) {
  const [planet, setPlanet] = useState(null);
  const [stacks, setStacks] = useState(null);
  const [relatedPlanets, setRelatedPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load planet data
  useEffect(() => {
    if (!planetSlug) return;

    let isActive = true;

    // Fetch planet and stacks
    async function fetchPlanetAndStacks() {
      setIsLoading(true);

      try {
        const [planetResult, stacksResult] = await Promise.allSettled([
          axios.get(buildApiUrl(`/api/planets/${planetSlug}`)),
          axios.get(buildApiUrl(`/api/stacks/planet/${planetSlug}`)),
        ]);

        if (!isActive) return;

        if (planetResult.status !== "fulfilled") {
          const status = planetResult.reason?.response?.status;
          console.error("Errore nel caricamento pianeta:", planetResult.reason);
          if (status === 404) {
            onNotFound?.();
          }
        } else {
          setPlanet(planetResult.value.data);
        }

        if (stacksResult.status !== "fulfilled") {
          console.error(
            "Errore nel caricamento pacchetti:",
            stacksResult.reason,
          );
        } else {
          setStacks(stacksResult.value.data);
        }
      } catch (error) {
        console.error("Errore nel caricamento dati del pianeta:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchPlanetAndStacks();

    return () => {
      isActive = false;
    };
  }, [planetSlug, onNotFound]);

  // Load related planets
  useEffect(() => {
    if (!planet?.galaxy_slug) return;

    let isActive = true;

    // Fetch nearby planets
    async function fetchRelatedPlanets() {
      try {
        const response = await axios.get(
          buildApiUrl(`/api/planets/from/${planet.galaxy_slug}`),
        );
        if (!isActive) return;
        setRelatedPlanets(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          onNotFound?.();
        }
        console.error("Errore nel caricamento pianeti vicini:", error);
      }
    }

    fetchRelatedPlanets();

    return () => {
      isActive = false;
    };
  }, [planet?.galaxy_slug, onNotFound]);

  // Compute adjacent planets
  const { prevPlanet, nextPlanet } = useMemo(() => {
    if (!planet || relatedPlanets.length === 0) {
      return { prevPlanet: null, nextPlanet: null };
    }

    const currentIndex = relatedPlanets.findIndex(
      (p) => p.slug === planet.slug,
    );

    if (currentIndex === -1) {
      return { prevPlanet: null, nextPlanet: null };
    }

    return {
      prevPlanet: currentIndex > 0 ? relatedPlanets[currentIndex - 1] : null,
      nextPlanet:
        currentIndex < relatedPlanets.length - 1
          ? relatedPlanets[currentIndex + 1]
          : null,
    };
  }, [planet, relatedPlanets]);

  return {
    planet,
    stacks,
    prevPlanet,
    nextPlanet,
    isLoading,
  };
}
