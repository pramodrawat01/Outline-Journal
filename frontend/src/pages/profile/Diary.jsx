import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getDiaries } from '../../services/diaryService';
import DiaryCard from '../../components/profileSections/DiaryCard';
import DiaryModal from '../../components/profileSections/DiaryModal';

export default function Diary() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getDiaries()
      .then(setDiaries)
      .catch(() => setError('Could not load your diaries.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Diaries</h2>
          {!loading && !error && (
            <p className="text-xs text-white/40">
              {diaries.length} {diaries.length === 1 ? 'diary' : 'diaries'}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          <FaPlus size={11} /> New diary
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : diaries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No diaries yet. Start one for fitness, books, a project, anything you want to write about every day.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {diaries.map((n) => (
            <DiaryCard key={n._id} diary={n} />
          ))}
        </div>
      )}

      {showCreate && (
        <DiaryModal
          onClose={() => setShowCreate(false)}
          onSaved={(nb) => navigate(`/profile/diary/${nb._id}`)}
        />
      )}
    </div>
  );
}