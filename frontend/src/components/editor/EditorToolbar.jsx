// import { useCallback, useEffect, useReducer, useRef } from 'react';
// import {
//   Heading1, Heading2, Heading3, Pilcrow, Bold, Italic, List, ListOrdered,
//   Quote, Code, ImageIcon, Undo2, Redo2,
// } from 'lucide-react';

// function ToolbarButton({ onClick, active, disabled, title, children }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       title={title}
//       className={`w-8 h-8 flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
//         active ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// const Divider = () => <div className="mx-1 h-5 w-px shrink-0 bg-white/10" />;

// export default function EditorToolbar({ editor }) {
//   const fileInputRef = useRef(null);
//   const [, rerender] = useReducer((n) => n + 1, 0);

//   useEffect(() => {
//     if (!editor) return;
//     editor.on('transaction', rerender);
//     return () => editor.off('transaction', rerender);
//   }, [editor]);

//   const handleImageUpload = useCallback(
//     (e) => {
//       const file = e.target.files?.[0];
//       if (!file || !editor) return;
//       const reader = new FileReader();
//       reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
//       reader.readAsDataURL(file);
//       e.target.value = '';
//     },
//     [editor]
//   );

//   if (!editor) return null;
//   const run = () => editor.chain().focus();

//   return (
//     <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
//       <ToolbarButton title="Undo" onClick={() => run().undo().run()} disabled={!editor.can().undo()}>
//         <Undo2 size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Redo" onClick={() => run().redo().run()} disabled={!editor.can().redo()}>
//         <Redo2 size={15} />
//       </ToolbarButton>
//       <Divider />
//       <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => run().setParagraph().run()}>
//         <Pilcrow size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => run().toggleHeading({ level: 1 }).run()}>
//         <Heading1 size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => run().toggleHeading({ level: 2 }).run()}>
//         <Heading2 size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => run().toggleHeading({ level: 3 }).run()}>
//         <Heading3 size={15} />
//       </ToolbarButton>
//       <Divider />
//       <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => run().toggleBold().run()}>
//         <Bold size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => run().toggleItalic().run()}>
//         <Italic size={15} />
//       </ToolbarButton>
//       <Divider />
//       <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => run().toggleBulletList().run()}>
//         <List size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => run().toggleOrderedList().run()}>
//         <ListOrdered size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => run().toggleBlockquote().run()}>
//         <Quote size={15} />
//       </ToolbarButton>
//       <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => run().toggleCodeBlock().run()}>
//         <Code size={15} />
//       </ToolbarButton>
//       <Divider />
//       <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
//         <ImageIcon size={15} />
//       </ToolbarButton>
//       <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//     </div>
//   );
// }









import { useEffect, useReducer, useRef, useState } from 'react';
import {
  Heading1, Heading2, Heading3, Pilcrow, Bold, Italic, List, ListOrdered,
  Quote, Code, ImageIcon, Undo2, Redo2, Link2,
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

// only web, mail and phone links are allowed; bare domains get https://
const normalizeUrl = (input) => {
  const v = input.trim();
  if (!v) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^[^\s/]+\.[^\s/]{2,}(\/.*)?$/.test(v)) return `https://${v}`;
  return '';
};

export default function EditorToolbar({ editor }) {
  const fileInputRef = useRef(null);
  const [, rerender] = useReducer((n) => n + 1, 0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    if (!editor) return;
    editor.on('transaction', rerender);
    return () => editor.off('transaction', rerender);
  }, [editor]);

  // Ctrl+K / Cmd+K opens the link bar from inside the editor
  useEffect(() => {
    const dom = editor?.view?.dom;
    if (!dom) return;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLinkValue(editor.getAttributes('link').href || '');
        setLinkError('');
        setLinkOpen(true);
      }
    };
    dom.addEventListener('keydown', onKey);
    return () => dom.removeEventListener('keydown', onKey);
  }, [editor]);

  if (!editor) return null;

  const run = () => editor.chain().focus();
  const upload = editor.storage.imageUpload;

  const openLink = () => {
    setLinkValue(editor.getAttributes('link').href || '');
    setLinkError('');
    setLinkOpen(true);
  };

  const applyLink = (e) => {
    e.preventDefault();
    const href = normalizeUrl(linkValue);
    if (!href) {
      setLinkError('Enter a valid web address, like example.com');
      return;
    }

    const chain = editor.chain().focus();
    if (editor.isActive('link')) {
      chain.extendMarkRange('link').setLink({ href }).run();
    } else if (editor.state.selection.empty) {
      // nothing selected: insert the address itself as a link, then a plain space after it
      chain
        .insertContent([
          { type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] },
          { type: 'text', text: ' ' },
        ])
        .run();
    } else {
      chain.setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false);
  };

  const closeLink = () => {
    setLinkOpen(false);
    editor.chain().focus().run();
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) upload?.upload?.(files);
    e.target.value = '';
  };

  return (
    <div>
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
        <ToolbarButton title="Link (Ctrl+K)" active={editor.isActive('link')} onClick={openLink}>
          <Link2 size={15} />
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
        <ToolbarButton title="Insert image" disabled={upload?.uploading > 0} onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={15} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {linkOpen && (
        <form
          onSubmit={applyLink}
          className="flex flex-wrap items-center gap-2 border-t border-white/5 px-4 py-2"
        >
          <input
            autoFocus
            value={linkValue}
            onChange={(e) => {
              setLinkValue(e.target.value);
              setLinkError('');
            }}
            onKeyDown={(e) => e.key === 'Escape' && closeLink()}
            placeholder="Paste or type a link"
            className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60"
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-black transition hover:bg-emerald-400"
          >
            Apply
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/70 transition hover:text-red-400"
            >
              Remove link
            </button>
          )}
          <button
            type="button"
            onClick={closeLink}
            className="px-2 py-1.5 text-xs text-white/50 transition hover:text-white"
          >
            Cancel
          </button>
          {linkError && <p className="w-full text-xs text-red-400">{linkError}</p>}
        </form>
      )}

      {(upload?.uploading > 0 || upload?.error) && (
        <p className={`px-4 pb-2 text-xs ${upload.error ? 'text-red-400' : 'text-emerald-400'}`}>
          {upload.uploading > 0 ? 'Uploading image…' : upload.error}
        </p>
      )}
    </div>
  );
}