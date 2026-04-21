import PackageCard from "../MicroComponents/packageCard.jsx";

export default function PlanetPackagesSection({ planet, stacks, onAddToCart }) {
  return (
    <section className="packages-section">
      <div className="cosmic-container">
        <div className="section-heading-with-copy">
          <div>
            <h2 className="section-title">
              Compare ownership packages for {planet?.name}
            </h2>
          </div>
        </div>

        <div className="packages packages-grid-upgrade">
          {stacks?.map((stack) => (
            <PackageCard
              key={stack.id}
              {...stack}
              planet_name={planet.name}
              planet_image={planet.image}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
