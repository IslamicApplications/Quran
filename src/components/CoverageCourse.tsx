import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Target, Check, Play, X, Eye, RotateCcw, Trophy, EyeOff } from 'lucide-react';
import { getCoverageList, fetchWordAt, formatRoot, CoverageWord } from '../services/quranCom';
import { SURAH_LIST } from '../data/surahList';
import { useKnownLemmas, knownLemmasStore } from '../hooks/useKnownLemmas';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { LoadingBlock, ErrorBlock, useAsync, WordAudioButton, TagBadge, RecitedVerseText } from './QuranWordBits';
import { VerseAudioBar } from './VerseAudioBar';
import { MILESTONES, buildStages, spokenView, DictionaryForm, wordTypeLabel } from './courseWords';

interface CoverageCourseProps {
  onOpenVerse?: (verseKey: string) => void;
}

const UNIT_SIZE = 20;

const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

export const CoverageCourse: React.FC<CoverageCourseProps> = ({ onOpenVerse }) => {
  const { data, loading, error, retry } = useAsync(getCoverageList, []);
  const known = useKnownLemmas();
  const [stageIndex, setStageIndex] = useState(0);
  const [unitIndex, setUnitIndex] = useState(0);
  const [hideKnown, setHideKnown] = useState(false);
  const [studyWords, setStudyWords] = useState<CoverageWord[] | null>(null);

  const stages = useMemo(() => (data ? buildStages(data.words, data.totalWords) : []), [data]);

  // Start where the learner left off: first stage/unit that still has unknown words
  useEffect(() => {
    if (!stages.length) return;
    for (const stage of stages) {
      const units = chunk(stage.words, UNIT_SIZE);
      const u = units.findIndex((unit) => unit.some((w) => !known.has(w.lemma)));
      if (u !== -1) {
        setStageIndex(stage.index);
        setUnitIndex(u);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages]);

  const toggleKnown = knownLemmasStore.toggle;

  if (loading) return <div className="card"><LoadingBlock label="Loading course…" /></div>;
  if (error || !data) return <div className="card"><ErrorBlock message="Could not load the course word list." onRetry={retry} /></div>;

  const knownWords = data.words.filter((w) => known.has(w.lemma));
  const coveragePercent = (knownWords.reduce((sum, w) => sum + w.count, 0) / data.totalWords) * 100;

  const stage = stages[stageIndex];
  const units = chunk(stage.words, UNIT_SIZE);
  const unit = units[Math.min(unitIndex, units.length - 1)];
  const visible = hideKnown ? unit.filter((w) => !known.has(w.lemma)) : unit;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview */}
      <section className="relative overflow-hidden rounded-3xl hero-surface p-6 sm:p-8 shadow-xl shadow-emerald-950/10">
        <div className="absolute inset-0 geo-pattern" aria-hidden />
        <div className="relative space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                Frequency-based course
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">The 85% Course</h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Just {data.words.length.toLocaleString()} words make up 85% of the Quran’s{' '}
                {data.totalWords.toLocaleString()} words. Learn them in order of frequency, and every word you mark
                as known adds to how much of the Quran you can recognise.
              </p>
            </div>
            <div className="shrink-0 text-left md:text-right">
              <div className="text-4xl sm:text-5xl font-extrabold tabular-nums text-amber-300">
                {coveragePercent.toFixed(1)}%
              </div>
              <div className="text-xs text-emerald-200">
                of the Quran’s words · {knownWords.length} / {data.words.length} known
              </div>
            </div>
          </div>

          {/* Coverage bar with milestones */}
          <div className="pt-5 pb-5">
            <div className="relative h-3 rounded-full bg-emerald-950/60 ring-1 ring-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(coveragePercent, 100)}%` }}
              />
              {MILESTONES.map((m, i) => {
                // Alternate labels above/below the bar so close milestones (80%, 85%) never overlap
                const below = i % 2 === 1;
                const label = (
                  <div
                    className={`text-[10px] font-bold ${coveragePercent >= m.percent ? 'text-amber-300' : 'text-emerald-300/70'}`}
                  >
                    {m.percent}%
                  </div>
                );
                return (
                  <div
                    key={m.percent}
                    className={`absolute -translate-x-1/2 flex flex-col items-center ${below ? 'top-0' : '-top-5'}`}
                    style={{ left: `${m.percent}%` }}
                  >
                    {!below && label}
                    <div className="w-px h-5 bg-white/25 dark:bg-stone-900/25" />
                    {below && label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stage selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((s) => {
          const done = s.words.filter((w) => known.has(w.lemma)).length;
          const active = s.index === stageIndex;
          return (
            <button
              key={s.index}
              onClick={() => {
                setStageIndex(s.index);
                setUnitIndex(0);
              }}
              aria-pressed={active}
              className={`text-left p-4 rounded-2xl transition-all cursor-pointer ring-1 ${
                active ? 'bg-white dark:bg-stone-900 ring-2 ring-emerald-600 shadow-sm' : 'bg-white/60 dark:bg-stone-900/60 ring-stone-200 dark:ring-stone-700 hover:bg-white dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.08em]">
                <span className={active ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-400'}>Stage {s.index + 1}</span>
                <span className="text-amber-600 dark:text-amber-400">{s.percent}%</span>
              </div>
              <div className="font-bold text-stone-900 dark:text-stone-100 mt-1">{s.title}</div>
              <div className="mt-2 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-emerald-600 transition-all" style={{ width: `${(done / s.words.length) * 100}%` }} />
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 tabular-nums">
                {done} / {s.words.length} words
              </div>
            </button>
          );
        })}
      </div>

      {/* Unit view */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100">
              Stage {stage.index + 1}: {stage.title}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{stage.blurb}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHideKnown(!hideKnown)}
              aria-pressed={hideKnown}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold ring-1 cursor-pointer ${
                hideKnown ? 'bg-emerald-50 dark:bg-emerald-950/25 ring-emerald-300 dark:ring-emerald-700 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              Hide known
            </button>
            <button
              onClick={() => {
                const unknown = unit.filter((w) => !known.has(w.lemma));
                setStudyWords(unknown.length ? unknown : unit);
              }}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Study this unit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
          {units.map((u, i) => {
            const complete = u.every((w) => known.has(w.lemma));
            const active = i === unitIndex;
            return (
              <button
                key={i}
                onClick={() => setUnitIndex(i)}
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  active ? 'bg-emerald-900 text-white dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                {complete && <Check className={`w-3 h-3 ${active ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />}
                Unit {i + 1}
                <span className={active ? 'text-emerald-200' : 'text-stone-400'}>
                  #{u[0].rank}–{u[u.length - 1].rank}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">You know every word in this unit.</p>
            {unitIndex < units.length - 1 && (
              <button
                onClick={() => setUnitIndex(unitIndex + 1)}
                className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
              >
                Next unit →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visible.map((w) => (
              <CourseWordCard
                key={w.lemma}
                word={w}
                isKnown={known.has(w.lemma)}
                onToggleKnown={() => toggleKnown(w.lemma)}
                onOpenVerse={onOpenVerse}
              />
            ))}
          </div>
        )}
        <p className="text-[11px] text-stone-400">
          Particles and pronouns show their dictionary meaning; other words show their meaning in a sample verse, which may vary with context.
        </p>
      </div>

      <p className="text-[11px] text-stone-400 text-center">
        Word frequencies &amp; roots: Quranic Arabic Corpus (GPL-3.0) · Meanings &amp; audio: Quran.com
      </p>

      {studyWords &&
        createPortal(
          <StudySession
            words={studyWords}
            onClose={() => setStudyWords(null)}
            onMarkKnown={knownLemmasStore.add}
          />,
          document.body
        )}
    </div>
  );
};

const CourseWordCard: React.FC<{
  word: CoverageWord;
  isKnown: boolean;
  onToggleKnown: () => void;
  onOpenVerse?: (key: string) => void;
}> = ({ word, isKnown, onToggleKnown, onOpenVerse }) => {
  const { data, error } = useAsync(() => fetchWordAt(word.sample), [word.sample]);
  const [s, a] = word.sample.split(':').map(Number);
  const typeLabel = wordTypeLabel(word);
  const view = spokenView(word, data?.word, !!error);
  const skeleton = (width: string) => <span className={`inline-block ${width} h-4 rounded bg-stone-100 dark:bg-stone-800 animate-pulse`} />;

  return (
    <div
      className={`relative rounded-2xl p-4 ring-1 transition-all flex flex-col gap-3 ${
        isKnown ? 'bg-emerald-50/50 dark:bg-emerald-950/25 ring-emerald-200 dark:ring-emerald-800' : 'bg-white dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 hover:ring-emerald-300 dark:hover:ring-emerald-700'
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-stone-400 tabular-nums">#{word.rank}</span>
        <span className="font-semibold text-stone-500 dark:text-stone-400 tabular-nums">{word.appearances.toLocaleString()}× in the Quran</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug">
            {view.meaning ?? skeleton('w-24')}
          </div>
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {typeLabel ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 ring-sky-200 dark:ring-sky-800">
                {typeLabel}
              </span>
            ) : (
              <TagBadge tag={word.tag} />
            )}
            {word.root && (
              <span className="text-[11px] font-quran-amiri font-bold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-2 rounded-full">
                {formatRoot(word.root)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100 leading-relaxed" dir="rtl">
            {view.arabic ?? skeleton('w-12 my-3')}
          </div>
          {view.differs && <DictionaryForm lemma={word.lemma} />}
        </div>
      </div>
      {view.dictionaryMeaning && (
        <div className="-mt-1 text-[11px] text-stone-500 dark:text-stone-400">
          <span className="font-quran-amiri text-sm font-bold text-stone-700 dark:text-stone-300">{word.lemma}</span> on its own:{' '}
          {view.dictionaryMeaning}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2 min-w-0">
          <WordAudioButton url={data?.word?.audioUrl} label="Play the word as recited in the verse" />
          {onOpenVerse && (
            <button
              onClick={() => onOpenVerse(`${s}:${a}`)}
              className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 truncate cursor-pointer"
              title="See this word in its verse"
            >
              {SURAH_LIST[s - 1]?.nameTransliteration} {s}:{a} →
            </button>
          )}
        </div>
        <button
          onClick={onToggleKnown}
          aria-pressed={isKnown}
          className={`shrink-0 inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            isKnown ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          {isKnown ? 'Known' : 'Mark known'}
        </button>
      </div>
    </div>
  );
};

const StudySession: React.FC<{
  words: CoverageWord[];
  onClose: () => void;
  onMarkKnown: (lemma: string) => void;
}> = ({ words, onClose, onMarkKnown }) => {
  useModalBehavior(true, onClose);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [learned, setLearned] = useState(0);
  const finished = index >= words.length;
  const word = words[Math.min(index, words.length - 1)];
  const { data: loaded, error } = useAsync(() => fetchWordAt(word.sample), [word.sample]);
  // useAsync keeps the previous result while the next loads; never show one word's meaning or audio on another's card
  const data = loaded?.word?.location === word.sample ? loaded : undefined;
  const view = spokenView(word, data?.word, !!error && !data);

  const answer =(knowsIt: boolean) => {
    if (knowsIt) {
      onMarkKnown(word.lemma);
      setLearned((n) => n + 1);
    }
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && (e.key === '1' || e.key === 'ArrowLeft')) answer(false);
      else if (revealed && (e.key === '2' || e.key === 'ArrowRight')) answer(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const targetIndex = Number(word.sample.split(':')[2]) - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm animate-fadeIn flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Study unit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in space-y-5"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
            {finished ? 'Done' : `${index + 1} of ${words.length}`}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${(index / words.length) * 100}%` }} />
        </div>

        {finished ? (
          <div className="text-center space-y-4 py-6">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
            <div>
              <div className="text-xl font-bold text-stone-900 dark:text-stone-100">Unit reviewed</div>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                You marked {learned} of {words.length} words as known.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setIndex(0);
                  setLearned(0);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-sm font-semibold text-white cursor-pointer"
              >
                Finish
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3 py-4">
              <div className="font-quran-amiri text-6xl font-bold text-emerald-950 dark:text-emerald-100 leading-snug min-h-[1.4em]" dir="rtl">
                {view.arabic ?? <span className="inline-block w-24 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse align-middle" />}
              </div>
              {view.differs && <DictionaryForm lemma={word.lemma} />}
              <div className="flex justify-center">
                <WordAudioButton url={data?.word?.audioUrl} className="w-9 h-9" />
              </div>
            </div>

            {revealed ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-center">
                  <div className="text-lg font-bold text-stone-900 dark:text-stone-100">{view.meaning ?? '…'}</div>
                  {view.dictionaryMeaning && (
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-quran-amiri text-sm font-bold text-stone-700 dark:text-stone-300">{word.lemma}</span> on its own:{' '}
                      {view.dictionaryMeaning}
                    </div>
                  )}
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    {word.appearances.toLocaleString()}× in the Quran{word.root ? ` · root ${formatRoot(word.root)}` : ''}
                  </div>
                </div>
                {data && (
                  <div className="verse-panel rounded-2xl p-4 space-y-2">
                    <RecitedVerseText verse={data.verse} marked={targetIndex} className="text-xl leading-loose text-amber-50" />
                    <p className="text-xs text-emerald-100/90 italic">
                      “{data.verse.translation}” ({data.verse.key})
                    </p>
                  </div>
                )}
                {/* Full recitation of the sample verse; stops when the learner moves to the next word */}
                {data && <VerseAudioBar verseKey={data.verse.key} />}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => answer(false)}
                    className="py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/25 text-amber-900 dark:text-amber-200 text-sm font-bold cursor-pointer"
                  >
                    Still learning <span className="text-amber-700/60 dark:text-amber-300 font-normal">(1)</span>
                  </button>
                  <button
                    onClick={() => answer(true)}
                    className="py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold cursor-pointer"
                  >
                    I know it <span className="text-emerald-100/90 font-normal">(2)</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm font-bold text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                <Eye className="w-4 h-4" /> Show meaning <span className="text-stone-400 font-normal">(Space)</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
