import React, { useEffect, useState } from 'react';
import { Globe2, ArrowRight, BookMarked } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { normalizeArabic, parseVerseReference } from '../services/quranApi';
import { searchQuran, getRootIndex, formatRoot, QSearchResult } from '../services/quranCom';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';

interface WholeQuranSearchProps {
  query: string;
  onOpenVerse: (key: string) => void;
  onOpenRoot: (root: string) => void;
}

const useDebounced = (value: string, ms: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
};

/** Renders API text as plain text, turning only <em>…</em> into highlights (never injects HTML). */
const decode = (text: string) =>
  new DOMParser().parseFromString(text.replace(/<[^>]*>/g, ''), 'text/html').documentElement.textContent || '';

const HighlightedText: React.FC<{ html: string }> = ({ html }) => (
  <>
    {html.split(/(<em>.*?<\/em>)/g).map((part, i) =>
      part.startsWith('<em>') ? (
        <mark key={i} className="bg-amber-100 dark:bg-amber-900/25 text-emerald-900 dark:text-emerald-200 font-semibold rounded px-0.5">
          {decode(part)}
        </mark>
      ) : (
        <React.Fragment key={i}>{decode(part)}</React.Fragment>
      )
    )}
  </>
);

const isArabic = (text: string) => /[؀-ۿ]/.test(text);

/** Roots whose letters (or one of whose word forms) match an Arabic query. */
const findRoots = async (query: string) => {
  const index = await getRootIndex();
  const q = normalizeArabic(query).replace(/\s+/g, '');
  const exact: string[] = [];
  const viaLemma: string[] = [];
  for (const [root, entry] of Object.entries(index)) {
    if (normalizeArabic(root) === q) exact.push(root);
    else if (Object.keys(entry.l).some((l) => normalizeArabic(l) === q)) viaLemma.push(root);
  }
  return [...exact, ...viaLemma].slice(0, 4).map((root) => ({ root, n: index[root].n }));
};

export const WholeQuranSearch: React.FC<WholeQuranSearchProps> = ({ query, onOpenVerse, onOpenRoot }) => {
  const q = useDebounced(query.trim(), 400);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<QSearchResult[]>([]);

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [q]);

  const ref = q ? parseVerseReference(q) : null;
  const directVerse = ref?.isValid && ref.ayahNumber ? `${ref.surahNumber}:${ref.ayahNumber}` : null;

  const search = useAsync(
    () => (q.length >= 2 && !directVerse ? searchQuran(q, page) : Promise.resolve(null)),
    [q, page, directVerse]
  );
  const roots = useAsync(() => (q && isArabic(q) ? findRoots(q) : Promise.resolve([])), [q]);

  useEffect(() => {
    if (search.data) setResults((prev) => (page === 1 ? search.data!.results : [...prev, ...search.data!.results]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.data]);

  if (q.length < 2) return null;

  return (
    <section className="card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
          Across the whole Quran
        </h3>
        {search.data && (
          <span className="text-xs text-stone-500 dark:text-stone-400">{search.data.total.toLocaleString()} verses</span>
        )}
      </div>

      {directVerse && (
        <button
          onClick={() => onOpenVerse(directVerse)}
          className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/25 ring-1 ring-emerald-200 dark:ring-emerald-800 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-left cursor-pointer"
        >
          <span className="text-sm text-emerald-950 dark:text-emerald-100">
            Open <strong>{SURAH_LIST[ref!.surahNumber - 1]?.nameTransliteration} {directVerse}</strong> word by word
          </span>
          <ArrowRight className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
        </button>
      )}

      {roots.data && roots.data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {roots.data.map(({ root, n }) => (
            <button
              key={root}
              onClick={() => onOpenRoot(root)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/25 text-sm cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              <span className="text-stone-600 dark:text-stone-400">Root</span>
              <span className="font-quran-amiri text-lg font-bold text-emerald-950 dark:text-emerald-100">{formatRoot(root)}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{n}×</span>
            </button>
          ))}
        </div>
      )}

      {!directVerse && (
        <>
          {search.loading && results.length === 0 ? (
            <LoadingBlock label="Searching the Quran…" />
          ) : search.error && results.length === 0 ? (
            <ErrorBlock onRetry={search.retry} />
          ) : results.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400 py-4 text-center">No verses found for “{q}”.</p>
          ) : (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {results.map((r) => {
                const [s] = r.key.split(':').map(Number);
                return (
                  <li key={r.key} className="py-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        {SURAH_LIST[s - 1]?.nameTransliteration} {r.key}
                      </span>
                      <button
                        onClick={() => onOpenVerse(r.key)}
                        className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
                      >
                        Word by word →
                      </button>
                    </div>
                    <p className="font-quran-amiri text-xl leading-loose arabic-text text-stone-800 dark:text-stone-200">{r.arabic}</p>
                    {r.translationHtml && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        <HighlightedText html={r.translationHtml} />
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {search.data && page < search.data.totalPages && results.length > 0 && (
            <button
              onClick={() => setPage(page + 1)}
              disabled={search.loading}
              className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer disabled:opacity-60"
            >
              {search.loading ? 'Loading…' : 'Show more verses'}
            </button>
          )}
        </>
      )}
    </section>
  );
};
