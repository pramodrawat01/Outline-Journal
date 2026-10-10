import mongoose from 'mongoose';
import Diary from '../models/Diary.js';
import Journal from '../models/Journal.js';

const COVERS = ['emerald', 'ocean', 'sunset', 'violet', 'slate'];
const notFound = (res) => res.status(404).json({ message: 'Diary not found' });

const parseBody = (b) => {
  const title = String(b.title ?? '').trim().slice(0, 60);
  if (!title) return { error: 'A title is required' };
  return {
    data: {
      title,
      description: String(b.description ?? '').trim().slice(0, 200),
      icon: String(b.icon || '📓').slice(0, 8),
      cover: COVERS.includes(b.cover) ? b.cover : 'emerald',
      visibility: b.visibility === 'public' ? 'public' : 'private',
    },
  };
};

export const listDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    const stats = await Journal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          diary: { $in: diaries.map((n) => n._id) },
        },
      },
      { $group: { _id: '$diary', count: { $sum: 1 }, lastEntry: { $max: '$entryDate' } } },
    ]);
    const map = Object.fromEntries(stats.map((s) => [String(s._id), s]));

    res.json({
      diaries: diaries.map((n) => ({
        ...n,
        entryCount: map[String(n._id)]?.count || 0,
        lastEntry: map[String(n._id)]?.lastEntry || null,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load diaries' });
  }
};

export const getDiary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const diary = await Diary.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!diary) return notFound(res);

    const entries = await Journal.find({ diary: diary._id, user: req.user._id })
      .select('-content')
      .sort({ entryDate: -1, createdAt: -1 })
      .lean();

    res.json({ diary, entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load diary' });
  }
};

export const createDiary = async (req, res) => {
  try {
    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ message: error });

    const diary = await Diary.create({ ...data, user: req.user._id });
    res.status(201).json({ diary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create diary' });
  }
};

export const updateDiary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ message: error });

    const diary = await Diary.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: data },
      { new: true }
    );
    if (!diary) return notFound(res);

    // a private diary can only hold private entries
    if (data.visibility === 'private') {
      await Journal.updateMany({ diary: diary._id, user: req.user._id }, { $set: { visibility: 'private' } });
    }

    res.json({ diary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update diary' });
  }
};

export const deleteDiary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const deleted = await Diary.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return notFound(res);

    await Journal.deleteMany({ diary: deleted._id, user: req.user._id });
    res.json({ message: 'Diary deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete diary' });
  }
};