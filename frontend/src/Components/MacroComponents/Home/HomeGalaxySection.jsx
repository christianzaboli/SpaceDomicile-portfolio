import HomeDiscoveryCard from "./HomeDiscoveryCard";
import HomeSectionTitle from "./HomeSectionTitle";
import { GALAXY_ITEMS } from "../../../libs/consts";


export default function HomeGalaxySection() {
  return (
    <>
      <HomeSectionTitle text="SCEGLI LA TUA GALASSIA PREFERITA" />
      <div className="container-galassie">
        {GALAXY_ITEMS.map((item) => (
          <HomeDiscoveryCard key={item.to} {...item}/>
        ))}
      </div>
    </>
  );
}
