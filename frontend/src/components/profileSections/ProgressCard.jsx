const SHADES = ['bg-white/5', 'bg-emerald-900', 'bg-emerald-600', 'bg-emerald-400'];

const Stat = ({ value, label }) => (
  <div className="rounded-xl bg-emerald-500/10 p-4">
    <div className="text-2xl font-semibold text-emerald-400">{value}</div>
    <div className="mt-1 text-xs text-white/50">{label}</div>
  </div>
);

export default function ProgressCard({
  stats = { journalEntries: 0, readingSessions: 0, habitCheckins: 0 },
  activity = Array(30).fill(0),
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Progress this month</h2>
        <span className="text-xs text-white/40">Last 30 days</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat value={stats.journalEntries} label="Journal entries" />
        <Stat value={stats.readingSessions} label="Reading sessions" />
        <Stat value={stats.habitCheckins} label="Habit check-ins" />
      </div>

      <p className="mt-5 text-xs font-medium">30-day activity</p>
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
        {activity.slice(0, 30).map((level, i) => (
          <div key={i} className={`aspect-square rounded-[3px] ${SHADES[level] || SHADES[0]}`} />
        ))}
      </div>
    </div>
  );
}