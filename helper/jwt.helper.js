import jwt from "jsonwebtoken";

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

/**
 * Function to create a JWT token
 * @param {Object} payload - Data to be encoded into the token (e.g., admin info)
 * @param {string} expiresIn - Expiration time for the token (e.g., '1h', '2d')
 * @returns {string} - JWT token
 */
export const createToken = (payload, expiresIn = "1d") => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (err) {
    throw new Error("Token creation failed");
  }
};

/**
 * Function to verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token if valid
 * @throws {Error} - If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
