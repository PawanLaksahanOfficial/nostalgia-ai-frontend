import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { forgotPassword } from "../../services/userServices";
import { validateEmail } from "../common/validate/ValidateInputs";

export const ForgotPassword: React.FC = () => {
  const Styles = useComponentStyle("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset email.");
    } finally {
      setLoading(false);
    }
  };

  const emailIsValid = validateEmail(email).valid === true;

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>Reset Your Password</h2>
            <p style={Styles.subtitle}>
              Enter your email and we'll send you a link to set a new password.
            </p>
          </header>

          {error && <div style={Styles.errorAlert}>{error}</div>}

          {sent ? (
            <>
              <div style={Styles.successAlert}>
                If an account exists for {email}, a reset link is on its way. The link is valid
                for one hour.
              </div>
              <p style={Styles.signupText}>
                <Link to="/signIn" style={Styles.link} className="link">Back to sign in</Link>
              </p>
            </>
          ) : (
            <>
              <form
                onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                style={Styles.inputSection}
              >
                <InputField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  label="Send Reset Link"
                  type="submit"
                  variant="primary"
                  disabled={!emailIsValid || loading}
                  loading={loading}
                />
              </form>
              <p style={Styles.signupText}>
                Remembered it? <Link to="/signIn" style={Styles.link} className="link">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
