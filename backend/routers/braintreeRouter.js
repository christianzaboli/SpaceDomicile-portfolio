import express from "express";
import gateway from "../config/braintree.js";
import connection from "../data/db.js";

const router = express.Router();

// --------------------------------------------------
// GET /api/payment/token
// --------------------------------------------------
// Create client token
router.get("/token", async (req, res) => {
  try {
    const { clientToken } = await gateway.clientToken.generate({});
    return res.json({ clientToken });
  } catch (error) {
    console.error("Errore generazione token Braintree:", error);
    return res.status(500).json({ success: false, error: "Errore generazione token" });
  }
});

// --------------------------------------------------
// POST /api/payment/checkout
// Body: { amount, nonce, invoice_id, method? }
// --------------------------------------------------
// Process checkout payment
router.post("/checkout", async (req, res) => {
  const { amount, nonce, invoice_id, method } = req.body;

  if (!amount || !nonce || !invoice_id) {
    return res.status(400).json({
      success: false,
      error: "Dati mancanti: amount, nonce e invoice_id sono obbligatori",
    });
  }

  try {
    // ------------------------------------------------
    // Charge Braintree
    // ------------------------------------------------
    const sale = await gateway.transaction.sale({
      amount: amount.toString(),  
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    console.log("Risposta Braintree sale:", JSON.stringify(sale, null, 2));

    if (!sale.success) {
      return res.status(400).json({
        success: false,
        error: sale.message || "Transazione rifiutata",
        details: sale.errors ? sale.errors.deepErrors() : [],
      });
    }

    // ------------------------------------------------
    // Save payment in DB
    // ------------------------------------------------
    const transactionId = sale.transaction.id;

    // Resolve payment method
    let paymentMethod = method || "credit_card";

    const instrument = sale.transaction.paymentInstrumentType;
    if (!method && instrument) {
      if (instrument.toLowerCase().includes("paypal")) {
        paymentMethod = "paypal";
      } else if (instrument.toLowerCase().includes("card")) {
        paymentMethod = "credit_card";
      }
    }

    const sql = `
      INSERT INTO payments (invoice_id, amount, method, status, transaction_id, paid_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    connection.query(
      sql,
      [invoice_id, amount, paymentMethod, "completed", transactionId],
      (err, result) => {
        if (err) {
          console.error("Errore DB payments:", err);
          return res.status(500).json({
            success: false,
            error: "Errore salvataggio pagamento",
            details: err,
          });
        }

        return res.json({
          success: true,
          transactionId,
          payment_id: result.insertId,
          method: paymentMethod,
        });
      }
    );
  } catch (err) {
    console.error("Errore transazione Braintree:", err);
    return res.status(500).json({
      success: false,
      error: "Errore transazione",
      details: err,
    });
  }
});

export default router;
