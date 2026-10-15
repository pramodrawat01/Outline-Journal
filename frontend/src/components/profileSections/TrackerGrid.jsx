import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { addDays, totalDays } from '../../utils/challengeUtils';

const fmtRow = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

export default function TrackerGrid({ tracker, days, today, selected, onSelect }) {
  const [count, setCount] = useState(30);

  const available = Math.max(0, totalDays({ startDate: tracker.startDate, endDate: today }));
  const rows = Math.min(count, available);
  const dates = Array.from({ length: rows }, (_, i) => addDays(today, -i));

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#141414]">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-white/40">
              <th className="px-4 py-3 font-medium">Date</th>
              {tracker.habits.map((h) => (
                <th key={h._id} className="max-w-[140px] px-3 py-3 text-center font-medium">
                  <span className="line-clamp-2 break-words">{h.label}</span>
                </th>
              ))}
              {tracker.useRating && <th className="px-4 py-3 font-medium">Overall</th>}
            </tr>
          </thead>
          <tbody>
            {dates.map((d) => {
              const day = days[d];
              const done = new Set((day?.done || []).map(String));
              const isToday = d === today;
              return (
                <tr
                  key={d}
                  onClick={() => onSelect(d)}
                  className={`cursor-pointer border-b border-white/5 transition last:border-0 hover:bg-white/5 ${
                    selected === d ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-white/70">{fmtRow(d)}</td>
                  {tracker.habits.map((h) => (
                    <td key={h._id} className="px-3 py-3 text-center">
                      {done.has(String(h._id)) ? (
                        <FaCheck className="mx-auto text-emerald-400" size={12} />
                      ) : isToday ? (
                        <span className="mx-auto block h-3.5 w-3.5 rounded-sm border border-white/20" />
                      ) : (
                        <FaTimes className="mx-auto text-white/15" size={11} />
                      )}
                    </td>
                  ))}
                  {tracker.useRating && (
                    <td className="px-4 py-3 capitalize text-white/60">{day?.rating || '—'}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows < available && (
        <button
          type="button"
          onClick={() => setCount((c) => c + 30)}
          className="mt-4 text-sm text-emerald-400 transition hover:text-emerald-300"
        >
          Show earlier days
        </button>
      )}
    </div>
  );
}