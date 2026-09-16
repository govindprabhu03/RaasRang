const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

function generateTicketCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(crypto.randomBytes(6), (b) => chars[b % chars.length]).join("");
  return `RR26-${suffix}`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification fields" });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Payment verification failed" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Server not configured for order confirmation." });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("id, status")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (existing.status === "paid") {
    return res.status(200).json({ success: true });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id,
      paid_at: new Date().toISOString(),
      ticket_code: generateTicketCode(),
    })
    .eq("id", existing.id);

  if (updateError) {
    return res.status(500).json({ error: "Failed to confirm order" });
  }

  res.status(200).json({ success: true });
};
