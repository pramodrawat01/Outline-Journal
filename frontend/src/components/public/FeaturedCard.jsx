import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import AuthorName from './AuthorName';
import { itemMeta, itemPath, imgT  } from '../../utils/publicUtils';

const EYEBROW = { blog: 'Featured blog', journal: 'Featured journal', diary: 'Featured diary' };

export default function FeaturedCard({ item }) {
  const meta = itemMeta(item);

  return (
    // <div className="group relative rounded-2xl border border-white/10 bg-[#111511] p-6 transition hover:border-white/25 sm:p-8 mt-4">
    //   <FaArrowRight 
    //     className="absolute right-5 top-5 box-content rounded-full border border-white/20 p-2 -rotate-45 text-white/30 transition-all duration-300 group-hover:scale-125 group-hover:border-white/30 group-hover:text-white/50"
    //   size={13} />
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111511] p-6 transition hover:border-white/25 sm:p-8 mt-4">
      {item.coverImage ? (
        <img
          src={imgT(item.coverImage, 'c_fill,w_1200,h_480')}
          alt=""
          className="-mx-6 -mt-6 mb-6 h-44 w-[calc(100%+3rem)] max-w-none object-cover sm:-mx-8 sm:-mt-8 sm:h-56 sm:w-[calc(100%+4rem)]"
        />
      ) : (
        <FaArrowRight className="absolute right-6 top-6 -rotate-45 text-white/40" size={13} />
      )}

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