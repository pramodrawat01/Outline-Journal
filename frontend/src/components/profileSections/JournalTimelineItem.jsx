import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getJournal } from '../../services/challengeService';
import { fmtDate, fmtShort } from '../../utils/challengeUtils';
import JournalReader from '../editor/JournalReader';

export default function JournalTimelineItem({ journal: j, challengeId }) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && !full) {
      setLoading(true);
      setError('');
      try {
        const { journal } = await getJournal(challengeId, j.entryDate);
        setFull(journal);
      } catch {
        setError('Could not load this entry.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <li className="relative">
      <span className="absolute -left-[30px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-[#0a0a0a]" />

      <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/40">
              {fmtShort(j.entryDate)} · {fmtDate(j.entryDate)}
            </p>
            <h3 className="mt-1 break-words font-semibold">{j.title || 'Untitled'}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
            {j.visibility}
          </span>
        </div>

        {!open && (
          <p className="mt-2 line-clamp-2 text-sm text-white/50">{j.excerpt || 'No text yet.'}</p>
        )}

        {open && (
          <div className="mt-4 border-t border-white/10 pt-4">
            {loading && <p className="text-sm text-white/40">Loading…</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
            {full && <JournalReader content={full.content} />}
          </div>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs">
          <button onClick={toggle} className="text-emerald-400 hover:text-emerald-300">
            {open ? 'less' : 'more'}
          </button>
          <Link
            to={`/profile/challenges/${challengeId}/write/${j.entryDate}`}
            className="text-white/40 hover:text-white"
          >
            Edit
          </Link>
        </div>
      </div>
    </li>
  );
}