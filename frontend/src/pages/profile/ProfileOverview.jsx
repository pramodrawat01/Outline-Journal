// import React from 'react'
// import ProfilePreview from '../../components/onboarding/ProfilePreview'

// const ProfileOverview = () => {
//   return (
//      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 lg:grid-cols-[320px_1fr]">
//           <aside className="lg:sticky lg:top-6 lg:self-start">
//             {/* <ProfilePreview  /> */}
//             akdf
//           </aside>
//     </main>
//   )
// }

// export default ProfileOverview




// import { useAuth } from '../../context/AuthContext';
// import OverviewHeader from '../../components/profileSections/OverviewHeader';
// import AboutCard from '../../components/profileSections/AboutCard';
// import ProgressCard from '../../components/profileSections/ProgressCard';
// import RecentWriting from '../../components/profileSections/RecentWriting';

// export default function ProfileOverview() {
//   const { user } = useAuth();

//   return (
//     <div className="space-y-6">
//       <OverviewHeader user={user} />
//       <div className="grid gap-4 md:grid-cols-2">
//         <AboutCard user={user} />
//         <ProgressCard />
//       </div>
//       <RecentWriting />
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOverview } from '../../services/statsService';
import { todayStr } from '../../utils/challengeUtils';
import OverviewHeader from '../../components/profileSections/OverviewHeader';
import TonightCard from '../../components/profileSections/TonightCard';
import ProgressCard from '../../components/profileSections/ProgressCard';
import RecentWriting from '../../components/profileSections/RecentWriting';

export default function ProfileOverview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getOverview(todayStr())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} />
      <div className="grid gap-4 md:grid-cols-2">
        <TonightCard />
        <ProgressCard stats={data?.stats} activity={data?.activity} />
      </div>
      <RecentWriting items={data?.recent || []} />
    </div>
  );
}