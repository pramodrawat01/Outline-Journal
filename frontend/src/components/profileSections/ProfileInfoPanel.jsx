const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

export default function ProfileInfoPanel({ user, children }) {
  const about = [
    ['Currently reading', user.currentlyReading],
    ['Side project', user.sideProject],
    ['Exploring', user.exploring],
  ].filter(([, value]) => value);

  return (
    <div className="space-y-6 flex flex-col">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="h-30 w-30 rounded-full object-cover" />
      ) : (
        <div className="flex h-30 w-30 items-center justify-center rounded-full bg-[#111511] text-2xl font-semibold">
          {initials(user.fullName)}
        </div>
      )}

      <div>
        <h1 className="break-words text-3xl font-semibold ">{`Hey! I'm ${user?.fullName.split(' ')[0]}.`}</h1>
        <h1 className="break-words text-3xl font-semibold ">{user?.bio}</h1>
        <p className="mt-1 text-sm text-white/40">@{user.username}</p>
        {user.profession && <p className="mt-3 text-sm text-white/70">{user.profession}</p>}
      </div>

      {/* {user.bio && <p className="text-sm leading-relaxed text-white/60">{user.bio}</p>} */}

      {user.interests?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {user.interests.map((i) => (
            <span key={i} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              {i}
            </span>
          ))}
        </div>
      )}

      {about.length > 0 && (
        <dl className="space-y-3 border-t border-white/10 pt-5 text-sm">
          {about.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-white/40">{label}</dt>
              <dd className="mt-0.5 text-white/80">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children}
    </div>
  );
}