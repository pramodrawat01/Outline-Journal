import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Field, { inputCls } from '../onboarding/Field';
import Segmented from '../onboarding/Segmented';
import { fmtDate, todayStr } from '../../utils/challengeUtils';

export default function AddJournalModal({ challenge, journals, onClose }) {
  const navigate = useNavigate();
  const today = todayStr();
  const maxDate = today < challenge.endDate ? today : challenge.endDate;

  const [date, setDate] = useState(maxDate);
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(challenge.visibility === 'public' ? 'public' : 'private');

  const isPrivateChallenge = challenge.visibility === 'private';
  const existing = journals.find((j) => j.entryDate === date);
  const validDate = date >= challenge.startDate && date <= maxDate;

  const submit = (e) => {
    e.preventDefault();
    if (!validDate) return;
    navigate(`/profile/challenges/${challenge._id}/write/${date}`, {
      state: existing ? undefined : { title: title.trim(), visibility },
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-[#111511] p-8 text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 transition-colors hover:text-white"
        >
          <FaTimes size={16} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Add journal</h2>
          <p className="mt-1 text-sm text-gray-400">Pick the day you're writing for.</p>
        </div>

        <Field label="Date">
          <input
            type="date"
            className={`${inputCls} [color-scheme:dark]`}
            value={date}
            min={challenge.startDate}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        {existing ? (
          <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            You already wrote {fmtDate(date)}. Continuing will open it for editing.
          </p>
        ) : (
          <>
            <Field label="Title (optional)">
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you build today?"
                maxLength={120}
              />
            </Field>

            <Field label="Visibility">
              {isPrivateChallenge ? (
                <p className="text-sm text-white/50">
                  Private. This challenge is private, so its journals are too.
                </p>
              ) : (
                <Segmented
                  value={visibility}
                  onChange={setVisibility}
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                  ]}
                />
              )}
            </Field>
          </>
        )}

        <button
          type="submit"
          disabled={!validDate}
          className="w-full rounded-full bg-emerald-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {existing ? 'Open entry' : 'Start writing'}
        </button>
      </motion.form>
    </div>,
    document.body
  );
}