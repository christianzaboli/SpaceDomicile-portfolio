import BraintreeDropIn from "../MicroComponents/braintreeDropIn.jsx";

export default function CheckoutActions({
  onBackToCart,
  invoiceId,
  creatingInvoice,
  onCreateOrder,
  totalFinal,
  onPaymentSuccess,
  onPaymentError,
}) {
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
