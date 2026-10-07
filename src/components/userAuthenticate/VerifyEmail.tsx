import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { verifyEmail } from "../../services/userServices";
import { updateUser } from "../../redux/authSlice";
import type { RootState } from "../../redux/store";
import { AuthBackLink, AuthBrand } from "./AuthBrand";

type VerifyState = "verifying" | "verified" | "failed";

export const VerifyEmail: React.FC = () => {
  const Styles = useComponentStyle("login");
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [state, setState] = useState<VerifyState>(token && email ? "verifying" : "failed");
  const [message, setMessage] = useState("");
  // StrictMode runs effects twice in development; the link should be sent only once.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || !email || requested.current) return;
    requested.current = true;
    verifyEmail({ email, token })
      .then(() => setState("verified"))
      .catch((error: Error) => {
        setMessage(error.message);
        setState("failed");
      });
  }, [token, email]);

  // Only the signed-in account the link belongs to becomes verified in this tab.
  useEffect(() => {
    if (state === "verified" && user && user.email.toLowerCase() === email.toLowerCase() && !user.emailVerified) {
      dispatch(updateUser({ emailVerified: true }));
    }
  }, [state, user, email, dispatch]);

  const heading = {
    verifying: "Confirming your email…",
    verified: "Email confirmed",
    failed: "Link not valid",
  }[state];

  const detail = {
    verifying: "This only takes a moment.",
    verified: "You can create videos now.",
    failed: message || "This confirmation link is incomplete or has expired.",
  }[state];

  return (
    <div style={Styles.wrapper}>
      <AuthBackLink />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <AuthBrand />
          <header style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={Styles.title}>{heading}</h2>
            <p style={Styles.subtitle}>{detail}</p>
          </header>
          {state !== "verifying" && (
            <p style={Styles.signupText}>
              {isAuthenticated ? (
                <Link to="/" style={Styles.link} className="link">
                  {state === "verified" ? "Create a video" : "Go to Create to send a new link"}
                </Link>
              ) : (
                <Link to="/signIn" style={Styles.link} className="link">
                  {state === "verified" ? "Sign in" : "Sign in to get a new link"}
                </Link>
              )}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};
