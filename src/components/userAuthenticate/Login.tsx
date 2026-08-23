import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps";
import { setCredentials } from "../../redux/authSlice";
import { login } from "../../services/userServices";

export const Login: React.FC = () => {
  const Styles = useComponentStyle("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await login({ email, password });
      dispatch(setCredentials({ token: result.token, user: result.user }));
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>Welcome Back</h2>
            <p style={Styles.subtitle}>Enter your details to access your account</p>
          </header>
          {error && (
            <div style={Styles.errorAlert}>{error}</div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={Styles.inputSection}>
            <InputField
              label="Email Address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: 'relative' }}>
              <InputField
                label="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#forgot" style={Styles.forgotLink} className="link">Forgot password?</a>
            </div>
            <Button
              label="Sign In"
              type="submit"
              variant="primary"
              disabled={!email.trim() || !password.trim() || loading}
              loading={loading}
            />
          </form>
          <div style={Styles.dividerContainer}>
            <div style={Styles.dividerLine}></div>
            <span style={Styles.dividerText}>OR CONTINUE WITH</span>
            <div style={Styles.dividerLine}></div>
          </div>
          <AuthenticationBySocialApps styles={Styles.socialContainer}/>
          <p style={Styles.signupText}>
            Don't have an account? <a href="/register" style={Styles.link} className="link">Create one</a>
          </p>
        </div>
      </main>
    </div>
  );
};
