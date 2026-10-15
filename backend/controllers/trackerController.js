import mongoose from 'mongoose';
import Tracker from '../models/Tracker.js';
import TrackerDay from '../models/TrackerDay.js';
import { isValidDate, totalDays, addDays } from '../utils/dates.js';

const MAX_HABITS = 8;
const RATINGS = ['good', 'better', 'best'];

const notFound = (res) => res.status(404).json({ message: 'Tracker not found' });
const utcToday = () => new Date().toISOString().slice(0, 10);
const todayFrom = (q) => (isValidDate(q) ? q : utcToday());
// the user's local date can be one day ahead of UTC
const latestAllowedDate = () => addDays(utcToday(), 1);

// active habits only leave the server
const shape = (t) => ({ ...t, habits: t.habits.filter((h) => !h.archived) });

const cleanHabitItems = (raw) => {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const h of raw) {
    const label = String(typeof h === 'string' ? h : h?.label ?? '').trim().slice(0, 60);
    if (!label || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    out.push({
      _id: typeof h === 'object' && mongoose.isValidObjectId(h?._id) ? String(h._id) : null,
      label,
    });
  }
  return out.slice(0, MAX_HABITS);
};

// streak = consecutive days with at least one tick; weekPct = ticks / possible ticks over the last 7 days
const buildSummary = (tracker, days, today) => {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const activeIds = new Set(tracker.habits.filter((h) => !h.archived).map((h) => String(h._id)));
  const ticks = (d) => (d ? d.done.filter((id) => activeIds.has(String(id))).length : 0);

  let streak = 0;
  let cursor = byDate.get(today)?.done.length ? today : addDays(today, -1);
  while (byDate.get(cursor)?.done.length) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  let weekTicks = 0;
  let weekPossible = 0;
  const weekStart = tracker.startDate > addDays(today, -6) ? tracker.startDate : addDays(today, -6);
  if (weekStart <= today) {
    const span = totalDays(weekStart, today);
    weekPossible = span * activeIds.size;
    for (let i = 0; i < span; i += 1) weekTicks += ticks(byDate.get(addDays(weekStart, i)));
  }

  const t = byDate.get(today);
  return {
    today: t ? { done: t.done, rating: t.rating } : null,
    streak,
    weekPct: weekPossible ? Math.round((weekTicks / weekPossible) * 100) : 0,
    daysLogged: days.filter((d) => d.done.length > 0).length,
  };
};

export const listTrackers = async (req, res) => {
  try {
    const today = todayFrom(req.query.today);
    const trackers = await Tracker.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    const days = trackers.length
      ? await TrackerDay.find({ tracker: { $in: trackers.map((t) => t._id) } })
          .select('tracker date done rating')
          .lean()
      : [];
    const byTracker = {};
    days.forEach((d) => (byTracker[String(d.tracker)] ||= []).push(d));

    res.json({
      trackers: trackers.map((t) => ({
        ...shape(t),
        summary: buildSummary(t, byTracker[String(t._id)] || [], today),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load trackers' });
  }
};

export const getTracker = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const today = todayFrom(req.query.today);

    const tracker = await Tracker.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!tracker) return notFound(res);

    const days = await TrackerDay.find({ tracker: tracker._id })
      .select('date done rating')
      .sort({ date: -1 })
      .lean();

    res.json({
      tracker: shape(tracker),
      days: days.map((d) => ({ date: d.date, done: d.done, rating: d.rating })),
      summary: buildSummary(tracker, days, today),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load tracker' });
  }
};

export const createTracker = async (req, res) => {
  try {
    const title = String(req.body.title ?? '').trim().slice(0, 60);
    if (!title) return res.status(400).json({ message: 'A title is required' });

    const items = cleanHabitItems(req.body.habits);
    if (items.length === 0) return res.status(400).json({ message: 'Add at least one habit' });

    const { startDate } = req.body;
    if (!isValidDate(startDate) || startDate > latestAllowedDate()) {
      return res.status(400).json({ message: 'Pick a valid start date' });
    }

    const tracker = await Tracker.create({
      user: req.user._id,
      title,
      startDate,
      useRating: req.body.useRating !== false,
      habits: items.map((i) => ({ label: i.label })),
    });

    const plain = tracker.toObject();
    res.status(201).json({
      tracker: { ...shape(plain), summary: buildSummary(plain, [], todayFrom(req.query.today)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create tracker' });
  }
};

export const updateTracker = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const title = String(req.body.title ?? '').trim().slice(0, 60);
    if (!title) return res.status(400).json({ message: 'A title is required' });

    const items = cleanHabitItems(req.body.habits);
    if (items.length === 0) return res.status(400).json({ message: 'Keep at least one habit' });

    const tracker = await Tracker.findOne({ _id: req.params.id, user: req.user._id });
    if (!tracker) return notFound(res);

    // habits left out of the list are archived, never deleted, so past ticks survive
    const keep = new Set(items.filter((i) => i._id).map((i) => i._id));
    tracker.habits.forEach((h) => {
      if (!keep.has(String(h._id))) h.archived = true;
    });
    for (const item of items) {
      const existing = item._id ? tracker.habits.id(item._id) : null;
      if (existing) {
        existing.label = item.label;
        existing.archived = false;
      } else {
        tracker.habits.push({ label: item.label });
      }
    }

    tracker.title = title;
    tracker.useRating = req.body.useRating !== false;
    await tracker.save();

    res.json({ tracker: shape(tracker.toObject()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save tracker' });
  }
};

export const deleteTracker = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const deleted = await Tracker.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return notFound(res);

    await TrackerDay.deleteMany({ tracker: deleted._id });
    res.json({ message: 'Tracker deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete tracker' });
  }
};

export const saveDay = async (req, res) => {
  try {
    const { id, date } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);
    if (!isValidDate(date)) return res.status(400).json({ message: 'Invalid date' });

    const tracker = await Tracker.findOne({ _id: id, user: req.user._id }).lean();
    if (!tracker) return notFound(res);

    if (date < tracker.startDate) {
      return res.status(400).json({ message: 'That day is before this tracker started' });
    }
    if (date > latestAllowedDate()) {
      return res.status(400).json({ message: 'You cannot log a future day' });
    }

    const valid = new Set(tracker.habits.filter((h) => !h.archived).map((h) => String(h._id)));
    const done = [
      ...new Set((Array.isArray(req.body.done) ? req.body.done : []).map(String).filter((x) => valid.has(x))),
    ];
    const rating = tracker.useRating && RATINGS.includes(req.body.rating) ? req.body.rating : '';

    let day = null;
    if (done.length === 0 && !rating) {
      // nothing ticked: the day goes back to blank
      await TrackerDay.deleteOne({ tracker: tracker._id, date });
    } else {
      const saved = await TrackerDay.findOneAndUpdate(
        { tracker: tracker._id, date },
        { $set: { user: req.user._id, done, rating } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      day = { date: saved.date, done: saved.done, rating: saved.rating };
    }

    const days = await TrackerDay.find({ tracker: tracker._id }).select('date done rating').lean();
    res.json({ day, summary: buildSummary(tracker, days, todayFrom(req.query.today)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save this day' });
  }
};