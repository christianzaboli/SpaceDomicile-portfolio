import HomeBackground from "../Components/MacroComponents/HomeBackground";
import HomeIntroSection from "../Components/MacroComponents/Home/HomeIntroSection";
import HomeFeatureCards from "../Components/MacroComponents/Home/HomeFeatureCards";
import HomeGalaxySection from "../Components/MacroComponents/Home/HomeGalaxySection";
import HomePopularPlanetsSection from "../Components/MacroComponents/Home/HomePopularPlanetsSection";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { buildApiUrl } from "../libs/utils";

export default function HomePage() {
  const contentRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState("100vh");
  const [planet1, setPlanet1] = useState(null);
  const [planet2, setPlanet2] = useState(null);
  const [planet3, setPlanet3] = useState(null);

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

  const fetchPlanets = useCallback(async () => {
    try {
      const [p1, p2, p3] = await Promise.all([
        axios.get(buildApiUrl("/api/planets/mars")),
        axios.get(buildApiUrl("/api/planets/jupiter")),
        axios.get(buildApiUrl("/api/planets/saturn")),
      ]);

      setPlanet1(p1.data);
      setPlanet2(p2.data);
      setPlanet3(p3.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchPlanets();
  }, [fetchPlanets]);

  useEffect(() => {
    if (planet1 && planet2 && planet3) {
      updateHeight();
    }
  }, [planet1, planet2, planet3, updateHeight]);

  return (
    <div
      className="container-jumbotrone"
      style={{
        width: "100%",
        height: containerHeight,
        minHeight: "100vh",
        position: "relative",
      }}
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
        <HomePopularPlanetsSection planets={[planet1, planet2, planet3]} />
      </div>
    </div>
  );
}
