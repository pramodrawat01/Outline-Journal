import { Link } from 'react-router-dom';
import { coverStyle, fmtDate } from '../../utils/challengeUtils';

const PILL = {
  public: 'bg-emerald-500/10 text-emerald-400',
  private: 'bg-white/10 text-white/60',
};

export default function DiaryCard({ diary: n }) {
  const count = n.entryCount || 0;

  return (
    <Link
      to={`/profile/diary/${n._id}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition hover:border-white/25"
    >
      <div className="h-28" style={coverStyle(n.cover)} />
      <div className="px-3 md:px-5 pb-5">
        <div className="-mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#141414] text-2xl">
          {n.icon}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words font-semibold">{n.title}</h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${PILL[n.visibility]}`}>
            {n.visibility}
          </span>
        </div>

        {n.description && <p className="mt-1 line-clamp-2 text-sm text-white/50">{n.description}</p>}

        <p className="mt-3 text-xs text-white/40">
          {count} {count === 1 ? 'entry' : 'entries'}
          {n.lastEntry ? ` · last ${fmtDate(n.lastEntry)}` : ''}
        </p>
      </div>
    </Link>
  );
}