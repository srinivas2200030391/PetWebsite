// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectroute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.userid).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
