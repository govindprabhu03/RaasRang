import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

export default function MyTickets() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="section">
        <p className="section-eyebrow">Your Account</p>
        <h1>My Tickets</h1>
        <p className="section-lede">Sign in to see every pass you've booked for Raas Rang.</p>
        <Link to="/auth" className="btn btn-primary">
          Sign In to View
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <p className="section-eyebrow">Your Account</p>
      <h1>My Tickets</h1>
      <p className="policy-updated">{user.email || user.phone}</p>

      {loading ? (
        <p className="gallery-empty">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="gallery-empty">
          No tickets yet. <Link to="/tickets">Get one here</Link>.
        </p>
      ) : (
        <div className="my-orders">
          {orders.map((o) => {
            const isOpen = openId === o.id;
            const canShowTicket = o.status === "paid" && o.ticket_code;
            return (
              <div className="order-card-wrap" key={o.id}>
                <button
                  type="button"
                  className="order-card order-card-btn"
                  onClick={() => canShowTicket && setOpenId(isOpen ? null : o.id)}
                >
                  <div>
                    <h3>
                      {o.ticket_name} × {o.quantity}
                    </h3>
                    <p className="ticket-desc">
                      Order {o.razorpay_order_id} · {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`order-status status-${o.status}`}>
                    {o.status === "paid" && o.checked_in ? "checked in" : o.status}
                  </span>
                </button>
                {isOpen && canShowTicket && <TicketQR order={o} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TicketQR({ order }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const url = `${window.location.origin}/checkin/${order.ticket_code}`;
    QRCode.toDataURL(url, { width: 260, margin: 1, color: { dark: "#170f0d", light: "#f6e4bd" } }).then(
      setDataUrl
    );
  }, [order.ticket_code]);

  return (
    <div className="ticket-qr-panel">
      {dataUrl && <img src={dataUrl} alt={`Ticket QR code ${order.ticket_code}`} />}
      <p className="ticket-code">{order.ticket_code}</p>
      <p className="ticket-qr-hint">
        {order.checked_in
          ? `Checked in ${new Date(order.checked_in_at).toLocaleString()}`
          : "Show this QR at the entrance to check in."}
      </p>
    </div>
  );
}
