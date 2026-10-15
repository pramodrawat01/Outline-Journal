import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { fmtDate } from '../../utils/challengeUtils';

export default function TrackerCard({ tracker: t }) {
  const s = t.summary;
  const total = t.habits.length;
  const doneToday = s.today?.done?.length || 0;
  const pct = total ? Math.round((doneToday / total) * 100) : 0;

  return (
    <Link
      to={`/profile/tracker/${t._id}`}
      className="block rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-white/25"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words font-semibold">{t.title}</h3>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/50">
          <FaFire size={12} className={s.streak > 0 ? 'text-orange-400' : 'text-white/20'} />
          {s.streak}
        </span>
      </div>

      <p className="mt-1 text-xs text-white/40">
        Started {fmtDate(t.startDate)} · {s.daysLogged} {s.daysLogged === 1 ? 'day' : 'days'} logged
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {t.habits.slice(0, 4).map((h) => (
          <span key={h._id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
            {h.label}
          </span>
        ))}
        {t.habits.length > 4 && (
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40">
            +{t.habits.length - 4}
          </span>
        )}
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-white/50">
        {doneToday === 0 ? 'Nothing ticked tonight yet' : `${doneToday} of ${total} done tonight`}
      </p>
    </Link>
  );
}