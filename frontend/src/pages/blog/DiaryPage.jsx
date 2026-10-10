import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getPublicDiary } from '../../services/publicService';
import { toDate } from '../../utils/publicUtils';
import { coverStyle } from '../../utils/challengeUtils';
import ProfileEntryRow from '../../components/profileSections/ProfileEntryRow';
import Avatar from '../../components/public/Avatar';

export default function DiaryPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    window.scrollTo(0, 0);
    getPublicDiary(id)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setStatus('ok');
      })
      .catch((err) => !cancelled && setStatus(err.response?.status === 404 ? 'notfound' : 'error'));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === 'loading') return <p className="text-center text-sm text-white/40">Loading…</p>;

  if (status !== 'ok') {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <p className="text-sm text-white/60">
          {status === 'notfound'
            ? "This diary isn't available. It may have been removed or made private."
            : 'Something went wrong. Try again in a moment.'}
        </p>
        <Link to="/blogs" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Browse stories
        </Link>
      </div>
    );
  }

  const { diary, entries, author } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white">
        <FaArrowLeft size={10} /> All stories
      </Link>

      <div className="overflow-hidden rounded-2xl border border-white/10" style={coverStyle(diary.cover)}>
        <div className="flex items-start gap-4 p-6 sm:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-3xl">
            {diary.icon}
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold">{diary.title}</h1>
            {diary.description && <p className="mt-1 text-sm text-white/70">{diary.description}</p>}
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={author.name} size="h-7 w-7 text-[10px]" />
              <p className="text-xs text-white/70">
                {author.linkable ? (
                  <Link to={`/u/${author.username}`} className="font-semibold hover:text-white">
                    {author.name}
                  </Link>
                ) : (
                  <span className="font-semibold">{author.name}</span>
                )}
                <span className="text-white/50">
                  {' '}
                  · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
          No public entries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <ProfileEntryRow
              key={e._id}
              to={`/diaries/${diary._id}/entries/${e._id}`}
              date={toDate(e.entryDate)}
              title={e.title}
              excerpt={e.excerpt}
              meta="Diary entry"
            />
          ))}
        </div>
      )}
    </div>
  );
}