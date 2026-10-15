import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Field, { inputCls } from '../onboarding/Field';
import Segmented from '../onboarding/Segmented';
import { createTracker, updateTracker } from '../../services/trackerService';
import { fmtDate, todayStr } from '../../utils/challengeUtils';

const MAX_HABITS = 8;

export default function TrackerFormModal({ tracker, onClose, onSaved }) {
  const isEdit = Boolean(tracker);
  const counter = useRef(0);
  const newKey = () => `n${(counter.current += 1)}`;

  const [title, setTitle] = useState(tracker?.title || '');
  const [startDate, setStartDate] = useState(todayStr());
  const [useRating, setUseRating] = useState(tracker?.useRating ?? true);
  const [habits, setHabits] = useState(() =>
    tracker
      ? tracker.habits.map((h) => ({ key: h._id, _id: h._id, label: h.label }))
      : [{ key: newKey(), label: '' }, { key: newKey(), label: '' }, { key: newKey(), label: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setLabel = (key, label) =>
    setHabits((hs) => hs.map((h) => (h.key === key ? { ...h, label } : h)));
  const removeHabit = (key) => setHabits((hs) => hs.filter((h) => h.key !== key));
  const addHabit = () =>
    setHabits((hs) => (hs.length >= MAX_HABITS ? hs : [...hs, { key: newKey(), label: '' }]));

  const filled = habits.filter((h) => h.label.trim());
  const canSubmit = title.trim() && filled.length > 0 && !saving;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    const habitPayload = filled.map((h) => (h._id ? { _id: h._id, label: h.label } : { label: h.label }));
    try {
      const saved = isEdit
        ? await updateTracker(tracker._id, { title, useRating, habits: habitPayload })
        : await createTracker({ title, useRating, habits: habitPayload, startDate }, todayStr());
      onSaved(saved);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative my-auto w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-[#111511] p-8 text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 transition-colors hover:text-white"
        >
          <FaTimes size={16} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit tracker' : 'New tracker'}</h2>
          <p className="mt-1 text-sm text-gray-400">The things you want to tick off every night.</p>
        </div>

        <Field label="Name">
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job search"
            maxLength={60}
            autoFocus
          />
        </Field>

        <Field
          label={`Habits (${habits.length}/${MAX_HABITS})`}
          hint={isEdit ? 'Removed habits are hidden, but their past ticks are kept.' : undefined}
        >
          <div className="space-y-2">
            {habits.map((h, i) => (
              <div key={h.key} className="flex items-center gap-2">
                <input
                  className={inputCls}
                  value={h.label}
                  onChange={(e) => setLabel(h.key, e.target.value)}
                  placeholder={['Job application submitted', 'Honest effort', 'Positive approach'][i] || 'Habit'}
                  maxLength={60}
                />
                <button
                  type="button"
                  onClick={() => removeHabit(h.key)}
                  aria-label="Remove habit"
                  className="shrink-0 p-2 text-white/30 transition hover:text-red-400"
                >
                  <FaTimes size={13} />
                </button>
              </div>
            ))}
          </div>
          {habits.length < MAX_HABITS && (
            <button
              type="button"
              onClick={addHabit}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 transition hover:text-emerald-300"
            >
              <FaPlus size={10} /> Add habit
            </button>
          )}
        </Field>

        <Field label="Rate each day (Good, Better, Best)">
          <Segmented
            value={useRating ? 'yes' : 'no'}
            onChange={(v) => setUseRating(v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Field>

        {isEdit ? (
          <p className="text-xs text-white/40">Started {fmtDate(tracker.startDate)}</p>
        ) : (
          <Field label="Start date" hint="Pick an earlier date if you want to fill in days you already tracked.">
            <input
              type="date"
              className={`${inputCls} [color-scheme:dark]`}
              value={startDate}
              max={todayStr()}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
        )}

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
            disabled={!canSubmit || (!isEdit && !startDate)}
            className="flex-1 rounded-full bg-emerald-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create tracker'}
          </button>
        </div>
      </motion.form>
    </div>,
    document.body
  );
}