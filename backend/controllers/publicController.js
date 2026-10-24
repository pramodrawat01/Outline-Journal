import mongoose from 'mongoose';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Journal from '../models/Journal.js';
import Diary from '../models/Diary.js';


const LIMIT = 50;
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const FIELDS =
  'fullName username bio profession interests avatarUrl currentlyReading sideProject exploring visibility createdAt';

const findAuthor = async (username) => {
  const u = String(username || '').toLowerCase();
  if (!USERNAME_RE.test(u)) return null;
  return User.findOne({ username: u }).select(FIELDS).lean();
};

// only these fields ever leave the server
const toPublicUser = (u) => ({
  fullName: u.fullName,
  username: u.username,
  bio: u.bio || '',
  profession: u.profession || '',
  interests: u.interests || [],
  avatarUrl: u.avatarUrl || '',
  currentlyReading: u.currentlyReading || '',
  sideProject: u.sideProject || '',
  exploring: u.exploring || '',
  createdAt: u.createdAt || u._id.getTimestamp(),
});

// journals shown publicly are standalone ones; diary and challenge entries live inside their own page
const publicJournalFilter = (userId) => ({
  user: userId,
  visibility: 'public',
  challenge: null,
  diary: null,
});

export const getAuthorProfile = async (req, res) => {
  try {
    const author = await findAuthor(req.params.username);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    if (author.visibility === 'private') {
      return res.status(403).json({ message: 'This profile is private', private: true });
    }

    const [blogs, journals, diaries] = await Promise.all([
      Blog.countDocuments({ user: author._id, visibility: 'public' }),
      Journal.countDocuments(publicJournalFilter(author._id)),
      Diary.countDocuments({ user: author._id, visibility: 'public' }),
    ]);

    res.json({ user: toPublicUser(author), counts: { blogs, journals, diaries } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load profile' });
  }
};

export const getAuthorItems = async (req, res) => {
  try {
    const author = await findAuthor(req.params.username);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    if (author.visibility === 'private') {
      return res.status(403).json({ message: 'This profile is private', private: true });
    }

    const { type } = req.query;
    let items;

    if (type === 'blogs') {
      items = await Blog.find({ user: author._id, visibility: 'public' })
        .select('-content')
        .sort({ createdAt: -1 })
        .limit(LIMIT)
        .lean();
    } else if (type === 'journals') {
      items = await Journal.find(publicJournalFilter(author._id))
        .select('-content')
        .sort({ entryDate: -1, createdAt: -1 })
        .limit(LIMIT)
        .lean();
    } else if (type === 'diaries') {
      const diaries = await Diary.find({ user: author._id, visibility: 'public' })
        .sort({ createdAt: -1 })
        .limit(LIMIT)
        .lean();

      const stats = await Journal.aggregate([
        { $match: { diary: { $in: diaries.map((d) => d._id) }, visibility: 'public' } },
        { $group: { _id: '$diary', count: { $sum: 1 }, lastEntry: { $max: '$entryDate' } } },
      ]);
      const map = Object.fromEntries(stats.map((s) => [String(s._id), s]));

      items = diaries.map((d) => ({
        ...d,
        entryCount: map[String(d._id)]?.count || 0,
        lastEntry: map[String(d._id)]?.lastEntry || null,
      }));
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load items' });
  }
};




/* ---------------- feed and reading pages ---------------- */

const PAGE_SIZE = 12;
const POPULATE_FIELDS = 'fullName username visibility';
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const notFound = (res) => res.status(404).json({ message: 'Not found' });

const authorOf = (u) =>
  u && u.username
    ? { name: u.fullName, username: u.username, linkable: u.visibility !== 'private' }
    : null;

// bio only leaves the server for authors whose profile is public
const shapeAuthor = (u) => {
  const linkable = u.visibility !== 'private';
  return { name: u.fullName, username: u.username, bio: linkable ? u.bio || '' : '', linkable };
};

const loadAuthor = (userId) => User.findById(userId).select('fullName username bio visibility').lean();

const toItem = (kind, d, extra = {}) => ({
  kind,
  _id: d._id,
  title: d.title,
  excerpt: kind === 'diary' ? d.description : d.excerpt,
  date: kind === 'journal' ? d.entryDate : d.createdAt,
  sortAt: d.createdAt,
  readTime: d.readTime || null,
  icon: d.icon,
  cover: d.cover,
  coverImage: kind === 'blog' ? d.coverImage || '' : '',
  ...extra,
  author: authorOf(d.user),
});

export const getFeed = async (req, res) => {
  try {
    const type = ['blogs', 'journals', 'diaries'].includes(req.query.type) ? req.query.type : 'all';
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || PAGE_SIZE, 1), 24);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const take = page * limit;
    const q = String(req.query.q || '').trim().slice(0, 60);

    // search matches titles, previews and people (only people with a public profile)
    let rx = null;
    let peopleIds = [];
    if (q) {
      rx = new RegExp(escapeRx(q), 'i');
      const people = await User.find({
        visibility: { $ne: 'private' },
        $or: [{ fullName: rx }, { username: rx }],
      })
        .select('_id')
        .limit(50)
        .lean();
      peopleIds = people.map((p) => p._id);
    }
    const withSearch = (base, textField) =>
      rx ? { ...base, $or: [{ title: rx }, { [textField]: rx }, { user: { $in: peopleIds } }] } : base;

    const jobs = [];

    if (type === 'all' || type === 'blogs') {
      jobs.push(
        Blog.find(withSearch({ visibility: 'public' }, 'excerpt'))
          .select('-content')
          .sort({ createdAt: -1 })
          .limit(take + 1)
          .populate('user', POPULATE_FIELDS)
          .lean()
          .then((docs) => docs.map((d) => toItem('blog', d)))
      );
    }

    if (type === 'all' || type === 'journals') {
      jobs.push(
        Journal.find(withSearch({ visibility: 'public', challenge: null, diary: null }, 'excerpt'))
          .select('-content')
          .sort({ createdAt: -1 })
          .limit(take + 1)
          .populate('user', POPULATE_FIELDS)
          .lean()
          .then((docs) => docs.map((d) => toItem('journal', d)))
      );
    }

    if (type === 'all' || type === 'diaries') {
      jobs.push(
        (async () => {
          const diaries = await Diary.find(withSearch({ visibility: 'public' }, 'description'))
            .sort({ createdAt: -1 })
            .limit(take + 1)
            .populate('user', POPULATE_FIELDS)
            .lean();

          const stats = await Journal.aggregate([
            { $match: { diary: { $in: diaries.map((d) => d._id) }, visibility: 'public' } },
            { $group: { _id: '$diary', count: { $sum: 1 }, lastEntry: { $max: '$entryDate' } } },
          ]);
          const map = Object.fromEntries(stats.map((s) => [String(s._id), s]));

          // a diary appears in the feed only once it has a public entry
          return diaries
            .filter((d) => map[String(d._id)])
            .map((d) => {
              const s = map[String(d._id)];
              return toItem('diary', d, { entryCount: s.count, date: s.lastEntry || d.createdAt });
            });
        })()
      );
    }

    const merged = (await Promise.all(jobs))
      .flat()
      .filter((i) => i.author)
      .sort((a, b) => new Date(b.sortAt) - new Date(a.sortAt));

    res.json({ items: merged.slice(take - limit, take), hasMore: merged.length > take });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load stories' });
  }
};

export const getPublicBlog = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const blog = await Blog.findOne({ _id: req.params.id, visibility: 'public' }).lean();
    if (!blog) return notFound(res);
    const author = await loadAuthor(blog.user);
    if (!author) return notFound(res);

    res.json({
      article: {
        kind: 'blog',
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        date: blog.createdAt,
        readTime: blog.readTime,
        coverImage: blog.coverImage || '',
      },
      author: shapeAuthor(author),
      diary: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load story' });
  }
};

export const getPublicJournal = async (req, res) => {
  try {
    console.log(req.params.id)
    console.log('in getProfileJournal')
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const journal = await Journal.findOne({
      _id: req.params.id,
      visibility: 'public',
      challenge: null,
      diary: null,
    }).lean();
    if (!journal) return notFound(res);
    const author = await loadAuthor(journal.user);
    if (!author) return notFound(res);

    res.json({
      article: {
        kind: 'journal',
        _id: journal._id,
        title: journal.title,
        content: journal.content,
        date: journal.entryDate,
        readTime: null,
      },
      author: shapeAuthor(author),
      diary: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load story' });
  }
};

// export const getPublicBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return notFound(res);

//     const blog = await Blog.findById(id).lean();
//     if (!blog) {
//       const isJournal = await Journal.exists({ _id: id });
//       console.log(
//         `[public blog ${id}] ${isJournal ? 'this id belongs to a JOURNAL, the link was built with the wrong type' : 'no blog with this id (wrong database?)'}`
//       );
//       return notFound(res);
//     }
//     if (blog.visibility !== 'public') {
//       console.log(`[public blog ${id}] blog is ${blog.visibility}, not public`);
//       return notFound(res);
//     }
//     const author = await loadAuthor(blog.user);
//     if (!author) {
//       console.log(`[public blog ${id}] author ${blog.user} does not exist`);
//       return notFound(res);
//     }

//     res.json({
//       article: {
//         kind: 'blog',
//         _id: blog._id,
//         title: blog.title,
//         content: blog.content,
//         date: blog.createdAt,
//         readTime: blog.readTime,
//       },
//       author: shapeAuthor(author),
//       diary: null,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Could not load story' });
//   }
// };

// export const getPublicJournal = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return notFound(res);

//     const journal = await Journal.findById(id).lean();
//     if (!journal) {
//       const isBlog = await Blog.exists({ _id: id });
//       console.log(
//         `[public journal ${id}] ${isBlog ? 'this id belongs to a BLOG, the link was built with the wrong type' : 'no journal with this id (wrong database?)'}`
//       );
//       return notFound(res);
//     }
//     if (journal.visibility !== 'public') {
//       console.log(`[public journal ${id}] journal is ${journal.visibility}, not public`);
//       return notFound(res);
//     }
//     if (journal.challenge || journal.diary) {
//       console.log(`[public journal ${id}] belongs to a ${journal.challenge ? 'challenge' : 'diary'}, so it is not a standalone journal`);
//       return notFound(res);
//     }
//     const author = await loadAuthor(journal.user);
//     if (!author) {
//       console.log(`[public journal ${id}] author ${journal.user} does not exist`);
//       return notFound(res);
//     }

//     res.json({
//       article: {
//         kind: 'journal',
//         _id: journal._id,
//         title: journal.title,
//         content: journal.content,
//         date: journal.entryDate,
//         readTime: null,
//       },
//       author: shapeAuthor(author),
//       diary: null,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Could not load story' });
//   }
// };

export const getPublicDiary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const diary = await Diary.findOne({ _id: req.params.id, visibility: 'public' }).lean();
    if (!diary) return notFound(res);

    const [author, entries] = await Promise.all([
      loadAuthor(diary.user),
      Journal.find({ diary: diary._id, visibility: 'public' })
        .select('-content')
        .sort({ entryDate: -1, createdAt: -1 })
        .lean(),
    ]);
    if (!author) return notFound(res);

    res.json({
      diary: {
        _id: diary._id,
        title: diary.title,
        description: diary.description,
        icon: diary.icon,
        cover: diary.cover,
      },
      entries: entries.map((e) => ({ _id: e._id, title: e.title, excerpt: e.excerpt, entryDate: e.entryDate })),
      author: shapeAuthor(author),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load diary' });
  }
};

export const getPublicDiaryEntry = async (req, res) => {
  try {
    const { id, entryId } = req.params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(entryId)) return notFound(res);

    // both the diary and the entry must be public
    const diary = await Diary.findOne({ _id: id, visibility: 'public' }).lean();
    if (!diary) return notFound(res);
    const entry = await Journal.findOne({ _id: entryId, diary: diary._id, visibility: 'public' }).lean();
    if (!entry) return notFound(res);
    const author = await loadAuthor(diary.user);
    if (!author) return notFound(res);

    res.json({
      article: {
        kind: 'entry',
        _id: entry._id,
        title: entry.title,
        content: entry.content,
        date: entry.entryDate,
        readTime: null,
      },
      author: shapeAuthor(author),
      diary: { _id: diary._id, title: diary.title, icon: diary.icon },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load entry' });
  }
};