const Razorpay = require("razorpay");
const { nanoid } = require("nanoid");
const { TICKET_TYPES } = require("./_ticketTypes");

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const { ticketId, quantity, name, email, phone } = JSON.parse(event.body || "{}");
    const ticket = TICKET_TYPES.find((t) => t.id === ticketId);
    if (!ticket) return json(400, { error: "Invalid ticket type" });
    if (!name || !email || !phone) {
      return json(400, { error: "Name, email and phone are required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "your_key_id_here") {
      return json(503, {
        error: "Payments are not configured yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in Netlify env vars.",
      });
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const amountPaise = ticket.price * qty * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rr_${nanoid(10)}`,
    });

    return json(200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return json(500, { error: "Failed to create order" });
  }
};
