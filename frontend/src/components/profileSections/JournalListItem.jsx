import { Link } from 'react-router-dom';
import { fmtDate, fmtShort } from '../../utils/challengeUtils';

export default function JournalListItem({ journal: j, base = '/profile/journal' }) {
  return (
    <li className="relative">
      <span className="absolute -left-[30px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-[#0a0a0a]" />

      <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/40">
              {fmtShort(j.entryDate)} · {fmtDate(j.entryDate)}
            </p>
            <Link
              to={`${base}/${j._id}`}
              className="mt-1 block break-words font-semibold transition hover:text-emerald-400"
            >
              {j.title || 'Untitled'}
            </Link>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
            {j.visibility}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-white/50">{j.excerpt || 'No text yet.'}</p>

        <div className="mt-3 text-xs">
          {/* <Link to={`/profile/journal/${j._id}/edit`} className="text-white/40 hover:text-white"> */}
           <Link to={`${base}/${j._id}/edit`} className="text-white/40 hover:text-white">
            Edit
          </Link>
        </div>
      </div>
    </li>
  );
}