// import {motion} from 'framer-motion'
// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import { Compass, PenLine } from 'lucide-react';
// import CreateEntryModal from "./CreateEntryModal";

// export default function ProfileStaticHeader({
// showLogoutConfirm, setShowLogoutConfirm
// }){
//   const [showCreateModal, setShowCreateModal] = useState(false);

//     const {logout}  = useAuth()
//   const location = useLocation();
//   const navigate = useNavigate();


//   const isProfilePage = location.pathname === "/profile";

//   const handleLogout = async () => {
//     await logout();
//     setShowLogoutConfirm(false);
//     navigate("/signup");
//   };

//     return (
//         <>
//             <motion.header className="fixed top-0 left-0 right-0 z-50 border-b  border-white/10">
//                     <div className="mx-auto max-w-6xl bg-[#080808]">
//                       <nav className="flex h-15 items-center justify-between px-6 xl:px-0">
                        
//                         {/* Logo */}
//                         <Link to="/" className="flex items-center gap-2">
//                           <span className="text-xl text-emerald-400">✦</span>
//                           <span className="text-lg font-semibold text-white">
//                             Outline Journal
//                           </span>
//                         </Link>
            
//                         {/* Right side */}
//                         <div className="flex items-center gap-4">
            
//                           {/* Explore Docs */}
//                           <Link to="/blogs">
//                             <button
                            
//                                 className="
//                                 flex items-center gap-2
//                                 rounded-full
//                                 border border-emerald-500
//                                 px-5 py-2.5
//                                 text-sm font-medium text-white
//                                 transition
//                                 hover:bg-emerald-500/10
//                                 "
//                             >
//                                 <Compass size={16} />
//                                 Explore blogs
//                             </button>
//                           </Link>
            
//                            <button
//                                 className="
//                                   flex items-center gap-2
//                                   rounded-full
//                                   bg-emerald-500
//                                   px-5 py-2.5
//                                   text-sm font-medium text-black
//                                   transition
//                                   hover:bg-emerald-400
//                                 "
//                                 onClick={() => setShowCreateModal(true)}
//                               >
//                                 <PenLine size={16} />
//                                 Start Writing
//                               </button>
            
//                             <button
//                               onClick={() => setShowLogoutConfirm(true)}
//                               className="
//                                 flex items-center gap-2
//                                 rounded-full
//                                 border border-white/10
//                                 bg-white/5
//                                 px-5 py-2.5
//                                 text-sm font-medium text-white
//                                 transition
//                                 hover:bg-white/10
//                               "
//                             >
//                               <FaSignOutAlt size={14} />
//                               Log out
//                             </button>
                          
//                         </div>
//                         {showCreateModal && (
//                                       <CreateEntryModal onClose={() => setShowCreateModal(false)} />
//                                     )}
//                       </nav>
//                     </div>
//                   </motion.header>
//         </>
//     )
// }


import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import { Compass, PenLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CreateEntryModal from "./CreateEntryModal";

export default function ProfileStaticHeader({
  showLogoutConfirm,
  setShowLogoutConfirm,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/signup");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">

          {/* Logo */}
          <Link to="/" className="flex min-w-0 shrink items-center gap-2">
            <span className="shrink-0 text-xl text-emerald-400">✦</span>
            <span className="text-sm font-semibold leading-tight text-white sm:text-base md:text-lg">
              Outline
              <span className="hidden sm:inline"> Journal</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Explore */}
            <Link
              to="/blogs"
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                location.pathname === "/blogs"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-white/15 text-gray-200 hover:border-emerald-500 hover:text-emerald-400"
              }`}
            >
              <Compass size={16} />
              <span className="hidden sm:inline">Explore blogs</span>
              <span className="sm:hidden">Explore</span>
            </Link>

            {/* Create entry */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-emerald-400 sm:px-4 sm:text-sm"
            >
              <PenLine size={15} />
              <span className="hidden sm:inline">Start Writing</span>
              <span className="sm:hidden">Write</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Log out"
              title="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
            >
              <FaSignOutAlt size={14} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </nav>
      </motion.header>

      {showCreateModal && (
        <CreateEntryModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
}
