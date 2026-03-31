import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";

interface InputProps {
  type?: string;
  label?: string;
  accept?: string;
  name?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputProps> = ({type = "text", label, accept, name, value, onChange}) => {
  const Styles = useComponentStyle("inputField");

  return (
    <div style={Styles.container}>
      {label && <label style={Styles.label}>{label}</label>}
      <input type={type} accept={accept} name={name} value={value} onChange={onChange} style={Styles.input} />
    </div>
  );
};