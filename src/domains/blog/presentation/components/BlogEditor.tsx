import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  FileCode,
  Eye,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/ui/button';

export interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function BlogEditor({
  value,
  onChange,
  className,
}: BlogEditorProps) {
  const [isRawMode, setIsRawMode] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html);
    },
  });

  // Keep editor content in sync when external value updates
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-64 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
    );
  }

  const wordCount = (value || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col',
        className,
      )}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('bold') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-bold',
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('italic') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400',
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          {/* Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('code') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400',
            )}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('heading', { level: 1 }) && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-bold',
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('heading', { level: 2 }) && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-bold',
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('heading', { level: 3 }) && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-bold',
            )}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('bulletList') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400',
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('orderedList') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400',
            )}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={isRawMode}
            className={cn(
              'rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
              editor.isActive('blockquote') && 'bg-slate-200 text-brand-600 dark:bg-slate-800 dark:text-brand-400',
            )}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          {/* Divider */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={isRawMode}
            className="rounded p-1.5 text-xs text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={isRawMode || !editor.can().undo()}
            className="rounded p-1.5 text-xs text-slate-700 disabled:opacity-40 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={isRawMode || !editor.can().redo()}
            className="rounded p-1.5 text-xs text-slate-700 disabled:opacity-40 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setIsRawMode(!isRawMode)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {isRawMode ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Visual</span>
              </>
            ) : (
              <>
                <FileCode className="h-3.5 w-3.5" />
                <span>HTML / Source</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      {isRawMode ? (
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            editor.commands.setContent(e.target.value, { emitUpdate: false });
          }}
          className="min-h-[280px] w-full p-4 font-mono text-sm leading-relaxed text-slate-900 dark:bg-slate-900 dark:text-slate-100 focus:outline-none"
          placeholder="Paste or write HTML / Markdown here..."
        />
      ) : (
        <div className="prose prose-slate dark:prose-invert max-w-none min-h-[280px] p-4 text-slate-900 dark:text-slate-100 focus:outline-none cursor-text [&_.ProseMirror]:min-h-[240px] [&_.ProseMirror]:focus:outline-none">
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
        <span className="font-mono">{wordCount} words &bull; ~{readingTime} min read</span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">TipTap Rich Text Engine</span>
      </div>
    </div>
  );
}

export default BlogEditor;
