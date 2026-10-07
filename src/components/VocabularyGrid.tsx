import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { QuranWord, DifficultyLevel, Language, AppSettings, UserProgress } from '../types';
import { LessonCard } from './LessonCard';
import { useModalBehavior } from '../hooks/useModalBehavior';

const CATEGORY_LABELS: Record<QuranWord['category'], string> = {
  divine_names: 'Divine Names',
  core_theology: 'Core Theology',
  guidance_knowledge: 'Guidance',
  character_ethics: 'Character',
  worship_devotion: 'Worship',
  nature_creation: 'Creation',
  hereafter: 'Hereafter'
};

const STATUS_STYLES: Record<UserProgress['status'], string> = {
  mastered: 'bg-emerald-500',
  reviewing: 'bg-sky-500',
  learning: 'bg-amber-400',
  new: 'bg-stone-300'
};

const meaningOf = (word: QuranWord, level: DifficultyLevel, language: Language) =>
  word.explanations[level]?.[language]?.meaning ||
  word.explanations[level]?.en?.meaning ||
  word.explanations.beginner.en?.meaning ||
  '';

interface VocabularyGridProps {
  words: QuranWord[];
  level: DifficultyLevel;
  language: Language;
  savedWordIds: string[];
  progressMap: Record<string, UserProgress>;
  onOpen: (wordId: string) => void;
  onToggleSave: (wordId: string) => void;
}

export const VocabularyGrid: React.FC<VocabularyGridProps> = ({
  words,
  level,
  language,
  savedWordIds,
  progressMap,
  onOpen,
  onToggleSave
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {words.map((word) => {
      const saved = savedWordIds.includes(word.id);
      const progress = progressMap[word.id];
      return (
        <div
          key={word.id}
          role="button"
          tabIndex={0}
          onClick={() => onOpen(word.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(word.id))}
          className="card group relative p-5 flex flex-col gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5 dark:hover:shadow-black/30 focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
              {CATEGORY_LABELS[word.category] || word.category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(word.id);
              }}
              aria-label={saved ? 'Remove from saved words' : 'Save word'}
              aria-pressed={saved}
              className={`p-1.5 -m-1.5 rounded-lg transition-colors cursor-pointer ${
                saved
                  ? 'text-amber-500'
                  : 'text-stone-300 dark:text-stone-600 hover:text-amber-500 opacity-0 group-hover:opacity-100 focus:opacity-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">{word.transliteration}</div>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-snug line-clamp-2">
                {meaningOf(word, level, language)}
              </p>
            </div>
            <div dir="rtl" className="font-quran-amiri text-5xl font-bold text-emerald-900 dark:text-emerald-200 leading-tight shrink-0">
              {word.arabic}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-2">
              <span className="font-quran-amiri text-sm font-bold text-emerald-800 dark:text-emerald-300">{word.rootArabic}</span>
              <span>·</span>
              <span className="tabular-nums">{word.frequencyInQuran}× in the Quran</span>
            </span>
            {progress ? (
              <span className="flex items-center gap-1.5 capitalize font-semibold text-stone-600 dark:text-stone-300">
                <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[progress.status]}`} />
                {progress.status}
              </span>
            ) : (
              <ArrowUpRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-emerald-600 transition-colors" />
            )}
          </div>
        </div>
      );
    })}
  </div>
);

interface LessonDrawerProps {
  words: QuranWord[];
  wordId: string;
  onNavigate: (wordId: string) => void;
  onClose: () => void;
  level: DifficultyLevel;
  language: Language;
  settings: AppSettings;
  savedWordIds: string[];
  progressMap: Record<string, UserProgress>;
  onToggleSave: (wordId: string) => void;
  onRateSRS: (wordId: string, confidence: number, wasCorrect: boolean) => void;
  onOpenComparison: (wordId: string) => void;
}

/** Full lesson in a side panel (bottom sheet on small screens), with previous/next through the current list. */
export const LessonDrawer: React.FC<LessonDrawerProps> = ({
  words,
  wordId,
  onNavigate,
  onClose,
  level,
  language,
  settings,
  savedWordIds,
  progressMap,
  onToggleSave,
  onRateSRS,
  onOpenComparison
}) => {
  const isTopModal = useModalBehavior(true, onClose);
  const index = words.findIndex((w) => w.id === wordId);
  const word = words[index];
  const prev = index > 0 ? words[index - 1] : undefined;
  const next = index >= 0 && index < words.length - 1 ? words[index + 1] : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isTopModal() || (e.target as HTMLElement).closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft' && prev) onNavigate(prev.id);
      if (e.key === 'ArrowRight' && next) onNavigate(next.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onNavigate, isTopModal]);

  useEffect(() => {
    document.getElementById('lesson-drawer-body')?.scrollTo({ top: 0 });
  }, [wordId]);

  if (!word) return null;

  const navButton = 'p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer';

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Lesson: ${word.transliteration}`}>
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 top-10 sm:top-0 sm:left-auto sm:w-[min(760px,92vw)] bg-[var(--surface-page)] shadow-2xl flex flex-col rounded-t-3xl sm:rounded-none animate-slide-in-right">
        <div className="h-14 shrink-0 px-3 sm:px-4 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800">
          <div className="flex items-center gap-1">
            <button onClick={() => prev && onNavigate(prev.id)} disabled={!prev} className={navButton} aria-label="Previous lesson">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => next && onNavigate(next.id)} disabled={!next} className={navButton} aria-label="Next lesson">
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums ms-1">
              {index + 1} of {words.length}
            </span>
          </div>
          <button onClick={onClose} className={navButton} aria-label="Close lesson">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div id="lesson-drawer-body" className="flex-1 overflow-y-auto p-3 sm:p-6">
          <LessonCard
            key={word.id}
            word={word}
            level={level}
            language={language}
            settings={settings}
            isSaved={savedWordIds.includes(word.id)}
            progress={progressMap[word.id]}
            onToggleSave={onToggleSave}
            onRateSRS={onRateSRS}
            onOpenComparison={onOpenComparison}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
