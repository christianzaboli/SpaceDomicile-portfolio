import { useEffect, useMemo, useReducer } from "react";
import { FREE_SHIPPING_THRESHOLD } from "../../lib/commerceConfig.js";

const STORAGE_KEY = "checkout-draft";

export const CHECKOUT_STEPS = [
  "contact",
  "shipping",
  "billing",
  "review",
  "payment",
];

const initialState = {
  activeStep: "contact",
  completedSteps: [],
  checkoutSession: null,
  invoiceId: null,
  creatingOrder: false,
  paymentError: "",
  orderReview: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload };
    case "complete-step": {
      const nextCompleted = Array.from(new Set([...state.completedSteps, action.step]));
      return {
        ...state,
        completedSteps: nextCompleted,
        activeStep: action.nextStep ?? state.activeStep,
      };
    }
    case "set-step":
      return { ...state, activeStep: action.step };
    case "creating-order":
      return { ...state, creatingOrder: action.value, paymentError: "" };
    case "order-created":
      return {
        ...state,
        invoiceId: action.invoiceId,
        checkoutSession: action.checkoutSession,
        orderReview: action.orderReview,
        activeStep: "payment",
        completedSteps: Array.from(new Set([...state.completedSteps, "review"])),
        creatingOrder: false,
      };
    case "payment-error":
      return { ...state, paymentError: action.message };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export default function useCheckoutFlow(cartLines) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", payload: JSON.parse(raw) });
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeStep: state.activeStep,
        completedSteps: state.completedSteps,
        invoiceId: state.invoiceId,
        checkoutSession: state.checkoutSession,
        orderReview: state.orderReview,
      }),
    );
  }, [state.activeStep, state.checkoutSession, state.completedSteps, state.invoiceId, state.orderReview]);

  const summary = useMemo(() => {
    const subtotal = cartLines.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 4.99;

    return {
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
    };
  }, [cartLines]);

  return {
    ...state,
    summary,
    steps: CHECKOUT_STEPS,
    goToStep: (step) => dispatch({ type: "set-step", step }),
    completeStep: (step, nextStep) => dispatch({ type: "complete-step", step, nextStep }),
    setCreatingOrder: (value) => dispatch({ type: "creating-order", value }),
    setOrderCreated: (payload) => dispatch({ type: "order-created", ...payload }),
    setPaymentError: (message) => dispatch({ type: "payment-error", message }),
    resetFlow: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "reset" });
    },
  };
}

