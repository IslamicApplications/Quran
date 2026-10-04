import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpenText,
  ArrowLeft,
  Search,
  Play,
  Pause,
  Check,
  Highlighter,
  Languages,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import {
  getSurahVocab,
  surahCoverage,
  fetchChapterPage,
  playAudio,
  verseAudioUrl,
  englishVerseAudioUrl,
  QVerse,
  QWord,
  SurahVocab
} from '../services/quranCom';
import { AppSettings } from '../types';
import { useKnownLemmas, knownLemmasStore } from '../hooks/useKnownLemmas';
import { followRecitation } from '../hooks/useRecitedWord';
import { LoadingBlock, ErrorBlock, useAsync } from './QuranWordBits';
import { ARABIC_SIZES, AudioMode, AyahWords, BISMILLAH, Segmented, ToggleChip, WordSheet } from './ReaderParts';
import { JuzList, JuzView, juzRangeLabel, readLastJuz } from './JuzReader';

interface SurahReaderProps {
  surah?: number;
  onSelectSurah: (surah: number | undefined) => void;
  juz?: number;
  onSelectJuz: (juz: number | undefined) => void;
  settings: AppSettings;
  onOpenVerse?: (verseKey: string) => void;
  onOpenRoot?: (root: string) => void;
}

const LAST_SURAH_KEY = 'ayah-words-last-surah';
const INDEX_KEY = 'ayah-words-reader-index';
const PAGE_SIZE = 20;

const readLastSurah = (): number | null => {
  try {
    const n = Number(localStorage.getItem(LAST_SURAH_KEY));
    return n >= 1 && n <= 114 ? n : null;
  } catch {
    return null;
  }
};

const coverageTone = (pct: number) =>
  pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-stone-300 dark:bg-stone-600';

export const SurahReader: React.FC<SurahReaderProps> = (props) => {
  const vocab = useAsync(getSurahVocab, []);
  const known = useKnownLemmas();

  if (vocab.loading) return <div className="card"><LoadingBlock label="Loading surahs…" /></div>;
  if (vocab.error || !vocab.data) return <div className="card"><ErrorBlock onRetry={vocab.retry} /></div>;

  if (props.juz) return <JuzView key={props.juz} {...props} juz={props.juz} known={known} />;
  return props.surah ? (
    <SurahView key={props.surah} {...props} surah={props.surah} vocab={vocab.data[props.surah - 1]} known={known} />
  ) : (
    <SurahIndex vocab={vocab.data} known={known} onSelect={props.onSelectSurah} onSelectJuz={props.onSelectJuz} />
  );
};

// ---------------------------------------------------------------- index

const SurahIndex: React.FC<{
  vocab: SurahVocab[];
  known: ReadonlySet<string>;
  onSelect: (surah: number) => void;
  onSelectJuz: (juz: number) => void;
}> = ({ vocab, known, onSelect, onSelectJuz }) => {
  const [by, setByState] = useState<'surah' | 'juz'>(() => {
    try {
      return localStorage.getItem(INDEX_KEY) === 'juz' ? 'juz' : 'surah';
    } catch {
      return 'surah';
    }
  });
  const setBy = (v: 'surah' | 'juz') => {
    setByState(v);
    try {
      localStorage.setItem(INDEX_KEY, v);
    } catch {
      /* per-viewer convenience only */
    }
  };
  const lastJuz = readLastJuz();
  const [filter, setFilter] = useState<'all' | 'amma'>('all');
  const [sort, setSort] = useState<'mushaf' | 'coverage'>('mushaf');
  const [query, setQuery] = useState('');
  const last = readLastSurah();

  const coverage = useMemo(() => vocab.map((v) => surahCoverage(v, known) * 100), [vocab, known]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = SURAH_LIST.filter(
      (s) =>
        (filter === 'all' || s.number >= 78) &&
        (!q ||
          String(s.number) === q ||
          s.nameTransliteration.toLowerCase().includes(q) ||
          s.nameEnglish.toLowerCase().includes(q) ||
          s.nameArabic.includes(query.trim()))
    );
    return sort === 'coverage' ? [...items].sort((a, b) => coverage[b.number - 1] - coverage[a.number - 1]) : items;
  }, [filter, sort, query, coverage]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <BookOpenText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Surah Reader</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Read any surah, or the Quran juz by juz, with the words you don’t know yet highlighted. The bar under
              each surah shows how much of it you can already recognise.
            </p>
          </div>
        </div>

        <Segmented
          value={by}
          onChange={setBy}
          options={[
            { id: 'surah', label: 'By surah' },
            { id: 'juz', label: 'By juz' }
          ]}
        />

        {by === 'juz' && lastJuz && (
          <button
            onClick={() => onSelectJuz(lastJuz)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl hero-surface text-left cursor-pointer hover:brightness-110 transition"
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wide">Continue reading</div>
              <div className="font-bold">
                Juz {lastJuz}{' '}
                <span className="font-quran-amiri font-normal text-amber-200 ml-1">الجزء {lastJuz.toLocaleString('ar-EG')}</span>
              </div>
              <div className="text-xs text-emerald-100/80 truncate">{juzRangeLabel(lastJuz)}</div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        )}

        {by === 'surah' && last && (
          <button
            onClick={() => onSelect(last)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl hero-surface text-left cursor-pointer hover:brightness-110 transition"
          >
            <div>
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wide">Continue reading</div>
              <div className="font-bold">
                {last}. {SURAH_LIST[last - 1].nameTransliteration}{' '}
                <span className="font-quran-amiri font-normal text-amber-200 ml-1">{SURAH_LIST[last - 1].nameArabic}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-amber-300 tabular-nums">{Math.round(coverage[last - 1])}%</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {by === 'surah' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search surah: Mulk, 67, الملك"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 ring-1 ring-stone-200 dark:ring-stone-700 text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="flex gap-2">
              <Segmented
                value={filter}
                onChange={setFilter}
                options={[
                  { id: 'all', label: 'All 114' },
                  { id: 'amma', label: 'Juz ʿAmma' }
                ]}
              />
              <Segmented
                value={sort}
                onChange={setSort}
                options={[
                  { id: 'mushaf', label: 'In order' },
                  { id: 'coverage', label: 'Most familiar' }
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {by === 'juz' ? (
        <JuzList onSelect={onSelectJuz} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((s) => {
              const pct = coverage[s.number - 1];
              return (
                <button
                  key={s.number}
                  onClick={() => onSelect(s.number)}
                  className="card p-4 text-left hover:ring-emerald-300 dark:hover:ring-emerald-700 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700 text-sm font-bold text-stone-600 dark:text-stone-400 flex items-center justify-center tabular-nums rotate-45">
                      <span className="-rotate-45">{s.number}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 dark:text-stone-100 truncate">{s.nameTransliteration}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {s.nameEnglish} · {s.totalAyahs} ayahs
                      </div>
                    </div>
                    <span className="font-quran-amiri text-xl text-emerald-900 dark:text-emerald-200 shrink-0">{s.nameArabic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div className={`h-full rounded-full ${coverageTone(pct)}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums w-9 text-right">
                      {Math.round(pct)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {list.length === 0 && <p className="text-center text-sm text-stone-500 dark:text-stone-400">No surah matches “{query}”.</p>}
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- reading view

const SurahView: React.FC<
  SurahReaderProps & { surah: number; vocab: SurahVocab; known: ReadonlySet<string> }
> = ({ surah, vocab, known, onSelectSurah, settings, onOpenVerse, onOpenRoot }) => {
  const info = SURAH_LIST[surah - 1];
  const [verses, setVerses] = useState<QVerse[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loadError, setLoadError] = useState(false);
  const loadingRef = useRef(false);

  const [highlight, setHighlight] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [audioMode, setAudioMode] = useState<AudioMode>('arabic');
  const [playing, setPlaying] = useState<{ key: string; part: 'arabic' | 'english' } | null>(null);
  const [selected, setSelected] = useState<QWord | null>(null);
  const [showToLearn, setShowToLearn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_SURAH_KEY, String(surah));
    } catch {
      /* per-viewer convenience only */
    }
  }, [surah]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || nextPage === null) return;
    loadingRef.current = true;
    setLoadError(false);
    try {
      const page = await fetchChapterPage(surah, nextPage, PAGE_SIZE);
      setVerses((prev) => [...prev, ...page.verses]);
      setNextPage(page.nextPage);
    } catch {
      setLoadError(true);
    } finally {
      loadingRef.current = false;
    }
  }, [surah, nextPage]);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || nextPage === null || loadError) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, nextPage, loadError]);

  // ---- audio: one verse at a time, continuing through the surah
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
    (ayah: number, part: 'arabic' | 'english') => {
      const key = `${surah}:${ayah}`;
      const audio = playAudio(part === 'arabic' ? verseAudioUrl(key) : englishVerseAudioUrl(key));
      audioRef.current = audio;
      if (part === 'arabic') followRecitation(audio, key);
      setPlaying({ key, part });
      document.getElementById(`ayah-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      audio.onpause = () => audioRef.current === audio && !audio.ended && setPlaying(null);
      audio.onerror = () => audioRef.current === audio && setPlaying(null);
      audio.onended = () => {
        if (part === 'arabic' && audioMode === 'both') return playVerse(ayah, 'english');
        if (ayah < info.totalAyahs) playVerse(ayah + 1, audioMode === 'english' ? 'english' : 'arabic');
        else setPlaying(null);
      };
    },
    [surah, audioMode, info.totalAyahs]
  );

  // Keep upcoming verses loaded while continuous playback moves down the surah
  useEffect(() => {
    if (!playing) return;
    const ayah = Number(playing.key.split(':')[1]);
    if (ayah >= verses.length - 2 && nextPage !== null) loadMore();
  }, [playing, verses.length, nextPage, loadMore]);

  const toggleVerse = (ayah: number) => {
    if (playing?.key === `${surah}:${ayah}`) return stopAudio();
    playVerse(ayah, audioMode === 'english' ? 'english' : 'arabic');
  };

  const pct = surahCoverage(vocab, known) * 100;
  const knownTokens = Math.round((pct / 100) * vocab.total);
  const toLearn = vocab.lemmas.filter(([lemma]) => !known.has(lemma));
  const arabicFont = settings.arabicFontFamily === 'scheherazade' ? 'font-quran-scheherazade' : 'font-quran-amiri';

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button
        onClick={() => onSelectSurah(undefined)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> All surahs
      </button>

      {/* Surah header */}
      <section className="verse-panel rounded-3xl p-6 sm:p-8 text-center space-y-4">
        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.12em]">
          Surah {info.number} · {info.revelationType} · {info.totalAyahs} ayahs
        </div>
        <div className="font-quran-amiri text-5xl text-amber-200 leading-snug">{info.nameArabic}</div>
        <div>
          <div className="text-xl font-bold text-white">{info.nameTransliteration}</div>
          <div className="text-sm text-emerald-200/80">{info.nameEnglish}</div>
        </div>
        <div className="max-w-sm mx-auto space-y-1.5 pt-1">
          <div className="h-2 rounded-full bg-emerald-950/70 ring-1 ring-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-emerald-100">
            You recognise <strong className="text-amber-300">{Math.round(pct)}%</strong> of this surah ·{' '}
            {knownTokens.toLocaleString()} of {vocab.total.toLocaleString()} words
          </div>
        </div>
      </section>

      {/* Words to learn */}
      {toLearn.length > 0 && (
        <div className="card overflow-hidden">
          <button
            onClick={() => setShowToLearn(!showToLearn)}
            aria-expanded={showToLearn}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
          >
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">Words to learn for this surah</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {toLearn.length} unknown word{toLearn.length === 1 ? '' : 's'}, most frequent first. Learning the top
                10 would lift you to{' '}
                {Math.round(
                  ((knownTokens + toLearn.slice(0, 10).reduce((sum, [, n]) => sum + n, 0)) / vocab.total) * 100
                )}
                %.
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${showToLearn ? 'rotate-180' : ''}`} />
          </button>
          {showToLearn && (
            <div className="px-5 pb-5 flex flex-wrap gap-2 animate-fadeIn">
              {toLearn.slice(0, 30).map(([lemma, n]) => (
                <button
                  key={lemma}
                  onClick={() => knownLemmasStore.add(lemma)}
                  title="Mark as known"
                  className="group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/25 hover:ring-emerald-300 dark:hover:ring-emerald-700 cursor-pointer"
                >
                  <span className="font-quran-amiri text-lg font-bold text-stone-900 dark:text-stone-100">{lemma}</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 tabular-nums">{n}×</span>
                  <Check className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reading controls */}
      <div className="glass sticky top-16 z-20 -mx-1 px-1 py-2 flex flex-wrap items-center gap-2 rounded-2xl">
        <ToggleChip active={highlight} onClick={() => setHighlight(!highlight)} icon={Highlighter} label="Highlight unknown" />
        <ToggleChip active={showTranslation} onClick={() => setShowTranslation(!showTranslation)} icon={Languages} label="Translation" />
        <div className="ml-auto flex items-center gap-2">
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
            onClick={() => (playing ? stopAudio() : playVerse(1, audioMode === 'english' ? 'english' : 'arabic'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {playing ? 'Stop' : 'Play surah'}
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="card p-4 sm:p-8">
        {surah !== 1 && surah !== 9 && (
          <p className={`${arabicFont} text-3xl text-center text-emerald-900 dark:text-emerald-200 pb-6 mb-2 border-b border-stone-100 dark:border-stone-800`} dir="rtl">
            {BISMILLAH}
          </p>
        )}

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {verses.map((v) => {
            const isPlaying = playing?.key === v.key;
            return (
              <div
                key={v.key}
                id={`ayah-${v.key}`}
                className={`py-5 scroll-mt-40 transition-colors rounded-xl ${isPlaying ? 'bg-emerald-50/70 dark:bg-emerald-950/25 -mx-3 px-3' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-2 pt-2 shrink-0">
                    <span className="w-8 h-8 rounded-full ring-1 ring-emerald-200 dark:ring-emerald-800 bg-emerald-50 dark:bg-emerald-950/25 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center tabular-nums">
                      {v.ayah}
                    </span>
                    <button
                      onClick={() => toggleVerse(v.ayah)}
                      aria-label={isPlaying ? `Stop ayah ${v.ayah}` : `Play ayah ${v.ayah}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        isPlaying ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/25'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 space-y-3">
                    <AyahWords
                      verse={v}
                      className={`${arabicFont} ${ARABIC_SIZES[settings.arabicFontSize]}`}
                      known={known}
                      highlightUnknown={highlight}
                      selectedLocation={selected?.location}
                      onSelect={setSelected}
                    />
                    {showTranslation && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        {playing?.key === v.key && playing.part === 'english' && (
                          <span className="inline-block mr-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                            Playing
                          </span>
                        )}
                        {v.translation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loadError ? (
          <ErrorBlock onRetry={loadMore} />
        ) : nextPage !== null ? (
          <div ref={sentinelRef}>
            <LoadingBlock label={verses.length ? 'Loading more ayahs…' : 'Loading surah…'} />
          </div>
        ) : (
          <div className="pt-6 text-center text-xs text-stone-400">
            End of Surah {info.nameTransliteration}
            {surah < 114 && (
              <button
                onClick={() => onSelectSurah(surah + 1)}
                className="block mx-auto mt-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
              >
                Next: {SURAH_LIST[surah].nameTransliteration} →
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-[11px] text-stone-400 text-center pb-24">
        Text &amp; translation (Saheeh International): Quran.com · Arabic audio: Mishary Rashid Alafasy · English
        audio: Ibrahim Walk (EveryAyah.com) · Word data: Quranic Arabic Corpus
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
