import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFire, FaRegEdit, FaTrash } from 'react-icons/fa';
import { deleteTracker, getTracker, saveTrackerDay } from '../../services/trackerService';
import { fmtDate, todayStr } from '../../utils/challengeUtils';
import DayChecklist from '../../components/profileSections/DayChecklist';
import TrackerGrid from '../../components/profileSections/TrackerGrid';
import TrackerFormModal from '../../components/profileSections/TrackerFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';

const Stat = ({ label, children }) => (
  <div className="rounded-xl bg-white/5 p-4">
    <div className="text-xl font-semibold">{children}</div>
    <div className="mt-1 text-xs text-white/50">{label}</div>
  </div>
);

export default function TrackerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = todayStr();

  const [tracker, setTracker] = useState(null);
  const [days, setDays] = useState({});
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const queue = useRef(Promise.resolve());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    () =>
      getTracker(id, today).then((d) => {
        setTracker(d.tracker);
        setDays(
          Object.fromEntries(
            d.days.map((x) => [x.date, { done: x.done.map(String), rating: x.rating }])
          )
        );
        setSummary(d.summary);
      }),
    [id, today]
  );

  useEffect(() => {
    setLoading(true);
    load()
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Tracker not found.' : 'Could not load this tracker.')
      )
      .finally(() => setLoading(false));
  }, [load]);

  const handleChange = (next) => {
    const prev = days[date];
    const empty = next.done.length === 0 && !next.rating;

    setSaveError('');
    setDays((d) => {
      const copy = { ...d };
      if (empty) delete copy[date];
      else copy[date] = next;
      return copy;
    });

    queue.current = queue.current.then(async () => {
      try {
        const res = await saveTrackerDay(id, date, next, today);
        setSummary(res.summary);
      } catch (err) {
        setSaveError(err.response?.data?.message || 'Could not save. Check your connection.');
        setDays((d) => {
          const copy = { ...d };
          if (prev) copy[date] = prev;
          else delete copy[date];
          return copy;
        });
      }
    });
  };

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTracker(id);
      navigate('/profile/tracker', { replace: true });
    } catch {
      setError('Could not delete the tracker.');
       setSaveError('Could not delete the tracker.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (!tracker) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Tracker not found.'}</p>
        <Link to="/profile/tracker" className="text-sm text-emerald-400">
          ← Back to trackers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/profile/tracker" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <FaArrowLeft size={11} /> All trackers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{tracker.title}</h1>
          <p className="mt-1 text-xs text-white/40">Started {fmtDate(tracker.startDate)}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 text-white/40 transition hover:text-white"
          >
            <FaRegEdit size={12} /> Edit tracker
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 text-white/30 transition hover:text-red-400"
          >
            <FaTrash size={11} /> Delete
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Day streak">
            <span className="flex items-center gap-2">
              <FaFire size={16} className={summary.streak > 0 ? 'text-orange-400' : 'text-white/20'} />
              {summary.streak}
            </span>
          </Stat>
          <Stat label="This week">{summary.weekPct}%</Stat>
          <Stat label="Days logged">{summary.daysLogged}</Stat>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#141414] p-3 md:p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{date === today ? 'Tonight' : fmtDate(date)}</h2>
          <input
            type="date"
            value={date}
            min={tracker.startDate}
            max={today}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-1.5 text-sm text-white outline-none [color-scheme:dark] focus:border-emerald-500/60"
          />
        </div>

        <DayChecklist tracker={tracker} day={days[date]} onChange={handleChange} />

        {saveError && <p className="mt-4 text-sm text-red-400">{saveError}</p>}
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold">History</h2>
        <TrackerGrid tracker={tracker} days={days} today={today} selected={date} onSelect={setDate} />
      </section>

      {showEdit && (
        <TrackerFormModal
          tracker={tracker}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            load();
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
        title="Delete this tracker?"
        description="Its whole history will be deleted too. This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}