import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Expected format: 'Bearer <token>'

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin user from the decoded token
    const adminUser = await Admin.findOne({ email: decoded.email });

    if (!adminUser) {
      return res
        .status(401)
        .json({ message: "Admin not found, authorization denied" });
    }

    // Check if the role is admin
    if (adminUser.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    // If everything is fine, allow the request to proceed
    req.user = adminUser;
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res
      .status(500)
      .json({ message: "Invalid session or session expired" });
  }
};

export { isAdmin };
