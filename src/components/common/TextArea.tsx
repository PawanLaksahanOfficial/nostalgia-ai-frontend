import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";

interface TextAreaProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange }) => {
  const Styles = useComponentStyle("textArea");

  return (
    <div style={Styles.container}>
      {label && <label style={Styles.label}>{label}</label>}
      <textarea value={value} onChange={onChange} className="textarea" style={Styles.textarea} />
    </div>
  );
};