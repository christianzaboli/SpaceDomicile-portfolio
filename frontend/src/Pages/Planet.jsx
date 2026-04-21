import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../Contexts/CartContext.jsx";
import PlanetDetailsSection from "../Components/Planet/PlanetDetailsSection.jsx";
import PlanetPackagesSection from "../Components/Planet/PlanetPackagesSection.jsx";
import PlanetNearbySection from "../Components/Planet/PlanetNearbySection.jsx";
import QueryState from "../components/app/QueryState.jsx";
import {
  usePlanetDetailQuery,
  usePlanetStacksQuery,
  usePlanetsByGalaxyQuery,
} from "../hooks/queries/useCommerceQueries.js";
import { useWebHaptics } from "web-haptics/react";
import usePageMeta from "../hooks/app/usePageMeta.js";

export default function Planet() {
  const { trigger } = useWebHaptics();
  const navigate = useNavigate();
  const { planetSlug } = useParams();
  const { addToCart } = useCart();

  const planetQuery = usePlanetDetailQuery(planetSlug);
  const stacksQuery = usePlanetStacksQuery(planetSlug);
  const relatedPlanetsQuery = usePlanetsByGalaxyQuery(planetQuery.data?.galaxy_slug);

  usePageMeta(
    planetQuery.data?.name || "Dettagli pianeta",
    "Consulta opzioni pacchetto, dettagli del catalogo e informazioni di fiducia prima dell'acquisto.",
  );

  useEffect(() => {
    if (planetQuery.isError && planetQuery.error?.status === 404) {
      navigate("/");
    }
  }, [navigate, planetQuery.error, planetQuery.isError]);

  const { prevPlanet, nextPlanet } = useMemo(() => {
    const planet = planetQuery.data;
    const related = relatedPlanetsQuery.data ?? [];

    if (!planet || related.length === 0) {
      return { prevPlanet: null, nextPlanet: null };
    }

    const currentIndex = related.findIndex((entry) => entry.slug === planet.slug);

    return {
      prevPlanet: currentIndex > 0 ? related[currentIndex - 1] : null,
      nextPlanet:
        currentIndex >= 0 && currentIndex < related.length - 1
          ? related[currentIndex + 1]
          : null,
    };
  }, [planetQuery.data, relatedPlanetsQuery.data]);

  const handleAddToCart = (packageProps) => {
    if (packageProps.stock <= 0) {
      return;
    }

    trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]);
    addToCart(packageProps);
  };

  return (
    <div className="planet-page">
      <QueryState query={planetQuery} loadingText="Caricamento dettagli del pianeta...">
        <PlanetDetailsSection planet={planetQuery.data} />
      </QueryState>

      <QueryState query={stacksQuery} loadingText="Caricamento opzioni dei pacchetti...">
        <PlanetPackagesSection
          planet={planetQuery.data}
          stacks={stacksQuery.data}
          onAddToCart={handleAddToCart}
        />
      </QueryState>

      <PlanetNearbySection prevPlanet={prevPlanet} nextPlanet={nextPlanet} />
    </div>
  );
}

