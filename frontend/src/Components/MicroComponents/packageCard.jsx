const PACKAGE_HIGHLIGHTS = {
  small: "Ideale per collezionisti",
  medium: "Miglior valore",
  large: "Opzione regalo premium",
};

function getPackageTone(slug = "") {
  if (slug.includes("grande")) {
    return PACKAGE_HIGHLIGHTS.large;
  }
  if (slug.includes("medio")) {
    return PACKAGE_HIGHLIGHTS.medium;
  }
  return PACKAGE_HIGHLIGHTS.small;
}

export default function PackageCard(props) {
  const isOutOfStock = props.stock <= 0;
  const tone = getPackageTone(props.slug);

  return (
    <article className="package-card package-card-commerce" key={props.id}>
      <div className="package-header">
        <p className="package-tag">{tone}</p>
        <h3 className="package-name">{props.name}</h3>
        <div className="package-size">{props.title}</div>
      </div>

      <div className="package-price">
        <span className="price-currency">EUR </span>
        <span className="price-amount">{props.price}</span>
      </div>

      <div className="catalog-card-trust-row package-card-trust-row">
        <span>Certificato ufficiale</span>
        <span>Checkout sicuro</span>
      </div>

      <ul className="package-features">
        <li>
          <i className="fas fa-check"></i> Certificato di proprieta incluso
        </li>
        <li>
          <i className="fas fa-check"></i> Scheda coordinate galattiche
        </li>
        <li>
          <i className="fas fa-check"></i> Mappa di presentazione premium
        </li>
        <li>
          <i className="fas fa-check"></i> {props.title}
        </li>
        {props.slug.includes("medio") && (
          <li>
            <i className="fas fa-check"></i> Cornice premium inclusa
          </li>
        )}
        {props.slug.includes("grande") && (
          <>
            <li>
              <i className="fas fa-check"></i> Cornice premium inclusa
            </li>
            <li>
              <i className="fas fa-check"></i> Menzione del nome nel registro
              pubblico
            </li>
          </>
        )}
      </ul>

      <div className="package-card-buttons">
        <button
          className={`add-to-cart-button ${isOutOfStock ? "disabled" : ""}`}
          onClick={() => props.onAddToCart(props)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Esaurito" : "Aggiungi al carrello"}
        </button>
        <div className="stock-info">
          {isOutOfStock ? (
            <span className="out-of-stock">
              Temporaneamente non disponibile
            </span>
          ) : (
            <span className="in-stock">
              Solo {props.stock} rimasti disponibili
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
