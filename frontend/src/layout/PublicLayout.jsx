// import { Outlet } from 'react-router-dom';
// import Header from '../components/landingPage/Header';

// export default function PublicLayout() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white">
//       <Header />
//       <main className="mx-auto max-w-6xl px-6 pb-16 pt-24">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { Outlet } from 'react-router-dom';
import Header from '../components/landingPage/Header';
import BlogBackground from '../components/public/BlogBackground';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <BlogBackground/>
      <Header />
      <main className="mx-auto max-w-6xl px-3 md:px-6 pb-16 pt-14 sm:pt-20">
        <Outlet />
      </main>
    </div>
  );
}