import Journal from '../models/Journal.js';
import Blog from '../models/Blog.js';
import TrackerDay from '../models/TrackerDay.js';
import { isValidDate, addDays } from '../utils/dates.js';

export const getOverview = async (req, res) => {
  try {
    const today = isValidDate(req.query.today) ? req.query.today : new Date().toISOString().slice(0, 10);
    const from = addDays(today, -29);
    const user = req.user._id;

    const [journals, days, blogsPublished, recentBlogs, recentJournals] = await Promise.all([
      Journal.find({ user, entryDate: { $gte: from, $lte: today } }).select('entryDate').lean(),
      TrackerDay.find({ user, date: { $gte: from, $lte: today } }).select('date done').lean(),
      Blog.countDocuments({ user, createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } }),
      Blog.find({ user }).select('title createdAt visibility').sort({ createdAt: -1 }).limit(3).lean(),
      Journal.find({ user })
        .select('title entryDate createdAt visibility challenge diary')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
    ]);

    // a day lights up for each journal written plus each tracker ticked that day
    // const counts = {};
    // journals.forEach((j) => {
    //   counts[j.entryDate] = (counts[j.entryDate] || 0) + 1;
    // });
    // days.forEach((d) => {
    //   if (d.done.length) counts[d.date] = (counts[d.date] || 0) + 1;
    // });
    // const activity = Array.from({ length: 30 }, (_, i) => Math.min(3, counts[addDays(from, i)] || 0));

    // per day: journals written and habit ticks
    const journalsByDay = {};
    journals.forEach((j) => {
      journalsByDay[j.entryDate] = (journalsByDay[j.entryDate] || 0) + 1;
    });
    const habitsByDay = {};
    days.forEach((d) => {
      habitsByDay[d.date] = (habitsByDay[d.date] || 0) + d.done.length;
    });
    const activity = Array.from({ length: 30 }, (_, i) => {
      const date = addDays(from, i);
      return { date, journals: journalsByDay[date] || 0, habits: habitsByDay[date] || 0 };
    });

    const recent = [
      ...recentBlogs.map((b) => ({
        kind: 'blog',
        _id: b._id,
        title: b.title,
        date: b.createdAt,
        sortAt: b.createdAt,
        visibility: b.visibility,
        to: `/profile/blogs/${b._id}`,
      })),
      ...recentJournals.map((j) => ({
        kind: 'journal',
        _id: j._id,
        title: j.title,
        date: j.entryDate,
        sortAt: j.createdAt,
        visibility: j.visibility,
        to: j.challenge
          ? `/profile/challenges/${j.challenge}`
          : j.diary
            ? `/profile/diary/${j.diary}/entries/${j._id}`
            : `/profile/journal/${j._id}`,
      })),
    ]
      .sort((a, b) => new Date(b.sortAt) - new Date(a.sortAt))
      .slice(0, 3);

    res.json({
      stats: {
        journalEntries: journals.length,
        blogsPublished,
        habitCheckins: days.reduce((sum, d) => sum + d.done.length, 0),
      },
      activity,
      recent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load overview' });
  }
};