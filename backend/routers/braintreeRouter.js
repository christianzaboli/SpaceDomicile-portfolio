import express from "express";
import {
  getConfiguredPaymentMode,
  getPaymentClientToken,
  processPayment,
} from "../services/payments/paymentService.js";

const router = express.Router();

router.get("/token", async (req, res) => {
  try {
    const result = await getPaymentClientToken();
    return res.json(result);
  } catch (error) {
    console.error("Errore generazione token pagamento:", error);
    return res.status(500).json({
      success: false,
      error: "Errore generazione token",
    });
  }
});

router.get("/config", (req, res) => {
  const paymentMode = getConfiguredPaymentMode();
  return res.json({
    success: true,
    paymentMode,
    provider: paymentMode,
  });
});

router.post("/checkout", async (req, res) => {
  const { amount, nonce, invoice_id, method } = req.body;
  const paymentMode = getConfiguredPaymentMode();

  if (!amount || !invoice_id) {
    return res.status(400).json({
      success: false,
      error: "Dati mancanti: amount e invoice_id sono obbligatori",
    });
  }

  if (paymentMode === "braintree" && !nonce) {
    return res.status(400).json({
      success: false,
      error: "Nonce mancante per il provider Braintree",
    });
  }

  try {
    const result = await processPayment({
      amount,
      nonce,
      invoice_id,
      method,
    });

    return res.json(result);
  } catch (error) {
    const status = error.code === "PAYMENT_DECLINED" ? 400 : 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Errore transazione",
      details: error.details || null,
    });
  }
});

export default router;
