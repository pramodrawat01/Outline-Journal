import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import AuthorName from './AuthorName';
import { itemMeta, itemPath } from '../../utils/publicUtils';

const EYEBROW = { blog: 'Featured essay', journal: 'Featured journal', diary: 'Featured diary' };

export default function FeaturedCard({ item }) {
  const meta = itemMeta(item);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#111511] p-6 transition hover:border-white/25 sm:p-8 mt-4">
      <FaArrowRight className="absolute right-6 top-6 -rotate-45 text-white/40" size={13} />

      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
        {EYEBROW[item.kind]}
      </p>

      <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">
        <Link to={itemPath(item)} className="after:absolute after:inset-0 after:rounded-2xl">
          {item.title || 'Untitled'}
        </Link>
      </h2>

      <p className="mt-3 line-clamp-3 max-w-xl text-sm text-white/50">{item.excerpt || 'No preview.'}</p>

      <p className="mt-5 flex items-center gap-2 text-xs text-white/50">
        <span className="font-medium text-white/80">
          <AuthorName author={item.author} />
        </span>
        {meta && (
          <>
            <span>·</span>
            <span>{meta}</span>
          </>
        )}
      </p>
    </div>
  );
}