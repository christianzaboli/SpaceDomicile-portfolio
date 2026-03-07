import { createContext, useState, useContext, useEffect } from "react";
import Toast from "../Components/MicroComponents/Toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const clearCart = () => setItems({});

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      setItems(savedCart ? JSON.parse(savedCart) : {});
    } catch (err) {
      setItems({});
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

  // ✨ MODIFICATO: Controlla lo stock prima di aggiungere ✨
  const addToCart = (product) => {
    setItems((current) => {
      const exists = current[product.id];

      if (exists) {
        const newQuantity = exists.quantity + 1;

        // ✨ Se supera lo stock, non aggiungere ✨
        if (newQuantity > product.stock) {
          setToastMessage(
            `Disponibili solo ${product.stock} unità di ${product.name}!`
          );
          setShowToast(true);
          return current; // Non modificare il carrello
        }

        setToastMessage(`${product.name} aggiunto al carrello!`);
        setShowToast(true);
        return {
          ...current,
          [product.id]: { ...exists, quantity: newQuantity },
        };
      } else {
        // ✨ Primo inserimento: controlla che stock >= 1 ✨
        if (product.stock < 1) {
          setToastMessage(`${product.name} non disponibile!`);
          setShowToast(true);
          return current;
        }

        setToastMessage(`${product.name} aggiunto al carrello!`);
        setShowToast(true);
        return { ...current, [product.id]: { ...product, quantity: 1 } };
      }
    });
  };

  const onQtyChange = (id, newQty) => {
    setItems((current) => {
      const copy = { ...current };
      const maxStock = copy[id].stock;
      const safeQty = Math.min(newQty, maxStock);

      if (newQty <= 0) {
        delete copy[id];
        return copy;
      }
      if (newQty > maxStock) {
        setToastMessage("Hai raggiunto la massima quantità disponibile!");
        setShowToast(true);
      } else {
        copy[id] = { ...copy[id], quantity: safeQty };
      }
      return copy;
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        onQtyChange,
        loading,
        clearCart,
      }}
    >
      {children}
      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
