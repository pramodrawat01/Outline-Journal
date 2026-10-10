import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaRegEdit, FaTrash } from 'react-icons/fa';
import { deletePersonalJournal, getPersonalJournal } from '../../services/journalService';
import { fmtDate } from '../../utils/challengeUtils';
import JournalReader from '../../components/editor/JournalReader';

export default function JournalRead() {
  // const { id } = useParams();
  const { id, diaryId } = useParams();
  const listPath = diaryId ? `/profile/diary/${diaryId}` : '/profile/journal';
  const editPath = diaryId 
     ? `/profile/diary/${diaryId}/entries/${id}/edit`
    : `/profile/journal/${id}/edit`
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getPersonalJournal(id)
      .then(setJournal)
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Journal not found.' : 'Could not load this journal.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this journal? This cannot be undone.')) return;
    try {
      await deletePersonalJournal(id);
      navigate(listPath, { replace: true });
    } catch {
      setError('Could not delete this journal.');
    }
  };

  if (loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (!journal) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Journal not found.'}</p>
        <Link to={listPath} className="text-sm text-emerald-400">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={listPath}
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <FaArrowLeft size={11} /> {diaryId ? 'Diary' : 'All journals'}
      </Link>

      <article className="rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-white/40">{fmtDate(journal.entryDate)}</p>
            <h1 className="mt-2 break-words text-3xl font-semibold">{journal.title || 'Untitled'}</h1>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
            {journal.visibility}
          </span>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          {journal.content ? (
            <JournalReader key={journal._id} content={journal.content} />
          ) : (
            <p className="text-sm text-white/40">No text in this entry.</p>
          )}
        </div>
      </article>

      <div className="flex items-center justify-between gap-3">
        <Link
          to={editPath}
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/5"
        >
          <FaRegEdit size={13} /> Edit
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-xs text-white/30 transition hover:text-red-400"
        >
          <FaTrash size={11} /> Delete
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}