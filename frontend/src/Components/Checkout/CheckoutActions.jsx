import { useEffect, useState } from "react";
import axios from "axios";
import BraintreeDropIn from "../MicroComponents/braintreeDropIn.jsx";
import MockPaymentCheckout from "../MicroComponents/MockPaymentCheckout.jsx";
import {
  buildApiUrl,
  normalizePaymentMode,
  PAYMENT_MODE,
} from "../../libs/utils.jsx";

export default function CheckoutActions({
  onBackToCart,
  invoiceId,
  creatingInvoice,
  onCreateOrder,
  totalFinal,
  onPaymentSuccess,
  onPaymentError,
}) {
  const [resolvedPaymentMode, setResolvedPaymentMode] = useState(
    normalizePaymentMode(PAYMENT_MODE)
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentConfig() {
      try {
        const { data } = await axios.get(buildApiUrl("/api/payment/config"));
        if (!isMounted) return;
        setResolvedPaymentMode(normalizePaymentMode(data.paymentMode));
      } catch (error) {
        if (!isMounted) return;
        console.error("Errore recupero configurazione pagamenti:", error);
      }
    }

    loadPaymentConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  // Render checkout actions
  return (
    <div className="checkout-btn-row">
      <button className="back-to-cart-btn" onClick={onBackToCart}>
        ⬅ Torna al carrello
      </button>

      {!invoiceId ? (
        <button className="checkout-btn" onClick={onCreateOrder}>
          {creatingInvoice ? "Creazione ordine..." : "Procedi al pagamento"}
        </button>
      ) : resolvedPaymentMode === "mock" ? (
        <MockPaymentCheckout
          amount={totalFinal.toFixed(2)}
          invoiceId={invoiceId}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
        />
      ) : (
        <BraintreeDropIn
          amount={totalFinal.toFixed(2)}
          invoiceId={invoiceId}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
        />
      )}
    </div>
  );
}
