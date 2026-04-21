export default function PlanetDetailsSection({ planet }) {
  return (
    <section className="planet-details-section catalog-product-layout">
      <div className="planet-visual product-visual-card">
        <div className="planet-visual-container">
          <img
            className="planet-visual-image"
            src={planet?.image}
            alt={planet?.name}
            loading="eager"
          />
          <div className="planet-visual-name">{planet?.name}</div>
          <div className="product-trust-pills">
            <span>Checkout sicuro</span>
            <span>Certificato ufficiale</span>
            <span>Consegna pronta da regalare</span>
          </div>
        </div>
      </div>

      <div className="planet-details-content product-summary-column">
        {/* <p className="catalog-overline">Featured world</p> */}
        <h1 className="planet-details-title">{planet?.name}</h1>
        <p className="planet-details-description">{planet?.description}</p>

        <div className="planet-specs">
          <div className="planet-spec-item">
            <div className="planet-spec-icon">
              <i className="fas fa-temperature-half"></i>
            </div>
            <div>
              <div className="planet-spec-label">Intervallo di temperatura</div>
              <div className="planet-spec-value">
                {planet?.temperature_min} a {planet?.temperature_max} gradi C
              </div>
            </div>
          </div>

          <div className="planet-spec-item">
            <div className="planet-spec-icon">
              <i className="fas fa-mountain"></i>
            </div>
            <div>
              <div className="planet-spec-label">Superficie</div>
              <div className="planet-spec-value">{planet?.planet_size} KM2</div>
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

        {/* <div className="product-faq-panel">
          <h3>Why buyers trust this listing</h3>
          <ul>
            <li>Every package includes a collectible ownership certificate.</li>
            <li>Secure checkout supports card and PayPal flows.</li>
            <li>Popular gift option with polished post-purchase confirmation.</li>
          </ul>
        </div> */}
      </div>
    </section>
  );
}
