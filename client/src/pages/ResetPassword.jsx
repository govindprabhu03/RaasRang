import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

export default function ResetPassword() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ state: "error", message: "Passwords don't match." });
      return;
    }
    setStatus({ state: "loading", message: "" });
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }
    setStatus({ state: "success", message: "Password updated! Redirecting..." });
    setTimeout(() => navigate("/my-tickets"), 1200);
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="section auth-page">
        <p className="section-eyebrow">Password Help</p>
        <h1>Link Expired</h1>
        <p className="section-lede">
          This reset link is invalid or has expired. Request a new one from the sign-in page.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/auth")}>
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="section auth-page">
      <p className="section-eyebrow">Password Help</p>
      <h1>Set a New Password</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          New Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Updating..." : "Update Password"}
        </button>
        {status.message && (
          <p className={`checkout-status ${status.state}`}>{status.message}</p>
        )}
      </form>
    </div>
  );
}
