import { useEffect } from "react";
export default function Toast({ message, show, onClose, setDrawerOpen }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Il toast scompare dopo 3 secondi
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const openandclose = () => {
    setDrawerOpen(true);
    onClose();
  };
  if (!show) return null;

  return (
    <div className="toast-container">
      <div className="toast" onClick={() => openandclose()}>
        <i className="fa-solid fa-circle-check toast-icon"></i>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}

