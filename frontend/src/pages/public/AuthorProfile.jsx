import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuthor, getAuthorItems } from '../../services/publicService';
import ProfileInfoPanel from '../../components/profileSections/ProfileInfoPanel';
import ProfileEntryRow from '../../components/profileSections/ProfileEntryRow';
import EntryThumb from '../../components/profileSections/EntryThumb';
import Segmented from '../../components/onboarding/Segmented';

const MESSAGES = {
  private: 'This profile is private.',
  notfound: "We couldn't find that author.",
  error: 'Something went wrong. Try again in a moment.',
};

export default function AuthorProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null); // { user, counts }
  const [status, setStatus] = useState('loading'); // loading | ok | private | notfound | error
  const [kind, setKind] = useState('blogs');
  const [lists, setLists] = useState({});
  const [listError, setListError] = useState('');

  useEffect(() => {
    setStatus('loading');
    setProfile(null);
    setLists({});
    setKind('blogs');
    setListError('');
    getAuthor(username)
      .then((data) => {
        setProfile(data);
        setStatus('ok');
      })
      .catch((err) => {
        const s = err.response?.status;
        setStatus(s === 403 ? 'private' : s === 404 ? 'notfound' : 'error');
      });
  }, [username]);

  useEffect(() => {
    if (status !== 'ok' || lists[kind]) return;
    let cancelled = false;
    getAuthorItems(username, kind)
      .then((items) => !cancelled && setLists((prev) => ({ ...prev, [kind]: items })))
      .catch(() => !cancelled && setListError('Could not load this list.'));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, kind, username]);

  if (status === 'loading') return <p className="text-sm text-white/40">Loading…</p>;

  if (status !== 'ok') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-white/60">{MESSAGES[status]}</p>
        <Link to="/blogs" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Browse blogs
        </Link>
      </div>
    );
  }

  const { user, counts } = profile;
  const items = lists[kind];
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="grid gap-10 lg:grid-cols-[400px_1fr] relative">
      <aside className="lg:border-r lg:border-white/10 lg:pr-8">
        <div className="lg:sticky lg:top-24">
          <ProfileInfoPanel user={user}>
            {joined && <p className="text-xs text-white/30">Joined {joined}</p>}
          </ProfileInfoPanel>
        </div>
      </aside>

      <section className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Stories
          </h2>
          <Segmented
            value={kind}
            onChange={(k) => {
              setKind(k);
              setListError('');
            }}
            options={[
              { value: 'blogs', label: `Blogs · ${counts.blogs}` },
              { value: 'journals', label: `Journals · ${counts.journals}` },
              { value: 'diaries', label: `Diaries · ${counts.diaries}` },
            ]}
          />
        </div>

        {listError ? (
          <p className="text-sm text-red-400">{listError}</p>
        ) : !items ? (
          <p className="text-sm text-white/40">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#141414] px-5 py-10 text-center text-sm text-white/40">
            No public {kind} yet.
          </div>
        ) : (
          <div className="space-y-4">
            {kind === 'blogs' &&
              items.map((b) => (
                <ProfileEntryRow
                  key={b._id}
                  to={`/blogs/${b._id}`}
                  date={new Date(b.createdAt)}
                  title={b.title}
                  excerpt={b.excerpt}
                  meta={`${b.readTime} min read`}
                  thumb={<EntryThumb id={b._id} icon="📝" />}
                />
              ))}

            {kind === 'journals' &&
              items.map((j) => (
                <ProfileEntryRow
                  key={j._id}
                  to={`/journals/${j._id}`}
                  date={new Date(`${j.entryDate}T00:00:00`)}
                  title={j.title}
                  excerpt={j.excerpt}
                  meta="Journal"
                  thumb={<EntryThumb id={j._id} icon="📖" />}
                />
              ))}

            {kind === 'diaries' &&
              items.map((d) => (
                <ProfileEntryRow
                  key={d._id}
                  to={`/diaries/${d._id}`}
                  date={new Date(d.lastEntry ? `${d.lastEntry}T00:00:00` : d.createdAt)}
                  title={d.title}
                  excerpt={d.description || 'No description'}
                  meta={`${d.entryCount} ${d.entryCount === 1 ? 'entry' : 'entries'}`}
                  thumb={<EntryThumb cover={d.cover} icon={d.icon} />}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}