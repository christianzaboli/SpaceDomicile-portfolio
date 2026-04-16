import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Contexts/CartContext.jsx";
import { buildApiUrl, scrollToTop } from "../libs/utils.jsx";
import { FREE_SHIPPING_THRESHOLD } from "../libs/consts.jsx";
import {
  INITIAL_BILLING,
  INITIAL_SHIPPING,
} from "../Components/Checkout/checkoutConfig.js";

export default function useCheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [invoiceId, setInvoiceId] = useState(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const [shipping, setShipping] = useState(INITIAL_SHIPPING);
  const [billing, setBilling] = useState(INITIAL_BILLING);

  const [wantInvoice, setWantInvoice] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  const [paymentError, setPaymentError] = useState("");

  // Update shipping field
  const handleShipping = (e) =>
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Update billing field
  const handleBilling = (e) =>
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Toggle invoice option
  const handleToggleWantInvoice = (e) => {
    const value = e.target.checked;
    setWantInvoice(value);

    if (!value) {
      setSameAsShipping(false);
      setIsCompany(false);
    }
  };

  // Copy shipping to billing
  const handleSameAsShipping = () => {
    const nextValue = !sameAsShipping;
    setSameAsShipping(nextValue);

    if (nextValue) {
      setBilling((prev) => ({
        ...prev,
        nome: shipping.nome,
        cognome: shipping.cognome,
        email: shipping.email,
        telefono: shipping.telefono,
        indirizzo: shipping.indirizzo,
        civico: shipping.civico,
        città: shipping.città,
        CAP: shipping.CAP,
        provincia: shipping.provincia,
        paese: shipping.paese,
      }));
    }
  };

  // Validate checkout form
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+ ]{7,20}$/;
    const capRegex = /^[0-9]{5}$/;

    const check = (key, value, message = "Campo obbligatorio") => {
      if (!String(value).trim()) newErrors[key] = message;
    };

    check("shipping_nome", shipping.nome);
    check("shipping_cognome", shipping.cognome);
    if (!emailRegex.test(shipping.email))
      newErrors.shipping_email = "Email non valida";
    if (!phoneRegex.test(shipping.telefono))
      newErrors.shipping_telefono = "Numero non valido";
    check("shipping_indirizzo", shipping.indirizzo);
    check("shipping_civico", shipping.civico);
    check("shipping_città", shipping.città);
    if (!capRegex.test(shipping.CAP)) newErrors.shipping_CAP = "CAP non valido";
    check("shipping_provincia", shipping.provincia);
    check("shipping_paese", shipping.paese);

    if (wantInvoice) {
      check("billing_nome", billing.nome);
      check("billing_cognome", billing.cognome);

      if (!emailRegex.test(billing.email))
        newErrors.billing_email = "Email non valida";
      if (!phoneRegex.test(billing.telefono))
        newErrors.billing_telefono = "Numero non valido";

      check("billing_indirizzo", billing.indirizzo);
      check("billing_civico", billing.civico);
      check("billing_città", billing.città);
      if (!capRegex.test(billing.CAP)) newErrors.billing_CAP = "CAP non valido";
      check("billing_provincia", billing.provincia);
      check("billing_paese", billing.paese);

      if (isCompany) {
        check("billing_azienda", billing.azienda);
        if (!/^[0-9]{11}$/.test(billing.piva)) {
          newErrors.billing_piva = "Partita IVA non valida";
        }
        if (billing.pec && !emailRegex.test(billing.pec)) {
          newErrors.billing_pec = "PEC non valida";
        }
        if (billing.sdi && !/^[A-Za-z0-9]{7}$/.test(billing.sdi)) {
          newErrors.billing_sdi = "SDI non valido";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cartItems = Object.values(items);
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  const totalFinal = total + shippingCost;

  // Decrease stock after purchase
  const updateStockAfterPurchase = async () => {
    try {
      for (const item of cartItems) {
        await axios.post(buildApiUrl(`/api/stacks/${item.id}/purchase`), {
          quantity: item.quantity,
        });
      }
      console.log("Stock aggiornato");
    } catch (error) {
      console.error("Errore aggiornamento stock:", error);
    }
  };

  // Create the order
  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    try {
      setCreatingInvoice(true);
      setPaymentError("");

      const shippingAddress = `${shipping.indirizzo} ${shipping.civico}, ${shipping.città} ${shipping.CAP}, ${shipping.provincia}, ${shipping.paese}`;

      const billingAddress = wantInvoice
        ? `${billing.indirizzo} ${billing.civico}, ${billing.città} ${billing.CAP}, ${billing.provincia}, ${billing.paese}`
        : shippingAddress;

      const itemsArray = cartItems.map((item) => ({
        stack_id: item.id,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(buildApiUrl("/api/create_order"), {
        invoice_email: shipping.email,
        shipping_address: shippingAddress,
        invoice_address: billingAddress,
        items: itemsArray,
        wantInvoice,
        billing: wantInvoice ? billing : null,
        shipping_cost: shippingCost,
      });

      setInvoiceId(data.invoice.id);
    } catch (err) {
      console.error("Errore rete:", err);
      console.log("Errore rete");
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Complete successful payment
  const handlePaymentSuccess = async (id) => {
    setPaymentError("");
    await updateStockAfterPurchase();
    clearCart();
    navigate(`/success`, { state: { transactionId: id } });
    scrollToTop();
  };

  // Return to cart
  const handleBackToCart = () => {
    navigate("/cart");
    scrollToTop();
  };

  // Toggle payment error state
  const handlePaymentError = (error) => {
    const message =
      error?.message || "Errore nel pagamento. Riprova tra qualche istante.";
    setPaymentError(message);
  };
  // Toggle company invoice mode
  const toggleCompany = () => setIsCompany((prev) => !prev);

  return {
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
  };
}
