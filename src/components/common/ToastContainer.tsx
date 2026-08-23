import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { removeToast } from "../../redux/toastSlice";
import { useComponentStyle } from "../../hooks/useComponentStyle";

const AUTO_DISMISS_MS = 4000;

const ToastItem: React.FC<{ id: string; type: "success" | "error"; message: string }> = ({ id, type, message }) => {
  const dispatch = useDispatch();
  const Styles = useComponentStyle("toastContainer");

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const isError = type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fade-in-up"
      style={{ ...Styles.toastBase, ...(isError ? Styles.toastError : Styles.toastSuccess) }}
    >
      <span style={isError ? Styles.iconError : Styles.iconSuccess}>{isError ? "⚠" : "✓"}</span>
      <span style={Styles.message}>{message}</span>
      <button
        type="button"
        className="icon-btn"
        aria-label="Dismiss notification"
        onClick={() => dispatch(removeToast(id))}
        style={Styles.closeButton}
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const Styles = useComponentStyle("toastContainer");

  if (toasts.length === 0) return null;

  return (
    <div style={Styles.wrapper}>
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  );
};
