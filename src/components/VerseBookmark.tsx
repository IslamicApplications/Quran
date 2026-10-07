import React, { useState } from 'react';
import { Bookmark, PencilLine } from 'lucide-react';
import { useVerseBookmarks, verseBookmarksStore } from '../hooks/useVerseMarks';

const actionButton =
  'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/25';

/** Saves a verse to the Saved page, or removes it. */
export const VerseBookmarkButton: React.FC<{ verseKey: string }> = ({ verseKey }) => {
  const saved = !!useVerseBookmarks()[verseKey];
  return (
    <button
      onClick={() =>
        saved
          ? verseBookmarksStore.remove(verseKey)
          : verseBookmarksStore.set(verseKey, { note: '', savedAt: new Date().toISOString() })
      }
      aria-pressed={saved}
      aria-label={saved ? `Remove ${verseKey} from saved verses` : `Save ${verseKey}`}
      title={saved ? 'Saved' : 'Save verse'}
      className={saved ? `${actionButton} !text-amber-600 dark:!text-amber-400` : actionButton}
    >
      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
};

/** The learner's note on a saved verse, edited in place; nothing for a verse that isn't saved. */
export const VerseNote: React.FC<{ verseKey: string; className?: string }> = ({ verseKey, className = '' }) => {
  const bookmark = useVerseBookmarks()[verseKey];
  const [draft, setDraft] = useState<string | null>(null);
  if (!bookmark) return null;

  const save = () => {
    if (draft !== null && draft.trim() !== bookmark.note) verseBookmarksStore.set(verseKey, { ...bookmark, note: draft.trim() });
    setDraft(null);
  };

  return draft !== null ? (
    <textarea
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setDraft(null);
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
      }}
      placeholder="Your note on this verse"
      aria-label={`Note on ${verseKey}`}
      className={`w-full min-h-[4rem] text-sm rounded-xl px-3 py-2 bg-amber-50/60 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
    />
  ) : (
    <button
      onClick={() => setDraft(bookmark.note)}
      className={`flex items-start gap-1.5 text-left text-sm cursor-pointer ${
        bookmark.note ? 'text-stone-700 dark:text-stone-300' : 'text-amber-700 dark:text-amber-400 font-semibold text-xs'
      } ${className}`}
    >
      <PencilLine className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="whitespace-pre-line">{bookmark.note || 'Add a note'}</span>
    </button>
  );
};
