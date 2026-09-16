const Razorpay = require("razorpay");
const { nanoid } = require("nanoid");
const { getActiveTicketTypes } = require("./_ticketTypes");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ticketId, quantity, name, email, phone } = req.body || {};

    const ticketTypes = await getActiveTicketTypes();
    const ticket = ticketTypes.find((t) => t.id === ticketId);
    if (!ticket) return res.status(400).json({ error: "Invalid ticket type" });
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email and phone are required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "your_key_id_here") {
      return res.status(503).json({
        error: "Payments are not configured yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in Vercel env vars.",
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

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};
