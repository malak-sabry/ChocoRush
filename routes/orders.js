const express = require("express");
const router = express.Router();
const Order = require("../models/OrderSchema");
const { cookieAuth } = require("../auth/middleware");

// POST /orders — place a new order (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, deliveryMethod } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const order = await Order.create({ name, email, phone, address, deliveryMethod });
    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// GET /orders — get all orders (admin only)
router.get("/", cookieAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// PUT /orders/:id/confirm — confirm an order (admin only)
router.put("/:id/confirm",cookieAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order confirmed.", order });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// DELETE /orders/:id — delete an order (admin only)
router.delete("/:id", cookieAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;