import React, { useEffect, useState } from 'react';
import { Volume2, Loader2, AlertTriangle, RotateCw } from 'lucide-react';
import { describeTag, tagGroup, playAudio, fetchVerse, findWordInVerse, QVerse } from '../services/quranCom';
import { useRecitedWord } from '../hooks/useRecitedWord';

const GROUP_STYLES = {
  verb: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 ring-sky-200 dark:ring-sky-800',
  noun: 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-800 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800',
  particle: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 ring-stone-200 dark:ring-stone-700'
} as const;

export const TagBadge: React.FC<{ tag?: string; verbForm?: string; short?: boolean }> = ({ tag, verbForm, short }) => {
  if (!tag) return null;
  const label = describeTag(tag, short ? undefined : verbForm);
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1 whitespace-nowrap ${GROUP_STYLES[tagGroup(tag)]}`}
    >
      {label}
    </span>
  );
};

export const WordAudioButton: React.FC<{ url?: string; label?: string; className?: string }> = ({
  url,
  label = 'Play word',
  className = ''
}) => {
  const [state, setState] = useState<'idle' | 'playing' | 'error'>('idle');
  if (!url) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        const audio = playAudio(url);
        setState('playing');
        audio.onended = audio.onpause = () => setState('idle');
        audio.onerror = () => setState('error');
      }}
      aria-label={label}
      title={state === 'error' ? 'Audio unavailable' : label}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer ${
        state === 'playing'
          ? 'bg-emerald-700 text-white'
          : state === 'error'
          ? 'bg-stone-100 dark:bg-stone-800 text-stone-300 dark:text-stone-600'
          : 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 ring-1 ring-emerald-200 dark:ring-emerald-800'
      } ${className}`}
    >
      <Volume2 className="w-3.5 h-3.5" />
    </button>
  );
};

export const LoadingBlock: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-400">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span>{label}</span>
  </div>
);

export const ErrorBlock: React.FC<{ message?: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-10 text-center">
    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800 flex items-center justify-center">
      <AlertTriangle className="w-5 h-5" />
    </div>
    <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm">
      {message || 'Could not load data from Quran.com. Check your connection and try again.'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
      >
        <RotateCw className="w-3.5 h-3.5" /> Try again
      </button>
    )}
  </div>
);

/** Minimal async loader: re-runs when `deps` change, exposes retry. */
export function useAsync<T>(load: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<{ data?: T; error?: unknown; loading: boolean }>({ loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ data: s.data, loading: true }));
    load().then(
      (data) => !cancelled && setState({ data, loading: false }),
      (error) => !cancelled && setState({ error, loading: false })
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

/**
 * A verse's words for the dark verse panel, with the word being recited highlighted while its recitation
 * plays. `marked` is a word index to pick out permanently (the course's sample word).
 */
export const RecitedVerseText: React.FC<{ verse: QVerse; className?: string; marked?: number; fontClass?: string }> = ({
  verse,
  className = '',
  marked,
  fontClass = 'font-quran-amiri'
}) => {
  const recited = useRecitedWord(verse.key);
  return (
    <p className={`${fontClass} arabic-text ${className}`}>
      {verse.words.map((w, i) => (
        <React.Fragment key={w.location}>
          <span
            aria-current={recited === w.position ? 'true' : undefined}
            className={`rounded transition-colors ${
              i === marked
                ? `px-1 text-emerald-950 bg-amber-300 ${recited === w.position ? 'ring-2 ring-white' : ''}`
                : // Padding inside a negative margin, so the highlight doesn't move the words around it
                  `px-1 -mx-1 ${recited === w.position ? 'text-white bg-emerald-500/45' : ''}`
            }`}
          >
            {w.arabic}
          </span>{' '}
        </React.Fragment>
      ))}
    </p>
  );
};

/**
 * A lesson's sample verse in full from Quran.com, so it can follow the recitation, with the index of the
 * lesson's word in it. Lessons quote an excerpt, but the recitation plays the whole ayah.
 */
export const useSampleVerse = (verseKey: string, highlightedWord: string) =>
  useAsync(async () => {
    const [verse, word] = await Promise.all([fetchVerse(verseKey), findWordInVerse(verseKey, highlightedWord)]);
    const marked = verse.words.findIndex((w) => w.location === word?.location);
    return { verse, marked: marked < 0 ? undefined : marked };
  }, [verseKey, highlightedWord]).data;
