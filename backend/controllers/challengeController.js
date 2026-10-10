import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import Journal from '../models/Journal.js';
import { isValidDate, totalDays } from '../utils/dates.js';

const COVERS = ['emerald', 'ocean', 'sunset', 'violet', 'slate'];
const MAX_DAYS = 366;

export const createChallenge = async (req, res) => {
  try {
    const { title, description = '', startDate, endDate, visibility, cover } = req.body;

    const t = String(title ?? '').trim();
    if (!t) return res.status(400).json({ message: 'Title is required' });
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date must be on or after the start date' });
    }
    if (totalDays(startDate, endDate) > MAX_DAYS) {
      return res.status(400).json({ message: 'A challenge can run for at most one year' });
    }

    const challenge = await Challenge.create({
      user: req.user._id,
      title: t.slice(0, 80),
      description: String(description).trim().slice(0, 300),
      startDate,
      endDate,
      visibility: visibility === 'public' ? 'public' : 'private',
      cover: COVERS.includes(cover) ? cover : 'emerald',
    });

    res.status(201).json({ challenge: { ...challenge.toObject(), journalCount: 0 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create challenge' });
  }
};

export const listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    const counts = await Journal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          challenge: { $in: challenges.map((c) => c._id) },
        },
      },
      { $group: { _id: '$challenge', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    res.json({
      challenges: challenges.map((c) => ({ ...c, journalCount: countMap[String(c._id)] || 0 })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load challenges' });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Challenge not found' });

    const deleted = await Challenge.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Challenge not found' });

    await Journal.deleteMany({ challenge: id, user: req.user._id });
    res.json({ message: 'Challenge deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete challenge' });
  }
};