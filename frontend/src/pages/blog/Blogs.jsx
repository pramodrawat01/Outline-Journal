import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getFeed } from "../../services/publicService";
import StoryCard from "../../components/public/StoryCard";
import FeaturedCard from "../../components/public/FeaturedCard";
import StoryListItem from "../../components/public/StoryListItem";

const CHIPS = [
  { value: "all", label: "All" },
  { value: "blogs", label: "Blogs" },
  { value: "journals", label: "Journals" },
  { value: "diaries", label: "Diaries" },
];
const HEADINGS = {
  all: "Latest stories",
  blogs: "Latest blogs",
  journals: "Latest journals",
  diaries: "Latest diaries",
};
const keyOf = (i) => `${i.kind}-${i._id}`;

export default function Blogs() {
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setQ(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getFeed({ type, q, page: 1 })
      .then((d) => {
        if (cancelled) return;
        setItems(d.items);
        setHasMore(d.hasMore);
        setPage(1);
      })
      .catch(
        () =>
          !cancelled &&
          setError("Could not load stories. Try again in a moment."),
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [type, q]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const d = await getFeed({ type, q, page: page + 1 });
      setItems((prev) => {
        const seen = new Set(prev.map(keyOf));
        return [...prev, ...d.items.filter((i) => !seen.has(keyOf(i)))];
      });
      setHasMore(d.hasMore);
      setPage((p) => p + 1);
    } catch {
      setError("Could not load more stories.");
    } finally {
      setLoadingMore(false);
    }
  };

  const showFeatured = type === "all" && !q && items.length > 0;
  const featured = showFeatured
    ? items.find((i) => i.kind === "blog") || items[0]
    : null;
  const grid = featured ? items.filter((i) => i !== featured) : items;

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-x-clip">
      
     
      <header className="text-center relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
          The Outline Journal
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Ideas worth carrying with you
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
          Read honest notes on work, growth, creativity, and the everyday
          practice of becoming.
        </p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <FaSearch
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            size={13}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search essays, people, or topics"
            className="w-full rounded-xl border border-white/10 bg-[#111511] py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
          />
        </div>

        
      </header>

      <div className=" mt-4 sm:mt-12  relative z-10 ">
        <div className="mt-6 flex flex-wrap gap-2">
          {CHIPS.map((c) => {
            const active = type === c.value;

            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setType(c.value)}
                className={`
                  relative rounded-md sm:rounded-full border px-3 py-1  sm:px-5 sm:py-2
                  text-sm font-medium tracking-wide
                  transition-all duration-200 ease-out
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-emerald-400/60
                  ${
                    active
                      ? "border-emerald-400/40 bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                      : "border-white/[0.08] bg-[#202923] text-white/55 hover:border-white/20 hover:bg-[#111511] hover:text-white"
                  }
                `}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        {loading ? (
          <p className="text-center text-sm text-white/40">Loading…</p>
        ) : error && items.length === 0 ? (
          <p className="text-center text-sm text-red-400">{error}</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl mt-4 border border-white/10 bg-[#111511] px-5 py-10 text-center text-sm text-white/40">
            {q ? `No results for “${q}”.` : "No public stories yet."}
          </div>
        ) : (
          <>
            {featured && <FeaturedCard item={featured} />}

            {/* {grid.length > 0 && (
              <section className={featured ? 'mt-12' : ''}>
                <h2 className="mb-4 text-base font-semibold">{q ? `Results for “${q}”` : HEADINGS[type]}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grid.map((item) => (
                    <StoryCard key={keyOf(item)} item={item} />
                  ))}
                </div>
              </section>
            )} */}

            {grid.length > 0 && (
              <section className={featured ? "mt-8" : "mt-2"}>
                <h2 className="mb-4 text-sm font-medium text-white/55">
                  {q ? `Results for “${q}”` : HEADINGS[type]}
                </h2>

                <div className="overflow-hidden rounded-xl border  border-white/[0.09] bg-[#111511]">
                  {grid.map((item) => (
                    <StoryListItem key={keyOf(item)} item={item} />
                  ))}
                </div>
              </section>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-red-400">{error}</p>
            )}

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/5 disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
