import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import galaxyIcon from "/img/galaxy-icon.png";
import usePageMeta from "../hooks/app/usePageMeta.js";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = location.state?.transactionId;
  const invoiceId = location.state?.invoiceId;
  const total = location.state?.total;
  const email = location.state?.email;
  const itemCount = location.state?.itemCount;

  usePageMeta(
    "Ordine confermato",
    "Controlla la conferma finale del tuo acquisto interstellare appena completato.",
  );

  useEffect(() => {
    if (!transactionId) {
      navigate("/");
    }
  }, [navigate, transactionId]);

  if (!transactionId) {
    return null;
  }

  return (
    <div className="galaxy-page thanks success-page-upgrade">
      <div className="success-card-panel">
        <p className="catalog-overline">Acquisto completato</p>
        <h1>Ordine confermato</h1>
        <p>
          Il tuo ordine e ora confermato ed e in coda per la consegna via email e l'elaborazione post-acquisto.
        </p>

        <div className="success-summary-grid">
          <div>
            <span>Transazione</span>
            <strong>{transactionId}</strong>
          </div>
          <div>
            <span>Fattura</span>
            <strong>#{invoiceId}</strong>
          </div>
          <div>
            <span>Totale</span>
            <strong>EUR {Number(total || 0).toFixed(2)}</strong>
          </div>
          <div>
            <span>Articoli</span>
            <strong>{itemCount}</strong>
          </div>
        </div>

        <p className="success-email-note">
          {email
            ? `Un'email di conferma verra inviata a ${email}`
            : "Si sta preparando un'email di conferma"}{" "}
          con dettagli dell'ordine, certificati e indicazioni sui prossimi passi.
        </p>

        <div className="success-action-row">
          <Link className="checkout-btn" to="/search">
            Continua lo shopping
          </Link>
          <Link className="back-to-cart-btn" to="/contact-us">
            Contatta il supporto
          </Link>
        </div>

        <div className="gal-dim" style={{ textAlign: "center", marginTop: "30px" }}>
          <Link to="/">
            <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" style={{ width: "120px", height: "120px" }} />
          </Link>
        </div>
        <p className="go-back-text">Torna alla home quando vuoi esplorare altri mondi.</p>
      </div>
    </div>
  );
}

