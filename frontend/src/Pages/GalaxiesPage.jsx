import { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../libs/utils";
import GalaxyCard from "../Components/Galaxy/GalaxyCard";
import BackToHomeBtn from "../Components/MicroComponents/BackToHomeBtn";
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
            <GalaxyCard key={galaxy.id} galaxy={galaxy} />
          ))}
        </div>

        <BackToHomeBtn />
      </div>
    </div>
  );
}
