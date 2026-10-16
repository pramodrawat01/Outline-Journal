import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Field, { inputCls } from '../onboarding/Field';
import Segmented from '../onboarding/Segmented';
import { createChallenge } from '../../services/challengeService';
import { COVERS, addDays, swatchStyle, coverStyle, todayStr } from '../../utils/challengeUtils';

export default function CreateChallengeModal({ onClose, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => {
    const start = todayStr();
    return {
      title: '',
      startDate: start,
      endDate: addDays(start, 29),
      visibility: user?.preferences?.defaultEntryVisibility || 'private',
      cover: 'emerald',
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onStartChange = (value) =>
    update({ startDate: value, endDate: form.endDate < value ? value : form.endDate });

  const canSubmit = form.title.trim() && form.startDate && form.endDate && form.endDate >= form.startDate;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      const challenge = await createChallenge(form);
      onCreated(challenge);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create challenge. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-3 backdrop-blur-sm "
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-[#111511] px-3 py-6 md:p-8 text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 transition-colors hover:text-white"
        >
          <FaTimes size={16} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Start a challenge</h2>
          <p className="mt-1 text-sm text-gray-400">Pick a title and the days you want to commit to.</p>
        </div>

        <Field label="Title">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="30 days 30 websites"
            maxLength={80}
            autoFocus
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date">
            <input
              type="date"
              className={`${inputCls} [color-scheme:dark]`}
              value={form.startDate}
              onChange={(e) => onStartChange(e.target.value)}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              className={`${inputCls} [color-scheme:dark]`}
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => update({ endDate: e.target.value })}
            />
          </Field>
        </div>

        <Field
          label="Visibility"
          hint={
            form.visibility === 'public'
              ? 'Public challenges can be read by others (you can still hide single days).'
              : 'Only you can see this challenge and its journals.'
          }
        >
          <Segmented
            value={form.visibility}
            onChange={(visibility) => update({ visibility })}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'private', label: 'Private' },
            ]}
          />
        </Field>

        {/* <Field label="Cover">
          <div className="flex gap-3">
            {Object.keys(COVERS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => update({ cover: key })}
                aria-label={key}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  form.cover === key ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={swatchStyle(key)}
              />
            ))}
          </div>
        </Field> */}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || saving}
            className="flex-1 rounded-full bg-emerald-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Starting…' : 'Start challenge'}
          </button>
        </div>
      </motion.form>
    </div>,
    document.body
  );
}