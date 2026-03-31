import type { InputValidation } from "./InputValidation";

export type RegisterModel = {
    firstName : string;
    lastName: string; 
    email: string;
    password: string;
    confirmPassword: string;
}

export type RegisterValidation = {
    firstName: InputValidation;
    lastName: InputValidation;
    email: InputValidation;
    password: InputValidation;
    confirmPassword: InputValidation;
}