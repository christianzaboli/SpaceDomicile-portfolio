import { useDefaultContext } from "../../Contexts/DefaultContext";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FilterDrawer({ open, onClose }) {
  const { filters, updateFiltersBatch, defaultFilter } = useDefaultContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Stato locale temporaneo
  const [localFilters, setLocalFilters] = useState(filters);

  // Quando apri il drawer, copia i filtri attuali dentro localFilters
  useEffect(() => {
    if (open) setLocalFilters(filters);
  }, [open, filters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    updateFiltersBatch(localFilters);

    const params = new URLSearchParams();

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== defaultFilter[key]) {
        params.set(key, value);
      }
    });

    setSearchParams(params);

    onClose();
  };
  const resetFilters = () => {
    updateFiltersBatch(defaultFilter);
    setLocalFilters(defaultFilter);
    setSearchParams({});
    onClose();
  };
  return (
    <>
      {/* ✨ OVERLAY SEPARATO CON CLASSE OPEN ✨ */}
      <div
        className={`Fcart-drawer-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />

      {/*  DRAWER  */}
      <div className={`Fcart-drawer ${open ? "open" : ""}`}>
        <div className="Fcart-drawer-panel">
          <button className="Fcart-drawer-close" onClick={onClose}>
            &times;
          </button>

          <h3 className="Fcart-drawer-title">Filtri</h3>

          <div className="Ffilters-container">
            {/* Ricerca */}
            <div className="Ffilter-block">
              <label>Ricerca</label>
              <input
                type="text"
                value={localFilters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                placeholder="Cerca pianeti..."
              />
            </div>

            {/* Prezzo max */}
            <div className="Ffilter-block">
              <label>Prezzo massimo</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={localFilters.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            {/* Temperatura */}
            <div className="Ffilter-block">
              <label>Temperatura min</label>
              <input
                type="number"
                value={localFilters.temperatureMin}
                onChange={(e) => handleChange("temperatureMin", e.target.value)}
              />

              <label style={{ marginTop: "12px" }}>Temperatura max</label>
              <input
                type="number"
                value={localFilters.temperatureMax}
                onChange={(e) => handleChange("temperatureMax", e.target.value)}
              />
            </div>

            {/* Dimensione */}
            <div className="Ffilter-block">
              <label>Dimensione min</label>
              <input
                type="number"
                value={localFilters.sizeMin}
                onChange={(e) => handleChange("sizeMin", e.target.value)}
              />

              <label style={{ marginTop: "12px" }}>Dimensione max</label>
              <input
                type="number"
                value={localFilters.sizeMax}
                onChange={(e) => handleChange("sizeMax", e.target.value)}
              />
            </div>

            {/* Galassia */}
            <div className="Ffilter-block">
              <label>Galassia</label>
              <select
                value={localFilters.galaxy_slug || ""}
                onChange={(e) => handleChange("galaxy_slug", e.target.value)}
                className="selectGalaxies"
              >
                <option value="">Tutte</option>
                <option value="milky-way">Via Lattea</option>
                <option value="andromeda">Andromeda</option>
                <option value="sombrero">Sombrero</option>
              </select>
            </div>
          </div>

          {/* ✨ BOTTONI FUORI DAL CONTAINER PER MANTENERLI FISSI ✨ */}
          <div className="Ffilter-actions">
            <button
              className="Fcart-drawer-btn reset-btn"
              onClick={resetFilters}
            >
              Reset
            </button>

            <button className="Fcart-drawer-btn" onClick={handleSubmit}>
              Applica
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

