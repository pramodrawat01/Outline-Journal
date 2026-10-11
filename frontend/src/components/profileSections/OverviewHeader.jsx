import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';

export default function OverviewHeader({ user }) {
  return (
    <div className="border-b border-white/10 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-semibold">{user.fullName}</h1>
          <span className="text-sm text-white/40">@{user.username}</span>
        </div>
        <Link
          to="/profile/edit"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/5"
        >
          <FaRegEdit /> Edit profile
        </Link>
      </div>

      {user.bio && <p className="mt-3 text-sm text-white/60">{user.bio}</p>}

      {user.interests?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {user.interests.map((i) => (
            <span key={i} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              {i}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}