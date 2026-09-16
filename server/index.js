import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { TICKET_TYPES, getTicketById } from "./tickets.js";
import { addOrder, updateOrder, getOrder, allOrders } from "./db.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== "your_key_id_here"
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

app.get("/api/tickets", (req, res) => {
  res.json(TICKET_TYPES);
});

app.post("/api/orders", async (req, res) => {
  try {
    const { ticketId, quantity, name, email, phone } = req.body;
    const ticket = getTicketById(ticketId);
    if (!ticket) return res.status(400).json({ error: "Invalid ticket type" });
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email and phone are required" });
    }
    const qty = Math.max(1, Number(quantity) || 1);
    const amountPaise = ticket.price * qty * 100;

    if (!razorpay) {
      return res.status(503).json({
        error:
          "Payments are not configured yet. Add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET to server/.env",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rr_${nanoid(10)}`,
    });

    addOrder({
      razorpayOrderId: razorpayOrder.id,
      ticketId,
      ticketName: ticket.name,
      quantity: qty,
      amount: amountPaise,
      name,
      email,
      phone,
      status: "created",
      createdAt: new Date().toISOString(),
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/api/orders/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification fields" });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    updateOrder(razorpay_order_id, { status: "verification_failed" });
    return res.status(400).json({ error: "Payment verification failed" });
  }

  const updated = updateOrder(razorpay_order_id, {
    status: "paid",
    paymentId: razorpay_payment_id,
    paidAt: new Date().toISOString(),
  });

  res.json({ success: true, order: updated });
});

app.get("/api/orders/:orderId", (req, res) => {
  const order = getOrder(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Basic admin listing — protect this behind auth before going live.
app.get("/api/admin/orders", (req, res) => {
  res.json(allOrders());
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Raas Rang server running on port ${PORT}`));
