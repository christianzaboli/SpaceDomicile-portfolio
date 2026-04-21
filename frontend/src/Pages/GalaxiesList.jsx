import GalaxyCard from "../Components/Galaxy/GalaxyCard.jsx";
import BackToHomeBtn from "../Components/MicroComponents/BackToHomeBtn.jsx";
import QueryState from "../Components/app/QueryState.jsx";
import { useGalaxiesQuery } from "../hooks/queries/useCommerceQueries.js";
import usePageMeta from "../hooks/app/usePageMeta.js";

export default function GalaxiesList() {
  usePageMeta(
    "Galassie",
    "Esplora l'attuale catalogo Space Domiciles per galassia e scopri i mondi disponibili oggi.",
  );

  const galaxiesQuery = useGalaxiesQuery();

  return (
    <div className="galaxy-page pos-gal">
      <div className="galaxies-section">
        <h2 className="galaxies-section-title">Galassie disponibili</h2>
        <p className="galaxies-section-desc">
          Esplora sistemi selezionati, candidati abitabili e pacchetti premium
          di proprieta.
        </p>

        <QueryState
          query={galaxiesQuery}
          loadingText="Caricamento galassie..."
          empty={
            <p className="no-results-s">
              Al momento non ci sono galassie disponibili.
            </p>
          }
        >
          <div className="galaxies-cards-container">
            {galaxiesQuery?.data?.map((galaxy) => (
              <GalaxyCard key={galaxy.id} galaxy={galaxy} />
            ))}
          </div>
        </QueryState>

        <BackToHomeBtn />
      </div>
    </div>
  );
}
