import React, { useEffect } from 'react';
import { X, Check, BookMarked, Layers } from 'lucide-react';
import { formatRoot, describeTag, QVerse, QWord } from '../services/quranCom';
import { AppSettings } from '../types';
import { knownLemmasStore } from '../hooks/useKnownLemmas';
import { useRecitedWord } from '../hooks/useRecitedWord';
import { WordAudioButton } from './QuranWordBits';
import { parseTajweed, TAJWEED_RULES, type TajweedRule } from '../services/tajweed';

/** Pieces shared by the surah and juz reading views. */

export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export function Segmented<T extends string>({
  value,
  onChange,
  options
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 ring-1 ring-stone-200/70 dark:ring-stone-700/70 text-xs shrink-0">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
            value === o.id ? 'bg-white dark:bg-stone-900 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export type AudioMode = 'arabic' | 'english' | 'both';

export const ARABIC_SIZES: Record<AppSettings['arabicFontSize'], string> = {
  md: 'text-2xl sm:text-[1.7rem]',
  lg: 'text-[1.7rem] sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
  '2xl': 'text-4xl sm:text-5xl'
};

export const ToggleChip: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold ring-1 transition-colors cursor-pointer ${
      active ? 'bg-emerald-50 dark:bg-emerald-950/25 ring-emerald-300 dark:ring-emerald-700 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export const WordSheet: React.FC<{
  word: QWord;
  isKnown: boolean;
  onClose: () => void;
  onOpenVerse?: (key: string) => void;
  onOpenRoot?: (root: string) => void;
}> = ({ word, isKnown, onClose, onOpenVerse, onOpenRoot }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const verseKey = word.location.split(':').slice(0, 2).join(':');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 pointer-events-none">
      <div
        role="dialog"
        aria-label="Word details"
        className="pointer-events-auto max-w-2xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-2xl ring-1 ring-stone-200 dark:ring-stone-700 p-5 space-y-4 animate-fadeIn"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-quran-amiri text-4xl font-bold text-emerald-950 dark:text-emerald-100 leading-snug" dir="rtl">
              {word.arabic}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-stone-900 dark:text-stone-100 truncate">{word.translation || '…'}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {word.transliteration && `${word.transliteration} · `}
                {word.location}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <WordAudioButton url={word.audioUrl} className="w-9 h-9" />
            <button onClick={onClose} className="p-2 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-stone-50 dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Grammar</div>
            <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">{describeTag(word.tag, word.verbForm) || '—'}</div>
          </div>
          <div className="rounded-xl bg-stone-50 dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Root</div>
            <div className="font-quran-amiri text-base font-bold text-emerald-900 dark:text-emerald-200">{word.root ? formatRoot(word.root) : '—'}</div>
          </div>
          <div className="rounded-xl bg-stone-50 dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Dictionary form</div>
            <div className="font-quran-amiri text-base font-bold text-stone-800 dark:text-stone-200">{word.lemma || '—'}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {word.lemma && (
            <button
              onClick={() => knownLemmasStore.toggle(word.lemma!)}
              aria-pressed={isKnown}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                isKnown ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {isKnown ? 'Known' : 'Mark as known'}
            </button>
          )}
          {word.root && onOpenRoot && (
            <button
              onClick={() => onOpenRoot(word.root!)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5" /> Root dictionary
            </button>
          )}
          {onOpenVerse && (
            <button
              onClick={() => onOpenVerse(verseKey)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" /> Word by word
            </button>
          )}
        </div>
        {isKnown && (
          <p className="text-[11px] text-stone-400">
            Marking a word known covers every form of it ({word.lemma}) across the Quran.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * One ayah's words. Memoised, so the recitation highlight moving through a verse re-renders that verse only.
 */
export const AyahWords = React.memo(function AyahWords({
  verse,
  className,
  known,
  highlightUnknown,
  selectedLocation,
  onSelect,
  conceal = false,
  onReveal,
  tajweed = false
}: {
  verse: QVerse;
  className: string;
  known: ReadonlySet<string>;
  highlightUnknown: boolean;
  selectedLocation?: string;
  onSelect: (word: QWord | null) => void;
  /** Memorisation: blur each word until it has been recited; a tap calls `onReveal` instead */
  conceal?: boolean;
  onReveal?: () => void;
  /** Colour each word by its tajweed rules */
  tajweed?: boolean;
}) {
  const recited = useRecitedWord(verse.key);
  return (
    <p dir="rtl" className={`${className} leading-[2.3] text-right`}>
      {verse.words.map((w) => {
        const isKnown = !!w.lemma && known.has(w.lemma);
        const isSelected = selectedLocation === w.location;
        const hidden = conceal && (recited === null || w.position > recited);
        return (
          <React.Fragment key={w.location}>
            <button
              onClick={() => (conceal ? onReveal?.() : onSelect(isSelected ? null : w))}
              aria-current={recited === w.position ? 'true' : undefined}
              aria-label={hidden ? 'Hidden word: tap to uncover the verse' : undefined}
              className={`rounded-md px-0.5 leading-[1.5] align-baseline transition-[color,background-color,filter] cursor-pointer ${
                hidden
                  ? 'blur-[7px] select-none text-stone-500 dark:text-stone-400'
                  : isSelected
                  ? 'bg-emerald-800 text-white'
                  : recited === w.position
                  ? 'bg-emerald-200 dark:bg-emerald-700/70 text-emerald-950 dark:text-white'
                  : highlightUnknown && !isKnown
                  ? `${tajweed ? 'text-stone-900 dark:text-stone-100' : 'text-amber-900 dark:text-amber-200'} bg-amber-100/60 dark:bg-amber-900/25 hover:bg-amber-200/70 dark:hover:bg-amber-800/50`
                  : 'text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {tajweed && w.tajweed && !isSelected
                ? parseTajweed(w.tajweed).map((seg, i) =>
                    seg.rule ? (
                      <span key={i} className={seg.rule.className} title={seg.rule.name}>
                        {seg.text}
                      </span>
                    ) : (
                      seg.text
                    )
                  )
                : w.arabic}
            </button>{' '}
          </React.Fragment>
        );
      })}
      <span className="text-emerald-700/70 dark:text-emerald-300 text-[0.7em] select-none">﴿{verse.ayah.toLocaleString('ar-EG')}﴾</span>
    </p>
  );
});

/** The colours of tajweed, each with the rules it marks. */
export const TajweedKey: React.FC = () => {
  const groups = new Map<string, TajweedRule[]>();
  for (const rule of TAJWEED_RULES) groups.set(rule.className, [...(groups.get(rule.className) ?? []), rule]);
  return (
    <div className="card p-4 animate-fadeIn">
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-stone-500 dark:text-stone-400 mb-2">
        Tajweed colours
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1.5 text-xs">
        {[...groups].map(([className, rules]) => (
          <li key={className} className="flex items-start gap-2">
            <span className={`${className} font-quran-amiri text-lg leading-none mt-0.5`} aria-hidden>
              ●
            </span>
            <span className="text-stone-700 dark:text-stone-300">{rules.map((r) => r.name).join(' · ')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
