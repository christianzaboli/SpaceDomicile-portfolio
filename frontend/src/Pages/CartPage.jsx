import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useCart } from "../Contexts/CartContext.jsx";
import galaxyIcon from "/img/galaxy-icon.png";
import CartItem from "../Components/MicroComponents/CartItem.jsx";
import DeleteCartOverlay from "../Components/MicroComponents/DeleteCartOverlay.jsx";
import usePageMeta from "../hooks/app/usePageMeta.js";

export default function CartPage() {
  const {
    cartLines,
    savedLines,
    loading,
    clearCart,
    saveForLater,
    moveSavedToCart,
    removeFromCart,
    summary,
    isReconciling,
  } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  usePageMeta(
    "Carrello",
    "Controlla i pacchetti interstellari selezionati, i vantaggi di consegna e la prontezza al checkout sicuro.",
  );

  if (loading) {
    return <p className="page-feedback">Caricamento carrello...</p>;
  }

  return (
    <div className="galaxy-page cart-page-upgrade">
      <AnimatePresence>
        {open && (
          <DeleteCartOverlay
            open={open}
            onConfirm={() => {
              clearCart();
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
            text={"Stai per svuotare completamente il carrello. Vuoi continuare?"}
          />
        )}
      </AnimatePresence>

      <div className="cont-cart cart-layout-grid">
        <section className="cart-main-column">
          <div className="catalog-header-panel cart-header-panel">
            <p className="catalog-overline">Riepilogo carrello</p>
            <h1>Prepara il tuo ordine per il checkout</h1>
            <p>
              Controlla le quantita, salva gli articoli per dopo e conferma che
              ogni pacchetto sia ancora disponibile.
            </p>
          </div>

          {isReconciling && (
            <p className="cart-sync-banner">Aggiornamento disponibilita e prezzi in base all'ultimo catalogo...</p>
          )}

          {summary.invalidItems.length > 0 && (
            <div className="cart-alert-panel">
              <strong>Attenzione:</strong> alcuni articoli nel carrello hanno cambiato disponibilita o prezzo e sono stati aggiornati.
            </div>
          )}

          {cartLines.length === 0 ? (
            <div className="catalog-empty-state">
              <h2>Il tuo carrello e vuoto.</h2>
              <p>Esplora il catalogo e aggiungi un pacchetto pianeta per iniziare il checkout.</p>
              <button className="checkout-btn" onClick={() => navigate("/search")}>
                Esplora pianeti
              </button>
            </div>
          ) : (
            cartLines.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onSaveForLater={saveForLater}
              />
            ))
          )}

          {savedLines.length > 0 && (
            <section className="saved-later-panel">
              <h2>Salvati per dopo</h2>
              {savedLines.map((item) => (
                <div key={item.id} className="saved-later-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>su {item.planet_name}</p>
                  </div>
                  <button className="back-to-cart-btn" onClick={() => moveSavedToCart(item.id)}>
                    Sposta nel carrello
                  </button>
                </div>
              ))}
            </section>
          )}
        </section>

        <aside className="cart-summary-card">
          <h2>Riepilogo ordine</h2>
          <div className="cart-summary-row">
            <span>Articoli</span>
            <strong>{summary.itemCount}</strong>
          </div>
          <div className="cart-summary-row">
            <span>Subtotale</span>
            <strong>EUR {summary.subtotal.toFixed(2)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>Spedizione</span>
            <strong>{summary.shippingCost === 0 ? "Gratis" : `EUR ${summary.shippingCost.toFixed(2)}`}</strong>
          </div>
          <div className="cart-summary-total">
            <span>Totale</span>
            <strong>EUR {summary.total.toFixed(2)}</strong>
          </div>

          <div className="shipping-progress-card">
            <div className="shipping-progress-track">
              <div
                className="shipping-progress-bar"
                style={{ width: `${summary.freeShippingProgress}%` }}
              />
            </div>
            {summary.freeShippingRemaining > 0 ? (
              <p>Spendi ancora EUR {summary.freeShippingRemaining.toFixed(2)} per ottenere la spedizione gratuita.</p>
            ) : (
              <p>Hai sbloccato la spedizione gratuita per questo ordine.</p>
            )}
          </div>

          <div className="cart-trust-list">
            <span>Metodi di pagamento sicuri</span>
            <span>Consegna tracciata del certificato</span>
            <span>Supporto disponibile anche dopo l'acquisto</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
            disabled={cartLines.length === 0 || summary.unavailableItems.length > 0}
          >
            Procedi al checkout
          </button>

          <button
            className="empty-cart-btn"
            onClick={() => setOpen(true)}
            disabled={cartLines.length === 0}
          >
            Svuota carrello
          </button>

          <p className="cart-policy-link">Politica di rimborso e dettagli di spedizione disponibili durante il checkout.</p>
        </aside>
      </div>

      <div className="gal-dim">
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">Hai bisogno di altra ispirazione? Torna alla home e continua a esplorare.</p>
    </div>
  );
}

