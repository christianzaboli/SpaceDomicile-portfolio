import gateway from "../../config/braintree.js";
import connection from "../../data/db.js";

function resolvePaymentMethod(method, instrument) {
  let paymentMethod = method || "credit_card";

  if (!method && instrument) {
    if (instrument.toLowerCase().includes("paypal")) {
      paymentMethod = "paypal";
    } else if (instrument.toLowerCase().includes("card")) {
      paymentMethod = "credit_card";
    }
  }

  return paymentMethod;
}

export function createBraintreeProvider() {
  return {
    async getClientToken() {
      const { clientToken } = await gateway.clientToken.generate({});
      return { success: true, provider: "braintree", clientToken };
    },

    async charge({ amount, nonce, invoice_id, method }) {
      const sale = await gateway.transaction.sale({
        amount: amount.toString(),
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      });

      if (!sale.success) {
        const error = new Error(sale.message || "Transazione rifiutata");
        error.details = sale.errors ? sale.errors.deepErrors() : [];
        error.code = "PAYMENT_DECLINED";
        throw error;
      }

      const transactionId = sale.transaction.id;
      const paymentMethod = resolvePaymentMethod(method, sale.transaction.paymentInstrumentType);

      const paymentId = await new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO payments (invoice_id, amount, method, status, transaction_id, paid_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `;

        connection.query(
          sql,
          [invoice_id, amount, paymentMethod, "completed", transactionId],
          (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
          }
        );
      });

      return {
        success: true,
        provider: "braintree",
        payment_id: paymentId,
        method: paymentMethod,
        transaction: {
          id: transactionId,
          status: sale.transaction.status || "submitted_for_settlement",
          amount: String(amount),
          paymentInstrumentType:
            paymentMethod === "paypal" ? "paypal" : "card",
          createdAt: sale.transaction.createdAt || new Date().toISOString(),
        },
      };
    },
  };
}
