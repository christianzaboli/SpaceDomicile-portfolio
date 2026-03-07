import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { AnimatePresence } from "framer-motion";

import galaxyIcon from "/img/galaxy-icon.png";

import CartItem from "../Components/MicroComponents/CartItem";
import DeleteCartOverlay from "../Components/MicroComponents/deleteCartOverlay";
import { scrollToTop } from "../libs/utils";

export default function CarrelloPage() {
  const { items, onQtyChange, loading, clearCart } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const emptyCart = () => {
    console.log("Carrello svuotato");
    clearCart();
    setOpen(false);
  };

  const itemsArray = Object.values(items);
  const total = itemsArray.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0),
    0,
  );

  const FREE_SHIPPING_THRESHOLD = 1500;

  if (loading) return <p>Caricamento carrello...</p>;

  return (
    <div className="galaxy-page">
      <AnimatePresence>
        {open && (
          <DeleteCartOverlay
            open={open}
            onConfirm={emptyCart}
            onCancel={() => setOpen(false)}
            text={"Stai svuotando l'intero carrello, vuoi procedere?"}
          />
        )}
      </AnimatePresence>

      <div className="cont-cart">
        <h1>Carrello</h1>

        {itemsArray.length === 0 ? (
          <p>Il carrello è vuoto</p>
        ) : (
          itemsArray.map((item) => (
            <CartItem key={item.id} item={item} onQtyChange={onQtyChange} />
          ))
        )}

        <h2>Totale: €{total.toFixed(2)}</h2>

        {itemsArray.length > 0 &&
          (total >= FREE_SHIPPING_THRESHOLD ? (
            <p className="shipping-text free-shipping">
              Hai diritto alla spedizione gratuita! 🚀
            </p>
          ) : (
            <p className="shipping-text partial-shipping">
              Ti mancano{" "}
              <strong>€{(FREE_SHIPPING_THRESHOLD - total).toFixed(2)}</strong>{" "}
              per ottenere la spedizione gratuita 🚀
            </p>
          ))}

        <div className="cart-buttons-container">
          <button
            className="checkout-btn"
            onClick={() => {
              navigate("/checkout");
              scrollToTop();
            }}
            disabled={itemsArray.length === 0}
          >
            Vai al checkout
          </button>

          <button
            className="empty-cart-btn"
            onClick={() => setOpen(true)}
            disabled={itemsArray.length === 0}
          >
            Svuota carrello
          </button>
        </div>
      </div>

      <div className="gal-dim">
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">
        Non sei pronto all’atterraggio? Clicca la galassia e rientra alla Home
      </p>
    </div>
  );
}
