import PackageCard from "../MicroComponents/packageCard";

export default function PlanetPackagesSection({ planet, stacks, onAddToCart }) {
  const isReady = planet && Array.isArray(stacks);

  return (
    <section className="packages-section">
      <div className="cosmic-container">
        <h2 className="section-title">Scegli il Tuo Pacchetto</h2>

        <div className="packages">
          {isReady ? (
            stacks.map((stack) => (
              <PackageCard
                key={stack.id}
                {...stack}
                planet_name={planet.name}
                planet_image={planet.image}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <p className="planet-spec-value">Caricamento pacchetti...</p>
          )}
        </div>
      </div>
    </section>
  );
}
