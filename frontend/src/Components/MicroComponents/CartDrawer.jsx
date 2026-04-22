import { useCart } from "../../Contexts/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";

export default function CartDrawer({ open, onClose }) {
  const { trigger } = useWebHaptics();
  const { cartLines, onQtyChange, removeFromCart, summary } = useCart();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer-panel">
        <button
          className="cart-drawer-close"
          onClick={onClose}
          aria-label="Chiudi mini carrello"
        >
          x
        </button>
        <h3 className="cart-drawer-title">Il tuo carrello</h3>

        <div className="mini-cart-summary-card">
          <div>
            <span>Subtotale </span>
            <strong>
              <span className={summary.subtotal > 0 ? "subtotal-money" : ""}>
                {summary.subtotal.toFixed(2)}
              </span>{" "}
              €
            </strong>
          </div>
          <div>
            <span>Articoli: </span>
            <strong>{summary.itemCount}</strong>
          </div>
        </div>

        <div className="shipping-progress-card compact">
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-bar"
              style={{ width: `${summary.freeShippingProgress}%` }}
            />
          </div>
          {summary.freeShippingRemaining > 0 ? (
            <p>
              {summary.freeShippingRemaining.toFixed(2)} € alla spedizione
              gratuita.
            </p>
          ) : (
            <p>Spedizione gratuita sbloccata.</p>
          )}
        </div>

        <ul className="cart-drawer-list">
          {cartLines.length === 0 ? (
            <li className="cart-drawer-empty">Il tuo carrello e vuoto.</li>
          ) : (
            cartLines.map((item) => (
              <li className="cart-drawer-item" key={item.id}>
                {deleteConfirm === item.id && (
                  <div className="delete-confirm-overlay">
                    <div className="delete-confirm-content">
                      <p>Rimuovere questo prodotto?</p>
                      <div className="delete-confirm-buttons">
                        <button
                          className="delete-confirm-yes"
                          onClick={() => {
                            trigger([{ duration: 8 }], { intensity: 0.3 });
                            removeFromCart(item.id);
                            setDeleteConfirm(null);
                          }}
                        >
                          Si
                        </button>
                        <button
                          className="delete-confirm-no"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="cart-item-row">
                  <div>
                    <span className="cart-item-title">{item.name}</span>
                    <div className="planet-drawer">su {item.planet_name}</div>
                  </div>
                  <button
                    className="cart-item-delete"
                    onClick={() => setDeleteConfirm(item.id)}
                    title="Rimuovi dal carrello"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div className="price-drawer">
                  € {Number(item.price).toFixed(2)}
                </div>

                <div className="cart-item-qty-controls">
                  <button
                    className="qty-btn qty-minus"
                    onClick={() => onQtyChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    title="Diminuisci quantita"
                  >
                    -
                  </button>
                  <span className="cart-item-qty">x{item.quantity}</span>
                  <button
                    className="qty-btn qty-plus"
                    onClick={() => onQtyChange(item.id, item.quantity + 1)}
                    title="Aumenta quantita"
                    disabled={item.quantity >= Number(item.stock || 0)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <button
          className="cart-drawer-btn"
          onClick={() => {
            onClose();
            navigate("/checkout");
          }}
          disabled={cartLines.length === 0}
        >
          Vai al checkout
        </button>
        <button
          className="cart-drawer-btn cart-drawer-secondary-btn"
          onClick={() => {
            onClose();
            navigate("/cart");
          }}
        >
          Vedi carrello completo
        </button>
      </div>
    </div>
  );
}
