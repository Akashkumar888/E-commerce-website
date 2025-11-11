import  jwt  from "jsonwebtoken";
import userModel from "../models/user.model.js";


export const authUser = async (request, response, next) => {
  try {
    // 1. Get token from cookie or Authorization header
    const token =
      request.cookies?.accessToken ||
      (request.headers.authorization?.startsWith("Bearer ")
        ? request.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Authentication token not found.",
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // 3. Extract user ID
    const userId = decoded._id || decoded.id;
    if (!userId) {
      return response.status(401).json({
        success: false,
        message: "User ID missing in token.",
      });
    }

    // 4. Fetch user
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // 5. Attach user object to req
    request.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return response.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
