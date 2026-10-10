import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  createPersonalJournal,
  getPersonalJournal,
  updatePersonalJournal,
} from '../../services/journalService';
import { todayStr } from '../../utils/challengeUtils';
import { getExtensions } from '../../components/editor/editorExtensions';
import EditorToolbar from '../../components/editor/EditorToolbar';
import Segmented from '../../components/onboarding/Segmented';
import { inputCls } from '../../components/onboarding/Field';
import { getDiary } from '../../services/diaryService';

export default function JournalWrite() {
  //const { id } = useParams(); // undefined on /journal/new
  const { id, diaryId } = useParams(); // id is undefined when writing a new entry
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr());
  const [visibility, setVisibility] = useState(user?.preferences?.defaultEntryVisibility || 'private');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [diary, setDiary] = useState(null);

  const editor = useEditor({
    extensions: getExtensions('Write about your day...'),
    content: '',
  });

  useEffect(() => {
    if (!isEdit || !editor) return;
    let cancelled = false;
    getPersonalJournal(id)
      .then((j) => {
        if (cancelled) return;
        setTitle(j.title || '');
        setDate(j.entryDate);
        setVisibility(j.visibility);
        if (j.content) editor.commands.setContent(j.content);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.status === 404 ? 'Journal not found.' : 'Could not load this journal.');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, editor]);

 useEffect(() => {
    if (!diaryId) return;
    getDiary(diaryId)
      .then((d) => {
        setDiary(d.diary);
        if (!isEdit) setVisibility(d.diary.visibility);
      })
      .catch(() => setError('Diary not found.'));
  }, [diaryId, isEdit]);

  //const backTo = isEdit ? `/profile/journal/${id}` : '/profile/journal';

  const listPath = diaryId ? `/profile/diary/${diaryId}` : '/profile/journal';
  const entriesBase = diaryId ? `${listPath}/entries` : '/profile/journal';
  const backTo = isEdit ? `${entriesBase}/${id}` : listPath;
  const diaryPrivate = diary?.visibility === 'private';
  const effectiveVisibility = diaryPrivate ? 'private' : visibility;

  if (!editor || loading) return <p className="text-sm text-white/40">Loading…</p>;

  if (isEdit && error && !title && editor.isEmpty) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error}</p>
        <Link to={listPath} className="text-sm text-emerald-400">
          ← Back
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    if (editor.isEmpty && !title.trim()) {
      setError('Write something before saving.');
      return;
    }
    if (!date || date > todayStr()) {
      setError('Pick today or an earlier date.');
      return;
    }
    setSaving(true);
    setError('');
    try {
     // const payload = { title, content: editor.getJSON(), entryDate: date, visibility };
     const payload = {
        title,
        content: editor.getJSON(),
        entryDate: date,
        visibility: effectiveVisibility,
        ...(diaryId && !isEdit ? { diary: diaryId } : {}),
      }; 
     const saved = isEdit ? await updatePersonalJournal(id, payload) : await createPersonalJournal(payload);
      navigate(`${entriesBase}/${saved._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <FaArrowLeft size={11} /> Back
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save'}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
        <div className="border-b border-white/10">
          <EditorToolbar editor={editor} />
        </div>

        <div className="p-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled entry"
            maxLength={120}
            className="mb-5 w-full bg-transparent text-3xl font-semibold placeholder:text-gray-600 focus:outline-none"
          />
          <EditorContent
            editor={editor}
            className="tiptap-editor [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Date</span>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputCls} !w-auto !py-2 [color-scheme:dark]`}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Visibility</span>
            {/* <Segmented
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
              ]}
            /> */}.
             {diaryPrivate ? (
              <span className="text-xs text-white/50">Private (this diary is private)</span>
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
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}