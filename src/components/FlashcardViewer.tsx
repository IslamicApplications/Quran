import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { QuranWord, DifficultyLevel, Language, AppSettings, UserProgress, StudyList } from '../types';
import { VerseAudioBar } from './VerseAudioBar';
import { RecitedVerseText, useSampleVerse } from './QuranWordBits';
import { isDueForReview } from '../services/storage';

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
  const [hasRatedCurrent, setHasRatedCurrent] = useState(false);

  // The deck is fixed when a filter is chosen. Rating a card moves its due date, so a live "due" filter
  // would drop the rated card mid-session, skip the next one and eventually index past the end.
  const filteredWords = useMemo(
    () =>
      words.filter((w) => {
        if (filterMode === 'all') return true;
        if (filterMode === 'due') return isDueForReview(progressMap[w.id]);
        // Filter by study list
        const list = studyLists.find((l) => l.id === filterMode);
        return list ? list.wordIds.includes(w.id) : true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterMode, words, studyLists]
  );

  const advanceTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Reset index when filter changes
  useEffect(() => {
    window.clearTimeout(advanceTimer.current);
    setCurrentIndex(0);
    setIsFlipped(false);
    setHasRatedCurrent(false);
  }, [filterMode]);

  const currentWord = filteredWords[Math.min(currentIndex, filteredWords.length - 1)];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (isFlipped && ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
        const rating = parseInt(e.code.replace('Digit', ''), 10);
        handleRating(rating);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, filteredWords]);

  const handleNext = () => {
    window.clearTimeout(advanceTimer.current);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex((prev) => Math.min(prev + 1, filteredWords.length - 1));
      setIsFlipped(false);
      setHasRatedCurrent(false);
    }
  };

  const handlePrev = () => {
    window.clearTimeout(advanceTimer.current);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setHasRatedCurrent(false);
    }
  };

  const handleRating = (confidence: number) => {
    if (!currentWord) return;
    const wasCorrect = confidence >= 3;
    onRateWord(currentWord.id, confidence, wasCorrect);
    setHasRatedCurrent(true);

    // Auto advance after slight delay (cancelled if the learner navigates first)
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (currentIndex < filteredWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setHasRatedCurrent(false);
      }
    }, 400);
  };

  if (filteredWords.length === 0) {
    return (
      <div className="card p-10 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">All Reviews Completed!</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {filterMode === 'due'
            ? 'No flashcards are due for spaced repetition right now. Great job keeping up with your studies!'
            : 'No words match your selected filter.'}
        </p>
        <button
          onClick={() => setFilterMode('all')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          Review All {words.length} Vocabulary Words
        </button>
      </div>
    );
  }

  const explanation =
    currentWord.explanations[level]?.[language] ||
    currentWord.explanations[level]?.en ||
    currentWord.explanations.beginner.en!;

  const progress = progressMap[currentWord.id];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Controls & Filter Selector */}
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
            className="px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="all">All Words ({words.length})</option>
            <option value="due">Due for Review Today</option>
            {studyLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title} ({list.wordIds.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Counter & Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span>
            Card {currentIndex + 1} of {filteredWords.length}
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <span>Press <strong>Space</strong> to flip card</span>
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
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
            <span className="uppercase tracking-wider">
              {isFlipped ? 'Back: Meaning & Context' : 'Front: Quranic Word'}
            </span>
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

          {/* Front Content: Arabic, Transliteration, Root */}
          {!isFlipped ? (
            <div className="my-auto text-center space-y-4 py-6">
              <div dir="rtl" className="font-quran-amiri text-6xl sm:text-8xl font-bold text-emerald-950 dark:text-emerald-100 text-center leading-snug">
                {currentWord.arabic}
              </div>

              {settings.showTransliteration && (
                <div className="text-xl font-semibold text-stone-700 dark:text-stone-300 tracking-wide">
                  {currentWord.transliteration}
                </div>
              )}

              <div className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs px-3 py-1 rounded-full">
                Root: <span className="font-quran-amiri font-bold text-emerald-900 dark:text-emerald-200">{currentWord.rootArabic}</span> ({currentWord.rootTransliteration})
              </div>
            </div>
          ) : (
            /* Back Content: Lexical Meaning, Verse Context, Audio */
            <div className="my-auto space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
              <div className="text-center border-b border-amber-200/80 dark:border-amber-900/60 pb-3">
                <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100 arabic-inline">
                  {currentWord.arabic}
                </div>
                <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">{currentWord.transliteration}</div>
                <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 mt-1">
                  {explanation.meaning}
                </p>
              </div>

              {/* Verse Context */}
              <div className="verse-panel rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                  <span>Surah {currentWord.primaryVerse.surahNameTransliteration} ({currentWord.primaryVerse.surahNumber}:{currentWord.primaryVerse.ayahNumber})</span>
                  <span>{currentWord.primaryVerse.surahNameArabic}</span>
                </div>
                <CardVerse verse={currentWord.primaryVerse} />
              </div>

              {/* Audio Player in card back */}
              <VerseAudioBar verseKey={`${currentWord.primaryVerse.surahNumber}:${currentWord.primaryVerse.ayahNumber}`} />
            </div>
          )}

          {/* Card Footer */}
          <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span>Quranic Frequency: <strong>{currentWord.frequencyInQuran} occurrences</strong></span>
          </div>
        </div>
      </div>

      {/* SRS Confidence Rating Buttons (Visible when flipped) */}
      {isFlipped && (
        <div className="card p-4 space-y-2 animate-fadeIn">
          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 text-center">
            How well did you recall this word? (Press 1 - 5)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleRating(1)}
              className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-900 dark:text-rose-200 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all cursor-pointer flex flex-col items-center gap-0.5"
            >
              <span>1 - Forgot / Again</span>
              <span className="text-[10px] text-rose-700 dark:text-rose-300 font-normal">Review in 1 day</span>
            </button>
            <button
              onClick={() => handleRating(2)}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/25 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-900/60 transition-all cursor-pointer flex flex-col items-center gap-0.5"
            >
              <span>2 - Hard</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-normal">Review in 2 days</span>
            </button>
            <button
              onClick={() => handleRating(4)}
              className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-900 dark:text-sky-200 text-xs font-bold border border-sky-200 dark:border-sky-800 transition-all cursor-pointer flex flex-col items-center gap-0.5"
            >
              <span>4 - Good</span>
              <span className="text-[10px] text-sky-700 dark:text-sky-300 font-normal">Review in 4 days</span>
            </button>
            <button
              onClick={() => handleRating(5)}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer flex flex-col items-center gap-0.5"
            >
              <span>5 - Perfect</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-normal">Mastered interval</span>
            </button>
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
          disabled={currentIndex === filteredWords.length - 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentIndex < filteredWords.length - 1
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
