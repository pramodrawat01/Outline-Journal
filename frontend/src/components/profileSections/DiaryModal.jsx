import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Field, { inputCls } from '../onboarding/Field';
import Segmented from '../onboarding/Segmented';
import { createDiary, updateDiary } from '../../services/diaryService';
import { COVERS, coverStyle } from '../../utils/challengeUtils';

const ICONS = ['📓', '💪', '📚', '🌱', '✈️', '🎨', '💻', '🍳', '🏃', '🧘', '🎵', '💡'];

export default function DiaryModal({ diary, onClose, onSaved }) {
  const isEdit = Boolean(diary);
  const [form, setForm] = useState({
    icon: diary?.icon || '📓',
    title: diary?.title || '',
    description: diary?.description || '',
    cover: diary?.cover || 'emerald',
    visibility: diary?.visibility || 'private',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const saved = isEdit ? await updateDiary(diary._id, form) : await createDiary(form);
      onSaved(saved);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the diary. Try again.');
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 px-3 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative my-auto w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-[#111511] px-3 py-6 md:p-8 text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 transition-colors hover:text-white"
        >
          <FaTimes size={16} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit diary' : 'New diary'}</h2>
          <p className="mt-1 text-sm text-gray-400">A diary is one journal you add to every day.</p>
        </div>

        <Field label="Icon">
          <div className="flex flex-wrap gap-2">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => update({ icon })}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition ${
                  form.icon === icon
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Title">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Fitness journal"
            maxLength={60}
            autoFocus
          />
        </Field>

        <Field label="Description (optional)">
          <input
            className={inputCls}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Workouts, meals and how I feel"
            maxLength={200}
          />
        </Field>

        <Field label="Cover">
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
                style={coverStyle(key)}
              />
            ))}
          </div>
        </Field>

        <Field
          label="Visibility"
          hint={
            form.visibility === 'public'
              ? 'Entries can be public or private. Each one is your choice.'
              : 'Only you can see this diary and every entry in it.'
          }
        >
          <Segmented
            value={form.visibility}
            onChange={(visibility) => update({ visibility })}
            options={[
              { value: 'private', label: 'Private' },
              { value: 'public', label: 'Public' },
            ]}
          />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 md:py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title.trim() || saving}
            className="flex-1 rounded-full bg-emerald-500 py-2 md:py-2.5 text-sm font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create diary'}
          </button>
        </div>
      </motion.form>
    </div>,
    document.body
  );
}