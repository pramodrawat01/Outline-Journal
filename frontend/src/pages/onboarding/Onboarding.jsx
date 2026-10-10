import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { saveOnboarding } from '../../services/profileService';
import Stepper from '../../components/onboarding/Stepper';
import ProfilePreview from '../../components/onboarding/ProfilePreview';
import ProfileStep from '../../components/onboarding/ProfileStep';
import InterestsStep from '../../components/onboarding/InterestsStep';
import PreferencesStep from '../../components/onboarding/PreferencesStep';

const initialForm = (u) => ({
  fullName: u.fullName || u.name || '',
  username: u.username || '',
  profession: u.profession || '',
  bio: u.bio || '',
  visibility: u.visibility || 'public',
  interests: u.interests || [],
  defaultEntryVisibility: u.preferences?.defaultEntryVisibility || 'private',
  weeklyGoal: u.preferences?.weeklyGoal || 3,
});

const payloadFor = (step, f) => {
  if (step === 1)
    return { fullName: f.fullName, username: f.username, profession: f.profession, bio: f.bio, visibility: f.visibility };
  if (step === 2) return { interests: f.interests };
  return { preferences: { defaultEntryVisibility: f.defaultEntryVisibility, weeklyGoal: f.weeklyGoal } };
};

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(Math.min(Math.max(user.onboardingStep || 1, 1), 3));
  const [form, setForm] = useState(() => initialForm(user));
  const [usernameStatus, setUsernameStatus] = useState({ state: 'idle', message: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const canContinue =
    step === 1 ? form.fullName.trim() && usernameStatus.state === 'ok' : true;

  const submit = async ({ skip = false } = {}) => {
    setSaving(true);
    setError('');
    const finish = skip || step === 3;
    try {
      const { user: updated } = await saveOnboarding({
        step,
        data: skip ? {} : payloadFor(step, form),
        finish,
      });
      setUser(updated);
      if (finish) navigate('/profile', { replace: true });
      else setStep((s) => s + 1);
    } catch (e) {
        console.log('error : ', e)
      setError(e.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    // <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 lg:grid-cols-[320px_1fr]">
    //   <aside className="lg:sticky lg:top-6 lg:self-start">
    //     <ProfilePreview form={form} />
    //   </aside>

    //   <section className="space-y-4">

    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">

      <aside className="w-full min-w-0 lg:sticky lg:top-24 lg:self-start">
        <ProfilePreview form={form} />
      </aside>

      <section className="w-full min-w-0 space-y-4">

        <div className="rounded-2xl border border-white/10 bg-[#141414] px-6 py-5">
          <h1 className="text-2xl font-semibold">Make your outline</h1>
          <p className="mt-1 text-sm text-white/50">A few details help your journal feel like yours.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <Stepper current={step} />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <ProfileStep
                    form={form}
                    update={update}
                    usernameStatus={usernameStatus}
                    setUsernameStatus={setUsernameStatus}
                  />
                )}
                {step === 2 && <InterestsStep form={form} update={update} />}
                {step === 3 && <PreferencesStep form={form} update={update} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-white/50 hover:text-white"
              >
                Back
              </button>
            )}
            <button
              type="button"
              disabled={!canContinue || saving}
              onClick={() => submit()}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? 'Saving…' : step === 3 ? 'Finish' : 'Save and continue'}
            </button>
            {step > 1 && (
              <button
                type="button"
                disabled={saving}
                onClick={() => submit({ skip: true })}
                className="text-sm text-white/50 hover:text-white"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}