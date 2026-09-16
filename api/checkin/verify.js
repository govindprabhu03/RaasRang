const { createClient } = require("@supabase/supabase-js");
const { isScannerAuthorized } = require("../_scannerAuth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isScannerAuthorized(req)) {
    return res.status(401).json({ error: "Invalid or missing scanner key" });
  }

  const code = (req.body && req.body.code ? String(req.body.code) : "").trim();
  if (!code) {
    return res.status(400).json({ error: "Missing ticket code" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Server not configured for check-in." });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error } = await supabase
      .from("orders")
      .select("ticket_code, status, buyer_name, buyer_email, buyer_phone, ticket_name, quantity, checked_in, checked_in_at")
      .eq("ticket_code", code)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: "Lookup failed" });
    }

    if (!order) {
      return res.status(200).json({ status: "invalid" });
    }

    if (order.status !== "paid") {
      return res.status(200).json({ status: "unpaid" });
    }

    return res.status(200).json({
      status: order.checked_in ? "already_used" : "valid",
      ticket: {
        code: order.ticket_code,
        name: order.buyer_name,
        email: order.buyer_email,
        phone: order.buyer_phone,
        ticketType: order.ticket_name,
        quantity: order.quantity,
        checkedInAt: order.checked_in_at,
      },
    });
  } catch {
    return res.status(500).json({ error: "Lookup failed" });
  }
};
