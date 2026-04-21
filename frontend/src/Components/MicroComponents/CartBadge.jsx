import { useCart } from "../../Contexts/CartContext.jsx";

export default function CartBadge() {
  const { summary } = useCart();

  return (
    <div className="cart-badge-wrapper">
      <i className="fas fa-shopping-cart cart-icon" aria-hidden="true"></i>
      {summary.itemCount > 0 && <span className="cart-badge">{summary.itemCount}</span>}
    </div>
  );
}
