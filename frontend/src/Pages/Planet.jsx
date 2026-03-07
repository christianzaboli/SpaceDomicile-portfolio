import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import PlanetDetailsSection from "../Components/Planet/PlanetDetailsSection";
import PlanetPackagesSection from "../Components/Planet/PlanetPackagesSection";
import PlanetNearbySection from "../Components/Planet/PlanetNearbySection";
import usePlanetPageData from "../hooks/usePlanetPageData";

export default function Planet() {
  const navigate = useNavigate();
  const { planetSlug } = useParams();
  const { addToCart } = useCart();

  const handleNotFound = useCallback(() => {
    navigate("/404");
  }, [navigate]);

  const { planet, stacks, prevPlanet, nextPlanet } = usePlanetPageData(
    planetSlug,
    handleNotFound,
  );

  const handleAddToCart = (packageProps) => {
    if (packageProps.stock <= 0) return;
    addToCart(packageProps);
  };

  return (
    <div className="planet-page">
      <PlanetDetailsSection planet={planet} />
      <PlanetPackagesSection
        planet={planet}
        stacks={stacks}
        onAddToCart={handleAddToCart}
      />
      <PlanetNearbySection prevPlanet={prevPlanet} nextPlanet={nextPlanet} />
    </div>
  );
}
