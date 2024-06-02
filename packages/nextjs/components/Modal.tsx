import React, { useEffect } from "react";

const Modal = ({ show, onClose, children }: { show: boolean; onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay " onClick={handleOverlayClick}>
      <div className="modal-content backdrop-blur-xl bg-white/25">
        <button className="modal-close text-white" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
