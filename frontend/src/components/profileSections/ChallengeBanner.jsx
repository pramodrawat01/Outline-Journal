import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { coverStyle, dayNumber, totalDays } from '../../utils/challengeUtils';

export default function ChallengeBanner({ challenge: c }) {
  if (!c) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-[#141414] px-6 py-10 text-center">
        <p className="text-sm font-medium">No active challenge</p>
        <p className="mt-1 text-xs text-white/40">Start one and write a little every day.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10" style={coverStyle(c.cover)}>
      <div className="px-3 py-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-white/50">Current challenge</p>
        <h2 className="mt-2 text-2xl font-semibold">{c.title}</h2>
        <p className="mt-1 text-sm text-white/60">
          Day {dayNumber(c)} of {totalDays(c)} · {c.journalCount || 0} written
        </p>
        <Link
          to={`/profile/challenges/${c._id}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          Continue <FaArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}