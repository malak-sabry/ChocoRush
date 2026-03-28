const express = require("express");
const router = express.Router();

const Cart = require("../models/CartSchema");
const Product = require("../models/ProductSchema");
const { cookieAuth } = require("../auth/middleware");

// ✅ GET CART
router.get("/", cookieAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "title price coverImage stock description brand category",
      populate: { path: "category", select: "name" },
    });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully!",
      cart,
    });
  } catch (error) {
    console.log("Error retrieving cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
  }
});
router.post("/", cookieAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        price: product.price,
        quantity: 1,
        category: product.category,
      });
    }

    product.stock -= 1;

    await product.save();
    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "title price coverImage stock description brand category",
      populate: { path: "category", select: "name" },
    });

    return res.json({ success: true, cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
});
// ✅ UPDATE CART
router.put("/", cookieAuth, async (req, res) => {
  try {
    const { quantity, productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "title price coverImage stock description brand category",
      populate: { path: "category", select: "name" },
    });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found." });
    }

    const item = cart.items.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found in cart." });
    }

    const product = await Product.findById(productId);
    const diff = quantity - item.quantity;

    if (diff > 0) {
      if (product.stock < diff) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      product.stock -= diff;
    } else {
      product.stock += Math.abs(diff);
    }

    item.quantity = quantity;

    await product.save();
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
});

router.delete("/:productId", cookieAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "title price coverImage stock description brand category",
      populate: { path: "category", select: "name" },
    });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(400).json({ message: "Item not found in the cart" });
    }

    const item = cart.items[itemIndex];
    const product = await Product.findById(productId);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
});
module.exports = router;
