import connection from "../../data/db.js";

function randomDelay(minMs = 1500, maxMs = 2500) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function buildTransactionId() {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createMockProvider() {
  return {
    async getClientToken() {
      return {
        success: true,
        provider: "mock",
        clientToken: "mock-client-token-not-required",
      };
    },

    async charge({ amount, invoice_id, method }) {
      const delay = randomDelay();

      await new Promise((resolve) => setTimeout(resolve, delay));

      const paymentInstrumentType = method === "paypal" ? "paypal" : "card";
      const transactionId = buildTransactionId();
      const paymentMethod = paymentInstrumentType === "paypal" ? "paypal" : "credit_card";

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
        provider: "mock",
        payment_id: paymentId,
        method: paymentMethod,
        transaction: {
          id: transactionId,
          status: "settled",
          amount: String(amount),
          paymentInstrumentType,
          createdAt: new Date().toISOString(),
        },
      };
    },
  };
}
