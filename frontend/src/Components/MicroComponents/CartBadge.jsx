import { useCart } from "../../Contexts/CartContext";
export default function CartBadge() {
  const { items } = useCart();

  // Calcola il totale quantità degli articoli in carrello
  const totalQuantity = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="cart-badge-wrapper">
      <i className="fas fa-shopping-cart cart-icon" aria-hidden="true"></i>
      {/* badge visibile solo se almeno 1 articolo */}
      {totalQuantity > 0 && (
        <span className="cart-badge">{totalQuantity}</span>
      )}
    </div>
  );
}

