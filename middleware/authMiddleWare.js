import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });
};

// Role-based access
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
