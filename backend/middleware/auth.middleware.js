import jwt from "jsonwebtoken";
import User from "../models/User.js";



export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}