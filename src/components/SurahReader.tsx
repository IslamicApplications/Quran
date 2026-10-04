import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpenText,
  ArrowLeft,
  Search,
  Play,
  Pause,
  Check,
  X,
  Highlighter,
  Languages,
  BookMarked,
  Layers,
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
  formatRoot,
  describeTag,
  QVerse,
  QWord,
  SurahVocab
} from '../services/quranCom';
import { AppSettings } from '../types';
import { useKnownLemmas, knownLemmasStore } from '../hooks/useKnownLemmas';
import { followRecitation, useRecitedWord } from '../hooks/useRecitedWord';
import { LoadingBlock, ErrorBlock, useAsync, WordAudioButton } from './QuranWordBits';

interface SurahReaderProps {
  surah?: number;
  onSelectSurah: (surah: number | undefined) => void;
  settings: AppSettings;
  onOpenVerse?: (verseKey: string) => void;
  onOpenRoot?: (root: string) => void;
}

const LAST_SURAH_KEY = 'ayah-words-last-surah';
const PAGE_SIZE = 20;
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

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

  return props.surah ? (
    <SurahView key={props.surah} {...props} surah={props.surah} vocab={vocab.data[props.surah - 1]} known={known} />
  ) : (
    <SurahIndex vocab={vocab.data} known={known} onSelect={props.onSelectSurah} />
  );
};

// ---------------------------------------------------------------- index

const SurahIndex: React.FC<{
  vocab: SurahVocab[];
  known: ReadonlySet<string>;
  onSelect: (surah: number) => void;
}> = ({ vocab, known, onSelect }) => {
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
              Read any surah with the words you don’t know yet highlighted. The bar under each surah shows how much of
              it you can already recognise.
            </p>
          </div>
        </div>

        {last && (
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
      </div>

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
    </div>
  );
};

function Segmented<T extends string>({
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

// ---------------------------------------------------------------- reading view

type AudioMode = 'arabic' | 'english' | 'both';

const ARABIC_SIZES: Record<AppSettings['arabicFontSize'], string> = {
  md: 'text-2xl sm:text-[1.7rem]',
  lg: 'text-[1.7rem] sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
  '2xl': 'text-4xl sm:text-5xl'
};

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

const ToggleChip: React.FC<{
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

const WordSheet: React.FC<{
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
              <div className="font-bold text-stone-900 dark:text-stone-100 truncate">{word.translation}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {word.transliteration} · {word.location}
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
const AyahWords = React.memo(function AyahWords({
  verse,
  className,
  known,
  highlightUnknown,
  selectedLocation,
  onSelect
}: {
  verse: QVerse;
  className: string;
  known: ReadonlySet<string>;
  highlightUnknown: boolean;
  selectedLocation?: string;
  onSelect: React.Dispatch<React.SetStateAction<QWord | null>>;
}) {
  const recited = useRecitedWord(verse.key);
  return (
    <p dir="rtl" className={`${className} leading-[2.3] text-right`}>
      {verse.words.map((w) => {
        const isKnown = !!w.lemma && known.has(w.lemma);
        const isSelected = selectedLocation === w.location;
        return (
          <React.Fragment key={w.location}>
            <button
              onClick={() => onSelect(isSelected ? null : w)}
              aria-current={recited === w.position ? 'true' : undefined}
              className={`rounded-md px-0.5 leading-[1.5] align-baseline transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white'
                  : recited === w.position
                  ? 'bg-emerald-200 dark:bg-emerald-700/70 text-emerald-950 dark:text-white'
                  : highlightUnknown && !isKnown
                  ? 'text-amber-900 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-900/25 hover:bg-amber-200/70 dark:hover:bg-amber-800/50'
                  : 'text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {w.arabic}
            </button>{' '}
          </React.Fragment>
        );
      })}
      <span className="text-emerald-700/70 dark:text-emerald-300 text-[0.7em] select-none">﴿{verse.ayah.toLocaleString('ar-EG')}﴾</span>
    </p>
  );
});
