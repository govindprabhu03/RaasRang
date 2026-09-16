import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [mode, setMode] = useState("signin"); // signin | signup | phone | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  if (user) {
    navigate(nextPath);
    return null;
  }

  function switchMode(next) {
    setMode(next);
    setStatus({ state: "idle", message: "" });
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setStatus({ state: "error", message: error.message });
        return;
      }
      // Supabase returns 200 even when the email is already registered, but
      // with an empty identities array — that's the only way to detect it.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setStatus({
          state: "error",
          message: "An account with this email already exists. Try signing in instead.",
        });
        return;
      }
      if (data.session) {
        navigate(nextPath);
      } else {
        setStatus({ state: "success", message: "Account created — you can sign in now." });
        switchMode("signin");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus({
        state: "error",
        message:
          error.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : error.message,
      });
      return;
    }
    navigate(nextPath);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }
    setStatus({
      state: "success",
      message: "If an account exists for that email, a reset link is on its way.",
    });
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + nextPath },
    });
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }
    setOtpSent(true);
    setStatus({ state: "idle", message: "" });
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }
    navigate(nextPath);
  }

  const heading =
    mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Sign In";
  const eyebrow =
    mode === "signup" ? "Join Us" : mode === "forgot" ? "Password Help" : "Welcome Back";

  return (
    <div className="section auth-page">
      <p className="section-eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>

      {mode !== "forgot" && (
        <>
          <div className="auth-tabs">
            <button className={mode !== "phone" ? "active" : ""} onClick={() => switchMode(mode === "signup" ? "signup" : "signin")}>
              Email
            </button>
            <button className={mode === "phone" ? "active" : ""} onClick={() => switchMode("phone")}>
              Phone
            </button>
          </div>

          <button type="button" className="btn btn-outline google-btn" onClick={handleGoogle}>
            <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">or</div>
        </>
      )}

      {mode === "forgot" ? (
        <form className="checkout-form" onSubmit={handleForgotPassword}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Sending..." : "Send Reset Link"}
          </button>
          <p className="auth-switch">
            <button type="button" className="link-btn" onClick={() => switchMode("signin")}>
              Back to sign in
            </button>
          </p>
        </form>
      ) : mode !== "phone" ? (
        <form className="checkout-form" onSubmit={handleEmailAuth}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          {mode === "signin" && (
            <button type="button" className="link-btn auth-forgot-link" onClick={() => switchMode("forgot")}>
              Forgot password?
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
          <p className="auth-switch">
            {mode === "signup" ? "Already have an account?" : "No account yet?"}{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => switchMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      ) : !otpSent ? (
        <form className="checkout-form" onSubmit={handleSendOtp}>
          <label>
            Phone Number (with country code)
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
            Send Code
          </button>
        </form>
      ) : (
        <form className="checkout-form" onSubmit={handleVerifyOtp}>
          <label>
            Enter the code sent to {phone}
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
            Verify & Sign In
          </button>
        </form>
      )}

      {status.message && (
        <p className={`checkout-status ${status.state}`}>{status.message}</p>
      )}
    </div>
  );
}
