import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/authSlice";
import { login, register } from "../../services/userServices";
import { AuthenticationBySocialApps } from "./AuthenticationBySocialApps";

export const Login: React.FC = () => {
  const Styles = useComponentStyle("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login({ email, password });
      } else {
        result = await register({ firstName, lastName, email, password });
      }
      dispatch(setCredentials({
        token: result.token,
        user: result.user
      }));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div style={Styles.wrapper}> 
      <main style={Styles.content}>
        <div style={Styles.card}>
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p style={Styles.subtitle}>
              {isLogin ? 'Enter your details to access your account' : 'Sign up to start creating nostalgic memories'}
            </p>
          </header>
          {error && <div style={Styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={Styles.inputSection}>
            {!isLogin && (
              <>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={Styles.input}
                    required={!isLogin}
                  />
                </div>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={Styles.input}
                required
              />
            </div>
            <div style={Styles.inputGroup}>
              <label style={Styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={Styles.input}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              style={Styles.primaryButton}
              disabled={loading || !email.trim() || !password.trim() || (!isLogin && (!firstName.trim() || !lastName.trim()))}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={Styles.dividerContainer}>
            <div style={Styles.dividerLine}></div>
            <span style={Styles.dividerText}>OR CONTINUE WITH</span>
            <div style={Styles.dividerLine}></div>
          </div>

          <AuthenticationBySocialApps styles={Styles.socialContainer}/>

          <p style={Styles.signupText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" style={Styles.link} onClick={toggleMode}>
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};