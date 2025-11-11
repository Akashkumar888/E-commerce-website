
import jwt from "jsonwebtoken";

export const adminAuth = (request, response, next) => {
  try {
    // ✅ 1. Extract token from cookie or Authorization header
    const token =
      request.cookies?.adminToken ||
      (request.headers.authorization?.startsWith("Bearer ")
        ? request.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Admin token not found.",
      });
    }

    // ✅ 2. Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired admin token.",
      });
    }

    // ✅ 3. Check Role
    if (decoded.role !== "ADMIN") {
      return response.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // ✅ 4. Attach admin info to request object
    request.admin = decoded;

    // ✅ 5. Continue to next middleware or controller
    next();

  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return response.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
 