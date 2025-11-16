import userModel from "../models/user.model.js";

// ---------------------- ADD TO CART ----------------------
export const addToCart = async (request, response) => {
  try {
    const userId = request.user._id;
    const { itemId, size } = request.body;

    if (!itemId || !size) {
      return response.status(400).json({
        success: false,
        message: "Item ID & size are required",
      });
    }

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    // If item exists in cart
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return response.json({
      success: true,
      message: "Item added to cart",
      cartData,
    });

  } catch (error) {
    console.error("ADD_TO_CART ERROR:", error);
    response.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// ---------------------- UPDATE CART ----------------------
export const updateUserCart = async (request, response) => {
  try {
    const userId = request.user._id;
    const { itemId, size, quantity } = request.body;

    if (!itemId || !size) {
      return response.status(400).json({
        success: false,
        message: "Item ID & size are required",
      });
    }

    if (quantity < 0) {
      return response.status(400).json({
        success: false,
        message: "Quantity must be >= 0",
      });
    }

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    // Remove item if quantity is 0
    if (quantity === 0) {
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];

        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return response.json({
      success: true,
      message: "Cart updated successfully",
      cartData,
    });

  } catch (error) {
    console.error("UPDATE_CART ERROR:", error);
    response.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// ---------------------- GET USER CART ----------------------
export const getUserCart = async (request, response) => {
  try {
    const userId = request.user._id;

    const user = await userModel.findById(userId).select("cartData");

    return response.json({
      success: true,
      cartData: user.cartData || {},
    });

  } catch (error) {
    console.error("GET_CART ERROR:", error);
    response.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

