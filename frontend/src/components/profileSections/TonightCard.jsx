import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { getTrackers, saveTrackerDay } from '../../services/trackerService';
import { todayStr } from '../../utils/challengeUtils';
import DayChecklist from './DayChecklist';

const Shell = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">{children}</div>
);

export default function TonightCard() {
  const today = todayStr();
  const [trackers, setTrackers] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');
  const queue = useRef(Promise.resolve());

  const load = useCallback(
    () => getTrackers(today).then(setTrackers).catch(() => setError('Could not load your trackers.')),
    [today]
  );

  useEffect(() => {
    load();
  }, [load]);

  const patch = (tid, fn) => setTrackers((list) => list.map((t) => (t._id === tid ? fn(t) : t)));

  if (!trackers) {
    return (
      <Shell>
        <h2 className="text-base font-semibold">Tonight's checklist</h2>
        <p className={`mt-4 text-sm ${error ? 'text-red-400' : 'text-white/40'}`}>{error || 'Loading…'}</p>
      </Shell>
    );
  }

  if (trackers.length === 0) {
    return (
      <Shell>
        <h2 className="text-base font-semibold">Tonight's checklist</h2>
        <p className="mt-4 text-sm text-white/40">
          Track the habits you want to tick off every night, like applications sent or effort given.
        </p>
        <Link
          to="/profile/tracker"
          className="mt-4 inline-block text-sm text-emerald-400 transition hover:text-emerald-300"
        >
          Create a tracker →
        </Link>
      </Shell>
    );
  }

  const active = trackers.find((t) => t._id === activeId) || trackers[0];
  const s = active.summary;

  const handleChange = (next) => {
    const tid = active._id;
    const empty = next.done.length === 0 && !next.rating;
    setError('');
    patch(tid, (t) => ({ ...t, summary: { ...t.summary, today: empty ? null : next } }));

    queue.current = queue.current.then(async () => {
      try {
        const res = await saveTrackerDay(tid, today, next, today);
        patch(tid, (t) => ({ ...t, summary: res.summary }));
      } catch {
        setError('Could not save. Try again.');
        load();
      }
    });
  };

  return (
    <Shell>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Tonight's checklist</h2>
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <FaFire size={12} className={s.streak > 0 ? 'text-orange-400' : 'text-white/20'} />
          {s.streak} day streak
        </span>
      </div>

      {trackers.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {trackers.map((t) => (
            <button
              key={t._id}
              type="button"
              onClick={() => setActiveId(t._id)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                t._id === active._id
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      <p className="mb-4 mt-4 text-xs text-white/40">{active.title}</p>
      <DayChecklist tracker={active} day={s.today} onChange={handleChange} />

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
        <span>This week {s.weekPct}%</span>
        <Link
          to={`/profile/tracker/${active._id}`}
          className="text-emerald-400 transition hover:text-emerald-300"
        >
          Open tracker →
        </Link>
      </div>
    </Shell>
  );
}