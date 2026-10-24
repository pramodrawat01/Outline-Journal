// import jwt from "jsonwebtoken";

// export function generateTokenAndSetCookie(res, userId) {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true, // not accessible from JS in the browser
//     secure: process.env.NODE_ENV === "production", // HTTPS only in prod
//     sameSite: process.env.NODE_ENV === "production" ? "none" :  "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     path: "/",
//   });

//   return token;
// }



import jwt from "jsonwebtoken";

// the ONLY place the auth cookie's attributes are defined. Setting and clearing must match exactly.
export const authCookieOptions = () => {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // not accessible from JS in the browser
    secure: prod, // HTTPS only in prod
    sameSite: prod ? "none" : "lax",
    path: "/",
  };
};

export function generateTokenAndSetCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    ...authCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

export function clearAuthCookie(res) {
  // no maxAge here: clearCookie sets its own expiry in the past
  res.clearCookie("token", authCookieOptions());
}