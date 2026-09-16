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

    const { data: order, error: lookupError } = await supabase
      .from("orders")
      .select("ticket_code, status, checked_in")
      .eq("ticket_code", code)
      .maybeSingle();

    if (lookupError) {
      return res.status(500).json({ error: "Check-in failed" });
    }
    if (!order) {
      return res.status(200).json({ status: "invalid" });
    }
    if (order.status !== "paid") {
      return res.status(200).json({ status: "unpaid" });
    }
    if (order.checked_in) {
      return res.status(200).json({ status: "already_used" });
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq("ticket_code", code)
      .eq("checked_in", false)
      .select("ticket_code, buyer_name, buyer_email, buyer_phone, ticket_name, quantity, checked_in_at")
      .maybeSingle();

    if (error || !updated) {
      return res.status(200).json({ status: "already_used" });
    }

    return res.status(200).json({
      status: "checked_in",
      ticket: {
        code: updated.ticket_code,
        name: updated.buyer_name,
        email: updated.buyer_email,
        phone: updated.buyer_phone,
        ticketType: updated.ticket_name,
        quantity: updated.quantity,
        checkedInAt: updated.checked_in_at,
      },
    });
  } catch {
    return res.status(500).json({ error: "Check-in failed" });
  }
};
