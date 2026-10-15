// const SHADES = ['bg-white/5', 'bg-emerald-900', 'bg-emerald-600', 'bg-emerald-400'];

// const Stat = ({ value, label }) => (
//   <div className="rounded-xl bg-emerald-500/10 p-4">
//     <div className="text-2xl font-semibold text-emerald-400">{value}</div>
//     <div className="mt-1 text-xs text-white/50">{label}</div>
//   </div>
// );

// export default function ProgressCard({
//   //stats = { journalEntries: 0, readingSessions: 0, habitCheckins: 0 },
//   stats = { journalEntries: 0, blogsPublished: 0, habitCheckins: 0 },
//   activity = Array(30).fill(0),
// }) {
//   return (
//     <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
//       <div className="flex items-center justify-between">
//         <h2 className="text-base font-semibold">Progress this month</h2>
//         <span className="text-xs text-white/40">Last 30 days</span>
//       </div>

//       <div className="mt-5 grid grid-cols-3 gap-3">
//         <Stat value={stats.journalEntries} label="Journal entries" />
//         {/* <Stat value={stats.readingSessions} label="Reading sessions" /> */}
//          <Stat value={stats.blogsPublished} label="Blogs published" />
//         <Stat value={stats.habitCheckins} label="Habit check-ins" />
//       </div>

//       <p className="mt-5 text-xs font-medium">30-day activity</p>
//       <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
//         {activity.slice(0, 30).map((level, i) => (
//           <div key={i} className={`aspect-square rounded-[3px] ${SHADES[level] || SHADES[0]}`} />
//         ))}
//       </div>
//     </div>
//   );
// }


import { addDays, todayStr } from '../../utils/challengeUtils';
import { toDate } from '../../utils/publicUtils';

const SHADES = ['bg-white/5', 'bg-emerald-900', 'bg-emerald-600', 'bg-emerald-400'];
const COLS = 15;

const Stat = ({ value, label }) => (
  <div className="rounded-xl bg-emerald-500/10 p-4">
    <div className="text-2xl font-semibold text-emerald-400">{value}</div>
    <div className="mt-1 text-xs text-white/50">{label}</div>
  </div>
);

// placeholder shown while the real data loads
const emptyActivity = () => {
  const today = todayStr();
  return Array.from({ length: 30 }, (_, i) => ({ date: addDays(today, i - 29), journals: 0, habits: 0 }));
};

const fmtDay = (date) => {
  const d = toDate(date);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

const summarize = ({ journals, habits }) => {
  const parts = [];
  if (journals > 0) parts.push(`${journals} ${journals === 1 ? 'journal' : 'journals'}`);
  if (habits > 0) parts.push(`${habits} habit ${habits === 1 ? 'tick' : 'ticks'}`);
  return parts.length ? parts.join(' · ') : 'No activity';
};

export default function ProgressCard({
  stats = { journalEntries: 0, blogsPublished: 0, habitCheckins: 0 },
  activity,
}) {
  const days =
    Array.isArray(activity) && activity.length && typeof activity[0] === 'object'
      ? activity.slice(0, 30)
      : emptyActivity();
  const today = todayStr();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Progress this month</h2>
        <span className="text-xs text-white/40">Last 30 days</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat value={stats.journalEntries} label="Journal entries" />
        <Stat value={stats.blogsPublished} label="Blogs published" />
        <Stat value={stats.habitCheckins} label="Habit check-ins" />
      </div>

      <p className="mt-5 text-xs font-medium">30-day activity</p>
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {days.map((a, i) => {
          const level = Math.min(3, a.journals + (a.habits > 0 ? 1 : 0));
          const col = i % COLS;
          // keep the tooltip inside the card near the left and right edges
          const align =
            col < 3 ? 'left-0' : col >= COLS - 3 ? 'right-0' : 'left-1/2 -translate-x-1/2';

          return (
            <div key={a.date} className="group relative">
              <div
                className={`aspect-square rounded-[3px] transition group-hover:ring-1 group-hover:ring-white/50 ${SHADES[level]}`}
              />

              {/* pointer */}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-[4px] h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0d0d0d] opacity-0 transition-all duration-150 group-hover:opacity-100" />

              {/* tooltip */}
              <div
                role="tooltip"
                className={`pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2 text-xs opacity-0 shadow-xl shadow-black/50 transition-all duration-150 group-hover:opacity-100 ${align}`}
              >
                <p className="font-medium text-white">
                  {fmtDay(a.date)}
                  {a.date === today && <span className="ml-2 text-emerald-400">Today</span>}
                </p>
                <p className="mt-0.5 text-white/50">{summarize(a)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}