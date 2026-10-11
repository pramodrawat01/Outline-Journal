import User from '../models/User.js';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const RESERVED = [
  'admin', 'api', 'app', 'blog', 'login', 'signup', 'onboarding',
  'settings', 'u', 'explore', 'about', 'docs', 'outline',
];

const sanitize = (user) => {
  const { password, ...rest } = user.toObject ? user.toObject() : user;
  return rest;
};
// then: res.json({ user: sanitize(user) });

const str = (v, max) => String(v ?? '').trim().slice(0, max);

export const checkUsername = async (req, res) => {
  const u = str(req.query.u, 20).toLowerCase();
  if (!USERNAME_RE.test(u)) {
    return res.json({ available: false, reason: '3–20 characters: letters, numbers, underscore' });
  }
  if (RESERVED.includes(u)) {
    return res.json({ available: false, reason: 'That username is reserved' });
  }
  const taken = await User.exists({ username: u, _id: { $ne: req.user._id } });
  res.json({ available: !taken, reason: taken ? 'Already taken' : '' });
};

export const saveOnboarding = async (req, res) => {
  try {
    const { step, data = {}, finish = false } = req.body;
    const update = {};

    if (step === 1) {
      const fullName = str(data.fullName, 60);
      const username = str(data.username, 20).toLowerCase();
      if (!fullName) return res.status(400).json({ message: 'Full name is required' });
      if (!USERNAME_RE.test(username) || RESERVED.includes(username)) {
        return res.status(400).json({ message: 'Invalid username' });
      }
      Object.assign(update, {
        fullName,
        username,
        profession: str(data.profession, 80),
        bio: str(data.bio, 280),
        visibility: data.visibility === 'private' ? 'private' : 'public',
      });
    } else if (step === 2) {
      if (Array.isArray(data.interests)) {
        update.interests = [...new Set(data.interests.map((i) => str(i, 30)).filter(Boolean))].slice(0, 8);
      }
    } else if (step === 3) {
      const p = data.preferences || {};
      if (p.defaultEntryVisibility) {
        update['preferences.defaultEntryVisibility'] =
          p.defaultEntryVisibility === 'public' ? 'public' : 'private';
      }
      const goal = Number(p.weeklyGoal);
      if (Number.isInteger(goal) && goal >= 1 && goal <= 7) {
        update['preferences.weeklyGoal'] = goal;
      }
    } else {
      return res.status(400).json({ message: 'Invalid step' });
    }

    if (finish) {
      const hasUsername = update.username || (await User.findById(req.user._id).select('username'))?.username;
      if (!hasUsername) return res.status(400).json({ message: 'Complete the profile step first' });
      update.onboardingCompleted = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update, $max: { onboardingStep: Math.min(step + 1, 3) } },
      { returnDocument: "after", runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username already taken' });
    console.error(err);
    res.status(500).json({ message: 'Could not save profile' });
  }
};



export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load profile' });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const b = req.body;

    const fullName = str(b.fullName, 60);
    const username = str(b.username, 20).toLowerCase();
    if (!fullName) return res.status(400).json({ message: 'Full name is required' });
    if (!USERNAME_RE.test(username) || RESERVED.includes(username)) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const update = {
      fullName,
      username,
      profession: str(b.profession, 80),
      bio: str(b.bio, 280),
      visibility: b.visibility === 'private' ? 'private' : 'public',
      currentlyReading: str(b.currentlyReading, 80),
      sideProject: str(b.sideProject, 80),
      exploring: str(b.exploring, 120),
    };

    if (Array.isArray(b.interests)) {
      update.interests = [...new Set(b.interests.map((i) => str(i, 30)).filter(Boolean))].slice(0, 8);
    }

    const p = b.preferences || {};
    if (p.defaultEntryVisibility) {
      update['preferences.defaultEntryVisibility'] = p.defaultEntryVisibility === 'public' ? 'public' : 'private';
    }
    const goal = Number(p.weeklyGoal);
    if (Number.isInteger(goal) && goal >= 1 && goal <= 7) update['preferences.weeklyGoal'] = goal;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username already taken' });
    console.error(err);
    res.status(500).json({ message: 'Could not save your profile' });
  }
};