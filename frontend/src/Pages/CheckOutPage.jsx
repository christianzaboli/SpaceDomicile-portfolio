import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../Contexts/CartContext.jsx";
import useCheckoutFlow from "../hooks/checkout/useCheckoutFlow.js";
import usePageMeta from "../hooks/app/usePageMeta.js";
import { createOrder, purchaseStackQuantity } from "../api/commerce.js";
import { usePaymentConfigQuery } from "../hooks/queries/useCommerceQueries.js";
import { normalizePaymentMode, PAYMENT_MODE } from "../libs/utils.jsx";
import MockPaymentCheckout from "../Components/MicroComponents/MockPaymentCheckout.jsx";
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn.jsx";
import { trackEvent } from "../lib/analytics.js";
import { isFeatureEnabled } from "../lib/featureFlags.js";

const fieldLabels = {
  nome: "Nome",
  cognome: "Cognome",
  email: "Email",
  telefono: "Telefono",
  indirizzo: "Indirizzo",
  civico: "Numero civico",
  citta: "Citta",
  CAP: "CAP",
  provincia: "Provincia",
  paese: "Paese",
  azienda: "Azienda",
  piva: "Partita IVA",
  pec: "PEC",
  sdi: "SDI",
};

const checkoutSchema = z
  .object({
    nome: z.string().min(2, "Inserisci un nome valido"),
    cognome: z.string().min(2, "Inserisci un cognome valido"),
    email: z.string().email("Inserisci un'email valida"),
    telefono: z.string().min(7, "Inserisci un numero di telefono valido"),
    indirizzo: z.string().min(3, "Inserisci un indirizzo valido"),
    civico: z.string().min(1, "Obbligatorio"),
    citta: z.string().min(2, "Inserisci una citta valida"),
    CAP: z.string().regex(/^\d{5}$/, "Usa un CAP di 5 cifre"),
    provincia: z.string().min(2, "Inserisci una provincia valida"),
    paese: z.string().min(2, "Inserisci un paese valido"),
    wantInvoice: z.boolean(),
    sameAsShipping: z.boolean(),
    isCompany: z.boolean(),
    billing_nome: z.string().optional(),
    billing_cognome: z.string().optional(),
    billing_email: z.string().optional(),
    billing_telefono: z.string().optional(),
    billing_indirizzo: z.string().optional(),
    billing_civico: z.string().optional(),
    billing_citta: z.string().optional(),
    billing_CAP: z.string().optional(),
    billing_provincia: z.string().optional(),
    billing_paese: z.string().optional(),
    azienda: z.string().optional(),
    piva: z.string().optional(),
    pec: z.string().optional(),
    sdi: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.wantInvoice) {
      return;
    }

    const billingFields = [
      ["billing_nome", values.billing_nome],
      ["billing_cognome", values.billing_cognome],
      ["billing_email", values.billing_email],
      ["billing_telefono", values.billing_telefono],
      ["billing_indirizzo", values.billing_indirizzo],
      ["billing_civico", values.billing_civico],
      ["billing_citta", values.billing_citta],
      ["billing_CAP", values.billing_CAP],
      ["billing_provincia", values.billing_provincia],
      ["billing_paese", values.billing_paese],
    ];

    billingFields.forEach(([field, value]) => {
      if (!String(value || "").trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "Obbligatorio",
        });
      }
    });

    if (
      values.billing_email &&
      !z.string().email().safeParse(values.billing_email).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["billing_email"],
        message: "Inserisci un'email valida",
      });
    }

    if (values.billing_CAP && !/^\d{5}$/.test(values.billing_CAP)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["billing_CAP"],
        message: "Usa un CAP di 5 cifre",
      });
    }

    if (values.isCompany) {
      if (!values.azienda) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["azienda"],
          message: "Obbligatorio",
        });
      }
      if (!/^\d{11}$/.test(values.piva || "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["piva"],
          message: "La partita IVA deve avere 11 cifre",
        });
      }
      if (values.pec && !z.string().email().safeParse(values.pec).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pec"],
          message: "Inserisci una PEC valida",
        });
      }
      if (values.sdi && !/^[A-Za-z0-9]{7}$/.test(values.sdi)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sdi"],
          message: "Usa un SDI valido di 7 caratteri",
        });
      }
    }
  });

const STEP_FIELDS = {
  contact: ["nome", "cognome", "email", "telefono"],
  shipping: ["indirizzo", "civico", "citta", "CAP", "provincia", "paese"],
  billing: [
    "wantInvoice",
    "sameAsShipping",
    "isCompany",
    "billing_nome",
    "billing_cognome",
    "billing_email",
    "billing_telefono",
    "billing_indirizzo",
    "billing_civico",
    "billing_citta",
    "billing_CAP",
    "billing_provincia",
    "billing_paese",
    "azienda",
    "piva",
    "pec",
    "sdi",
  ],
};

const defaultValues = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  indirizzo: "",
  civico: "",
  citta: "",
  CAP: "",
  provincia: "",
  paese: "",
  wantInvoice: false,
  sameAsShipping: false,
  isCompany: false,
  billing_nome: "",
  billing_cognome: "",
  billing_email: "",
  billing_telefono: "",
  billing_indirizzo: "",
  billing_civico: "",
  billing_citta: "",
  billing_CAP: "",
  billing_provincia: "",
  billing_paese: "",
  azienda: "",
  piva: "",
  pec: "",
  sdi: "",
};

function mapShippingAddress(values) {
  return `${values.indirizzo} ${values.civico}, ${values.citta} ${values.CAP}, ${values.provincia}, ${values.paese}`;
}

function mapBillingAddress(values) {
  return `${values.billing_indirizzo} ${values.billing_civico}, ${values.billing_citta} ${values.billing_CAP}, ${values.billing_provincia}, ${values.billing_paese}`;
}

function toBackendBilling(values) {
  return {
    nome: values.billing_nome,
    cognome: values.billing_cognome,
    email: values.billing_email,
    telefono: values.billing_telefono,
    indirizzo: values.billing_indirizzo,
    civico: values.billing_civico,
    citta: values.billing_citta,
    "città": values.billing_citta,
    CAP: values.billing_CAP,
    provincia: values.billing_provincia,
    paese: values.billing_paese,
    azienda: values.azienda,
    piva: values.piva,
    pec: values.pec,
    sdi: values.sdi,
  };
}

function CheckoutStepNav({ steps, activeStep, completedSteps, onSelect }) {
  const stepLabels = {
    contact: "contatto",
    shipping: "spedizione",
    billing: "fatturazione",
    review: "riepilogo",
    payment: "pagamento",
  };

  return (
    <div
      className="checkout-stepper"
      role="tablist"
      aria-label="Avanzamento checkout"
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step);
        const isActive = activeStep === step;
        return (
          <button
            key={step}
            type="button"
            className={`checkout-step ${isActive ? "active" : ""} ${isCompleted ? "done" : ""}`}
            onClick={() => onSelect(step)}
          >
            <span>{index + 1}</span>
            {stepLabels[step] || step}
          </button>
        );
      })}
    </div>
  );
}

function FormField({ register, errors, name, label, type = "text" }) {
  return (
    <label className="checkout-field">
      <span>{label || fieldLabels[name] || name}</span>
      <input
        type={type}
        {...register(name)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && (
        <small className="field-error">{errors[name].message}</small>
      )}
    </label>
  );
}

function ReviewPanel({ values, cartLines, summary }) {
  return (
    <div className="checkout-review-grid">
      <section className="checkout-panel">
        <h3>Contatto e spedizione</h3>
        <p>
          {values.nome} {values.cognome}
        </p>
        <p>{values.email}</p>
        <p>{values.telefono}</p>
        <p>{mapShippingAddress(values)}</p>
      </section>

      <section className="checkout-panel">
        <h3>Fatturazione</h3>
        {values.wantInvoice ? (
          <>
            <p>
              {values.billing_nome} {values.billing_cognome}
            </p>
            <p>{values.billing_email}</p>
            <p>{mapBillingAddress(values)}</p>
            {values.isCompany && <p>{values.azienda} - P. IVA {values.piva}</p>}
          </>
        ) : (
          <p>
            Nessuna fattura richiesta. La fatturazione usera il contatto di
            spedizione.
          </p>
        )}
      </section>

      <section className="checkout-panel order-summary">
        <h3>Riepilogo ordine</h3>
        <ul>
          {cartLines.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity}
              <span>EUR {(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="checkout-total">
          <strong>Spedizione:</strong>{" "}
          {summary.shippingCost === 0
            ? "Gratis"
            : `EUR ${summary.shippingCost.toFixed(2)}`}
        </div>
        <div className="checkout-total">
          <strong>Totale:</strong> EUR {summary.total.toFixed(2)}
        </div>
      </section>
    </div>
  );
}

export default function CheckOutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cartLines, clearCart } = useCart();
  const paymentConfigQuery = usePaymentConfigQuery();
  const flow = useCheckoutFlow(cartLines);

  usePageMeta(
    "Checkout",
    "Completa un checkout a fasi, convalidato e affidabile per riepilogo ordine e gestione del pagamento.",
  );

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const values = watch();

  useEffect(() => {
    const persisted = sessionStorage.getItem("checkout-form-values");
    if (persisted) {
      const parsed = JSON.parse(persisted);
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key, value, { shouldDirty: false });
      });
    }
  }, [setValue]);

  useEffect(() => {
    sessionStorage.setItem("checkout-form-values", JSON.stringify(values));
  }, [values]);

  useEffect(() => {
    if (values.sameAsShipping && values.wantInvoice) {
      setValue("billing_nome", values.nome, { shouldValidate: true });
      setValue("billing_cognome", values.cognome, { shouldValidate: true });
      setValue("billing_email", values.email, { shouldValidate: true });
      setValue("billing_telefono", values.telefono, { shouldValidate: true });
      setValue("billing_indirizzo", values.indirizzo, {
        shouldValidate: true,
      });
      setValue("billing_civico", values.civico, { shouldValidate: true });
      setValue("billing_citta", values.citta, { shouldValidate: true });
      setValue("billing_CAP", values.CAP, { shouldValidate: true });
      setValue("billing_provincia", values.provincia, {
        shouldValidate: true,
      });
      setValue("billing_paese", values.paese, { shouldValidate: true });
    }
  }, [setValue, values]);

  const createOrderMutation = useMutation({
    mutationFn: async (formValues) => {
      const shippingAddress = mapShippingAddress(formValues);
      const billingAddress = formValues.wantInvoice
        ? mapBillingAddress(formValues)
        : shippingAddress;
      const payload = {
        invoice_email: formValues.email,
        shipping_address: shippingAddress,
        invoice_address: billingAddress,
        items: cartLines.map((item) => ({
          stack_id: item.id,
          quantity: item.quantity,
        })),
        wantInvoice: formValues.wantInvoice,
        billing: formValues.wantInvoice ? toBackendBilling(formValues) : null,
        shipping_cost: flow.summary.shippingCost,
      };

      return createOrder(payload);
    },
    onSuccess: (result) => {
      const formValues = getValues();
      flow.setOrderCreated({
        invoiceId: result.invoiceId,
        checkoutSession: {
          status: "order_created",
          invoiceId: result.invoiceId,
        },
        orderReview: {
          email: formValues.email,
          shippingAddress: mapShippingAddress(formValues),
          billingAddress: formValues.wantInvoice
            ? mapBillingAddress(formValues)
            : mapShippingAddress(formValues),
          total: flow.summary.total,
          certificates: result.certificates,
        },
      });
    },
    onError: (error) => {
      flow.setCreatingOrder(false);
      flow.setPaymentError(
        error.message || "Creazione ordine non riuscita. Riprova.",
      );
    },
  });

  const paymentMode = normalizePaymentMode(
    paymentConfigQuery.data?.paymentMode || PAYMENT_MODE,
  );

  const nextStep = async () => {
    const currentStep = flow.activeStep;

    if (currentStep === "review") {
      flow.setCreatingOrder(true);
      createOrderMutation.mutate(getValues());
      trackEvent("begin_checkout", {
        total: flow.summary.total,
        itemCount: cartLines.length,
      });
      return;
    }

    const valid = await trigger(STEP_FIELDS[currentStep] || []);
    if (!valid) {
      return;
    }

    const stepIndex = flow.steps.indexOf(currentStep);
    const upcomingStep =
      flow.steps[Math.min(stepIndex + 1, flow.steps.length - 1)];
    flow.completeStep(currentStep, upcomingStep);

    if (currentStep === "shipping") {
      trackEvent("add_shipping_info", { country: values.paese });
    }
  };

  const handlePaymentSuccess = async (transactionId) => {
    await Promise.all(
      cartLines.map((item) => purchaseStackQuantity(item.id, item.quantity)),
    );

    trackEvent("purchase_success", {
      invoiceId: flow.invoiceId,
      transactionId,
      total: flow.summary.total,
    });

    clearCart();
    flow.resetFlow();
    sessionStorage.removeItem("checkout-form-values");
    queryClient.invalidateQueries({ queryKey: ["planets"] });

    navigate("/success", {
      state: {
        transactionId,
        invoiceId: flow.invoiceId,
        total: flow.summary.total,
        email: values.email,
        itemCount: cartLines.length,
      },
    });
  };

  const handlePaymentError = (error) => {
    const message = error?.message || "Pagamento non riuscito. Riprova.";
    flow.setPaymentError(message);
    trackEvent("purchase_failure", { invoiceId: flow.invoiceId, message });
  };

  if (cartLines.length === 0) {
    return (
      <div className="galaxy-page">
        <div className="catalog-empty-state checkout-empty-state">
          <h1>Il tuo checkout e vuoto.</h1>
          <p>
            Aggiungi un pacchetto al carrello prima di iniziare il processo di
            acquisto.
          </p>
          <button className="checkout-btn" onClick={() => navigate("/search")}>
            Sfoglia pianeti
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-page">
      <div className="checkout-page checkout-page-upgrade">
        <div className="catalog-header-panel checkout-header-panel">
          <p className="catalog-overline">Checkout sicuro</p>
          <h1>Completa il tuo ordine interstellare</h1>
          <p>
            Segui il checkout guidato per controllare contatti, spedizione,
            fatturazione e pagamento prima della conferma.
          </p>
        </div>

        <CheckoutStepNav
          steps={flow.steps}
          activeStep={flow.activeStep}
          completedSteps={flow.completedSteps}
          onSelect={flow.goToStep}
        />

        <form className="checkout-stage-shell" onSubmit={handleSubmit(() => {})}>
          {flow.activeStep === "contact" && (
            <section className="checkout-panel checkout-stage-panel">
              <h3>Dettagli di contatto</h3>
              <div className="checkout-fields-grid">
                <FormField register={register} errors={errors} name="nome" />
                <FormField
                  register={register}
                  errors={errors}
                  name="cognome"
                />
                <FormField
                  register={register}
                  errors={errors}
                  name="email"
                  type="email"
                />
                <FormField
                  register={register}
                  errors={errors}
                  name="telefono"
                />
              </div>
            </section>
          )}

          {flow.activeStep === "shipping" && (
            <section className="checkout-panel checkout-stage-panel">
              <h3>Indirizzo di spedizione</h3>
              <div className="checkout-fields-grid">
                <FormField
                  register={register}
                  errors={errors}
                  name="indirizzo"
                />
                <FormField register={register} errors={errors} name="civico" />
                <FormField
                  register={register}
                  errors={errors}
                  name="citta"
                  label="Citta"
                />
                <FormField
                  register={register}
                  errors={errors}
                  name="CAP"
                  label="CAP"
                />
                <FormField
                  register={register}
                  errors={errors}
                  name="provincia"
                  label="Provincia"
                />
                <FormField
                  register={register}
                  errors={errors}
                  name="paese"
                  label="Paese"
                />
              </div>
            </section>
          )}

          {flow.activeStep === "billing" && (
            <section className="checkout-panel checkout-stage-panel">
              <h3>Preferenze di fatturazione</h3>
              <div className="checkout-toggle-row">
                <label>
                  <input type="checkbox" {...register("wantInvoice")} />{" "}
                  Richiedi fattura
                </label>
                <label>
                  <input
                    type="checkbox"
                    {...register("sameAsShipping")}
                    disabled={!values.wantInvoice}
                  />
                  Fatturazione uguale alla spedizione
                </label>
                <label>
                  <input
                    type="checkbox"
                    {...register("isCompany")}
                    disabled={!values.wantInvoice}
                  />{" "}
                  Acquisto come azienda
                </label>
              </div>

              {values.wantInvoice ? (
                <div className="checkout-fields-grid">
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_nome"
                    label="Nome fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_cognome"
                    label="Cognome fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_email"
                    label="Email fatturazione"
                    type="email"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_telefono"
                    label="Telefono fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_indirizzo"
                    label="Indirizzo fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_civico"
                    label="Numero civico"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_citta"
                    label="Citta fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_CAP"
                    label="CAP fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_provincia"
                    label="Provincia fatturazione"
                  />
                  <FormField
                    register={register}
                    errors={errors}
                    name="billing_paese"
                    label="Paese fatturazione"
                  />
                  {values.isCompany && (
                    <>
                      <FormField
                        register={register}
                        errors={errors}
                        name="azienda"
                        label="Nome azienda"
                      />
                      <FormField
                        register={register}
                        errors={errors}
                        name="piva"
                        label="Partita IVA"
                      />
                      <FormField
                        register={register}
                        errors={errors}
                        name="pec"
                        label="PEC"
                      />
                      <FormField
                        register={register}
                        errors={errors}
                        name="sdi"
                        label="SDI"
                      />
                    </>
                  )}
                </div>
              ) : (
                <p className="checkout-helper-copy">
                  Nessuna fattura richiesta. La conferma ordine usera i tuoi
                  dati di spedizione.
                </p>
              )}
            </section>
          )}

          {flow.activeStep === "review" && (
            <ReviewPanel
              values={values}
              cartLines={cartLines}
              summary={flow.summary}
            />
          )}

          {flow.activeStep === "payment" && (
            <section className="checkout-payment-layout">
              <div className="checkout-panel">
                <h3>Pagamento</h3>
                <p>
                  La fattura #{flow.invoiceId} e pronta. Scegli il metodo di
                  pagamento per completare l'ordine.
                </p>
                {paymentMode === "mock" ? (
                  <MockPaymentCheckout
                    amount={flow.summary.total.toFixed(2)}
                    invoiceId={flow.invoiceId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <BraintreeDropIn
                    amount={flow.summary.total.toFixed(2)}
                    invoiceId={flow.invoiceId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
                {flow.paymentError && (
                  <p className="payerror">{flow.paymentError}</p>
                )}
              </div>

              <section className="checkout-panel order-summary sticky-summary-card">
                <h3>Riepilogo ordine</h3>
                <ul>
                  {cartLines.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity}
                      <span>EUR {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="checkout-total">
                  <strong>Spedizione:</strong>{" "}
                  {flow.summary.shippingCost === 0
                    ? "Gratis"
                    : `EUR ${flow.summary.shippingCost.toFixed(2)}`}
                </div>
                <div className="checkout-total">
                  <strong>Totale:</strong> EUR {flow.summary.total.toFixed(2)}
                </div>
                {isFeatureEnabled("accountUpsell") && (
                  <p className="checkout-helper-copy">
                    Dopo l'acquisto potrai usare l'email di conferma per creare
                    un account e tracciare gli ordini futuri.
                  </p>
                )}
              </section>
            </section>
          )}
        </form>

        {flow.activeStep !== "payment" && (
          <div className="checkout-navigation-row">
            <button
              className="back-to-cart-btn"
              type="button"
              onClick={() => {
                const currentIndex = flow.steps.indexOf(flow.activeStep);
                if (currentIndex === 0) {
                  navigate("/cart");
                  return;
                }
                flow.goToStep(flow.steps[currentIndex - 1]);
              }}
            >
              Indietro
            </button>

            <button
              className="checkout-btn"
              type="button"
              onClick={nextStep}
              disabled={flow.creatingOrder || createOrderMutation.isPending}
            >
              {flow.activeStep === "review"
                ? flow.creatingOrder || createOrderMutation.isPending
                  ? "Creazione ordine..."
                  : "Crea ordine e continua"
                : "Continua"}
            </button>
          </div>
        )}

        <section className="checkout-panel checkout-summary-footer-card">
          <h3>Perche questo checkout e piu sicuro</h3>
          <div className="cart-trust-list">
            <span>Dati di contatto e fatturazione convalidati</span>
            <span>Errori di pagamento recuperabili</span>
            <span>Passaggio di revisione prima dell'invio del pagamento</span>
          </div>
          <p className="checkout-helper-copy">
            Metodi accettati e modalita di pagamento vengono caricati
            dinamicamente dalla configurazione del catalogo.
          </p>
        </section>
      </div>
    </div>
  );
}
