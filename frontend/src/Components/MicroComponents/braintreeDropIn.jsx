import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import axios from "axios";
import { buildApiUrl } from "../../libs/utils.jsx";

export default function BraintreeDropIn({
  amount,
  invoiceId,
  onSuccess,
  onError,
}) {
  const instanceRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Initialize Drop-In
  useEffect(() => {
    let isCancelled = false;

    // Load Braintree widget
    async function init() {
      try {
        setLoading(true);

        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        const { data } = await axios.get(buildApiUrl("/api/payment/token"));

        if (isCancelled) return;

        const instance = await dropin.create({
          authorization: data.clientToken,
          container: containerRef.current,
          paypal: {
            flow: "checkout",
            amount,
            currency: "EUR",
          },
          card: { cardholderName: true },
        });

        instanceRef.current = instance;
      } catch (err) {
        console.error("Errore creazione Drop-In:", err);
        onError?.(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    init();

    return () => {
      isCancelled = true;
      if (instanceRef.current) {
        instanceRef.current.teardown().catch(() => {});
      }
    };
  }, [amount, onError]);

  // Submit payment
  const handlePayment = async () => {
    if (!instanceRef.current || isPaying) return;
    setIsPaying(true);

    if (!invoiceId) {
      onError?.(new Error("Invoice mancante: conferma prima l'ordine."));
      setIsPaying(false);
      return;
    }

    try {
      const payload = await instanceRef.current.requestPaymentMethod();
      const nonce = payload.nonce;

      // Detect payment method
      const method =
        payload.type === "PayPalAccount" ? "paypal" : "credit_card";

      const { data } = await axios.post(buildApiUrl("/api/payment/checkout"), {
        amount,
        nonce,
        invoice_id: invoiceId,
        method,
      });

      if (data.success === false) {
        const error = new Error(data.error || "Errore nel pagamento");
        error.details = data;
        console.error("Errore pagamento:", data);
        onError?.(error);
        setIsPaying(false);
        return;
      }

      onSuccess?.(data);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const error = new Error(errorData.error || "Errore nel pagamento");
        error.details = errorData;
        console.error("Errore pagamento:", errorData);
        onError?.(error);
      } else {
        console.error("Errore richiesta metodo di pagamento:", err);
        onError?.(err);
      }
      setIsPaying(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div ref={containerRef} id="bt-container" />

      <button
        className="checkout-btn"
        disabled={loading || isPaying} // BOTTONE bloccato mentre paga
        onClick={handlePayment}
        style={{ marginTop: "15px" }}
      >
        {loading
          ? "Caricamento pagamento..."
          : isPaying
            ? "Elaborazione pagamento..."
            : `Paga €${amount}`}
      </button>
    </div>
  );
}
