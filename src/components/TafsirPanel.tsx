import React, { useMemo, useRef, useState } from 'react';
import { ScrollText, ChevronDown } from 'lucide-react';
import { fetchVerseTafsirs, tafsirBlocks, TAFSIRS, TafsirId } from '../services/tafsir';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';

const TAFSIR_KEY = 'ayah-words-tafsir';
// Blocks shown before "Read the full commentary"; some commentaries run to many thousand words
const PREVIEW_BLOCKS = 4;

const readTafsir = (): TafsirId => {
  try {
    const id = localStorage.getItem(TAFSIR_KEY);
    return TAFSIRS.some((t) => t.id === id) ? (id as TafsirId) : 'ibn_kathir';
  } catch {
    return 'ibn_kathir';
  }
};

/** Classical commentary on one verse, with a choice of tafsir. */
export const TafsirPanel: React.FC<{ verseKey: string; className?: string }> = ({ verseKey, className = '' }) => {
  const [tafsir, setTafsirState] = useState<TafsirId>(readTafsir);
  const [expandedFor, setExpandedFor] = useState<string | null>(null);
  const { data: loaded, loading, error, retry } = useAsync(() => fetchVerseTafsirs(verseKey), [verseKey]);
  // While another verse loads, keep the previous verse's commentary off screen
  const data = loaded?.verseKey === verseKey ? loaded : undefined;
  const current = data?.tafsirs[tafsir];
  const sectionRef = useRef<HTMLElement>(null);
  const info = TAFSIRS.find((t) => t.id === tafsir)!;
  const blocks = useMemo(() => (current ? tafsirBlocks(current.text) : []), [current]);
  const expanded = expandedFor === `${tafsir}:${verseKey}`;
  const shown = expanded ? blocks : blocks.slice(0, PREVIEW_BLOCKS);

  const setTafsir = (id: TafsirId) => {
    setTafsirState(id);
    try {
      localStorage.setItem(TAFSIR_KEY, id);
    } catch {
      /* storage unavailable: keep the choice for this session */
    }
  };

  const toggleExpanded = () => {
    setExpandedFor(expanded ? null : `${tafsir}:${verseKey}`);
    // Collapsing a long commentary from its end would leave the reader far below the panel
    if (expanded && sectionRef.current && sectionRef.current.getBoundingClientRect().top < 0) {
      sectionRef.current.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <section ref={sectionRef} className={`card p-5 space-y-4 scroll-mt-32 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
          Tafsir of {verseKey}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {TAFSIRS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTafsir(t.id)}
              aria-pressed={tafsir === t.id}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                tafsir === t.id
                  ? 'bg-emerald-900 text-white dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-1 dark:ring-emerald-400/20'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <LoadingBlock label="Loading tafsir…" />
      ) : error || !data ? (
        <ErrorBlock message="Could not load the tafsir. Check your connection and try again." onRetry={retry} />
      ) : blocks.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">{info.name} has no commentary on this verse.</p>
      ) : (
        <div className="space-y-3">
          {current?.passage && (
            <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 rounded-lg px-2.5 py-1 inline-block">
              Commentary on the passage {current.passage}
            </p>
          )}
          {shown.map((b, i) =>
            b.kind === 'heading' ? (
              <h4 key={i} className="font-bold text-stone-900 dark:text-stone-100 text-sm pt-1">
                {b.text}
              </h4>
            ) : b.kind === 'arabic' ? (
              <p
                key={i}
                dir="rtl"
                className="font-quran-amiri text-xl leading-loose text-emerald-950 dark:text-emerald-100 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl px-4 py-2"
              >
                {b.text}
              </p>
            ) : (
              <p key={i} className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {b.text}
              </p>
            )
          )}
          {blocks.length > PREVIEW_BLOCKS && (
            <button
              onClick={toggleExpanded}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
            >
              {expanded ? 'Show less' : 'Read the full commentary'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      {data && (
        <p className="text-[11px] text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3">
          {info.name} · from Quran.com via the Quran API (quranapi.pages.dev)
        </p>
      )}
    </section>
  );
};
