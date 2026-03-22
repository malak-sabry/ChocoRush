const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  coverImage: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});
module.exports = mongoose.model("Product", ProductSchema);
