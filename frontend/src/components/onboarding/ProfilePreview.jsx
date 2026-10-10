const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

export default function ProfilePreview({ form = {} }) {

  const interests = form.interests || []

  const empty = !form.fullName && !form.username && !form.profession && !form.bio && !interests.length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 ">
      <p className="text-xs font-medium text-white/50">Your public profile</p>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-semibold">
          {initials(form.fullName)}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{form.fullName || 'Your name'}</h3>
        <p className="text-sm text-white/40">@{form.username || 'username'}</p>
        {form.profession && <p className="mt-2 text-sm text-white/70">{form.profession}</p>}
      </div>

      {form.bio && <p className="mt-4 text-center text-sm text-white/60">{form.bio}</p>}

      {interests.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {interests.map((i) => (
            <span key={i} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              {i}
            </span>
          ))}
        </div>
      )}

      {empty && (
        <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/40">
          Your profile preview updates as you add your details.
        </div>
      )}

      <div className="mt-6 text-center text-xs text-white/40">
        Profile is{' '}
        <span className={form.visibility === 'public' ? 'text-emerald-400' : 'text-white/70'}>
          {form.visibility}
        </span>
      </div>
    </div>
  );
}