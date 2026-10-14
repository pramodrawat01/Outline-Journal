// import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
// import { FaRegCompass, FaSignOutAlt } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import { getMyProfile } from "../services/profileService";
// import { useEffect, useState } from "react";

// export default function OnboardingLayout() {
//   const { loading, logout } = useAuth();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileloading, setProfileLoading] = useState(true);

//   useEffect(() => {
//     console.count("mounted");
//     const fetchProfile = async () => {
//       console.count("getprofile call");
//       try {
//         const userData = await getMyProfile();
//         setUser(userData);
//         console.log('userrrr', user)
//       } catch (error) {
//         console.log("Failed to fetch info in onboarding ", error);
//         setUser(null);
//       } finally {
//         setProfileLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading || profileloading) return null;
//   if (!user) return <Navigate to="/signup" replace />;

//   if (user.onboardingCompleted) return <Navigate to="/profile" replace />;

//   const handleLogout = async () => {
//     await logout();
//     navigate("/", { replace: true });
//     border - red - 500;
//   };

//   return (
//     // <div className="min-h-screen bg-[#0a0a0a] text-white border border-red-500">
//     //   <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
//     <div className="min-h-screen w-full overflow-x-clip bg-[#0a0a0a] text-white">
//       <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
//         <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
//           <span className="text-emerald-400">✦</span> Outline
//         </Link>
//         <div className="flex items-center gap-3">
//           {/* <Link
//             to="/docs"
//             className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
//           >
//             <FaRegCompass /> Explore docs
//           </Link> */}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
//           >
//             <FaSignOutAlt /> Log out
//           </button>
//         </div>
//       </header>
//       <Outlet />
//     </div>
//   );
// }





import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function OnboardingLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (!user) return <Navigate to="/signup" replace />;
  if (user.onboardingCompleted) return <Navigate to="/profile" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0a0a0a] text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-emerald-400">✦</span> Outline
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          <FaSignOutAlt /> Log out
        </button>
      </header>
      <Outlet />
    </div>
  );
}