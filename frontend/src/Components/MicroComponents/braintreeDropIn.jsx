import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import { fetchPaymentToken, submitPayment } from "../../api/commerce.js";
import { trackEvent } from "../../lib/analytics.js";

export default function BraintreeDropIn({ amount, invoiceId, onSuccess, onError }) {
  const instanceRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        setLoading(true);

        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        const data = await fetchPaymentToken();
        if (data.success === false) {
          throw new Error(data.error || "Impossibile creare il token di pagamento");
        }

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
      } catch (error) {
        onError?.(error);
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

  const handlePayment = async () => {
    if (!instanceRef.current || isPaying) return;
    setIsPaying(true);

    if (!invoiceId) {
      onError?.(new Error("Ordine non ancora pronto per il pagamento."));
      setIsPaying(false);
      return;
    }

    try {
      const payload = await instanceRef.current.requestPaymentMethod();
      const nonce = payload.nonce;
      const method = payload.type === "PayPalAccount" ? "paypal" : "credit_card";

      trackEvent("payment_attempt", { invoiceId, amount, method });

      const data = await submitPayment({
        amount,
        nonce,
        invoice_id: invoiceId,
        method,
      });

      if (data.success === false) {
        const error = new Error(data.error || "Impossibile completare il pagamento");
        error.details = data;
        onError?.(error);
        setIsPaying(false);
        return;
      }

      onSuccess?.(data?.transaction?.id);
    } catch (error) {
      onError?.(error);
      setIsPaying(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div ref={containerRef} id="bt-container" />

      <button
        className="checkout-btn"
        disabled={loading || isPaying}
        onClick={handlePayment}
        style={{ marginTop: "15px" }}
      >
        {loading
          ? "Caricamento opzioni di pagamento..."
          : isPaying
            ? "Elaborazione pagamento..."
            : `Paga EUR ${amount}`}
      </button>
    </div>
  );
}
