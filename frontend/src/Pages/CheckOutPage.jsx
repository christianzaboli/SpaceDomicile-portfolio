import ShippingPanel from "../Components/Checkout/ShippingPanel.jsx";
import BillingPanel from "../Components/Checkout/BillingPanel.jsx";
import OrderSummaryPanel from "../Components/Checkout/OrderSummaryPanel.jsx";
import CheckoutActions from "../Components/Checkout/CheckoutActions.jsx";
import useCheckoutPage from "../hooks/useCheckoutPage.jsx";

export default function CheckOutPage() {
  const {
    items,
    errors,
    invoiceId,
    creatingInvoice,
    shipping,
    billing,
    wantInvoice,
    sameAsShipping,
    isCompany,
    paymentError,
    shippingCost,
    totalFinal,
    handleShipping,
    handleBilling,
    handleToggleWantInvoice,
    handleSameAsShipping,
    toggleCompany,
    handleCreateOrder,
    handlePaymentSuccess,
    handlePaymentError,
    handleBackToCart,
  } = useCheckoutPage();

  return (
    <div className="galaxy-page">
      <div className="checkout-page">
        <h2>Checkout ordine</h2>

        <div className="checkout-row">
          <ShippingPanel
            shipping={shipping}
            errors={errors}
            onShippingChange={handleShipping}
            wantInvoice={wantInvoice}
            sameAsShipping={sameAsShipping}
            onToggleWantInvoice={handleToggleWantInvoice}
            onToggleSameAsShipping={handleSameAsShipping}
          />

          <BillingPanel
            billing={billing}
            errors={errors}
            wantInvoice={wantInvoice}
            sameAsShipping={sameAsShipping}
            isCompany={isCompany}
            onBillingChange={handleBilling}
            onToggleIsCompany={toggleCompany}
          />

          <OrderSummaryPanel
            items={items}
            shippingCost={shippingCost}
            totalFinal={totalFinal}
          />
        </div>

        <CheckoutActions
          onBackToCart={handleBackToCart}
          invoiceId={invoiceId}
          creatingInvoice={creatingInvoice}
          onCreateOrder={handleCreateOrder}
          totalFinal={totalFinal}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        {paymentError && <p className="payerror">{paymentError}</p>}
      </div>
    </div>
  );
}
