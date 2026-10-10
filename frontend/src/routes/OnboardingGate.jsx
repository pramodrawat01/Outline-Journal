// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function OnboardingGate() {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   if (!user) return <Navigate to="/login" replace />;
//   if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
//   return <Outlet />;
// }

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnboardingGate() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signup" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}