import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDefaultContext } from "../Contexts/DefaultContext";
import FilterDrawer from "../Components/MicroComponents/FilterDrawer";
import { buildApiUrl, scrollToTop } from "../libs/utils";

export default function SearchPage() {
  const { filters, setFilters, updateFilters, defaultFilter } =
    useDefaultContext();

  // gestione url condivisibile
  const [searchParams, setSearchParams] = useSearchParams();

  // attiva i filtri dall'url
  useEffect(() => {
    const urlFilters = Object.fromEntries([...searchParams]);

    // Converti numeri (URL li mette come stringhe)

    const parsedFilters = {};
    for (const key in urlFilters) {
      const val = urlFilters[key];
      parsedFilters[key] = isNaN(val) ? val : Number(val);
    }

    setFilters((prev) => ({ ...prev, ...parsedFilters }));
  }, []);

  // Ogni volta che i filtri cambiano → aggiorna l'URL
  useEffect(() => {
    const cleanFilters = {};

    for (const key in filters) {
      // evita di sporcare l'URL con valori identici ai default
      if (filters[key] !== defaultFilter[key]) {
        cleanFilters[key] = filters[key];
      }
    }

    setSearchParams(cleanFilters);
  }, [filters]);

  // Converto l'oggetto filter in query string
  const queryString = new URLSearchParams(filters).toString();

  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    axios
      .get(`${buildApiUrl("/api/planets/filter")}?${queryString}`)
      .then((response) => setPlanets(response.data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, [filters]);

  // gestione menù a tendina
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);
  // numero di card visibili a inizio pagina
  const [visibleCount, setVisibleCount] = useState(8);

  // reset quando cambiano i filtri
  useEffect(() => {
    setVisibleCount(8);
  }, [filters]);

  // crea la lista visibile
  const displayedPlanets = planets.slice(0, visibleCount);

  return (
    <div className="galaxy-page pos">
      <h1 className="mw-subtitle-s">Cerca il tuo pianeta nell'universo</h1>

      {/* Sezione filtri */}
      <div className="filter-dropdown-s">
        <div className="search-container-s">
          <button className="filter-btn-s" onClick={() => setIsOpen(true)}>
            Filtri
          </button>

          <FilterDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            filters={filters}
            updateFilters={updateFilters}
          />
        </div>
      </div>

      <div className="mw-cards-grid-s">
        {displayedPlanets.length > 0 ? (
          displayedPlanets.map((planet) => (
            <Link
              to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
              key={planet.id}
              className="mw-card-search-s"
              onClick={scrollToTop}
            >
              <div>
                <div className="mw-explore-s">
                  <h3>{planet.name}</h3>
                </div>
                <div
                  className={`mw-planet-img-s mw-img-${planet.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  style={{ backgroundImage: `url(${planet.image})` }}
                ></div>
                <div className="mw-bottom-s">
                  <p className="mw-desc-s">{planet.description}</p>
                  <div className="mw-divider-s"></div>
                  <div className="mw-explore-s">Esplora il pianeta →</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results-s">
            Nessun pianeta rispetta i parametri inseriti
          </p>
        )}
      </div>

      {visibleCount < planets.length && (
        <button
          className="buttonload-s"
          onClick={() => setVisibleCount((v) => v + 8)}
        >
          Carica altri
        </button>
      )}
    </div>
  );
}
