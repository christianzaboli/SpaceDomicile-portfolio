import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import FilterDrawer from "../Components/MicroComponents/FilterDrawer.jsx";
import QueryState from "../Components/app/QueryState.jsx";
import { useFilteredPlanetsQuery } from "../hooks/queries/useCommerceQueries.js";
import usePageMeta from "../hooks/app/usePageMeta.js";
import {
  DEFAULT_FILTERS,
  buildFilterParams,
  parseFilters,
  sortPlanets,
} from "../lib/catalogFilters.js";

const FILTER_LABELS = {
  search: "Ricerca",
  price: "Prezzo max",
  galaxy_slug: "Galassia",
  temperatureMin: "Temperatura min",
  temperatureMax: "Temperatura max",
  sizeMin: "Dimensione min",
  sizeMax: "Dimensione max",
};

function ActiveFilterChips({ filters, onRemove, onClear }) {
  const activeEntries = Object.entries(filters).filter(
    ([key, value]) =>
      key !== "sort" && value !== DEFAULT_FILTERS[key] && value !== "",
  );

  if (activeEntries.length === 0) {
    return null;
  }

  return (
    <div className="search-chip-row">
      {activeEntries.map(([key, value]) => (
        <button key={key} className="search-chip" onClick={() => onRemove(key)}>
          {FILTER_LABELS[key] || key}: {value} x
        </button>
      ))}
      <button className="search-chip search-chip-clear" onClick={onClear}>
        Cancella tutto
      </button>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="catalog-skeleton-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="catalog-skeleton-card" key={index} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  usePageMeta(
    "Ricerca pianeti",
    "Filtra, confronta e scopri mondi in un catalogo pensato come una vera esperienza ecommerce.",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const planetsQuery = useFilteredPlanetsQuery(filters);

  const sortedPlanets = useMemo(
    () => sortPlanets(planetsQuery.data ?? [], filters.sort),
    [filters.sort, planetsQuery.data],
  );

  const displayedPlanets = sortedPlanets.slice(0, visibleCount);

  const setFilters = (next) => {
    setVisibleCount(8);
    setSearchParams(buildFilterParams(next));
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const removeFilter = (key) => {
    setFilters({ ...filters, [key]: DEFAULT_FILTERS[key] });
  };

  return (
    <div className="galaxy-page pos catalog-page-shell">
      <div className="catalog-header-panel search-page-header">
        <p className="catalog-overline">Catalogo pianeti</p>
        <h1 className="mw-subtitle-s">
          Trova il pianeta giusto per il tuo prossimo regalo interstellare
        </h1>
        <p>
          Confronta i mondi, restringi il catalogo e conserva URL condivisibili
          per ogni ricerca.
        </p>
      </div>

      <div className="catalog-toolbar">
        <div className="search-container-s">
          <button className="filter-btn-s" onClick={() => setIsOpen(true)}>
            Filtri
          </button>
          <div className="catalog-results-meta">
            <strong>{sortedPlanets.length}</strong>
            <span>pianeti corrispondono ai tuoi filtri</span>
          </div>
        </div>

        <label className="catalog-sorter">
          <span>Ordina per</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter("sort", event.target.value)}
          >
            <option value="featured">In evidenza</option>
            <option value="name-asc">Nome A-Z</option>
            <option value="name-desc">Nome Z-A</option>
          </select>
        </label>
      </div>

      <ActiveFilterChips
        filters={filters}
        onRemove={removeFilter}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      <FilterDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        filters={filters}
        defaultFilter={DEFAULT_FILTERS}
        onApply={(nextFilters) => setFilters(nextFilters)}
      />

      <div className="mw-cards-grid-s">
        {planetsQuery.isLoading ? (
          <SearchResultsSkeleton />
        ) : (
          <QueryState
            query={planetsQuery}
            empty={
              <div className="catalog-empty-state">
                <h2>Nessun pianeta corrisponde a questa ricerca.</h2>
                <p>
                  Prova ad ampliare i filtri di prezzo, temperatura o galassia
                  per scoprire piu mondi.
                </p>
                <button
                  className="checkout-btn"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Reimposta filtri
                </button>
              </div>
            }
          >
            {displayedPlanets.map((planet) => (
              <Link
                to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
                key={planet.id}
                className="mw-card-search-s"
              >
                <div className="mw-card-search-inner">
                  <div className="mw-card-search-header">
                    <h3>{planet.name}</h3>
                  </div>
                  <div className="mw-planet-visual-shell-s">
                    <div
                      className={`mw-planet-img-s mw-img-${planet.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      style={{ backgroundImage: `url(${planet.image})` }}
                    ></div>
                  </div>
                  <div className="card-infos">
                    <div className="catalog-card-meta">
                      <p className="mw-desc-s">{planet.description}</p>
                    </div>
                    <div className="mw-bottom-s visible-bottom">
                      <div className="catalog-card-trust-row">
                        <span>{planet.galaxy_name || planet.galaxy_slug}</span>
                        <span>Acquisto certificato</span>
                        <span>Checkout sicuro</span>
                        <span>Pronto da regalare</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </QueryState>
        )}
      </div>

      {visibleCount < sortedPlanets.length && (
        <button
          className="buttonload-s"
          onClick={() => setVisibleCount((count) => count + 8)}
        >
          Carica altri pianeti
        </button>
      )}
    </div>
  );
}
