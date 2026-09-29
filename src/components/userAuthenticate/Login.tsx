import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps";
import { AuthBackLink, AuthBrand } from "./AuthBrand";
import { hasSocialProviders } from "../helpers/socialAuth";
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
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("expired") === "1";

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
      <AuthBackLink />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <AuthBrand />
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>Welcome Back</h2>
            <p style={Styles.subtitle}>Enter your details to access your account</p>
          </header>
          {sessionExpired && !error && (
            <div style={Styles.errorAlert}>Your session expired. Please sign in again.</div>
          )}
          {error && (
            <div style={Styles.errorAlert}>{error}</div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={Styles.inputSection}>
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: 'relative' }}>
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link to="/forgot-password" style={Styles.forgotLink} className="link">Forgot password?</Link>
            </div>
            <Button
              label="Sign In"
              type="submit"
              variant="primary"
              disabled={!email.trim() || !password.trim() || loading}
              loading={loading}
            />
          </form>
          {hasSocialProviders && (
            <div style={Styles.dividerContainer}>
              <div style={Styles.dividerLine}></div>
              <span style={Styles.dividerText}>OR CONTINUE WITH</span>
              <div style={Styles.dividerLine}></div>
            </div>
          )}
          <AuthenticationBySocialApps styles={Styles.socialContainer}/>
          <p style={Styles.signupText}>
            Don't have an account? <Link to="/register" style={Styles.link} className="link">Create one</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
