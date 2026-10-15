import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  getFeed,
  getPublicBlog,
  getPublicDiaryEntry,
  getPublicJournal,
} from '../../services/publicService';
import { fmtLongDate, itemPath, KIND_LABEL } from '../../utils/publicUtils';
import JournalReader from '../../components/editor/JournalReader';
import Avatar from '../../components/public/Avatar';

const LOADERS = {
  blog: (p) => getPublicBlog(p.id),
  journal: (p) => getPublicJournal(p.id),
  entry: (p) => getPublicDiaryEntry(p.id, p.entryId),
};

export default function ArticlePage({ kind }) {
  const { id, entryId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error
  const [more, setMore] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setData(null);
    setMore([]);
    window.scrollTo(0, 0);

    LOADERS[kind]({ id, entryId })
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setStatus('ok');
      })
      .catch((err) => !cancelled && setStatus(err.response?.status === 404 ? 'notfound' : 'error'));

    return () => {
      cancelled = true;
    };
  }, [kind, id, entryId]);

  // "More from Outline"
  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    getFeed({ limit: 4 })
      .then((d) => {
        if (cancelled) return;
        setMore(d.items.filter((i) => i._id !== data.article._id).slice(0, 2));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [data]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  if (status === 'loading') return <p className="text-center text-sm text-white/40">Loading…</p>;

  if (status !== 'ok') {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <p className="text-sm text-white/60">
          {status === 'notfound'
            ? "This story isn't available. It may have been removed or made private."
            : 'Something went wrong. Try again in a moment.'}
        </p>
        <Link to="/blogs" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Browse stories
        </Link>
      </div>
    );
  }

  const { article, author, diary } = data;
  const backTo = diary ? `/diaries/${diary._id}` : '/blogs';
  const label = diary ? `${diary.icon || '📓'} ${diary.title}` : KIND_LABEL[article.kind];

  return (
    <article className="mx-auto max-w-4xl relative "> 
      <div className="flex items-center justify-between gap-3">
        <Link to={backTo} className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white">
          <FaArrowLeft size={10} /> {diary ? diary.title : 'All stories'}
        </Link>
        <button
          onClick={share}
          className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5"
        >
          {copied ? 'Link copied' : 'Share'}
        </button>
      </div>

      <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</p>
      <h1 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {article.title || 'Untitled'}
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <Avatar name={author.name} />
        <div className="text-xs">
          {author.linkable ? (
            <Link to={`/u/${author.username}`} className="font-semibold transition hover:text-emerald-400">
              {author.name}
            </Link>
          ) : (
            <span className="font-semibold">{author.name}</span>
          )}
          <p className="mt-0.5 text-white/40">
            {fmtLongDate(article.date)}
            {article.readTime ? ` · ${article.readTime} min read` : ''}
          </p>
        </div>
      </div>

      <div className="public-article mt-8">
        {article.content ? (
          <JournalReader key={article._id} content={article.content} />
        ) : (
          <p className="text-sm text-white/40">No text in this story.</p>
        )}
      </div>

      <div className="mt-12 border-t border-white/10 pt-8">
        <p className="text-sm font-semibold">Written by {author.name}</p>
        {author.bio && <p className="mt-2 text-sm leading-relaxed text-white/50">{author.bio}</p>}
        {author.linkable && (
          <Link
            to={`/u/${author.username}`}
            className="mt-3 inline-block text-sm text-emerald-400 hover:text-emerald-300"
          >
            View profile →
          </Link>
        )}
      </div>

      {more.length > 0 && (
        <div className="mt-10">
          <p className="text-sm font-semibold">More from Outline</p>
          <div className="mt-4 flex flex-col gap-4">
            {more.map((i) => (
              <Link
                key={`${i.kind}-${i._id}`}
                to={itemPath(i)}
                className="rounded-md border border-white/10 bg-[#111511] p-4 text-sm font-semibold leading-snug transition hover:border-white/25"
              >
                {i.title || 'Untitled'}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}