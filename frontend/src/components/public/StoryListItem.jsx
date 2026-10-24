
// import { Link } from "react-router-dom";

// export default function StoryListItem({ item }) {
//   const title = item.title || "Untitled";
//   const description = item.description || item.excerpt || "";
//   const author =
//     item.author?.fullName ||
//     item.author?.username ||
//     item.authorName ||
//     "Unknown author";

//   const date = item.createdAt
//     ? new Date(item.createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "";

//   const readTime = item.readingTime || item.readTime || 1;

//   // Adjust this route if your app uses a different post URL.
//   const to =
//     item.slug
//       ? `/blogs/${item.slug}`
//       : `/blogs/${item._id}`;

//   return (
//     <Link
//       to={to}
//       className="group block border-b border-white/[0.08] px-4 py-4 transition-colors duration-200  hover:bg-black/20 sm:px-5"
//     >
//       <div className="flex items-start justify-between gap-4">
//         <div className="min-w-0 flex-1">
//           <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
//             <span className="capitalize">
//               {item.kind || "story"}
//             </span>

//             {date && (
//               <>
//                 <span>·</span>
//                 <time dateTime={item.createdAt}>{date}</time>
//               </>
//             )}
//           </div>

//           <h3 className="text-sm font-medium leading-relaxed text-white/90 transition-colors group-hover:text-emerald-400  sm:text-base">
//             {title}
//           </h3>

//           {description && (
//             <p className=" line-clamp-1 text-xs text-white/45 sm:text-sm">
//               {description}
//             </p>
//           )}
//         </div>

//         <div className="hidden shrink-0 items-center gap-2 pt-1 text-[11px] text-white/40 sm:flex">
//           <span className="max-w-32 truncate">
//             {author}
//           </span>
//           <span>·</span>
//           <span>{readTime} min read</span>
//         </div>
//       </div>

//       <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40 sm:hidden">
//         <span className="max-w-36 truncate">{author}</span>
//         <span>·</span>
//         <span>{readTime} min read</span>
//       </div>
//     </Link>
//   );
// }




import { Link } from "react-router-dom";
import AuthorName from "./AuthorName";
import { KIND_LABEL, fmtShortDate, itemMeta, itemPath, imgT } from "../../utils/publicUtils";

export default function StoryListItem({ item }) {
  const title = item.title || "Untitled";
  const description = item.excerpt || "";
  const meta = itemMeta(item);
  const label =
    item.kind === "diary" ? `${item.icon || "📓"} Diary` : KIND_LABEL[item.kind] || "Story";

  return (
    <div className="group relative border-b border-white/[0.08] px-4 py-4 transition-colors duration-200 last:border-b-0 hover:bg-black/20 sm:px-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
            <span>{label}</span>
            {item.date && (
              <>
                <span>·</span>
                <time>{fmtShortDate(item.date)}</time>
              </>
            )}
          </div>

          <h3 className="text-sm font-medium leading-relaxed text-white/90 transition-colors group-hover:text-emerald-400 sm:text-base">
            <Link to={itemPath(item)} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>

          {description && (
            <p className="line-clamp-1 text-xs text-white/45 sm:text-sm">{description}</p>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-2 pt-1 text-[11px] text-white/40 sm:flex">
          <span className="max-w-32 truncate">
            <AuthorName author={item.author} />
          </span>
          {meta && (
            <>
              <span>·</span>
              <span>{meta}</span>
            </>
          )}
        </div>
                {item.coverImage && (
          <img
            src={imgT(item.coverImage, "c_fill,w_160,h_112")}
            alt=""
            loading="lazy"
            className="h-14 w-20 shrink-0 rounded-lg border border-white/10 object-cover"
          />
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40 sm:hidden">
        <span className="max-w-36 truncate">
          <AuthorName author={item.author} />
        </span>
        {meta && (
          <>
            <span>·</span>
            <span>{meta}</span>
          </>
        )}
      </div>
    </div>
  );
}