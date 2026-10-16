

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBlogs } from '../../services/blogService';
import { getPersonalJournals } from '../../services/journalService';
import Segmented from '../../components/onboarding/Segmented';
import ProfileEntryRow from '../../components/profileSections/ProfileEntryRow';
import { getDiaries } from '../../services/diaryService';
import EntryThumb from '../../components/profileSections/EntryThumb';

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [journals, setJournals] = useState([]);
  const [diaries, setDiaries] =useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kind, setKind] = useState('blogs');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([getMyBlogs(), getPersonalJournals(true), getDiaries()])
      .then(([b, j, d]) => {
        setBlogs(b);
        setJournals(j);
        setDiaries(d);
      })
      .catch(() => setError('Could not load your writing.'))
      .finally(() => setLoading(false));
  }, []);

  //const items = kind === 'blogs' ? blogs : journals;
   const items = kind === 'blogs' ? blogs : kind === 'journals' ? journals : diaries;

  const counts = useMemo(
    () => ({
      all: items.length,
      public: items.filter((i) => i.visibility === 'public').length,
      private: items.filter((i) => i.visibility === 'private').length,
    }),
    [items]
  );

  const visible = filter === 'all' ? items : items.filter((i) => i.visibility === filter);

  const emptyText =
    items.length === 0
      // ? kind === 'blogs'
      //   ? 'No blogs yet.'
      //   : 'No journals yet.'
       ? `No ${kind} yet.`
      : `No ${filter} ${kind} to show.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'blogs', label: `Blogs · ${blogs.length}` },
            { value: 'journals', label: `Journals · ${journals.length}` },
            { value: 'diaries', label: `Diaries · ${diaries.length}` },
          ]}
        />
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: `All · ${counts.all}` },
            { value: 'public', label: `Public · ${counts.public}` },
            { value: 'private', label: `Private · ${counts.private}` },
          ]}
        />
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#111511] px-5 py-10 text-center text-sm text-white/40">
          <p>{emptyText}</p>
          {items.length === 0 && (
            <Link
              // to={kind === 'blogs' ? '/create-blog' : '/profile/journal/new'}
              to={kind === 'blogs' ? '/create-blog' : kind === 'journals' ? '/profile/journal/new' : '/profile/diary'}
              className="mt-3 inline-block text-emerald-400 hover:text-emerald-300"
            >
              {/* {kind === 'blogs' ? 'Write a blog' : 'Write a journal'} → */}
              {kind === 'blogs' ? 'Write a blog' : kind === 'journals' ? 'Write a journal' : 'Start a diary'} →
            </Link>
          )}
        </div>
      ) : (
        // <div className="space-y-4">
        //   {kind === 'blogs'
        //     ? visible.map((b) => (
        //         <ProfileEntryRow
        //           key={b._id}
        //           to={`/profile/blogs/${b._id}`}
        //           date={new Date(b.createdAt)}
        //           title={b.title}
        //           excerpt={b.excerpt}
        //           visibility={b.visibility}
        //           meta={`${b.readTime} min read`}
        //         />
        //       ))
        //     : visible.map((j) => (
        //         <ProfileEntryRow
        //           key={j._id}
        //           //to={j.challenge ? `/profile/challenges/${j.challenge}` : `/profile/journal/${j._id}`}
        //           to={
        //             j.challenge
        //               ? `/profile/challenges/${j.challenge}`
        //               : j.diary
        //                 ? `/profile/diary/${j.diary}/entries/${j._id}`
        //                 : `/profile/journal/${j._id}`
        //           }
                 
        //           date={new Date(`${j.entryDate}T00:00:00`)}
        //           title={j.title}
        //           excerpt={j.excerpt}
        //           visibility={j.visibility}
        //            meta={j.challenge ? 'Challenge journal' : j.diary ? 'Diary entry' : 'Journal'}
        //         />
        //       ))}
        // </div>
                <div className="space-y-4 ">
          {kind === 'blogs' &&
            visible.map((b) => (
              <ProfileEntryRow
                key={b._id}
                to={`/profile/blogs/${b._id}`}
                date={new Date(b.createdAt)}
                title={b.title}
                excerpt={b.excerpt}
                visibility={b.visibility}
                meta={`${b.readTime} min read`}
                thumb={<EntryThumb id={b._id} icon="📝" />}
              />
            ))}

          {kind === 'journals' &&
            visible.map((j) => (
              <ProfileEntryRow
                key={j._id}
                to={
                  j.challenge
                    ? `/profile/challenges/${j.challenge}`
                    : j.diary
                      ? `/profile/diary/${j.diary}/entries/${j._id}`
                      : `/profile/journal/${j._id}`
                }
                date={new Date(`${j.entryDate}T00:00:00`)}
                title={j.title}
                excerpt={j.excerpt}
                visibility={j.visibility}
                meta={j.challenge ? 'Challenge journal' : j.diary ? 'Diary entry' : 'Journal'}
                thumb={<EntryThumb id={j._id} icon="📖" />}
              />
            ))}

          {kind === 'diaries' &&
            visible.map((d) => (
              <ProfileEntryRow
                key={d._id}
                to={`/profile/diary/${d._id}`}
                date={new Date(d.lastEntry ? `${d.lastEntry}T00:00:00` : d.createdAt)}
                title={d.title}
                excerpt={d.description || 'No description'}
                visibility={d.visibility}
                meta={`${d.entryCount} ${d.entryCount === 1 ? 'entry' : 'entries'}`}
                thumb={<EntryThumb cover={d.cover} icon={d.icon} />}
              />
            ))}
        </div>
      )}
    </div>
  );
}