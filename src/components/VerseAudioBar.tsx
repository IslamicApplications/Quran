import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Loader2, Languages } from 'lucide-react';
import { playAudio, translationAudio } from '../services/quranCom';
import { reciterAudioUrl, reciterName, useReciter } from '../services/reciters';
import { ReciterSelect } from './ReciterSelect';
import { followRecitation } from '../hooks/useRecitedWord';

type Mode = 'arabic' | 'english' | 'both';

interface VerseAudioBarProps {
  verseKey: string;
  /** Arabic recitation URL; defaults to the reciter chosen in the app. */
  arabicUrl?: string;
  arabicReciter?: string;
}

/** The audio choices, naming the language the chosen translation is spoken in */
const modesFor = (spoken: string): { id: Mode; label: string }[] => [
  { id: 'arabic', label: 'Arabic' },
  { id: 'english', label: spoken },
  { id: 'both', label: `Arabic + ${spoken}` }
];

/**
 * Verse recitation with a spoken translation: the chosen QuranEnc translation's own recording where it has one,
 * else Saheeh International in English, read by Ibrahim Walk (EveryAyah.com). "Arabic + …" plays the recitation
 * and then its translation, useful for listening practice.
 */
export const VerseAudioBar: React.FC<VerseAudioBarProps> = ({
  verseKey,
  arabicUrl,
  arabicReciter: lessonReciter
}) => {
  const reciter = useReciter();
  const arabicReciter = arabicUrl ? lessonReciter || 'Reciter' : reciterName(reciter);
  const [mode, setMode] = useState<Mode>('arabic');
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [part, setPart] = useState<'arabic' | 'english'>('arabic');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const arabic = arabicUrl || reciterAudioUrl(verseKey, reciter);
  const spokenTranslation = translationAudio(verseKey);
  const english = spokenTranslation.url;
  const MODES = modesFor(spokenTranslation.language);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onpause = null;
      audioRef.current.pause();
    }
    audioRef.current = null;
    setStatus('idle');
  };

  // Stop when the verse or reciter changes, or the bar unmounts
  useEffect(() => stop, [verseKey, reciter]);

  const playPart = (which: 'arabic' | 'english', thenEnglish: boolean) => {
    const audio = playAudio(which === 'arabic' ? arabic : english);
    audioRef.current = audio;
    // A lesson's own recording has no word timings to follow
    if (which === 'arabic' && !arabicUrl) followRecitation(audio, verseKey, reciter);
    setPart(which);
    setStatus('loading');
    audio.onplaying = () => setStatus('playing');
    audio.onerror = () => audioRef.current === audio && setStatus('error');
    // Another clip elsewhere in the app took over
    audio.onpause = () => audioRef.current === audio && !audio.ended && setStatus('idle');
    audio.onended = () => {
      if (thenEnglish && which === 'arabic') playPart('english', false);
      else setStatus('idle');
    };
  };

  const toggle = () => {
    if (status === 'playing' || status === 'loading') return stop();
    if (mode === 'english') playPart('english', false);
    else playPart('arabic', mode === 'both');
  };

  const nowPlaying =
    part === 'arabic' ? `${arabicReciter} (Arabic)` : `${spokenTranslation.reader} (${spokenTranslation.language})`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-2 pe-3 rounded-2xl bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-700/80 text-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
            status === 'playing' || status === 'loading'
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
          }`}
          aria-label={status === 'playing' ? 'Stop recitation' : 'Play recitation'}
        >
          {status === 'loading' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : status === 'playing' ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>{status === 'playing' || status === 'loading' ? 'Stop' : 'Listen'}</span>
        </button>
        <div className="min-w-0">
          <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
            {status === 'idle' ? (mode === 'english' ? spokenTranslation.reader : arabicReciter) : nowPlaying}
          </div>
          <div className={`text-[11px] ${status === 'error' ? 'text-amber-700 dark:text-amber-300' : 'text-stone-500 dark:text-stone-400'}`}>
            {status === 'error'
              ? 'Audio unavailable right now'
              : mode === 'arabic'
              ? 'Arabic recitation'
              : mode === 'english'
              ? `Spoken translation (${spokenTranslation.language})`
              : `Recitation, then the ${spokenTranslation.language} translation`}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!arabicUrl && <ReciterSelect />}
        <div
          role="radiogroup"
          aria-label="Audio language"
          className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 ring-1 ring-stone-200/70 dark:ring-stone-700/70"
        >
          <Languages className="w-3.5 h-3.5 text-stone-400 mx-1" />
          {MODES.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => {
                stop();
                setMode(m.id);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                mode === m.id ? 'bg-white dark:bg-stone-900 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
