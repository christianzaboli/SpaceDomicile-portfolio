import { AnimatePresence } from "framer-motion";
import DeleteCartOverlay from "./deleteCartOverlay";
import { useState } from "react";

export default function CartItem({ item, onQtyChange }) {
  const [open, setOpen] = useState(false);
  const deleteItem = () => {
    console.log("elemento eliminato");
    onQtyChange(item.id, 0);
    setOpen(false);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <DeleteCartOverlay
            open={open}
            onConfirm={deleteItem}
            onCancel={() => setOpen(false)}
            text={"Sei sicuro di voler eliminare questo elemento?"}
          />
        )}
      </AnimatePresence>
      <div className="cart-card">
        <div className="cart-card-img-wrap">
          {item.planet_image ? (
            <img
              src={item.planet_image}
              alt={item.planet_name}
              className="cart-card-planet-img"
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
          <div className="cart-card-details">
            <div className="cart-card-quantity">
              <button
                onClick={() => onQtyChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                title="Diminuisci quantità"
              >
                -
              </button>
              <span className="cart-card-qty">{item.quantity}</span>
              <button
                onClick={() => onQtyChange(item.id, item.quantity + 1)}
                title="Aumenta quantità"
              >
                +
              </button>
            </div>
            <span className="cart-card-price">
              €{Number(item.price).toFixed(2)}
            </span>
          </div>
          <div className="cart-card-bottom-row">
            {item.description && (
              <span className="cart-card-description">{item.description}</span>
            )}
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
    </>
  );
}

