import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getTrackers } from '../../services/trackerService';
import { todayStr } from '../../utils/challengeUtils';
import TrackerCard from '../../components/profileSections/TrackerCard';
import TrackerFormModal from '../../components/profileSections/TrackerFormModal';

export default function Tracker() {
  const navigate = useNavigate();
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getTrackers(todayStr())
      .then(setTrackers)
      .catch(() => setError('Could not load your trackers.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Trackers</h2>
          {!loading && !error && (
            <p className="text-xs text-white/40">
              {trackers.length} {trackers.length === 1 ? 'tracker' : 'trackers'}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          <FaPlus size={11} /> New tracker
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : trackers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No trackers yet. Make one for the habits you want to tick off every night.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trackers.map((t) => (
            <TrackerCard key={t._id} tracker={t} />
          ))}
        </div>
      )}

      {showCreate && (
        <TrackerFormModal
          onClose={() => setShowCreate(false)}
          onSaved={(t) => navigate(`/profile/tracker/${t._id}`)}
        />
      )}
    </div>
  );
}