import mongoose from 'mongoose';
import Journal from '../models/Journal.js';
import { isValidDate } from '../utils/dates.js';
import { makeExcerpt } from '../utils/excerpt.js';
import Diary from '../models/Diary.js';

// the server can't know the user's local "today", so allow up to one day ahead of UTC
const latestAllowedDate = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const mine = (req) => ({ user: req.user._id, challenge: null });

const parseBody = (body) => {
  const { title, content, entryDate, visibility } = body;
  if (!isValidDate(entryDate)) return { error: 'A valid date is required' };
  if (entryDate > latestAllowedDate()) return { error: 'You cannot write for a future date' };
  if (content != null && typeof content !== 'object') return { error: 'Invalid content' };
  return {
    data: {
      title: String(title ?? '').trim().slice(0, 120),
      content: content ?? null,
      excerpt: makeExcerpt(content),
      entryDate,
      visibility: visibility === 'public' ? 'public' : 'private',
    },
  };
};

const notFound = (res) => res.status(404).json({ message: 'Journal not found' });

export const listPersonalJournals = async (req, res) => {
  try {
    // const journals = await Journal.find(mine(req))
    // ?all=1 also includes challenge journals (used by My Profile)
  //  const filter = req.query.all === '1' ? { user: req.user._id } : mine(req);
  const filter = req.query.all === '1' ? { user: req.user._id } : { ...mine(req), diary: null };
    const journals = await Journal.find(filter)
      .select('-content')
      .sort({ entryDate: -1, createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ journals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load journals' });
  }
};

export const getPersonalJournal = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const journal = await Journal.findOne({ _id: req.params.id, ...mine(req) }).lean();
    if (!journal) return notFound(res);
    res.json({ journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load journal' });
  }
};

export const createPersonalJournal = async (req, res) => {
  try {
    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ message: error });

    //const journal = await Journal.create({ ...data, user: req.user._id, challenge: null });
    
 let diary = null;
    if (req.body.diary) {
      if (mongoose.isValidObjectId(req.body.diary)) {
        diary = await Diary.findOne({ _id: req.body.diary, user: req.user._id })
          .select('visibility')
          .lean();
      }
      if (!diary) return res.status(404).json({ message: 'Diary not found' });
      if (diary.visibility === 'private') data.visibility = 'private';
    }

    const journal = await Journal.create({
      ...data,
      user: req.user._id,
      challenge: null,
      diary: diary ? diary._id : null,
    });

    res.status(201).json({ journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save journal' });
  }
};

export const updatePersonalJournal = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ message: error });

    // const journal = await Journal.findOneAndUpdate(
    //   { _id: req.params.id, ...mine(req) },
    //   { $set: data },
    //   { new: true }
    // );
    // if (!journal) return notFound(res);
    const existing = await Journal.findOne({ _id: req.params.id, ...mine(req) }).select('diary').lean();
    if (!existing) return notFound(res);

    if (existing.diary) {
      const nb = await Diary.findById(existing.diary).select('visibility').lean();
      if (nb?.visibility === 'private') data.visibility = 'private';
    }

    const journal = await Journal.findOneAndUpdate({ _id: existing._id }, { $set: data }, { new: true })

    res.json({ journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save journal' });
  }
};

export const deletePersonalJournal = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const deleted = await Journal.findOneAndDelete({ _id: req.params.id, ...mine(req) });
    if (!deleted) return notFound(res);
    res.json({ message: 'Journal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete journal' });
  }
};