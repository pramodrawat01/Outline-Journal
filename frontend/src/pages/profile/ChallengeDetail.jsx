import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { deleteChallenge, getChallengeJournals } from '../../services/challengeService';
import { coverStyle, dayNumber, fmtDate, getStatus, totalDays } from '../../utils/challengeUtils';
import JournalTimelineItem from '../../components/profileSections/JournalTimelineItem';
import AddJournalModal from '../../components/profileSections/AddJournalModal';
import ConfirmModal from '../../components/common/ConfirmModal';

const STATUS_STYLE = {
  ongoing: 'bg-emerald-500/10 text-emerald-400',
  upcoming: 'bg-sky-500/10 text-sky-400',
  completed: 'bg-white/10 text-white/60',
};

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    getChallengeJournals(id)
      .then((data) => {
        setChallenge(data.challenge);
        setJournals(data.journals);
      })
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Challenge not found.' : 'Could not load this challenge.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteChallenge(id);
      navigate('/profile/challenges', { replace: true });
    } catch {
      setDeleteError('Could not delete the challenge.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (error || !challenge) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Challenge not found.'}</p>
        <Link to="/profile/challenges" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Back to challenges
        </Link>
      </div>
    );
  }

  const status = getStatus(challenge);
  const total = totalDays(challenge);

  return (
    <div className="space-y-6">
      <Link
        to="/profile/challenges"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <FaArrowLeft size={11} /> All challenges
      </Link>

      <div className="overflow-hidden rounded-2xl border border-white/10" style={coverStyle(challenge.cover)}>
        <div className="px-3 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 break-words text-2xl font-semibold">{challenge.title}</h1>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${STATUS_STYLE[status]}`}>
              {status}
            </span>
          </div>
          {challenge.description && <p className="mt-2 text-sm text-white/70">{challenge.description}</p>}
          <p className="mt-3 text-sm text-white/60">
            {fmtDate(challenge.startDate)} – {fmtDate(challenge.endDate)} · {challenge.visibility}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {status === 'ongoing' && `Day ${dayNumber(challenge)} of ${total} · `}
            {journals.length} of {total} days written
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setShowAdd(true)}
          disabled={status === 'upcoming'}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 sm:py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaPlus size={11} /> Add journal
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-2 text-xs text-white/30 transition hover:text-red-400"
        >
          <FaTrash size={11} /> Delete challenge
        </button>
      </div>
      {deleteError && <p className="text-sm text-red-400">{deleteError}</p>}

      {status === 'upcoming' && (
        <p className="text-sm text-white/40">This challenge starts on {fmtDate(challenge.startDate)}.</p>
      )}

      {journals.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No journals yet. Add your first one to get the timeline going.
        </div>
      ) : (
        <ol className="relative space-y-5 border-l border-white/10 pl-6">
          {journals.map((j) => (
            <JournalTimelineItem key={j._id} journal={j} challengeId={challenge._id} />
          ))}
        </ol>
      )}

      {showAdd && (
        <AddJournalModal challenge={challenge} journals={journals} onClose={() => setShowAdd(false)} />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
        title="Delete this challenge?"
        description="Every journal written in it will be deleted too. This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}