import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { FaArrowLeft } from 'react-icons/fa';
import { getJournal, saveJournal } from '../../services/challengeService';
import { coverStyle, dayOf, fmtDate, todayStr } from '../../utils/challengeUtils';
import { getExtensions } from '../../components/editor/editorExtensions';
import EditorToolbar from '../../components/editor/EditorToolbar';
import Segmented from '../../components/onboarding/Segmented';

export default function ChallengeWrite() {
  const { id, date } = useParams();
  const location = useLocation();
  const { title: initialTitle = '', visibility: initialVisibility = 'private' } = location.state || {};

  const [challenge, setChallenge] = useState(null);
  const [title, setTitle] = useState(initialTitle);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: getExtensions('Write about your day...'),
    content: '',
    onUpdate: () => setSaved(false),
  });

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;
    setLoading(true);
    getJournal(id, date)
      .then(({ challenge, journal }) => {
        if (cancelled) return;
        setChallenge(challenge);
        if (journal) {
          setTitle(journal.title || '');
          setVisibility(journal.visibility);
          if (journal.content) editor.commands.setContent(journal.content);
        }
      })
      .catch(() => !cancelled && setError('Could not load this day.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, date, editor]);

  const backTo = `/profile/challenges/${id}`;

  if (loading || !editor) return <p className="text-sm text-white/40">Loading…</p>;

  if (!challenge) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error || 'Challenge not found.'}</p>
        <Link to="/profile/challenges" className="text-sm text-emerald-400">
          ← Back to challenges
        </Link>
      </div>
    );
  }

  const outOfRange = date < challenge.startDate || date > challenge.endDate || date > todayStr();
  if (outOfRange) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-white/60">You can only write for days from the start date up to today.</p>
        <Link to={backTo} className="text-sm text-emerald-400">
          ← Back to the challenge
        </Link>
      </div>
    );
  }

  const effectiveVisibility = challenge.visibility === 'private' ? 'private' : visibility;

  const handleSave = async () => {
    if (editor.isEmpty && !title.trim()) {
      setError('Write something before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveJournal(id, date, {
        title,
        content: editor.getJSON(),
        visibility: effectiveVisibility,
      });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <FaArrowLeft size={11} /> Back
        </Link>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-emerald-400">Saved ✓</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10" style={coverStyle(challenge.cover)}>
        <div className="px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-white/50">{challenge.title}</p>
          <p className="mt-1 text-sm text-white/70">
            Day {dayOf(challenge, date)} · {fmtDate(date)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
        <div className="border-b border-white/10">
          <EditorToolbar editor={editor} />
        </div>

        <div className="p-6">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaved(false);
            }}
            placeholder="Untitled entry"
            maxLength={120}
            className="mb-5 w-full bg-transparent text-3xl font-semibold placeholder:text-gray-600 focus:outline-none"
          />
          <EditorContent
            editor={editor}
            className="tiptap-editor [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none"
          />
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <span className="text-xs text-white/40">Visibility</span>
          {challenge.visibility === 'private' ? (
            <span className="text-xs text-white/50">Private (this challenge is private)</span>
          ) : (
            <Segmented
              value={effectiveVisibility}
              onChange={(v) => {
                setVisibility(v);
                setSaved(false);
              }}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
              ]}
            />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}