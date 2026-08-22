"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaRemoveFormat 
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

interface MiniRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function MiniRichTextEditor({
  value,
  onChange,
  placeholder = "Please describe your specifications, volume requirements, delivery timelines...",
  minHeight = "min-h-[160px]",
  className = "",
}: MiniRichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const isInternalChange = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Underline,
      Highlight,
      TextStyle,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      const html = editor.getHTML();
      // If it's just an empty paragraph, send empty string
      const clean = html === "<p></p>" || html === "" ? "" : html;
      onChange(clean);
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none w-full ${minHeight} outline-none text-sm text-stone-800 leading-relaxed ${className}`,
      },
    },
  });

  // Keep editor synced if value changes externally
  useEffect(() => {
    if (!editor) return;

    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentHTML = editor.getHTML();
    const normalize = (html: string) => (html === "<p></p>" || !html ? "" : html.trim());

    if (normalize(value) !== normalize(currentHTML)) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!mounted) {
    return (
      <div className={`w-full ${minHeight} border border-stone-200 rounded bg-stone-50/60 animate-pulse`} />
    );
  }

  if (!editor) return null;

  const isEditorEmpty = !value || value === "<p></p>" || editor.isEmpty;

  return (
    <div className="flex flex-col border border-stone-200 rounded bg-stone-50/60 focus-within:bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 transition-all overflow-hidden">
      {/* Mini Sleek Toolbar */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100/75 border-b border-stone-200/80">
        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive("bold")
              ? "bg-brand/15 text-brand font-bold"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
          }`}
          title="Bold"
        >
          <FaBold size={11} />
        </button>

        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive("italic")
              ? "bg-brand/15 text-brand font-bold"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
          }`}
          title="Italic"
        >
          <FaItalic size={11} />
        </button>

        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive("underline")
              ? "bg-brand/15 text-brand font-bold"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
          }`}
          title="Underline"
        >
          <FaUnderline size={11} />
        </button>

        <div className="w-[1px] h-3.5 bg-stone-300 mx-1" />

        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive("bulletList")
              ? "bg-brand/15 text-brand font-bold"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
          }`}
          title="Bullet List"
        >
          <FaListUl size={11} />
        </button>

        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive("orderedList")
              ? "bg-brand/15 text-brand font-bold"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
          }`}
          title="Numbered List"
        >
          <FaListOl size={11} />
        </button>

        <div className="w-[1px] h-3.5 bg-stone-300 mx-1" />

        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 transition-colors ml-auto"
          title="Clear Formatting"
        >
          <FaRemoveFormat size={11} />
        </button>
      </div>

      {/* Editor Body */}
      <div
        className={`relative px-3.5 py-2.5 ${minHeight} cursor-text`}
        onClick={() => editor.commands.focus()}
      >
        {isEditorEmpty && (
          <div className="absolute top-2.5 left-3.5 text-stone-400 pointer-events-none text-sm select-none leading-relaxed pr-6">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
