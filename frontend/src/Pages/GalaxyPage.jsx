import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import QueryState from "../Components/app/QueryState.jsx";
import {
  useGalaxyQuery,
  usePlanetsByGalaxyQuery,
} from "../hooks/queries/useCommerceQueries.js";
import usePageMeta from "../hooks/app/usePageMeta.js";

function PlanetCommerceCard({ planet, galaxySlug }) {
  return (
    <Link
      to={`/galaxies/${galaxySlug}/${planet.slug}`}
      className="mw-card-search-s galaxy-product-card"
    >
      <div className="mw-explore-s">
        <h3>{planet.name}</h3>
      </div>
      <div
        className={`mw-planet-img-s mw-img-${planet.name.toLowerCase().replace(/\s+/g, "-")}`}
        style={{ backgroundImage: `url(${planet.image})` }}
      />
      <div className="mw-bottom-s visible-bottom">
        <p className="mw-desc-s">{planet.description}</p>
        <div className="mw-divider-s"></div>
      </div>
    </Link>
  );
}

export default function GalaxyPage() {
  const { galaxySlug } = useParams();
  const navigate = useNavigate();

  const galaxyQuery = useGalaxyQuery(galaxySlug);
  const planetsQuery = usePlanetsByGalaxyQuery(galaxySlug);

  usePageMeta(
    galaxyQuery.data?.name || "Collezione galattica",
    "Esplora mondi e pacchetti presenti in questa collezione galattica.",
  );

  useEffect(() => {
    if (planetsQuery.isError && planetsQuery.error?.status === 404) {
      navigate("/coming-soon");
    }
  }, [navigate, planetsQuery.error, planetsQuery.isError]);

  const counts = useMemo(() => {
    const planets = planetsQuery.data ?? [];
    return {
      total: planets.length,
    };
  }, [planetsQuery.data]);

  return (
    <div className="galaxy-page gpage">
      <div className="mw-wrapper">
        <QueryState
          query={galaxyQuery}
          loadingText="Caricamento dettagli della galassia..."
        >
          <div className="mw-header catalog-header-panel">
            <p className="catalog-overline">Vetrina galattica</p>
            <h1>{galaxyQuery.data?.name}</h1>
            <p>{galaxyQuery.data?.description}</p>
            <div className="catalog-header-stats">
              <span>{counts.total} pianeti attualmente in catalogo</span>
              <span>Certificati di proprieta pronti da regalare</span>
              <span>Pagamento sicuro disponibile</span>
            </div>
          </div>
        </QueryState>

        <div>
          <h2 className="mw-subtitle">Pianeti in questa collezione</h2>
          <QueryState
            query={planetsQuery}
            loadingText="Caricamento collezione pianeti..."
            empty={
              <p className="no-results-s">
                Questa galassia sara disponibile presto.
              </p>
            }
          >
            <div className="mw-cards-grid">
              {planetsQuery.data?.map((planet) => (
                <PlanetCommerceCard
                  key={planet.id}
                  planet={planet}
                  galaxySlug={galaxySlug}
                />
              ))}
            </div>
          </QueryState>
        </div>
      </div>
    </div>
  );
}
