const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    deliveryMethod: { type: String, default: "cod" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "deleted"],
      default: "pending",
    },

    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        variant: { type: String },
      },
    ],
  },
  { timestamps: true }
  
);

module.exports = mongoose.model("Order", orderSchema);