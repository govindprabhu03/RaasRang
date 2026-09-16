import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

function load() {
  if (!existsSync(ORDERS_FILE)) return [];
  return JSON.parse(readFileSync(ORDERS_FILE, "utf-8"));
}

function save(orders) {
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function addOrder(order) {
  const orders = load();
  orders.push(order);
  save(orders);
  return order;
}

export function updateOrder(razorpayOrderId, patch) {
  const orders = load();
  const idx = orders.findIndex((o) => o.razorpayOrderId === razorpayOrderId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  save(orders);
  return orders[idx];
}

export function getOrder(razorpayOrderId) {
  return load().find((o) => o.razorpayOrderId === razorpayOrderId) || null;
}

export function allOrders() {
  return load();
}
