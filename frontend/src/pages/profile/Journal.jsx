import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getPersonalJournals } from '../../services/journalService';
import JournalListItem from '../../components/profileSections/JournalListItem';

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPersonalJournals()
      .then(setJournals)
      .catch(() => setError('Could not load your journals.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Your journals</h2>
          {!loading && !error && (
            <p className="text-xs text-white/40">
              {journals.length} {journals.length === 1 ? 'entry' : 'entries'}
            </p>
          )}
        </div>
        <Link
          to="/profile/journal/new"
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          <FaPlus size={11} /> Write journal
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : journals.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No journals yet. Write your first one, as many as you like each day.
        </div>
      ) : (
        <ol className="relative space-y-5 border-l border-white/10 pl-6">
          {journals.map((j) => (
            <JournalListItem key={j._id} journal={j} />
          ))}
        </ol>
      )}
    </div>
  );
}