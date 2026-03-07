import { useCart } from "../../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { scrollToTop } from "../../libs/utils";
export default function CartDrawer({ open, onClose }) {
  const { items, onQtyChange } = useCart();
  const itemsArray = Object.values(items);
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null); // ID dell'item da eliminare

  // Calcola il totale
  const total = itemsArray.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0),
    0,
  );

  const handleDeleteClick = (itemId) => {
    setDeleteConfirm(itemId);
  };

  const confirmDelete = (itemId) => {
    onQtyChange(itemId, 0);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-drawer-overlay" onClick={onClose} />
        <div className="cart-drawer-panel">
          <button className="cart-drawer-close" onClick={onClose}>
            &times;
          </button>
          <h3 className="cart-drawer-title">Il tuo carrello</h3>
          <ul className="cart-drawer-list">
            {itemsArray.length === 0 ? (
              <li className="cart-drawer-empty">Carrello vuoto</li>
            ) : (
              itemsArray.map((item) => (
                <li className="cart-drawer-item" key={item.id}>
                  {/* Overlay di conferma eliminazione */}
                  {deleteConfirm === item.id && (
                    <div className="delete-confirm-overlay">
                      <div className="delete-confirm-content">
                        <p>Eliminare questo prodotto?</p>
                        <div className="delete-confirm-buttons">
                          <button
                            className="delete-confirm-yes"
                            onClick={() => confirmDelete(item.id)}
                          >
                            Sì
                          </button>
                          <button
                            className="delete-confirm-no"
                            onClick={cancelDelete}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="cart-item-row">
                    <span className="cart-item-title">{item.name}</span>
                    <button
                      className="cart-item-delete"
                      onClick={() => handleDeleteClick(item.id)}
                      title="Rimuovi dal carrello"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <div className="planet-drawer">su {item.planet_name}</div>
                  <div className="price-drawer">€{item.price}</div>

                  <div className="cart-item-qty-controls">
                    <button
                      className="qty-btn qty-minus"
                      onClick={() => onQtyChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      title="Diminuisci quantità"
                    >
                      -
                    </button>
                    <span className="cart-item-qty">x{item.quantity}</span>
                    <button
                      className="qty-btn qty-plus"
                      onClick={() => onQtyChange(item.id, item.quantity + 1)}
                      title="Aumenta quantità"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {itemsArray.length > 0 && (
            <div className="cart-drawer-total">
              Totale: <strong>€{total.toFixed(2)}</strong>
            </div>
          )}

          <button
            className="cart-drawer-btn"
            onClick={() => {
              onClose();
              navigate("/cart");
              scrollToTop();
            }}
          >
            Vai al carrello
          </button>
        </div>
      </div>
    </>
  );
}
