import { useEditor, EditorContent } from '@tiptap/react';
import { getExtensions } from './editorExtensions';

export default function JournalReader({ content }) {
  const editor = useEditor({
    extensions: getExtensions(''),
    content: content || '',
    editable: false,
  });

  if (!editor) return null;
  return <EditorContent editor={editor} className="tiptap-editor" />;
}