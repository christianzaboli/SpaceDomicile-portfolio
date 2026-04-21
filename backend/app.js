import express, { Router } from "express";
import cors from "cors";

import "dotenv/config";
import notFound from "./middlewares/notFound.js";
import errorsHandler from "./middlewares/errorServer.js";
import setImagePath from "./middlewares/imagePath.js";

// import router;
import certificatesRouter from "./routers/certificatesRouter.js";
import galaxiesRouter from "./routers/galaxiesRouter.js";
import stacksRouter from "./routers/stacksRouter.js";
import customersRouter from "./routers/customersRouter.js";
import invoicesStackRouter from "./routers/InvoicesStackRouter.js";
import invoicesRouter from "./routers/invoicesRouter.js";
import planetsRouter from "./routers/planetsRouter.js";
import paymentsRouter from "./routers/paymentsRouter.js";
import createOrderRouter from "./routers/createOrderRouter.js";
import braintreeRouter from "./routers/braintreeRouter.js";
import invoiceCreateRouter from "./routers/invoiceCreateRouter.js";

const PORT = process.env.PORT || 3000;
const corsUrl = process.env.CORS_ORIGIN_LOCAL ?? process.env.CORS_ORIGIN_PROD;

const app = express();
// middleware imagepath
app.use(setImagePath);

app.use(cors());
// middleware bodyparser
app.use(express.json());

// middleware static
app.use(express.static("public"));

// middleware cors
app.use(
  cors({
    origin: corsUrl,
  }),
);

app.get("/", (req, res) => {
  res.send("SpaceDomicile API running 🚀");
});

app.get("/api", (req, res) => {
  res.send("Server ok!");
});

// router customers
app.use("/api/customers", customersRouter);

//router invoices stack
app.use("/api/invoices_stack", invoicesStackRouter);

// router certicates
app.use("/api/certificates", certificatesRouter);

// router tabella galaxies
app.use("/api/galaxies", galaxiesRouter);

// router tabella stacks
app.use("/api/stacks", stacksRouter);

// router tabella invoice
app.use("/api/invoices", invoicesRouter);

// router tabella planets
app.use("/api/planets", planetsRouter);

// router tabella payments
app.use("/api/payments", paymentsRouter);

// router create order
app.use("/api/create_order", createOrderRouter);

// router braintree
app.use("/api/payment", braintreeRouter);

// router create-invoices
app.use("/api/create-invoice", invoiceCreateRouter);

// utilizzo middleware gestione errori
app.use(errorsHandler);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
