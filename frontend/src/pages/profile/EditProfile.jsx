import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../services/profileService';
import ProfileStep from '../../components/onboarding/ProfileStep';
import InterestsStep from '../../components/onboarding/InterestsStep';
import PreferencesStep from '../../components/onboarding/PreferencesStep';
import Field, { inputCls } from '../../components/onboarding/Field';

const toForm = (u) => ({
  fullName: u.fullName || u.name || '',
  username: u.username || '',
  profession: u.profession || '',
  bio: u.bio || '',
  visibility: u.visibility || 'public',
  interests: u.interests || [],
  currentlyReading: u.currentlyReading || '',
  sideProject: u.sideProject || '',
  exploring: u.exploring || '',
  defaultEntryVisibility: u.preferences?.defaultEntryVisibility || 'private',
  weeklyGoal: u.preferences?.weeklyGoal || 3,
});

const Card = ({ title, children }) => (
  <section className="rounded-2xl border border-white/10 bg-[#141414] p-6">
    <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/50">{title}</h3>
    {children}
  </section>
);

export default function EditProfile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState({ state: 'idle', message: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // always load the saved profile from the server, not the app's in-memory copy
  useEffect(() => {
    getMyProfile()
      .then((u) => setForm(toForm(u)))
      .catch(() => setLoadError('Could not load your profile.'));
  }, []);

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  };

  if (loadError) return <p className="text-sm text-red-400">{loadError}</p>;
  if (!form) return <p className="text-sm text-white/40">Loading…</p>;

  const canSave = form.fullName.trim() && usernameStatus.state === 'ok' && !saving;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await updateMyProfile({
        fullName: form.fullName,
        username: form.username,
        profession: form.profession,
        bio: form.bio,
        visibility: form.visibility,
        interests: form.interests,
        currentlyReading: form.currentlyReading,
        sideProject: form.sideProject,
        exploring: form.exploring,
        preferences: {
          defaultEntryVisibility: form.defaultEntryVisibility,
          weeklyGoal: form.weeklyGoal,
        },
      });
      setUser(updated);
      setSaved(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not save your profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit profile</h2>
          <p className="text-xs text-white/40">This is what others see on your public profile.</p>
        </div>
        <Link to="/profile" className="text-sm text-white/50 transition hover:text-white">
          ← Back to profile
        </Link>
      </div>

      <Card title="Basics">
        <ProfileStep
          form={form}
          update={update}
          usernameStatus={usernameStatus}
          setUsernameStatus={setUsernameStatus}
        />
        <p className="mt-4 text-xs text-white/30">
          Changing your username changes your public profile link, so old links to it stop working.
        </p>
      </Card>

      <Card title="Interests">
        <InterestsStep form={form} update={update} />
      </Card>

      <Card title="About">
        <div className="space-y-5">
          <Field label="Currently reading">
            <input
              className={inputCls}
              value={form.currentlyReading}
              onChange={(e) => update({ currentlyReading: e.target.value })}
              placeholder="The Creative Act"
              maxLength={80}
            />
          </Field>
          <Field label="Side project">
            <input
              className={inputCls}
              value={form.sideProject}
              onChange={(e) => update({ sideProject: e.target.value })}
              placeholder="A small toolkit for calmer teams"
              maxLength={80}
            />
          </Field>
          <Field label="Exploring">
            <input
              className={inputCls}
              value={form.exploring}
              onChange={(e) => update({ exploring: e.target.value })}
              placeholder="Writing systems, visual storytelling"
              maxLength={120}
            />
          </Field>
        </div>
      </Card>

      <Card title="Writing preferences">
        <PreferencesStep form={form} update={update} />
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved ✓</span>}
      </div>
    </div>
  );
}