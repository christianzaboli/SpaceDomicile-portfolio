import HomeBackground from "../Components/MacroComponents/HomeBackground.jsx";
import HomeIntroSection from "../Components/MacroComponents/Home/HomeIntroSection.jsx";
import HomeFeatureCards from "../Components/MacroComponents/Home/HomeFeatureCards.jsx";
import HomeGalaxySection from "../Components/MacroComponents/Home/HomeGalaxySection.jsx";
import HomePopularPlanetsSection from "../Components/MacroComponents/Home/HomePopularPlanetsSection.jsx";
import { useMemo } from "react";
import QueryState from "../Components/app/QueryState.jsx";
import { useAllPlanetsQuery } from "../hooks/queries/useCommerceQueries.js";
import usePageMeta from "../hooks/app/usePageMeta.js";

const FEATURED_SLUGS = ["mars", "jupiter", "saturn"];

export default function HomePage() {
  usePageMeta(
    "Discover habitable worlds",
    "Browse premium space property packages, curated galaxies, and gift-ready planet certificates.",
  );

  const planetsQuery = useAllPlanetsQuery();

  const featuredPlanets = useMemo(() => {
    const planets = planetsQuery.data ?? [];
    return FEATURED_SLUGS.map((slug) =>
      planets.find((planet) => planet.slug === slug),
    ).filter(Boolean);
  }, [planetsQuery.data]);

  return (
    <div className="container-jumbotrone home-shell">
      <HomeBackground />
      <div className="home-content-wrapper">
        <HomeIntroSection />
        <HomeFeatureCards />
        <HomeGalaxySection />
        <QueryState
          query={planetsQuery}
          loadingText="Loading featured planets..."
        >
          <HomePopularPlanetsSection
            planets={featuredPlanets}
            isLoading={planetsQuery.isLoading}
          />
        </QueryState>
      </div>
    </div>
  );
}
