import { useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../../libs/utils.jsx";

export default function MockPaymentCheckout({
  amount,
  invoiceId,
  onSuccess,
  onError,
}) {
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState("card");

  const handlePayment = async (selectedMethod) => {
    if (isPaying) return;
    if (!invoiceId) {
      onError?.(new Error("Invoice mancante: conferma prima l'ordine."));
      return;
    }

    setMethod(selectedMethod);
    setIsPaying(true);

    try {
      const { data } = await axios.post(buildApiUrl("/api/payment/checkout"), {
        amount,
        invoice_id: invoiceId,
        method: selectedMethod,
      });

      if (data.success === false) {
        const error = new Error(data.error || "Errore nel pagamento demo");
        error.details = data;
        onError?.(error);
        return;
      }
      onSuccess(data?.transaction?.id);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const error = new Error(errorData.error || "Errore nel pagamento demo");
        error.details = errorData;
        onError?.(error);
      } else {
        onError?.(err);
      }
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="checkout-panel" style={{ marginTop: "12px" }}>
        <h3>Demo payment environment</h3>
        <p style={{ opacity: 0.8, lineHeight: 1.5, marginBottom: "14px" }}>
          Questa è una simulazione interna del pagamento per la versione
          pubblica portfolio.
        </p>

        <div className="checkout-btn-row" style={{ paddingTop: 0 }}>
          <button
            className="checkout-btn"
            disabled={isPaying}
            onClick={() => handlePayment("card")}
          >
            {isPaying && method === "card"
              ? "Processing payment..."
              : `Paga con carta €${amount}`}
          </button>

          <button
            className="checkout-btn"
            disabled={isPaying}
            onClick={() => handlePayment("paypal")}
          >
            {isPaying && method === "paypal"
              ? "Processing payment..."
              : `Paga con PayPal €${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
