import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Play, Pause, Highlighter, Languages, Type, ScrollText } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { playAudio, englishVerseAudioUrl, fetchVerse, QWord } from '../services/quranCom';
import { reciterAudioUrl, reciterName, reciterStore, useReciter } from '../services/reciters';
import { fetchJuz, JUZ_RANGES, TRANSLATIONS, TranslationId } from '../services/ummahApi';
import { AppSettings } from '../types';
import { followRecitation } from '../hooks/useRecitedWord';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';
import { ARABIC_SIZES, AudioMode, AyahWords, BISMILLAH, Segmented, ToggleChip, WordSheet } from './ReaderParts';
import { ReciterSelect } from './ReciterSelect';
import { TafsirPanel } from './TafsirPanel';
import { VerseBookmarkButton, VerseNote } from './VerseBookmark';

const LAST_JUZ_KEY = 'ayah-words-last-juz';
const TRANSLATION_KEY = 'ayah-words-juz-translation';
const BATCH = 30;

export const readLastJuz = (): number | null => {
  try {
    const n = Number(localStorage.getItem(LAST_JUZ_KEY));
    return n >= 1 && n <= 30 ? n : null;
  } catch {
    return null;
  }
};

// The app language's translation, for a reader who hasn't picked one here
const BY_LANGUAGE: Partial<Record<string, TranslationId>> = {
  id: 'indonesian',
  fr: 'french',
  ur: 'urdu',
  tr: 'turkish',
  de: 'german'
};

const readTranslation = (language: string): TranslationId => {
  const fallback = BY_LANGUAGE[language] ?? 'sahih_international';
  try {
    const id = localStorage.getItem(TRANSLATION_KEY);
    return TRANSLATIONS.find((t) => t.id === id)?.id ?? fallback;
  } catch {
    return fallback;
  }
};

const surahName = (key: string) => SURAH_LIST[Number(key.split(':')[0]) - 1].nameTransliteration;

/** "Al-Fatihah 1:1 – Al-Baqarah 2:141" */
export const juzRangeLabel = (juz: number) => {
  const [from, to] = JUZ_RANGES[juz - 1];
  return `${surahName(from)} ${from} – ${surahName(to)} ${to}`;
};

// ---------------------------------------------------------------- index

export const JuzList: React.FC<{ onSelect: (juz: number) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {JUZ_RANGES.map(([from, to], i) => (
      <button
        key={i}
        onClick={() => onSelect(i + 1)}
        className="card p-4 text-left hover:ring-emerald-300 dark:hover:ring-emerald-700 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 shrink-0 rounded-xl bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700 text-sm font-bold text-stone-600 dark:text-stone-400 flex items-center justify-center tabular-nums rotate-45">
            <span className="-rotate-45">{i + 1}</span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-stone-900 dark:text-stone-100">Juz {i + 1}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {surahName(from)} {from} – {surahName(to)} {to}
            </div>
          </div>
          <span className="font-quran-amiri text-xl text-emerald-900 dark:text-emerald-200 shrink-0">
            الجزء {(i + 1).toLocaleString('ar-EG')}
          </span>
        </div>
      </button>
    ))}
  </div>
);

// ---------------------------------------------------------------- reading view

export const JuzView: React.FC<{
  juz: number;
  known: ReadonlySet<string>;
  settings: AppSettings;
  onSelectJuz: (juz: number | undefined) => void;
  onOpenVerse?: (verseKey: string) => void;
  onOpenRoot?: (root: string) => void;
}> = ({ juz, known, settings, onSelectJuz, onOpenVerse, onOpenRoot }) => {
  const { data: verses, error, retry } = useAsync(() => fetchJuz(juz), [juz]);

  const [highlight, setHighlight] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [translationId, setTranslationId] = useState<TranslationId>(() => readTranslation(settings.language));
  const [audioMode, setAudioMode] = useState<AudioMode>('arabic');
  const [playing, setPlaying] = useState<{ index: number; part: 'arabic' | 'english' } | null>(null);
  const [selected, setSelected] = useState<QWord | null>(null);
  const [shown, setShown] = useState(BATCH);
  const reciter = useReciter();
  const [tafsirKey, setTafsirKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_JUZ_KEY, String(juz));
    } catch {
      /* per-viewer convenience only */
    }
  }, [juz]);

  const chooseTranslation = (id: TranslationId) => {
    setTranslationId(id);
    try {
      localStorage.setItem(TRANSLATION_KEY, id);
    } catch {
      /* per-viewer convenience only */
    }
  };

  // Words from UmmahAPI carry the corpus data but no meaning or audio; fill those in from Quran.com
  const selectWord = useCallback((word: QWord | null) => {
    setSelected(word);
    if (!word) return;
    fetchVerse(word.location.split(':').slice(0, 2).join(':'))
      .then((v) => {
        const full = v.words.find((w) => w.location === word.location);
        if (full) setSelected((cur) => (cur?.location === word.location ? full : cur));
      })
      .catch(() => undefined); // the sheet still shows the corpus data
  }, []);

  // Render the juz in batches as the reader scrolls
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = verses?.length ?? 0;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || shown >= total) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && setShown((n) => n + BATCH), {
      rootMargin: '800px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, total]);

  // ---- audio: one verse at a time, continuing through the juz
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onpause = null;
      audioRef.current.pause();
    }
    audioRef.current = null;
    setPlaying(null);
  }, []);

  useEffect(() => stopAudio, [stopAudio]);

  const playVerse = useCallback(
    (index: number, part: 'arabic' | 'english') => {
      if (!verses) return;
      const key = verses[index].key;
      // Read at play time, so a reciter chosen mid-juz takes over from the next verse
      const reciter = reciterStore.get();
      const audio = playAudio(part === 'arabic' ? reciterAudioUrl(key, reciter) : englishVerseAudioUrl(key));
      audioRef.current = audio;
      if (part === 'arabic') followRecitation(audio, key, reciter, verses[index].words.map((w) => w.arabic));
      setPlaying({ index, part });
      setShown((n) => Math.max(n, index + BATCH / 3));
      requestAnimationFrame(() =>
        document.getElementById(`ayah-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
      audio.onpause = () => audioRef.current === audio && !audio.ended && setPlaying(null);
      audio.onerror = () => audioRef.current === audio && setPlaying(null);
      audio.onended = () => {
        if (part === 'arabic' && audioMode === 'both') return playVerse(index, 'english');
        if (index < verses.length - 1) playVerse(index + 1, audioMode === 'english' ? 'english' : 'arabic');
        else setPlaying(null);
      };
    },
    [verses, audioMode]
  );

  const toggleVerse = (index: number) => {
    if (playing?.index === index) return stopAudio();
    playVerse(index, audioMode === 'english' ? 'english' : 'arabic');
  };

  const pct = useMemo(() => {
    let words = 0;
    let covered = 0;
    for (const v of verses || [])
      for (const w of v.words)
        if (w.lemma) {
          words++;
          if (known.has(w.lemma)) covered++;
        }
    return { words, covered, pct: words ? (covered / words) * 100 : 0 };
  }, [verses, known]);

  const arabicFont = settings.arabicFontFamily === 'scheherazade' ? 'font-quran-scheherazade' : 'font-quran-amiri';
  const translation = TRANSLATIONS.find((t) => t.id === translationId)!;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button
        onClick={() => onSelectJuz(undefined)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> All juz
      </button>

      {/* Juz header */}
      <section className="verse-panel rounded-3xl p-6 sm:p-8 text-center space-y-4">
        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.12em]">
          Juz {juz} of 30{verses ? ` · ${verses.length} ayahs` : ''}
        </div>
        <div className="font-quran-amiri text-5xl text-amber-200 leading-snug">الجزء {juz.toLocaleString('ar-EG')}</div>
        <div className="text-sm text-emerald-100">{juzRangeLabel(juz)}</div>
        {verses && (
          <div className="max-w-sm mx-auto space-y-1.5 pt-1">
            <div className="h-2 rounded-full bg-emerald-950/70 ring-1 ring-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
                style={{ width: `${pct.pct}%` }}
              />
            </div>
            <div className="text-xs text-emerald-100">
              You recognise <strong className="text-amber-300">{Math.round(pct.pct)}%</strong> of this juz ·{' '}
              {pct.covered.toLocaleString()} of {pct.words.toLocaleString()} words
            </div>
          </div>
        )}
      </section>

      {/* Reading controls */}
      <div className="glass sticky top-16 z-20 -mx-1 px-1 py-2 flex flex-wrap items-center gap-2 rounded-2xl">
        <ToggleChip active={highlight} onClick={() => setHighlight(!highlight)} icon={Highlighter} label="Highlight unknown" />
        <ToggleChip active={showTranslation} onClick={() => setShowTranslation(!showTranslation)} icon={Languages} label="Translation" />
        <ToggleChip
          active={showTransliteration}
          onClick={() => setShowTransliteration(!showTransliteration)}
          icon={Type}
          label="Transliteration"
        />
        {showTranslation && (
          <select
            value={translationId}
            onChange={(e) => chooseTranslation(e.target.value as TranslationId)}
            aria-label="Translation"
            className="text-xs font-semibold px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer max-w-[12rem]"
          >
            {TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* A verse playing in Arabic restarts in the new voice */}
          <ReciterSelect onChange={() => playing?.part === 'arabic' && playVerse(playing.index, 'arabic')} />
          <Segmented
            value={audioMode}
            onChange={(m) => {
              stopAudio();
              setAudioMode(m);
            }}
            options={[
              { id: 'arabic', label: 'Arabic' },
              { id: 'english', label: 'English' },
              { id: 'both', label: 'Both' }
            ]}
          />
          <button
            onClick={() => (playing ? stopAudio() : playVerse(0, audioMode === 'english' ? 'english' : 'arabic'))}
            disabled={!verses}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {playing ? 'Stop' : 'Play juz'}
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="card p-4 sm:p-8">
        {error ? (
          <ErrorBlock message="Could not load this juz from UmmahAPI. Check your connection and try again." onRetry={retry} />
        ) : !verses ? (
          <LoadingBlock label={`Loading Juz ${juz}…`} />
        ) : (
          <>
            {verses.slice(0, shown).map((v, i) => {
              const isPlaying = playing?.index === i;
              const startsSurah = i === 0 || v.surah !== verses[i - 1].surah;
              const info = SURAH_LIST[v.surah - 1];
              return (
                <React.Fragment key={v.key}>
                  {startsSurah && (
                    <div className={`text-center space-y-2 pb-4 ${i > 0 ? 'pt-8 border-t-2 border-emerald-100 dark:border-emerald-900/60' : ''}`}>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                        Surah {info.number} · {info.nameTransliteration}
                        {v.ayah > 1 && ` · from ayah ${v.ayah}`}
                      </div>
                      <div className="font-quran-amiri text-3xl text-emerald-900 dark:text-emerald-200">{info.nameArabic}</div>
                      {v.ayah === 1 && v.surah !== 1 && v.surah !== 9 && (
                        <p className={`${arabicFont} text-2xl text-emerald-900 dark:text-emerald-200 pt-2`} dir="rtl">
                          {BISMILLAH}
                        </p>
                      )}
                    </div>
                  )}
                  <div
                    id={`ayah-${v.key}`}
                    className={`py-5 scroll-mt-40 transition-colors rounded-xl border-t border-stone-100 dark:border-stone-800 ${
                      isPlaying ? 'bg-emerald-50/70 dark:bg-emerald-950/25 -mx-3 px-3' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-2 pt-2 shrink-0 w-12">
                        <span className="px-1.5 h-8 min-w-8 rounded-full ring-1 ring-emerald-200 dark:ring-emerald-800 bg-emerald-50 dark:bg-emerald-950/25 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center tabular-nums">
                          {v.key}
                        </span>
                        <button
                          onClick={() => toggleVerse(i)}
                          aria-label={isPlaying ? `Stop ayah ${v.key}` : `Play ayah ${v.key}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            isPlaying ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/25'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setTafsirKey(tafsirKey === v.key ? null : v.key)}
                          aria-label={`Tafsir of ayah ${v.key}`}
                          aria-expanded={tafsirKey === v.key}
                          title="Tafsir"
                          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            tafsirKey === v.key ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' : 'text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/25'
                          }`}
                        >
                          <ScrollText className="w-3.5 h-3.5" />
                        </button>
                        <VerseBookmarkButton verseKey={v.key} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        {v.aligned ? (
                          <AyahWords
                            verse={v}
                            className={`${arabicFont} ${ARABIC_SIZES[settings.arabicFontSize]} quran-sized`}
                            known={known}
                            highlightUnknown={highlight}
                            selectedLocation={selected?.location}
                            onSelect={selectWord}
                          />
                        ) : (
                          <p dir="rtl" className={`${arabicFont} ${ARABIC_SIZES[settings.arabicFontSize]} quran-sized leading-[2.3] text-right text-stone-900 dark:text-stone-100`}>
                            {v.arabic}{' '}
                            <span className="text-emerald-700/70 dark:text-emerald-300 text-[0.7em] select-none">﴿{v.ayah.toLocaleString('ar-EG')}﴾</span>
                          </p>
                        )}
                        {showTransliteration && v.transliteration && (
                          <p className="text-sm italic text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">{v.transliteration}</p>
                        )}
                        {showTranslation && (
                          <p
                            dir={'rtl' in translation ? 'rtl' : undefined}
                            className={`text-stone-600 dark:text-stone-400 leading-relaxed ${'rtl' in translation ? 'text-base text-right' : 'text-sm'}`}
                          >
                            {isPlaying && playing?.part === 'english' && (
                              <span className="inline-block mr-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                                Playing
                              </span>
                            )}
                            {v.translations[translationId] || v.translation}
                          </p>
                        )}
                        <VerseNote verseKey={v.key} />
                        {tafsirKey === v.key && <TafsirPanel verseKey={v.key} className="animate-fadeIn" />}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {shown < verses.length ? (
              <div ref={sentinelRef}>
                <LoadingBlock label="Loading more ayahs…" />
              </div>
            ) : (
              <div className="pt-6 flex items-center justify-between gap-3 text-sm font-semibold border-t border-stone-100 dark:border-stone-800">
                {juz > 1 ? (
                  <button
                    onClick={() => onSelectJuz(juz - 1)}
                    className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Juz {juz - 1}
                  </button>
                ) : (
                  <span />
                )}
                <span className="text-xs font-normal text-stone-400">End of Juz {juz}</span>
                {juz < 30 ? (
                  <button
                    onClick={() => onSelectJuz(juz + 1)}
                    className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
                  >
                    Juz {juz + 1} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-[11px] text-stone-400 text-center pb-24">
        Text, transliteration &amp; translations: UmmahAPI · Arabic audio: {reciterName(reciter)} · English audio:
        Ibrahim Walk (EveryAyah.com) · Word data: Quranic Arabic Corpus, meanings from Quran.com
      </p>

      {selected &&
        createPortal(
          <WordSheet
            word={selected}
            isKnown={!!selected.lemma && known.has(selected.lemma)}
            onClose={() => setSelected(null)}
            onOpenVerse={onOpenVerse}
            onOpenRoot={onOpenRoot}
          />,
          document.body
        )}
    </div>
  );
};
