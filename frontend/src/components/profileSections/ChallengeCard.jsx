import { Link } from 'react-router-dom';
import { coverStyle, fmtDate, getStatus, totalDays } from '../../utils/challengeUtils';

const STATUS_STYLE = {
  ongoing: 'bg-emerald-500/10 text-emerald-400',
  upcoming: 'bg-sky-500/10 text-sky-400',
  completed: 'bg-white/10 text-white/60',
};

export default function ChallengeCard({ challenge: c }) {
  const status = getStatus(c);
  const total = totalDays(c);
  const done = c.journalCount || 0;
  const pct = Math.min(100, Math.round((done / total) * 100));

  return (
    <Link
      to={`/profile/challenges/${c._id}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition hover:border-white/25"
    >
      <div className="h-24" style={coverStyle(c.cover)} />
      <div className="px-3 py-5  md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words font-semibold">{c.title}</h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${STATUS_STYLE[status]}`}>
            {status}
          </span>
        </div>
        <p className="mt-1 text-xs text-white/40">
          {fmtDate(c.startDate)} – {fmtDate(c.endDate)} · {c.visibility}
        </p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/50">
          {done} of {total} days written
        </p>
      </div>
    </Link>
  );
}