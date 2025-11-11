import jwt from 'jsonwebtoken'
// Generate JWT token (instance method)

export const generateAdminToken = (email) => {
  return jwt.sign(
    {
      role: "ADMIN",
      email,
    },
    process.env.JWT_SECRET,
    {
      // expiresIn: "30d",
    }
  );
};
