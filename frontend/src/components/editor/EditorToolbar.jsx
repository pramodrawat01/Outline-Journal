import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Heading1, Heading2, Heading3, Pilcrow, Bold, Italic, List, ListOrdered,
  Quote, Code, ImageIcon, Undo2, Redo2,
} from 'lucide-react';

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="mx-1 h-5 w-px shrink-0 bg-white/10" />;

export default function EditorToolbar({ editor }) {
  const fileInputRef = useRef(null);
  const [, rerender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    if (!editor) return;
    editor.on('transaction', rerender);
    return () => editor.off('transaction', rerender);
  }, [editor]);

  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const reader = new FileReader();
      reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [editor]
  );

  if (!editor) return null;
  const run = () => editor.chain().focus();

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
      <ToolbarButton title="Undo" onClick={() => run().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => run().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => run().setParagraph().run()}>
        <Pilcrow size={15} />
      </ToolbarButton>
      <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => run().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => run().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => run().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => run().toggleBold().run()}>
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => run().toggleItalic().run()}>
        <Italic size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => run().toggleBulletList().run()}>
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => run().toggleOrderedList().run()}>
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => run().toggleBlockquote().run()}>
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => run().toggleCodeBlock().run()}>
        <Code size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon size={15} />
      </ToolbarButton>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </div>
  );
}