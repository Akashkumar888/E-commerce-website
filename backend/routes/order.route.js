import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyOrder,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/order.controller.js";

import { authUser } from "../middlewares/authUser.middleware.js";
import { authAdmin } from "../middlewares/authAdmin.middleware.js"; // OPTIONAL if you have admin panel

const orderRouter = express.Router();

/* ---------------- USER ROUTES ---------------- */

// COD Order
orderRouter.post("/place", authUser, placeOrder);

// STRIPE Order
orderRouter.post("/stripe", authUser, placeOrderStripe);

// RAZORPAY Order
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// Verify Razorpay Online Payment
orderRouter.post("/verify", authUser, verifyOrder);

// Get logged-in user orders
orderRouter.get("/user-orders", authUser, userOrders);

/* ---------------- ADMIN ROUTES ---------------- */

// Get ALL orders (Admin Panel)
orderRouter.get("/list", authAdmin, allOrders);

// Update Order Status (Admin Panel)
orderRouter.post("/status", authAdmin, updateStatus);

export default orderRouter;
