import React, { useState } from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import PasswordEye from "../Svg/eye_password.svg?react";
import type { InputValidation } from "../../models/InputValidation";
import { ErrorIndicator } from "./ErrorIndicator";

interface InputProps {
  type?: string;
  label?: string;
  accept?: string;
  name?: string;
  value?: string;
  validation?: InputValidation,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputProps> = ({type = "text", label, accept, name, value, validation, onChange}) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const Styles = useComponentStyle("inputField");

  const ToggleVisibility = () => {
      setPasswordVisible(!passwordVisible);
  }

  return (
    <div style={Styles.container}>
      {label && <label style={Styles.label}>{label}</label>}
      <input 
        type={type} 
        accept={accept}
        name={name} 
        value={value} 
        onChange={onChange} 
        style={Styles.input} />
        {((name === "password" || name === "confirmPassword") && value) && <PasswordEye style={{...Styles.passwordEye, ...(!passwordVisible && Styles.passwordEye.hidden)}} onClick={ToggleVisibility}/>}
        {validation?.invalid && <ErrorIndicator message={validation?.message} styles={Styles.errorIndicator}/>}
    </div>
  );
};