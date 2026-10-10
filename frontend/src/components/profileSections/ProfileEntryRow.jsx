// import { Link } from 'react-router-dom';

// const PILL = {
//   public: 'bg-emerald-500/10 text-emerald-400',
//   private: 'bg-white/10 text-white/60',
// };

// export default function ProfileEntryRow({ to, date, title, excerpt, visibility, meta }) {
//   return (
//     <Link
//       to={to}
//       className="flex gap-4 rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-white/25"
//     >
//       <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5">
//         <span className="text-[10px] uppercase tracking-wide text-white/50">
//           {date.toLocaleDateString('en-US', { month: 'short' })}
//         </span>
//         <span className="text-lg font-semibold leading-none">{date.getDate()}</span>
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-3">
//           <h3 className="break-words font-semibold">{title || 'Untitled'}</h3>
//           <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${PILL[visibility]}`}>
//             {visibility}
//           </span>
//         </div>
//         <p className="mt-1 line-clamp-2 text-sm text-white/50">{excerpt || 'No text yet.'}</p>
//         <p className="mt-3 text-xs text-white/40">{meta}</p>
//       </div>
//     </Link>
//   );
// }





import { Link } from 'react-router-dom';

const PILL = {
  public: 'bg-emerald-500/10 text-emerald-400',
  private: 'bg-white/10 text-white/60',
};

export default function ProfileEntryRow({ to, date, title, excerpt, visibility, meta, author, thumb }) {
  return (
    <div className="relative flex gap-4 rounded-2xl border border-white/10  bg-[#111511] p-5 transition hover:border-white/25">
      <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5">
        <span className="text-[10px] uppercase tracking-wide text-white/50">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-lg font-semibold leading-none">{date.getDate()}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="break-words font-semibold">
            <Link to={to} className="after:absolute after:inset-0 after:rounded-2xl">
              {title || 'Untitled'}
            </Link>
          </h3>
          {visibility && (
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${PILL[visibility]}`}>
              {visibility}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-white/50">{excerpt || 'No text yet.'}</p>

        <p className="mt-3 flex flex-wrap items-center gap-x-3 text-xs text-white/40">
          {author &&
            (author.to ? (
              <Link to={author.to} className="relative z-10 transition hover:text-white">
                by: {author.name}
              </Link>
            ) : (
              <span>by: {author.name}</span>
            ))}
          <span>{meta}</span>
        </p>
      </div>

      {thumb}
    </div>
  );
}