import { motion as Motion } from "framer-motion";

export default function DeleteCartOverlay({ open, onConfirm, onCancel, text }) {
  return (
    // animazione di uscita dall'overlay
    <Motion.div
      className="overlayDelete"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* overlay stesso */}
      <Motion.div
        className="motionDivDelete"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: open ? 1 : 0.8, opacity: open ? 1 : 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="divDeleteContent">
          <h2>{text}</h2>
          <div className="buttonsDelete">
            <button className="checkout-btn" onClick={onConfirm}>
              Conferma
            </button>
            <button className="empty-cart-btn" onClick={onCancel}>
              Annulla
            </button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
}

