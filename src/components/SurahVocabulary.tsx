import React, { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Layers } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { surahCoverage, tagGroup } from '../services/quranCom';
import { loadSurahWords } from '../services/surahWords';
import { themeOfWord } from '../data/wordThemes';
import { useKnownLemmas, knownLemmasStore } from '../hooks/useKnownLemmas';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';
import { Segmented } from './ReaderParts';
import { CourseWordCard } from './CoverageCourse';
import { CATEGORIES } from './SearchBar';

interface SurahVocabularyProps {
  surah: number;
  /** A theme id from the vocabulary filters, or 'all' */
  theme?: string;
  onThemeChange?: (theme: string) => void;
  onOpenVerse?: (verseKey: string) => void;
  onOpenSurah?: (surah: number) => void;
  /** Opens the flashcard deck of this surah's words */
  onStudyWords?: (surah: number) => void;
}

type Show = 'all' | 'learn' | 'known';
type WordType = 'all' | 'noun' | 'verb' | 'particle';

const PAGE_SIZE = 30;

/** Every word of a surah, most frequent first, with its meaning, recitation and known status. */
export const SurahVocabulary: React.FC<SurahVocabularyProps> = ({ surah, theme = 'all', onThemeChange, onOpenVerse, onOpenSurah, onStudyWords }) => {
  const { data: loaded, loading, error, retry } = useAsync(() => loadSurahWords(surah), [surah]);
  // While another surah loads, the previous one's words would show under the new surah's name
  const data = loaded?.surah === surah ? loaded : undefined;
  const known = useKnownLemmas();
  const [show, setShow] = useState<Show>('all');
  const [type, setType] = useState<WordType>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const info = SURAH_LIST[surah - 1];

  useEffect(() => setLimit(PAGE_SIZE), [surah, theme, show, type]);

  // Words passing the list's own filters, then narrowed by theme; counts per theme point to the others
  const unthemed = useMemo(
    () =>
      (data?.words || []).filter(
        (w) => (show === 'all' || (show === 'known') === known.has(w.lemma)) && (type === 'all' || tagGroup(w.tag) === type)
      ),
    [data, show, type, known]
  );
  const visible = useMemo(
    () => (theme === 'all' ? unthemed : unthemed.filter((w) => themeOfWord(w.lemma, w.root) === theme)),
    [unthemed, theme]
  );
  const themeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of unthemed) {
      const t = themeOfWord(w.lemma, w.root);
      if (t) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return counts;
  }, [unthemed]);

  if (loading && !data) return <LoadingBlock label="Loading the surah’s vocabulary…" />;
  if (error || !data) return <ErrorBlock onRetry={retry} />;

  const pct = Math.round(surahCoverage(data.summary, known) * 100);
  const knownCount = data.words.filter((w) => known.has(w.lemma)).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400">
            Vocabulary of Surah {info.nameTransliteration}
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{data.words.length}</strong> distinct words
            across {data.summary.total.toLocaleString()} in the surah · you know {knownCount} of them, covering{' '}
            <strong className="text-emerald-800 dark:text-emerald-300 tabular-nums">{pct}%</strong> of its text
          </p>
        </div>
        <div className="self-start sm:self-auto shrink-0 flex flex-wrap gap-2">
          {onStudyWords && knownCount < data.words.length && (
            <button
              onClick={() => onStudyWords(surah)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" /> Study in flashcards
            </button>
          )}
          {onOpenSurah && (
            <button
              onClick={() => onOpenSurah(surah)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <BookOpenText className="w-3.5 h-3.5" /> Read the surah
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          value={show}
          onChange={setShow}
          options={[
            { id: 'all', label: 'All words' },
            { id: 'learn', label: 'To learn' },
            { id: 'known', label: 'Known' }
          ]}
        />
        <Segmented
          value={type}
          onChange={setType}
          options={[
            { id: 'all', label: 'Any type' },
            { id: 'noun', label: 'Nouns' },
            { id: 'verb', label: 'Verbs' },
            { id: 'particle', label: 'Particles' }
          ]}
        />
        <span className="ms-auto text-xs text-stone-500 dark:text-stone-400 tabular-nums">{visible.length} words</span>
      </div>

      {visible.length === 0 ? (
        <div className="card p-8 text-center space-y-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {theme === 'all'
              ? 'No words in this surah match these filters.'
              : `No words from Surah ${info.nameTransliteration} in this theme${show !== 'all' || type !== 'all' ? ' match these filters' : ''}.`}
          </p>
          {theme !== 'all' && onThemeChange && unthemed.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.filter((c) => c.id === 'all' || themeCounts.has(c.id)).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onThemeChange(c.id)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  {c.id === 'all' ? 'All words' : c.label}{' '}
                  <span className="text-stone-400 tabular-nums">{c.id === 'all' ? unthemed.length : themeCounts.get(c.id)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {visible.slice(0, limit).map((w) => (
            <CourseWordCard
              key={w.lemma}
              word={w}
              isKnown={known.has(w.lemma)}
              onToggleKnown={() => knownLemmasStore.toggle(w.lemma)}
              onOpenVerse={onOpenVerse}
              label={`${w.count}× in this surah`}
              frequency={`${w.appearances.toLocaleString()}× in the Quran`}
            />
          ))}
        </div>
      )}

      {visible.length > limit && (
        <div className="text-center">
          <button
            onClick={() => setLimit(limit + PAGE_SIZE)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
          >
            Show more ({visible.length - limit} left)
          </button>
        </div>
      )}

      <p className="text-[11px] text-stone-400">
        Words are listed by dictionary form, most frequent in the surah first. Particles and pronouns show their dictionary
        meaning; other words show their meaning in their first verse of the surah. Roots &amp; frequencies: Quranic Arabic
        Corpus (GPL-3.0) · Meanings &amp; audio: Quran.com
      </p>
    </section>
  );
};
