import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

// Empty string = relative /api/* calls (used in production on Netlify).
// Local dev overrides this via client/.env.development -> VITE_API_BASE=http://localhost:4000
const API_BASE = import.meta.env.VITE_API_BASE || "";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Tickets() {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/tickets`)
      .then((res) => {
        setTickets(res.data);
        setSelected(res.data[0]?.id || null);
      })
      .catch(() => setStatus({ state: "error", message: "Could not load ticket types." }));
  }, []);

  useEffect(() => {
    if (user?.email) {
      setForm((f) => ({ ...f, email: user.email }));
    }
  }, [user]);

  const selectedTicket = tickets.find((t) => t.id === selected);
  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  async function handleCheckout(e) {
    e.preventDefault();
    if (!selectedTicket) return;
    if (!form.name || !form.email || !form.phone) {
      setStatus({ state: "error", message: "Please fill in your name, email and phone." });
      return;
    }

    setStatus({ state: "loading", message: "Preparing your order..." });

    try {
      const { data: order } = await axios.post(`${API_BASE}/api/orders`, {
        ticketId: selected,
        quantity,
        ...form,
      });

      // Record the order under this account (respects RLS: user_id = auth.uid()).
      await supabase.from("orders").insert({
        user_id: user.id,
        ticket_id: selectedTicket.id,
        ticket_name: selectedTicket.name,
        quantity,
        amount: order.amount,
        buyer_name: form.name,
        buyer_email: form.email,
        buyer_phone: form.phone,
        razorpay_order_id: order.orderId,
        status: "created",
      });

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setStatus({ state: "error", message: "Could not load payment gateway. Check your connection." });
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Raas Rang",
        description: `${selectedTicket.name} x${quantity}`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#ff6a3d" },
        handler: async function (response) {
          setStatus({ state: "loading", message: "Verifying payment..." });
          try {
            await axios.post(`${API_BASE}/api/orders/verify`, response);
            setStatus({
              state: "success",
              message: "Payment successful! Check My Tickets for your booking.",
            });
          } catch {
            setStatus({
              state: "error",
              message: "Payment succeeded but verification failed. Contact support with your payment ID.",
            });
          }
        },
        modal: {
          ondismiss: () => setStatus({ state: "idle", message: "" }),
        },
      });

      rzp.on("payment.failed", () => {
        setStatus({ state: "error", message: "Payment failed. Please try again." });
      });

      rzp.open();
      setStatus({ state: "idle", message: "" });
    } catch (err) {
      setStatus({
        state: "error",
        message: err.response?.data?.error || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div className="section tickets-page">
      <p className="section-eyebrow">Reserve Your Spot</p>
      <h1>Get Your Tickets</h1>
      <p className="section-lede">
        Pick your pass and secure your place on the dance floor — every ticket is tied to your
        account so it's always there when you need it.
      </p>

      <div className="ticket-options">
        {tickets.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ticket-card ${selected === t.id ? "selected" : ""}`}
            onClick={() => setSelected(t.id)}
          >
            <span className="ticket-card-check" aria-hidden="true">
              {selected === t.id ? "✓" : ""}
            </span>
            <h3>{t.name}</h3>
            <p className="ticket-price">₹{t.price}</p>
            <p className="ticket-desc">{t.description}</p>
          </button>
        ))}
      </div>

      {authLoading ? null : !user ? (
        <div className="checkout-form auth-gate">
          <p>Sign in to buy tickets — your bookings are saved to your account.</p>
          <Link to="/auth" className="btn btn-primary">
            Sign In / Sign Up
          </Link>
        </div>
      ) : (
        <form className="checkout-form" onSubmit={handleCheckout}>
          {selectedTicket && (
            <div className="booking-summary">
              <div>
                <span className="booking-summary-label">Booking</span>
                <span className="booking-summary-name">{selectedTicket.name}</span>
              </div>
              <span className="booking-summary-price">₹{selectedTicket.price} / pass</span>
            </div>
          )}

          <label>
            Quantity
            <div className="qty-stepper">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              />
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </label>
          <label>
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </label>

          <div className="checkout-total">
            Total: <strong>₹{total}</strong>
          </div>

          <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Processing..." : "Pay & Book"}
          </button>

          {status.message && (
            <p className={`checkout-status ${status.state}`}>{status.message}</p>
          )}
        </form>
      )}
    </div>
  );
}
