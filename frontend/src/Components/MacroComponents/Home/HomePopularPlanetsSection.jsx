import HomeDiscoveryCard from "./HomeDiscoveryCard";
import HomeSectionTitle from "./HomeSectionTitle";

export default function HomePopularPlanetsSection({ planets }) {
  const validPlanets = planets.filter(Boolean);

  return (
    <>
      <HomeSectionTitle text="I PIANETI PIU' POPOLARI" />
      <div className="container-galassie">
        {validPlanets.map((planet) => (
          <HomeDiscoveryCard
            key={planet.slug}
            to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
            imageSrc={planet.image}
            imageAlt={planet.name}
            imageClassName={planet.slug !== "mars" ? "pianeta-piccolo" : ""}
            title={planet.name}
            description={planet.description}
          />
        ))}
      </div>
    </>
  );
}
