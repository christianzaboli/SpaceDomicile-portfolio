import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { buildApiUrl, scrollToTop } from "../libs/utils";
import galaxyIcon from "/img/galaxy-icon.png"; // <--- IMPORT AGGIUNTO
export default function GalaxiesPage() {
  const [galaxies, setGalaxies] = useState([]);

  useEffect(() => {
    axios
      .get(buildApiUrl("/api/galaxies"))
      .then((response) => setGalaxies(response.data))
      .catch((err) => console.error("Errore nel caricamento galassie:", err));
  }, []);

  return (
    <div className="galaxy-page pos-gal">
      <div className="galaxies-section">
        <h2 className="galaxies-section-title">Galassie disponibili</h2>
        <p className="galaxies-section-desc">
          Scopri stelle, pianeti e sistemi abitabili
        </p>

        <div className="galaxies-cards-container">
          {galaxies.map((galaxy) => (
            <Link
              to={`/galaxies/${galaxy.slug}`}
              key={galaxy.id}
              className="galaxy-card-link"
              onClick={scrollToTop}
            >
              <div className="galaxy-card">
                <img
                  src={`/img/${galaxy.image}`}
                  alt={galaxy.name}
                  className="galaxy-card-image"
                />
                <div className="galaxy-card-title">{galaxy.name}</div>
                <div className="galaxy-card-description">
                  {galaxy.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="gal-dim" onClick={scrollToTop}>
          <Link to="/">
            <img
              src={galaxyIcon}
              alt="Galassia"
              className="galaxy-header-icon"
            />
          </Link>
        </div>
        <p className="go-back-text">
          Premi la galassia: la rotta per la Home è già calcolata!
        </p>
      </div>
    </div>
  );
}
