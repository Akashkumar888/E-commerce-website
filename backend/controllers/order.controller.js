import orderModel from "../models/order.model.js";
import { convertToINR, convertToPaise } from "../utils/currency.util.js";
import  razorpayInstance  from "../configs/razorpayInstance.config.js";
import  stripe  from "../configs/stripeInstance.config.js";
import userModel from "../models/user.model.js";


// placing orders using COD method
export const placeOrder = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address, currencySymbol } = request.body;

    const finalAmount = convertToINR(amount, currencySymbol);

    const order = await orderModel.create({
      userId,
      items,
      amount: finalAmount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });
    await userModel.findByIdAndUpdate(userId,{cartData:{}});

    response.json({
      success: true,
      message: "Order placed successfully (COD)",
      orderId: order._id,
    });

  } catch (error) {
    console.log("COD ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// placing orders using STRIPE
export const placeOrderStripe = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address, currencySymbol } = request.body;

    const finalAmount = convertToINR(amount, currencySymbol);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount * 100,
      currency: "inr",
      metadata: { userId },
    });

    const newOrder = await orderModel.create({
      userId,
      items,
      amount: finalAmount,
      address,
      paymentMethod: "STRIPE",
      payment: false,
      date: Date.now(),
    });

    response.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.log("STRIPE ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// placing orders using RAZORPAY
export const placeOrderRazorpay = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address, currencySymbol } = request.body;

    const amountInPaise = convertToPaise(amount, currencySymbol);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${userId}_${Date.now()}`,
    });

    await orderModel.create({
      userId,
      items,
      amount: amountInPaise / 100,
      address,
      paymentMethod: "RAZORPAY",
      payment: false,
      date: Date.now(),
    });

    response.json({
      success: true,
      order: razorpayOrder,
    });

  } catch (error) {
    console.log("RAZORPAY ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// verify razorpay payment
export const verifyOrder = async (request, response) => {
  try {
    const { razorpay_order_id } = request.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findOneAndUpdate(
        { amount: orderInfo.amount / 100 },
        { payment: true }
      );

      return response.json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    response.json({
      success: false,
      message: "Payment verification failed",
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// All order data for admin panel
export const allOrders = async (request, response) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    response.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.log("ADMIN ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// User Order data for frontend
export const userOrders = async (request, response) => {
  try {
    const userId = request.user._id;// from authUser middleware

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    response.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.log("USER ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// update order status for admin
export const updateStatus = async (request, response) => {
  try {
    const { orderId, status } = request.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    response.json({
      success: true,
      message: "Order status updated",
    });

  } catch (error) {
    console.log("STATUS UPDATE ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};
