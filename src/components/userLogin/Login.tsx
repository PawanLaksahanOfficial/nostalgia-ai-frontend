import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/authSlice";
import { login, register } from "../../services/userServices";
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps";

const initialForm = { email: "", password: "", firstName: "", lastName: "" };

export const Login: React.FC = () => {
  const Styles = useComponentStyle("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, firstName: e.target.value }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, lastName: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login({ email: form.email, password: form.password });
      } else {
        result = await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });
      }
      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
        })
      );
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setForm(initialForm);
  };

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.card}>
          <header style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={Styles.title}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={Styles.subtitle}>
              {isLogin
                ? "Enter your details to access your account"
                : "Sign up to start creating nostalgic memories"}
            </p>
          </header>
          {error && (
            <div style={Styles.errorAlert}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={Styles.inputSection}>
            {!isLogin && (
              <>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleFirstNameChange}
                    style={Styles.input}
                    required={!isLogin}
                  />
                </div>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleLastNameChange}
                    style={Styles.input}
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            <div style={Styles.inputGroup}>
              <label style={Styles.label}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={handleEmailChange}
                style={Styles.input}
                required
              />
            </div>
            <div style={Styles.inputGroup}>
              <label style={Styles.label}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handlePasswordChange}
                style={Styles.input}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              style={Styles.primaryButton}
              disabled={
                loading ||
                !form.email.trim() ||
                !form.password.trim() ||
                (!isLogin &&
                  (!form.firstName.trim() || !form.lastName.trim()))
              }
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div style={Styles.dividerContainer}>
            <div style={Styles.dividerLine}></div>
            <span style={Styles.dividerText}>OR CONTINUE WITH</span>
            <div style={Styles.dividerLine}></div>
          </div>

          <AuthenticationBySocialApps styles={Styles.socialContainer} />

          <p style={Styles.signupText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              style={Styles.link}
              onClick={toggleMode}
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};