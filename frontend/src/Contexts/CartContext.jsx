import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from "../Components/MicroComponents/Toast.jsx";
import { reconcileCartLines } from "../api/commerce.js";
import { buildCartSummary } from "../lib/cartSummary.js";
import { trackEvent } from "../lib/eventBus.js";

const CART_STORAGE_KEY = "cart";
const SAVED_STORAGE_KEY = "saved-cart";

const CartContext = createContext();

function toMap(lines) {
  return lines.reduce((accumulator, item) => {
    accumulator[item.id] = item;
    return accumulator;
  }, {});
}

function parseStoredMap(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [savedItems, setSavedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [isReconciling, setIsReconciling] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const hasReconciled = useRef(false);

  const showFeedback = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    const initialItems = parseStoredMap(CART_STORAGE_KEY);
    const initialSavedItems = parseStoredMap(SAVED_STORAGE_KEY);

    setItems(initialItems);
    setSavedItems(initialSavedItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    }
  }, [savedItems, loading]);

  useEffect(() => {
    if (loading || hasReconciled.current) {
      return;
    }

    const lines = Object.values(items);
    if (lines.length === 0) {
      return;
    }

    let isMounted = true;
    hasReconciled.current = true;

    async function syncCart() {
      setIsReconciling(true);
      try {
        const reconciled = await reconcileCartLines(lines);
        if (!isMounted) {
          return;
        }

        const nextMap = toMap(reconciled);
        const hasChanges = JSON.stringify(nextMap) !== JSON.stringify(items);

        if (hasChanges) {
          setItems(nextMap);
          showFeedback("Cart details were refreshed with the latest stock and pricing.");
        }
      } catch {
        if (isMounted) {
          showFeedback("We could not refresh cart availability right now.");
        }
      } finally {
        if (isMounted) {
          setIsReconciling(false);
        }
      }
    }

    syncCart();

    return () => {
      isMounted = false;
    };
  }, [items, loading]);

  const clearCart = () => setItems({});

  const removeFromCart = (id) => {
    setItems((current) => {
      const copy = { ...current };
      const removed = copy[id];
      delete copy[id];
      if (removed) {
        trackEvent("remove_from_cart", { stackId: id, name: removed.name });
      }
      return copy;
    });
    showFeedback("Item removed from cart.");
  };

  const saveForLater = (id) => {
    setItems((current) => {
      const line = current[id];
      if (!line) {
        return current;
      }

      setSavedItems((saved) => ({ ...saved, [id]: line }));
      const next = { ...current };
      delete next[id];
      return next;
    });
    showFeedback("Item saved for later.");
  };

  const moveSavedToCart = (id) => {
    setSavedItems((current) => {
      const line = current[id];
      if (!line) {
        return current;
      }

      setItems((cart) => ({
        ...cart,
        [id]: line,
      }));

      const next = { ...current };
      delete next[id];
      return next;
    });
    showFeedback("Saved item moved back to cart.");
  };

  const addToCart = (product) => {
    setItems((current) => {
      const exists = current[product.id];
      const stock = Number(product.stock ?? 0);

      if (exists) {
        const newQuantity = exists.quantity + 1;
        if (newQuantity > stock) {
          showFeedback(`Only ${stock} units are currently available.`);
          return current;
        }

        trackEvent("add_to_cart", {
          stackId: product.id,
          name: product.name,
          price: product.price,
          quantity: newQuantity,
        });
        showFeedback(`${product.name} added to cart.`);
        return {
          ...current,
          [product.id]: { ...exists, quantity: newQuantity },
        };
      }

      if (stock < 1) {
        showFeedback(`${product.name} is currently unavailable.`);
        return current;
      }

      trackEvent("add_to_cart", {
        stackId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      showFeedback(`${product.name} added to cart.`);
      return {
        ...current,
        [product.id]: {
          ...product,
          quantity: 1,
          isUnavailable: false,
          hasPriceChanged: false,
          hasStockChanged: false,
        },
      };
    });
  };

  const onQtyChange = (id, newQty) => {
    setItems((current) => {
      const copy = { ...current };
      const line = copy[id];
      if (!line) {
        return current;
      }

      const maxStock = Number(line.stock ?? 0);
      const safeQty = Math.min(newQty, maxStock);

      if (newQty <= 0) {
        delete copy[id];
        return copy;
      }

      if (newQty > maxStock) {
        showFeedback("You reached the maximum available quantity for this package.");
      }

      copy[id] = {
        ...line,
        quantity: safeQty,
      };

      return copy;
    });
  };

  const cartLines = useMemo(() => Object.values(items), [items]);
  const savedLines = useMemo(() => Object.values(savedItems), [savedItems]);
  const summary = useMemo(() => buildCartSummary(cartLines), [cartLines]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartLines,
        savedLines,
        addToCart,
        onQtyChange,
        removeFromCart,
        saveForLater,
        moveSavedToCart,
        loading,
        isReconciling,
        clearCart,
        summary,
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
