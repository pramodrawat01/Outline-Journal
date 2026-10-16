import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaRegEdit, FaTrash } from 'react-icons/fa';
import { deleteDiary, getDiary } from '../../services/diaryService';
import { coverStyle, todayStr } from '../../utils/challengeUtils';
import JournalListItem from '../../components/profileSections/JournalListItem';
import DiaryModal from '../../components/profileSections/DiaryModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function DiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDiary(id)
      .then((data) => {
        setDiary(data.diary);
        setEntries(data.entries);
      })
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Diary not found.' : 'Could not load this diary.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
setDeleting(true)
    try {
      await deleteDiary(id);
      navigate('/profile/diary', { replace: true });
    } catch {
      setError('Could not delete the diary.');
      setDeleting(false)
      setConfirmOpen(false)
    }
  };

  const handleEdited = (nb) => {
    setDiary(nb);
    setShowEdit(false);
    if (nb.visibility === 'private') {
      setEntries((prev) => prev.map((e) => ({ ...e, visibility: 'private' })));
    }
  };

  if (loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (!diary) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Diary not found.'}</p>
        <Link to="/profile/diary" className="text-sm text-emerald-400">
          ← Back to diaries
        </Link>
      </div>
    );
  }

  const days = new Set(entries.map((e) => e.entryDate)).size;
  const wroteToday = entries.some((e) => e.entryDate === todayStr());

  return (
    <div className="space-y-6">
      <Link to="/profile/diary" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <FaArrowLeft size={11} /> All diaries
      </Link>

      <div className="overflow-hidden rounded-2xl border border-white/10" style={coverStyle(diary.cover)}>
        <div className="flex items-start gap-4 p-3 py-6 md:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-3xl">
            {diary.icon}
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold">{diary.title}</h1>
            {diary.description && <p className="mt-1 text-sm text-white/70">{diary.description}</p>}
            <p className="mt-3 text-sm text-white/60">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · {days}{' '}
              {days === 1 ? 'day' : 'days'} written · {diary.visibility}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link
            to={`/profile/diary/${diary._id}/new`}
            className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 md:py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
          >
            <FaPlus size={11} /> Add new entry
          </Link>
          <span className={`text-xs ${wroteToday ? 'text-emerald-400' : 'text-white/40'}`}>
            {wroteToday ? '✓ Written today' : 'Nothing written today yet'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 text-white/40 transition hover:text-white"
          >
            <FaRegEdit size={12} /> Edit diary
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 text-white/30 transition hover:text-red-400"
          >
            <FaTrash size={11} /> Delete
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No entries yet. Add your first one to start this diary.
        </div>
      ) : (
        <ol className="relative space-y-5 border-l border-white/10 pl-3 md:pl-6">
          {entries.map((e) => (
            <JournalListItem key={e._id} journal={e} base={`/profile/diary/${diary._id}/entries`} />
          ))}
        </ol>
      )}

      {showEdit && (
        <DiaryModal diary={diary} onClose={() => setShowEdit(false)} onSaved={handleEdited} />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
        title="Delete this diary?"
        description="All of its entries will be deleted too. This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}