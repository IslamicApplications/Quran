import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Layers } from 'lucide-react';
import { QuranWord, DifficultyLevel, Language, AppSettings, UserProgress, StudyList } from '../types';
import { VerseAudioBar } from './VerseAudioBar';
import { RecitedVerseText, useSampleVerse, useAsync, LoadingBlock, ErrorBlock, WordAudioButton, TagBadge } from './QuranWordBits';
import { buildStages, courseCardId, spokenView, DictionaryForm, wordTypeLabel, NEXT_COURSE_DECK } from './courseWords';
import { isDueForReview, calculateNextSRSReview } from '../services/storage';
import { getCoverageList, fetchWordAt, formatRoot, CoverageWord } from '../services/quranCom';
import { SURAH_LIST } from '../data/surahList';
import { isAnyModalOpen } from '../hooks/useModalBehavior';
import { useKnownLemmas } from '../hooks/useKnownLemmas';
import { loadSurahWords } from '../services/surahWords';

const RATINGS = [
  { confidence: 1, label: 'Forgot', style: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800' },
  { confidence: 2, label: 'Hard', style: 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/25 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900/60' },
  { confidence: 3, label: 'Okay', style: 'bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700' },
  { confidence: 4, label: 'Good', style: 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800' },
  { confidence: 5, label: 'Easy', style: 'bg-emerald-50 dark:bg-emerald-950/25 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800' }
];

const daysLabel = (days: number) => (days === 1 ? '1 day' : `${days} days`);

/** Deck ids for the 85% Course stages: "course-0" is Stage 1. */
const COURSE_DECK = /^course-(\d)$/;
/** Deck ids for one surah's words: "surah-36" is Ya-Sin. */
const SURAH_DECK = /^surah-(\d{1,3})$/;

/** A detailed lesson or one of the 85% Course words, rated on the same spaced repetition schedule. */
type Card = { kind: 'lesson'; id: string; word: QuranWord } | { kind: 'course'; id: string; word: CoverageWord };

const lessonCard = (word: QuranWord): Card => ({ kind: 'lesson', id: word.id, word });
const courseCard = (word: CoverageWord): Card => ({ kind: 'course', id: courseCardId(word.lemma), word });

/** The card's verse in full, following the recitation; the card's excerpt until it loads. */
const CardVerse: React.FC<{ verse: QuranWord['primaryVerse'] }> = ({ verse }) => {
  const sample = useSampleVerse(`${verse.surahNumber}:${verse.ayahNumber}`, verse.highlightedWord);
  const textClass = 'text-base sm:text-lg text-amber-100 text-right leading-relaxed';
  return (
    <>
      {sample ? (
        <RecitedVerseText verse={sample.verse} marked={sample.marked} className={textClass} />
      ) : (
        <p className={`font-quran-amiri arabic-text ${textClass}`}>{verse.arabicVerseText}</p>
      )}
      <p className="text-emerald-100 italic text-[11px]">"{sample?.verse.translation || verse.translation}"</p>
    </>
  );
};

const LessonFace: React.FC<{
  word: QuranWord;
  isFlipped: boolean;
  level: DifficultyLevel;
  language: Language;
  showTransliteration: boolean;
}> = ({ word, isFlipped, level, language, showTransliteration }) => {
  const explanation = word.explanations[level]?.[language] || word.explanations[level]?.en || word.explanations.beginner.en!;

  return !isFlipped ? (
    /* Front Content: Arabic, Transliteration, Root */
    <div className="my-auto text-center space-y-4 py-6">
      <div dir="rtl" className="font-quran-amiri text-6xl sm:text-8xl font-bold text-emerald-950 dark:text-emerald-100 text-center leading-snug">
        {word.arabic}
      </div>

      {showTransliteration && (
        <div className="text-xl font-semibold text-stone-700 dark:text-stone-300 tracking-wide">{word.transliteration}</div>
      )}

      <div className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs px-3 py-1 rounded-full">
        Root: <span className="font-quran-amiri font-bold text-emerald-900 dark:text-emerald-200">{word.rootArabic}</span> ({word.rootTransliteration})
      </div>
    </div>
  ) : (
    /* Back Content: Lexical Meaning, Verse Context, Audio */
    <div className="my-auto space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
      <div className="text-center border-b border-amber-200/80 dark:border-amber-900/60 pb-3">
        <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100 arabic-inline">{word.arabic}</div>
        <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">{word.transliteration}</div>
        <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 mt-1">{explanation.meaning}</p>
      </div>

      {/* Verse Context */}
      <div className="verse-panel rounded-xl p-3 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-emerald-300 text-[11px]">
          <span>
            Surah {word.primaryVerse.surahNameTransliteration} ({word.primaryVerse.surahNumber}:{word.primaryVerse.ayahNumber})
          </span>
          <span>{word.primaryVerse.surahNameArabic}</span>
        </div>
        <CardVerse verse={word.primaryVerse} />
      </div>

      {/* Audio Player in card back */}
      <VerseAudioBar verseKey={`${word.primaryVerse.surahNumber}:${word.primaryVerse.ayahNumber}`} />
    </div>
  );
};

/**
 * An 85% Course word: the form recited in its sample verse on the front, with its audio; the meaning, root and
 * the whole verse on the back. Meanings come from Quran.com's word-by-word gloss, as in the course itself.
 */
const CourseFace: React.FC<{ word: CoverageWord; isFlipped: boolean; showTransliteration: boolean }> = ({
  word,
  isFlipped,
  showTransliteration
}) => {
  const { data: loaded, error } = useAsync(() => fetchWordAt(word.sample), [word.sample]);
  // useAsync keeps the previous result while the next loads; never show one word's meaning or audio on another's card
  const data = loaded?.word?.location === word.sample ? loaded : undefined;
  const view = spokenView(word, data?.word, !!error && !data);
  const typeLabel = wordTypeLabel(word);
  const [s, a, w] = word.sample.split(':').map(Number);

  return !isFlipped ? (
    <div className="my-auto text-center space-y-4 py-6">
      <div dir="rtl" className="font-quran-amiri text-6xl sm:text-8xl font-bold text-emerald-950 dark:text-emerald-100 text-center leading-snug min-h-[1.4em]">
        {view.arabic ?? <span className="inline-block w-32 h-16 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse align-middle" />}
      </div>
      {view.differs && <DictionaryForm lemma={word.lemma} />}

      {showTransliteration && data?.word?.transliteration && (
        <div className="text-xl font-semibold text-stone-700 dark:text-stone-300 tracking-wide">{data.word.transliteration}</div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
        <WordAudioButton url={data?.word?.audioUrl} label="Play the word as recited" className="w-9 h-9" />
        {typeLabel ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 ring-sky-200 dark:ring-sky-800">
            {typeLabel}
          </span>
        ) : (
          <TagBadge tag={word.tag} />
        )}
        {word.root && (
          <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs px-3 py-1 rounded-full">
            Root: <span className="font-quran-amiri font-bold text-emerald-900 dark:text-emerald-200">{formatRoot(word.root)}</span>
          </span>
        )}
      </div>
    </div>
  ) : (
    <div className="my-auto space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
      <div className="text-center border-b border-amber-200/80 dark:border-amber-900/60 pb-3">
        <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100 arabic-inline">{view.arabic}</div>
        {data?.word?.transliteration && (
          <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">{data.word.transliteration}</div>
        )}
        <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 mt-1">
          {view.meaning === undefined ? '…' : view.meaning || 'Meaning unavailable offline'}
        </p>
        {view.dictionaryMeaning && (
          <div className="text-xs text-stone-500 dark:text-stone-400">
            <span className="font-quran-amiri text-sm font-bold text-stone-700 dark:text-stone-300">{word.lemma}</span> on its own:{' '}
            {view.dictionaryMeaning}
          </div>
        )}
      </div>

      {data && (
        <div className="verse-panel rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-emerald-300 text-[11px]">
            <span>
              Surah {SURAH_LIST[s - 1]?.nameTransliteration} ({s}:{a})
            </span>
            <span>{SURAH_LIST[s - 1]?.nameArabic}</span>
          </div>
          <RecitedVerseText
            verse={data.verse}
            marked={w - 1}
            className="text-base sm:text-lg text-amber-100 text-right leading-relaxed"
          />
          <p className="text-emerald-100 italic text-[11px]">"{data.verse.translation}"</p>
        </div>
      )}

      {data && <VerseAudioBar verseKey={data.verse.key} />}
    </div>
  );
};

interface FlashcardViewerProps {
  words: QuranWord[];
  level: DifficultyLevel;
  language: Language;
  settings: AppSettings;
  progressMap: Record<string, UserProgress>;
  studyLists: StudyList[];
  onRateWord: (wordId: string, confidence: number, wasCorrect: boolean) => void;
  initialFilterMode?: string;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  words,
  level,
  language,
  settings,
  progressMap,
  studyLists,
  onRateWord,
  initialFilterMode = 'all'
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'due' | string>(initialFilterMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Cards rated in this session: each is recorded once, even after going back to it
  const [ratedIds, setRatedIds] = useState<ReadonlySet<string>>(new Set());

  const course = useAsync(getCoverageList, []);
  const stages = useMemo(() => (course.data ? buildStages(course.data.words, course.data.totalWords) : []), [course.data]);
  const courseStage = COURSE_DECK.exec(filterMode);
  const surahNo = Number(SURAH_DECK.exec(filterMode)?.[1]) || undefined;
  const surahDeck = useAsync(() => (surahNo ? loadSurahWords(surahNo) : Promise.resolve(undefined)), [surahNo]);
  // While another surah loads, its predecessor's words would fill this deck
  const surahWords = surahNo && surahDeck.data?.surah === surahNo ? surahDeck.data.words : undefined;
  const known = useKnownLemmas();

  /** A course stage deck holds its due words first, then its unseen words; words scheduled for later wait. */
  const stageCards = (stageWords: CoverageWord[]) => {
    const due = stageWords.filter((w) => isDueForReview(progressMap[courseCardId(w.lemma)]));
    const unseen = stageWords.filter((w) => !progressMap[courseCardId(w.lemma)]);
    return [...due, ...unseen].map(courseCard);
  };

  // The deck is fixed when a filter is chosen. Rating a card moves its due date, so a live "due" filter
  // would drop the rated card mid-session, skip the next one and eventually index past the end.
  const nextStage = stages.find((stage) => stageCards(stage.words).length > 0) ?? stages[0];

  // Open the stage the learner is up to once the course has loaded
  useEffect(() => {
    if (filterMode === NEXT_COURSE_DECK && nextStage) setFilterMode(`course-${nextStage.index}`);
  }, [filterMode, nextStage]);

  const cards = useMemo<Card[]>(() => {
    if (courseStage) return stageCards(stages[Number(courseStage[1])]?.words ?? []);
    // A surah's words still to learn: those not marked known, due ones first, then unseen ones
    if (surahNo) return stageCards((surahWords ?? []).filter((w) => !known.has(w.lemma)));
    if (filterMode === 'due')
      return [
        ...words.filter((w) => isDueForReview(progressMap[w.id])).map(lessonCard),
        ...(course.data?.words ?? []).filter((w) => isDueForReview(progressMap[courseCardId(w.lemma)])).map(courseCard)
      ];
    const list = studyLists.find((l) => l.id === filterMode);
    return (list ? words.filter((w) => list.wordIds.includes(w.id)) : words).map(lessonCard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMode, words, studyLists, stages, surahWords]);

  const advanceTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Reset index when filter changes
  useEffect(() => {
    window.clearTimeout(advanceTimer.current);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRatedIds(new Set());
  }, [filterMode]);

  const currentCard: Card | undefined = cards[Math.min(currentIndex, cards.length - 1)];
  const hasRatedCurrent = !!currentCard && ratedIds.has(currentCard.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        !currentCard ||
        isAnyModalOpen() ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      )
        return;

      if (e.code === 'Space') {
        // Space on a focused button or link activates it
        if (['BUTTON', 'A'].includes(target.tagName)) return;
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (isFlipped && ['1', '2', '3', '4', '5'].includes(e.key)) {
        handleRating(Number(e.key));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // Re-bound on every render: the handlers it calls read the current card and rating state
  });

  const handleNext = () => {
    window.clearTimeout(advanceTimer.current);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    window.clearTimeout(advanceTimer.current);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleRating = (confidence: number) => {
    if (!currentCard || hasRatedCurrent) return;
    const wasCorrect = confidence >= 3;
    onRateWord(currentCard.id, confidence, wasCorrect);
    setRatedIds((prev) => new Set(prev).add(currentCard.id));

    // Auto advance after slight delay (cancelled if the learner navigates first)
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }
    }, 400);
  };

  const deckPicker = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card p-4">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
        <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">Spaced Repetition Flashcards</h2>
      </div>

      {/* Filter dropdown */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-medium">Deck:</span>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer max-w-[16rem]"
        >
          <option value="due">Due for Review Today</option>
          <optgroup label="85% Course words">
            {stages.length === 0 && <option disabled>Loading…</option>}
            {stages.map((stage) => (
              <option key={stage.index} value={`course-${stage.index}`}>
                Stage {stage.index + 1}: {stage.title} ({stageCards(stage.words).length} to study)
              </option>
            ))}
          </optgroup>
          <optgroup label="Words of a surah">
            {SURAH_LIST.map((s) => (
              <option key={s.number} value={`surah-${s.number}`}>
                {s.number}. {s.nameTransliteration}
                {surahNo === s.number && surahWords ? ` (${cards.length} to study)` : ''}
              </option>
            ))}
          </optgroup>
          <optgroup label="Detailed lessons">
            <option value="all">All Lesson Words ({words.length})</option>
            {studyLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title} ({list.wordIds.length})
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    </div>
  );

  // A course deck can't be built until the word list has loaded, and the next-stage deck until it is chosen.
  // Due lesson cards don't need the list, so a failed load still lets them be reviewed.
  const waitingForCourse = course.data
    ? filterMode === NEXT_COURSE_DECK && !!nextStage
    : !!courseStage || filterMode === NEXT_COURSE_DECK || (filterMode === 'due' && !course.error);
  const waitingForSurah = !!surahNo && !surahWords;
  if (waitingForSurah) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {deckPicker}
        <div className="card">
          {surahDeck.error && !surahDeck.loading ? (
            <ErrorBlock message="Could not load this surah's words." onRetry={surahDeck.retry} />
          ) : (
            <LoadingBlock label="Loading the surah's words…" />
          )}
        </div>
      </div>
    );
  }
  if (waitingForCourse || cards.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {deckPicker}
        {waitingForCourse && course.error ? (
          <div className="card">
            <ErrorBlock message="Could not load the course word list." onRetry={course.retry} />
          </div>
        ) : waitingForCourse ? (
          <div className="card">
            <LoadingBlock label="Loading course words…" />
          </div>
        ) : (
          <div className="card p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">All Reviews Completed!</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {filterMode === 'due'
                ? 'No flashcards are due for spaced repetition right now. Great job keeping up with your studies!'
                : courseStage
                ? 'Every word in this stage is scheduled for a later review. Its cards come back here when they are due.'
                : surahNo
                ? `You know every word of Surah ${SURAH_LIST[surahNo - 1]?.nameTransliteration}, or the rest are scheduled for a later review.`
                : 'No words match your selected filter.'}
            </p>
            {nextStage && filterMode !== `course-${nextStage.index}` && (
              <button
                onClick={() => setFilterMode(`course-${nextStage.index}`)}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Study 85% Course words
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const progress = progressMap[currentCard.id];
  const appearances = currentCard.kind === 'lesson' ? currentCard.word.frequencyInQuran : currentCard.word.appearances;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {deckPicker}

      {/* Progress Counter & Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span>
            Card {currentIndex + 1} of {cards.length}
            {currentCard.kind === 'course' && !progress && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">New</span>
            )}
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <span>
              Press <strong>Space</strong> to flip card
            </span>
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[360px] sm:min-h-[400px] w-full relative transition-transform duration-500 perspective-1000"
      >
        <div
          className={`w-full min-h-[360px] sm:min-h-[400px] card p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
            isFlipped ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60' : 'hover:border-emerald-700/40'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase tracking-wider">{isFlipped ? 'Back: Meaning & Context' : 'Front: Quranic Word'}</span>
            <div className="flex items-center gap-2">
              {progress && (
                <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded font-medium capitalize">
                  {progress.status} (Interval: {progress.intervalDays}d)
                </span>
              )}
              <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to Flip</span>
              </span>
            </div>
          </div>

          {currentCard.kind === 'lesson' ? (
            <LessonFace
              word={currentCard.word}
              isFlipped={isFlipped}
              level={level}
              language={language}
              showTransliteration={settings.showTransliteration}
            />
          ) : (
            <CourseFace word={currentCard.word} isFlipped={isFlipped} showTransliteration={settings.showTransliteration} />
          )}

          {/* Card Footer */}
          <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span>
              Quranic Frequency: <strong>{appearances.toLocaleString()} occurrences</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SRS Confidence Rating Buttons (Visible when flipped) */}
      {isFlipped && hasRatedCurrent && (
        <div className="card p-4 text-center text-xs text-stone-600 dark:text-stone-400 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-emerald-700 dark:text-emerald-300" />
          Saved. Next review in {daysLabel(progress?.intervalDays ?? 1)}.
          {currentIndex === cards.length - 1 && ' That was the last card in this deck.'}
        </div>
      )}

      {isFlipped && !hasRatedCurrent && (
        <div className="card p-4 space-y-2 animate-fadeIn">
          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 text-center">
            How well did you recall this word? (Press 1 - 5)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {RATINGS.map((r, i) => (
              <button
                key={r.confidence}
                onClick={() => handleRating(r.confidence)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${r.style} ${
                  i === RATINGS.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <span>
                  {r.confidence} - {r.label}
                </span>
                <span className="text-[10px] font-normal opacity-80">
                  Review in {daysLabel(calculateNextSRSReview(progress, currentCard.id, r.confidence, r.confidence >= 3).intervalDays)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentIndex > 0
              ? 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'View Front' : 'Flip to Reveal'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentIndex < cards.length - 1
              ? 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
