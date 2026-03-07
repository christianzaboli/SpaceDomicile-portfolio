import { Link } from "react-router-dom";
import { scrollToTop } from "../../libs/utils";

function NearbyPlanetCard({ label, planet }) {
  if (!planet) return null;

  return (
    <div className="planet-close-card">
      <h2 className="section-title">{label}</h2>
      <Link
        to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
        onClick={scrollToTop}
        className="planet-visual close-planet"
      >
        <div className="planet-visual-container">
          <img
            className="planet-visual-image"
            src={planet.image}
            alt={planet.name}
          />
          <div className="planet-visual-name">{planet.name}</div>
        </div>
      </Link>
    </div>
  );
}

export default function PlanetNearbySection({ prevPlanet, nextPlanet }) {
  return (
    <section className="planet-close">
      <h2 className="section-title">Pianeti vicini</h2>
      <div className="planet-close-container">
        <NearbyPlanetCard label="Previous" planet={prevPlanet} />
        <NearbyPlanetCard label="Next" planet={nextPlanet} />
      </div>
    </section>
  );
}
