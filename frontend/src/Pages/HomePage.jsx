import HomeBackground from "../Components/MacroComponents/HomeBackground.jsx";
import HomeIntroSection from "../Components/MacroComponents/Home/HomeIntroSection.jsx";
import HomeFeatureCards from "../Components/MacroComponents/Home/HomeFeatureCards.jsx";
import HomeGalaxySection from "../Components/MacroComponents/Home/HomeGalaxySection.jsx";
import HomePopularPlanetsSection from "../Components/MacroComponents/Home/HomePopularPlanetsSection.jsx";
import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import QueryState from "../Components/app/QueryState.jsx";
import { useAllPlanetsQuery } from "../hooks/queries/useCommerceQueries.js";
import usePageMeta from "../hooks/app/usePageMeta.js";

const FEATURED_SLUGS = ["mars", "jupiter", "saturn"];

export default function HomePage() {
  usePageMeta(
    "Discover habitable worlds",
    "Browse premium space property packages, curated galaxies, and gift-ready planet certificates.",
  );
  const contentRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState("100vh");
  const updateHeight = useCallback(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    const windowHeight = window.innerHeight;
    const calculatedHeight = Math.max(contentHeight + 42, windowHeight);

    setContainerHeight(`${calculatedHeight}px`);
  }, []);

  useEffect(() => {
    updateHeight();
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight]);

  const planetsQuery = useAllPlanetsQuery();

  const featuredPlanets = useMemo(() => {
    const planets = planetsQuery.data ?? [];
    return FEATURED_SLUGS.map((slug) =>
      planets.find((planet) => planet.slug === slug),
    ).filter(Boolean);
  }, [planetsQuery.data]);

  return (
    <div
      className="container-jumbotrone home-shell"
      style={{ height: containerHeight }}
    >
      <HomeBackground />
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          paddingTop: 200,
        }}
      >
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
