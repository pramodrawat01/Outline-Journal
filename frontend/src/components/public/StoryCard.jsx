import { Link } from 'react-router-dom';
import AuthorName from './AuthorName';
import { KIND_LABEL, fmtShortDate, itemMeta, itemPath } from '../../utils/publicUtils';

export default function StoryCard({ item }) {
  const meta = itemMeta(item);

  return (
    <div className="relative flex flex-col rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-white/25">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold uppercase tracking-wider text-emerald-400">
          {item.kind === 'diary' ? `${item.icon || '📓'} Diary` : KIND_LABEL[item.kind]}
        </span>
        <span className="text-white/40">{fmtShortDate(item.date)}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <Link to={itemPath(item)} className="after:absolute after:inset-0 after:rounded-2xl">
          {item.title || 'Untitled'}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-white/50">{item.excerpt || 'No preview.'}</p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs">
        <span className="font-medium text-white/80">
          <AuthorName author={item.author} />
        </span>
        {meta && <span className="text-white/40">{meta}</span>}
      </div>
    </div>
  );
}