import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { fetchMushafPage, type MushafWord } from '../services/quranCom';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';
import { BISMILLAH, TajweedKey, ToggleChip } from './ReaderParts';
import { parseTajweed, readTajweedPreference, saveTajweedPreference } from '../services/tajweed';
import { t } from '../i18n/strings';

export const MUSHAF_PAGES = 604;
const LINES = 15;
const LAST_PAGE_KEY = 'ayah-words-last-mushaf-page';

export const readLastMushafPage = (): number | null => {
  try {
    const n = Number(localStorage.getItem(LAST_PAGE_KEY));
    return n >= 1 && n <= MUSHAF_PAGES ? n : null;
  } catch {
    return null;
  }
};

type Line =
  | { kind: 'words'; words: MushafWord[] }
  | { kind: 'title'; surah: number }
  | { kind: 'bismillah' }
  | { kind: 'blank' };

/**
 * The page's 15 lines. Lines without words are where a new surah's title and Bismillah stand: the line just
 * before the surah's first verse holds the Bismillah (not before Al-Fatihah, whose first verse it is, or
 * At-Tawbah, which has none) and the one before that its title.
 */
const layout = (words: MushafWord[], surahStarts: { surah: number; line: number }[]): Line[] => {
  const byLine = new Map<number, MushafWord[]>();
  for (const w of words) byLine.set(w.line, [...(byLine.get(w.line) ?? []), w]);
  const special = new Map<number, Line>();
  for (const { surah, line } of surahStarts) {
    const hasBismillah = surah !== 1 && surah !== 9;
    if (hasBismillah && !byLine.has(line - 1)) special.set(line - 1, { kind: 'bismillah' });
    const titleLine = hasBismillah ? line - 2 : line - 1;
    if (titleLine >= 1 && !byLine.has(titleLine)) special.set(titleLine, { kind: 'title', surah });
  }
  const last = Math.max(LINES, ...byLine.keys());
  const lines: Line[] = [];
  for (let n = 1; n <= last; n++) {
    const ws = byLine.get(n);
    lines.push(ws ? { kind: 'words', words: ws } : special.get(n) ?? { kind: 'blank' });
  }
  // The first pages are short; drop the empty lines after their text
  while (lines.length && lines[lines.length - 1].kind === 'blank') lines.pop();
  return lines;
};

/** A page of the Madinah Mushaf, laid out line by line as in print. */
export const MushafPageView: React.FC<{
  page: number;
  onSelectPage: (page: number | undefined) => void;
  onOpenVerse?: (verseKey: string) => void;
}> = ({ page, onSelectPage, onOpenVerse }) => {
  const { data: loaded, error, retry } = useAsync(() => fetchMushafPage(page), [page]);
  const [tajweed, setTajweed] = useState(readTajweedPreference);
  const data = loaded?.page === page ? loaded : undefined;
  const lines = useMemo(() => (data ? layout(data.words, data.surahStarts) : []), [data]);
  const surahs = useMemo(
    () => [...new Set((data?.words ?? []).map((w) => Number(w.location.split(':')[0])))],
    [data]
  );

  useEffect(() => {
    try {
      localStorage.setItem(LAST_PAGE_KEY, String(page));
    } catch {
      /* per-viewer convenience only */
    }
    window.scrollTo({ top: 0 });
  }, [page]);

  // Arabic pages turn right to left: the left arrow goes forward
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft' && page < MUSHAF_PAGES) onSelectPage(page + 1);
      if (e.key === 'ArrowRight' && page > 1) onSelectPage(page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, onSelectPage]);

  const navButton =
    'inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button
        onClick={() => onSelectPage(undefined)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> All surahs
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => onSelectPage(page + 1)} disabled={page >= MUSHAF_PAGES} className={navButton}>
          <ChevronLeft className="w-4 h-4" /> Next page
        </button>
        <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
          Page
          <input
            type="number"
            min={1}
            max={MUSHAF_PAGES}
            value={page}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (n >= 1 && n <= MUSHAF_PAGES) onSelectPage(n);
            }}
            className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 text-center tabular-nums font-semibold text-stone-800 dark:text-stone-200"
            aria-label="Page number"
          />
          of {MUSHAF_PAGES}
          {data && <span className="text-stone-400">· Juz {data.juz}</span>}
        </label>
        <button onClick={() => onSelectPage(page - 1)} disabled={page <= 1} className={navButton}>
          Previous page <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center">
        <ToggleChip
          active={tajweed}
          onClick={() => {
            setTajweed(!tajweed);
            saveTajweedPreference(!tajweed);
          }}
          icon={Palette}
          label={t('tajweed')}
        />
      </div>
      {tajweed && <TajweedKey />}

      <article className="card p-4 sm:p-8 bg-amber-50/40 dark:bg-stone-900">
        <header className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 border-b border-amber-200/70 dark:border-stone-700 pb-2 mb-3">
          <span>{surahs.map((s) => SURAH_LIST[s - 1]?.nameTransliteration).join(' · ')}</span>
          <span className="font-quran-amiri text-sm">{surahs.map((s) => SURAH_LIST[s - 1]?.nameArabic).join(' · ')}</span>
        </header>
        {error && !data ? (
          <ErrorBlock onRetry={retry} />
        ) : !data ? (
          <LoadingBlock label="Loading page…" />
        ) : (
          <div dir="rtl" className="font-quran-amiri text-[1.35rem] sm:text-[1.7rem] leading-[2.4] text-stone-900 dark:text-stone-100">
            {lines.map((line, i) =>
              line.kind === 'title' ? (
                <div key={i} className="my-1 rounded-xl ring-1 ring-amber-300/70 dark:ring-amber-800/60 bg-amber-100/50 dark:bg-amber-950/20 text-center text-emerald-900 dark:text-emerald-200">
                  سُورَةُ {SURAH_LIST[line.surah - 1]?.nameArabic}
                </div>
              ) : line.kind === 'bismillah' ? (
                <div key={i} className="text-center text-emerald-900 dark:text-emerald-200">
                  {BISMILLAH}
                </div>
              ) : line.kind === 'blank' ? (
                <div key={i} aria-hidden>
                  &nbsp;
                </div>
              ) : (
                <div
                  key={i}
                  className={`flex flex-wrap gap-x-1.5 ${line.words.length < 4 ? 'justify-center' : 'justify-between'}`}
                >
                  {line.words.map((w) =>
                    w.end ? (
                      <span key={w.location} className="text-emerald-700 dark:text-emerald-300 text-[0.8em]">
                        ﴿{w.text}﴾
                      </span>
                    ) : (
                      <button
                        key={w.location}
                        onClick={() => onOpenVerse?.(w.location.split(':').slice(0, 2).join(':'))}
                        className="rounded-md hover:bg-amber-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Open this verse word by word"
                      >
                        {tajweed && w.tajweed
                          ? parseTajweed(w.tajweed).map((seg, i) =>
                              seg.rule ? (
                                <span key={i} className={seg.rule.className} title={seg.rule.name}>
                                  {seg.text}
                                </span>
                              ) : (
                                seg.text
                              )
                            )
                          : w.text}
                      </button>
                    )
                  )}
                </div>
              )
            )}
          </div>
        )}
        <footer className="text-center text-[11px] text-stone-400 tabular-nums pt-3 mt-3 border-t border-amber-200/70 dark:border-stone-700">
          {page}
        </footer>
      </article>
      <p className="text-[11px] text-stone-400 text-center">
        Page layout of the Madinah Mushaf (King Fahd Complex) via Quran.com, from Tarteel's Quranic Universal Library
      </p>
    </div>
  );
};
