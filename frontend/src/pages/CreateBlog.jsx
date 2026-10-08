import React, { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import {
  ArrowLeft,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";

const lowlight = createLowlight(common);

/* ---------------------------------------------------------- */
/* Toolbar button                                               */
/* ---------------------------------------------------------- */

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-emerald-500 text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------- */

export default function CreateBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Came from the CreateEntryModal — falls back gracefully if visited directly
  const { title: initialTitle = "", entryType = "blog" } = location.state || {};
  const [title, setTitle] = useState(initialTitle);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disabled here so CodeBlockLowlight (below) handles code blocks instead
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your entry...",
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: "",
  });

  // Reads a chosen file as base64 and inserts it directly into the document.
  //
  // NOTE: this is a placeholder. For real usage you'd instead upload the file
  // to your backend (multer -> disk/S3/Cloudinary) and insert the returned
  // URL here instead of a base64 string, so the image doesn't bloat every
  // request that loads this entry later.
  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);

      e.target.value = ""; // allow choosing the same file again later
    },
    [editor]
  );

  const handlePublish = () => {
    const payload = {
      title,
      entryType,
      content: editor?.getHTML(),
    };
    // TODO: POST this to your backend once a /api/entries endpoint exists
    console.log("Publishing entry:", payload);
    alert("Publish endpoint isn't built yet — check the console for the payload.");
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0d0b]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="text-xs text-gray-500 uppercase tracking-widest">
            {entryType === "journal" ? "Journal Entry" : "Blog Post"}
          </span>

          <button
            onClick={handlePublish}
            className="bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium px-5 py-2 rounded-full"
          >
            Publish
          </button>
        </div>
      </div>

      {/* editor toolbar */}
      <div className="sticky top-[65px] z-10 border-b border-white/5 bg-[#0a0d0b]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-1 px-6 py-2 overflow-x-auto">
          <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2 size={15} />
          </ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2 size={15} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <ToolbarButton
            title="Paragraph"
            active={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={15} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={15} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={15} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={15} />
          </ToolbarButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* title + editor body */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled entry"
          className="w-full bg-transparent text-4xl font-semibold placeholder:text-gray-600 focus:outline-none mb-8"
        />

        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  );
}