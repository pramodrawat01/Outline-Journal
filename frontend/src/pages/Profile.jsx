// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaSignOutAlt, FaPen } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import Header from "../components/landingPage/Header";

// export default function Profile() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/signup");
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased overflow-hidden">
//       {/* grid background */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//           maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
//           WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
//         }}
//       />

     
//       <Header/>

//       {/* profile card */}
//       <div className="border relative z-10 max-w-7xl mx-auto px-8 pt-32">


//         <div className="bg-[#111511] border border-white/5 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
//           <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl font-semibold text-emerald-400 shrink-0">
//             {user?.fullName?.charAt(0).toUpperCase() || "?"}
//           </div>
//           <div className="flex-1">
//             <h1 className="text-xl font-semibold">{user?.fullName}</h1>
//             <p className="text-gray-400 text-sm">@{user?.username}</p>
//             <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
//           </div>
//           <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium px-5 py-2.5 rounded-full shrink-0">
//             <FaPen size={12} />
//             Write an entry
//           </button>
//         </div>

//         {/* empty state — no entries yet */}
//         <div className="bg-[#111511] border border-white/5 border-dashed rounded-2xl p-12 text-center">
//           <p className="text-gray-400 text-sm mb-1">No entries yet</p>
//           <p className="text-gray-600 text-xs">
//             Your journal is empty — write your first entry to get started.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  Compass,
  PlusCircle,
  Search,
  FolderOpen,
  Settings,
  Flame,
} from "lucide-react";
import Header from "../components/landingPage/Header";

import Explore from "../components/profileSections/Explore";
import Create from "../components/profileSections/Create";
import SearchTab from "../components/profileSections/SearchTab";
import Categories from "../components/profileSections/Categories";
import SettingsTab from "../components/profileSections/SettingsTab";
import Overview from "../components/profileSections/Overview";
import WelcomeBanner from "../components/profileSections/WelcomeBanner";

const navItems = [
  {key : "overview", label : "Overview", icon : Flame , component : Overview },
  { key: "create", label: "Create", icon: PlusCircle, component: Create },
  { key: "search", label: "Search", icon: Search, component: SearchTab },
  { key: "categories", label: "Categories", icon: FolderOpen, component: Categories },
  { key: "settings", label: "Settings", icon: Settings, component: SettingsTab },
];

export default function Profile() {
  const [activeSection, setActiveSection] = useState("overview");

  const ActiveComponent =
    navItems.find((item) => item.key === activeSection)?.component ?? Explore;

  return (
    <div className="relative min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased overflow-hidden ">
      {/* grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
        }}
      />

      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12 flex gap-8 items-start">
        {/* ============== SIDEBAR ============== */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-20">
          {/* search */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search blogs"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3 px-1">
            Discover
          </p>
          <nav className="flex flex-col gap-1 mb-8">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeSection === key
                    ? "bg-emerald-500 text-black"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          {/* reading streak */}
          <div className="mt-auto bg-[#111511] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Reading streak</p>
              <p className="text-xs text-gray-500">8 days in a row</p>
            </div>
          </div>
        </aside>

        {/* ============== ACTIVE SECTION ============== */}
        <main className="flex-1 min-w-0 ">
          <WelcomeBanner/>
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}