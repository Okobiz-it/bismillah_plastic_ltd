"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaHighlighter, FaRemoveFormat 
} from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  // Prevent hydration mismatch by rendering only on client
  const [mounted, setMounted] = useState(false);
  const isInternalChange = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none w-full min-h-[150px] outline-none ${className}`,
      },
    },
  });

  // Keep editor synced if value changes externally (e.g. form reset or initial load)
  useEffect(() => {
    if (!editor) return;

    // Skip update if change originated from within the editor itself
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentHTML = editor.getHTML();
    const normalize = (html: string) => (html === '<p></p>' || !html ? '' : html.trim());

    if (normalize(value) !== normalize(currentHTML)) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!mounted) return <div className="min-h-[200px] border border-stone-300 rounded bg-stone-50 animate-pulse" />;
  if (!editor) return null;

  return (
    <div className="flex flex-col border border-stone-300 rounded overflow-hidden focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/60 transition-all bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200">
        
        {/* Basic Formatting */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Bold"
        >
          <FaBold size={13} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Italic"
        >
          <FaItalic size={13} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Underline"
        >
          <FaUnderline size={13} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('highlight') ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Highlight"
        >
          <FaHighlighter size={13} />
        </button>
        
        <div className="w-[1px] h-5 bg-stone-300 mx-1"></div>
        
        {/* Color */}
        <input
          type="color"
          onMouseDown={(e) => e.stopPropagation()}
          onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-5 h-5 p-0 border-0 cursor-pointer rounded overflow-hidden"
          title="Text Color"
        />
        
        <div className="w-[1px] h-5 bg-stone-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Bullet List"
        >
          <FaListUl size={13} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
          title="Numbered List"
        >
          <FaListOl size={13} />
        </button>
        
        <div className="w-[1px] h-5 bg-stone-300 mx-1"></div>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-1.5 rounded text-stone-600 hover:bg-stone-200 transition-colors ml-auto"
          title="Clear Formatting"
        >
          <FaRemoveFormat size={13} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-3 bg-white min-h-[150px] cursor-text" onClick={() => editor.commands.focus()}>
        {placeholder && !value && <div className="text-stone-400 absolute pointer-events-none text-sm">{placeholder}</div>}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
