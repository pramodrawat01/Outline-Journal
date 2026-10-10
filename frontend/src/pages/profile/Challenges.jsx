import { useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { getChallenges } from '../../services/challengeService';
import { getStatus } from '../../utils/challengeUtils';
import Segmented from '../../components/onboarding/Segmented';
import ChallengeBanner from '../../components/profileSections/ChallengeBanner';
import ChallengeCard from '../../components/profileSections/ChallengeCard';
import CreateChallengeModal from '../../components/profileSections/CreateChallengeModal';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .catch(() => setError('Could not load your challenges.'))
      .finally(() => setLoading(false));
  }, []);

  const current = useMemo(() => challenges.find((c) => getStatus(c) === 'ongoing'), [challenges]);
  const visible = useMemo(
    () => (filter === 'ongoing' ? challenges.filter((c) => getStatus(c) === 'ongoing') : challenges),
    [challenges, filter]
  );

  const handleCreated = (challenge) => {
    setChallenges((prev) => [challenge, ...prev]);
    setShowCreate(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <ChallengeBanner challenge={current} />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-500/50 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10"
        >
          Create <FaPlus size={11} />
        </button>
      </div>

      <section>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All challenges' },
            { value: 'ongoing', label: 'Ongoing' },
          ]}
        />

        <div className="mt-5">
          {loading ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
              {filter === 'ongoing'
                ? 'No ongoing challenges right now.'
                : 'No challenges yet. Hit Create to start your first one.'}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visible.map((c) => (
                <ChallengeCard key={c._id} challenge={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {showCreate && (
        <CreateChallengeModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}