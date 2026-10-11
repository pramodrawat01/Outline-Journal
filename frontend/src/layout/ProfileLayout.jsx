

// import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// import { useState } from 'react';
// import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import { Compass, PenLine } from 'lucide-react';
// import ConfirmModal from '../components/common/ConfirmModal';
// import ProfileStaticHeader from '../components/profileSections/ProfileStaticHeader';

// const TABS = [
//   { to: '/profile', label: 'Profile', end: true },
//   { to: '/profile/challenges', label: 'Challenges' },
//   { to: '/profile/journal', label: 'Journals' },
//   { to: '/profile/overview', label: 'Overview' },
//   { to: '/profile/diary', label : 'Journal Diary'}
//   // { to: '/profile/blogs', label : 'Blogs' }
// ];

// export default function ProfileLayout() {
//   const { user, loading } = useAuth();
//   if (loading || !user) return null;

//   const location = useLocation();
//   const navigate = useNavigate();

//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const isProfilePage = location.pathname === "/profile";

//   const handleLogout = async () => {
//     await logout();
//     setShowLogoutConfirm(false);
//     navigate("/signup");
//   };


//   return (
//     <div className="min-h-screen  bg-[#0a0a0a] text-white">
//       {/* Header */}
     

//         <ProfileStaticHeader 
//           showLogoutConfirm={showLogoutConfirm} 
//           setShowLogoutConfirm={setShowLogoutConfirm}
//         />
//       {/* Logout Modal */}
//       <ConfirmModal
//         isOpen={showLogoutConfirm}
//         onClose={() => setShowLogoutConfirm(false)}
//         onConfirm={handleLogout}
//         title="Log out of Outline?"
//         description="You'll need to log back in to keep writing your entries."
//         confirmText="Log out"
//       />
    
      
//        <main className="mx-auto gap-6 px-6 pb-12 pt-16 max-w-6xl">
      

//         <section className="min-w-0">
//           <nav className="mb-6 flex gap-1 border-b border-white/10">
//             {TABS.map((t) => (
//               <NavLink
//                 key={t.to}
//                 to={t.to}
//                 end={t.end}
//                 className={({ isActive }) =>
//                   `-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${
//                     isActive
//                       ? 'border-emerald-400 text-white'
//                       : 'border-transparent text-white/50 hover:text-white'
//                   }`
//                 }
//               >
//                 {t.label}
//               </NavLink>
//             ))}
//           </nav>

//            {/* <aside className="lg:border-r lg:border-white/10 lg:pr-8">
//           <div className="lg:sticky lg:top-24">
//             <ProfileInfoPanel user={user}>
//               <Link
//                 to={`/u/${user.username}`}
//                 className="inline-block text-sm text-emerald-400 transition hover:text-emerald-300"
//               >
//                 View public profile →
//               </Link>
//             </ProfileInfoPanel>
//           </div>
//         </aside> */}

//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// }




import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/common/ConfirmModal';
import ProfileStaticHeader from '../components/profileSections/ProfileStaticHeader';
import ProfileInfoPanel from '../components/profileSections/ProfileInfoPanel';

const TABS = [
  { to: '/profile', label: 'Profile', end: true },
  { to: '/profile/challenges', label: 'Challenges' },
  { to: '/profile/journal', label: 'Journals' },
  { to: '/profile/overview', label: 'Overview' },
  { to: '/profile/diary', label: 'Journal Diary' },
];

export default function ProfileLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // all hooks are above this line
  if (loading || !user) return null;

  const isProfilePage = location.pathname.replace(/\/$/, '') === '/profile';

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <ProfileStaticHeader
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log out of Outline?"
        description="You'll need to log back in to keep writing your entries."
        confirmText="Log out"
      />

      <main className="mx-auto max-w-6xl px-6 pb-12 pt-16">
       <nav className="mb-8 flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${
                  isActive
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-white/50 hover:text-white'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        {isProfilePage ? (
          <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
            <aside className="lg:border-r lg:border-white/10 lg:pr-8">
              <div className="lg:sticky lg:top-24">
                <ProfileInfoPanel user={user}>
                  {/* <Link
                    to={`/u/${user.username}`}
                    className="inline-block text-sm text-emerald-400 transition hover:text-emerald-300"
                  >
                    View public profile →
                  </Link> */}
                   <div className="flex flex-col items-start gap-3">
                    <Link
                      to="/profile/edit"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5"
                    >
                      Edit profile
                    </Link>
                    <Link
                      to={`/u/${user.username}`}
                      className="text-sm text-emerald-400 transition hover:text-emerald-300"
                    >
                      View public profile →
                    </Link>
                  </div>
                </ProfileInfoPanel>
              </div>
            </aside>

            <div className="min-w-0">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}