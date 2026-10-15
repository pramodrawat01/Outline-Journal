import { FaCheck } from 'react-icons/fa';

const RATINGS = [
  { value: 'good', label: 'Good' },
  { value: 'better', label: 'Better' },
  { value: 'best', label: 'Best' },
];

export default function DayChecklist({ tracker, day, onChange }) {
  const done = new Set((day?.done || []).map(String));
  const rating = day?.rating || '';

  const toggle = (id) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ done: [...next], rating });
  };

  const pickRating = (value) =>
    onChange({ done: [...done], rating: rating === value ? '' : value });

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {tracker.habits.map((h) => {
          const id = String(h._id);
          const on = done.has(id);
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => toggle(id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  on
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    on ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-white/30'
                  }`}
                >
                  {on && <FaCheck size={10} />}
                </span>
                <span className="min-w-0 break-words">{h.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {tracker.useRating && (
        <div>
          <p className="mb-2 text-xs text-white/40">Overall</p>
          <div className="flex flex-wrap gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => pickRating(r.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  rating === r.value
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}