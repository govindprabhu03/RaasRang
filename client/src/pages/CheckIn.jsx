import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

export default function CheckIn() {
  const { code } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckingAccess(false);
      return;
    }
    Promise.all([
      supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle(),
      supabase.from("scanners").select("user_id").eq("user_id", user.id).maybeSingle(),
    ]).then(([adminRes, scannerRes]) => {
      setHasAccess(!!adminRes.data || !!scannerRes.data);
      setCheckingAccess(false);
    });
  }, [user]);

  if (authLoading || checkingAccess) return null;

  if (!user) {
    return (
      <div className="section">
        <p className="section-eyebrow">Check-In</p>
        <h1>Sign In Required</h1>
        <p className="section-lede">Door staff need to sign in to scan tickets.</p>
        <Link to={`/auth?next=${code ? `/checkin/${code}` : "/checkin"}`} className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="section">
        <p className="section-eyebrow">Check-In</p>
        <h1>Not Authorized</h1>
        <p className="section-lede">This account isn't set up for door check-in.</p>
      </div>
    );
  }

  return (
    <div className="section checkin-page">
      <p className="section-eyebrow">Check-In</p>
      <h1>{code ? "Scan Result" : "Scan a Ticket"}</h1>
      {code ? <TicketResult code={code} /> : <Scanner />}
    </div>
  );
}

// Extracts the ticket code whether the QR encoded a full check-in URL
// or just the bare code.
function extractCode(decodedText) {
  const match = decodedText.match(/\/checkin\/([A-Za-z0-9-]+)/);
  return match ? match[1] : decodedText.trim();
}

function Scanner() {
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  const [activeCode, setActiveCode] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (activeCode) return; // pause camera while showing a result

    const elementId = "qr-scanner-region";
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 240 },
        (decodedText) => {
          if (cancelled) return;
          setActiveCode(extractCode(decodedText));
        },
        () => {} // ignore per-frame decode misses
      )
      .catch((err) => {
        if (!cancelled) setCameraError(err?.message || "Could not access the camera.");
      });

    return () => {
      cancelled = true;
      scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
  }, [activeCode]);

  if (activeCode) {
    return <TicketResult code={activeCode} onScanNext={() => setActiveCode(null)} />;
  }

  return (
    <div>
      <p className="section-lede">Point the camera at a guest's ticket QR code.</p>
      <div id="qr-scanner-region" ref={containerRef} className="scanner-viewport" />
      {cameraError && (
        <p className="checkout-status error">
          {cameraError} Make sure this page has camera permission and you're on HTTPS.
        </p>
      )}
    </div>
  );
}

function TicketResult({ code, onScanNext }) {
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    setOrder(null);
    setNotFound(false);
    supabase
      .from("orders")
      .select("*")
      .eq("ticket_code", code)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setOrder(data);
      });
  }, [code]);

  async function handleCheckIn() {
    setCheckingIn(true);
    const { data, error } = await supabase
      .from("orders")
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq("ticket_code", code)
      .select()
      .single();
    setCheckingIn(false);
    if (!error) setOrder(data);
  }

  return (
    <>
      {notFound ? (
        <div className="checkin-card checkin-invalid">
          <p className="checkin-status-big">Invalid Ticket</p>
          <p className="ticket-desc">No ticket found for code {code}.</p>
        </div>
      ) : !order ? (
        <p className="gallery-empty">Looking up ticket...</p>
      ) : order.status !== "paid" ? (
        <div className="checkin-card checkin-invalid">
          <p className="checkin-status-big">Not Paid</p>
          <p className="ticket-desc">This order hasn't completed payment.</p>
        </div>
      ) : (
        <div className={`checkin-card ${order.checked_in ? "checkin-already" : "checkin-ready"}`}>
          <p className="checkin-status-big">
            {order.checked_in ? "Already Checked In" : "Valid Ticket"}
          </p>
          <h3>{order.buyer_name}</h3>
          <p className="ticket-desc">
            {order.ticket_name} × {order.quantity}
          </p>
          <p className="ticket-desc">
            {order.buyer_email} · {order.buyer_phone}
          </p>
          <p className="ticket-code">{order.ticket_code}</p>

          {order.checked_in ? (
            <p className="ticket-qr-hint">
              Checked in {new Date(order.checked_in_at).toLocaleString()}
            </p>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleCheckIn} disabled={checkingIn}>
              {checkingIn ? "Checking In..." : "Check In Now"}
            </button>
          )}
        </div>
      )}

      {onScanNext && (
        <button type="button" className="btn btn-outline scan-next-btn" onClick={onScanNext}>
          Scan Next Ticket
        </button>
      )}
    </>
  );
}
