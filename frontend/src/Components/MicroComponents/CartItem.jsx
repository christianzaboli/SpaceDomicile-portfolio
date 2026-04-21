import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import DeleteCartOverlay from "./DeleteCartOverlay.jsx";
import { useCart } from "../../Contexts/CartContext.jsx";

export default function CartItem({ item, onRemove, onSaveForLater }) {
  const [open, setOpen] = useState(false);
  const { onQtyChange } = useCart();

  return (
    <>
      <AnimatePresence>
        {open && (
          <DeleteCartOverlay
            open={open}
            onConfirm={() => {
              onRemove(item.id);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
            text={"Rimuovere questo pacchetto dal carrello?"}
          />
        )}
      </AnimatePresence>

      <div className="cart-card cart-card-upgrade">
        <div className="cart-card-img-wrap">
          {item.planet_image ? (
            <img
              src={item.planet_image}
              alt={item.planet_name}
              className="cart-card-planet-img"
              loading="lazy"
            />
          ) : (
            <div className="cart-card-img-placeholder" />
          )}
        </div>
        <div className="cart-card-content">
          <div className="cart-card-header">
            <span className="cart-card-title">{item.name}</span>
            {item.planet_name && (
              <span className="cart-card-planet">
                su <strong>{item.planet_name}</strong>
              </span>
            )}
          </div>

          <div className="catalog-card-trust-row cart-line-badges">
            <span>{item.isUnavailable ? "Non disponibile" : "Disponibile ora"}</span>
            <span>{item.hasPriceChanged ? "Prezzo aggiornato" : "Prezzo bloccato per la revisione"}</span>
          </div>

          <div className="cart-card-details">
            <div className="cart-card-quantity">
              <button
                onClick={() => onQtyChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Diminuisci quantita per ${item.name}`}
              >
                -
              </button>
              <span className="cart-card-qty">{item.quantity}</span>
              <button
                onClick={() => onQtyChange(item.id, item.quantity + 1)}
                disabled={item.quantity >= Number(item.stock || 0)}
                aria-label={`Aumenta quantita per ${item.name}`}
              >
                +
              </button>
            </div>
            <span className="cart-card-price">EUR {Number(item.price).toFixed(2)}</span>
          </div>

          <div className="cart-card-bottom-row cart-card-actions-row">
            {item.description && (
              <span className="cart-card-description">{item.description}</span>
            )}
            <div className="cart-line-actions">
              <button className="back-to-cart-btn" onClick={() => onSaveForLater(item.id)}>
                Salva per dopo
              </button>
              <button
                className="cart-card-remove"
                onClick={() => setOpen(true)}
                title="Rimuovi dal carrello"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
