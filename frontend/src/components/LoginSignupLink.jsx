import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LoginSignupLink() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/signup"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-block px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
    >
      Login / Signup

      <motion.span
        className="absolute inset-0 rounded-md border-2 border-emerald-400 pointer-events-none"
        initial={false}
        animate={{
          clipPath: hovered
            ? "inset(0% 0% 0% 0%)"
            : "inset(calc(100% - 2px) 0% 0% 0%)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </Link>
  );
}