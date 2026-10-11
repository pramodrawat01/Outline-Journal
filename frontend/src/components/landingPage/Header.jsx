import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import {
  Compass,
} from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === "/profile";

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/signup");
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <motion.header
     initial={{ y: -20, opacity: 0 }}
      animate={{
        width: scrolled ? "95%" : "100%",
        y: scrolled ? 5 : 0,
        opacity : 1,
      }}
      transition={{
        y: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, ease: "easeOut" },
        animate : { duration : 0.35 , ease : "easeOut"}
      }}
      className={`left-1/2 -translate-x-1/2 z-50 w-full 
      ${
        scrolled
          ? "fixed top-0 w-[95%] rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl"
          : "absolute top-0 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-8 py-1 sm:py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-emerald-400 text-xl">✦</span>
          <span className="font-semibold text-lg">Outline</span>
        </Link>
        
        <div className="flex gap-3">
          <Link to="/blogs">
            <button className="flex items-center cursor-pointer gap-2 rounded-full border-b px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5 sm:border sm:border-emerald-500 sm:px-5">
              <Compass size={18} />
              <span className="hidden sm:inline">Explore blogs</span>
            </button>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            {isProfilePage ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-full text-sm font-medium px-5 py-2.5 text-white"
              >
                <FaSignOutAlt size={14} />
                Log out
              </button>
            ) : (
              <>
                {user ? (
                  <Link to="/profile" className="flex items-center gap-2">
                    <FaUserCircle className="text-3xl text-emerald-400" />
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="relative font-bold text-gray-300 hover:text-white transition-colors before:absolute before:left-0 before:-bottom-1 before:h-[2px] before:w-full before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-emerald-400 before:to-emerald-300 before:transition-transform before:duration-300 hover:before:scale-x-100"
                  >
                    Login <span className="text-emerald-400">/</span> Signup
                  </Link>
                )}
<Link to="/create-blog">
                <button className="hidden cursor-pointer  md:flex bg-emerald-500 hover:bg-emerald-400 rounded-full items-center gap-2 text-sm font-medium px-5 py-2.5 text-black">
                  <PenLine size={16} />
                  Start Writing
                </button>
</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      
    </motion.header>

    {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#111511] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">Log out of Outline?</h3>
            <p className="text-gray-400 text-sm mb-6">
              You'll need to log back in to keep writing your entries.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-full text-sm font-medium py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black rounded-full text-sm font-medium py-2.5"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
