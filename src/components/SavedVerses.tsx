import React from 'react';
import { Bookmark, BookOpenText, Layers, Trash2 } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { fetchVerse } from '../services/quranCom';
import { useVerseBookmarks, verseBookmarksStore } from '../hooks/useVerseMarks';
import { useAsync } from './QuranWordBits';
import { VerseNote } from './VerseBookmark';

const mushafOrder = (a: string, b: string) => {
  const [sa, aa] = a.split(':').map(Number);
  const [sb, ab] = b.split(':').map(Number);
  return sa - sb || aa - ab;
};

/** Verses the learner saved from the readers, in Mushaf order, with their notes. */
export const SavedVerses: React.FC<{
  onOpenSurah?: (surah: number) => void;
  onOpenVerse?: (verseKey: string) => void;
}> = ({ onOpenSurah, onOpenVerse }) => {
  const bookmarks = useVerseBookmarks();
  const keys = Object.keys(bookmarks).sort(mushafOrder);

  return (
    <section className="card p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
        <h3 className="font-bold text-stone-900 dark:text-stone-100">Saved verses</h3>
        <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">{keys.length}</span>
      </div>
      {keys.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Save a verse with the bookmark button beside it in the Surah or Juz Reader, and add your own notes to it.
        </p>
      ) : (
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {keys.map((key) => (
            <SavedVerse key={key} verseKey={key} onOpenSurah={onOpenSurah} onOpenVerse={onOpenVerse} />
          ))}
        </div>
      )}
    </section>
  );
};

const SavedVerse: React.FC<{
  verseKey: string;
  onOpenSurah?: (surah: number) => void;
  onOpenVerse?: (verseKey: string) => void;
}> = ({ verseKey, onOpenSurah, onOpenVerse }) => {
  const { data } = useAsync(() => fetchVerse(verseKey), [verseKey]);
  const verse = data?.key === verseKey ? data : undefined;
  const surah = Number(verseKey.split(':')[0]);
  const link = 'inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer';

  return (
    <article className="py-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
          {SURAH_LIST[surah - 1]?.nameTransliteration} {verseKey}
        </span>
        <div className="flex items-center gap-3">
          {onOpenSurah && (
            <button onClick={() => onOpenSurah(surah)} className={link}>
              <BookOpenText className="w-3.5 h-3.5" /> Read the surah
            </button>
          )}
          {onOpenVerse && (
            <button onClick={() => onOpenVerse(verseKey)} className={link}>
              <Layers className="w-3.5 h-3.5" /> Word by word
            </button>
          )}
          <button
            onClick={() => verseBookmarksStore.remove(verseKey)}
            aria-label={`Remove ${verseKey} from saved verses`}
            className="p-1 rounded-lg text-stone-400 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {verse ? (
        <>
          <p dir="rtl" className="font-quran-amiri text-2xl leading-loose text-stone-900 dark:text-stone-100">
            {verse.arabic}
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400">{verse.translation}</p>
        </>
      ) : (
        <div className="h-16 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse" />
      )}
      <VerseNote verseKey={verseKey} />
    </article>
  );
};
