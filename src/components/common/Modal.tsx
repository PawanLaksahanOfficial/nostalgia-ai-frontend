import React, { useEffect } from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  const Styles = useComponentStyle("modal");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={Styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        style={Styles.panel}
        className="card animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div style={Styles.header}>
          <h2 style={Styles.title}>{title}</h2>
          <button className="icon-btn" style={Styles.closeButton} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={Styles.body}>{children}</div>
      </div>
    </div>
  );
};
