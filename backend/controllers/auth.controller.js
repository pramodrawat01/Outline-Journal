import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sanitize } from "../utils/sanatizeUser.js";

/* --------------------------- SIGNUP --------------------------- */
export async function signup(req, res) {
  try {
    const { fullName, username, email, password, agreedToTerms } = req.body;

    // basic presence checks
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (agreedToTerms !== true) {
      return res.status(400).json({
        message: "You must agree to the Terms of Service and Privacy Policy",
      });
    }

    // check for existing email / username
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password, // hashed automatically by the User model's pre-save hook
      agreedToTerms,
    });

    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Mongoose validation errors (e.g. bad username format) land here
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0]?.message || "Invalid input";
      return res.status(400).json({ message });
    }
    console.log(error)
    console.error("Signup error:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try againn." });
  }
}

/* ---------------------------- LOGIN ---------------------------- */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // password has `select: false` on the schema, so ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same error for "no user" and "wrong password" — don't leak which one it was
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      user: sanitize(user)
      // {
      //   id: user._id,
      //   fullName: user.fullName,
      //   username: user.username,
      //   email: user.email,
      // },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/* ---------------------------- LOGOUT ---------------------------- */
export async function logout(req, res) {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
}

/* ----------------------------- ME ----------------------------- */
// Returns the currently logged-in user; used on app load to restore a session.
export async function getMe(req, res) {
  return res.status(200).json({ user: sanitize(req.user)  });
}