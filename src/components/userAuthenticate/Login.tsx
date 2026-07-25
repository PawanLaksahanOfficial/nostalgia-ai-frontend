import React, { useState } from "react";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps";

export const Login: React.FC = () => {
  const Styles = useComponentStyle("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={Styles.wrapper}> 
      <main style={Styles.content}>
        <div style={Styles.card}>
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>Welcome Back</h2>
            <p style={Styles.subtitle}>Enter your details to access your account</p>
          </header>
          <div style={Styles.inputSection}>
            <InputField
              label="Email Address"
              type="email"
              // placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: 'relative' }}>
              <InputField
                label="Password"
                type="password"
                // placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#forgot" style={Styles.forgotLink}>Forgot password?</a>
            </div>
            <Button
              label="Sign In"
              type="submit"
              variant="primary"
              disabled={!email.trim() || !password.trim()}
              onClick={() => alert("Logging in...")}
            />
          </div>
          <div style={Styles.dividerContainer}>
            <div style={Styles.dividerLine}></div>
            <span style={Styles.dividerText}>OR CONTINUE WITH</span>
            <div style={Styles.dividerLine}></div>
          </div>
          <AuthenticationBySocialApps styles={Styles.socialContainer}/>       
          <p style={Styles.signupText}>
            Don't have an account? <a href="#signup" style={Styles.link}>Create one</a>
          </p>
        </div>
      </main>
    </div>
  );
};