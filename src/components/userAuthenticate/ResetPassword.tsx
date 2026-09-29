import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useToast } from "../../hooks/useToast";
import { resetPassword } from "../../services/userServices";
import { validatePassword, validateConfirmPassword } from "../common/validate/ValidateInputs";
import { AuthBackLink, AuthBrand } from "./AuthBrand";

export const ResetPassword: React.FC = () => {
  const Styles = useComponentStyle("login");
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordCheck = validatePassword(newPassword);
  const confirmCheck = validateConfirmPassword(confirmPassword, newPassword);
  const canSubmit = passwordCheck.valid === true && confirmCheck.valid === true && !loading;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await resetPassword({ email, token, newPassword });
      toast.success("Password updated. Please sign in with your new password.");
      navigate("/signIn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div style={Styles.wrapper}>
        <AuthBackLink />
        <main style={Styles.content}>
          <div style={Styles.card} className="card animate-fade-in-up">
            <AuthBrand />
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={Styles.title}>Link Not Valid</h2>
              <p style={Styles.subtitle}>
                This password reset link is incomplete or has expired.
              </p>
            </header>
            <p style={Styles.signupText}>
              <Link to="/forgot-password" style={Styles.link} className="link">
                Request a new link
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={Styles.wrapper}>
      <AuthBackLink />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <AuthBrand />
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={Styles.title}>Choose a New Password</h2>
            <p style={Styles.subtitle}>Setting a new password for {email}</p>
          </header>
          {error && <div style={Styles.errorAlert}>{error}</div>}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            style={Styles.inputSection}
          >
            <InputField
              label="New Password"
              type="password"
              name="password"
              value={newPassword}
              validation={newPassword ? passwordCheck : undefined}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              validation={confirmPassword ? confirmCheck : undefined}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              label="Update Password"
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              loading={loading}
            />
          </form>
          <p style={Styles.signupText}>
            <Link to="/signIn" style={Styles.link} className="link">Back to sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
