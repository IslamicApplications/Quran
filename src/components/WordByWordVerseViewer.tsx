import React, { useEffect, useMemo, useState } from 'react';
import { Layers, ChevronLeft, ChevronRight, Sparkles, BookMarked, ChevronDown, ScrollText } from 'lucide-react';
import { VERSE_TREEBANKS } from '../data/corpusData';
import { SURAH_LIST } from '../data/surahList';
import { fetchVerse, getRootIndex, formatRoot, describeTag, translationSource, contentLanguage, QWord } from '../services/quranCom';
import { TranslationSelect } from './TranslationSelect';
import { VerseAudioBar } from './VerseAudioBar';
import { TagBadge, WordAudioButton, LoadingBlock, ErrorBlock, useAsync, RecitedVerseText } from './QuranWordBits';
import { useRecitedWord } from '../hooks/useRecitedWord';
import { TafsirPanel } from './TafsirPanel';

interface WordByWordVerseViewerProps {
  verseKey?: string;
  onVerseChange?: (key: string) => void;
  onOpenRoot?: (root: string) => void;
  onOpenSurah?: (surah: number) => void;
}

const parseKey = (key?: string) => {
  const [s, a] = (key || '1:1').split(':').map(Number);
  const surah = SURAH_LIST.find((x) => x.number === s) ? s : 1;
  const max = SURAH_LIST[surah - 1].totalAyahs;
  return { surah, ayah: a >= 1 && a <= max ? a : 1 };
};

const selectClass =
  'appearance-none pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer';

export const WordByWordVerseViewer: React.FC<WordByWordVerseViewerProps> = ({
  verseKey,
  onVerseChange,
  onOpenRoot,
  onOpenSurah
}) => {
  const [{ surah, ayah }, setPos] = useState(() => parseKey(verseKey));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // Commentary can run to 88 KB a verse: load it only once asked for, then keep it open while browsing
  const [showTafsir, setShowTafsir] = useState(false);
  const key = `${surah}:${ayah}`;
  const surahInfo = SURAH_LIST[surah - 1];

  useEffect(() => {
    if (verseKey && verseKey !== key) setPos(parseKey(verseKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verseKey]);

  useEffect(() => {
    setSelectedIndex(null);
    onVerseChange?.(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const { data: verse, loading, error, retry } = useAsync(() => fetchVerse(key), [key]);
  const isCurrent = verse?.key === key;
  const curated = useMemo(
    () => VERSE_TREEBANKS.find((v) => v.surahNumber === surah && v.ayahNumber === ayah),
    [surah, ayah]
  );

  const goTo = (s: number, a: number) => setPos({ surah: s, ayah: a });
  const prev = () => (ayah > 1 ? goTo(surah, ayah - 1) : surah > 1 && goTo(surah - 1, SURAH_LIST[surah - 2].totalAyahs));
  const next = () =>
    ayah < surahInfo.totalAyahs ? goTo(surah, ayah + 1) : surah < 114 && goTo(surah + 1, 1);

  const recited = useRecitedWord(verse?.key);
  const selectedWord = isCurrent && selectedIndex !== null ? verse?.words[selectedIndex] : undefined;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header + verse picker */}
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Word by Word</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Any verse of the Quran, with each word’s meaning, root, grammar and pronunciation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={surah}
              onChange={(e) => goTo(Number(e.target.value), 1)}
              className={`${selectClass} w-full`}
              aria-label="Surah"
            >
              {SURAH_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameTransliteration} — {s.nameArabic}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={ayah}
              onChange={(e) => goTo(surah, Number(e.target.value))}
              className={selectClass}
              aria-label="Ayah"
            >
              {Array.from({ length: surahInfo.totalAyahs }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Ayah {i + 1}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              disabled={surah === 1 && ayah === 1}
              className="p-2 rounded-xl ring-1 ring-stone-200 dark:ring-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous verse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={surah === 114 && ayah === surahInfo.totalAyahs}
              className="p-2 rounded-xl ring-1 ring-stone-200 dark:ring-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next verse"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-8 space-y-6">
        {loading && !verse ? (
          <LoadingBlock label="Loading verse…" />
        ) : error && !isCurrent ? (
          <ErrorBlock onRetry={retry} />
        ) : verse ? (
          <div className={`space-y-6 transition-opacity ${isCurrent ? '' : 'opacity-50'}`}>
            {/* Verse */}
            <div className="verse-panel rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-emerald-300 border-b border-emerald-800/80 pb-2">
                <span className="font-semibold">
                  {surahInfo.nameTransliteration} · {verse.key} · Juz {verse.juz}
                </span>
                <span className="font-quran-amiri text-base">{surahInfo.nameArabic}</span>
              </div>
              <RecitedVerseText verse={verse} className="text-3xl sm:text-4xl text-amber-100 leading-loose" />
              <p className="text-sm text-emerald-100 italic pt-2 border-t border-emerald-800/60">
                <span dir="auto">“{verse.translation}”</span>
                <span className="not-italic text-emerald-400 text-xs ml-2">— {translationSource().name}</span>
              </p>
              {verse.translationNotes && (
                <p dir="auto" className="text-xs text-emerald-200/80 whitespace-pre-line">{verse.translationNotes}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <TranslationSelect language={contentLanguage()} />
            </div>
            <VerseAudioBar verseKey={verse.key} />

            {onOpenSurah && (
              <button
                onClick={() => onOpenSurah(surah)}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
              >
                Read the whole of Surah {surahInfo.nameTransliteration} →
              </button>
            )}

            {/* Word grid (reads right to left) */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400 mb-3">
                Tap a word to inspect it
              </h3>
              <div dir="rtl" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {verse.words.map((w, idx) => (
                  <WordCard
                    key={w.location}
                    word={w}
                    selected={selectedIndex === idx}
                    recited={recited === w.position}
                    onSelect={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                  />
                ))}
              </div>
            </div>

            {selectedWord && (
              <WordDetail word={selectedWord} curated={curated} onOpenRoot={onOpenRoot} />
            )}

            {curated && (
              <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl ring-1 ring-amber-200/70 dark:ring-amber-900/60 text-xs text-stone-700 dark:text-stone-300 space-y-1.5">
                <strong className="text-amber-950 dark:text-amber-100 font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  <span>Verse syntax overview (الإعراب الإجمالي)</span>
                </strong>
                <p className="arabic-text font-quran-amiri text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                  {curated.summaryIrab}
                </p>
              </div>
            )}

            {showTafsir ? (
              <TafsirPanel verseKey={verse.key} />
            ) : (
              <button
                onClick={() => setShowTafsir(true)}
                className="w-full card p-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 cursor-pointer"
              >
                <ScrollText className="w-4 h-4" /> Show tafsir of {verse.key}
              </button>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-[11px] text-stone-400 text-center">
        Text, word meanings and audio: Quran.com · Roots &amp; grammar: Quranic Arabic Corpus (GPL-3.0)
      </p>
    </div>
  );
};

const WordCard: React.FC<{ word: QWord; selected: boolean; recited: boolean; onSelect: () => void }> = ({
  word,
  selected,
  recited,
  onSelect
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
    className={`relative p-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ring-1 ${
      selected
        ? 'bg-amber-50 dark:bg-amber-950/20 ring-2 ring-emerald-600 shadow-sm'
        : recited
        ? 'bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-400 dark:ring-emerald-600'
        : 'bg-stone-50 dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 hover:bg-white dark:hover:bg-stone-900 hover:ring-emerald-300 dark:hover:ring-emerald-700'
    }`}
  >
    <WordAudioButton url={word.audioUrl} className="absolute top-2 left-2" />
    <span className="absolute top-2.5 right-3 text-[10px] text-stone-400" dir="ltr">
      {word.position}
    </span>
    <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100 mt-3 leading-relaxed">{word.arabic}</div>
    <div dir="ltr" className="space-y-0.5">
      <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">{word.transliteration}</div>
      <div dir="auto" className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug">{word.translation}</div>
    </div>
    <div dir="ltr" className="flex flex-wrap items-center justify-center gap-1 pt-1">
      {word.root && (
        <span className="text-[11px] font-quran-amiri font-bold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-2 rounded-full">
          {formatRoot(word.root)}
        </span>
      )}
      <TagBadge tag={word.tag} short />
    </div>
  </div>
);

const WordDetail: React.FC<{
  word: QWord;
  curated?: (typeof VERSE_TREEBANKS)[number];
  onOpenRoot?: (root: string) => void;
}> = ({ word, curated, onOpenRoot }) => {
  const { data: rootIndex } = useAsync(() => (word.root ? getRootIndex() : Promise.resolve(null)), [word.root]);
  const rootInfo = word.root ? rootIndex?.[word.root] : undefined;
  const lemmaCount = word.lemma && rootInfo?.l[word.lemma]?.length;
  const curatedToken = curated?.tokens.find((t) => t.location === word.location);

  return (
    <div className="rounded-2xl ring-1 ring-emerald-200 dark:ring-emerald-800 bg-gradient-to-br from-emerald-50/70 dark:from-emerald-950/30 to-white dark:to-stone-900 p-5 space-y-4 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <span className="font-quran-amiri text-4xl font-bold text-emerald-950 dark:text-emerald-100">{word.arabic}</span>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100">
              {word.transliteration} — “{word.translation}”
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Word {word.location}</div>
          </div>
        </div>
        <WordAudioButton url={word.audioUrl} className="w-9 h-9" />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-white dark:bg-stone-900 rounded-xl ring-1 ring-stone-200 dark:ring-stone-700 p-3">
          <dt className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Grammar</dt>
          <dd className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">{describeTag(word.tag, word.verbForm) || '—'}</dd>
        </div>
        <div className="bg-white dark:bg-stone-900 rounded-xl ring-1 ring-stone-200 dark:ring-stone-700 p-3">
          <dt className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Root</dt>
          <dd className="mt-0.5">
            {word.root ? (
              <>
                <span className="font-quran-amiri text-lg font-bold text-emerald-900 dark:text-emerald-200">{formatRoot(word.root)}</span>
                {rootInfo && <span className="text-xs text-stone-500 dark:text-stone-400 ml-2">{rootInfo.n}× in the Quran</span>}
              </>
            ) : (
              <span className="text-stone-500 dark:text-stone-400">No root (particle or pronoun)</span>
            )}
          </dd>
        </div>
        <div className="bg-white dark:bg-stone-900 rounded-xl ring-1 ring-stone-200 dark:ring-stone-700 p-3">
          <dt className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Dictionary form</dt>
          <dd className="mt-0.5">
            <span className="font-quran-amiri text-lg font-bold text-stone-800 dark:text-stone-200">{word.lemma || '—'}</span>
            {lemmaCount ? <span className="text-xs text-stone-500 dark:text-stone-400 ml-2">{lemmaCount}× in the Quran</span> : null}
          </dd>
        </div>
      </dl>

      {word.root && onOpenRoot && (
        <button
          onClick={() => onOpenRoot(word.root!)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer"
        >
          <BookMarked className="w-3.5 h-3.5" />
          Explore every word from this root
        </button>
      )}

      {curatedToken && (
        <div className="overflow-x-auto">
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400 mb-2">
            Detailed segment annotation
          </div>
          <table className="w-full text-xs text-left ring-1 ring-stone-200 dark:ring-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold text-[11px]">
              <tr>
                <th className="p-2.5">Segment</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Arabic term</th>
                <th className="p-2.5">Explanation</th>
                <th className="p-2.5">Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {curatedToken.segments.map((seg, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-quran-amiri text-base font-bold text-emerald-950 dark:text-emerald-100">{seg.segmentArabic}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${seg.posColor}`}>
                      {seg.posLabel}
                    </span>
                  </td>
                  <td className="p-2.5 font-quran-amiri text-sm font-semibold text-emerald-900 dark:text-emerald-200 arabic-text">
                    {seg.arabicGrammarTerm}
                  </td>
                  <td className="p-2.5 text-stone-700 dark:text-stone-300 leading-relaxed">{seg.englishExplanation}</td>
                  <td className="p-2.5 text-stone-500 dark:text-stone-400 text-[11px]">{seg.caseOrMood || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
