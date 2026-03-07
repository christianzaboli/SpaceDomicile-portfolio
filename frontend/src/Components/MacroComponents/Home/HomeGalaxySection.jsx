import milkyWay from "/img/milky-way.png";
import andromeda from "/img/andromeda.png";
import sombrero from "/img/sombrero.png";
import HomeDiscoveryCard from "./HomeDiscoveryCard";
import HomeSectionTitle from "./HomeSectionTitle";

const GALAXY_ITEMS = [
  {
    to: "/galaxies/milky-way",
    imageSrc: milkyWay,
    imageAlt: "Via Lattea",
    title: "Esplora la Via Lattea",
    description: "Scopri stelle, pianeti e sistemi abitabili.",
  },
  {
    to: "/galaxies/andromeda",
    imageSrc: andromeda,
    imageAlt: "Andromeda",
    title: "Esplora Andromeda",
    description: "Scopri stelle, pianeti e sistemi abitabili.",
  },
  {
    to: "/galaxies/sombrero",
    imageSrc: sombrero,
    imageAlt: "Sombrero",
    title: "Esplora Sombrero",
    description: "Scopri stelle, pianeti e sistemi abitabili.",
    imageClassName: "card-image-sombrero",
  },
];

export default function HomeGalaxySection() {
  return (
    <>
      <HomeSectionTitle text="SCEGLI LA TUA GALASSIA PREFERITA" />
      <div className="container-galassie">
        {GALAXY_ITEMS.map((item) => (
          <HomeDiscoveryCard key={item.to} {...item} />
        ))}
      </div>
    </>
  );
}
