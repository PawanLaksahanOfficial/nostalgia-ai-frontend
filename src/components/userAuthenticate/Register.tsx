import { useState } from "react"
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps"
import { useComponentStyle } from "../../hooks/useComponentStyle"
import { InputField } from "../common/InputField";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";

const initialFormInputs = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
}

export const Register: React.FC = () => {
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const Styles = useComponentStyle("register");
    const [value, setvalue] = useState<any>();
    const [formData, setFormData] = useState<any>(initialFormInputs);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const name = e.target.name;
        setvalue(value);
        // setFormData(prev => ({ ...prev, [name]: value}));
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
                                value={value}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                value={value}
                                onChange={handleChange}
                            />
                        </div>                       
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={value}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={value}
                            onChange={handleChange}
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