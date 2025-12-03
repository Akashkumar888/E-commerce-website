import orderModel from "../models/order.model.js";
import { convertToINR, convertToPaise } from "../utils/currency.util.js";
import razorpayInstance from "../configs/razorpayInstance.config.js";
import stripe from "../configs/stripeInstance.config.js";
import userModel from "../models/user.model.js";

const deliveryCharges=10;

// ❌ "$" is NOT a valid Stripe currency
// ❌ Razorpay uses "INR", Stripe uses "usd"


// placing orders using COD method (amount stored in USD)
export const placeOrder = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address, currencySymbol } = request.body;

    // here we assume amount is already in USD on frontend
    const amountInUSD = amount;

    if (!items || items.length === 0) {
      return response.json({ success: false, message: "Items missing" });
    }

    const order = await orderModel.create({
      userId,
      items,
      amount: amountInUSD,       // ✅ store in USD
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

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


// placing orders using STRIPE (amount in USD, Stripe expects cents)
export const placeOrderStripe = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address } = request.body;

    const origin = request.headers.origin || "http://localhost:5173";

    
    // assume amount is in USD from frontend
    const amountInUSD = amount;

    // Stripe wants smallest unit → cents
    // you can also use a separate util like convertToCents,
    // but reusing convertToPaise is okay if it is generic
    

    const newOrder = await orderModel.create({
      userId,
      items,
      amount: amountInUSD,       // ✅ store in USD
      address,
      paymentMethod: "STRIPE",
      payment: false,
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency:"usd",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));


        line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharges * 100
      },
      quantity: 1
    });


    const session=await stripe.checkout.sessions.create({
      success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode:'payment'
    });

    response.json({
      success: true,
      session_url:session.url,
    });

  } catch (error) {
    console.log("STRIPE ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// placing orders using RAZORPAY (gateway in INR, DB in USD)
export const placeOrderRazorpay = async (request, response) => {
  try {
    const userId = request.user._id;
    const { items, amount, address } = request.body;

    // 1️⃣ amount from frontend is in USD
    const amountInUSD = amount;

    // 2️⃣ convert USD -> INR using your util
    //    (assuming convertToINR(amount, "$") returns INR value)
    const amountInINR = convertToINR(amountInUSD, "$");

    // 3️⃣ convert INR -> paise for Razorpay
    const amountInPaise = convertToPaise(amountInINR, "₹");

    // ✅ Store amount in USD, but also store razorpay_order_id for verification
    const orderData=await orderModel.create({
      userId,
      items,
      amount: amountInUSD,             // ✅ store in USD
      address,
      paymentMethod: "RAZORPAY",
      payment: false,
      date: Date.now(),
    });
    

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: orderData._id.toString(),
    };
    
    await razorpayInstance.orders.create(options,(error,order)=>{
    if(error){
      console.log(error);
      return response.json({success:false,message:error});
    }
    response.json({success:true,order});
    })
  } catch (error) {
    console.log("RAZORPAY ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// verify Stripe payment (no more INR match; use razorpayOrderId)
export const verifyStripe = async (request, response) => {
  try {
    const userId = request.user._id;
    const { orderId,success } = request.body;


    if(success){
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      await userModel.findByIdAndUpdate(userId,{cartData:{}});
      response.json({success:true});
    }
    else {
      await orderModel.findByIdAndUpdate(orderId);
      response.json({success:false});
    }

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpay=async(request,response)=>{
  try {
    const userId = request.user._id;
    const { razorpay_order_id } = request.body;
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status==='paid'){
      await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
      await userModel.findByIdAndUpdate(userId,{cartData:{}});
      response.json({success:true,message:'Payment Successful'});
    }
    else{
      response.json({success:false,message:'Payment failed'});
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, message: error.message });
  }
}

// All order data for admin panel (amount already in USD)
export const allOrders = async (request, response) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    response.json({
      success: true,
      orders,  // ✅ amounts in DB are in USD
    });

  } catch (error) {
    console.log("ADMIN ORDER ERROR:", error);
    response.status(500).json({ success: false, message: error.message });
  }
};


// User Order data for frontend (amount in USD)
export const userOrders = async (request, response) => {
  try {
    const userId = request.user._id; // from authUser middleware

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    response.json({
      success: true,
      orders, // ✅ frontend will get amount in $
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

