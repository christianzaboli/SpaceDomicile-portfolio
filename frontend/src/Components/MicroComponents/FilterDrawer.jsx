import { useEffect, useState } from "react";

export default function FilterDrawer({ open, onClose, filters, defaultFilter, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [filters, open]);

  const handleChange = (key, value) => {
    const numericKeys = ["price", "temperatureMin", "temperatureMax", "sizeMin", "sizeMax"];

    setLocalFilters((prev) => ({
      ...prev,
      [key]: numericKeys.includes(key) ? Number(value) : value,
    }));
  };

  return (
    <>
      <div className={`Fcart-drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`Fcart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="Fcart-drawer-panel">
          <button className="Fcart-drawer-close" onClick={onClose} aria-label="Chiudi filtri">
            x
          </button>

          <h3 className="Fcart-drawer-title">Filtri</h3>

          <div className="Ffilters-container">
            <div className="Ffilter-block">
              <label htmlFor="search-filter">Ricerca</label>
              <input
                id="search-filter"
                type="text"
                value={localFilters.search}
                onChange={(event) => handleChange("search", event.target.value)}
                placeholder="Cerca pianeti..."
              />
            </div>

            <div className="Ffilter-block">
              <label htmlFor="price-filter">Prezzo massimo</label>
              <input
                id="price-filter"
                type="number"
                min="0"
                max="5000"
                value={localFilters.price}
                onChange={(event) => handleChange("price", event.target.value)}
              />
            </div>

            <div className="Ffilter-block">
              <label htmlFor="temperature-min-filter">Temperatura minima</label>
              <input
                id="temperature-min-filter"
                type="number"
                value={localFilters.temperatureMin}
                onChange={(event) => handleChange("temperatureMin", event.target.value)}
              />

              <label htmlFor="temperature-max-filter" style={{ marginTop: "12px" }}>
                Temperatura massima
              </label>
              <input
                id="temperature-max-filter"
                type="number"
                value={localFilters.temperatureMax}
                onChange={(event) => handleChange("temperatureMax", event.target.value)}
              />
            </div>

            <div className="Ffilter-block">
              <label htmlFor="size-min-filter">Dimensione minima</label>
              <input
                id="size-min-filter"
                type="number"
                value={localFilters.sizeMin}
                onChange={(event) => handleChange("sizeMin", event.target.value)}
              />

              <label htmlFor="size-max-filter" style={{ marginTop: "12px" }}>
                Dimensione massima
              </label>
              <input
                id="size-max-filter"
                type="number"
                value={localFilters.sizeMax}
                onChange={(event) => handleChange("sizeMax", event.target.value)}
              />
            </div>

            <div className="Ffilter-block">
              <label htmlFor="galaxy-filter">Galassia</label>
              <select
                id="galaxy-filter"
                value={localFilters.galaxy_slug || ""}
                onChange={(event) => handleChange("galaxy_slug", event.target.value)}
                className="selectGalaxies"
              >
                <option value="">Tutte le galassie</option>
                <option value="milky-way">Via Lattea</option>
                <option value="andromeda">Andromeda</option>
                <option value="sombrero">Sombrero</option>
              </select>
            </div>
          </div>

          <div className="Ffilter-actions">
            <button className="Fcart-drawer-btn reset-btn" onClick={() => onApply(defaultFilter)}>
              Reimposta
            </button>

            <button className="Fcart-drawer-btn" onClick={() => onApply(localFilters)}>
              Applica filtri
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
