import { createBraintreeProvider } from "./braintreeProvider.js";
import { createMockProvider } from "./mockProvider.js";
import connection from "../../data/db.js";

function normalizeMode(value) {
  return String(value || "").trim().toLowerCase();
}

function getPaymentMode() {
  const mode = normalizeMode(process.env.PAYMENT_MODE);
  return mode === "mock" ? "mock" : "braintree";
}

function getProvider() {
  const mode = getPaymentMode();
  return mode === "mock" ? createMockProvider() : createBraintreeProvider();
}

export function getConfiguredPaymentMode() {
  return getPaymentMode();
}

function normalizeTransaction(transaction, fallback = {}) {
  return {
    id: transaction?.id ?? fallback.id ?? null,
    status: transaction?.status ?? fallback.status ?? "unknown",
    amount: String(transaction?.amount ?? fallback.amount ?? ""),
    paymentInstrumentType:
      transaction?.paymentInstrumentType ?? fallback.paymentInstrumentType ?? "card",
    createdAt: transaction?.createdAt ?? fallback.createdAt ?? new Date().toISOString(),
  };
}

function markInvoiceAsPaid(invoiceId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE invoices SET invoice_status = 'paid' WHERE id = ?",
      [invoiceId],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

export async function getPaymentClientToken() {
  const provider = getProvider();
  if (typeof provider.getClientToken !== "function") {
    return { success: false, provider: getPaymentMode(), error: "Client token not available for this payment mode" };
  }
  return provider.getClientToken();
}

export async function processPayment(payload) {
  const provider = getProvider();
  const startedAt = Date.now();
  const providerName = getPaymentMode();

  console.log(`[payments] provider=${providerName} payment_start invoice_id=${payload?.invoice_id}`);

  try {
    const result = await provider.charge(payload);
    const normalized = {
      success: true,
      provider: providerName,
      transaction: normalizeTransaction(result.transaction, {
        amount: payload.amount,
        paymentInstrumentType: payload.method === "paypal" ? "paypal" : "card",
      }),
      payment_id: result.payment_id ?? null,
      method: result.method ?? payload.method ?? "credit_card",
    };

    await markInvoiceAsPaid(payload.invoice_id);

    console.log(
      `[payments] provider=${providerName} payment_done invoice_id=${payload?.invoice_id} duration_ms=${Date.now() - startedAt}`
    );

    return normalized;
  } catch (error) {
    console.error(
      `[payments] provider=${providerName} payment_error invoice_id=${payload?.invoice_id} duration_ms=${Date.now() - startedAt}`,
      error
    );
    throw error;
  }
}
