import { useState } from "react";
import { submitPayment } from "../../api/commerce.js";
import { trackEvent } from "../../lib/eventBus.js";

export default function MockPaymentCheckout({ amount, invoiceId, onSuccess, onError }) {
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState("card");

  const handlePayment = async (selectedMethod) => {
    if (isPaying) return;
    if (!invoiceId) {
      onError?.(new Error("Ordine non ancora pronto per il pagamento."));
      return;
    }

    setMethod(selectedMethod);
    setIsPaying(true);
    trackEvent("payment_attempt", { invoiceId, amount, method: selectedMethod });

    try {
      const data = await submitPayment({
        amount,
        invoice_id: invoiceId,
        method: selectedMethod,
      });

      if (data.success === false) {
        const error = new Error(data.error || "Impossibile completare il pagamento");
        error.details = data;
        onError?.(error);
        return;
      }

      onSuccess?.(data?.transaction?.id);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="checkout-panel" style={{ marginTop: "12px" }}>
        <h3>Ambiente di pagamento demo</h3>
        <p style={{ opacity: 0.8, lineHeight: 1.5, marginBottom: "14px" }}>
          Questa modalita di pagamento simula un flusso di conferma in stile produzione per uso portfolio.
        </p>

        <div className="checkout-btn-row" style={{ paddingTop: 0 }}>
          <button className="checkout-btn" disabled={isPaying} onClick={() => handlePayment("card")}>
            {isPaying && method === "card" ? "Elaborazione carta..." : `Paga con carta EUR ${amount}`}
          </button>

          <button className="checkout-btn" disabled={isPaying} onClick={() => handlePayment("paypal")}>
            {isPaying && method === "paypal" ? "Elaborazione PayPal..." : `Paga con PayPal EUR ${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
