import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import Journal from '../models/Journal.js';
import { isValidDate } from '../utils/dates.js';

// returns the challenge if it belongs to the user, otherwise sends a 404 and returns null
const loadChallenge = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Challenge not found' });
    return null;
  }
  const challenge = await Challenge.findOne({ _id: id, user: req.user._id }).lean();
  if (!challenge) res.status(404).json({ message: 'Challenge not found' });
  return challenge;
};

const textOf = (node) => {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  return Array.isArray(node.content) ? node.content.map(textOf).join(' ') : '';
};

export const listJournals = async (req, res) => {
  try {
    const challenge = await loadChallenge(req, res);
    if (!challenge) return;

    const journals = await Journal.find({ challenge: challenge._id, user: req.user._id })
      .select('-content')
      .sort({ entryDate: -1 })
      .lean();

    res.json({ challenge, journals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load journals' });
  }
};

export const getJournal = async (req, res) => {
  try {
    const challenge = await loadChallenge(req, res);
    if (!challenge) return;

    const { date } = req.params;
    if (!isValidDate(date)) return res.status(400).json({ message: 'Invalid date' });

    const journal = await Journal.findOne({
      challenge: challenge._id,
      user: req.user._id,
      entryDate: date,
    }).lean();

    res.json({ challenge, journal }); // journal is null if nothing written for that day yet
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load journal' });
  }
};

export const saveJournal = async (req, res) => {
  try {
    const challenge = await loadChallenge(req, res);
    if (!challenge) return;

    const { date } = req.params;
    if (!isValidDate(date)) return res.status(400).json({ message: 'Invalid date' });
    if (date < challenge.startDate || date > challenge.endDate) {
      return res.status(400).json({ message: 'That date is outside this challenge' });
    }

    const { title, content, visibility } = req.body;
    if (content != null && typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content' });
    }

    // a private challenge can only hold private journals
    const finalVisibility =
      challenge.visibility === 'private' ? 'private' : visibility === 'public' ? 'public' : 'private';

    const excerpt = textOf(content).replace(/\s+/g, ' ').trim().slice(0, 160);

    const journal = await Journal.findOneAndUpdate(
      { user: req.user._id, challenge: challenge._id, entryDate: date },
      {
        $set: {
          title: String(title ?? '').trim().slice(0, 120),
          content: content ?? null,
          excerpt,
          visibility: finalVisibility,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save journal' });
  }
};