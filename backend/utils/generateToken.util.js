
import jwt from 'jsonwebtoken'

  // Generate JWT token (instance method)
export const generateAuthToken = (userId)=> {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
      // expiresIn: "30d", // expiry is best practice
    });
};

