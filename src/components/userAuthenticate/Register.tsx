import { useState } from "react"
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps"
import { useComponentStyle } from "../../hooks/useComponentStyle"
import { InputField } from "../common/InputField";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import type { RegisterModel, RegisterValidation } from "../../models/RegisterModel";
import { validateConfirmPassword, validateEmail, validatePassword, validateText } from "../common/validate/ValidateInputs";

const initialFormInputs: RegisterModel = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const initialRegisterValidation: RegisterValidation = {
    firstName: {},
    lastName: {},
    email: {},
    password: {},
    confirmPassword: {}
}

export const Register: React.FC = () => {
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const Styles = useComponentStyle("register");
    const [formData, setFormData] = useState<RegisterModel>(initialFormInputs);
     const [validateModel, setValidateModel] = useState<RegisterValidation>(initialRegisterValidation);

    const handleChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = target;
        setFormData(prev => ({...prev, [name]: value}));
        validateInput(name, value);
    }

     const validateInput = (input: string, value: string) => {
        if (input === "firstName" || input === "lastName")
        {
            setValidateModel((values) => ({...values, [input]: validateText(value)}))
        }
        else if (input === "email")
        {
            setValidateModel((values) => ({...values, [input]: validateEmail(value)}))
        }
        else if (input === "password")
        {
            setValidateModel((values) => ({...values, [input]: validatePassword(value)}))
        }
        else
        {
            setValidateModel((values) => ({...values, [input]: validateConfirmPassword(value, formData.password)}))
        }
    }


    const handleRegister = () => {

    }

    return(
        <div style={Styles.wrapper}>
            <main style={Styles.content}>
                <div style={Styles.card}>
                    <header>
                        <h2 style={Styles.title}>Create Account</h2>
                        <p style={Styles.subtitle}>Join Nostalgia AI and start creating memories</p>
                    </header>
                    <div style={Styles.form}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <InputField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                validation={validateModel.firstName}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                validation={validateModel.lastName}
                            />
                        </div>                       
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            validation={validateModel.email}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            validation={validateModel.password}
                        />
                        <InputField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            validation={validateModel.confirmPassword}
                        />
                        <Button
                            label="Create Account"
                            type="button"
                            variant="primary"
                            disabled={!isFormValid}
                            onClick={handleRegister}
                        />
                    </div>
                    <div style={Styles.dividerContainer}>
                        <div style={Styles.dividerLine}></div>
                        <span style={Styles.dividerText}>OR REGISTER WITH</span>
                        <div style={Styles.dividerLine}></div>
                    </div>
                    <AuthenticationBySocialApps styles={Styles.socialContainer} />
                    <p style={Styles.loginText}>
                        Already have an account?{" "}
                        <Link
                            to={"/signIn"} 
                            style={Styles.link} 
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}