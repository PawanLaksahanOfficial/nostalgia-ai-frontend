import type { InputValidation } from "../../../models/InputValidation";
import { formErrorTexts as texts} from "../../Enums/CommonTexts"

export const validateText = (value: string) => {
    const namePattern = /^[a-zA-Z\s-]+$/;
    let validateText: InputValidation = {valid: true} 
    if (value === "")
    {
        validateText = {valid: false, invalid: true, message: texts.emptyField}
    }
    else if (!namePattern.test(value))
    {
        validateText = {valid: false, invalid: true, message: texts.invalidText}
    }
    return validateText
}

export const validateEmail = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let validateEmail: InputValidation = {valid: true}
    if (value === "")
    {
        validateEmail = {valid: false, invalid: true, message: texts.emptyField}
    }
    else if (!emailPattern.test(value))
    {
        validateEmail = {valid: false, invalid: true, message: texts.invalidEmail}
    }    
    return validateEmail
}

export const validatePassword = (value: string) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    let validatePassword: InputValidation = {valid: true}
    if (value === "")
    {
        validatePassword = {valid: false, invalid: true, message: texts.emptyField}
    }
    else if (!passwordPattern.test(value))
    {
        validatePassword = {valid: false, invalid: true, message: texts.invalidPassword}
    }
    return validatePassword
}

export const validateConfirmPassword = (value: string, password: string) => {
    let validatePassword: InputValidation = {valid: true}
    if (value === "")
    {
        validatePassword = {valid: false, invalid: true, message: texts.emptyField}
    }
    else if (value !== password)
    {
        validatePassword = {valid: false, invalid: true, message: texts.passwordsDoNotMatch}
    }   
    return validatePassword
}