import { useEffect, useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn";
import axios from "axios";
import { buildApiUrl, scrollToTop } from "../libs/utils";

export default function CheckOutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [invoiceId, setInvoiceId] = useState(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // SHIPPING
  const [shipping, setShipping] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    civico: "",
    città: "",
    CAP: "",
    provincia: "",
    paese: "",
  });

  // BILLING
  const [billing, setBilling] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    civico: "",
    città: "",
    CAP: "",
    provincia: "",
    paese: "",
    azienda: "",
    piva: "",
    pec: "",
    sdi: "",
  });

  const [wantInvoice, setWantInvoice] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  // HANDLERS
  const handleShipping = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleBilling = (e) =>
    setBilling({ ...billing, [e.target.name]: e.target.value });

  const handleSameAsShipping = () => {
    const v = !sameAsShipping;
    setSameAsShipping(v);

    if (v) {
      setBilling({
        ...billing,
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
      });
    }
  };

  // VALIDAZIONE
  const validateForm = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+ ]{7,20}$/;
    const capRegex = /^[0-9]{5}$/;

    const check = (key, value, message = "Campo obbligatorio") => {
      if (!value.trim()) newErrors[key] = message;
    };

    // SHIPPING
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

    // BILLING SOLO SE wantInvoice
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
        if (!/^[0-9]{11}$/.test(billing.piva))
          newErrors.billing_piva = "Partita IVA non valida";
        if (billing.pec && !emailRegex.test(billing.pec))
          newErrors.billing_pec = "PEC non valida";
        if (billing.sdi && !/^[A-Za-z0-9]{7}$/.test(billing.sdi))
          newErrors.billing_sdi = "SDI non valido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // TOTALE
  const totale = Object.values(items).reduce(
    (a, item) => a + item.price * item.quantity,
    0,
  );
  const shippingCost = totale >= 1500 ? 0 : 4.99;
  const totaleFinale = totale + shippingCost;

  // STOCK UPDATE
  const updateStockAfterPurchase = async () => {
    try {
      for (const item of Object.values(items)) {
        await axios.post(buildApiUrl(`/api/stacks/${item.id}/purchase`), {
          quantity: item.quantity,
        });
      }
      console.log("Stock aggiornato");
    } catch (error) {
      console.error("Errore aggiornamento stock:", error);
    }
  };

  // CREA ORDER + INVOICE
  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    try {
      setCreatingInvoice(true);

      const shippingAddress = `${shipping.indirizzo} ${shipping.civico}, ${shipping.città} ${shipping.CAP}, ${shipping.provincia}, ${shipping.paese}`;

      const billingAddress = wantInvoice
        ? `${billing.indirizzo} ${billing.civico}, ${billing.città} ${billing.CAP}, ${billing.provincia}, ${billing.paese}`
        : shippingAddress;

      const itemsArray = Object.values(items).map((item) => ({
        stack_id: item.id,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(buildApiUrl("/api/create_order"), {
        invoice_email: shipping.email,
        shipping_address: shippingAddress,
        invoice_address: billingAddress,
        items: itemsArray,
        wantInvoice: wantInvoice,
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

  // PAGAMENTO OK
  const handlePaymentSuccess = async () => {
    await updateStockAfterPurchase();
    clearCart();
    navigate("/success");
    scrollToTop();
  };

  // PAGAMENTO NON COMPLETATO
  const [isError, setIsError] = useState(true);
  useEffect(() => setIsError(false), []);

  return (
    <div className="galaxy-page">
      <div className="checkout-page">
        <h2>Checkout ordine</h2>

        <div className="checkout-row">
          {/* SHIPPING */}
          <div className="checkout-panel">
            <h3>Dati di spedizione</h3>
            <form>
              {Object.keys(shipping).map((key) => (
                <div key={key}>
                  <input
                    name={key}
                    placeholder={key}
                    value={shipping[key]}
                    onChange={handleShipping}
                  />
                  {errors[`shipping_${key}`] && (
                    <p className="error">{errors[`shipping_${key}`]}</p>
                  )}
                </div>
              ))}
            </form>

            <label>
              <input
                style={{ marginTop: "15px" }}
                type="checkbox"
                checked={wantInvoice}
                onChange={(e) => {
                  const value = e.target.checked;
                  setWantInvoice(value);
                  if (!value) {
                    setSameAsShipping(false);
                    setIsCompany(false);
                  }
                }}
              />{" "}
              Voglio la fattura
            </label>

            <br />
            <label>
              <input
                style={{ marginTop: "15px" }}
                type="checkbox"
                disabled={!wantInvoice}
                checked={sameAsShipping}
                onChange={handleSameAsShipping}
              />{" "}
              Usa stessi dati per fatturazione
            </label>
          </div>

          {/* BILLING */}
          <div
            className="checkout-panel"
            style={{
              opacity: wantInvoice ? 1 : 0.5,
              pointerEvents: wantInvoice ? "auto" : "none",
            }}
          >
            <h3>Dati di fatturazione</h3>

            <form>
              {Object.keys(billing).map((key) => {
                const isCompanyField = [
                  "azienda",
                  "piva",
                  "pec",
                  "sdi",
                ].includes(key);

                const mustShow = wantInvoice && (!isCompanyField || isCompany);
                if (!mustShow) return null;

                return (
                  <div key={key}>
                    <input
                      name={key}
                      placeholder={key}
                      value={billing[key]}
                      onChange={handleBilling}
                      disabled={
                        !wantInvoice || (sameAsShipping && !isCompanyField)
                      }
                    />
                    {errors[`billing_${key}`] && (
                      <p className="error">{errors[`billing_${key}`]}</p>
                    )}
                  </div>
                );
              })}
            </form>

            {wantInvoice && (
              <label>
                <input
                  style={{ marginTop: "15px" }}
                  type="checkbox"
                  checked={isCompany}
                  onChange={() => setIsCompany(!isCompany)}
                />{" "}
                Acquisto come azienda
              </label>
            )}
          </div>

          {/* RIEPILOGO */}
          <div className="checkout-panel order-summary">
            <h3>Riepilogo ordine</h3>
            <ul>
              {Object.values(items).map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="checkout-total">
              <strong>Spedizione:</strong>{" "}
              {shippingCost === 0 ? "Gratis" : `€${shippingCost}`}
            </div>

            <div className="checkout-total">
              <strong>Totale:</strong> €{totaleFinale.toFixed(2)}
            </div>
          </div>
        </div>

        {/* BOTTONI */}
        <div className="checkout-btn-row">
          <button
            className="back-to-cart-btn"
            onClick={() => {
              navigate("/cart");
              scrollToTop();
            }}
          >
            ⬅ Torna al carrello
          </button>

          {!invoiceId ? (
            <button className="checkout-btn" onClick={handleCreateOrder}>
              {creatingInvoice ? "Creazione ordine..." : "Procedi al pagamento"}
            </button>
          ) : (
            <BraintreeDropIn
              amount={totaleFinale.toFixed(2)}
              invoiceId={invoiceId}
              onSuccess={handlePaymentSuccess}
              onError={() => setIsError(!isError)}
            />
          )}
        </div>
        {isError && <p className="payerror">Errore nel pagamento</p>}
      </div>
    </div>
  );
}
