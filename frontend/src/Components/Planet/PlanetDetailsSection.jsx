export default function PlanetDetailsSection({ planet }) {
  return (
    <section className="planet-details-section">
      <div className="planet-visual">
        <div className="planet-visual-container">
          <img
            className="planet-visual-image"
            src={planet?.image}
            alt={planet?.name}
          />
          <div className="planet-visual-name">{planet?.name}</div>
        </div>
      </div>

      <div className="planet-details-content">
        <h1 className="planet-details-title">{planet?.name}</h1>
        <p className="planet-details-description">{planet?.description}</p>

        <div className="planet-specs">
          <div className="planet-spec-item">
            <div className="planet-spec-icon">
              <i className="fas fa-temperature-half"></i>
            </div>
            <div>
              <div className="planet-spec-label">Temperatura</div>
              <div className="planet-spec-value">
                <span>Da </span>
                {planet?.temperature_min} <span>a</span> {planet?.temperature_max}
                <span> &deg;C</span>
              </div>
            </div>
          </div>

          <div className="planet-spec-item">
            <div className="planet-spec-icon">
              <i className="fas fa-mountain"></i>
            </div>
            <div>
              <div className="planet-spec-label">Superficie</div>
              <div className="planet-spec-value">
                {planet?.planet_size} <span>KM&#178;</span>
              </div>
            </div>
          </div>

          <div className="planet-spec-item">
            <div className="planet-spec-icon">
              <i className="fas fa-globe"></i>
            </div>
            <div>
              <div className="planet-spec-label">Galassia</div>
              <div className="planet-spec-value">{planet?.galaxy_name}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
