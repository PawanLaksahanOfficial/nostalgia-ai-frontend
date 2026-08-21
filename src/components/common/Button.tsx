import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  type: "button" | "submit";
  variant: "primary" | "secondary" | "outline" | "dangerOutline";
  disabled: boolean;
  loading?: boolean;
}

const variantStyleKey: Record<ButtonProps["variant"], string> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  dangerOutline: "dangerOutline",
};

export const Button: React.FC<ButtonProps> = (Props) => {
  const Styles = useComponentStyle("button");
  const loading = Props.loading;
  const disabled = Props.disabled
  const variantStyle = Styles[variantStyleKey[Props.variant]];
  const mergedStyle = {...Styles.base, ...variantStyle, ...(disabled ? Styles.disabled : {})};

  return (
    <button
      type={Props.type}
      className={`btn btn-${Props.variant}`}
      style={mergedStyle}
      onClick={!disabled && !loading ? Props.onClick : undefined}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {loading ? "Processing..." : Props.label}
    </button>
  );
};