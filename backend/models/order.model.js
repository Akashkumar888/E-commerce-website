import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true }, // [{itemId, size, quantity}]
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    paymentMethod: { type: String, required: true }, // COD | STRIPE | RAZORPAY
    payment: { type: Boolean, default: false },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
