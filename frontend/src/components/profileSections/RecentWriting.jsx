import { FaPen } from 'react-icons/fa';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function RecentWriting({ posts = [] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Recent writing</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
        {posts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-white/40">
            Nothing here yet. Your published entries will show up here.
          </p>
        ) : (
          posts.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <FaPen size={12} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="text-xs text-white/40">{fmt(p.publishedAt || p.createdAt)}</p>
              </div>
              {p.category && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  {p.category}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}