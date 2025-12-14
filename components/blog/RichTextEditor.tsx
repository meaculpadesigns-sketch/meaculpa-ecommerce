'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Minus,
} from 'lucide-react';
import { uploadFile } from '@/lib/firebase-helpers';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-mea-gold underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[400px] p-4 focus:outline-none bg-white bg-opacity-5 rounded-lg',
      },
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      try {
        setUploading(true);
        const path = `blog/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);

        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Görsel yüklenirken hata oluştu');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handleAddLink = () => {
    if (!editor) return;

    const url = window.prompt('URL giriniz:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return <div className="text-gray-700 dark:text-gray-400">Editor yükleniyor...</div>;
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white border-opacity-10 bg-black bg-opacity-20">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
        >
          <Redo size={18} />
        </button>

        <div className="w-px h-6 bg-white bg-opacity-20 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('bold') ? 'bg-mea-gold bg-opacity-20 text-mea-gold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('italic') ? 'bg-mea-gold bg-opacity-20 text-mea-gold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('strike') ? 'bg-mea-gold bg-opacity-20 text-mea-gold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('code') ? 'bg-mea-gold bg-opacity-20 text-mea-gold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Code size={18} />
        </button>

        <div className="w-px h-6 bg-white bg-opacity-20 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px h-6 bg-white bg-opacity-20 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('bulletList')
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('orderedList')
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-white bg-opacity-20 mx-1" />

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('blockquote')
              ? 'bg-mea-gold bg-opacity-20 text-mea-gold'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Quote size={18} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-gray-700 dark:text-gray-300"
        >
          <Minus size={18} />
        </button>

        <div className="w-px h-6 bg-white bg-opacity-20 mx-1" />

        {/* Image and Link */}
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={uploading}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-gray-700 dark:text-gray-300 disabled:opacity-30"
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={handleAddLink}
          className={`p-2 hover:bg-white hover:bg-opacity-10 rounded ${
            editor.isActive('link') ? 'bg-mea-gold bg-opacity-20 text-mea-gold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <LinkIcon size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-black bg-opacity-20">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {uploading && (
        <div className="p-3 border-t border-white border-opacity-10">
          <p className="text-sm text-gray-700 dark:text-gray-400">Görsel yükleniyor...</p>
        </div>
      )}
    </div>
  );
}
