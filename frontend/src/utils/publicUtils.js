// accepts "YYYY-MM-DD" strings (journal dates) or ISO timestamps
export const toDate = (d) => new Date(typeof d === 'string' && d.length === 10 ? `${d}T00:00:00` : d);

export const fmtShortDate = (d) =>
  toDate(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const fmtLongDate = (d) =>
  toDate(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const KIND_LABEL = { blog: 'Blog', journal: 'Journal', diary: 'Diary' };

export const itemPath = (item) =>
  item.kind === 'blog'
    ? `/blogs/${item._id}`
    : item.kind === 'journal'
      ? `/journals/${item._id}`
      : `/diaries/${item._id}`;

export const itemMeta = (item) =>
  item.kind === 'blog'
    ? item.readTime
      ? `${item.readTime} min read`
      : ''
    : item.kind === 'diary'
      ? `${item.entryCount} ${item.entryCount === 1 ? 'entry' : 'entries'}`
      : '';

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

// asks Cloudinary for a resized copy, e.g. imgT(url, 'c_fill,w_240,h_240')
export const imgT = (url, transform) =>
  url && url.includes('/upload/') ? url.replace('/upload/', `/upload/${transform}/`) : url;